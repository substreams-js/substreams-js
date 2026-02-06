import { spawn } from "node:child_process";
import { fromBinary } from "@bufbuild/protobuf";
import { FileDescriptorSetSchema } from "@bufbuild/protobuf/wkt";
import { locateBufBinary } from "./locate-buf-binary.js";

export async function readLocalProtos(context: string, file: string) {
  const buf = await locateBufBinary();
  if (buf === undefined) {
    throw new Error("Buf is not installed");
  }

  const data = await new Promise<Uint8Array>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const spawned = spawn(buf, ["build", "--as-file-descriptor-set", "--path", file, "--output", "/dev/stdout"], {
      cwd: context,
    });

    spawned.stdout.on("data", (data) => {
      chunks.push(data);
    });

    spawned.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Failed to read protobuf file ${file} in ${context}`));
      }

      resolve(Buffer.concat(chunks));
    });
  });

  return fromBinary(FileDescriptorSetSchema, data);
}
