import {data as dataNode4} from './node4';

export const node4 = dataNode4;

export const data = {
  nodes: [
    {
      id: "node1",
      type: "task-input",
    },
    {
      id: "arc",
      type: "task-output",
    },
    {
      id: "arc2",
      type: "task-output",
    },
    {
      id: "node2",
      label: "ToString",
      x: 300,
      y: 300,
      inputs: [
        {
          name: "input1",
          type: "string",
        },
        {
          name: "input2",
          type: "string",
        },
        {
          name: "input3",
          type: "string",
        },
      ],
      outputs: [
        {
          name: "out",
          type: "string",
        },
      ],
    },
    {
      id: "node3",
      label: "Flux<String>::map",
      x: 1000,
      y: 500,
      inputs: [
        {
          name: "input",
          type: "string",
        },
        {
          name: "lambda",
          type: "Function<String, String>",
        },
      ],
      outputs: [
        {
          name: "output",
          type: "string",
        },
      ],
    },
    {
      id: "node4",
      label: "rect4",
      x: 600,
      y: 200,
      inputs: [
        {
          name: "input1",
          type: "string",
        },
      ],
      outputs: [
        {
          name: "out",
          type: "string",
        },
      ],
    },
    {
      id: "node5",
      label: "365",
      collapsed: true,
      x: 800,
      y: 300,
      outputs: [
        {
          name: "value",
          type: "int",
        },
      ],
    },
  ],
  edges: [
    {
      source: "node1",
      target: "node2",
      // label: "Flex<String>",
      color: "blue",
      targetAnchor: 0,
    },
    {
      source: "node2",
      target: "node3",
      // label: "Flex<String>",
      color: "blue",
      sourceAnchor: 3,
      targetAnchor: 0,
    },
    {
      source: "node5",
      target: "node3",
      // label: "Function<String, String>",
      color: "darkgrey",
      sourceAnchor: 1,
      targetAnchor: 1,
    },
  ],
};

export default {
  node4, 
  data,
}