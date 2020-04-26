import { data as dataNode4 } from "./node4";

export const node4 = dataNode4;

export const data = {
  nodes: [
    { id: "arc", type: "task-output" },
    {
      id: "node2",
      label: "RouterFunctions::route",
      x: 925,
      y: 374,
      inputs: [
        {
          name: "requestPredicate",
          type: "RequestPredicate",
        },
        {
          name: "handlerFunction",
          type: "HandlerFunction",
        },
      ],
      outputs: [{ name: "routerFunction", type: "RouterFunction" }],
    },
    {
      id: "nodeString",
      label: "/example",
      x: 337,
      y: 376,
      outputs: [{ name: "value", type: "string" }],
    },
    {
      id: "node3",
      label: "RouterFunction::and",
      x: 1266,
      y: 354,
      inputs: [
        { name: "routerFunction", type: "RouterFunction" },
        { name: "routerFunction2", type: "RouterFunction" },
      ],
      outputs: [{ name: "routerFunction", type: "RouterFunction" }],
    },
    {
      id: "node4",
      label: "RequestPredicates::GET",
      x: 583,
      y: 364,
      inputs: [{ name: "path", type: "string" }],
      outputs: [{ name: "requestPredicate", type: "RequestPredicate" }],
    },
    {
      id: "node5",
      label: "HandlerFunction<ServerResponse>",
      collapsed: false,
      x: 554,
      y: 494,
      inputs: [{ name: "ServerRequest", type: "ServerRequest" }],
      outputs: [{ name: "Mono<ServerResponse>", type: "Mono<ServerResponse>" }],
    },
  ],
  edges: [
    {
      source: "node4",
      sourceAnchor: 1,
      target: "node2",
      color: "#ffa000",
      type: "cubic-horizontal",
      targetAnchor: 0,
    },
    {
      source: "nodeString",
      sourceAnchor: 0,
      target: "node4",
      color: "blue",
      type: "cubic-horizontal",
      targetAnchor: 0,
    },
    {
      source: "node5",
      sourceAnchor: 2,
      target: "node2",
      color: "darkgrey",
      type: "cubic-horizontal",
      targetAnchor: 1,
    },
    {
      source: "node2",
      sourceAnchor: 2,
      target: "node3",
      color: "#00acc1",
      type: "cubic-horizontal",
      targetAnchor: 0,
    },
  ],
};

export default {
  node4,
  data,
};
