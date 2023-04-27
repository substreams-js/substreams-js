import { createServer } from "node:http";
import { connectNodeAdapter, createGrpcTransport } from "@bufbuild/connect-node";
import { createSubstreamsProxy } from "./proxy.js";

if (process.env.SUBSTREAMS_API_TOKEN === undefined) {
  throw new Error('Missing "SUBSTREAMS_API_TOKEN" environment variable');
}

const PORT = 3030;
const ENDPOINT = "https://mainnet.eth.streamingfast.io";
const BEARER = process.env.SUBSTREAMS_API_TOKEN;

const transport = createGrpcTransport({
  baseUrl: ENDPOINT,
  httpVersion: "2",
});

const handler = connectNodeAdapter({
  routes: createSubstreamsProxy(transport, () => ({
    headers: {
      Authorization: BEARER,
    },
  })),
});

const corsAllowHeaders = [
  "Content-Type",
  // gRPC-web
  "X-User-Agent",
  "X-Grpc-Web",
  "Grpc-Timeout",
  // Connect
  "Connect-Protocol-Version",
  "Connect-Timeout-Ms",
];

const corsExposeHeaders = [
  // gRPC-web
  "Grpc-Status",
  "Grpc-Message",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // NOTE: You probably do not want to ship this to production.
  "Access-Control-Allow-Methods": "OPTIONS, POST",
  "Access-Control-Allow-Headers": corsAllowHeaders.join(", "),
  "Access-Control-Expose-Headers": corsExposeHeaders.join(", "),
  "Access-Control-Max-Age": 2 * 3600,
};

createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();

    return;
  }

  for (const [key, value] of Object.entries(corsHeaders)) {
    res.setHeader(key, value);
  }

  handler(req, res);
}).listen(PORT, () => {
  console.log(`Proxy listening at http://localhost:${PORT}`);
});
