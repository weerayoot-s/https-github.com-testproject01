// Render several stills with one bundle: node tools/stills.mjs 40 165 277 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const composition = await selectComposition({ serveUrl, id: "MaryCeleste", browserExecutable });
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, output: `out/stills/f${String(frame).padStart(4, "0")}.png`, browserExecutable, scale: 0.5 });
}
console.log("done", frames.length);
