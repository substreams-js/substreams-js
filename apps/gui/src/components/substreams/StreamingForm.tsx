import type { CreateRequestOptions, MapModule } from "@fubhy/substreams";
import { useForm } from "@tanstack/react-form";
import { Button, Divider, Flex, TextInput } from "@tremor/react";

export function StreamingForm({
  module,
  start,
}: {
  module: MapModule;
  start: (options: CreateRequestOptions) => void;
}) {
  const form = useForm({
    defaultValues: {
      startBlock: module.initialBlock.toString(),
      stopBlock: (module.initialBlock + 1000n).toString(),
    },
    onSubmit: (values) => {
      start({
        startBlockNum: BigInt(values.startBlock),
        stopBlockNum: BigInt(values.stopBlock),
        productionMode: true,
      });
    },
  });

  return (
    <form.Form>
      <form.Field
        name="startBlock"
        children={(field) => (
          <>
            <label htmlFor={field.name}>Start block</label>
            <TextInput name={field.name} {...field.getInputProps()} />
          </>
        )}
      />
      <form.Field
        name="stopBlock"
        children={(field) => (
          <>
            <label htmlFor={field.name}>Stop block</label>
            <TextInput name={field.name} {...field.getInputProps()} />
          </>
        )}
      />
      <Divider />
      <Flex justifyContent="end" className="space-x-2">
        <Button size="xs" variant="primary" type="submit">
          Stream
        </Button>
      </Flex>
    </form.Form>
  );
}
