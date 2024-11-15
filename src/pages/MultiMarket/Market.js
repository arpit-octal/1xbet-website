import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import BetSlipContext from "../../context/BetSlipContext";
import obj from "../../Utils/constants";
import BackandLay from "../MatchDetails/BackandLay";
import MatchDetails from "../MatchDetails/MatchDetails";
import { io } from "socket.io-client";
import { AuthProvider } from "../../context/AuthContext";

const Market = ({ data, getMatchDetails, setLoader }) => {
  let { handelAddMultiMarket, handelShowBetSlip } = useContext(BetSlipContext);
  let user = useContext(AuthProvider);
  const [back_odds, setBackOdds] = useState([]);
  const [lay_odds, setLayOdds] = useState([]);
  const [betFairMs, setBetFairMs] = useState(1);
  const [totalMatched, setTotalMatched] = useState({});

  useEffect(() => {
    if (data?.length > 0) {
      data.map((matchDetails) => {
        if (matchDetails?.eventId) {
          let newSocket = "";
          let randomId = user ? user?.user?._id : 112233;
          if (user) {
            newSocket = io(
              `${process.env.REACT_APP_API_BASE_URL1}?token=${randomId}&userType=front&eventId=${matchDetails?.eventId}`,
              {
                transports: ["websocket"],
                forceNew: true
              }
            );
          } else {
            newSocket = io(
              `${process.env.REACT_APP_API_BASE_URL1}?token=${randomId}&eventId=${matchDetails?.eventId}`,
              {
                transports: ["websocket"],
                forceNew: true
              }
            );
          }
          if (!isEmpty(user)) {


            const listenBetfairOdds = (event) => {
              const socket_data =
                (event &&
                  event?.results?.find(
                    (item) => item.eventId == matchDetails?.eventId
                  )) ||
                [];
              if (
                socket_data &&
                socket_data?.eventId &&
                matchDetails?.eventId == socket_data?.eventId
              ) {
                // console.log('socket_data--------------', socket_data)
                if (socket_data.ms) {
                  setBetFairMs(socket_data.ms);
                }
                if (socket_data.rt?.length) {
                  const back_odds = socket_data.rt.filter((rt) => rt.ib) || [];
                  const lay_odds = socket_data.rt.filter((rt) => !rt.ib) || [];
                  setBackOdds(back_odds);
                  setLayOdds(lay_odds);
                  setTotalMatched(socket_data?.totalMatched);
                }
              }
            };
            newSocket.on("listenBetFairOdds", listenBetfairOdds);

          } else {
            const listenBetfairOdds = (event) => {

              const socket_data =
                (event &&
                  event?.results?.find(
                    (item) => item.eventId == matchDetails?.eventId
                  )) ||
                [];
              // console.log('socket_data----------------------', socket_data.eventId, parmas?.eventId, socket_data.ms)
              if (
                socket_data &&
                socket_data?.eventId && matchDetails?.eventId == socket_data?.eventId
              ) {
                if (socket_data.ms) {
                  setBetFairMs(socket_data.ms);
                }
                // console.log('socket_data.rt',socket_data.rt)
                if (socket_data.rt?.length) {
                  const back_odds = socket_data.rt.filter((rt) => rt.ib) || [];
                  const lay_odds = socket_data.rt.filter((rt) => !rt.ib) || [];
                  // console.log('back_odds, lay_odds',back_odds, lay_odds)

                  setBackOdds(back_odds);
                  setLayOdds(lay_odds);
                  setTotalMatched(socket_data?.totalMatched);
                }
              }
            };
            newSocket.on("listenBetFairOdds", listenBetfairOdds);

          }

          newSocket.on("disconnect", function () {
            console.log('disconnect', '1')
            newSocket.connect();
          });

          return () => newSocket.close();

        }
      })
    }
  }, []);


  return data?.map((item) => {
    return (
      <div id="multiMarketsTemplate" style={{ display: "block" }}>
        <div className="game-wrap multi">
          <h4 id="gameInfo" className="game-info">
            {item.eventType && obj.betCheckObj[item.eventType]}
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
              <li>
                <span
                  id="lowLiquidityTag"
                  className="game-low_liq"
                  style={{ display: "none" }}
                >
                  Low
                </span>
              </li>
            </ul>
          </h4>

          <table id="gameTeam" className="game-team">
            <tbody>
              <tr>
                <th>
                  {/* <a
                    id="multiMarketPin"
                    className="pin-off-color pin-off"
                    href="javascript:void(0)"
                  ></a> */}

                  <a
                    id="multiMarketPin"
                    // className="pin-off"
                    onClick={() => {
                      handelAddMultiMarket(item.eventId);
                      setLoader(true);
                    }}
                    className={"pin-on"}
                    href="javascript:void(0)"
                  ></a>
                  <h4 id="eventName">{item.eventName}</h4>
                </th>
                <td className="team-multi_Go">
                  <Link
                    to={`/match-details/${item.eventId}/${item.marketId}`}
                    id="goToFullMarket"
                    className="multi-Go"
                  />
                </td>
                <td className="team-refresh">
                  <a
                    href="javascript:void(0)"
                    id="refresh"
                    className="refresh"
                    onClick={() => getMatchDetails()}
                  ></a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div id="marketBetsWrap" className="bets-wrap">
          <dl id="betsHead" className="bets-selections-head">
            <dt>
              <a className="a-depth" id="marketDepthBtn" href="#">
                Markets Depth
              </a>
              <p id="marketName">Match Odds</p>
            </dt>
            <dd className="mode-land"></dd>
            <dd className="mode-land"></dd>
            <dd>Back</dd>
            <dd>Lay</dd>
            <dd className="mode-land"></dd>
            <dd className="mode-land"></dd>
          </dl>
          {item?.runners?.length > 0 &&
            item?.runners?.map((res) => {
              let filter_odds_back = back_odds.filter((todd) => todd.ri === res.SelectionId);
              let filter_odds_lay = lay_odds.filter((todd) => todd.ri === res.SelectionId);
              // console.log('vack odds', back);

              // console.log('lay odds', lay);
              return (
                <dl
                  id="selectionTemplate"
                  className="bets-selections"
                  style={{ display: "flex" }}
                >
                  <dt>
                    <h4 id="runnerName">{res.RunnerName}</h4>
                    <ul id="winLoss">
                      <li
                        id="withoutBet"
                        className="win"
                        style={{ display: "none" }}
                      ></li>
                      <li
                        id="lossWithoutBet"
                        className="win"
                        style={{ display: "none" }}
                      ></li>
                      <li
                        id="withBet"
                        className="win"
                        style={{ display: "none" }}
                      ></li>
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


                  <BackandLay
                    market={"multi"}
                    back={!isEmpty(filter_odds_back) ? filter_odds_back : []}
                    lay={!isEmpty(filter_odds_lay) ? filter_odds_lay : []}
                    item={res}
                    details={item}
                    handelShowBetSlip={handelShowBetSlip}
                  />
                </dl>
              );
            })}
        </div>
      </div>
    );
  });
};

export default Market;
