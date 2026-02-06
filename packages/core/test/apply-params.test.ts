import { create } from "@bufbuild/protobuf";
import { applyParams } from "@substreams/core";
import { type Module_Input, Module_InputSchema, type Module_Input_Params, ModuleSchema } from "@substreams/core/proto";
import { assert, test } from "vitest";

test("correctly injects parameters into a module", () => {
  const input = create(Module_InputSchema, {
    input: {
      case: "params",
      value: {
        value: "",
      },
    },
  }) as Module_Input;

  const module = create(ModuleSchema, {
    name: "a",
    inputs: [input],
  });

  applyParams(["a=foo"], [module]);
  assert.equal((input.input.value as Module_Input_Params).value, "foo");
});

test("correctly handle '=' in parameters value", () => {
  const input = create(Module_InputSchema, {
    input: {
      case: "params",
      value: {
        value: "",
      },
    },
  }) as Module_Input;

  const module = create(ModuleSchema, {
    name: "mymodule",
    inputs: [input],
  });

  applyParams(["mymodule=A=B=C"], [module]);
  assert.equal(module.name, "mymodule");
  assert.equal((input.input.value as Module_Input_Params).value, "A=B=C");
});

test("correctly handle empty parameters value", () => {
  const input = create(Module_InputSchema, {
    input: {
      case: "params",
      value: {
        value: "",
      },
    },
  }) as Module_Input;

  const module = create(ModuleSchema, {
    name: "mymodule",
    inputs: [input],
  });

  applyParams(["mymodule="], [module]);
  assert.equal(module.name, "mymodule");
  assert.equal((input.input.value as Module_Input_Params).value, "");
});
