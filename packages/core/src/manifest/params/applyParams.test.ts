import { Module, Module_Input, Module_Input_Params } from "../../proto/sf/substreams/v1/modules_pb.js";
import { applyParams } from "./applyParams.js";
import { assert, test } from "vitest";

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
