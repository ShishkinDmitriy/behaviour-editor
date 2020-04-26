import { getTaskNodePort } from "@/behaviours/util";
import { getColor } from "@/items/types-palette";

export default {
  getDefaultCfg() {
    return {
      hoverState: "hover",
      hoverPortState: (port) => `hover-anchor-${port.anchorIndex}`,
    };
  },
  getEvents() {
    return {
      "node:dragstart": "onNodeDragstart",
      "node:drag": "onNodeDrag",
      "node:dragend": "onNodeDragend",
      "edge:dragstart": "onEdgeDragstart",
      "edge:drag": "onNodeDrag",
      "edge:dragend": "onNodeDragend",
      dragenter: "onDragenter",
      dragleave: "onDragleave",
    };
  },
  onNodeDragstart(e) {
    const port = getTaskNodePort(e);
    if (!port) {
      return;
    }
    this.item = port.item;
    this.inverse = port.direction === "input";
    this[this.inverse ? "targetPort" : "sourcePort"] = port;
    this.edge = this.graph.addItem("edge", {
      [this.inverse ? "target" : "source"]: port.item,
      [this.inverse ? "targetAnchor" : "sourceAnchor"]: port.anchorIndex,
      [this.inverse ? "source" : "target"]: { x: e.x, y: e.y },
      color: getColor(port.portType),
      style: {
        lineWidth: 3,
      },
    });
  },
  onEdgeDragstart(e) {
    const item = e.item;
    const model = item.getModel();
    const startPoint = model.startPoint;
    const endPoint = model.endPoint;
    const pointer = { x: e.x, y: e.y };
    const lenToSource = Math.abs(pointer.x - startPoint.x) + Math.abs(pointer.y - startPoint.y);
    const lenToTarget = Math.abs(pointer.x - endPoint.x) + Math.abs(pointer.y - endPoint.y);
    if (lenToSource < lenToTarget){
      this.inverse = true;
      this.item = item.getTarget().getModel().id;
    } else {
      this.inverse = false;
      this.item = item.getSource().getModel().id;
    }
    this.edge = item;
    this[this.inverse ? "targetPort" : "sourcePort"] = {
      item: this.item,
      portType: this.inverse ? item.getTarget().getModel().type : item.getSource().getModel().type,
      anchorIndex: this.inverse ? endPoint.index : startPoint.index,
      direction: this.inverse ? "input" : "output",
    };
    this.graph.updateItem(this.edge, {
      [this.inverse ? "source" : "target"]: pointer,
      style: {
        lineWidth: 3,
      },
    });
  },
  onNodeDrag(e) {
    if (!this.edge) {
      return;
    }
    if (!this.sourcePort || !this.targetPort) {
      this.graph.updateItem(this.edge, {
        [this.inverse ? "source" : "target"]: { x: e.x, y: e.y },
      });
    }
  },
  onNodeDragend(_) {
    if (this.edge && (!this.sourcePort || !this.targetPort)) {
      this.graph.removeItem(this.edge);
    }
    if (this.edge) {
      this.graph.updateItem(this.edge, {
        style: {
          lineWidth: 2,
        },
      });
    }
    if (this.sourcePort && this.targetPort) {
      this.graph
        .findById(this.targetPort.item)
        .getInEdges()
        .filter((edge) => edge.getModel().targetAnchor === this.targetPort.anchorIndex)
        .filter((edge) => edge !== this.edge)
        .forEach((edge) => this.graph.removeItem(edge));
    }
    this.item = null;
    this.sourcePort = null;
    this.targetPort = null;
    this.inverse = null;
    this.edge = null;
  },
  onDragenter(e) {
    const port = this.getExternalPort(e);
    if (!port) {
      return;
    }
    this[this.inverse ? "sourcePort" : "targetPort"] = port;
    this.graph.updateItem(this.edge, {
      [this.inverse ? "source" : "target"]: port.item,
      [this.inverse ? "sourceAnchor" : "targetAnchor"]: port.anchorIndex,
    });
    const node = this.graph.findById(port.item);
    this.graph.setItemState(node, this.hoverPortState(port), true);
  },
  onDragleave(e) {
    const port = this.getExternalPort(e);
    if (!port) {
      return;
    }
    this[this.inverse ? "sourcePort" : "targetPort"] = null;
    const node = this.graph.findById(port.item);
    node
      .getStates()
      .filter((state) => state.startsWith("hover"))
      .forEach((state) => this.graph.setItemState(node, state, false));
  },
  getExternalPort(e) {
    if (!this.edge) {
      return null;
    }
    const port = getTaskNodePort(e);
    if (!port) {
      return null; // Filter not port targets
    }
    if (port.item === this.item) {
      return null; // Filter self contained port
    }
    if (this.inverse ? port.direction === "input" : port.direction === "output") {
      return null; // Filter wrong direction port
    }
    return port;
  },
};
