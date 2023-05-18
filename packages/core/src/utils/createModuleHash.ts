import type { Module, Module_Input, Modules } from "../proto/sf/substreams/v1/modules_pb.js";

export async function createBinaryHash(buffer: Buffer) {
  const hash = await global.crypto.subtle.digest("SHA-1", buffer);
  return Buffer.from(hash).toString("hex");
}

export async function createModuleHash(modules: Modules, module: Module) {
  const buffer = await hashModule(modules, module);
  return createBinaryHash(buffer);
}

export async function hashModule(modules: Modules, module: Module) {
  const chunks: Uint8Array[] = [];
  chunks.push(Buffer.from("initial_block"));
  const initialBlockBytes = Buffer.alloc(8);
  initialBlockBytes.writeBigUInt64LE(module.initialBlock);
  chunks.push(initialBlockBytes);

  chunks.push(Buffer.from("kind"));
  chunks.push(Buffer.from(moduleKind(module)));

  chunks.push(Buffer.from("binary"));
  const binary = modules.binaries[module.binaryIndex];
  if (binary !== undefined) {
    chunks.push(Buffer.from(binary.type));
    chunks.push(binary.content);
  }

  chunks.push(Buffer.from("inputs"));
  for (const input of module.inputs) {
    chunks.push(Buffer.from(inputType(input)));
    chunks.push(Buffer.from(inputValue(input)));
  }

  chunks.push(Buffer.from("ancestors"));
  // TODO: Implement module graph.
  // for (const ancestor of getAncestors(modules, module)) {
  //   chunks.push(await hashModule(modules, ancestor));
  // }

  chunks.push(Buffer.from("entrypoint"));
  chunks.push(Buffer.from(module.name));

  return Buffer.concat(chunks);
}

function moduleKind(module: Module): string {
  switch (module.kind.case) {
    case "kindMap":
      return "map";

    case "kindStore":
      return "store";

    default:
      throw new Error(`invalid module ${module.kind.case}`);
  }
}

function inputType(input: Module_Input): string {
  switch (input.input.case) {
    case "map":
      return "map";

    case "store":
      return "store";

    case "source":
      return "source";

    case "params":
      return "params";

    default:
      throw new Error(`invalid input ${input}`);
  }
}

function inputValue(input: Module_Input): string {
  switch (input.input.case) {
    case "store":
      return input.input.value.moduleName ?? "";

    case "source":
      return input.input.value.type ?? "";

    case "map":
      return input.input.value.moduleName ?? "";

    case "params":
      return input.input.value.value ?? "";

    default:
      throw new Error(`invalid input ${input}`);
  }
}
