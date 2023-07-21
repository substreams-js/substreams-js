import { Module, Module_Input_Store_Mode } from "../proto.js";

export function generateMermaidGraph(modules: Module[]) {
  const chunks: string[] = ["graph TD;"];

  for (const module of modules ?? []) {
    const moduleName = module.name;
    const sanitizedModuleName = sanitizeName(moduleName);

    switch (module.kind.case) {
      case "kindMap": {
        chunks.push(`  ${sanitizedModuleName}[map: ${moduleName}];`);
        break;
      }

      case "kindStore": {
        chunks.push(`  ${sanitizedModuleName}[store: ${moduleName}];`);
        break;
      }
    }

    for (const { input } of module.inputs) {
      switch (input.case) {
        case "source": {
          const inputName = input.value.type;
          const sanitizedInputName = sanitizeName(inputName);
          chunks.push(`  ${sanitizedInputName}[source: ${inputName}] --> ${sanitizedModuleName};`);
          break;
        }

        case "map": {
          const mapName = input.value.moduleName;
          const sanitizedMapName = sanitizeName(mapName);
          chunks.push(`  ${sanitizedMapName} --> ${sanitizedModuleName};`);
          break;
        }

        case "store": {
          const storeName = input.value.moduleName;
          const sanitizedStoreName = sanitizeName(storeName);
          if (input.value.mode === Module_Input_Store_Mode.DELTAS) {
            chunks.push(`  ${sanitizedStoreName} -- deltas --> ${sanitizedModuleName};`);
          } else {
            chunks.push(`  ${sanitizedStoreName} --> ${sanitizedModuleName};`);
          }
          break;
        }

        case "params": {
          chunks.push(`  ${sanitizedModuleName}:params[params] --> ${sanitizedModuleName};`);
          break;
        }
      }
    }
  }

  return chunks.join("\n");
}

// Mermaid doesn't like the word `end` within flow charts: https://mermaid.js.org/syntax/flowchart.html
function sanitizeName(name: string) {
  if (name.endsWith("_end")) {
    return `${name.slice(0, -4)}_END`;
  }

  return name;
}
