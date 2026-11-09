import { Composition } from "remotion";
import { HelloScene } from "./HelloScene";

export const RemotionRoot = () => (
  <Composition id="HelloScene" component={HelloScene} durationInFrames={90} fps={30} width={1080} height={1920} />
);
