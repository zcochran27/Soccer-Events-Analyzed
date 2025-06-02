import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import scrollama from "https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm";


// const playerContainer = document.querySelector('.player');
//   if (playerContainer) {
//     const ytDiv = document.createElement('div');
//     ytDiv.id = 'yt-player';
//     playerContainer.appendChild(ytDiv);
//   }

// Load YouTube iframe API
function handleStep(stepIndex, element) {
  // Remove active classes from all graphics
  document.querySelectorAll('.graphic-item').forEach(item =>
    item.classList.remove('active')
  );

  // Add active class to the matched graphic
  const graphicToShow = document.getElementById(`graphic-item-${stepIndex + 1}`);
  if (graphicToShow) {
    graphicToShow.classList.add('active');
  }

  // Remove active from all steps, add to current
  document.querySelectorAll('.step').forEach(step =>
    step.classList.remove('active')
  );
  element.classList.add('active');

  // Your custom logic for step 0 (e.g., start video)
  if (stepIndex === 0) {
    startVideoLoop?.();
  } else {
    stopVideoLoop?.();
  }
}

window.onYouTubeIframeAPIReady = function () {
  console.log('YouTube Iframe API ready, creating player');
  player = new YT.Player('yt-player', {
    height: 315,
    width: 560,
    videoId: '8nQRnTSDwLs',
    playerVars: {
      start: 311,
      end: 322,
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      mute: 1,
    },
    events: {
      'startVideoLoop': startVideoLoop,
      'stopVideoLoop': stopVideoLoop
    }
  });
};

// Load YouTube iframe API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// Create YouTube player container
const playerContainer = document.querySelector('.player');
if (playerContainer && !document.getElementById('yt-player')) {
  const ytDiv = document.createElement('div');
  ytDiv.id = 'yt-player';
  playerContainer.appendChild(ytDiv);
}

let player;
let checkInterval = null;
const VIDEO_STEP_INDEX = 0; // step-1 => graphic-item-1

function startVideoLoop() {
  if (!player) return;
  player.seekTo(311);
  player.playVideo();
  clearInterval(checkInterval);
  checkInterval = setInterval(() => {
    if (player.getCurrentTime() >= 322) {
      player.seekTo(311);
    }
  }, 500);
}

function stopVideoLoop() {
  if (player) {
    player.pauseVideo();
    clearInterval(checkInterval);
  }
}

const scroller = scrollama();

// Set up Scrollama
scroller
  .setup({
    step: ".step",
    offset: 0.3,
    debug: false,
  })
  .onStepEnter(response => {
    const stepIndex = Array.from(document.querySelectorAll('.step')).indexOf(response.element);

    // Remove 'active' from all graphic-items
    document.querySelectorAll('.graphic-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add 'active' class to the matching graphic-item
    const graphicToShow = document.getElementById(`graphic-item-${stepIndex + 1}`);
    if (graphicToShow) {
      graphicToShow.classList.add('active');
    }

    // Optional: Highlight current step
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    response.element.classList.add('active');

    if (stepIndex === VIDEO_STEP_INDEX) {
      startVideoLoop();
    } else {
      stopVideoLoop();
    }

  });

// Recalculate dimensions on resize
window.addEventListener('resize', scroller.resize);
window.addEventListener('load', () => {
  const firstStep = document.querySelector('.step');
  if (firstStep) {
    scroller.resize();
    handleStep(0, firstStep);
  }
});


const lamineChanceLast5 = await fetch("lamine_chance_last_5.json");
const passes = await lamineChanceLast5.json();
let passesV2 = passes.slice(0, 4);
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
  const strokeWidth = 1.2 + i * 0.1; // adjust multiplier as needed

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
const pathPoints = passes.flatMap(pass => [pass.start, pass.end]);

// Convert [x, y] pairs to {x, y} objects
const points = pathPoints.map(([x, y]) => ({ x, y }));
console.log(points);

// Append ball image
const BALL_SIZE = 6; // adjust to suit scale
const ball = svg1.append("image")
  .attr("href", "assets/Soccerball.png")
  .attr("width", BALL_SIZE)
  .attr("height", BALL_SIZE)
  .attr("x", -BALL_SIZE / 2)
  .attr("y", -BALL_SIZE / 2)

// Define line generator
// const line = d3.line()
//   .x(d => d.x)
//   .y(d => d.y)
//   .curve(d3.curveLinear);

// // Append path
// const path = svg1.append("path")
//   .datum(points)
//   .attr("d", line)
//   .attr("fill", "none")
//   .attr("stroke", "none");
// // Animate the ball along the path
// function animateBall() {
//   const totalLength = path.node().getTotalLength();

//   ball
//     .attr("transform", "translate(0,0)")
//     .transition()
//     .duration(7000)
//     .ease(d3.easeLinear)
//     .attrTween("transform", function() {
//       return function(t) {
//         const point = path.node().getPointAtLength(t * totalLength);
//         return `translate(${point.x},${point.y})`;
//       };
//     });
// }

//   animateBall(); // call once
// const segments = [];
// for (let i = 0; i < pathPoints.length - 1; i += 2) {
//   segments.push([pathPoints[i], pathPoints[i + 1]]);
// }
function animateSegments(index = 0) {
  if (index >= points.length - 1) return; // stop at last segment

  const start = points[index];
  const end = points[index + 1];
  const duration = (index / 2 % 2 === 0) ? 1000 : 1500;  // Alternate speed per segment
  const easefn = index % 2 === 0 ? d3.easeLinear : d3.easeCubicInOut;

  ball
    .attr("x", start.x - BALL_SIZE / 2)
    .attr("y", start.y - BALL_SIZE / 2)
    .transition(easefn)
    .duration(duration)
    .attr("x", end.x - BALL_SIZE / 2)
    .attr("y", end.y - BALL_SIZE / 2)
    .on("end", () => animateSegments(index + 1));
}
animateSegments();

// Optional: loop every 5 seconds
setInterval(animateSegments, 18000);


const reversedPasses = passes.reverse();
const passesFormatted = reversedPasses.flatMap(({ start, end, type, outcome, height }) => [
  start[0], start[1],
  end[0], end[1],
  outcome,
  type,
  getHeightLabel(height)
]);
const resultBox = document.getElementById("yamalChancexG");
try {
  const response = await fetch("https://soccer-events-analyzed.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features: passesFormatted })
  });

  const result = await response.json();
  if (result.prediction !== undefined) {
    resultBox.innerText = `The pass sequence xG for this play is ${result.prediction.toFixed(4)}. But what would have happened if the the last pass was played differently? Click the options below to explore.`;
  } else {
    resultBox.innerText = `Error: ${result.error}`;
  }
} catch (error) {
  resultBox.innerText = `Fetch error: ${error}`;
}
async function sendApiRequest(passesFormatted){
  const resultBox = document.getElementById("yamalChancexG");
try {
  const response = await fetch("https://soccer-events-analyzed.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features: passesFormatted })
  });

  const result = await response.json();
  if (result.prediction !== undefined) {
    resultBox.innerText = `The pass sequence xG for this play is ${result.prediction.toFixed(4)}. But what would have happened if the the last pass was played differently? Click the options below to explore.`;
  } else {
    resultBox.innerText = `Error: ${result.error}`;
  }
} catch (error) {
  resultBox.innerText = `Fetch error: ${error}`;
}
}
setInterval(sendApiRequest, 10*60*1000);

const svg2 = d3.select("#pitch2");
const lamineOptions = await fetch("lamineOptions.json");
const lamineOptionsData = await lamineOptions.json();
const endPoints = Object.values(lamineOptionsData).map(d => d.end);
const startPoint = lamineOptionsData.option1.start;
const defs2 = svg2.append("defs");
passesV2.forEach((d, i) => {
  const color = d.outcome === 1.0 ? "green" : "red";
  const strokeWidth = 1.2 + i * 0.1; // adjust multiplier as needed

  defs2.append("marker")
    .attr("id", `arrow2-${i}`)
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
defs2.append("marker")
  .attr("id", "arrow2green")
  .attr("viewBox", "0 0 10 10")
  .attr("refX", 2).attr("refY", 5)
  .attr("markerWidth", 4).attr("markerHeight", 4)
  .attr("orient", "auto")
  .attr("markerUnits", "userSpaceOnUse")
  .append("path")
  .attr("d", "M 0 0 L 10 5 L 0 10 z")
  .attr("fill", "green");

defs2.append("marker")
  .attr("id", "arrow2red")
  .attr("viewBox", "0 0 10 10")
  .attr("refX", 2).attr("refY", 5)
  .attr("markerWidth", 4).attr("markerHeight", 4)
  .attr("orient", "auto")
  .attr("markerUnits", "userSpaceOnUse")
  .append("path")
  .attr("d", "M 0 0 L 10 5 L 0 10 z")
  .attr("fill", "red");
drawFootballPitch(svg2);

const tooltip2 = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "rgba(0,0,0,0.7)")
  .style("color", "white")
  .style("padding", "6px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none") // so it doesn't block mouse events
  .style("opacity", 0);

svg2.selectAll(".pass")
  .data(passesV2)
  .join("line")
  .attr("class", "pass")
  .attr("x1", d => d.start[0])
  .attr("y1", d => d.start[1])
  .attr("x2", d => d.end[0])
  .attr("y2", d => d.end[1])
  .attr("stroke", d => d.outcome === 1.0 ? "green" : "red")
  .attr("stroke-width", (d, i) => .5 + i * .2)
  .attr("marker-end", (d, i) => `url(#arrow2-${i})`)


svg2.append("circle")
  .attr("cx", startPoint[0])
  .attr("cy", startPoint[1])
  .attr("r", 1)
  .attr("fill", "black");
svg2.append("text")
  .attr("x", startPoint[0] - 8) // slight offset to the right
  .attr("y", startPoint[1] + .8) // slight offset above
  .text("Start")
  .attr("font-size", "3px")
  .attr("fill", "black");
svg2.selectAll(".option-circle")
  .data(endPoints)
  .enter()
  .append("circle")
  .attr("class", "option-circle")
  .attr("cx", d => d[0])
  .attr("cy", d => d[1])
  .attr("r", 1)
  .attr("fill", "blue")
  .on("click", async (event, d) => {
    svg2.selectAll(".selected-arrow").remove();
    // Draw new arrow
    svg2.append("line")
      .attr("class", "selected-arrow")
      .attr("x1", startPoint[0])
      .attr("y1", startPoint[1])
      .attr("x2", d[0])
      .attr("y2", d[1])
      .attr("stroke", 'green')
      .attr("stroke-width", (d, i) => .5 + 5 * .2)
      .attr("marker-end", "url(#arrow2green)");
    if (passesV2.length === 5) {
      passesV2 = passesV2.slice(0, 4)
    }
    passesV2.push({
      "outcome": 1.0,
      "start": [85.3, 34.5],
      "end": [d[0], d[1]],
      "type": "Pass",
      "height": 0.0
    });

    try {
      const reversedPassesV2 = passesV2.reverse();
      const passesFormattedV2 = reversedPassesV2.flatMap(({ start, end, type, outcome, height }) => [
        start[0], start[1],
        end[0], end[1],
        outcome,
        type,
        getHeightLabel(height)
      ]);
      const response = await fetch("https://soccer-events-analyzed.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: passesFormattedV2 })
      });

      const result = await response.json();
      if (result.prediction !== undefined) {
        tooltip2
          .style("opacity", 1)
          .html(`
                        Pass sequence xG: ${result.prediction.toFixed(4)}.      
                    `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      } else {
        tooltip2.innerText = `Error: ${result.error}`;
      }
    } catch (error) {
      tooltip2.innerText = `Fetch error: ${error}`;
    }
    passesV2 = passesV2.reverse();
  });

svg2.selectAll(".option-label")
  .data(endPoints)
  .enter()
  .append("text")
  .attr("class", "option-label")
  .attr("x", d => d[0] - 9)  // use d[0] for x
  .attr("y", d => d[1] + 1)  // use d[1] for y
  .text((d, i) => "Option " + (i + 1))
  .attr("font-size", "2px")
  .attr("fill", "black")
  .style("pointer-events", "none");


let euroSequences = await d3.csv("europe_sequences_preds.csv").then(function (data) {
  const updatedData = data.map(d => {
    // Convert strings to numbers if needed
    const cut_back = +d.pass_cut_back;
    const switchPass = +d.pass_switch;
    const cross = +d.pass_cross;
    const through = +d.pass_through;
    const throw_in = +d.pass_throw_in;
    const corner = +d.pass_corner;
    const goal_kick = +d.pass_goal_kick;
    const free_kick = +d.pass_free_kick;

    // Combine into a single string label


    for (let i = 1; i <= 4; i++) {
      const throw_in_i = +d[`prev_pass${i}_pass_throw_in`];
      const corner_i = +d[`prev_pass${i}_pass_corner`];
      const goal_kick_i = +d[`prev_pass${i}_pass_goal_kick`];
      const free_kick_i = +d[`prev_pass${i}_pass_free_kick`];
      const cut_back_i = +d[`prev_pass${i}_pass_cut_back`];
      const switch_i = +d[`prev_pass${i}_pass_switch`];
      const cross_i = +d[`prev_pass${i}_pass_cross`];
      const through_i = +d[`prev_pass${i}pass_through`];

      if (throw_in_i) d[`prev_pass${i}_type`] = "Throw In";
      else if (corner_i) d[`prev_pass${i}_type`] = "Corner";
      else if (goal_kick_i) d[`prev_pass${i}_type`] = "Goal Kick";
      else if (free_kick_i) d[`prev_pass${i}_type`] = "Free Kick";
      else if (through_i) d[`prev_pass${i}_type`] = "Through Ball";
      else if (cut_back_i) d[`prev_pass${i}_type`] = "Cut Back";
      else if (switch_i) d[`prev_pass${i}_type`] = "Switch";
      else if (cross_i) d[`prev_pass${i}_type`] = "Cross";
      else d[`prev_pass${i}_type`] = "Pass";
    }

    if (throw_in) d.type = "Throw In";
    else if (corner) d.type = "Corner";
    else if (goal_kick) d.type = "Goal Kick";
    else if (free_kick) d.type = "Free Kick";
    else if (through) d.type = "Through Ball";
    else if (cut_back) d.type = "Cut Back";
    else if (switchPass) d.type = "Switch";
    else if (cross) d.type = "Cross";
    else d.type = "Pass";

    return d;
  })
  return updatedData;
});
// euroSequences.map(d => {
//   d.pass_height = parseInt(d.pass_height);
//   if (d.pass_height === 0) d.pass_height = "Ground";
//   else if (d.pass_height === 1) d.pass_height = "Low";
//   else if (d.pass_height === 2) d.pass_height = "High";
//   return d;
// });
const topTenSequences = euroSequences.sort((a, b) => b.sequence_pred - a.sequence_pred).slice(0, 10);

function getPassLocationsWithMetadata(sequence) {
  const passes = [];

  // Previous passes 4 to 1
  for (let i = 4; i >= 1; i--) {
    const x1 = parseFloat(sequence[`prev_pass${i}_x1`]);
    const y1 = parseFloat(sequence[`prev_pass${i}_y1`]);
    const x2 = parseFloat(sequence[`prev_pass${i}_x2`]);
    const y2 = parseFloat(sequence[`prev_pass${i}_y2`]);
    const outcome = parseFloat(sequence[`prev_pass${i}_outcome`]);
    const height = parseFloat(sequence[`prev_pass${i}_height`]);
    const type = sequence[`prev_pass${i}_type`];
    const possession = parseInt(sequence.possession);
    if (
      !isNaN(x1) && !isNaN(y1) &&
      !isNaN(x2) && !isNaN(y2)
    ) {
      passes.push({
        start: [x1, y1],
        end: [x2, y2],
        outcome: isNaN(outcome) ? null : outcome,
        height: isNaN(height) ? null : height,
        type: type,
        sequence_pred: sequence.sequence_pred,
        team: sequence.team,
        possession: possession
      });
    }
  }

  // Final (current) pass
  const finalX1 = parseFloat(sequence.x1);
  const finalY1 = parseFloat(sequence.y1);
  const finalX2 = parseFloat(sequence.x2);
  const finalY2 = parseFloat(sequence.y2);
  const finalOutcome = parseFloat(sequence.outcome);
  const finalHeight = parseFloat(sequence.pass_height);
  const finalType = sequence.type || "Pass";
  const finalPossession = parseInt(sequence.possession);

  if (
    !isNaN(finalX1) && !isNaN(finalY1) &&
    !isNaN(finalX2) && !isNaN(finalY2)
  ) {
    passes.push({
      start: [finalX1, finalY1],
      end: [finalX2, finalY2],
      outcome: isNaN(finalOutcome) ? null : finalOutcome,
      height: isNaN(finalHeight) ? null : finalHeight,
      type: finalType,
      sequence_pred: sequence.sequence_pred,
      team: sequence.team,
      possession: finalPossession
    });
  }

  return passes;
}

function getDribblesFromPasses(passes) {
  const dribbles = [];

  for (let i = 0; i < passes.length - 1; i++) {
    const currentPass = passes[i];
    const nextPass = passes[i + 1];

    dribbles.push({
      start: currentPass.end,
      end: nextPass.start,
      type: "Dribble"
    });
  }

  return dribbles;
}
const topTenSequencePasses = topTenSequences.map(getPassLocationsWithMetadata);
const topTenSequenceDribbles = topTenSequencePasses.map(getDribblesFromPasses);
const svg3 = d3.select("#pitch3");
const defs3 = svg3.append("defs");

let currentSequenceIndex = 0;

function updateArrowDefs() {
  // Clear existing markers
  defs3.selectAll("marker").remove();

  topTenSequencePasses[currentSequenceIndex].forEach((d, i) => {
    const color = d.outcome === 1.0 ? "green" : "red";
    const strokeWidth = 1.2 + i * 0.1;

    defs3.append("marker")
      .attr("id", `arrow3-${i}`)
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 2)
      .attr("refY", 5)
      .attr("markerWidth", strokeWidth)
      .attr("markerHeight", strokeWidth)
      .attr("orient", "auto")
      .attr("markerUnits", "strokeWidth")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", color);
  });
}

function updatePassDisplay() {
  updateArrowDefs();

  // Update sequence header
  const currentSequence = topTenSequencePasses[currentSequenceIndex][0];
  d3.select("#sequence-header")
    .html(`Team: ${currentSequence.team}<br>Sequence Probability: ${(currentSequence.sequence_pred * 100).toFixed(2)}%`);

  svg3.selectAll(".pass")
    .data(topTenSequencePasses[currentSequenceIndex])
    .join("line")
    .attr("class", "pass")
    .attr("x1", d => d.start[0])
    .attr("y1", d => d.start[1])
    .attr("x2", d => d.end[0])
    .attr("y2", d => d.end[1])
    .attr("stroke", d => d.outcome === 1.0 ? "green" : "red")
    .attr("stroke-width", (d, i) => .5 + i * .2)
    .attr("marker-end", (d, i) => `url(#arrow3-${i})`)
    .on("mouseover", (event, d) => {
      tooltip3
        .style("opacity", 1)
        .html(`
              <strong>Pass</strong><br/>
              Outcome: ${d.outcome}<br/>
              Type: ${d.type}<br/>
              Height: ${getHeightLabel(d.height)}
            `);
    })
    .on("mousemove", (event) => {
      tooltip3
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
    })
    .on("mouseout", () => {
      tooltip3.style("opacity", 0);
    });

  svg3.selectAll(".dribble")
    .data(topTenSequenceDribbles[currentSequenceIndex])
    .join("line")
    .attr("class", "dribble")
    .attr("x1", d => d.start[0])
    .attr("y1", d => d.start[1])
    .attr("x2", d => d.end[0])
    .attr("y2", d => d.end[1])
    .attr("stroke-width", .5)
    .attr("stroke-dasharray", "1 1");
  // Update sequence counter display
  d3.select("#sequence-counter")
    .text(`Sequence ${currentSequenceIndex + 1} of ${topTenSequencePasses.length}`);
}

drawFootballPitch(svg3);

const tooltip3 = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "rgba(0,0,0,0.7)")
  .style("color", "white")
  .style("padding", "6px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("pointer-events", "none")
  .style("opacity", 0);

// Add navigation controls outside SVG
const controlsContainer = d3.select("#pitch3-container")
  .append("div")
  .style("text-align", "center")
  .style("margin-top", "10px");

controlsContainer.append("span")
  .attr("id", "sequence-counter")
  .style("margin", "0 10px")
  .style("font-size", "12px")
  .text(`Sequence 1 of ${topTenSequencePasses.length}`);

controlsContainer.append("button")
  .style("margin", "0 5px")
  .text("←")
  .on("click", () => {
    currentSequenceIndex = (currentSequenceIndex - 1 + topTenSequencePasses.length) % topTenSequencePasses.length;
    updatePassDisplay();
  });

controlsContainer.append("button")
  .style("margin", "0 5px")
  .text("→")
  .on("click", () => {
    currentSequenceIndex = (currentSequenceIndex + 1) % topTenSequencePasses.length;
    updatePassDisplay();
  });

// Initial display
updatePassDisplay();




let filteredEuroSequences = euroSequences;
//for pie and bar charts this is the average pass sequence xG per possession for a team. 
const teamsPreds = d3.rollup(
  euroSequences,
  v => d3.max(v, d => d.sequence_pred), // Get max pred for each possession
  d => d.team,
  d => d.possession // Group by team and possession
);
// Calculate mean of possession max predictions per team
const teamAverages = Array.from(teamsPreds.entries()).map(([team, possessions]) => {
  const possessionValues = Array.from(possessions.values());
  return {
    team: team,
    avgPred: d3.mean(possessionValues)
  };
});
const teamSums = Array.from(teamsPreds.entries()).map(([team, possessions]) => {
  const possessionValues = Array.from(possessions.values());
  return {
    team: team,
    sumPred: d3.sum(possessionValues)
  };
});

const stagePreds = d3.rollup(
  euroSequences,
  v => d3.sum(v, d => d.sequence_pred), // Get max pred for each possession
  d => d.competition_stage,
);
let clickedStage = "";

function createPieChart() {
  d3.select("#pie-chart").selectAll("*").remove(); // clear old

  const stageData = Array.from(stagePreds, ([stage, value]) => ({ stage, value }));
  const pieChart = d3.select("#pie-chart");
  const chartRect = pieChart.node().getBoundingClientRect();
  const pieWidth = 0.5 * chartRect.width; // Pie takes half width
  const legendWidth = 200;                // Width reserved for legend
  const svgWidth = pieWidth + legendWidth + 60; // Add some spacing
  const pieHeight = 0.8 * chartRect.height;
  const svgHeight = pieHeight;

  const radius = Math.min(pieWidth, pieHeight) / 2.5;

  const svg = pieChart
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Position pie in the left half
  const pieSvg = svg
    .append("g")
    .attr("transform", `translate(${pieWidth / 2 + 40}, ${pieHeight / 2})`);

  const color = d3.scaleOrdinal()
    .domain(stageData.map(d => d.stage))
    .range(d3.schemeCategory10);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = pieSvg.selectAll("g")
    .data(pie(stageData))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.stage))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .on("click", (event, d) => {
      // Reset all slices
      arcs.selectAll("path")
        .classed("active", false)
        .transition()
        .duration(200)
        .attr("transform", null);

      if (clickedStage === d.data.stage) {
        clickedStage = "";
        updateBarChart("");
      } else {
        clickedStage = d.data.stage;

        // Animate clicked slice
        const [x, y] = arc.centroid(d);
        const offset = 20;
        const angle = Math.atan2(y, x);
        const dx = Math.cos(angle) * offset;
        const dy = Math.sin(angle) * offset;

        d3.select(event.currentTarget)
          .classed("active", true)
          .transition()
          .duration(200)
          .attr("transform", `translate(${dx}, ${dy}) scale(1.15)`);

        updateBarChart(clickedStage);
      }
    });

  const legendItemHeight = 24;
const legendHeight = stageData.length * legendItemHeight;

// Position the legend to the right of the pie chart, vertically centered
const legend = svg.append("g")
  .attr("id", "pie-legend")
  .attr("transform", `translate(${pieWidth + 30}, ${(pieHeight / 2) - (legendHeight / 2)})`);

const legendItems = legend.selectAll(".legend-item")
  .data(stageData)
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(60, ${i * legendItemHeight})`);

legendItems.append("rect")
  .attr("width", 16)
  .attr("height", 16)
  .attr("fill", d => color(d.stage));

legendItems.append("text")
  .attr("x", 22)
  .attr("y", 13)
  .text(d => d.stage)
  .style("font-size", "14px");
}







// Sort teams by sum prediction descending
teamSums.sort((a, b) => b.sumPred - a.sumPred);
// Function to create/update bar chart
function updateBarChart(stage) {
  filteredEuroSequences = euroSequences;
  if (stage === "") {
    filteredEuroSequences = euroSequences;
  } else {
    filteredEuroSequences = filteredEuroSequences.filter(d => d.competition_stage === stage);
  }
  filteredEuroSequences = filteredEuroSequences.sort((a, b) => a.sequence_pred - b.sequence_pred);
  const teamsPreds = d3.rollup(
    filteredEuroSequences,
    v => d3.max(v, d => d.sequence_pred), // Get max pred for each possession
    d => d.team,
    d => d.possession // Group by team and possession
  );
  // Calculate mean of possession max predictions per team
  const teamAverages = Array.from(teamsPreds.entries()).map(([team, possessions]) => {
    const possessionValues = Array.from(possessions.values());
    return {
      team: team,
      avgPred: d3.mean(possessionValues)
    };
  });
  const teamSums = Array.from(teamsPreds.entries()).map(([team, possessions]) => {
    const possessionValues = Array.from(possessions.values());
    return {
      team: team,
      sumPred: d3.sum(possessionValues)
    };
  });
  teamSums.sort((a, b) => b.sumPred - a.sumPred);
  // Clear existing chart
  d3.select("#bar-chart").selectAll("*").remove();

  const barChart = d3.select("#bar-chart");
  const barWidth = .8 * barChart.node().getBoundingClientRect().width;
  const barHeight = .4 * barChart.node().getBoundingClientRect().height;
  const barMargin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 60
  };

  // Create SVG container
  const barSvg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

  // Create scales
  const x = d3.scaleBand()
    .range([0, barWidth])
    .domain(teamSums.map(d => d.team))
    .padding(0.2);

  const y = d3.scaleLinear()
    .range([barHeight, 0])
    .domain([0, d3.max(teamSums, d => d.sumPred)]);

  // Add X axis
  barSvg.append("g")
    .attr("transform", `translate(0,${barHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  barSvg.append("g")
    .call(d3.axisLeft(y));

  // Add bars
  barSvg.selectAll("rect")
    .data(teamSums)
    .join("rect")
    .attr("x", d => x(d.team))
    .attr("y", d => y(d.sumPred))
    .attr("width", x.bandwidth())
    .attr("height", d => barHeight - y(d.sumPred))
    .attr("fill", "#69b3a2");

  // Add title
  barSvg.append("text")
    .attr("x", barWidth / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Total Expected Goals from Pass Sequences by Team");

  // Add Y axis label
  barSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -(barHeight / 2))
    .attr("text-anchor", "middle")
    .text("Total Expected Goals");
}

function safeCreateBarChart() {
  const barChartEl = document.getElementById("bar-chart");
  if (!barChartEl) return;

  const width = barChartEl.getBoundingClientRect().width;
  const height = barChartEl.getBoundingClientRect().height;

  if (width > 0 && height > 0) {
    updateBarChart(""); // your main chart function
  } else {
    requestAnimationFrame(safeCreateBarChart); // try again on next frame
  }
}
function safeCreatePieChart() {
  const pieEl = document.getElementById("pie-chart");
  if (!pieEl) return;

  const width = pieEl.getBoundingClientRect().width;
  const height = pieEl.getBoundingClientRect().height;

  if (width > 0 && height > 0) {
    createPieChart();
  } else {
    requestAnimationFrame(safeCreatePieChart); // Try again when layout is ready
  }
}

// Run once DOM and layout are ready
window.addEventListener("load", () => {
  safeCreateBarChart();
  safeCreatePieChart();
});
// Update on window resize
window.addEventListener('resize', () => {
  updateBarChart("");
  createPieChart();
});

// Create a new SVG for the pass visualization
const pitch4 = d3.select("#pitch4");
// Clear any existing elements
pitch4.selectAll("*").remove();
drawFootballPitch(pitch4);

// Get the best sequence for each possession
const teamsLastPreds = d3.rollup(
  filteredEuroSequences,
  v => d3.max(v, d => d.sequence_pred),
  d => d.match_id,
  d => d.possession
);

// All rows with max prediction for each possession
const matchedRowsFull = filteredEuroSequences.filter(d => {
  const matchMap = teamsLastPreds.get(d.match_id);
  if (!matchMap) return false;

  const maxPred = matchMap.get(d.possession);
  return d.sequence_pred === maxPred;
});
const sortedPreds = matchedRowsFull
    .map(d => parseFloat(d.sequence_pred))
      .sort(d3.ascending);
let matchedRows = matchedRowsFull;
let start = 0.45;
let end = 0.55;
let globalType = "";
let globalHeight = "";
let accuracy =0;

const uniquePassTypes = Array.from(new Set(matchedRowsFull.map(d => d.type)));

  // 2. Define global color scale based on all types (fixed order)
  const color = d3.scaleOrdinal()
    .domain(uniquePassTypes)
    .range(d3.schemeCategory10);
const passHeightCategories = Array.from(new Set(matchedRowsFull.map(d => d.pass_height)));
    const heightColor = d3.scaleOrdinal()
    .domain(passHeightCategories)
    .range(d3.schemeCategory10);

function updatePasses(lower, upper, type, height) {
  pitch4.selectAll("*").remove();
  drawFootballPitch(pitch4);

  const lowerPredThreshold = d3.quantileSorted(sortedPreds, lower);
  const upperPredThreshold = d3.quantileSorted(sortedPreds, upper);
  // Filter based on thresholds
  matchedRows = matchedRowsFull.filter(
    d => d.sequence_pred >= lowerPredThreshold && d.sequence_pred <= upperPredThreshold
  );
  if (globalType !== "") {
    matchedRows = matchedRows.filter(d => d.type === globalType);
  }
  if (globalHeight !== "") {
    matchedRows = matchedRows.filter(d => d.pass_height === globalHeight);
  }
  accuracy = matchedRows.filter(d => parseInt(d.outcome) === 1).length / matchedRows.length;

  // Draw passes
  pitch4.selectAll("line")
    .data(matchedRows)
    .enter()
    .append("line")
    .attr("x1", d => d.x1)
    .attr("y1", d => d.y1)
    .attr("x2", d => d.x2)
    .attr("y2", d => d.y2)
    .attr("stroke", d => parseInt(d.outcome) === 1 ? "green" : "red")
    .attr("stroke-width", 0.3)
    .attr("opacity", 0.4);
}

// // Slider config
const margin = { top: 20, right: 50, bottom: 20, left: 50 };
const width = 500 - margin.left - margin.right;
const height = 80;

const svg = d3.select("#slider-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width]);

svg.append("g")
  .attr("transform", `translate(0,${height / 2})`)
  .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format(".0%")));

const brush = d3.brushX()
  .extent([[0, 0], [width, height]])
  .on("brush end", ({ selection }) => {
    if (selection) {
      start = x.invert(selection[0]);
      end = x.invert(selection[1]);

      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
    }
  });

svg.append("g")
  .attr("class", "brush")
  .call(brush)
  .call(brush.move, [0.45, 0.55].map(x)); // Initial range: 10%–90%

function createPassTypePieChart() {
  d3.select("#pass-type-pie-chart").selectAll("*").remove(); // clear previous chart

  // Count pass types
  const passTypeCounts = d3.rollup(
    matchedRows,
    v => v.length,
    d => d.type
  );

  const passTypeData = Array.from(passTypeCounts, ([type, count]) => ({ type, count }));

  // Dimensions
  const pieWidth = 200;
  const pieHeight = 200;
  const legendWidth = 120;
  const radius = Math.min(pieWidth, pieHeight) / 2.2;

  const svg = d3.select("#pass-type-pie-chart")
    .append("svg")
    .attr("width", pieWidth + legendWidth)
    .attr("height", pieHeight);

  const pieSvg = svg.append("g")
    .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);

  // Color scale
  // const color = d3.scaleOrdinal()
  //   .domain(passTypeData.map(d => d.type))
  //   .range(d3.schemeCategory10);

  // Pie generator
  const pie = d3.pie().value(d => d.count);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const arcs = pieSvg.selectAll(".arc")
    .data(pie(passTypeData))
    .enter()
    .append("g")
    .attr("class", "arc");

  const pathMap = new Map(); // Map passType → path element for linking with legend

  // Draw pie slices
  arcs.each(function (d) {
    const path = d3.select(this)
      .append("path")
      .attr("d", arc(d))
      .attr("fill", color(d.data.type))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", function () {
        if (globalType !== d.data.type) {
          const [x, y] = arc.centroid(d);
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", `translate(${x * 0.1}, ${y * 0.1})`);
        }
      })
      .on("mouseout", function () {
        if (globalType !== d.data.type) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", null);
        }
      })
      .on("click", function (event, d) {
        handleClick(d.data.type, d, this); // <- Fix here
      });
  
    pathMap.set(d.data.type, path);
  });

  function handleClick(type, d, element) {
    // Reset all
    arcs.selectAll("path")
      .classed("active", false)
      .transition()
      .duration(200)
      .attr("transform", null);

    if (globalType === type) {
      globalType = "";
      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
    } else {
      globalType = type;

      const [x, y] = arc.centroid(d);
      const offset = 20;
      const angle = Math.atan2(y, x);
      const dx = Math.cos(angle) * offset;
      const dy = Math.sin(angle) * offset;

      d3.select(element)
        .classed("active", true)
        .transition()
        .duration(200)
        .attr("transform", `translate(${dx}, ${dy}) scale(1.1)`);
      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
    }
  }

  // Create legend
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${pieWidth + 20}, 20)`);

  const legendItems = legend.selectAll(".legend-item")
    .data(pie(passTypeData)) // use pie() output to keep 'd' structure aligned
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`)
    .style("cursor", "pointer")
    .on("click", (event, d) => {
      const path = pathMap.get(d.data.type);
      handleClick(d.data.type, d, path.node());
    });

  legendItems.append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d => color(d.data.type));

  legendItems.append("text")
    .attr("x", 16)
    .attr("y", 10)
    .text(d => `${d.data.type} (${d.data.count})`)
    .style("font-size", "12px");
}
// Call the function to create pie chart
createPassTypePieChart();

function createPassHeightPieChart() {
  d3.select("#pass-height-pie-chart").selectAll("*").remove();

  const passHeightCounts = d3.rollup(
    matchedRows,
    v => v.length,
    d => d.pass_height
  );
  const passHeightData = Array.from(passHeightCounts, ([height, count]) => ({ height, count }));

  const pieWidth = 200;
  const pieHeight = 200;
  const legendWidth = 120;
  const radius = Math.min(pieWidth, pieHeight) / 2.2;
  const legendItemHeight = 20;
  const legendHeight = passHeightData.length * legendItemHeight;
  const legendYOffset = (pieHeight - legendHeight) / 2;

  const svg = d3.select("#pass-height-pie-chart")
    .append("svg")
    .attr("width", pieWidth + legendWidth)
    .attr("height", pieHeight);

  const pieSvg = svg.append("g")
    .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);

  const pie = d3.pie().value(d => d.count);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  const arcs = pieSvg.selectAll(".arc")
    .data(pie(passHeightData))
    .enter()
    .append("g")
    .attr("class", "arc");

  const pathMap = new Map();

  arcs.each(function (d) {
    const path = d3.select(this)
      .append("path")
      .attr("d", arc(d))
      .attr("fill", heightColor(d.data.height))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", function () {
        if (globalHeight !== d.data.height) {
          const [x, y] = arc.centroid(d);
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", `translate(${x * 0.1}, ${y * 0.1})`);
        }
      })
      .on("mouseout", function () {
        if (globalHeight !== d.data.height) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", null);
        }
      })
      .on("click", function (event, d) {
        handleClick(d.data.height, d, this);
      });

    pathMap.set(d.data.height, path);
  });

  function handleClick(height, d, element) {
    arcs.selectAll("path")
      .classed("active", false)
      .transition()
      .duration(200)
      .attr("transform", null);

    if (globalHeight === height) {
      globalHeight = "";
    } else {
      globalHeight = height;

      const [x, y] = arc.centroid(d);
      const angle = Math.atan2(y, x);
      const dx = Math.cos(angle) * 20;
      const dy = Math.sin(angle) * 20;

      d3.select(element)
        .classed("active", true)
        .transition()
        .duration(200)
        .attr("transform", `translate(${dx}, ${dy}) scale(1.1)`);
    }

    // Apply filter with both height and type
    let filtered = matchedRowsFull.filter(d =>
      d.sequence_pred >= d3.quantileSorted(sortedPreds, start) &&
      d.sequence_pred <= d3.quantileSorted(sortedPreds, end)
    );

    if (globalType !== "") {
      filtered = filtered.filter(d => d.type === globalType);
      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
    }
    if (globalHeight !== "") {
      filtered = filtered.filter(d => d.height === globalHeight);
      updatePasses(start, end, globalType, globalHeight);
      createPassTypePieChart();
      createPassHeightPieChart();
      drawAccuracyChart(accuracy);
    }

    updatePasses(start, end, globalType, globalHeight);
    createPassTypePieChart();
    createPassHeightPieChart();
    drawAccuracyChart(accuracy);
  }

  // Legend
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${pieWidth + 20}, ${legendYOffset})`);

  const legendItems = legend.selectAll(".legend-item")
    .data(pie(passHeightData))
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * legendItemHeight})`)
    .style("cursor", "pointer")
    .on("click", (event, d) => {
      const path = pathMap.get(d.data.height);
      handleClick(d.data.height, d, path.node());
    });

  legendItems.append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d => heightColor(d.data.height));

  legendItems.append("text")
    .attr("x", 16)
    .attr("y", 6)
    .attr("dy", "0.35em")
    .text(d => `${getHeightLabel(parseInt(d.data.height))} (${d.data.count})`)
    .style("font-size", "12px");
}
createPassHeightPieChart();

function drawAccuracyChart(percentile) {
  const width = 200;
  const height = 200;
  const radius = 80;
  const thickness = 15;
  const svg = d3.select("#accuracy-chart")
    .attr("width", width)
    .attr("height", height)
  svg.selectAll("*").remove();

  const g = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Background arc
  const backgroundArc = d3.arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius)
    .startAngle(0)
    .endAngle(2 * Math.PI);

  g.append("path")
    .attr("d", backgroundArc)
    .attr("fill", "#eee");

  // Foreground arc (progress)
  const foregroundArc = d3.arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius)
    .startAngle(0)
    .endAngle(2 * Math.PI * percentile);

  g.append("path")
    .attr("d", foregroundArc)
    .attr("fill", "#4caf50");

  // Center text
  g.append("text")
    .attr("class", "percent-text")
    .text(`Pass Accuracy: ${Math.round(percentile * 100)}%`)
    .style("font-size", "15px");
}
drawAccuracyChart(accuracy);
