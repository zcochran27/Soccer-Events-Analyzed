const pitchWidth = 120;
const pitchHeight = 80;
const goalCoords = [120, 40]; // Center of goal on right side

let firstClick = true;
let startPos = [-1, -1];
let endPos = [-1, -1];
let shotTaken = false;

let collectedStats = []; // Array to store all submitted data

export function drawPitch(ctx, canvas) {
  // Clear the pitch
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dimensions in meters mapped to canvas scale
  const fieldWidth = 120; // meters
  const fieldHeight = 80; // meters
  const scaleX = canvas.width / fieldWidth;
  const scaleY = canvas.height / fieldHeight;

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;

  // Draw outer boundary
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Midline
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  // Center circle
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 9.15 * scaleX, 0, 2 * Math.PI);
  ctx.stroke();

  // Center point
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 1.5, 0, 2 * Math.PI);
  ctx.fill();

  // Left penalty area
  ctx.strokeRect(
    0,
    (canvas.height - 40 * scaleY) / 2,
    18 * scaleX,
    40 * scaleY
  );
  // Right penalty area
  ctx.strokeRect(
    canvas.width - 18 * scaleX,
    (canvas.height - 40 * scaleY) / 2,
    18 * scaleX,
    40 * scaleY
  );

  // Left 6-yard box
  ctx.strokeRect(0, (canvas.height - 18 * scaleY) / 2, 6 * scaleX, 18 * scaleY);
  // Right 6-yard box
  ctx.strokeRect(
    canvas.width - 6 * scaleX,
    (canvas.height - 18 * scaleY) / 2,
    6 * scaleX,
    18 * scaleY
  );

  // Penalty spots
  ctx.beginPath();
  ctx.arc(11 * scaleX, canvas.height / 2, 1.5, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas.width - 11 * scaleX, canvas.height / 2, 1.5, 0, 2 * Math.PI);
  ctx.fill();

  // Set a uniform scale (important)
  const scale = canvas.width / 120; // assuming 120m field length
  const pitchHeight = 80 * scale;
  const centerY = canvas.height / 2;

  // Penalty spot positions
  const leftX = 11 * scale;
  const rightX = canvas.width - 12 * scale;

  // Arc radius (9.15m)
  const r = 9.15 * scale;

  const leftPenaltyX = 12 * scale;

  // Draw top quarter
  ctx.beginPath();
  ctx.arc(leftPenaltyX, centerY, r, 1.71 * Math.PI, 2 * Math.PI);
  ctx.stroke();

  // Draw bottom quarter
  ctx.beginPath();
  ctx.arc(leftPenaltyX, centerY, r, 0, 0.29 * Math.PI);
  ctx.stroke();
  // RIGHT penalty arc (same, flipped direction)
  ctx.beginPath();
  ctx.arc(rightX, centerY, r, 1.28 * Math.PI, 0.72 * Math.PI, true); // top half, reversed
  ctx.stroke();

  // Corner arcs
  [0, canvas.width].forEach((x) => {
    [0, canvas.height].forEach((y) => {
      ctx.beginPath();
      ctx.arc(x, y, 1 * scaleX, 0, 0.5 * Math.PI);
      if (x === 0 && y === 0) ctx.arc(x, y, 1 * scaleX, 0, 0.5 * Math.PI);
      if (x === 0 && y === canvas.height)
        ctx.arc(x, y, 1 * scaleX, 1.5 * Math.PI, 2 * Math.PI);
      if (x === canvas.width && y === 0)
        ctx.arc(x, y, 1 * scaleX, 0.5 * Math.PI, Math.PI);
      if (x === canvas.width && y === canvas.height)
        ctx.arc(x, y, 1 * scaleX, Math.PI, 1.5 * Math.PI);
      ctx.stroke();
    });
  });
}

function drawArrow(fromX, fromY, toX, toY, ctx) {
  const headlen = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.lineTo(toX, toY);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
}

function scaleToPitch(x, y, canvas) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  return [(x / canvasWidth) * pitchWidth, (y / canvasHeight) * pitchHeight];
}

function scaleToCanvas(x, y, canvas) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  return [(x / pitchWidth) * canvasWidth, (y / pitchHeight) * canvasHeight];
}

let firstPassComplete = false;
let lastRedDot = null;
let passIndex = 1;
let dribbleCount = 0;
let passCount = 0;
let passNumber = 1;
let dribbleNumber = 1;

export const clickEvent = (event, ctx, canvas) => {
  console.log(dribbleNumber, passNumber, collectedStats.length);
  if (dribbleNumber > 5 && isDribbleMode()) {
    alert("Maximum 5 dribbles reached!");
    return;
  }
  if (passNumber > 5 && !isDribbleMode()) {
    alert("Maximum 5 passes reached!");
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const [xPitch, yPitch] = scaleToPitch(x, y, canvas);

  if (xPitch < 0 || xPitch > 120 || yPitch < 0 || yPitch > 80) return;
  const currentIsDribble = isDribbleMode();

  if (!firstPassComplete) {
    if (firstClick) {
      startPos = [xPitch, yPitch];
      const [sx, sy] = scaleToCanvas(...startPos, canvas);

      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();

      firstClick = false;
    } else {
      endPos = [xPitch, yPitch];
      const [sx, sy] = scaleToCanvas(...startPos, canvas);
      const [ex, ey] = scaleToCanvas(...endPos, canvas);

      if (lastRedDot) {
        const [lx, ly] = lastRedDot;
        ctx.beginPath();
        ctx.arc(lx, ly, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      const mx = (sx + ex) / 2;
      const my = (sy + ey) / 2;

      if (isDribbleMode()) {
        // Dashed orange line for dribble
        ctx.save();
        ctx.strokeStyle = "orange";
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Label
        ctx.fillStyle = "orange";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("dribble " + dribbleNumber, mx, my - 10);
        console.log("Drawing dribble line");
        dribbleNumber++;
      } else {
        drawArrow(sx, sy, ex, ey, ctx);

        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("pass " + passNumber, mx, my - 10);
        passNumber++;
      }

      collectedStats.push({
        type: isDribbleMode() ? "dribble" : "pass",
        start: startPos,
        end: endPos,
      });
      if (currentIsDribble) {
        dribbleCount++;
      } else {
        passCount++;
      }
      // updatePredictBtn();

      lastRedDot = [ex, ey];
      firstPassComplete = true;
      firstClick = true;
      console.log("Drawing pass arrow");
    }
  } else {
    const lastEnd = collectedStats[collectedStats.length - 1].end;
    startPos = lastEnd;
    endPos = [xPitch, yPitch];
    const [sx, sy] = scaleToCanvas(...startPos, canvas);
    const [ex, ey] = scaleToCanvas(...endPos, canvas);

    if (lastRedDot) {
      const [lx, ly] = lastRedDot;
      ctx.beginPath();
      ctx.arc(lx, ly, 6, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
    }
    // Draw new red dot
    ctx.beginPath();
    ctx.arc(ex, ey, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    if (isDribbleMode()) {
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
      ctx.fillText(
        "dribble " + dribbleNumber,
        (sx + ex) / 2,
        (sy + ey) / 2 - 10
      );
      dribbleNumber++;
    } else {
      drawArrow(sx, sy, ex, ey, ctx);

      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("pass " + passNumber, (sx + ex) / 2, (sy + ey) / 2 - 10);
      passNumber++;
    }

    collectedStats.push({
      type: isDribbleMode() ? "dribble" : "pass",
      start: startPos,
      end: endPos,
    });
    // updatePredictBtn();
    if (collectedStats.length === 10) {
      const lastEnd = collectedStats[collectedStats.length - 1].end;
      const [lx, ly] = scaleToCanvas(...lastEnd, canvas);
      const [gx, gy] = scaleToCanvas(...goalCoords, canvas);

      // Draw dashed shot line
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(gx, gy);
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Label above shot line
      const midX = (lx + gx) / 2;
      const midY = (ly + gy) / 2;
      ctx.fillStyle = "green";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("shot!", midX, midY - 10);

      // Highlight prediction box in green
      const resultDiv = document.getElementById("predictionResult");
      resultDiv.style.backgroundColor = "#c1f0c1"; // light green
      resultDiv.style.border = "2px solid green";
      resultDiv.style.padding = "4px";
      resultDiv.style.display = "inline-block";
    }

    lastRedDot = [ex, ey];
  }
};

// document.getElementById("predictBtn").addEventListener("click",
export const predictBtn = async (predictionResult) => {
  if (collectedStats.length === 0) {
    alert("Please create at least one pass before predicting.");
    return;
  }

  const formatted = collectedStats.flatMap(({ start, end }) => [
    start[0],
    start[1],
    end[0],
    end[1],
    1, // dummy placeholder for outcome
  ]);

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

    shotTaken = false;
    shootBtn.disabled = false;
    lastRedDot = [ex, ey];
  });

  updatePredictBtn();
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
  shotTaken = false;

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

  shotTaken = true;
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

function updatePredictBtn(predictBtn) {
  if (collectedStats.length === 12) {
    predictBtn.classList.add("active");
    predictBtn.disabled = false;
  } else {
    predictBtn.classList.remove("active");
    predictBtn.disabled = true;
  }
}

// Dribbling

// const dribbleToggle = document.getElementById("dribbleToggle");
function isDribbleMode() {
  const toggle = document.getElementById("dribbleToggle");
  if (!toggle) {
    console.warn("Dribble toggle element missing!");
    return false;
  }
  console.log("Dribble mode:", toggle.checked);
  return toggle.checked;
}

// drawPitch();
// updatePredictBtn();
