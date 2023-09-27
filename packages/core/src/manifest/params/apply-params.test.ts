import { assert, test } from "vitest";
import { Module, Module_Input, type Module_Input_Params } from "../../proto.js";
import { applyParams } from "./apply-params.js";

test("correctly injects parameters into a module", async () => {
  const input = new Module_Input({
    input: {
      case: "params",
      value: {
        value: "",
      },
    },
  });

  const module = new Module({
    name: "a",
    inputs: [input],
  });

  applyParams(["a=foo"], [module]);
  assert.equal((input.input.value as Module_Input_Params).value, "foo");
});

test("correctly handle '=' in parameters value", async () => {
  const input = new Module_Input({
    input: {
      case: "params",
      value: {
        value: "",
      },
    },
  });

  const module = new Module({
    name: "mymodule",
    inputs: [input],
  });

  applyParams(["mymodule=A=B=C"], [module]);
  assert.equal(module.name, "mymodule");
  assert.equal((input.input.value as Module_Input_Params).value, "A=B=C");
});

test("correctly handle empty parameters value", async () => {
  const input = new Module_Input({
    input: {
      case: "params",
      value: {
        value: "",
      },
    },
  });

  const module = new Module({
    name: "mymodule",
    inputs: [input],
  });

  applyParams(["mymodule="], [module]);
  assert.equal(module.name, "mymodule");
  assert.equal((input.input.value as Module_Input_Params).value, "");
});
