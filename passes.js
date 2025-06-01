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

  window.onYouTubeIframeAPIReady = function() {
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
const passesFormatted = reversedPasses.flatMap(({ start, end, type, outcome, height}) => [
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
      resultBox.innerText =`The pass sequence xG for this play is ${result.prediction.toFixed(4)}. But what would have happened if the the last pass was played differently? Click the options below to explore.`;
    } else {
      resultBox.innerText =`Error: ${result.error}`;
    } 
  } catch (error) {
    resultBox.innerText =`Fetch error: ${error}`;
  } 

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
  .attr("y", startPoint[1] +.8) // slight offset above
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
  .on("click",async (event, d) => {
    svg2.selectAll(".selected-arrow").remove();
    console.log(d);
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
        passesV2 = passesV2.slice(0,4)
    }
      passesV2.push({
        "outcome": 1.0,
        "start": [85.3,34.5],
        "end": [d[0],d[1]],
        "type": "Pass",
        "height": 0.0
      });

      try {
        const reversedPassesV2 = passesV2.reverse();
        const passesFormattedV2 = reversedPassesV2.flatMap(({ start, end, type, outcome, height}) => [
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
          tooltip2.innerText =`Error: ${result.error}`;
        } 
      } catch (error) {
        tooltip2.innerText =`Fetch error: ${error}`;
      } 
      passesV2 = passesV2.reverse();    
  });

  svg2.selectAll(".option-label")
  .data(endPoints)
  .enter()
  .append("text")
  .attr("class", "option-label")
  .attr("x", d => d[0] -9)  // use d[0] for x
  .attr("y", d => d[1] + 1)  // use d[1] for y
  .text((d, i) => "Option " + (i + 1))
  .attr("font-size", "2px")
  .attr("fill", "black")
  .style("pointer-events", "none");


  let euroSequences = await d3.csv("europe_sequences_preds.csv").then(function(data) {
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
          team: sequence.team
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
        team: sequence.team
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
  console.log(topTenSequenceDribbles);
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
    console.log(topTenSequencePasses[currentSequenceIndex]);
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



//for pie and bar charts
  const teamsPreds = d3.rollup(
    euroSequences,
    v => d3.mean(v, d => d.sequence_pred),
    d => d.team
  );
  console.log(teamsPreds);
