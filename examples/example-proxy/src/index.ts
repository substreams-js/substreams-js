import http from "node:http";
import {
  connectNodeAdapter,
  createGrpcTransport,
} from "@bufbuild/connect-node";
import { createSubstreamsProxy } from "./proxy";

const PORT = 8080;
const ENDPOINT = "https://mainnet.eth.streamingfast.io";
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const BEARER = process.env.SUBSTREAMS_API_TOKEN!; // Add your api token here

const transport = createGrpcTransport({
  baseUrl: ENDPOINT,
  httpVersion: "2",
});

const routes = createSubstreamsProxy(transport, () => ({
  headers: {
    Authorization: BEARER,
  },
}));

http.createServer(connectNodeAdapter({ routes })).listen(PORT, () => {
  console.log(`Proxy listening at http://localhost:${PORT}`);
});
