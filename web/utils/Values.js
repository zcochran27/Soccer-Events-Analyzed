// Add export to every variable below

export const pitchWidth = 120;
export const pitchHeight = 80;
export const goalCoords = [120, 40]; // Center of goal on right side

export let firstClick = true;
export let startPos = [-1, -1];
export function changeStartPos(x, y) {
  startPos[0] = x;
  startPos[1] = y;
}
export let endPos = [-1, -1];
export function changeEndPos(x, y) {
  endPos[0] = x;
  endPos[1] = y;
}

export let shotTaken = false;
export function changeShotTaken(bool) {
  shotTaken = bool;
}

export let collectedStats = [];

export let firstPassComplete = false;
export let lastRedDot = null;
export let passIndex = 1;
export let passCount = 0;
export let passNumber = 1;
export let dribbleNumber = 1;
export let dribbleIndex = 0;
export let lastEndPos = null;
export let passType;
export let passHeight;
export let dribbles = [];
