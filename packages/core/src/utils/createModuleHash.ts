import type { Module, Module_Input, Modules } from "../proto/sf/substreams/v1/modules_pb.js";

export async function createBinaryHash(array: Uint8Array) {
  const hash = await globalThis.crypto.subtle.digest("SHA-1", array);
  return toHex(new Uint8Array(hash));
}

export async function toHex(array: Uint8Array) {
  return Array.from(array, (value) => value.toString(16).padStart(2, "0")).join("");
}

export async function createModuleHash(modules: Modules, module: Module) {
  const array = await hashModule(modules, module);
  return createBinaryHash(array);
}

export async function hashModule(modules: Modules, module: Module) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];

  chunks.push(encoder.encode("initial_block"));
  chunks.push(encodeInitialBlock(module));

  chunks.push(encoder.encode("kind"));
  chunks.push(encoder.encode(moduleKind(module)));

  chunks.push(encoder.encode("binary"));
  const binary = modules.binaries[module.binaryIndex];
  if (binary !== undefined) {
    chunks.push(encoder.encode(binary.type));
    chunks.push(binary.content);
  }

  chunks.push(encoder.encode("inputs"));
  for (const input of module.inputs) {
    chunks.push(encoder.encode(inputType(input)));
    chunks.push(encoder.encode(inputValue(input)));
  }

  chunks.push(encoder.encode("ancestors"));
  // TODO: Implement module graph.
  // for (const ancestor of getAncestors(modules, module)) {
  //   chunks.push(await hashModule(modules, ancestor));
  // }

  chunks.push(encoder.encode("entrypoint"));
  chunks.push(encoder.encode(module.name));

  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const array = new Uint8Array(length);

  let offset = 0;
  for (const chunk of chunks) {
    array.set(chunk, offset);
    offset += chunk.length;
  }

  return array;
}

function encodeInitialBlock(module: Module) {
  const array = new Uint8Array(8);
  new DataView(array.buffer).setBigUint64(0, module.initialBlock, true);
  return array;
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
