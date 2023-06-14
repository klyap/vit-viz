"use client"; // This is a client component 👈🏽

import { data } from "../../data/data-formatted-full";
import { useState } from 'react';
import { DataPoint } from '../../types';
import { OverlayImageHeatmap } from './OverlayImageHeatmap';
import { AttentionHead } from './AttentionHead';

// const layerNames = Object.keys(data);
// Small
const layerNames = [Object.keys(data)[0]];

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

export const SmallerLinkedHeatmaps = () => {

  const NUM_PATCHES_PER_SIDE = 7;
  const imgData = generateImageGridData(NUM_PATCHES_PER_SIDE);
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

  return (
    <>
      <div className={'h-[500px] flex justify-center'}>
        <OverlayImageHeatmap data={imgData} height={400} hoveredCell={hoveredCell} setHoveredCell={setHoveredCell} width={400} />
      </div>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {
          layerNames.map((layerName) => {
            return (
              <div key={layerName} style={{ display: 'flex' }}>
                <h1>{layerName}</h1>
                {headNames.map((headName) => {
                  const dataPts = data[layerName][headName].map((d: DataPoint) => ({ val: d.val, x: d.x, y: String(d.y) }));
                  return (
                    <AttentionHead data={dataPts} height={250} hoveredCell={hoveredCell} key={`${layerName}${headName}`} setHoveredCell={setHoveredCell} width={190} />
                  );
                })}
              </div>
            );
          })
        }
      </div>
    </>
  );
};
