import { scaleToCanvas } from "./ClickEvents";

export function drawArrow(fromX, fromY, toX, toY, ctx) {
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

export function drawEventFromStats(event, index, ctx, canvas) {
  const { start, end } = event;
  const [sx, sy] = scaleToCanvas(...start, canvas);
  const [ex, ey] = scaleToCanvas(...end, canvas);

  // if (index === 0) {
  ctx.beginPath();
  ctx.arc(sx, sy, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(ex, ey, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  const midX = (sx + ex) / 2;
  const midY = (sy + ey) / 2;

  drawArrow(sx, sy, ex, ey, ctx);
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("pass " + (index + 1), midX, midY - 10);

  lastRedDot = [ex, ey];
}
