import type { Module, Module_Input, Modules } from "../../proto/sf/substreams/v1/modules_pb.js";
import { createHash } from "../../utils/createHash.js";
import { createModuleGraph } from "../graph/createModuleGraph.js";

export async function createModuleHash(
  modules: Modules,
  module: Module,
  graph = createModuleGraph(modules.modules ?? []),
) {
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
  for (const ancestor of graph.ancestorsOf(module)) {
    chunks.push(await createModuleHash(modules, ancestor, graph));
  }

  chunks.push(encoder.encode("entrypoint"));
  chunks.push(encoder.encode(module.binaryEntrypoint));

  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const array = new Uint8Array(length);

  let offset = 0;
  for (const chunk of chunks) {
    array.set(chunk, offset);
    offset += chunk.length;
  }

  return createHash(array);
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
      throw new Error(`Invalid module ${module.kind.case}`);
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
      throw new Error(`Invalid input ${input}`);
  }
}

function inputValue(input: Module_Input): string {
  switch (input.input.case) {
    case "source":
      return input.input.value.type;

    case "params":
      return input.input.value.value;

    case "map":
      return ""; // This is accounted for in the `ancestorsOf()` tree.

    case "store":
      return ""; // This is accounted for in the `ancestorsOf()` tree.

    default:
      throw new Error(`Invalid input ${input}`);
  }
}
