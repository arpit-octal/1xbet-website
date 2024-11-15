import React from "react";

function SportsDetail() {
  return (
    <>
      <div id="page">
        <div id="mainWrap" className="mainWrap">
          <div className="game-wrap">
            <h4 id="gameInfo" className="game-info">
              Horse Racing
            </h4>

            <table id="gameTeam" className="game-team">
              <tbody>
                <tr>
                  <th>
                    <a id="multiMarketPin" className="pin-off" href="#"></a>
                    <h4 id="teamHome">Lingfield 22nd Dec - 7f Hcap</h4>
                    <h4 id="teamAway" style={{ display: "none" }}></h4>
                    <ul id="time" className="scores-time">
                      <li>22 Dec, 17:20</li>
                    </ul>
                  </th>
                  <td className="team-refresh">
                    <a id="refresh" className="refresh" href="#"></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            id="naviMarket"
            className="market-type ps ps--theme_default ps--active-x"
          >
            <ul id="naviMarketList">
              <li id="naviMarketTemaplate" style={{ display: "none" }}>
                <a href="#"></a>
              </li>
              <li id="naviAllMarketTemaplate" style={{ display: "none" }}>
                <a href="#">
                  All<span className="icon-arrow_down"></span>
                </a>
              </li>
              <li id="naviMarket_1_207882456" className="select">
                <a href="#">17:20 Win</a>
              </li>
              <li id="naviMarket_1_207882458" style={{ display: "listItem" }}>
                <a href="#">17:20 Places</a>
              </li>
              <li id="naviMarket_1_207882463" style={{ display: "listItem" }}>
                <a href="#">17:50 Win</a>
              </li>
              <li id="naviMarket_1_207882464" style={{ display: "listItem" }}>
                <a href="#">17:50 Places</a>
              </li>
              <li id="naviMarket_all" style={{ display: "listItem" }}>
                <a href="#">
                  All<span className="icon-arrow_down"></span>
                </a>
              </li>
            </ul>
          </div>

          <div id="marketBetsWrap" className="bets-wrap asiahadicap">
            <a id="minMaxButton" className="bet-limit"></a>
            <dl id="betsHead" className="bets-selections-head">
              <dt>
                <a className="a-depth" href="#" id="marketDepthBtn">
                  Markets Depth
                </a>
                <p>
                  <span>Matched</span>
                  <strong id="totalMatched">PBU 548,657</strong>
                </p>
              </dt>
              <dd className="mode-land"></dd>
              <dd className="mode-land"></dd>
              <dd>Back</dd>
              <dd>Lay</dd>
              <dd className="mode-land"></dd>
              <dd className="mode-land"></dd>
            </dl>

            <dl
              id="selection_19243481_0_00"
              className="bets-selections"
              style={{ display: "flex" }}
            >
              <dt>
                <div id="horseInfo" className="horse-info">
                  <ul id="horseBox" className="horse-box">
                    <li id="clothNumberAlpha">5</li>
                    <li id="stallDraw">(8)</li>
                  </ul>
                  <div id="uniform" className="uniform">
                    <img
                      src={
                        process.env.REACT_APP_URL +
                        "/assets/images/home/00876155A.webp"
                      }
                    />
                  </div>
                  <ul id="horseName" className="horse-name">
                    <li id="runnerName">Deputise</li>
                    <li id="jockyName">F Norton</li>
                  </ul>
                </div>

                <h4 id="runnerName" style={{ display: "none" }}>
                  Deputise
                </h4>
                <ul id="winLoss">
                  <li
                    id="withoutBet"
                    className="lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithoutBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="withBet"
                    className="to-lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfit"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiability"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfitWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiabilityWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                </ul>
              </dt>
              <dd id="suspend" className="suspend" style={{ display: "none" }}>
                <p>Suspend</p>
              </dd>
              <dd id="closed" className="suspend" style={{ display: "none" }}>
                <p>Closed</p>
              </dd>
              <dd
                id="nonRunner"
                className="suspend"
                style={{ display: "none" }}
              >
                <p>Non Runner</p>
              </dd>
              <dd id="back_3" className="mode-land">
                <a className="back-3" href="#">
                  4.1<span> 955</span>
                </a>
              </dd>
              <dd id="back_2" className="mode-land">
                <a className="back-2" href="#">
                  4.2<span> 1,590</span>
                </a>
              </dd>
              <dd id="back_1">
                <a className="back-1 spark" href="#">
                  4.3<span> 930</span>
                </a>
              </dd>
              <dd id="lay_1"></dd>
              <dd id="lay_2" className="mode-land"></dd>
              <dd id="lay_3" className="mode-land"></dd>
            </dl>

            <dl
              id="selection_19243481_0_00"
              className="bets-selections"
              style={{ display: "flex" }}
            >
              <dt>
                <div id="horseInfo" className="horse-info">
                  <ul id="horseBox" className="horse-box">
                    <li id="clothNumberAlpha">5</li>
                    <li id="stallDraw">(8)</li>
                  </ul>
                  <div id="uniform" className="uniform">
                    <img
                      src={
                        process.env.REACT_APP_URL +
                        "/assets/images/home/00876155A.webp"
                      }
                    />
                  </div>
                  <ul id="horseName" className="horse-name">
                    <li id="runnerName">Deputise</li>
                    <li id="jockyName">F Norton</li>
                  </ul>
                </div>

                <h4 id="runnerName" style={{ display: "none" }}>
                  Deputise
                </h4>
                <ul id="winLoss">
                  <li
                    id="withoutBet"
                    className="lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithoutBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="withBet"
                    className="to-lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfit"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiability"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfitWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiabilityWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                </ul>
              </dt>
              <dd id="suspend" className="suspend" style={{ display: "none" }}>
                <p>Suspend</p>
              </dd>
              <dd id="closed" className="suspend" style={{ display: "none" }}>
                <p>Closed</p>
              </dd>
              <dd
                id="nonRunner"
                className="suspend"
                style={{ display: "none" }}
              >
                <p>Non Runner</p>
              </dd>
              <dd id="back_3" className="mode-land">
                <a className="back-3" href="#">
                  4.1<span> 955</span>
                </a>
              </dd>
              <dd id="back_2" className="mode-land">
                <a className="back-2" href="#">
                  4.2<span> 1,590</span>
                </a>
              </dd>
              <dd id="back_1">
                <a className="back-1 spark" href="#">
                  4.3<span> 930</span>
                </a>
              </dd>
              <dd id="lay_1"></dd>
              <dd id="lay_2" className="mode-land"></dd>
              <dd id="lay_3" className="mode-land"></dd>
            </dl>

            <dl
              id="selection_19243481_0_00"
              className="bets-selections"
              style={{ display: "flex" }}
            >
              <dt>
                <div id="horseInfo" className="horse-info">
                  <ul id="horseBox" className="horse-box">
                    <li id="clothNumberAlpha">5</li>
                    <li id="stallDraw">(8)</li>
                  </ul>
                  <div id="uniform" className="uniform">
                    <img
                      src={
                        process.env.REACT_APP_URL +
                        "/assets/images/home/00876155A.webp"
                      }
                    />
                  </div>
                  <ul id="horseName" className="horse-name">
                    <li id="runnerName">Deputise</li>
                    <li id="jockyName">F Norton</li>
                  </ul>
                </div>

                <h4 id="runnerName" style={{ display: "none" }}>
                  Deputise
                </h4>
                <ul id="winLoss">
                  <li
                    id="withoutBet"
                    className="lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithoutBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="withBet"
                    className="to-lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfit"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiability"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfitWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiabilityWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                </ul>
              </dt>
              <dd id="suspend" className="suspend" style={{ display: "none" }}>
                <p>Suspend</p>
              </dd>
              <dd id="closed" className="suspend" style={{ display: "none" }}>
                <p>Closed</p>
              </dd>
              <dd
                id="nonRunner"
                className="suspend"
                style={{ display: "none" }}
              >
                <p>Non Runner</p>
              </dd>
              <dd id="back_3" className="mode-land">
                <a className="back-3" href="#">
                  4.1<span> 955</span>
                </a>
              </dd>
              <dd id="back_2" className="mode-land">
                <a className="back-2" href="#">
                  4.2<span> 1,590</span>
                </a>
              </dd>
              <dd id="back_1">
                <a className="back-1 spark" href="#">
                  4.3<span> 930</span>
                </a>
              </dd>
              <dd id="lay_1"></dd>
              <dd id="lay_2" className="mode-land"></dd>
              <dd id="lay_3" className="mode-land"></dd>
            </dl>

            <dl
              id="selection_19243481_0_00"
              className="bets-selections"
              style={{ display: "flex" }}
            >
              <dt>
                <div id="horseInfo" className="horse-info">
                  <ul id="horseBox" className="horse-box">
                    <li id="clothNumberAlpha">5</li>
                    <li id="stallDraw">(8)</li>
                  </ul>
                  <div id="uniform" className="uniform">
                    <img
                      src={
                        process.env.REACT_APP_URL +
                        "/assets/images/home/00876155A.webp"
                      }
                    />
                  </div>
                  <ul id="horseName" className="horse-name">
                    <li id="runnerName">Deputise</li>
                    <li id="jockyName">F Norton</li>
                  </ul>
                </div>

                <h4 id="runnerName" style={{ display: "none" }}>
                  Deputise
                </h4>
                <ul id="winLoss">
                  <li
                    id="withoutBet"
                    className="lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithoutBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="withBet"
                    className="to-lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfit"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiability"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfitWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiabilityWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                </ul>
              </dt>
              <dd id="suspend" className="suspend" style={{ display: "none" }}>
                <p>Suspend</p>
              </dd>
              <dd id="closed" className="suspend" style={{ display: "none" }}>
                <p>Closed</p>
              </dd>
              <dd
                id="nonRunner"
                className="suspend"
                style={{ display: "none" }}
              >
                <p>Non Runner</p>
              </dd>
              <dd id="back_3" className="mode-land">
                <a className="back-3" href="#">
                  4.1<span> 955</span>
                </a>
              </dd>
              <dd id="back_2" className="mode-land">
                <a className="back-2" href="#">
                  4.2<span> 1,590</span>
                </a>
              </dd>
              <dd id="back_1">
                <a className="back-1 spark" href="#">
                  4.3<span> 930</span>
                </a>
              </dd>
              <dd id="lay_1"></dd>
              <dd id="lay_2" className="mode-land"></dd>
              <dd id="lay_3" className="mode-land"></dd>
            </dl>
            <dl
              id="selection_19243481_0_00"
              className="bets-selections"
              style={{ display: "flex" }}
            >
              <dt>
                <div id="horseInfo" className="horse-info">
                  <ul id="horseBox" className="horse-box">
                    <li id="clothNumberAlpha">5</li>
                    <li id="stallDraw">(8)</li>
                  </ul>
                  <div id="uniform" className="uniform">
                    <img
                      src={
                        process.env.REACT_APP_URL +
                        "/assets/images/home/00876155A.webp"
                      }
                    />
                  </div>
                  <ul id="horseName" className="horse-name">
                    <li id="runnerName">Deputise</li>
                    <li id="jockyName">F Norton</li>
                  </ul>
                </div>

                <h4 id="runnerName" style={{ display: "none" }}>
                  Deputise
                </h4>
                <ul id="winLoss">
                  <li
                    id="withoutBet"
                    className="lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithoutBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="withBet"
                    className="to-lose"
                    style={{ display: "none" }}
                  >
                    {" "}
                    0.00
                  </li>
                  <li
                    id="lossWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfit"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiability"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroProfitWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                  <li
                    id="zeroLiabilityWithBet"
                    className="win"
                    style={{ display: "none" }}
                  ></li>
                </ul>
              </dt>
              <dd id="suspend" className="suspend" style={{ display: "none" }}>
                <p>Suspend</p>
              </dd>
              <dd id="closed" className="suspend" style={{ display: "none" }}>
                <p>Closed</p>
              </dd>
              <dd
                id="nonRunner"
                className="suspend"
                style={{ display: "none" }}
              >
                <p>Non Runner</p>
              </dd>
              <dd id="back_3" className="mode-land">
                <a className="back-3" href="#">
                  4.1<span> 955</span>
                </a>
              </dd>
              <dd id="back_2" className="mode-land">
                <a className="back-2" href="#">
                  4.2<span> 1,590</span>
                </a>
              </dd>
              <dd id="back_1">
                <a className="back-1 spark" href="#">
                  4.3<span> 930</span>
                </a>
              </dd>
              <dd id="lay_1"></dd>
              <dd id="lay_2" className="mode-land"></dd>
              <dd id="lay_3" className="mode-land"></dd>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}

export default SportsDetail;
