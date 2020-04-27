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
  let conextMenuContainer;

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
          "drag-group",
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
          },
          // {
          //   type: 'tooltip',
          //   formatText: function formatText(model) {
          //     const text = 'description: ' + model.description;
          //     return text;
          //   },
          //   offset: 30
          // },
          // {
          //   type: 'edge-tooltip',
          //   formatText: function formatText(model) {
          //     const text = 'description: ' + model.description;
          //     return text;
          //   },
          //   offset: 30
          // },
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
      },
      groupType: 'rect',
      groupStyle: {
        default: {
            fill: '#cccccc11',
            radius: 10,
        },
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

    graph.on("dblclick", e => {
      const nodes = graph.getNodes().map(item => item.getModel());
      const edges = graph.getEdges().map(item => item.getModel());
      console.log(JSON.stringify({nodes, edges}));
    });
    graph.on('node:contextmenu', evt => {
      evt.preventDefault();
      evt.stopPropagation();
      conextMenuContainer.style.left = `${evt.x + 20}px`;
      conextMenuContainer.style.top = `${evt.y}px`;
    });

    graph.on('node:mouseleave', () => {
      conextMenuContainer.style.left = '-150px';
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
  :global(.g6-tooltip) {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
  #contextMenu {
    position: absolute;
    list-style-type: none;
    padding: 10px 8px;
    left: -150px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
  }
  #contextMenu li {
    cursor: pointer;
		list-style-type:none;
    list-style: none;
    margin-left: 0px;
  }
  #contextMenu li:hover {
    color: #aaa;
  }
</style>

<div id="mountNode" style={`width: ${width}px; height: ${height}px`}>
  <div class="left pane" style={`width: ${paneWidth}px`} />
  <div class="right pane" style={`width: ${paneWidth}px`} />
</div>

<ul id="contextMenu" 
	bind:this={conextMenuContainer}>
  <li>option 1</li>
  <li>option 2</li>
</ul>