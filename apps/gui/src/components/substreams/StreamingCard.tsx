import { useEffect, useState } from "react";
import { useThrottle } from "react-use";
import type { MapModule, Package, Clock } from "@fubhy/substreams";
import { useSubstream } from "@fubhy/substreams-react";
import type { JsonValue } from "@bufbuild/protobuf";
import { create } from "zustand";
import { Card, Divider, Title, Flex, Badge, List, ListItem, Toggle, ToggleItem } from "@tremor/react";
import { JsonViewer } from "@textea/json-viewer";
import { StreamingForm } from "./StreamingForm.js";

type State = {
  state: "streaming" | "finished" | "error" | "idle";
  messages: JsonValue[];
  clock: Clock | undefined;
  cursor: string | undefined;
  error: Error | undefined;
  progress: {
    [key: string]: [bigint, bigint][];
  };
};

const useStreamData = create<State>(() => ({
  state: "idle",
  messages: [],
  clock: undefined,
  cursor: undefined,
  error: undefined,
  progress: {},
}));

function merge(ranges: [bigint, bigint][]) {
  let [previous] = ranges.slice().sort(([a], [b]) => {
    return a === b ? 0 : a < b ? -1 : 1;
  });

  if (previous === undefined) {
    return [];
  }

  // Ensure we are not modifying the original array.
  previous = [previous[0], previous[1]];
  const result = [previous];

  for (const next of ranges) {
    if (next[0] > previous[1] + 1n) {
      previous = [next[0], next[1]];
      result.push(previous);
      continue;
    }

    if (next[1] > previous[1]) {
      previous[1] = next[1];
    }
  }

  return result;
}

export function StreamingCard(options: { endpoint: string; substream: Package; module: MapModule }) {
  const { start, module } = useSubstream({
    ...options,
    handlers: {
      onData: (data, messages, ctx) => {
        const current = messages.map((item) =>
          item.toJson({
            emitDefaultValues: true,
            typeRegistry: ctx.registry,
          }),
        );

        useStreamData.setState((state) => ({
          ...state,
          messages: [...state.messages, ...current].slice(-20),
          clock: data.clock,
          cursor: data.cursor,
        }));
      },
      onProgress: (progress, ctx) => {
        useStreamData.setState((state) => {
          for (const module of progress.modules) {
            const current = state.progress[module.name] || ([] as [bigint, bigint][]);
            if (module.type.case === "initialState") {
              const start = ctx.options.startBlockNum ?? ctx.module.initialBlock;
              const end = module.type.value.availableUpToBlock;
              const range = [start, end] as [bigint, bigint];

              state.progress[module.name] = merge([...current, range]);
            } else if (module.type.case === "processedRanges") {
              const ranges = module.type.value.processedRanges.map(
                (range) => [range.startBlock, range.endBlock] as [bigint, bigint],
              );

              state.progress[module.name] = merge([...current, ...ranges]);
            }
          }

          return state;
        }, true);
      },
      onStart: () => {
        useStreamData.setState({
          state: "streaming",
          messages: [],
          clock: undefined,
          cursor: undefined,
          error: undefined,
          progress: {},
        });
      },
      onFinished: () => {
        useStreamData.setState((state) => ({
          ...state,
          state: "finished",
        }));
      },
      onError: (error) => {
        useStreamData.setState((state) => ({
          ...state,
          error,
          state: "error",
        }));
      },
    },
  });

  return (
    <>
      <Card>
        <Flex>
          <Title>{module.name}</Title>
          <Badge>map</Badge>
        </Flex>
        <Divider />
        <StreamingForm module={module} start={start} />
      </Card>

      <StreamingData />
    </>
  );
}

function StreamingData() {
  const [state, setState] = useState<State>(() => useStreamData.getState());
  const [depth, setDepth] = useState(3);
  const debounced = useThrottle(state, 100);

  useEffect(() => {
    const unsubscribe = useStreamData.subscribe((state) => setState(state));
    return () => {
      unsubscribe();
      useStreamData.setState({
        state: "idle",
        messages: [],
        clock: undefined,
        cursor: undefined,
        error: undefined,
        progress: {},
      });
    };
  }, []);

  const date = debounced.clock?.timestamp?.toDate();

  return (
    <>
      <Card className="mt-6">
        <Title>State</Title>
        <List>
          {debounced.state ? (
            <ListItem>
              <span>State</span>
              <span>{debounced.state}</span>
            </ListItem>
          ) : null}
          {debounced.clock?.number ? (
            <ListItem>
              <span>Block number</span>
              <span>
                <a href={`https://etherscan.io/block/${debounced.clock.number}`} className="text-indigo-500">
                  {debounced.clock.number.toString()}
                </a>
              </span>
            </ListItem>
          ) : null}
          {debounced.clock?.id ? (
            <ListItem>
              <span>Block hash</span>
              <span>
                <a href={`https://etherscan.io/block/0x${debounced.clock.id}`} className="text-indigo-500">
                  0x{debounced.clock.id}
                </a>
              </span>
            </ListItem>
          ) : null}
          {date ? (
            <ListItem>
              <span>Block time</span>
              <span>{date.toISOString()}</span>
            </ListItem>
          ) : null}
          {debounced.cursor ? (
            <ListItem>
              <span>Cursor</span>
              <span>{debounced.cursor}</span>
            </ListItem>
          ) : null}
        </List>
      </Card>

      <Card className="mt-6">
        <Flex>
          <Title>Block data</Title>
          <Toggle defaultValue={depth} onValueChange={(value: number) => setDepth(value)}>
            <ToggleItem value={1} text="1" />
            <ToggleItem value={3} text="3" />
            <ToggleItem value={5} text="5" />
            <ToggleItem value={10} text="10" />
            <ToggleItem value={20} text="20" />
          </Toggle>
        </Flex>
        <JsonViewer
          rootName="data"
          value={state.messages.slice(-depth)}
          highlightUpdates={true}
          defaultInspectDepth={2}
        />
      </Card>

      <Card className="mt-6">
        <Title>Module progress</Title>
        <JsonViewer rootName="progress" value={{ ...state.progress }} highlightUpdates={true} />
      </Card>
    </>
  );
}
