import { Module, Module_Input_Store_Mode } from "@substreams/core/proto";

export function generateMermaidGraph(modules: Module[]) {
  const chunks: string[] = ["graph TD;"];

  for (const module of modules ?? []) {
    const moduleName = module.name;

    switch (module.kind.case) {
      case "kindMap": {
        chunks.push(`  ${moduleName}[map: ${moduleName}];`);
        break;
      }

      case "kindStore": {
        chunks.push(`  ${moduleName}[store: ${moduleName}];`);
        break;
      }
    }

    for (const { input } of module.inputs) {
      switch (input.case) {
        case "source": {
          const inputName = input.value.type;
          chunks.push(`  ${inputName}[source: ${inputName}] --> ${moduleName};`);
          break;
        }

        case "map": {
          const mapName = input.value.moduleName;
          chunks.push(`  ${mapName} --> ${moduleName};`);
          break;
        }

        case "store": {
          const storeName = input.value.moduleName;
          if (input.value.mode === Module_Input_Store_Mode.DELTAS) {
            chunks.push(`  ${storeName} -- deltas --> ${moduleName};`);
          } else {
            chunks.push(`  ${storeName} --> ${moduleName};`);
          }
          break;
        }

        case "params": {
          chunks.push(`  ${moduleName}:params[params] --> ${moduleName};`);
          break;
        }
      }
    }
  }

  return chunks.join("\n");
}
