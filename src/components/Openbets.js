import { isEmpty } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import AuthProvider from "../context/AuthContext";
import BetSlipContext from "../context/BetSlipContext";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { FancyListing, SportsBookListing } from "./BetsListing";
import OpenBetsDetails from "./OpenBetsDetails";
import helper from "../Utils/helpers";
function Openbets() {
  let { setOpenBetsToogle, openBetsToogle, openBetSelection, setLoader, user } =
    useContext(AuthProvider);
  let {
    messaageBox,
    refreshCurrentBet,
    setRefreshCurrentBets,
    isBetPlaced,
    setIsBetPlaced,
    setMessageBox,
    umMachedBetPlace,
    setUnMatchedBetPlace,
  } = useContext(BetSlipContext);
  const [currentBets, setCurrentBets] = useState([]);
  const [filtered, setFiltered] = useState({});
  const [data, setData] = useState("");
  const [type, setType] = useState("");
  const [betinfo, setBetInfo] = useState(false);
  const [sortbyTime, setSortbyTime] = useState(false);
  const getCurrentBets = async () => {
    if (!isEmpty(user)) {
      const { status, data: response_users } = await apiGet(
        apiPath.mobileCurrentBets
      );
      if (status === 200) {
        if (response_users.success) {
          setCurrentBets(response_users.results);
          setRefreshCurrentBets(false);
        }
      }
    }
  };
  const sortTime = (check) => {
    setSortbyTime(check);
  };
  const handle = (item, type) => {
    setData(item);
    setType(type);
    let obj = currentBets?.find((res) => res?.eventName == item?.eventName);
    setFiltered(
      type == "BetFair"
        ? obj.betList
        : type == "Bookmaker"
          ? obj.bookmakerList
          : type == "Fancy"
            ? obj.sessionBetList
            : type == "SportsBook"
              ? obj.sportBookBetList
              : ""
    );
  };
  useEffect(() => {
    getCurrentBets();
  }, [messaageBox, refreshCurrentBet]);
  const clearBets = async (id) => {
    setLoader(true);
    const { status, data: response_users } = await apiGet(
      `${apiPath.clearBets}matchBetId=${id}`
    );
    if (status === 200) {
      if (response_users.success) {
        setLoader(false);
        setRefreshCurrentBets(true);
        setIsBetPlaced("clearBet");
        setMessageBox(true);
        // setOpenBetsToogle(true);
        setData("");
        setType("");
        setFiltered({});
        getCurrentBets();
      }
      setLoader(false);
    } else {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (umMachedBetPlace) {
      setData("");
      setType("");
      setFiltered({});
      setUnMatchedBetPlace(false);
    }
  }, [umMachedBetPlace]);
  return (
    <>
      <div
        id="openBetsLeftSide"
        className="overlay left-side"
        style={{
          display: openBetsToogle ? "block" : "none",
        }}
      >
        <div
          id="openBetSlide"
          className="side-wrap"
          style={{ display: "flex" }}
        >
          <div id="sideHead" className="side-head">
            <h3 className="a-open_bets">
              <img src={process.env.REACT_APP_URL + "/assets/images/home/transparent.gif"} alt={""} />
              Open Bets
            </h3>
            <a
              id="close"
              onClick={() => setOpenBetsToogle(false)}
              className="close"
              href="#"
            ></a>
          </div>

          <div id="sideContent" className="side-content">
            {/* <div
              id="openBetMsgBox"
              className="message-wrap success"
              style={{ display: "block" }}
            >
              <div className="message">
                <h4 id="header">Bet Matched</h4>
                <p id="info">
                  <span id="sideType" className="back">
                    Back
                  </span>
                  <strong id="selectionName">England</strong>{" "}
                  <strong id="stake">$1,000</strong> at odds{" "}
                  <strong id="odds">1.29</strong>
                </p>
              </div>
              <a id="close" className="close" href="#">
                Close
              </a>
            </div> */}
            {isEmpty(data) && (
              <ul
                id="eventMenuList"
                style={{ display: "block" }}
                className="menu-list"
              >
                {currentBets?.length > 0 &&
                  currentBets?.map((res) => {
                    return (
                      <>
                        {res?.betList?.length > 0 && (
                          <li
                            id="eventMenuTemplate"
                            className="inplay-off"
                            style={{ display: "block" }}
                          >
                            <a
                              onClick={() => handle(res, "BetFair")}
                              href="javascript:void(0)"
                            >
                              {res?.eventName} - BetFair
                            </a>
                          </li>
                        )}
                        {res?.bookmakerList?.length > 0 && (
                          <li
                            id="eventMenuTemplate"
                            className="inplay-off"
                            style={{ display: "block" }}
                          >
                            <a
                              onClick={() => handle(res, "Bookmaker")}
                              href="javascript:void(0)"
                            >
                              {res?.eventName}- Bookmaker
                            </a>
                          </li>
                        )}
                        {res?.sessionBetList?.length > 0 && (
                          <li
                            id="eventMenuTemplate"
                            className="inplay-off"
                            style={{ display: "block" }}
                          >
                            <a
                              onClick={() => handle(res, "Fancy")}
                              href="javascript:void(0)"
                            >
                              {res?.eventName} - Fancy
                            </a>
                          </li>
                        )}
                        {res?.sportBookBetList?.length > 0 && (
                          <li
                            id="eventMenuTemplate"
                            className="inplay-off"
                            style={{ display: "block" }}
                          >
                            <a
                              onClick={() => handle(res, "SportsBook")}
                              href="javascript:void(0)"
                            >
                              {res?.eventName} - SportsBook
                            </a>
                          </li>
                        )}
                      </>
                    );
                  })}
              </ul>
            )}
            {!isEmpty(data) && (
              <div
                id="pathWrap"
                className="path-wrap"
                style={{ display: "flex" }}
              >
                <a
                  id="goBack"
                  className="go_back"
                  onClick={() => {
                    setData("");
                    setSortbyTime(false);
                    setType("");
                    setBetInfo(false);
                  }}
                  href="javascript:void(0)"
                ></a>
                <ul>
                  <li id="eventName">
                    <p>
                      {" "}
                      {data?.eventName} - {type}
                    </p>
                  </li>
                </ul>
              </div>
            )}

            {!isEmpty(data) && (
              <>
                {type == "Fancy" ? (
                  <FancyListing
                    filtered={filtered}
                    sortbyTime={sortbyTime}
                    sortTime={sortTime}
                    betinfo={betinfo}
                    setBetInfo={setBetInfo}
                    type={"Matched"}
                    helper={helper}
                  />
                ) : type == "SportsBook" ? (
                  <SportsBookListing
                    filtered={filtered}
                    sortbyTime={sortbyTime}
                    sortTime={sortTime}
                    betinfo={betinfo}
                    setBetInfo={setBetInfo}
                    type={"Matched"}
                    helper={helper}
                  />
                ) : (
                  <OpenBetsDetails
                    filtered={filtered}
                    sortbyTime={sortbyTime}
                    sortTime={sortTime}
                    betType={type}
                    betinfo={betinfo}
                    setBetInfo={setBetInfo}
                    type={"Matched"}
                  />
                )}

                {filtered?.some((res) => !res?.isMatched) &&
                  type == "BetFair" && (
                    <OpenBetsDetails
                      filtered={filtered}
                      sortbyTime={sortbyTime}
                      betinfo={betinfo}
                      betType={type}
                      setBetInfo={setBetInfo}
                      sortTime={sortTime}
                      type={"UnMatched"}
                      clearBets={clearBets}
                    />
                  )}
              </>
            )}
            {type !== "" && !isEmpty(filtered) && (
              <ul
                id="openBetOption"
                className="check-list"
                style={{ display: "flex" }}
              >
                <li>
                  <a
                    id="showBetInfo"
                    onClick={() => setBetInfo(!betinfo)}
                    className={betinfo ? "checked" : ""}
                    href="javascript:void(0)"
                  >
                    Bet Info
                  </a>
                </li>
                {filtered?.length > 1 && type !== "SportsBook" && (
                  <li>
                    <a
                      id="showTimeOrder"
                      onClick={() => sortTime(!sortbyTime)}
                      className={sortbyTime ? "checked" : ""}
                      href="javascript:void(0)"
                    >
                      Time Order
                    </a>
                  </li>
                )}
                {/* <li name="txnOption">
          <a id="averageOdds" className="" href="javascript:void(0)">
            Average Odds
          </a>
        </li> */}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Openbets;
