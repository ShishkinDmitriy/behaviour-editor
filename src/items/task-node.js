import Color from "color";
import { getColor } from "@/items/types-palette";

function getWidthOfText(txt, fontname, fontsize) {
  if (getWidthOfText.c === undefined) {
    getWidthOfText.c = document.createElement("canvas");
    getWidthOfText.ctx = getWidthOfText.c.getContext("2d");
  }
  getWidthOfText.ctx.font = fontsize + " " + fontname;
  return getWidthOfText.ctx.measureText(txt).width * 1.5;
}

export default {
  options: {
    headerHeight: 24,
    portHeight: 20,
    paddingBottom: 5,
    styles: {
      rectStyle: {
        radius: 10,
        stroke: "#263238",
        lineWidth: 0.5,
        fill: "#9ccc65",
      },
      headerStyle: {
        fontSize: 14,
        fontWeight: "bold",
        fill: "#263238",
      },
      collapsedStyle: {
        fill: "#263238",
      },
      portBgStyle: {
        fill: "blue",
        opacity: 0.0
      },
      portLabelStyle: {
        fontSize: 11,
        fontWeight: "normal",
        fill: "#263238",
      },
      portCircleStyle: {
        r: 4,
        stroke: "#263238",
      },
    },
    stateStyles: {
      hover: {
        lighten: 0.1,
      },
      selected: {
        stroke: "white",
        lineWidth: 1,
      },
    },
  },
  draw(cfg, group) {
    const { headerHeight, portHeight } = this.options;
    const { rectStyle, headerStyle, portLabelStyle, portCircleStyle, portBgStyle, collapsedStyle } = this.options.styles;
    const mainGroup = group.addGroup({
      id: "main-group",
    });
    const inputs = cfg.inputs || [];
    const outputs = cfg.outputs || [];
    const height = this.getHieght(cfg);
    const width = this.getWidth(cfg);
    const rect = mainGroup.addShape("rect", {
      attrs: {
        ...rectStyle,
        x: -width / 2,
        y: -headerHeight / 2,
        width,
        height,
      },
      name: "main-rect",
      draggable: true,
    });
    mainGroup.addShape("text", {
      attrs: {
        ...headerStyle,
        x: 0,
        y: 0,
        textAlign: "center",
        textBaseline: "middle",
        text: cfg.label,
      },
      name: "main-text",
      draggable: true,
    });
    mainGroup.addShape("rect", {
      attrs: {
        ...portBgStyle,
        x: width / 2 - headerHeight,
        y: -headerHeight / 2,
        width: headerHeight,
        height: headerHeight,
      },
      name: "self-circle-bg",
      draggable: true,
      anchorIndex: inputs.length + outputs.length,
      isPort: true,
      direction: "output",
      portType: "output.type",
    });
    mainGroup.addShape("circle", {
      attrs: {
        ...portCircleStyle,
        x: width / 2 - headerHeight / 2,
        y: 0,
        r: 4,
        fill: getColor("input.type"),
      },
      name: `self-circle`,
      draggable: true,
      anchorIndex: inputs.length + outputs.length,
      isPort: true,
      direction: "output",
      portType: "input.type",
    });
    mainGroup.addShape("rect", {
      attrs: {
        ...portBgStyle,
        x: -width / 2,
        y: -headerHeight / 2,
        width: headerHeight,
        height: headerHeight,
      },
      isCollapse: true,
      name: "collapse-bg-shape",
      draggable: true,
    });
    mainGroup.addShape("path", {
      attrs: {
        ...collapsedStyle,
        path: this.getPath(cfg, {
          x: -width / 2 + headerHeight / 2,
          y: 0,
        }),
      },
      isCollapse: true,
      name: "collapse-shape",
      draggable: true,
    });
    const outputsGroup = group.addGroup({
      id: "outputs-group",
    });
    const inputsGroup = group.addGroup({
      id: "inputs-group",
    });
    if (!cfg.collapsed) {
      outputs.forEach((output, i) => {
        const outputGroup = outputsGroup.addGroup({
          id: `output-${output.name}-group`,
        });
        outputGroup.addShape("text", {
          attrs: {
            ...portLabelStyle,
            x: width / 2 - portHeight / 2,
            y: headerHeight / 2 + portHeight * (i + 0.5),
            textAlign: "right",
            textBaseline: "middle",
            text: output.name,
          },
          name: `output-${output.name}-text`,
          draggable: true,
        });
        outputGroup.addShape("rect", {
          attrs: {
            ...portBgStyle,
            x: width / 2 - portHeight / 2,
            y: headerHeight / 2 + portHeight * i,
            width: portHeight,
            height: portHeight,
          },
          name: `output-${output.name}-bg`,
          draggable: true,
          anchorIndex: i + inputs.length,
          isPort: true,
          direction: "output",
          portType: output.type,
        });
        outputGroup.addShape("circle", {
          attrs: {
            ...portCircleStyle,
            x: width / 2,
            y: headerHeight / 2 + portHeight * (i + 0.5),
            fill: getColor(output.type),
          },
          name: `output-${output.name}-circle`,
          draggable: true,
          anchorIndex: i + inputs.length,
          isPort: true,
          direction: "output",
          portType: output.type,
        });
      });
      inputs.forEach((input, i) => {
        const inputGroup = inputsGroup.addGroup({
          id: `input-${input.name}-group`,
        });
        const offset = headerHeight + outputs.length * portHeight;
        inputGroup.addShape("text", {
          attrs: {
            ...portLabelStyle,
            x: -width / 2 + portHeight / 2,
            y: -headerHeight / 2 + offset + portHeight * (i + 0.5),
            textAlign: "left",
            textBaseline: "middle",
            text: input.name,
          },
          name: `input-${input.name}-text`,
          draggable: true,
        });
        inputGroup.addShape("rect", {
          attrs: {
            ...portBgStyle,
            x: -width / 2 - portHeight / 2,
            y: -headerHeight / 2 + offset + portHeight * i,
            width: portHeight,
            height: portHeight,
          },
          name: `input-${input.name}-bg`,
          draggable: true,
          anchorIndex: i,
          isPort: true,
          direction: "input",
          portType: input.type,
        });
        inputGroup.addShape("circle", {
          attrs: {
            ...portCircleStyle,
            x: -width / 2,
            y: -headerHeight / 2 + offset + portHeight * (i + 0.5),
            fill: getColor(input.type),
          },
          name: `input-${input.name}-circle`,
          draggable: true,
          anchorIndex: i,
          isPort: true,
          direction: "input",
          portType: input.type,
        });
      });
    }
    return rect;
  },

  getPath(cfg, { x, y }) {
    const { collapsed, size = [8, 8] } = cfg;
    const [width, height] = size;
    const top = [x, y - height / 2];
    const right = [x + width / 2, y];
    const bottom = [x, y + height / 2];
    const left = [x - width / 2, y];
    if (collapsed) {
      return [["M", ...top], ["L", ...right], ["L", ...bottom], ["Z"]];
    } else {
      return [["M", ...right], ["L", ...bottom], ["L", ...left], ["Z"]];
    }
  },
  setState(name, value, item) {
    const { rectStyle, headerStyle, portLabelStyle, portCircleStyle, collapsedStyle } = this.options.styles;
    const { selected, hover } = this.options.stateStyles;
    const [mainGroup, outputsGroup, inputsGroup] = item.getContainer().get("children");
    const [rect, header, selfRect, selfCircle, collapseBg, collapsePath] = mainGroup.get("children");
    if (name.startsWith("hover-anchor-")) {
      const model = item.getModel();
      const inputs = model.inputs || [];
      const outputs = model.outputs || [];
      const inputsCount = inputs.length;
      const outputsCount = outputs.length;
      const index = parseInt(name.substring("hover-anchor-".length));
      if (index === inputsCount + outputsCount) {
        if (value) {
          selfCircle.attr("r", portCircleStyle.r * 1.25);
        } else {
          selfCircle.attr("r", portCircleStyle.r);
        }
      }
      if (index < inputsCount) {
        const input = inputsGroup.get("children")[index];
        const [text, _, circle] = input.get("children");
        if (value) {
          text.attr("fontWeight", "bold");
          circle.attr("r", portCircleStyle.r * 1.25);
        } else {
          text.attr("fontWeight", portLabelStyle.fontWeight);
          circle.attr("r", portCircleStyle.r);
        }
      } else {
        const output = outputsGroup.get("children")[inputsCount - index];
        if (!output) {
          return;
        }
        const [text, _, circle] = output.get("children");
        if (value) {
          text.attr("fontWeight", "bold");
          circle.attr("r", portCircleStyle.r * 1.25);
        } else {
          text.attr("fontWeight", portLabelStyle.fontWeight);
          circle.attr("r", portCircleStyle.r);
        }
      }
      return;
    }
    switch (name) {
      case "selected": {
        if (value) {
          Object.entries(selected).forEach(([k, v]) => rect.attr(k, v));
          header.attr("fill", "white");
        } else {
          Object.entries(rectStyle).forEach(([k, v]) => rect.attr(k, v));
          header.attr("fill", headerStyle.fill);
        }
        break;
      }
      case "hover": {
        if (value) {
          const fill = rect.attr("fill");
          const color = Color(fill).lighten(hover.lighten);
          rect.attr("fill", color.hex());
        } else {
          rect.attr("fill", rectStyle.fill);
        }
        break;
      }
      case "hover-collapse": {
        if (value) {
          collapsePath.attr("fill", '#888');
        } else {
          collapsePath.attr("fill", collapsedStyle.fill);
        }
        break;
      }
    }
  },
  getAnchorPoints(cfg) {
    const { headerHeight, portHeight } = this.options;
    const inputs = cfg.inputs || [];
    const outputs = cfg.outputs || [];
    const height = this.getHieght(cfg);
    const width = this.getWidth(cfg);
    if (cfg.collapsed) {
      return [...inputs.map((_) => [0, 0.5]), ...outputs.map((_) => [1, 0.5]), [1 - headerHeight / 2 / width, 0.5]];
    }
    const inputAnchors = inputs.map((_, i) => [0, (headerHeight + portHeight * (i + 0.5) + outputs.length * portHeight) / height]);
    const outputAnchors = outputs.map((_, i) => [1, (headerHeight + portHeight * (i + 0.5)) / height]);
    return [...inputAnchors, ...outputAnchors, [1 - headerHeight / 2 / width, headerHeight / 2 / height]];
  },
  getHieght(cfg) {
    const { headerHeight, portHeight, paddingBottom } = this.options;
    if (cfg.collapsed) {
      return headerHeight;
    }
    const inputs = cfg.inputs || [];
    const outputs = cfg.outputs || [];
    return headerHeight + portHeight * (inputs.length + outputs.length) + paddingBottom;
  },
  getWidth(cfg) {
    const label = cfg.label || "";
    const { headerStyle } = this.options.styles;
    const w = getWidthOfText(label, headerStyle.fontFamily, headerStyle.fontSize);
    return 50 + w;
  },
};
