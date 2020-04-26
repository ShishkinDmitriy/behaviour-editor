const defaultColor = 'darkgrey';

const palette = {
  string: "blue",
  int: "lightgreen",
};

export function getColor(type) {
  return palette[type] || defaultColor;
}