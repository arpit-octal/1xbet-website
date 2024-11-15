import { isEmpty } from "lodash";
import moment from "moment-timezone";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import BetSlipContext from "../context/BetSlipContext";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import helpers from "../Utils/helpers";

function Sports() {
  let { handelAddMultiMarket } = useContext(BetSlipContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sportsData, setSportsData] = useState([]);
  let {
    user,
    setSearchToogle,
    setLoader,
    setCasinoModel,
    setCasinoObj,
    inPlayScore,
    profileData,
  } = useContext(AuthProvider);

  const [sports, setSport] = useState("cricket");
  const [inplayCountData, setInplayCountData] = useState({});
  const getTournamentData = async () => {
    setLoader(true);
    let temp = user
      ? `?gameType=${sports}&userId=${user ? user.user._id : false}`
      : `?gameType=${sports}`;
    const { status, data: response_users } = await apiGet(
      apiPath.matchList + temp
    );
    if (status === 200) {
      if (response_users.success) {
        setLoader(false);
        if (inPlayScore?.length > 0) {
          setSportsData(
            response_users?.results?.map((res) => {
              let temp = inPlayScore.find(
                (item) => item?.eventId == res?.eventId
              );
              return {
                ...res,
                score:
                  temp?.eventId == res?.eventId
                    ? temp?.score == 0
                      ? ""
                      : temp?.score
                    : "",
                timeElapsed:
                  temp?.eventId == res?.eventId ? temp?.timeElapsed : "",
              };
            })
          );
        } else {
          setSportsData(response_users.results);
        }

      }
      setLoader(false);
    }
    setLoading(false);
  };
  const inPlayCount = async () => {
    const { status, data: response_users } = await apiGet(apiPath.inPlayCount);
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setInplayCountData(response_users.results);
        }
      }
    }
  };
  useEffect(() => {
    if (inPlayScore?.length > 0) {
      setSportsData((current) => {
        return current.map((res) => {
          let temp = inPlayScore.find((item) => item?.eventId == res?.eventId);
          return {
            ...res,
            score:
              temp?.eventId == res?.eventId
                ? temp?.score == 0
                  ? ""
                  : temp?.score
                : "",
            timeElapsed: temp?.eventId == res?.eventId ? temp?.timeElapsed : "",
          };
        });
      });
    }
  }, [inPlayScore, sports]);

  useEffect(() => {
    getTournamentData();
  }, [sports, loading]);

  useEffect(() => {
    inPlayCount();
  }, []);
  return (
    <>
      <a href="javascript:void(0)">
        <img
          src={
            process.env.REACT_APP_URL +
            "/assets/images/kv-jili-teenpatti-m.jpg"
          }
          style={{ width: "100%" }}
        />
      </a>
      <div className="mian-wrap">
        <div id="highlightLabel" className="highlight-fix">
          <a
            className="a-search"
            onClick={() => setSearchToogle(true)}
            href="javascript:void(0)"
          >
            Search
          </a>
          <div
            id="frame"
            className="wrap-highlight ps ps--theme_default ps--active-x"
            style={{ overflow: "auto" }}
          >
            <ul id="label" style={{ left: "0px" }}>
              {/* {!isEmpty(user) && (
                <li className="menu-casino">
                  <span className="tag-new">New</span>
                  <a
                    onClick={() => {
                      if (!isEmpty(user)) {
                        setCasinoModel(true);
                        setCasinoObj({
                          platForm: "",
                          gameType: "",
                          casinoType: "",
                        });
                      } else {
                        navigate("/login");
                      }
                    }}
                    href="javascript:void(0)"
                  >
                    <img
                      className="icon-casino"
                      src={
                        process.env.REACT_APP_URL +
                        "/assets/images/home/transparent.gif"
                      }
                    />
                    Casino
                  </a>
                </li>
              )} */}

              <li
                id="highlightTab4"
                className={sports == "cricket" ? "select" : ""}
              >
                <span id="tagLive" className="tag-live">
                  <strong></strong>
                  {inplayCountData?.cricketInplayCount}
                </span>
                <a
                  href="javascript:void(0)"
                  onClick={() => setSport("cricket")}
                >
                  <img
                    className="icon-cricket"
                    src={
                      process.env.REACT_APP_URL +
                      "/assets/images/home/transparent.gif"
                    }
                  />
                  Cricket
                </a>
              </li>

              <li
                id="highlightTab1"
                className={sports == "soccer" ? "select" : ""}
              >
                <span id="tagLive" className="tag-live">
                  <strong></strong> {inplayCountData?.soccerInplayCount}
                </span>
                <a href="javascript:void(0)" onClick={() => setSport("soccer")}>
                  <img
                    className="icon-soccer"
                    src={
                      process.env.REACT_APP_URL +
                      "/assets/images/home/transparent.gif"
                    }
                  />
                  Soccer
                </a>
              </li>

              <li
                id="highlightTab2"
                className={sports == "tennis" ? "select" : ""}
              >
                <span id="tagLive" className="tag-live">
                  <strong></strong> {inplayCountData?.tennisInplayCount}
                </span>
                <a href="javascript:void(0)" onClick={() => setSport("tennis")}>
                  <img
                    className="icon-tennis"
                    src={
                      process.env.REACT_APP_URL +
                      "/assets/images/home/transparent.gif"
                    }
                  />
                  Tennis
                </a>
              </li>
              {/* {!isEmpty(user) && (
                <li className="menu-casino">
                  <a
                    onClick={() => {
                      if (!isEmpty(user)) {
                        setCasinoModel(true);
                        setCasinoObj({
                          platForm: "",
                          gameType: "international",
                          casinoType: "livecasino",
                        });
                      } else {
                        navigate("/login");
                      }
                    }}
                    href="javascript:void(0)"
                  >
                    <img
                      className="icon-casino"
                      src={
                        process.env.REACT_APP_URL +
                        "/assets/images/home/transparent.gif"
                      }
                    />
                    International Casino
                  </a>
                </li>
              )} */}
              {/* <li id="highlightTab137">
                <span id="tagLive" className="tag-live">
                  <strong></strong>2
                </span>
                <a href="#">
                  <img
                    className="icon-esoccer"
                    src="assets/images/home/transparent.gif"
                  />
                  E-Soccer
                </a>
              </li> */}
              {/* <li>
                <a href="#">
                  <img
                    className="icon-mt5"
                    src="assets/images/home/transparent.gif"
                  />
                  Sky Trader
                </a>
              </li> */}

              {/* <li id="highlightTab7">
                <a href="#">
                  <img
                    className="icon-HR"
                    src="assets/images/home/transparent.gif"
                  />
                  Horse Racing
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="wrap-highlight_list">
          <h3>Highlights</h3>

          <ul id="highlightList" className="highlight-list">
            <li id="noDatali" style={{ display: "none" }}>
              There are no events to be displayed.
            </li>
            {sportsData &&
              sportsData?.map((item, index) => {
                let obj = moment.duration(
                  moment(item.eventDateTime).tz("America/New_York").diff(moment(new Date()))
                )._data;
                return (
                  <li
                    key={index}
                    id="highlightEvent_-10362833"
                    className={`inplay-on ${item?.status == "in_play"
                      ? "inplay-dot-true"
                      : "inplay-dot-false"
                      }`}
                  >
                    <Link
                      id="info"
                      state={item}
                      to={`/match-details/${item?.eventId}/${item?.marketId}`}
                    >
                      <dl> 
                        <dt>
                          {/* {item?.channel !== "false" && ( */}
                          <span
                            id="streamingIcon"
                            className="game-live"
                            style={{ display: "flex" }}
                          >
                            game-live
                          </span>
                          {/* )} */}
                          {/* <span
                            id="lowLiquidityTag"
                            className="game-low_liq"
                            style={{ display: "none" }}
                          >
                            Low Liquidity
                          </span> */}
                          <span
                            id="bookMakerIcon"
                            className={`game-bookmaker game-odds ${"in-play"}`}
                            style={{ display: "flex" }}
                          >
                            {<pre>in-play</pre>} Odds
                          </span>
                          {console.log('item?.gameType: ', item?.gameType)}
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
                          {/* {item?.bookmakerRunners &&
                            item?.bookmakerRunners?.length > 0 && (
                              <span
                                id="bookMakerIcon"
                                className={`game-bookmaker ${obj.days < 1 && "in-play"
                                  }`}
                                style={{ display: "flex" }}
                              >
                                {obj.days < 1 && <pre>in-play</pre>} BookMaker
                              </span>
                            )} */}
                          {/* {item?.fancyList > 0 && (
                            <span
                              id="fancyBetIcon"
                              className={`game-fancy ${obj.days < 1 && "in-play"
                                }`}
                              style={{ display: "flex" }}
                            >
                              {obj.days < 1 && <pre>in-play</pre>} Fancy
                            </span>
                          )} */}

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
                              {helpers.matchDateTime(item.eventDateTime, user?.user?.timeZone)}
                            </span>
                          )}
                          {
                            item?.gameType == 'soccer' && (item?.eventName.includes(" SRL T20 ") || item?.eventName.includes(" T10 ")) && (
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
                            item?.gameType == 'cricket' && (item?.eventName.includes(" SRL T20 ") || item?.eventName.includes(" T10 ")) && (
                              <span
                                id="sportsBookEIcon_4"
                                className="game-E"
                              // style={{ display: "none" }}
                              >
                                <i></i>Cricket
                              </span>
                            )}
                          {
                            item?.gameType == 'tennis' && (item?.eventName.includes(" SRL T20 ") || item?.eventName.includes(" T10 ")) && (
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
                          {" "}
                          {item?.score
                            ? `${item?.eventName.split("v")[0]} ${item?.score
                            } ${item?.eventName.split("v")[1]}`
                            : item?.eventName}
                        </dd>
                      </dl>
                    </Link>
                    {/* <a
                      id="multiMarketPin"
                      // className="pin-off"
                      onClick={() => {
                        if (!isEmpty(user)) {
                          handelAddMultiMarket(item?.eventId);
                          setLoading(true);
                        } else {
                          navigate("/login");
                        }
                      }}
                      className={item.multi_market > 0 ? "pin-on" : "pin-off"}
                      href="javascript:void(0)"
                    ></a> */}

                  </li>
                );
              })}
          </ul>
        </div>


      </div>

    </>
  );
}

export default Sports;