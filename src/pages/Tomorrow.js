import React from "react";
import All_overlay from "../components/All_overlay";


function Tomorrow() {
	return (
		<>

			<All_overlay />


			<div className="marquee-box" style={{ display: "flex" }}>
				<h4>News</h4>
				<div className="marquee"><div className="js-marquee-wrapper"><div className="js-marquee" ></div></div></div>
			</div>


			<div className="mian-wrap">
				<div className="tab-wrap">
					<ul>
						<li id="inplay" className="select"><a href="/inplay" >In-Play
						</a></li>
						<li id="today" className=""><a href="/today">Today
						</a></li>
						<li id="tomorrow" className=""><a href="/tomorrow">Tomorrow
						</a></li>
						<li id="result"><a href="/result" >Result
						</a></li>
					</ul>
					<a className="a-search" href="#">Search</a>
				</div>
				<div className="wrap-highlight_list" id="inPlayData"><div id="inPlayEventType_4" style={{ display: "block" }}>
					<h3>Cricket</h3>
					<ul className="highlight-list" id="inPlayList_4"><li id="inPlayEvent_-10362833" className="inplay-on">
						<a id="info" href="#">
							<dl>
								<dt>
									<span id="streamingIcon" className="game-live" style={{ display: 'flex' }}>game-live</span>
									<span id="lowLiquidityTag" className="game-low_liq" style={{ display: 'none' }}>Low Liquidity</span>
									<span id="fancyBetIcon" className="game-fancy" style={{ display: 'flex' }}>Fancy</span>
									<span id="bookMakerIcon" className="game-bookmaker" style={{ display: 'none' }}>BookMaker</span>
									<span id="feedingSiteIcon" className="game-sportsbook" style={{ display: 'none' }}>Sportsbook</span>
									<span id="sportsBookIcon_1" className="game-sportsbook" style={{ display: 'none' }}>Premium Tennis</span>
									<span id="sportsBookIcon_2" className="game-sportsbook" style={{ display: 'none' }}>Premium Cricket</span>
									<span id="inPlayStatus_-10362833" className="time">In-Play</span>
									<span id="sportsBookEIcon_1" className="game-E" style={{ display: 'none' }}><i></i>Soccer</span>
									<span id="sportsBookEIcon_137" className="game-E" style={{ display: 'none' }}><i></i>e-Soccer</span>
									<span id="sportsBookEIcon_4" className="game-E" style={{ display: 'none' }}><i></i>Cricket</span>
									<span id="sportsBookEIcon_2" className="game-E" style={{ display: 'none' }}><i></i>Tennis</span>
								</dt>
								<dd id="eventName">Saurashtra vs Maharashtra</dd>
							</dl>
						</a>
						<a id="multiMarketPin" className="pin-off" href="#"></a>
					</li> </ul>
				</div><div id="inplayVirtualCricketImage" className="footer-kv" >
						<a id="inplayVirtualCricketEntrance" className="entrance" href="#">
							<img src={process.env.REACT_APP_URL + "/assets/images/kv-virtual-cricket-m.jpg"} style={{ width: "100%" }} />
						</a>
					</div><div id="inPlayEventType_2" style={{ display: 'block' }}>
						<h3>Tennis</h3>
						<ul className="highlight-list" id="inPlayList_2"><li id="inPlayEvent_31981929" className="inplay-on">
							<a id="info" href="#">
								<dl>
									<dt>
										<span id="streamingIcon" className="game-live" style={{ display: 'flex' }}>game-live</span>
										<span id="lowLiquidityTag" className="game-low_liq" style={{ display: 'none' }}>Low Liquidity</span>
										<span id="fancyBetIcon" className="game-fancy" style={{ display: 'none' }}>Fancy</span>
										<span id="bookMakerIcon" className="game-bookmaker" style={{ display: 'none' }}>BookMaker</span>
										<span id="feedingSiteIcon" className="game-sportsbook" style={{ display: 'none' }}>Sportsbook</span>
										<span id="sportsBookIcon_1" className="game-sportsbook" style={{ display: 'none' }}>Premium Tennis</span>
										<span id="sportsBookIcon_2" className="game-sportsbook" style={{ display: 'none' }}>Premium Cricket</span>
										<span id="inPlayStatus_31981929" className="time">In-Play</span>
										<span id="sportsBookEIcon_1" className="game-E" style={{ display: 'none' }}><i></i>Soccer</span>
										<span id="sportsBookEIcon_137" className="game-E" style={{ display: 'none' }}><i></i>e-Soccer</span>
										<span id="sportsBookEIcon_4" className="game-E" style={{ display: 'none' }}><i></i>Cricket</span>
										<span id="sportsBookEIcon_2" className="game-E" style={{ display: 'none' }}><i></i>Tennis</span>
									</dt>
									<dd id="eventName">V Chaudhari <span>(1) 5 - 5 (0)</span> E Yashina</dd>
								</dl>
							</a>
							<a id="multiMarketPin" className="pin-on" href="#"></a>
						</li><li id="inPlayEvent_31982325" className="inplay-on">
								<a id="info" href="#">
									<dl>
										<dt>
											<span id="streamingIcon" className="game-live" style={{ display: 'flex' }}>game-live</span>
											<span id="lowLiquidityTag" className="game-low_liq" style={{ display: 'none' }}>Low Liquidity</span>
											<span id="fancyBetIcon" className="game-fancy" style={{ display: 'none' }}>Fancy</span>
											<span id="bookMakerIcon" className="game-bookmaker" style={{ display: 'none' }}>BookMaker</span>
											<span id="feedingSiteIcon" className="game-sportsbook" style={{ display: 'none' }}>Sportsbook</span>
											<span id="sportsBookIcon_1" className="game-sportsbook" style={{ display: 'none' }}>Premium Tennis</span>
											<span id="sportsBookIcon_2" className="game-sportsbook" style={{ display: 'none' }}>Premium Cricket</span>
											<span id="inPlayStatus_31982325" className="time">In-Play</span>
											<span id="sportsBookEIcon_1" className="game-E" style={{ display: 'none' }}><i></i>Soccer</span>
											<span id="sportsBookEIcon_137" className="game-E" style={{ display: 'none' }}><i></i>e-Soccer</span>
											<span id="sportsBookEIcon_4" className="game-E" style={{ display: 'none' }}><i></i>Cricket</span>
											<span id="sportsBookEIcon_2" className="game-E" style={{ display: 'none' }}><i></i>Tennis</span>
										</dt>
										<dd id="eventName">D Jakupovic <span>(1) 2 - 4 (0)</span> D Kudashova</dd>
									</dl>
								</a>
								<a id="multiMarketPin" className="pin-off" href="#"></a>
							</li><li id="inPlayEvent_31981909" className="inplay-on">
								<a id="info" href="#">
									<dl>
										<dt>
											<span id="streamingIcon" className="game-live" style={{ display: 'flex' }}>game-live</span>
											<span id="lowLiquidityTag" className="game-low_liq" style={{ display: 'none' }}>Low Liquidity</span>
											<span id="fancyBetIcon" className="game-fancy" style={{ display: 'none' }}>Fancy</span>
											<span id="bookMakerIcon" className="game-bookmaker" style={{ display: 'none' }}>BookMaker</span>
											<span id="feedingSiteIcon" className="game-sportsbook" style={{ display: 'none' }}>Sportsbook</span>
											<span id="sportsBookIcon_1" className="game-sportsbook" style={{ display: 'none' }}>Premium Tennis</span>
											<span id="sportsBookIcon_2" className="game-sportsbook" style={{ display: 'none' }}>Premium Cricket</span>
											<span id="inPlayStatus_31981909" className="time">In-Play</span>
											<span id="sportsBookEIcon_1" className="game-E" style={{ display: 'none' }}><i></i>Soccer</span>
											<span id="sportsBookEIcon_137" className="game-E" style={{ display: 'none' }}><i></i>e-Soccer</span>
											<span id="sportsBookEIcon_4" className="game-E" style={{ display: 'none' }}><i></i>Cricket</span>
											<span id="sportsBookEIcon_2" className="game-E" style={{ display: 'none' }}><i></i>Tennis</span>
										</dt>
										<dd id="eventName">M Doi <span>(0) 4 - 3 (1)</span> M Kato</dd>
									</dl>
								</a>
								<a id="multiMarketPin" className="pin-off" href="#"></a>
							</li><li id="inPlayEvent_31981994" className="inplay-on">
								<a id="info" href="#">
									<dl>
										<dt>
											<span id="streamingIcon" className="game-live" style={{ display: 'flex' }}>game-live</span>
											<span id="lowLiquidityTag" className="game-low_liq" style={{ display: 'none' }}>Low Liquidity</span>
											<span id="fancyBetIcon" className="game-fancy" style={{ display: 'none' }}>Fancy</span>
											<span id="bookMakerIcon" className="game-bookmaker" style={{ display: 'none' }}>BookMaker</span>
											<span id="feedingSiteIcon" className="game-sportsbook" style={{ display: 'none' }}>Sportsbook</span>
											<span id="sportsBookIcon_1" className="game-sportsbook" style={{ display: 'none' }}>Premium Tennis</span>
											<span id="sportsBookIcon_2" className="game-sportsbook" style={{ display: 'none' }}>Premium Cricket</span>
											<span id="inPlayStatus_31981994" className="time">In-Play</span>
											<span id="sportsBookEIcon_1" className="game-E" style={{ display: 'none' }}><i></i>Soccer</span>
											<span id="sportsBookEIcon_137" className="game-E" style={{ display: 'none' }}><i></i>e-Soccer</span>
											<span id="sportsBookEIcon_4" className="game-E" style={{ display: 'none' }}><i></i>Cricket</span>
											<span id="sportsBookEIcon_2" className="game-E" style={{ display: 'none' }}><i></i>Tennis</span>
										</dt>
										<dd id="eventName">L Stevens <span>(0) 0 - 1 (0)</span> Y Cavalle-Reimers</dd>
									</dl>
								</a>
								<a id="multiMarketPin" className="pin-off" href="#"></a>
							</li><li id="inPlayEvent_31981995" className="inplay-off">
								<a id="info" href="#">
									<dl>
										<dt>
											<span id="streamingIcon" className="game-live" style={{ display: 'none' }}>game-live</span>
											<span id="lowLiquidityTag" className="game-low_liq" style={{ display: 'none' }}>Low Liquidity</span>
											<span id="fancyBetIcon" className="game-fancy" style={{ display: 'none' }}>Fancy</span>
											<span id="bookMakerIcon" className="game-bookmaker" style={{ display: 'none' }}>BookMaker</span>
											<span id="feedingSiteIcon" className="game-sportsbook" style={{ display: 'none' }}>Sportsbook</span>
											<span id="sportsBookIcon_1" className="game-sportsbook" style={{ display: 'none' }}>Premium Tennis</span>
											<span id="sportsBookIcon_2" className="game-sportsbook" style={{ display: 'none' }}>Premium Cricket</span>
											<span id="inPlayStatus_31981995" className="time">Starting in 2' </span>
											<span id="sportsBookEIcon_1" className="game-E" style={{ display: 'none' }}><i></i>Soccer</span>
											<span id="sportsBookEIcon_137" className="game-E" style={{ display: 'none' }}><i></i>e-Soccer</span>
											<span id="sportsBookEIcon_4" className="game-E" style={{ display: 'none' }}><i></i>Cricket</span>
											<span id="sportsBookEIcon_2" className="game-E" style={{ display: 'none' }}><i></i>Tennis</span>
										</dt>
										<dd id="eventName">A Kulikova <span>v</span> K Laskutova</dd>
									</dl>
								</a>
								<a id="multiMarketPin" className="pin-off" href="#"></a>
							</li>
						</ul>
					</div><div id="inPlayEventType_137" style={{ display: "block" }}>
						<h3>E-Soccer </h3>
						<ul className="highlight-list" id="inPlayList_137"><li id="inPlayEvent_-10363766" className="inplay-on">
							<a id="info" href="#">
								<dl>
									<dt>
										<span id="streamingIcon" className="game-live" style={{ display: 'none' }}>game-live</span>
										<span id="lowLiquidityTag" className="game-low_liq" style={{ display: 'none' }}>Low Liquidity</span>
										<span id="fancyBetIcon" className="game-fancy" style={{ display: 'none' }}>Fancy</span>
										<span id="bookMakerIcon" className="game-bookmaker" style={{ display: 'none' }}>BookMaker</span>
										<span id="feedingSiteIcon" className="game-sportsbook" style={{ display: 'none' }}>Sportsbook</span>
										<span id="sportsBookIcon_1" className="game-sportsbook" style={{ display: 'none' }}>Premium Tennis</span>
										<span id="sportsBookIcon_2" className="game-sportsbook" style={{ display: 'none' }}>Premium Cricket</span>
										<span id="inPlayStatus_-10363766" className="time">In-Play</span>
										<span id="sportsBookEIcon_1" className="game-E" style={{ display: 'none' }}><i></i>Soccer</span>
										<span id="sportsBookEIcon_137" className="game-E" style={{ display: 'flex' }}><i></i>e-Soccer</span>
										<span id="sportsBookEIcon_4" className="game-E" style={{ display: 'none' }}><i></i>Cricket</span>
										<span id="sportsBookEIcon_2" className="game-E" style={{ display: 'none' }}><i></i>Tennis</span>
									</dt>
									<dd id="eventName">Paris Saint Germain (Ray) vs FC Bayern Munich (Mars)</dd>
								</dl>
							</a>
							<a id="multiMarketPin" className="pin-off" href="#"></a>
						</li><li id="inPlayEvent_-10363767" className="inplay-off">
								<a id="info" href="#">
									<dl>
										<dt>
											<span id="streamingIcon" className="game-live" style={{ display: 'none' }}>game-live</span>
											<span id="lowLiquidityTag" className="game-low_liq" style={{ display: 'none' }}>Low Liquidity</span>
											<span id="fancyBetIcon" className="game-fancy" style={{ display: 'none' }}>Fancy</span>
											<span id="bookMakerIcon" className="game-bookmaker" style={{ display: 'none' }}>BookMaker</span>
											<span id="feedingSiteIcon" className="game-sportsbook" style={{ display: 'none' }}>Sportsbook</span>
											<span id="sportsBookIcon_1" className="game-sportsbook" style={{ display: 'none' }}>Premium Tennis</span>
											<span id="sportsBookIcon_2" className="game-sportsbook" style={{ display: 'none' }}>Premium Cricket</span>
											<span id="inPlayStatus_-10363767" className="time">Starting in 2' </span>
											<span id="sportsBookEIcon_1" className="game-E" style={{ display: 'none' }}><i></i>Soccer</span>
											<span id="sportsBookEIcon_137" className="game-E" style={{ display: 'flex' }}><i></i>e-Soccer</span>
											<span id="sportsBookEIcon_4" className="game-E" style={{ display: 'none' }}><i></i>Cricket</span>
											<span id="sportsBookEIcon_2" className="game-E" style={{ display: 'none' }}><i></i>Tennis</span>
										</dt>
										<dd id="eventName">Paris Saint Germain (Ray) vs Manchester City FC (Cliff)</dd>
									</dl>
								</a>
								<a id="multiMarketPin" className="pin-off" href="#"></a>
							</li><li id="inPlayEvent_-10363768" className="inplay-off">
								<a id="info" href="#">
									<dl>
										<dt>
											<span id="streamingIcon" className="game-live" style={{ display: 'none' }}>game-live</span>
											<span id="lowLiquidityTag" className="game-low_liq" style={{ display: 'none' }}>Low Liquidity</span>
											<span id="fancyBetIcon" className="game-fancy" style={{ display: 'none' }}>Fancy</span>
											<span id="bookMakerIcon" className="game-bookmaker" style={{ display: 'none' }}>BookMaker</span>
											<span id="feedingSiteIcon" className="game-sportsbook" style={{ display: 'none' }}>Sportsbook</span>
											<span id="sportsBookIcon_1" className="game-sportsbook" style={{ display: 'none' }}>Premium Tennis</span>
											<span id="sportsBookIcon_2" className="game-sportsbook" style={{ display: 'none' }}>Premium Cricket</span>
											<span id="inPlayStatus_-10363768" className="time">Starting in 2' </span>
											<span id="sportsBookEIcon_1" className="game-E" style={{ display: 'none' }}><i></i>Soccer</span>
											<span id="sportsBookEIcon_137" className="game-E" style={{ display: 'flex' }}><i></i>e-Soccer</span>
											<span id="sportsBookEIcon_4" className="game-E" style={{ display: 'none' }}><i></i>Cricket</span>
											<span id="sportsBookEIcon_2" className="game-E" style={{ display: 'none' }}><i></i>Tennis</span>
										</dt>
										<dd id="eventName">SSC Napoli (Nio) vs Real Madrid (Nasmi)</dd>
									</dl>
								</a>
								<a id="multiMarketPin" className="pin-off" href="#"></a>
							</li></ul>
					</div></div>
			</div>


		</>
	);
}

export default Tomorrow;
