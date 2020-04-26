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
      id: "node2",
      label: "ToString",
      x: 200,
      y: 200,
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
      x: 800,
      y: 400,
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
      x: 1000,
      y: 500,
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
      x: 700,
      y: 500,
      outputs: [
        {
          name: "value",
          type: "int",
        },
      ],
    },
  ],
  edges: [
  ],
};
