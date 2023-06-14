"use client"; // This is a client component 👈🏽

import { data } from "../../data/data-formatted-full";
import { useState } from 'react';
import { DataPoint, InteractionData } from '../../types';
import { OverlayImageHeatmap } from './OverlayImageHeatmap';
import { AttentionHead } from './AttentionHead';

const layerNames = Object.keys(data);
// Small
// const layerNames = [Object.keys(data)[0]];

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

  const getCLSDataPts = (dataPts: DataPoint[], isBackwards: boolean) => {
    // const output = [];
    const x = isBackwards ? "y" : "x";
    const y = isBackwards ? "x" : "y";
    return imgData.map((d) => {
      // d.y is the square number (imgData d.val) that CLS is looking at
      const correspondingPt = dataPts.find((data: DataPoint) => Number(data[x]) === 0 && Number(data[y]) === Number(d.val));
      if (correspondingPt) {
        const actualValue = correspondingPt.val;
        return { ...d, val: Number(actualValue) };
      } else {
        return { ...d, val: 100 };
      }
    });

    // return output;
  };

  const IMG_DIM = 100;

  return (
    <>
      {/* <div className={'h-[500px] flex justify-center'}>
        <OverlayImageHeatmap data={imgData} height={400} hoveredCell={hoveredCell} setHoveredCell={setHoveredCell} width={400} />
      </div> */}
      <div className="flex-col font-mono text-sm">
        {
          layerNames.map((layerName) => {
            return (
              <div className={"space-y-2.5 flex"} key={layerName}>
                <h1>{layerName}</h1>
                <div className={'flex flex-col'}>
                  <div className={'flex'}>
                    {headNames.map((headName) => {
                      const dataPts = data[layerName][headName].map((d: DataPoint) => ({ val: d.val, x: d.x, y: String(d.y) }));
                      // console.log(headName, getCLSDataPts(dataPts, false));
                      return (
                        <div className={"space-x-1.5"} key={`${layerName}${headName}`}  >
                          <h2>{`${headName} CLS x`}</h2>
                          <OverlayImageHeatmap data={getCLSDataPts(dataPts, false)} height={IMG_DIM} hoveredCell={hoveredCell} setHoveredCell={setHoveredCell} width={IMG_DIM} />
                        </div>
                      );
                    })}
                  </div>
                  <div className={'flex'}>
                    {headNames.map((headName) => {
                      const dataPts = data[layerName][headName].map((d: DataPoint) => ({ val: d.val, x: d.x, y: String(d.y) }));

                      return (
                        < div className={"space-x-1.5"} key={`${layerName}${headName}`}>
                          {/* <AttentionHead data={dataPts} height={250} hoveredCell={hoveredCell} key={`${layerName}${headName}`} setHoveredCell={setHoveredCell} width={190} /> */}
                          <h2>{`${headName} CLS y`}</h2>
                          <OverlayImageHeatmap data={getCLSDataPts(dataPts, true)} height={IMG_DIM} hoveredCell={hoveredCell} setHoveredCell={setHoveredCell} width={IMG_DIM} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div >
            );
          })
        }
      </div >
    </>
  );
};
