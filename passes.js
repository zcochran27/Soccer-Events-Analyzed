
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const lamineChanceLast5 = await fetch("lamine_chance_last_5.json");
const passes = await lamineChanceLast5.json();

function drawFootballPitch(svg) {
    // Pitch Boundary
    svg.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", 120).attr("height", 80)
      .attr("class", "line");
  
    // Halfway Line
    svg.append("line")
      .attr("x1", 60).attr("y1", 0)
      .attr("x2", 60).attr("y2", 80)
      .attr("class", "line");
  
    // Center Circle & Spot
    svg.append("circle")
      .attr("cx", 60).attr("cy", 40).attr("r", 9.15)
      .attr("class", "line");
  
    svg.append("circle")
      .attr("cx", 60).attr("cy", 40).attr("r", 0.2)
      .attr("fill", "black");
  
    // Penalty Areas
    svg.append("rect")
      .attr("x", 0).attr("y", 19.84)
      .attr("width", 16.5).attr("height", 40.32)
      .attr("class", "line");
  
    svg.append("rect")
      .attr("x", 103.5).attr("y", 19.84)
      .attr("width", 16.5).attr("height", 40.32)
      .attr("class", "line");
  
    // Goal Areas
    svg.append("rect")
      .attr("x", 0).attr("y", 30.84)
      .attr("width", 5.5).attr("height", 18.32)
      .attr("class", "line");
  
    svg.append("rect")
      .attr("x", 114.5).attr("y", 30.84)
      .attr("width", 5.5).attr("height", 18.32)
      .attr("class", "line");
  
    // Penalty Spots
    svg.append("circle")
      .attr("cx", 12).attr("cy", 40).attr("r", 0.2)
      .attr("fill", "black");
  
    svg.append("circle")
      .attr("cx", 108).attr("cy", 40).attr("r", 0.2)
      .attr("fill", "black");
  
    // Corner Arcs (inward-curving)
    svg.append("path")
      .attr("d", "M1,0 A1,1 0 0,0 0,1")
      .attr("class", "line");
  
    svg.append("path")
      .attr("d", "M0,79 A1,1 0 0,0 1,80")
      .attr("class", "line");
  
    svg.append("path")
      .attr("d", "M119,0 A1,1 0 0,1 120,1")
      .attr("class", "line");
  
    svg.append("path")
      .attr("d", "M120,79 A1,1 0 0,1 119,80")
      .attr("class", "line");
  
    // Arrowhead Markers
    const defs = svg.append("defs");
  
    defs.append("marker")
      .attr("id", "arrowgreen")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 2).attr("refY", 5)
      .attr("markerWidth", 4).attr("markerHeight", 4)
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "green");
  
    defs.append("marker")
      .attr("id", "arrowred")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 2).attr("refY", 5)
      .attr("markerWidth", 4).attr("markerHeight", 4)
      .attr("orient", "auto")
      .attr("markerUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "red");
  }
const svg1 = d3.select("#pitch1");
const defs = svg1.append("defs");
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

drawFootballPitch(svg1);
const tooltip1 = d3.select("body")
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
svg1.selectAll(".pass")
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
    tooltip1
      .style("opacity", 1)
      .html(`
        <strong>Pass</strong><br/>
        Outcome: ${d.outcome}<br/>
        Type: ${d.type}<br/>
        Height: ${getHeightLabel(d.height)}
      `);
  })
  .on("mousemove", (event) => {
    tooltip1
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY + 10) + "px");
  })
  .on("mouseout", () => {
    tooltip1.style("opacity", 0);
  });