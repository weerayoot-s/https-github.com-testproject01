/**
 * Render settings (Remotion 4, Linux cloud container).
 * The skill's template pointed at macOS Chrome; here we use the pre-installed Chromium headless shell
 * because Remotion cannot download its own browser through this network.
 */
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(18);
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell");
// The skill found 2 tabs gave tiled frames on a Mac; here we use 3 and check every render with tools/render_glitches.py.
Config.setConcurrency(3);
Config.setChromiumOpenGlRenderer("swangle");
