// Add export to every variable below

export const pitchWidth = 120;
export const pitchHeight = 80;
export const goalCoords = [120, 40]; // Center of goal on right side

export let firstClick = true;

export let shotTaken = false;
export function changeShotTaken(bool) {
  shotTaken = bool;
}

export let collectedStats = [];

export function changeCollectedStats(stats) {
  collectedStats = stats;
}

export let firstPassComplete = false;
export function changeFirstPassComplete(bool) {
  firstPassComplete = bool;
}

export let lastRedDot = null;
export function changeLastRedDot(dot) {
  lastRedDot = dot;
}

export let passIndex = 1;
export function changePassIndex(index) {
  passIndex = index;
}

export let passCount = 0;
export function changePassCount(count) {
  passCount = count;
}

export let passNumber = 1;
export function changePassNumber(number) {
  passNumber = number;
}

export let dribbleNumber = 1;
export function changeDribbleNumber(number) {
  dribbleNumber = number;
}

export let dribbleIndex = 0;
export function changeDribbleIndex(index) {
  dribbleIndex = index;
}
export let lastEndPos = null;
export function changeLastEndPos(pos) {
  lastEndPos = pos;
}
export let passType;
export let passHeight;
export let dribbles = [];
export function changeDribbles(dribbles) {
  dribbles = dribbles;
}
