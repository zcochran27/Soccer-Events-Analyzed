import { updatePredictBtn } from "./Buttons";
import { drawArrow } from "./Draw";
import {
  pitchHeight,
  pitchWidth,
  shotTaken,
  collectedStats,
  passNumber,
  dribbles,
  lastEndPos,
  changePassNumber,
  changeLastEndPos,
  changeDribbles,
} from "./Values";

let startPos = [-1, -1];
let endPos = [-1, -1];

export let clickPhase = 0;
export function changeClickPhase(phase) {
  clickPhase = phase;
}

export function scaleToPitch(x, y, canvas) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  return [(x / canvasWidth) * pitchWidth, (y / canvasHeight) * pitchHeight];
}

export function scaleToCanvas(x, y, canvas) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  return [(x / pitchWidth) * canvasWidth, (y / pitchHeight) * canvasHeight];
}

export const clickEvent = (
  event,
  ctx,
  canvas,
  passType,
  passHeight,
  predictBtn
) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const [xPitch, yPitch] = scaleToPitch(x, y, canvas);

  if (xPitch < 0 || xPitch > 120 || yPitch < 0 || yPitch > 80) return;

  if (collectedStats.length >= 5) {
    alert("Maximum 5 passes reached!");
    return;
  }
  if (shotTaken) {
    alert("Cannot add pass after shooting!");
    return;
  }

  const [cx, cy] = scaleToCanvas(xPitch, yPitch, canvas);

  console.log(collectedStats, cx, cy, clickPhase);

  switch (clickPhase) {
    case 0: // First click - green start dot
      startPos = [xPitch, yPitch];
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();
      clickPhase = 1;
      break;

    case 1: // Second click - red dot and solid arrow (first real pass)
      endPos = [xPitch, yPitch];
      const [sx1, sy1] = scaleToCanvas(...startPos, canvas);
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      drawArrow(sx1, sy1, cx, cy, ctx);
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("pass " + passNumber, (sx1 + cx) / 2, (sy1 + cy) / 2 - 10);
      console.log(startPos, endPos);
      collectedStats.push({
        start: startPos,
        end: endPos,
        pass_outcome: 1,
        pass_type: passType,
        pass_height: passHeight,
      });

      changePassNumber(passNumber + 1);
      changeLastEndPos(endPos);
      updatePredictBtn(predictBtn);
      clickPhase = 2;
      break;

    case 2: // Third click - dashed arrow = dribble
      startPos = [xPitch, yPitch];
      const [sx2, sy2] = scaleToCanvas(...lastEndPos, canvas);
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(sx2, sy2);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = "gray";
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();

      // Save dribble

      dribbles.push({
        start: lastEndPos,
        end: [xPitch, yPitch],
      });

      clickPhase = 3;
      break;

    case 3: // Fourth click - pass
      endPos = [xPitch, yPitch];
      const [sx3, sy3] = scaleToCanvas(...startPos, canvas);
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      drawArrow(sx3, sy3, cx, cy, ctx);
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("pass " + passNumber, (sx3 + cx) / 2, (sy3 + cy) / 2 - 10);

      collectedStats.push({
        start: startPos,
        end: endPos,
        pass_outcome: 1,
        pass_type: passType,
        pass_height: passHeight,
      });

      changePassNumber(passNumber + 1);
      changeLastEndPos(endPos);
      updatePredictBtn(predictBtn);
      clickPhase = 2; // return to dashed line phase
      break;
  }
};

export function isDribbleMode() {
  const toggle = document.getElementById("dribbleToggle");
  if (!toggle) {
    console.warn("Dribble toggle element missing!");
    return false;
  }
  console.log("Dribble mode:", toggle.checked);
  return toggle.checked;
}
