import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadPTMono } from "@remotion/google-fonts/PTMono";

export const serif = loadLora("normal", {
  weights: ["500", "600"],
  subsets: ["latin", "cyrillic"],
}).fontFamily;

export const serifItalic = loadLora("italic", {
  weights: ["500"],
  subsets: ["latin", "cyrillic"],
}).fontFamily;

export const condensed = loadOswald("normal", {
  weights: ["600"],
  subsets: ["latin", "cyrillic"],
}).fontFamily;

export const mono = loadPTMono("normal", {
  weights: ["400"],
  subsets: ["latin", "cyrillic"],
}).fontFamily;

export const palette = {
  night: "#07080c",
  wall: "#1b1d24",
  warm: "#e2a35c",
  moon: "#9fb7d9",
  blood: "#c3241f",
  paper: "#e9e3d3",
  text: "#f3efe6",
};
