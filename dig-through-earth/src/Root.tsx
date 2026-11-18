import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { FPS, TOTAL, hasVoice } from "./timing";

export const Root: React.FC = () => (
  <Composition
    id="DigThroughEarth"
    component={Video}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ captions: !hasVoice, bedOnly: false }}
  />
);
