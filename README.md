# substreams-es

## Prerequisites

- [Node.js](https://www.nodejs.org) (>= v18.3.0)
- [pnpm](https://pnpm.io) (>= 7.26.0)

## Quickstart

Please refer to https://substreams.streamingfast.io/getting-started/quickstart for how to obtain a substreams api token.

```sh
# Export your api token.
export SUBSTREAMS_API_TOKEN=<your token>

# Install npm dependencies.
pnpm install
```

### Web

For the web example (using a [Connect](https://connect.build/) proxy), run this command:

```sh
pnpm start:web
```

You should now be able to access http://localhost:3000.

### Node

For the standalone node example, run this command:

```sh
pnpm start:node
```
