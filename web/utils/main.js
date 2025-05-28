// document.getElementById("predictBtn").addEventListener("click",

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
