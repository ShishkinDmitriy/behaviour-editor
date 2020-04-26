export function getTaskNodePort(e) {
  const { item, target } = e;
  if (!item) {
    return null;
  }
  const type = item.get("type");
  if (type !== "node") {
    return null;
  }
  const model = item.getModel();
  if (model.type === "task-input" || model.type === "task-output") {
    return {
      item: model.id,
      portType: target.get("portType"),
      anchorIndex: target.get("anchorIndex"),
      direction: target.get("direction"),
    };
  }
  if (!target.get("isPort")) {
    return null;
  }
  return {
    item: model.id,
    portType: target.get("portType"),
    anchorIndex: target.get("anchorIndex"),
    direction: target.get("direction"),
  };
}

export function isTaskCollapse(e) {
  const name = e.target.get("name");
  return name === "collapse-bg-shape" || name === "collapse-shape";
}
