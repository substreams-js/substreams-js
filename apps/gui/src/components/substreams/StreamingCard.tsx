import { StreamingForm } from "./StreamingForm.js";
import type { JsonValue } from "@bufbuild/protobuf";
import { type MapModule, type Package, type State, unpackMapOutput } from "@fubhy/substreams";
import { useSubstream } from "@fubhy/substreams-react";
import { JsonViewer } from "@textea/json-viewer";
import { Badge, Card, Divider, Flex, List, ListItem, Title, Toggle, ToggleItem } from "@tremor/react";
import { useEffect, useState } from "react";
import { useThrottle } from "react-use";
import { create } from "zustand";

type SubstreamState = State & {
  state: "streaming" | "finished" | "error" | "idle";
  messages: JsonValue[];
  error: Error | undefined;
};

const useStreamData = create<SubstreamState>(() => ({
  state: "idle",
  messages: [],
  error: undefined,
  timestamp: undefined,
  cursor: undefined,
  current: 0n,
  modules: {},
}));

export function StreamingCard(options: { endpoint: string; substream: Package; module: MapModule }) {
  const { start, module } = useSubstream({
    ...options,
    handlers: {
      onResponse: (response, ctx) => {
        useStreamData.setState((state) => {
          const message = unpackMapOutput(response.response, ctx.registry);
          if (message !== undefined) {
            const serialized = message.toBinary();

            // Ignore empty messages for now.
            if (serialized.byteLength > 0) {
              const json = message.toJson({
                emitDefaultValues: true,
                typeRegistry: ctx.registry,
              });

              state.messages = [...state.messages, json].slice(-20);
            }
          }

          return { ...state, ...response.state };
        });
      },
      onStart: () => {
        useStreamData.setState({
          state: "streaming",
          messages: [],
          current: 0n,
          cursor: undefined,
          error: undefined,
          modules: {},
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
  const [state, setState] = useState<SubstreamState>(() => useStreamData.getState());
  const [depth, setDepth] = useState(3);
  const debounced = useThrottle(state, 100);

  useEffect(() => {
    const unsubscribe = useStreamData.subscribe((state) => setState(state));
    return () => {
      unsubscribe();

      useStreamData.setState({
        state: "idle",
        messages: [],
        current: 0n,
        cursor: undefined,
        error: undefined,
        modules: {},
      });
    };
  }, []);

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
          {debounced.current ? (
            <ListItem>
              <span>Block</span>
              <span>
                <a href={`https://etherscan.io/block/${debounced.current.toString()}`} className="text-indigo-500">
                  {debounced.current.toString()}
                </a>
              </span>
            </ListItem>
          ) : null}
          {debounced.timestamp ? (
            <ListItem>
              <span>Time</span>
              <span>{debounced.timestamp.toISOString()}</span>
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
          defaultInspectDepth={4}
        />
      </Card>

      <Card className="mt-6">
        <Title>Module progress</Title>
        <JsonViewer rootName="progress" value={{ ...state.modules }} highlightUpdates={true} />
      </Card>
    </>
  );
}
