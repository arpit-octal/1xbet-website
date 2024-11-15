import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import All_overlay from "../../components/All_overlay";
import AuthProvider from "../../context/AuthContext";
import { apiGet } from "../../Utils/apiFetch";
import apiPath from "../../Utils/apiPath";
import helpers from "../../Utils/helpers";
import Market from "./Market";
function MultiMarket() {
  const [details, setDetails] = useState([]);
  let { user, setLoader } = useContext(AuthProvider);
  const [matchCentralizedIds, setMatchCentralizedIds] = useState({});
  const [getEventId, setEventId] = useState([]);
  const [loader2, setLoader2] = useState(false);
  const getMatchDetails = async () => {
    if (!isEmpty(user)) {
      setLoader(true);
      const { status, data: response_users } = await apiGet(
        apiPath.multiMarket
      );
      if (status === 200) {
        if (response_users.success) {
          response_users.results.map((data) => {
            data.runners.map((it) => {
              it.position = 0;
            });
          });

          response_users.results.map((data) => {
            data.newRunners = JSON.parse(JSON.stringify(data.runners));
          });
          setDetails(response_users.results);
          const marketIds = response_users.results.map((r) => r.centralizedId);

          if (marketIds && marketIds.length) {
            setMatchCentralizedIds(marketIds);
          } else {
            setLoader(false)
          }
          setLoader2(false);
          setLoader(false);
          var mainArr = [];
          const eventIds = response_users.results.map((r) =>
            mainArr.push({ eventId: r.eventId })
          );

          if (mainArr && mainArr.length) {
            setEventId(mainArr);
          }
          setLoader2(false);
          // setLoader(false);
        }
      }
    }
  };

  useEffect(() => {
    getMatchDetails();
  }, [loader2]);

  // Socket Start //
  // useEffect(() => {

  //   if (matchCentralizedIds.length) {
  //     const ACCESS_TOKEN =
  //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudGlkIjoiOWJldCIsImRhdGV0aW1lIjoxNjc5NDk2Mzg3OTkxLCJpYXQiOjE2Nzk0OTYzODd9.iVj6j-gOfLFxcuBhY6XXjlpUG1ZGv9YbAwZt_W2qsGg";
  //     // const newSocket = io(`wss://central3.satsport248.com:8881?token=${ACCESS_TOKEN}`, {
  //     //   transports: ["websocket"]
  //     // });

  //     const matchOddsSocket = new WebSocket(
  //       `wss://central3.satsport248.com:8881?token=${ACCESS_TOKEN}`
  //     );

  //     matchOddsSocket.onopen = (event) => {
  //       matchOddsSocket.send(
  //         JSON.stringify({
  //           action: "set",
  //           markets: `${matchCentralizedIds.join(",")}`,
  //         })
  //       );
  //     };
  //     matchOddsSocket.onmessage = (event) => {
  //       const socket_data = JSON.parse(event.data);
  //       for (const the_odd of socket_data.data) {
  //         setDetails((current) =>
  //           current.map((obj) => {
  //             if (obj.centralizedId == the_odd.mi) {
  //               if ("rt" in the_odd && the_odd?.rt.length > 0) {
  //                 const back_odds = the_odd?.rt.filter((rt) => rt.ib) || [];
  //                 const lay_odds = the_odd?.rt.filter((rt) => !rt.ib) || [];

  //                 return { ...obj, back_odds: back_odds, lay_odds: lay_odds };
  //               }
  //             }
  //             return obj;
  //           })
  //         );
  //       }
  //       setLoader(false)
  //     };
  //   }
  // }, [matchCentralizedIds]);
  // Socket end //
  return (
    <>
      <div id="multiMarketsWrap" className="mian-wrap">
        <h3 id="multiMarketHeader"></h3>
        {!isEmpty(user) && details?.length > 0 ? (
          <Market
            setLoader={setLoader2}
            data={details}
            getMatchDetails={getMatchDetails}
          />
        ) : (
          <div id="noMultiMarkets" className="no-data">
            <h3>There are currently no followed multi markets.</h3>
            <p>Please add some markets from events.</p>
          </div>
        )}

        {/* <Market data={details} sport={2} type="Tennis"/>
        <Market data={details} sport={1} type="Soccer"/>
        <Market data={details} sport={3} type="Casino"/> */}

        {/* <div id="bookMakerTableTemplate" style={{ display: "block" }}>
          <h4 id="gameInfo" className="game-info">
            <p id="gameInfoName">Cricket</p>
            <ul id="infoIcon" className="info-icon">
              <li id="inPlayIcon" style={{ display: "none" }}>
                <img
                  className="info-inplay"
                  src="assets/images/transparent.gif"
                />
                In-Play
              </li>
              <li style={{ display: "none" }}>
                <img
                  className="info-cashout"
                  src="assets/images/transparent.gif"
                />{" "}
                Cash Out
              </li>
            </ul>
          </h4>

          <div id="bookmakerHead" className="game-wrap multi">
            <table className="game-team">
              <tbody>
                <tr>
                  <th>
                    <a className="pin-off" id="multiMarketPin" href="#">
                      Pin to Muilti Markets
                    </a>
                    <h4 id="eventName">
                      <span className="game-bookmaker">BookMaker</span>Surrey vs
                      Glamorgan
                    </h4>
                  </th>
                  <td className="team-multi_Go">
                    <a id="goToFullMarket" className="multi-Go" href="">
                      Go
                    </a>
                  </td>
                  <td className="team-refresh">
                    <a id="refresh" className="refresh" href="#">
                      Refresh
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="bookMakerTempTable" style={{ display: "none" }}>
            <div
              id="bookMakerMarketTemplate"
              className="bets-wrap bets-bookmaker"
              style={{ display: "none" }}
            >
              <h4>
                <span id="marketName"></span>
                <a
                  href="#"
                  id="openBookMakerInfo"
                  className="btn-minmax_bet"
                ></a>
                <div id="bookMakerMinMax" className="fancy_info-popup">
                  <dl>
                    <dt>Min / Max</dt>
                    <dd id="minMax"></dd>
                  </dl>
                  <dl>
                    <dt id="rebateName">Rebate</dt>
                    <dd id="rebate"></dd>
                  </dl>
                  <a href="#" id="closeBookMakerInfo" className="close">
                    Close
                  </a>
                </div>
              </h4>
              <dl className="bets-selections-head">
                <dt></dt>
                <dd className="mode-land"></dd>
                <dd className="mode-land"></dd>
                <dd>Back</dd>
                <dd>Lay</dd>
                <dd className="mode-land"></dd>
                <dd className="mode-land"></dd>
              </dl>
              <dl
                id="bookMakerSelectionTemplate"
                className="bets-selections"
                style={{ display: "none" }}
              >
                <dt>
                  <h4 id="runnerName"></h4>
                  <ul>
                    <li
                      id="before"
                      className="win"
                      style={{ display: "none" }}
                    ></li>
                    <li
                      id="after"
                      className="to-lose"
                      style={{ display: "none" }}
                    ></li>
                  </ul>
                </dt>
                <dd
                  id="suspend"
                  className="suspend"
                  style={{ display: "none" }}
                >
                  <p id="info">Ball Running</p>
                </dd>
                <dd
                  id="delayBetting"
                  className="suspend-fancy"
                  style={{ display: "none" }}
                >
                  <p id="info"></p>
                </dd>
                <dd className="backlay_box">
                  <dl className="back-gradient">
                    <dd id="back_3" className="mode-land">
                      <p></p>
                    </dd>
                    <dd id="back_2" className="mode-land">
                      <p></p>
                    </dd>
                    <dd id="back_1" className="">
                      <a href=""></a>
                    </dd>
                  </dl>
                  <dl className="lay-gradient">
                    <dd id="lay_1" className="">
                      <a href=""></a>
                    </dd>
                    <dd id="lay_2" className="mode-land">
                      <p></p>
                    </dd>
                    <dd id="lay_3" className="mode-land">
                      <p></p>
                    </dd>
                  </dl>
                </dd>
              </dl>
            </div>
          </div>
        </div> */}
        <div
          id="fancyBetTableTemplate"
          className="game-wrap multi fancy-wrap"
          style={{ display: "none" }}
        >
          <h4 id="gameInfo" className="game-info">
            Cricket
            <ul id="infoIcon" className="info-icon">
              <li id="inPlayIcon" style={{ display: "none" }}>
                <img
                  className="info-inplay"
                  src={process.env.REACT_APP_URL + "/assets/images/transparent.gif"}
                />
                In-Play
              </li>
              <li style={{ display: "none" }}>
                <img
                  className="info-cashout"
                  src={process.env.REACT_APP_URL + "/assets/images/transparent.gif"}
                />{" "}
                Cash Out
              </li>
            </ul>
          </h4>

          <table id="fancyBetHead" className="game-team">
            <tbody>
              <tr>
                <th>
                  <a className="pin-off" id="multiMarketPin" href="#">
                    Pin to Muilti Markets
                  </a>
                  <h4 id="eventName">
                    <span className="game-fancy">Fancy</span>Surrey vs Glamorgan
                  </h4>
                </th>
                <td className="team-multi_Go">
                  <a id="goToFullMarket" className="multi-Go" href="">
                    Go
                  </a>
                </td>
                <td className="team-refresh">
                  <a id="refresh" className="refresh" href="#">
                    Refresh
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            id="fancyBetField"
            className="bets-wrap fancy-bet"
            style={{ display: "none" }}
          >
            <dl className="bets-selections-head">
              <dt></dt>
              <dd className="mode-land"></dd>
              <dd className="mode-land"></dd>
              <dd>No</dd>
              <dd>Yes</dd>
              <dd className="mode-land"></dd>
              <dd className="mode-land"></dd>
            </dl>
          </div>

          <div
            id="fancyBetWrap"
            className="bets-wrap fancy-bet"
            style={{ display: "none" }}
          >
            <h5>
              <span id="marketName"></span>
              <a href="#" id="open-fancy_info" className="btn-fancy_info">
                fancybet info
              </a>
              <div id="fancy_popup2" className="fancy_info-popup">
                <dl>
                  <dt>Min / Max</dt>
                  <dd id="minMax"></dd>
                </dl>
                <dl>
                  <dt id="rebateName">Rebate</dt>
                  <dd id="rebate"></dd>
                </dl>
                <a href="#" id="close-fancy_info" className="close">
                  Close
                </a>
              </div>
            </h5>
            <dl className="bets-selections">
              <dt className="line_market-selection">
                <dl className="tips">
                  <dt>
                    <span
                      id="before"
                      className="win"
                      style={{ display: "none" }}
                    ></span>
                    <span
                      id="after"
                      className="to-lose"
                      style={{ display: "none" }}
                    ></span>
                  </dt>
                  <dd id="remarkFirstRow" style={{ display: "none" }}></dd>
                  <dd id="remarkSecondRow" style={{ display: "none" }}></dd>
                </dl>
                <a
                  id="fancyBetBookBtn"
                  href="#"
                  className="btn-book"
                  style={{ display: "none" }}
                >
                  Book
                </a>
              </dt>
              {/* <!-- Suspend for Fancy Bet --> */}
              <dd
                id="suspend"
                className="suspend-fancy"
                style={{ display: "none" }}
              >
                <p id="info">Ball Running</p>
              </dd>
              <dd
                id="delayBetting"
                className="suspend-fancy"
                style={{ display: "none" }}
              >
                <p id="info"></p>
              </dd>
              <dd id="lay_1">
                <a className="lay-1" href="#">
                  <span></span>
                </a>
              </dd>
              <dd id="back_1">
                <a className="back-1" href="#">
                  <span></span>
                </a>
              </dd>
              <dd className="mode-land"></dd>
              <dd className="mode-land"></dd>
            </dl>
          </div>

          <div
            id="fancyBetLotteryWrap"
            className="bets-wrap fancy-bet lottery-bet"
            style={{ display: "none" }}
          >
            <h5>
              <span id="marketName"></span>
              <a href="#" id="open-fancy_info" className="btn-fancy_info">
                fancybet info
              </a>
              <div id="fancy_popup2" className="fancy_info-popup">
                <dl>
                  <dt>Min / Max</dt>
                  <dd id="minMax"></dd>
                </dl>
                <dl>
                  <dt id="rebateName">Rebate</dt>
                  <dd id="rebate"></dd>
                </dl>
                <a href="#" id="close-fancy_info" className="close">
                  Close
                </a>
              </div>
            </h5>

            <dl className="bets-selections">
              <dt className="lottery-tips">
                <h4>Runs</h4>
                <a
                  id="fancyBetBookBtn"
                  href="#"
                  className="btn-book"
                  style={{ display: "none" }}
                >
                  Book
                </a>
                <dl className="tips">
                  <dt>
                    <span
                      id="before"
                      className="win"
                      style={{ display: "none" }}
                    ></span>
                    <span
                      id="after"
                      className="to-lose"
                      style={{ display: "none" }}
                    ></span>
                  </dt>
                </dl>
              </dt>
              <dd
                id="suspend"
                className="suspend-fancy"
                style={{ display: "none" }}
              >
                <p id="info">Ball Running</p>
              </dd>
              <dd
                id="delayBetting"
                className="suspend-fancy"
                style={{ display: "none" }}
              >
                <p id="info"></p>
              </dd>
              <dd id="lotteryBall">
                <a className="lottery-ball" id="lotteryNo_0">
                  0
                </a>
                <a className="lottery-ball" id="lotteryNo_1">
                  1
                </a>
                <a className="lottery-ball" id="lotteryNo_2">
                  2
                </a>
                <a className="lottery-ball" id="lotteryNo_3">
                  3
                </a>
                <a className="lottery-ball" id="lotteryNo_4">
                  4
                </a>
                <a className="lottery-ball" id="lotteryNo_5">
                  5
                </a>
                <a className="lottery-ball" id="lotteryNo_6">
                  6
                </a>
                <a className="lottery-ball" id="lotteryNo_7">
                  7
                </a>
                <a className="lottery-ball" id="lotteryNo_8">
                  8
                </a>
                <a className="lottery-ball" id="lotteryNo_9">
                  9
                </a>
              </dd>
            </dl>
          </div>

          <div
            id="fancyBetKhaddaWrap"
            className="bets-wrap fancy-bet khadda-bet"
            style={{ display: "none" }}
          >
            <h5>
              <span id="marketName"></span>
              <a href="#" id="open-fancy_info" className="btn-fancy_info">
                fancybet info
              </a>
              <div id="fancy_popup2" className="fancy_info-popup">
                <dl>
                  <dt>Min / Max</dt>
                  <dd id="minMax"></dd>
                </dl>
                <dl>
                  <dt id="rebateName">Rebate</dt>
                  <dd id="rebate"></dd>
                </dl>
                <a href="#" id="close-fancy_info" className="close">
                  Close
                </a>
              </div>
            </h5>
            <dl className="bets-selections">
              <dt>
                <dl className="tips">
                  <dt>
                    <span
                      id="before"
                      className="win"
                      style={{ display: "none" }}
                    ></span>
                    <span
                      id="after"
                      className="to-lose"
                      style={{ display: "none" }}
                    ></span>
                  </dt>
                </dl>
                <a
                  id="fancyBetBookBtn"
                  href="#"
                  className="btn-book"
                  style={{ display: "none" }}
                >
                  Book
                </a>
              </dt>
              <dd
                id="suspend"
                className="suspend-fancy"
                style={{ display: "none" }}
              >
                <p id="info">Ball Running</p>
              </dd>
              <dd
                id="delayBetting"
                className="suspend-fancy"
                style={{ display: "none" }}
              >
                <p id="info"></p>
              </dd>
              <dd id="back_1">
                <a className="back-1" href="#">
                  <span>odds</span>
                </a>
              </dd>
              <dd className="mode-land"></dd>
            </dl>
          </div>

          <div
            id="fancyBetThreeSelectionsWrap"
            className="bets-wrap fancy-bet"
            style={{ display: "none" }}
          >
            <h5>
              <span id="marketName"></span>
              <a href="#" id="open-fancy_info" className="btn-fancy_info">
                fancybet info
              </a>
              <div id="fancy_popup2" className="fancy_info-popup">
                <dl>
                  <dt>Min / Max</dt>
                  <dd id="minMax"></dd>
                </dl>
                <dl>
                  <dt id="rebateName">Rebate</dt>
                  <dd id="rebate"></dd>
                </dl>
                <a href="#" id="close-fancy_info" className="close">
                  Close
                </a>
              </div>
            </h5>

            <dl className="bets-selections">
              <dt>
                <dl className="tips">
                  <dt>
                    <span
                      id="before"
                      className="win"
                      style={{ display: "none" }}
                    ></span>
                    <span
                      id="after"
                      className="to-lose"
                      style={{ display: "none" }}
                    ></span>
                  </dt>
                  <dd id="remarkFirstRow" style={{ display: "none" }}></dd>
                  <dd id="remarkSecondRow" style={{ display: "none" }}></dd>
                </dl>
                <a
                  id="fancyBetBookBtn"
                  href="#"
                  className="btn-book"
                  style={{ display: "none" }}
                >
                  Book
                </a>
              </dt>
              <dd
                id="suspend"
                className="suspend-fancy"
                style={{ display: "none" }}
              >
                <p id="info">Ball Running</p>
              </dd>
              <dd
                id="delayBetting"
                className="suspend-fancy"
                style={{ display: "none" }}
              >
                <p id="info"></p>
              </dd>
              <dd className="select-more">
                <a id="lay_1" className="lay-1" href="#">
                  <span></span>
                </a>
                <a id="back_1" className="back-1" href="#">
                  <span></span>
                </a>
                <a id="lay_2" className="lay-1" href="#">
                  <span></span>
                </a>
                <a id="back_2" className="back-1" href="#">
                  <span></span>
                </a>
                <a id="lay_3" className="lay-1" href="#">
                  <span></span>
                </a>
                <a id="back_3" className="back-1" href="#">
                  <span></span>
                </a>
              </dd>
              <dd className="mode-land"></dd>
              <dd className="mode-land"></dd>
            </dl>
          </div>
        </div>
        <div id="sportsBookWrap" style={{ display: "none" }}>
          <div id="sportsBookTableTemplate" style={{ display: "none" }}>
            <h4 id="gameInfo" className="game-info">
              <p id="infoName_1" style={{ display: "none" }}>
                Tennis
              </p>
              <p id="infoName_2" style={{ display: "none" }}>
                Cricket
              </p>
              <ul id="infoIcon" className="info-icon">
                <li id="inPlayIcon" style={{ display: "none" }}>
                  <img
                    className="info-inplay"
                    src={process.env.REACT_APP_URL + "/assets/images/transparent.gif"}
                  />
                  In-Play
                </li>
                <li style={{ display: "none" }}>
                  <img
                    className="info-cashout"
                    src={process.env.REACT_APP_URL + "/assets/images/transparent.gif"}
                  />{" "}
                  Cash Out
                </li>
              </ul>
            </h4>

            <div id="sportsBookHead" className="game-wrap multi">
              <table className="game-team">
                <tbody>
                  <tr>
                    <th>
                      <a className="pin-off" id="multiMarketPin" href="#">
                        Pin to Muilti Markets
                      </a>
                      <h4 id="eventName">
                        <span
                          id="sportsBookEIcon_1"
                          className="game-E"
                          style={{ display: "none" }}
                        >
                          <i></i>Soccer
                        </span>
                        <span
                          id="sportsBookEIcon_137"
                          className="game-E"
                          style={{ display: "none" }}
                        >
                          <i></i>e-Soccer
                        </span>
                        <span
                          id="sportsBookEIcon_4"
                          className="game-E"
                          style={{ display: "none" }}
                        >
                          <i></i>Cricket
                        </span>
                        <span
                          id="sportsBookEIcon_2"
                          className="game-E"
                          style={{ display: "none" }}
                        >
                          <i></i>Tennis
                        </span>
                        <span id="icon" className="game-sportsbook">
                          <pre id="inPlayTag" style={{ display: "none" }}>
                            in-play
                          </pre>
                          Sportsbook
                        </span>
                        Surrey vs Glamorgan
                      </h4>
                    </th>
                    <td className="team-multi_Go">
                      <a id="goToFullMarket" className="multi-Go" href="">
                        Go
                      </a>
                    </td>
                    <td className="team-refresh">
                      <a id="refresh" className="refresh" href="#">
                        Refresh
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              id="sportsBookNoBet"
              className="bets-wrap"
              style={{ display: "none" }}
            >
              <p className="no-game">Sports Book has no market</p>
            </div>

            <div
              id="sportsBookMarketTemplate"
              className="bets-wrap multi sports-book"
              style={{ display: "none" }}
            >
              <h4>
                <span id="marketName">Total sixes</span>
              </h4>

              <dl
                id="sportsBookSelectionTemplate"
                className="bets-selections"
                style={{ display: "none" }}
              >
                <dt className="">
                  <h4 id="selectionName"></h4>
                  <ul>
                    <li
                      id="before"
                      className="win"
                      style={{ display: "none" }}
                    ></li>
                    <li
                      id="after"
                      className="to-lose"
                      style={{ display: "none" }}
                    ></li>
                  </ul>
                </dt>
                <dd
                  id="suspend"
                  className="suspend"
                  style={{ display: "none" }}
                >
                  <p>Ball Run</p>
                </dd>
                <dd>
                  <a id="back_1" className="back-1" href="#">
                    <span></span>
                  </a>
                </dd>
                <dd className="mode-land"></dd>
              </dl>
            </div>
          </div>
        </div>

        <p
          id="rotateScreen"
          className="info-rotate"
          style={{ display: "none" }}
        >
          Rotate Screen
          <br />
          to see Market Depth
        </p>
      </div>
    </>
  );
}

export default MultiMarket;
