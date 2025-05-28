
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const lamineChanceLast5 = await fetch("lamine_chance_last_5.json");
const passes = await lamineChanceLast5.json();
const svg = d3.select("#pitch");

const defs = svg.append("defs");

passes.forEach((d, i) => {
  const color = d.outcome === 1.0 ? "green" : "red";
  const strokeWidth = 1 + i * 0.1; // adjust multiplier as needed

  defs.append("marker")
    .attr("id", `arrow-${i}`)
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 2)
    .attr("refY", 5)
    .attr("markerWidth", strokeWidth) // scale arrow size with stroke
    .attr("markerHeight", strokeWidth)
    .attr("orient", "auto")
    .attr("markerUnits", "strokeWidth")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("fill", color);
});

const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "rgba(0,0,0,0.7)")
  .style("color", "white")
  .style("padding", "6px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none") // so it doesn't block mouse events
  .style("opacity", 0);

function getHeightLabel(height) {
    switch (height) {
      case 0:
        return "Ground";
      case 1:
        return "Low";
      case 2:
        return "High";
      default:
        return "unknown";
    }
  }
svg.selectAll(".pass")
  .data(passes)
  .join("line")
  .attr("class", "pass")
  .attr("x1", d => d.start[0])
  .attr("y1", d => d.start[1])
  .attr("x2", d => d.end[0])
  .attr("y2", d => d.end[1])
  .attr("stroke", d => d.outcome === 1.0 ? "green" : "red")
  .attr("stroke-width", (d, i) => .5 + i * .2)
  .attr("marker-end", (d, i) => `url(#arrow-${i})`)
  .on("mouseover", (event, d) => {
    tooltip
      .style("opacity", 1)
      .html(`
        <strong>Pass</strong><br/>
        Outcome: ${d.outcome}<br/>
        Type: ${d.type}<br/>
        Height: ${getHeightLabel(d.height)}
      `);
  })
  .on("mousemove", (event) => {
    tooltip
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY + 10) + "px");
  })
  .on("mouseout", () => {
    tooltip.style("opacity", 0);
  });