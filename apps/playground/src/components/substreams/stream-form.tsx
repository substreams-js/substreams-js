import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invariant } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGraph, createRequest, getModuleOrThrow, isMapModule } from "@substreams/core";
import { Package, Request } from "@substreams/core/proto";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bigintish = z
  .string()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(
    z.coerce.number({ invalid_type_error: "Expected a number." }).int({ message: "Expected an integer." }).optional(),
  )
  .pipe(z.coerce.bigint({ invalid_type_error: "Expected a number." }).optional());

const schema = z
  .object({
    module: z.string(),
    start: bigintish.pipe(z.bigint().min(BigInt(0), { message: "Must be greater than or equal to 0." })),
    stop: bigintish
      .pipe(z.bigint().min(BigInt(0), { message: "Must be greater than or equal to 0." }).optional())
      .optional(),
  })
  .refine((data) => data.stop === undefined || data.start < data.stop, {
    path: ["stop"],
    message: "If set, the stop block must be greater than start block.",
  });

export function StreamForm({
  pkg,
  graph,
  setRequest,
}: {
  pkg: Package;
  graph: ModuleGraph;
  setRequest: (request: Request) => void;
}) {
  const options = useMemo(() => {
    const modules = pkg.modules?.modules ?? [];
    const mappers = modules.filter(isMapModule);
    return mappers.map((module) => module.name);
  }, [pkg]);

  const [module] = options;
  invariant(module !== undefined, "Expected at least one map module in the package.");

  const start = useMemo(() => graph.startBlockFor(module), [graph, module]);
  const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      module,
      start: start.toString(),
      stop: "",
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    const min = graph.startBlockFor(data.module);
    if (data.start < min) {
      form.setError("start", {
        message: `The start block must be greater than or equal to the module's start block (${min}).`,
      });

      return;
    }

    const request = createRequest({
      substreamPackage: pkg,
      outputModule: getModuleOrThrow(pkg.modules?.modules ?? [], data.module),
      startBlockNum: data.start,
      stopBlockNum: data.stop,
      productionMode: true,
    });

    setRequest(request);
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(module) => {
                        const start = graph.startBlockFor(module);
                        form.reset({
                          module,
                          start: start.toString(),
                          stop: "",
                        });
                      }}
                    >
                      <SelectTrigger id="select-module">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>The map module to be streamed.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start block</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>The block at which to start streaming.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop block</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Optional" />
                  </FormControl>
                  <FormDescription>
                    The block at which to stop streaming. Leave empty to follow the chain head.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
