import { createProxyServer, defaultSubstreamsEndpoint } from "./server/createProxyServer.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

async function main() {
  const args = await yargs(hideBin(process.argv))
    .env("SUBSTREAMS")
    .option("--endpoint", {
      default: defaultSubstreamsEndpoint,
      string: true,
    })
    .option("--token", {
      string: true,
    })
    .option("--cors", {
      default: true,
      boolean: true,
    })
    .option("--port", {
      default: 8080,
      number: true,
    })
    .option("--host", {
      default: "::",
      string: true,
    })
    .help()
    .parse();

  const server = createProxyServer({
    substreamsEndpoint: args["--endpoint"],
    substreamsToken: args["--token"],
    corsEnabled: args["--cors"],
  });

  server.listen(args["--port"], args["--host"], () => {
    const host = args["--host"] === "::" ? "0.0.0.0" : args["--host"];
    console.log(`Proxy server listening on http://${host}:${args["--port"]}`);
  });

  await new Promise<void>((resolve, reject) => {
    server.on("error", (error) => reject(error));
    server.on("close", () => resolve());
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
