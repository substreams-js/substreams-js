import { locateBufBinary } from "./locateBufBinary.js";
import { FileDescriptorSet } from "@bufbuild/protobuf";
import { spawn } from "node:child_process";

export async function readLocalProtos(file: string) {
  const buf = await locateBufBinary();
  if (buf === undefined) {
    throw new Error("Buf is not installed");
  }

  const data = await new Promise<Uint8Array>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const spawned = spawn(buf, ["build", file, "--as-file-descriptor-set", "--output", "/dev/stdout"]);
    spawned.stdout.on("data", (data) => {
      chunks.push(data);
    });

    spawned.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Failed to read protobuf file ${file}`));
      }

      resolve(Buffer.concat(chunks));
    });
  });

  return FileDescriptorSet.fromBinary(data);
}
