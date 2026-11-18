import React from "react";
import { Composition, Still } from "remotion";
import { Video } from "./Video";
import { Cover } from "./Cover";
import { OrientCtx } from "./common";
import { FPS, TOTAL } from "./timing";
const Vertical: React.FC<{ bedOnly: boolean }> = (p) => <OrientCtx.Provider value="v"><Video {...p} /></OrientCtx.Provider>;
export const Root: React.FC = () => (
  <>
    <Composition id="JupiterSwallow" component={Vertical} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{ bedOnly: false }} />
    <Still id="Cover" component={Cover} width={1080} height={1920} />
  </>
);
