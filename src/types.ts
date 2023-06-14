
export type HeadNames =
  "Head_0" |
  "Head_1"

export type DataPoint = {
  val: number,
  x: number,
  y: number
}

type LayerNames = "Layer_0" | "Layer_1"

export type Dataset = {
  [K in HeadNames]: {
    [K in LayerNames]: DataPoint[]
  }
}

export type InteractionData = {
  val: number | null;
  xLabel: string;
  xPos: number;
  yLabel: string;
  yPos: number;
};
