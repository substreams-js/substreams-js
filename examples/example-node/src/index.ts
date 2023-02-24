import { createGrpcTransport } from "@bufbuild/connect-node";
import { Substream } from "@enzymefinance/substreams";

const ENDPOINT = "https://mainnet.eth.streamingfast.io";
const BEARER = process.env.SUBSTREAMS_API_TOKEN; // Add your api token here
const SUBSTREAM =
  "https://github.com/pinax-network/subtivity-substreams/releases/download/v0.1.0/subtivity-ethereum-v0.1.0.spkg";
const MODULE = "db_out";
const STOP = "+100";

async function fetchSubstream(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const array = await blob.arrayBuffer();

  return new Substream(new Uint8Array(array));
}

const substream = await fetchSubstream(SUBSTREAM);
const stream = substream.streamBlocks({
  request: substream.createRequest(MODULE, {
    stopBlockNum: STOP,
  }),
  transport: createGrpcTransport({
    baseUrl: ENDPOINT,
    httpVersion: "2",
  }),
  options: {
    headers: {
      Authorization: BEARER,
    },
  },
});

for await (const response of stream) {
  console.log(response.toJson({ typeRegistry: substream.registry }));
}
