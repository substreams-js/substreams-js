import type { FileDescriptorProto } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { Package } from "@substreams/core/proto";
import { readFile } from "fs/promises";
import { Manifest } from "../manifest/manifest-schema.js";
import { FileDescriptorSetService } from "../proto/buf/reflect/v1beta1/file_descriptor_set_connect.js";
import { GetFileDescriptorSetRequest } from "../proto/buf/reflect/v1beta1/file_descriptor_set_pb.js";

export async function readDescriptorSetsProtos(pkg: Package, manifest: Manifest): Promise<FileDescriptorProto[]> {
  const seen: { [key: string]: boolean } = {};
  for (const file of pkg.protoFiles) {
    seen[file.name ?? ""] = true;
  }

  const client = createPromiseClient(
    FileDescriptorSetService,
    createConnectTransport({
      baseUrl: "https://buf.build",
      httpVersion: "2",
    }),
  );

  const localFilesProto: FileDescriptorProto[] = [];
  const remoteFilesProto: FileDescriptorProto[] = [];
  for (const descriptor of manifest.protobuf?.descriptorSets ?? []) {
    if (descriptor.localPath != null) {
      const f = await readFile(descriptor.localPath);

      const protoDescContainer = Package.fromBinary(f);
      for (const fdProto of protoDescContainer.protoFiles) {
        if (seen[fdProto.name ?? ""]) {
          continue;
        }
        seen[fdProto.name ?? ""] = true;
        localFilesProto.push(fdProto);
      }
      continue;
    }

    const authToken = process.env.BUFBUILD_AUTH_TOKEN;
    if (!authToken) {
      throw new Error(
        "missing BUFBUILD_AUTH_TOKEN; go into your account at https://buf.build/settings/user to create an API key",
      );
    }

    if (descriptor.module == null) {
      throw new Error("missing module in descriptor set");
    }
    if (descriptor.version == null) {
      throw new Error("missing version in descriptor set");
    }

    const request = new GetFileDescriptorSetRequest({
      module: descriptor.module,
      symbols: [...(descriptor.symbols ?? [])],
      version: descriptor.version,
    });

    const fileDescriptorSet = await client.getFileDescriptorSet(request, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    for (const fd of fileDescriptorSet.fileDescriptorSet?.file ?? []) {
      if (seen[fd.name ?? ""]) {
        continue;
      }
      seen[fd.name ?? ""] = true;
      remoteFilesProto.push(fd);
    }
  }

  for (const fd of remoteFilesProto) {
    pkg.protoFiles.push(fd);
  }
  pkg.protoFiles.push(...localFilesProto);

  return remoteFilesProto;
}
