import { getTaskNodePort, isTaskCollapse } from "@/behaviours/util";

const HOVER_STATE = "hover";
const HOVER_COLLAPSE_STATE = "hover-collapse";
const HOVER_ANCHOR_PREFIX = "hover-anchor-";
const hoverAnchorState = (anchor) => `${HOVER_ANCHOR_PREFIX}${anchor.anchorIndex}`;

export function registerHover(graph) {
  graph.on("node:mouseenter", (e) => {
    const nodeItem = e.item;
    const anchor = getTaskNodePort(e);
    if (anchor) {
      graph.setItemState(nodeItem, hoverAnchorState(anchor), true);
      return;
    }
    if (isTaskCollapse(e)) {
      graph.setItemState(nodeItem, HOVER_COLLAPSE_STATE, true);
      return;
    }
    graph.setItemState(nodeItem, HOVER_STATE, true);
  });
  graph.on("node:mousemove", (e) => {
    const nodeItem = e.item;
    const anchor = getTaskNodePort(e);
    nodeItem
      .getStates()
      .filter((state) => state.startsWith(HOVER_STATE))
      .forEach((state) => graph.setItemState(nodeItem, state, false));
    if (anchor) {
      graph.setItemState(nodeItem, hoverAnchorState(anchor), true);
      return;
    }
    if (isTaskCollapse(e)) {
      graph.setItemState(nodeItem, HOVER_COLLAPSE_STATE, true);
      return;
    }
    graph.setItemState(nodeItem, HOVER_STATE, true);
  });
  graph.on("node:mouseleave", (e) => {
    const nodeItem = e.item;
    nodeItem
      .getStates()
      .filter((state) => state.startsWith(HOVER_STATE))
      .forEach((state) => graph.setItemState(nodeItem, state, false));
  });

  graph.on("edge:mouseenter", (e) => {
    const nodeItem = e.item;
    graph.setItemState(nodeItem, HOVER_STATE, true);
  });
  graph.on("edge:mouseleave", (e) => {
    const nodeItem = e.item;
    graph.setItemState(nodeItem, HOVER_STATE, false);
  });
}
