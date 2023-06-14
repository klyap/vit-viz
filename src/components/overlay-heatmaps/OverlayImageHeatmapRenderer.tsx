import { useMemo } from "react";
import * as d3 from "d3";
import { MARGIN } from "../constants";
import styles from "./renderer.module.css";
import { DataPoint, InteractionData } from "../types";

type RendererProps = {
  colorScale: d3.ScaleLinear<string, string, never>;
  data: DataPoint[];
  height: number;
  hoveredCell: InteractionData | null;
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
      .padding(0.01);
  }, [allXGroups, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand<string>()
      .range([0, height])
      .domain(allYGroups)
      .padding(0.01);
  }, [allYGroups, height]);

  const allRects = data.map((d, i) => {
    // + 0.001 to keep elements that have pos 0 from falling off the SVG
    const xPos = xScale(String(d.x)) + 0.001;
    const yPos = yScale(String(d.y)) + 0.001;

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

    const vals = data
      .map((d) => d.val)
      .filter((d): d is number => d !== null);
    const max = d3.max(vals) || 0;

    // const colorScale = d3.scaleLinear<string>()
    //   .domain(THRESHOLDS.map((t) => t * max))
    //   .range(COLORS);

    const opacityScale = d3.scaleLinear<string>()
      .domain([-3, max]);
    // .range([0, 1]);

    return (
      <g key={i}>
        <rect
          // fill={colorScale(d.val)}
          fill={'blue'}
          fillOpacity={d.val === -10 ? 1 : 1 - opacityScale(d.val)}
          height={yScale.bandwidth()}
          key={i}
          stroke={isHighlighted ? "blue" : "gray"}
          width={xScale.bandwidth()}
          x={xPos}
          y={yPos}
        />
        {/* <text
          fontSize="x-small"
          x={xPos + xScale.bandwidth() / 2 - 0.01}
          y={yPos + yScale.bandwidth() / 2 - 0.01}>
          {Number(d.val)}
        </text> */}
      </g>
    );
  });

  // console.log(hoveredCell?.xLabel, hoveredCell?.yLabel, (hoveredCell?.xLabel == 0 || hoveredCell?.yLabel == 0) && "border-solid border-color-blue");
  let clsHoverStyle = {};
  if ((hoveredCell?.xLabel == 0 || hoveredCell?.yLabel == 0)) {
    clsHoverStyle = {
      outlineColor: 'blue',
      outlineStyle: 'solid',
    };
  }
  return (
    <svg
      className={`absolute`}
      height={height}
      onMouseLeave={() => setHoveredCell(null)}
      style={clsHoverStyle}
      width={width}
    >
      <g
        height={height}
        // width={boundsWidth}
        // height={boundsHeight}
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
