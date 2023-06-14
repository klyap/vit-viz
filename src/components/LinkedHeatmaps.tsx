"use client"; // This is a client component 👈🏽

import { Heatmap } from './Heatmap';
import { data } from "../data/data-formatted-full";
import { ImageHeatmap } from './ImageHeatmap';
import { useState } from 'react';

const layerNames = Object.keys(data);
// const layerNamesSmall = [Object.keys(data)[0]];

const headNames = Object.keys(data.Layer_0);

const generateImageGridData = (numPatchesPerSide: number) => {
  const data = [];
  for (let i = 0; i < numPatchesPerSide; i++) {
    for (let j = 0; j < numPatchesPerSide; j++) {
      data.push({
        val: j * numPatchesPerSide + (i + 1),
        x: i,
        y: j,
      });
    }

  }
  return data;
};

export type InteractionData = {
  val: number | null;
  xLabel: string;
  xPos: number;
  yLabel: string;
  yPos: number;
};

export const LinkedHeatmaps = () => {

  const NUM_PATCHES_PER_SIDE = 7;
  const imgData = generateImageGridData(NUM_PATCHES_PER_SIDE);
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      {
        layerNames.map((layerName) => {
          return (
            <div key={layerName}>
              <h1>{layerName}</h1>
              {headNames.map((headName) => {
                const dataPts = data[layerName][headName].map((d) => ({ val: d.val, x: d.x, y: String(d.y) }));
                return (
                  <div key={`${layerName}${headName}`}>
                    {headName}
                    <Heatmap data={dataPts} height={300} hoveredCell={hoveredCell} setHoveredCell={setHoveredCell} width={250} />
                  </div>
                );
              })}
            </div>
          );
        })
      }

      <ImageHeatmap data={imgData} height={400} hoveredCell={hoveredCell} setHoveredCell={setHoveredCell} width={400} />
    </div>
  );
};
