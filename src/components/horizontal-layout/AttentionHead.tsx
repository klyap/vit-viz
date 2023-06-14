"use client"; // This is a client component 👈🏽

import { useState } from "react";
import { AttentionHeadRenderer } from "./AttentionHeadRenderer";
import { Tooltip } from "../Tooltip";
// import { ColorLegend } from "./ColorLegend";
import { max as d3_max, scaleLinear } from "d3";
import { COLORS, THRESHOLDS, COLOR_LEGEND_HEIGHT } from "../../constants";
import { DataPoint, InteractionData } from "../../types";

type HeatmapProps = {
  data: DataPoint[];
  height: number;
  //{ x: number; y: string | number; val: number | null }[];
  hoveredCell: InteractionData | null;
  setHoveredCell: (hoveredCell: InteractionData | null) => void;
  width: number;
};

export const AttentionHead = ({ width, height, data, hoveredCell, setHoveredCell }: HeatmapProps) => {

  // Color scale is computed here bc it must be passed to both the renderer and the legend
  const vals = data
    .map((d) => d.val)
    .filter((d): d is number => d !== null);
  const max = d3_max(vals) || 0;

  const colorScale = scaleLinear<string>()
    .domain(THRESHOLDS.map((t) => t * max))
    .range(COLORS);

  return (
    <div style={{ position: "relative" }}>
      <AttentionHeadRenderer
        colorScale={colorScale}
        data={data}
        height={height - COLOR_LEGEND_HEIGHT}
        hoveredCell={hoveredCell}
        setHoveredCell={setHoveredCell}
        width={width}
      />
      <Tooltip
        height={height - COLOR_LEGEND_HEIGHT}
        interactionData={hoveredCell}
        width={width}
      />
      {/* <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <ColorLegend
          height={COLOR_LEGEND_HEIGHT}
          width={200}
          colorScale={colorScale}
          interactionData={hoveredCell}
        />
      </div> */}
    </div>
  );
};
