import { InteractionData } from "./ImageHeatmap";
import styles from "./tooltip.module.css";

type TooltipProps = {
  height: number;
  interactionData: InteractionData | null;
  width: number;
};

export const Tooltip = ({ interactionData, width, height }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    // Wrapper div: a rect on top of the viz area
    <div
      style={{
        height,
        left: 0,
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        width,
      }}
    >
      {/* The actual box with white background */}
      <div
        className={styles.tooltip}
        style={{
          left: interactionData.xPos,
          position: "absolute",
          top: interactionData.yPos,
        }}
      >
        <span>{interactionData.yLabel}</span>
        <br />
        <span>{interactionData.xLabel}</span>
        <span>: </span>
        <b>{interactionData.val}</b>
      </div>
    </div>
  );
};
