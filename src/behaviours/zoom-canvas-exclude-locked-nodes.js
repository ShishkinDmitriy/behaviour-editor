const DELTA = 0.05;

export default {
  getDefaultCfg() {
    return {
      sensitivity: 1.2,
      minZoom: 0.2,
      maxZoom: 5,
      enableOptimize: false,
      optimizeZoom: 0.7,
    };
  },
  getEvents() {
    return {
      wheel: "onWheel",
    };
  },
  onWheel(e) {
    const graph = this.graph;
    e.preventDefault();
    if (!this.shouldUpdate || !this.shouldUpdate.call(this, e)) {
      return;
    }
    const canvas = graph.get("canvas");
    const point = canvas.getPointByClient(e.clientX, e.clientY);
    const sensitivity = this.get("sensitivity");
    let ratio = graph.getZoom();
    // 兼容IE、Firefox及Chrome
    if (e.wheelDelta < 0) {
      ratio = 1 - DELTA * sensitivity;
    } else {
      ratio = 1 + DELTA * sensitivity;
    }
    const zoom = ratio * graph.getZoom();
    if (zoom > this.get("maxZoom") || zoom < this.get("minZoom")) {
      return;
    }

    const enableOptimize = this.get("enableOptimize");
    if (enableOptimize) {
      const optimizeZoom = this.get("optimizeZoom");

      const currentZoom = graph.getZoom();
      const nodes = graph.getNodes();
      const edges = graph.getEdges();
      if (currentZoom < optimizeZoom) {
        nodes.map((node) => {
          if (!node.destroyed) {
            const children = node.getContainer().getChildren();
            children.map((shape) => {
              if (!shape.destroyed && !shape.get("isKeyShape")) {
                shape.hide();
              }
            });
          }
        });

        edges.map((edge) => {
          const children = edge.getContainer().getChildren();
          children.map((shape) => {
            if (!shape.get("isKeyShape")) {
              shape.hide();
            }
          });
        });
      } else {
        nodes.map((node) => {
          const children = node.getContainer().getChildren();
          children.map((shape) => {
            if (!shape.get("visible")) {
              shape.show();
            }
          });
        });

        edges.map((edge) => {
          const children = edge.getContainer().getChildren();
          children.map((shape) => {
            if (!shape.get("visible")) {
              shape.show();
            }
          });
        });
      }
    }
    graph.zoom(ratio, { x: point.x, y: point.y });
    graph
      .findAll("node", (node) => node.hasLocked())
      .forEach((node) => {
        const model = node.getModel();
        const { x, y } = graph.getPointByCanvas(model._x, model._y);
        const pos = {
          x,
          y,
          size: model._size.map((s) => s / graph.getZoom()),
          style: {
            lineWidth: 1 / graph.getZoom(),
          },
        };
        graph.updateItem(node, pos);
      });
    graph.emit("wheelzoom", e);
  },
};
