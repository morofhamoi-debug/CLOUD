import { loadFont } from "@remotion/google-fonts/Montserrat";

export const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin", "cyrillic"],
});
