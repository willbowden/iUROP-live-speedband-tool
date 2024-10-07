import { MapController } from "./MapController.js";

const SINGAPORE_COORDS = [1.28960592759792, 103.84835955306676];

document.addEventListener("DOMContentLoaded", () => {
  const m = new MapController("map", SINGAPORE_COORDS);
})