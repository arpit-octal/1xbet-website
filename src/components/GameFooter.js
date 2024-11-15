import React, { useContext } from "react";
import AuthProvider from "../context/AuthContext";

const GameFooter = () => {
  let { gameFooter } = useContext(AuthProvider);
  return (
    <div
      id="openBetsLeftSide"
      className="overlay left-side"
      style={{
        display: gameFooter ? "block" : "none",
      }}
    >
  <div id="luckco7-frame" className="luckco7-frame" style={{zIndex:"9998"}}>
	<div className="luck7fream" id="luckco7-frame-close-X">
	</div>
	<video id="luckco7-frame-loading" autoplay="" loop="" muted="" playsinline="">
		<source id="loading-source" src="https://statics3.skyexchange.com/images/mobile/minigame-promo/loading_BG.mp4" type="video/mp4" />
	</video>
	<iframe id="miniGameIframe" className="miniGameIframe"  scrolling="no" src="">
        </iframe>
    </div>
    </div>
  );
};

export default GameFooter;
