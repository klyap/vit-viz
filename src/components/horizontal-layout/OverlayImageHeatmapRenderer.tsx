import { useMemo } from "react";
import * as d3 from "d3";
import { MARGIN } from "../../constants";
import styles from "../renderer.module.css";
import { DataPoint, InteractionData } from "../../types";

type RendererProps = {
  colorScale: d3.ScaleLinear<string, string, never>;
  data: DataPoint[];
  height: number;
  hoveredCell: InteractionData | null,
  setHoveredCell: (hoveredCell: InteractionData | null) => void;
  width: number;
};

export const OverlayImageHeatmapRenderer = ({
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

  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(
    () => [...new Set(data.map((d) => String(d.x)))],
    [data]
  );

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.1);
  }, [data, width, allXGroups, boundsWidth]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand<string>()
      .range([0, boundsHeight])
      .domain(allYGroups)
      .padding(0.1);
  }, [data, height]);

  const allRects = data.map((d, i) => {
    const xPos = xScale(String(d.x));
    const yPos = yScale(String(d.y));

    if (d.val === null || !xPos || !yPos) {
      return;
    }
    let isHighlighted = false;
    if (hoveredCell && hoveredCell.yLabel == d.y && hoveredCell.xLabel == d.x) {
      isHighlighted = true;
    }
    return (
      <rect
        fill={d.val ? colorScale(d.val) : "#F8F8F8"}
        height={yScale.bandwidth()}
        key={i}
        onMouseEnter={(e) => {
          setHoveredCell({
            xLabel: String(d.x),
            yLabel: d.y,
            xPos: xPos + xScale.bandwidth() + MARGIN.left,
            yPos: yPos + xScale.bandwidth() / 2 + MARGIN.top,
            val: d.val ? Math.round(d.val * 100) / 100 : null,
          });
        }}
        stroke={isHighlighted ? "blue" : "none"}
        x={xPos}
        y={yPos}
        className={styles.hoverRect}
        // className={styles.rectangle}
        width={xScale.bandwidth()}
      />
    );
  });

  const xLabels = allXGroups.map((name, i) => {
    if (name && Number(name) % 10 === 0) {
      return (
        <text
          dominantBaseline="middle"
          fill="black"
          fontSize={10}
          key={i}
          stroke="none"
          textAnchor="middle"
          x={xScale(name)}
          y={boundsHeight + 10}
        >
          {name}
        </text>
      );
    }
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name);
    if (yPos && i % 2 === 0) {
      return (
        <text
          dominantBaseline="middle"
          fontSize={10}
          key={i}
          textAnchor="end"
          x={-5}
          y={yPos + yScale.bandwidth() / 2}
        >
          {name}
        </text>
      );
    }
  });

  return (
    <svg
      height={height}
      onMouseLeave={() => setHoveredCell(null)}
      width={width}
    >
      <g
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        width={boundsWidth}
      >
        {allRects}
        {xLabels}
        {yLabels}
      </g>
    </svg>
  );
};
