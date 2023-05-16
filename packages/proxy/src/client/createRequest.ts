import { ProxyRequest } from "../proto/substreams/proxy/v1/proxy_pb.js";
import { type CreateRequestOptions, createRequest as createRequestBase } from "@substreams/core";

export function createRequest(options: CreateRequestOptions) {
  const request = new ProxyRequest(createRequestBase(options));
  request.package = options.substreamPackage;

  return request;
}
