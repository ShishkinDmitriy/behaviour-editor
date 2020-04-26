import { cloneEvent } from "@antv/g6/lib/util/base";

const DRAG_OFFSET = 10;
const ALLOW_EVENTS = ["shift", "ctrl", "alt", "control"];

export default {
  getDefaultCfg() {
    return {
      direction: "both",
    };
  },
  getEvents() {
    return {
      dragstart: "onMouseDown",
      drag: "onMouseMove",
      dragend: "onMouseUp",
      "canvas:click": "onMouseUp",
      keyup: "onKeyUp",
      keydown: "onKeyDown",
    };
  },
  updateViewport(e) {
    const { origin, graph } = this;
    const clientX = +e.clientX;
    const clientY = +e.clientY;

    if (isNaN(clientX) || isNaN(clientY)) {
      return;
    }
    let dx = clientX - origin.x;
    let dy = clientY - origin.y;
    if (this.get("direction") === "x") {
      dy = 0;
    } else if (this.get("direction") === "y") {
      dx = 0;
    }
    this.origin = {
      x: clientX,
      y: clientY,
    };
    const width = graph.get("width");
    const height = graph.get("height");
    const graphCanvasBBox = graph.get("canvas").getCanvasBBox();
    if (graphCanvasBBox.minX + dx > width || graphCanvasBBox.maxX + dx < 0) {
      dx = 0;
    }
    if (graphCanvasBBox.minY + dy > height || graphCanvasBBox.maxY + dy < 0) {
      dy = 0;
    }
    let ratio = graph.getZoom();
    const lockedNodes = graph.findAll("node", (node) => node.hasLocked());
    lockedNodes.forEach((node) => {
      const model = node.get("model");
      const pos = {
        x: model.x - dx / ratio,
        y: model.y - dy / ratio,
      };
      //node.get("group").translate(-dx / ratio, -dy / ratio);
      graph.updateItem(node, pos);
    });
    graph.translate(dx, dy);
    graph.paint();
  },
  onMouseDown(e) {
    if (this.keydown || e.shape) {
      return;
    }
    this.origin = { x: e.clientX, y: e.clientY };
    this.dragging = false;
  },
  onMouseMove(e) {
    const { graph } = this;
    if (this.keydown || e.shape) {
      return;
    }
    e = cloneEvent(e);
    if (!this.origin) {
      return;
    }
    if (!this.dragging) {
      if (Math.abs(this.origin.x - e.clientX) + Math.abs(this.origin.y - e.clientY) < DRAG_OFFSET) {
        return;
      }
      if (this.shouldBegin.call(this, e)) {
        e.type = "dragstart";
        graph.emit("canvas:dragstart", e);
        this.dragging = true;
      }
    } else {
      e.type = "drag";
      graph.emit("canvas:drag", e);
    }
    if (this.shouldUpdate.call(this, e)) {
      this.updateViewport(e);
    }
  },
  onMouseUp(e) {
    const { graph } = this;
    if (this.keydown || e.shape) {
      return;
    }

    if (!this.dragging) {
      this.origin = null;
      return;
    }

    e = cloneEvent(e);

    if (this.shouldEnd.call(this, e)) {
      this.updateViewport(e);
    }
    e.type = "dragend";
    graph.emit("canvas:dragend", e);
    this.endDrag();
  },
  endDrag() {
    this.origin = null;
    this.dragging = false;
    this.dragbegin = false;
  },
  onKeyDown(e) {
    const self = this;
    const code = e.key;
    if (!code) {
      return;
    }
    if (ALLOW_EVENTS.indexOf(code.toLowerCase()) > -1) {
      self.keydown = true;
    } else {
      self.keydown = false;
    }
  },
  onKeyUp() {
    this.keydown = false;
  },
};
