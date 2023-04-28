import type { MapModule, Package, Clock } from "@fubhy/substreams";
import { useSubstream } from "@fubhy/substreams-react";
import { useEffect, useMemo, useState } from "react";
import { getOutputType } from "../../../../../packages/substreams/src/getOutputType.js";
import type { AnyMessage, FieldInfo, IMessageTypeRegistry } from "@bufbuild/protobuf";
import { create } from "zustand";
import { Card, Metric, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { useThrottle } from "react-use";

type State = {
  clock?: Clock | undefined;
  cursor?: string | undefined;
  messages: AnyMessage[];
};

const useStreamData = create<State>(() => ({
  messages: [],
}));

export function StreamingCard(options: { endpoint: string; substream: Package; module: MapModule }) {
  const { start, module, registry } = useSubstream({
    ...options,
    handlers: {
      onData: (data, messages) => {
        useStreamData.setState((state) => ({
          messages: [...state.messages, ...messages],
          clock: data.clock,
          cursor: data.cursor,
        }));
      },
      onClose: () => {
        console.log("Finished");
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });

  const fields = useMemo(() => getOutputType(module, registry)?.fields.list() ?? [], [module, registry]);

  useEffect(() => {
    return start({
      productionMode: true,
      stopBlockNum: 17147683n,
    });
  }, [start]);

  return <StreamingData fields={fields} registry={registry} className="mt-6" />;
}

function StreamingData({
  fields,
  registry,
  className,
}: { className?: string; registry: IMessageTypeRegistry; fields: readonly FieldInfo[] }) {
  const [state, setState] = useState<State>(() => useStreamData.getState());
  const debounced = useThrottle(state, 100);

  useEffect(() => {
    return useStreamData.subscribe((state) => {
      setState(state);
    });
  }, []);

  return (
    <Card className={className}>
      <Metric>{debounced.cursor}</Metric>
      <Table className="mt-5">
        <TableHead>
          <TableRow>
            {fields.map((field) => (
              <TableHeaderCell key={field.localName}>{field.localName}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {debounced.messages.map((message, index) => (
            // rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <TableRow key={index}>
              <TableCell>{message.toJsonString({ typeRegistry: registry })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
