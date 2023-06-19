import { createProxyRoutes } from "./createProxyRoutes.js";
import type { Transport } from "@bufbuild/connect";
import { connectNodeAdapter } from "@bufbuild/connect-node";
import type { Http2ServerRequest, Http2ServerResponse, OutgoingHttpHeaders } from "node:http2";

export const defaultCorsAllowHeaders = [
  "Authorization",
  "Content-Type",
  "X-User-Agent",
  "X-Grpc-Web",
  "Grpc-Timeout",
  "Connect-Protocol-Version",
  "Connect-Timeout-Ms",
] as const;

export const defaultCorsExposeHeaders = [
  "Accept",
  "Accept-Encoding",
  "Accept-Post",
  "Connect-Accept-Encoding",
  "Connect-Content-Encoding",
  "Content-Encoding",
  "Grpc-Accept-Encoding",
  "Grpc-Encoding",
  "Grpc-Message",
  "Grpc-Status",
  "Grpc-Status-Details-Bin",
] as const;

export const defaultCorsHeaders = {
  "Access-Control-Allow-Origin": "*", // NOTE: You probably do not want to ship this to production.
  "Access-Control-Allow-Methods": "OPTIONS, POST",
  "Access-Control-Allow-Headers": defaultCorsAllowHeaders.join(", "),
  "Access-Control-Expose-Headers": defaultCorsExposeHeaders.join(", "),
  "Access-Control-Max-Age": `${2 * 3600}`,
} as const;

export type CreateProxyHandlerOptions = {
  substreamsTransport: Transport;
  substreamsToken?: string | undefined;
  corsEnabled?: boolean | undefined;
  corsHeaders?: OutgoingHttpHeaders | ((req: Http2ServerRequest) => OutgoingHttpHeaders) | undefined;
};

export function createProxyHandler({
  substreamsTransport,
  corsHeaders = defaultCorsHeaders,
  corsEnabled = true,
}: CreateProxyHandlerOptions) {
  return (req: Http2ServerRequest, res: Http2ServerResponse) => {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      res.writeHead(405).end();
      return;
    }

    if (corsEnabled) {
      const resolvedCorsHeaders = typeof corsHeaders === "function" ? corsHeaders(req) : corsHeaders;
      if (resolvedCorsHeaders !== undefined) {
        for (const [key, value] of Object.entries(resolvedCorsHeaders)) {
          if (value !== undefined) {
            res.setHeader(key, value);
          }
        }
      }
    }

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    // Only support binary format.
    const ctype = req.headers["content-type"];
    if (ctype === "application/json" || ctype === "application/connect+json" || ctype === "application/grpc-web-text") {
      res.writeHead(400).end();
      return;
    }

    const controller = new AbortController();
    const handler = connectNodeAdapter({
      routes: createProxyRoutes(substreamsTransport, (ctx) => {
        // Allow users to provide their own auth token.
        const auth = ctx.requestHeader.get("Authorization") ?? undefined;
        const headers =
          auth === undefined
            ? {}
            : {
                Authorization: auth,
              };

        return {
          signal: controller.signal,
          headers,
        };
      }),
    });

    // Abort the substream request when the client disconnects.
    req.on("close", () => controller.abort());
    req.on("end", () => controller.abort());

    return handler(req, res);
  };
}
