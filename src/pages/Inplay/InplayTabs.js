import { isEmpty } from "lodash";
import moment from "moment";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthProvider from "../../context/AuthContext";
import helpers from "../../Utils/helpers";
const InplayTabs = ({
  data,
  type,
  sportsType,
  sportsId,
  handelAddMultiMarket,
  setLoading,
}) => {
  let { user, profileData } = useContext(AuthProvider);
  const navigate = useNavigate();
  return (
    <div className="wrap-highlight_list" id="inPlayData">
      <div id="inPlayEventType_4" style={{ display: "block" }}>
        <h3>{sportsType}</h3>

        <ul className="highlight-list" id="inPlayList_4">
          {data.length > 0 &&
            data.map((item) => {
              let obj = moment.duration(
                moment(item?.eventDateTime).diff(moment(new Date()))
              )?._data;
              return (
                item.eventType == sportsId && (
                  <li
                    id="inPlayEvent_-10362833"
                    className={`inplay-on ${type == "inplay" ? "inplay-dot-true" : "inplay-dot-false"
                      }`}
                  >
                    <Link
                      id="info"
                      to={`/match-details/${item.eventId}/${item.marketId}`}
                    >
                      <dl>
                        <dt>
                          <span
                            id="streamingIcon"
                            className="game-live"
                            style={{ display: "flex" }}
                          >
                            game-live
                          </span>
                          <span
                            id="bookMakerIcon"
                            className={`game-bookmaker game-odds ${"in-play"}`}
                            style={{ display: "flex" }}
                          >
                            {<pre>in-play</pre>} Odds
                          </span>
                          {item?.gameType == "cricket" &&
                            <>
                              <span
                                id="bookMakerIcon"
                                className={`game-bookmaker ${"in-play"}`}
                                style={{ display: "flex" }}
                              >
                                {<pre>in-play</pre>} BookMaker
                              </span>
                              <span
                                id="fancyBetIcon"
                                className={`game-fancy ${"in-play"
                                  }`}
                                style={{ display: "flex" }}
                              >
                                {<pre>in-play</pre>} Fancy
                              </span>
                            </>
                          }
                          <span
                            id="feedingSiteIcon"
                            className={`game-sportsbook`}
                            style={{ display: "flex" }}
                          >
                            Sportsbook
                          </span>
                          {/* {item?.channel !== "false" && (
                            <span
                              id="streamingIcon"
                              className="game-live"
                              style={{ display: "flex" }}
                            >
                              {obj.days < 1 && <pre>in-play</pre>} game-live
                            </span>
                          )}
                          <span
                            id="lowLiquidityTag"
                            className="game-low_liq"
                            style={{ display: "none" }}
                          >
                            Low Liquidity
                          </span>
                          {item?.fancyList > 0 && (
                            <span
                              id="fancyBetIcon"
                              className={`game-fancy ${obj.days < 1 && "in-play"
                                }`}
                              style={{ display: "flex" }}
                            >
                              {obj.days < 1 && <pre>in-play</pre>} Fancy
                            </span>
                          )}
                          {item?.bookmakerRunners &&
                            item?.bookmakerRunners?.length > 0 && (
                              <span
                                id="bookMakerIcon"
                                className={`game-bookmaker ${obj.days < 1 && "in-play"
                                  }`}
                                style={{ display: "flex" }}
                              >
                                {obj.days < 1 && <pre>in-play</pre>} BookMaker
                              </span>
                            )}

                          <span
                            id="feedingSiteIcon"
                            className="game-sportsbook"
                            style={{ display: "flex" }}
                          >
                            Sportsbook
                          </span> */}

                          {/* <span
                            id="feedingSiteIcon"
                            className="game-sportsbook"
                            style={{ display: "none" }}
                          >
                            Sportsbook
                          </span>
                          <span
                            id="sportsBookIcon_1"
                            className="game-sportsbook"
                            style={{ display: "none" }}
                          >
                            Premium Tennis
                          </span>
                          <span
                            id="sportsBookIcon_2"
                            className="game-sportsbook"
                            style={{ display: "none" }}
                          >
                            Premium Cricket
                          </span> */}
                          {obj.days == 0 &&
                            obj.hours == 0 &&
                            obj?.years == 0 &&
                            obj?.months == 0 &&
                            obj.minutes > 0 &&
                            obj?.minutes < profileData?.beforeInPlay ? (
                            <span id="dateTimeInfo" className="time">
                              Starting in {obj?.minutes}'
                            </span>
                          ) : item.status == "in_play" ? (
                            <span id="dateTimeInfo" className="time">
                              In-Play {item?.timeElapsed}
                            </span>
                          ) : (
                            <span id="dateTimeInfo" className="time">
                              {helpers.matchDateTime(item.eventDateTime)}
                            </span>
                          )}
                          {/* {item.status == "in_play" ? (
                            <span id="dateTimeInfo" className="time">
                              In-Play
                            </span>
                          ) : obj.days == 0 &&
                            obj.hours == 0 &&
                            obj?.years == 0 &&
                            obj?.months == 0 ? (
                            <span id="dateTimeInfo" className="time">
                              Starting in {obj.minutes}
                            </span>
                          ) : (
                            <span id="dateTimeInfo" className="time">
                              {helpers.matchDateTime(item.eventDateTime)}
                            </span>
                          )} */}
                          {/* <span
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
                          </span> */}
                          {
                            item?.gameType == 'soccer' && (item?.eventName?.includes(" SRL T20 ") || item?.eventName?.includes(" T10 ")) && (
                              <span
                                id="sportsBookEIcon_1"
                                className="game-E"
                              // style={{ display: "none" }}
                              >
                                <i></i>Soccer
                              </span>
                            )
                          }

                          {
                            item?.gameType == 'cricket' && (item?.eventName?.includes(" SRL T20 ") || item?.eventName?.includes(" T10 ")) && (
                              <span
                                id="sportsBookEIcon_4"
                                className="game-E"
                              // style={{ display: "none" }}
                              >
                                <i></i>Cricket
                              </span>
                            )}
                          {
                            item?.gameType == 'tennis' && (item?.eventName?.includes(" SRL T20 ") || item?.eventName?.includes(" T10 ")) && (
                              <span
                                id="sportsBookEIcon_2"
                                className="game-E"
                              // style={{ display: "none" }}
                              >
                                <i></i>Tennis
                              </span>
                            )}
                        </dt>
                        <dd id="eventName">
                          {item?.score
                            ? `${item?.eventName.split("v")[0]} ${item?.score
                            } ${item?.eventName.split("v")[1]}`
                            : item?.eventName}
                        </dd>
                      </dl>
                    </Link>
                    <a
                      id="multiMarketPin"
                      onClick={() => {
                        if (!isEmpty(user)) {
                          handelAddMultiMarket(item.eventId);
                          setLoading(true);
                        } else {
                          navigate("/login");
                        }
                      }}
                      className={
                        item.multi_market > 0
                          ? "pin-on"
                          : "pin-off"
                      }
                      href="javascript:void(0)"
                    ></a>
                  </li>
                )
              );
            })}


        </ul>
        {/* {sportsType == "Cricket" && (
          <div id="inplayVirtualCricketImage" className="footer-kv">
            <a id="inplayVirtualCricketEntrance" className="entrance" href="#">
              <img
                src={process.env.REACT_APP_URL + "/assets/images/kv-virtual-cricket-m.jpg"}
                style={{ width: "100%" }}
              />
            </a>
          </div>
        )} */}
      </div>

    </div>
  );
};

export default InplayTabs;
