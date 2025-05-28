import { clickPhase, scaleToCanvas, changeClickPhase } from "./ClickEvents";
import { drawPitch } from "./DrawPitch";
import { drawArrow, drawDribbles, drawEventFromStats } from "./Draw";
import {
  goalCoords,
  collectedStats,
  shotTaken,
  changeShotTaken,
  changePassCount,
  changePassNumber,
  passCount,
  passNumber,
  changeLastRedDot,
  changeFirstPassComplete,
  changeCollectedStats,
  dribbles,
  changeLastEndPos,
  changePassIndex,
  changeDribbleIndex,
  changeDribbles,
} from "./Values";

export const predictBtn = async (predictionResult) => {
  if (collectedStats.length === 0) {
    alert("Please create at least one pass before predicting.");
    return;
  }

  const reversedStats = collectedStats.reverse();
  console.log(reversedStats);
  const formatted = reversedStats.flatMap(
    ({ start, end, pass_type, pass_height }) => [
      start[0],
      start[1],
      end[0],
      end[1],
      1,
      pass_type,
      pass_height,
    ]
  );

  console.log(formatted);

  try {
    const response = await fetch(
      "https://soccer-events-analyzed.onrender.com/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features: formatted }),
      }
    );

    const result = await response.json();

    if (result.prediction !== undefined) {
      predictionResult.innerText = `Prediction: ${result.prediction.toFixed(
        4
      )}`;
    } else {
      predictionResult.innerText = `Error: ${result.error}`;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    predictionResult.innerText = `Fetch error: ${error}`;
  } finally {
    collectedStats.reverse(); // Restore original order
    console.log(collectedStats);
  }
};

export const undoBtn = (predictBtn, ctx, canvas, shootBtn) => {
  if (collectedStats.length === 0 && dribbles.length === 0) return;

  console.log(
    "Before undo - Stats:",
    collectedStats.length,
    "Dribbles:",
    dribbles.length
  );

  changeShotTaken(false);
  shootBtn.disabled = false;

  // If we're in the middle of a dribble (clickPhase 3), just remove the current dribble
  if (clickPhase === 3) {
    changeDribbles(dribbles.slice(0, -1));
    clickPhase = 2; // Set clickPhase directly
    drawPitch(ctx, canvas);
    collectedStats.forEach((event, index) =>
      drawEventFromStats(event, index, ctx, canvas)
    );
    drawDribbles(ctx, canvas);
    updatePredictBtn(predictBtn);
    return;
  }

  // If we have passes, remove the last pass
  if (collectedStats.length > 0) {
    console.log(collectedStats);
    collectedStats.pop();
    console.log(collectedStats);
    changePassNumber(Math.max(1, passNumber - 1));
    console.log(passNumber);
    // If this was the last pass and we have dribbles, remove the last dribble too
    if (dribbles.length > 0) {
      dribbles.pop();
    }
  }

  // Update the state
  changeFirstPassComplete(collectedStats.length > 0);
  changeLastRedDot(null);

  // If we removed everything, reset to initial state
  if (collectedStats.length === 0) {
    changeLastEndPos(null);
    changeClickPhase(0);
  } else {
    console.log(collectedStats);
    changeLastEndPos(collectedStats[collectedStats.length - 1].end);
    changeClickPhase(2); // Set clickPhase directly
  }

  // Redraw everything
  drawPitch(ctx, canvas);
  changePassIndex(0);
  changeDribbleIndex(0);
  collectedStats.forEach((event, index) =>
    drawEventFromStats(event, index, ctx, canvas)
  );
  drawDribbles(ctx, canvas);
  updatePredictBtn(predictBtn);

  console.log(
    "After undo - Stats:",
    collectedStats.length,
    "Dribbles:",
    dribbles.length
  );
};

export const clearPassesBtn = (ctx, canvas, shootBtn, predictBtn) => {
  changeCollectedStats([]);
  changeFirstPassComplete(false);
  changeLastRedDot(null);
  changePassIndex(1);
  changeDribbleCount(0);
  changePassCount(0);
  changePassNumber(1);
  changeDribbleNumber(1);
  changeShotTaken(false);

  // Redraw the pitch
  drawPitch(ctx, canvas);

  predictBtn.classList.remove("activate-predict");
  predictBtn.disabled = false;
  shootBtn.disabled = false;
  shootBtn.classList.remove("active-predict");
};

// document.getElementById("shootBtn").addEventListener("click",
export const shootBtn = (shoot, predict, canvas, ctx) => {
  if (collectedStats.length === 0) {
    alert("Add at least one event before shooting!");
    return;
  }

  changeShotTaken(true);
  const lastEnd = collectedStats[collectedStats.length - 1].end;
  const [lx, ly] = scaleToCanvas(...lastEnd, canvas);
  const [gx, gy] = scaleToCanvas(...goalCoords, canvas);

  // Draw dashed shot line
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(lx, ly);
  ctx.lineTo(gx, gy);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Label above shot line
  const midX = (lx + gx) / 2;
  const midY = (ly + gy) / 2;
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("shot!", midX, midY - 10);

  shoot.disabled = true;

  predict.classList.add("activate-predict");
  predict.disabled = false;
};

export function updatePredictBtn(predictBtn) {
  if (collectedStats.length >= 5) {
    predictBtn.classList.add("active");
    predictBtn.disabled = false;
  } else {
    predictBtn.classList.remove("active");
    predictBtn.disabled = true;
  }
}
