<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import dragPort from "@/behaviours/drag-task-port-create-edge";
  import dragCanvas from "@/behaviours/drag-canvas-exclude-locked-nodes";
  import zoomCanvas from "@/behaviours/zoom-canvas-exclude-locked-nodes";
  import taskNode from "@/items/task-node";
  import { registerHover } from "@/callbacks/hover-callbacks";
  import { getTaskNodePort, isTaskCollapse } from "@/behaviours/util";

  export let width = 1800;
  export let height = 700;
  export let paneWidth = 100;
  export let data;
  console.log(data);

  const dispatch = createEventDispatcher();

  onMount(async () => {
    const G6 = (await import("@antv/g6")).default;
    G6.registerBehavior("drag-task-port-create-edge", dragPort);
    G6.registerBehavior("drag-canvas-exclude-locked-nodes", dragCanvas);
    G6.registerBehavior("zoom-canvas-exclude-locked-nodes", zoomCanvas);
    G6.registerNode("task-node", taskNode);
    G6.registerNode("task-input", {}, "circle");
    G6.registerNode("task-output", {}, "circle");

    const graph = new G6.Graph({
      container: "mountNode",
      width,
      height,
      modes: {
        default: [
          "drag-canvas-exclude-locked-nodes",
          "zoom-canvas-exclude-locked-nodes",
          "drag-task-port-create-edge",
          {
            type: "drag-node",
            shouldBegin: e => !getTaskNodePort(e)
          },
          {
            type: "click-select",
            trigger: "ctrl",
            shouldUpdate: e => !isTaskCollapse(e) && !getTaskNodePort(e)
          },
          {
            type: "brush-select",
            trigger: "shift",
            includeEdges: false
          }
        ]
      },
      plugins: [new G6.Grid(), new G6.Minimap()],
      defaultEdge: {
        labelCfg: {
          autoRotate: true,
          style: {
            background: {
              fill: "#ffffff",
              padding: [4, 4, 4, 4]
              // stroke: "#263238",
              // radius: 4,
            },
            // fill: "#263238",
            fontSize: 9
          }
        },
        type: "cubic-horizontal",
        style: {
          lineWidth: 2,
          lineAppendWidth: 8
        }
      },
      defaultNode: {
        type: "task-node"
      },
      edgeStateStyles: {
        hover: {
          lineWidth: 3
        }
      }
    });

    data.nodes
      .filter(node => node.type === "task-input" || node.type === "task-output")
      .forEach((node, i) => {
        node.x = node.type === "task-input" ? paneWidth : width - paneWidth;
        node.y = paneWidth / 2 + 24 * i;
        node.size = [10];
        node._x = node.x;
        node._y = node.y;
        node._size = node.size;
      });

    graph.data(data);
    graph.render();

    graph
      .findAll("node", node => {
        const model = node.getModel();
        return model.type === "task-input" || model.type === "task-output";
      })
      .forEach(node => {
        node.lock();
        node.toFront();
      });

    registerHover(graph);
    graph.on("node:click", e => {
      if (!isTaskCollapse(e)) {
        return;
      }
      const nodeItem = e.item;
      const model = nodeItem.getModel();
      graph.updateItem(nodeItem, {
        collapsed: !model.collapsed
      });
    });

    graph.on("node:dblclick", e => {
      if (isTaskCollapse(e)) {
        return;
      }
      if (getTaskNodePort(e)) {
        return;
      }
      dispatch("node-dblclick", e.item.getModel().id);
    });

    graph.on("keyup", e => {
      const code = e.key;
      if (!code) {
        return;
      }
      if (code.toLowerCase() === "delete") {
        graph
          .findAllByState("node", "selected")
          .forEach(node => graph.remove(node));
      }
    });
  });
</script>

<style>
  #mountNode {
    position: relative;
  }
  .pane {
    position: absolute;
    height: 100%;
    background-color: grey;
    opacity: 0.2;
    pointer-events: none;
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
</style>

<div id="mountNode" style={`width: ${width}px; height: ${height}px`}>
  <div class="left pane" style={`width: ${paneWidth}px`} />
  <div class="right pane" style={`width: ${paneWidth}px`} />
</div>
