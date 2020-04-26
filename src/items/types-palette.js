const defaultColor = 'darkgrey';

const palette = {
  string: "blue",
  int: "lightgreen",
  RequestPredicate: "#ffa000",
  HandlerFunction: "grey",
  RouterFunction: "#00acc1",
};

export function getColor(type) {
  return palette[type] || defaultColor;
}