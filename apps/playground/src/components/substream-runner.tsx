"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMessageKey } from "@/hooks/use-message-key";
import { useModuleGraph } from "@/hooks/use-module-graph";
import { useModuleKey } from "@/hooks/use-module-key";
import { MaybeSerializedMessage, useRehydrateMessage } from "@/hooks/use-rehydrate-message";
import { useSubstream } from "@/hooks/use-substream";
import { transport } from "@/lib/transport";
import { invariant } from "@/lib/utils";
import { JsonValue } from "@bufbuild/protobuf";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModuleGraph, State, StatefulResponse, createRequest, getModuleOrThrow, isMapModule } from "@substreams/core";
import { Package, Request } from "@substreams/core/proto";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { create } from "zustand";

export function SubstreamRunner({
  pkg: ppkg,
}: {
  pkg: MaybeSerializedMessage<Package>;
}) {
  const pkg = Package.fromJsonString(useRehydrateMessage(Package, ppkg).toJsonString());
  const graph = useModuleGraph(pkg);
  const options = useMemo(() => {
    const modules = pkg.modules?.modules ?? [];
    const mappers = modules.filter(isMapModule);
    return mappers.map((module) => module.name);
  }, [pkg]);

  const [module, setModule] = useState(() => options[0]);
  invariant(module !== undefined, "Expected at least one map module in the package.");
  const moduleKey = useModuleKey(pkg, module);

  const [request, setRequest] = useState<Request>();
  const requestKey = useMessageKey(request);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-2">
          <SelectModule module={module} options={options} setModule={setModule} />
          <SubstreamRunnerForm key={moduleKey} pkg={pkg} graph={graph} module={module} setRequest={setRequest} />
        </CardContent>
      </Card>
      {request ? <SubstreamRunnerResult key={requestKey} request={request} /> : null}
    </div>
  );
}

type SubstreamState = State & {
  state: "streaming" | "finished" | "error" | "idle";
  messages: JsonValue[];
  error: Error | undefined;
};

const _useStreamData = create<SubstreamState>(() => ({
  state: "idle",
  messages: [],
  error: undefined,
  timestamp: undefined,
  cursor: undefined,
  current: 0n,
  modules: {},
}));

function SubstreamRunnerResult({
  request,
}: {
  request: Request;
}) {
  const [state, setState] = useState<State>();
  useSubstream({
    request,
    transport,
    handlers: {
      onResponse: (response: StatefulResponse) => setState(response.state),
      onError: (cause) => {
        console.error(cause);
      },
    },
  });

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <pre className="text-sm text-muted-foreground">Time: {state?.timestamp?.toDateString() ?? null}</pre>
        <pre className="text-sm text-muted-foreground">Cursor: {state?.cursor ?? null}</pre>
        <pre className="text-sm text-muted-foreground">Block: {state?.current?.toString() ?? null}</pre>
      </CardContent>
    </Card>
  );
}

function SelectModule({
  options,
  module,
  setModule,
}: {
  options: string[];
  module: string;
  setModule: (module: string) => void;
}) {
  return (
    <>
      <Label htmlFor="select-module">Module</Label>
      <Select defaultValue={module} onValueChange={setModule}>
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
      <p className="text-sm text-muted-foreground">The map module to be streamed.</p>
    </>
  );
}

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
    start: bigintish.pipe(z.bigint().min(0n, { message: "Must be greater than or equal to 0." })),
    stop: bigintish.pipe(z.bigint().min(0n, { message: "Must be greater than or equal to 0." }).optional()).optional(),
  })
  .refine((data) => data.stop === undefined || data.start < data.stop, {
    path: ["stop"],
    message: "If set, the stop block must be greater than start block.",
  });

function SubstreamRunnerForm({
  pkg,
  graph,
  module,
  setRequest,
}: {
  pkg: Package;
  graph: ModuleGraph;
  module: string;
  setRequest: (request: Request) => void;
}) {
  const start = useMemo(() => graph.startBlockFor(module).toString(), [graph, module]);
  const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      module,
      start,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
  );
}
