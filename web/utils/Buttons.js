import { scaleToCanvas } from "./ClickEvents";
import { drawPitch } from "./DrawPitch";
import { drawArrow } from "./Draw";
import {
  goalCoords,
  collectedStats,
  shotTaken,
  changeShotTaken,
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

// document.getElementById("undoBtn").addEventListener("click",
export const undoBtn = (predictBtn, ctx, canvas) => {
  if (collectedStats.length === 0) return;

  const last = collectedStats.pop(); // You forgot to define 'last'

  if (last.type === "dribble") {
    dribbleCount = Math.max(0, dribbleCount - 1);
    dribbleNumber = Math.max(1, dribbleNumber - 1);
  } else {
    passCount = Math.max(0, passCount - 1);
    passNumber = Math.max(1, passNumber - 1);
  }

  firstPassComplete = collectedStats.length > 0;
  lastRedDot = null;

  // Redraw the entire pitch and passes
  drawPitch(ctx, canvas);

  collectedStats.forEach((event, index) => {
    const { type, start, end } = event;
    const [sx, sy] = scaleToCanvas(...start, canvas);
    const [ex, ey] = scaleToCanvas(...end, canvas);

    // Draw start dot
    if (index === 0) {
      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();
    } else {
      const prevEnd = collectedStats[index - 1].end;
      const [psx, psy] = scaleToCanvas(...prevEnd, canvas);
      ctx.beginPath();
      ctx.arc(psx, psy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
    }

    // Draw end dot
    ctx.beginPath();
    ctx.arc(ex, ey, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    // Draw event line
    const midX = (sx + ex) / 2;
    const midY = (sy + ey) / 2;
    if (type === "dribble") {
      ctx.save();
      ctx.strokeStyle = "orange";
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.fillStyle = "orange";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("dribble " + (index + 1), midX, midY - 10);
    } else {
      drawArrow(sx, sy, ex, ey, ctx);
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("pass " + (index + 1), midX, midY - 10);
    }

    changeShotTaken(false);
    shootBtn.disabled = false;
    lastRedDot = [ex, ey];
  });

  updatePredictBtn(predictBtn);
};

export const clearPassesBtn = (ctx, canvas, shootBtn, predictBtn) => {
  collectedStats = [];
  firstPassComplete = false;
  lastRedDot = null;
  passIndex = 1;
  dribbleCount = 0;
  passCount = 0;
  passNumber = 1;
  dribbleNumber = 1;
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
