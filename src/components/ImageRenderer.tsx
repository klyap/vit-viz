import { useMemo } from "react";
import * as d3 from "d3";
import { InteractionData } from "./ImageHeatmap";
import { MARGIN } from "../constants";
import styles from "./renderer.module.css";
import { DataPoint } from "../types";

type RendererProps = {
  colorScale: d3.ScaleLinear<string, string, never>;
  data: DataPoint[];
  height: number;
  hoveredCell: InteractionData | null;
  setHoveredCell: (hoveredCell: InteractionData | null) => void;
  width: number;
};

export const ImageRenderer = ({
  width,
  height,
  data,
  hoveredCell,
  setHoveredCell,
  colorScale,
}: RendererProps) => {
  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allYGroups = useMemo(() => [...new Set(data.map((d) => String(d.y)))], [data]);
  const allXGroups = useMemo(
    () => [...new Set(data.map((d) => String(d.x)))],
    [data]
  );

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, width])
      .domain(allXGroups)
      .padding(0.1);
  }, [allXGroups, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand<string>()
      .range([0, height])
      .domain(allYGroups)
      .padding(0.1);
  }, [allYGroups, height]);

  const allRects = data.map((d, i) => {
    const xPos = xScale(String(d.x));
    const yPos = yScale(String(d.y));

    if (d.val === null || !xPos || !yPos) {
      return;
    }

    // hoveredCell to imageCell
    // yLabel and xLabel are 1 indexed because 0th index is CLS
    const cellA = Number(hoveredCell?.yLabel);
    const cellB = Number(hoveredCell?.xLabel);
    let isHighlighted = false;
    if ((cellA && cellA == d.val) || (cellB && cellB == d.val)) {
      isHighlighted = true;
    }

    return (
      <g key={i}>
        <rect
          fill={"none"}
          height={yScale.bandwidth()}
          key={i}
          stroke={isHighlighted ? "blue" : "gray"}
          width={xScale.bandwidth()}
          x={xPos}
          y={yPos}
        />
        <text
          x={xPos + xScale.bandwidth() / 2}
          y={yPos + yScale.bandwidth() / 2}>
          {d.val}
        </text>
      </g>
    );
  });

  return (
    <svg
      height={height}
      onMouseLeave={() => setHoveredCell(null)}
      style={{ position: "absolute" }}
      width={width}
    >
      <g
        // width={boundsWidth}
        // height={boundsHeight}
        height={height}
        width={width}
      // transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
        {/* {xLabels}
        {yLabels} */}
      </g>
    </svg>
  );
};
