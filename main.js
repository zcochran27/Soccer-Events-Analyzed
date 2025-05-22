const canvas = document.getElementById("pitchCanvas");
const ctx = canvas.getContext("2d");

const pitchWidth = 120;
const pitchHeight = 80;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let firstClick = true;
let startPos = [-1, -1];
let endPos = [-1, -1];

let collectedStats = []; // Array to store all submitted data

function drawPitch() {
  const ctx = canvas.getContext("2d");

  // Clear the pitch
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dimensions in meters mapped to canvas scale
  const fieldWidth = 120; // meters
  const fieldHeight = 80; // meters
  const scaleX = canvas.width / fieldWidth;
  const scaleY = canvas.height / fieldHeight;

  ctx.strokeStyle = "#333";
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

function drawArrow(fromX, fromY, toX, toY) {
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

function scaleToPitch(x, y) {
  return [(x / canvasWidth) * pitchWidth, (y / canvasHeight) * pitchHeight];
}

function scaleToCanvas(x, y) {
  return [(x / pitchWidth) * canvasWidth, (y / pitchHeight) * canvasHeight];
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const [xPitch, yPitch] = scaleToPitch(x, y);

  if (xPitch < 0 || xPitch > 120 || yPitch < 0 || yPitch > 80) return;

  console.log(`Clicked at: (${xPitch.toFixed(2)}, ${yPitch.toFixed(2)})`);

  if (firstClick) {
    startPos = [xPitch, yPitch];
    // drawPitch();
    const [sx, sy] = scaleToCanvas(...startPos);
    ctx.beginPath();
    ctx.arc(sx, sy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    collectedStats.push([startPos]);
    firstClick = false;
  } else if (!firstClick && collectedStats[0].length == 1) {
    endPos = [xPitch, yPitch];
    // drawPitch();
    const [sx, sy] = scaleToCanvas(...startPos);
    const [ex, ey] = scaleToCanvas(...endPos);
    console.log(collectedStats);
    collectedStats[collectedStats.length - 1].push(endPos);
    drawArrow(sx, sy, ex, ey);
    // firstClick = true;
  } else {
    endPos = [xPitch, yPitch];
    startPos = collectedStats[collectedStats.length - 1][1];
    console.log(collectedStats);
    console.log(endPos, startPos);
    // drawPitch();
    const [sx, sy] = scaleToCanvas(...startPos);
    const [ex, ey] = scaleToCanvas(...endPos);
    ctx.beginPath();
    ctx.arc(ex, ey, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    collectedStats.push([startPos, endPos]);
    drawArrow(sx, sy, ex, ey);
  }
});
drawPitch();
