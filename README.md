# SubstreamsJS

[![CI](https://github.com/substreams-js/substreams-js/actions/workflows/on-push-to-main.yaml/badge.svg)](https://github.com/substreams-js/substreams-js/actions/workflows/on-push-to-main.yaml)
[![License: MIT](https://img.shields.io/github/license/substreams-js/substreams-js)](/LICENSE)

TypeScript library for consuming [Substreams](https://substreams.streamingfast.io/) suitable for web browsers, Node.js and alternative runtimes.

```typescript
import { createGrpcTransport } from "@connectrpc/connect-node";
import {
  createAuthInterceptor,
  createRegistry,
  createRequest,
  fetchSubstream,
  isEmptyMessage,
  streamBlocks,
  unpackMapOutput,
} from "@substreams/core";

const SUBSTREAM = "https://github.com/streamingfast/substreams-uniswap-v3/releases/download/v0.2.7/substreams.spkg";
const MODULE = "map_pools_created";

const substream = await fetchSubstream(SUBSTREAM);
const registry = createRegistry(substream);
const transport = createGrpcTransport({
  baseUrl: "https://mainnet.eth.streamingfast.io",
  httpVersion: "2",
  interceptors: [createAuthInterceptor("<YOUR TOKEN>")],
  jsonOptions: {
    typeRegistry: registry,
  },
});

const request = createRequest({
  substreamPackage: substream,
  outputModule: MODULE,
  productionMode: true,
  stopBlockNum: "+10000",
});

for await (const response of streamBlocks(transport, request)) {
  const output = unpackMapOutput(response.response, registry);
  if (output !== undefined && !isEmptyMessage(output)) {
    console.dir(output.toJson({ typeRegistry: registry }));
  }
}
```

## Installation

> **Note**
> This library is pure [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and no longer provides CommonJS (CJS) exports. If your project uses CommonJS, you will have to [convert to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) or use the [dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) function. Please don't open issues for questions regarding CommonJS / ESM.

```bash
# Using pnpm
pnpm add @substreams/core

# Using yarn
yarn add @substreams/core

# Using npm
npm install @substreams/core
```

## Packages

- [@substreams/core](https://www.npmjs.com/package/@substreams/core):
  Provides all core functionality for interacting with substreams packages and consuming substream modules. ([source code](packages/core)).
- [@substreams/manifest](https://www.npmjs.com/package/@substreams/manifest):
  Parses and validates `substreams.yaml` manifests and bundles them into substream packages. ([source code](packages/manifest)).
- [@substreams/mermaid](https://www.npmjs.com/package/@substreams/mermaid):
  Generates mermaid graph visualizations of substream module graphs. ([source code](packages/mermaid)).
- [@substreams/react](https://www.npmjs.com/package/@substreams/react):
  Lightweight utilities for building React based user interfaces on top of substreams. ([source code](packages/react)).

## Authors

- [@fubhy](https://github.com/fubhy) (fubhy.eth, [Twitter](https://twitter.com/thefubhy))

## License

[MIT](/LICENSE) License
