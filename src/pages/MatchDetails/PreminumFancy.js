import { isEmpty } from "lodash";
import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import BetSlipContext from "../../context/BetSlipContext";
import Keyboard from "./Keyboard";

const PreminumFancy = ({
  preminumFancyTab,
  setSelectedTabFuncPreminum,
  data,
  betType,
  setSlipObj,
  slipObj,
  details,
  profileData,
  user,
}) => {
  const [selected, setSelected] = useState(data ? data[0]?.id : "");
  let { betSelectionObj, setBetSelectionObj } = useContext(BetSlipContext);
  const [amountRange, setAmountRange] = useState({
    min: 1,
    max: 100,
  });
  useEffect(() => {
    if (!isEmpty(user)) {
      let obj = profileData.matchSetting.find(
        (res) => res?.type == "sportBook" && res?.sportType == details?.gameType
      );
      if (!isEmpty(obj)) {
        setAmountRange({
          min: obj?.minAmount,
          max: obj?.maxAmount,
        });
      }
    }
  }, []);

  const myRef = useRef(null);
  const [id, setId] = useState("");
  const [id2, setId2] = useState("");
  const handleScroll = () => {
    setId("");
    setId2("");
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(id)) {
      myRef.current.scrollIntoView(true);
    }
  }, [id]);
  return data?.length > 0 ? (
    <div
      id="fancyBetTabWrap"
      className="special_bets-tab-wrap ps ps--theme_default ps--active-x"
    >
      <ul className="special_bets-tab" style={{ overflowX: "scroll" }}>
        {preminumFancyTab?.length > 0 &&
          preminumFancyTab?.map((res) => {
            return (
              <li
              // onClick={() => setSelectedTabFunc(res.type)}
              // className={selectedTab == res.type ? "select" : ""}
              >
                <a href="javascript:void(0)">{res.name}</a>
              </li>
            );
          })}
      </ul>
      {data?.length > 0 &&
        data?.map((item, index) => {
          return (
            <div
              id="sportsBookMarket_2_2558118_265869284"
              className="bets-wrap sports-book"
            >
              <h4 onClick={() => setSelected(item.id)}>
                <a
                  id="multiMarketPin"
                  className="pin-off"
                  title="Add to Multi Markets"
                ></a>
                <span id="marketName" className="to-collapse">
                  {item.marketName}
                </span>
                <div className="fancy_info-popup">
                  <dl>
                    <dt>Min / Max</dt>
                    <dd>100.00 / 10000.00</dd>
                  </dl>
                  <a className="close">Close</a>
                </div>
              </h4>

              {/* <dl
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
                  <p>Suspend</p>
                </dd>
                <dd>
                  <a id="back_1" className="back-1" href="#">
                    <span></span>
                  </a>
                </dd>
                <dd className="mode-land"></dd>
              </dl> */}
              {item?.id == selected &&
                item?.sportsBookSelection?.map((res) => {
                  // console.log(index == id, "res");
                  return (
                    <>
                      <dl
                        className="bets-selections"
                        style={{ display: "flex" }}
                        // ref={index == id ? myRef : null}
                      >
                        <dt className="">
                          <h4 id="selectionName">{res.selectionName}</h4>
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
                          isactive="1"
                          status="1"
                        >
                          <p>Suspend</p>
                        </dd>
                        <dd>
                          <a
                            id="back_1"
                            className={
                              slipObj.selectId == res.id
                                ? "back-1 select"
                                : "back-1"
                            }
                            href="javascript:void(0)"
                            onClick={() => {
                              // setId(index);
                              // setId2(res.id);
                              setBetSelectionObj({
                                ...betSelectionObj,
                                betType: betType,
                                oddsSelect: res.odds,
                                layorback:"back",
                                priceToogle: true,
                                minAmount: amountRange.min,
                                maxAmount: amountRange.max,
                              });
                              setSlipObj({
                                ...item,
                                selectId: res.id,
                                obj: res,
                              });
                            }}
                          >
                            <span>{res.odds}</span>
                          </a>
                        </dd>
                        <dd className="mode-land"></dd>
                      </dl>
                      {betSelectionObj?.priceToogle &&
                        betSelectionObj?.betType == "premiumFancy" &&
                        slipObj.id == item.id &&
                        res.id == slipObj.selectId && (
                          <Keyboard
                            setSlipObj={setSlipObj}
                            details={details}
                            slipObj={slipObj}
                            amountRange={amountRange}
                          />
                        )}
                    </>
                  );
                })}

              {/* <dl
                id="sportsBookSelection_2_2558118_265869284_1899492320"
                className="bets-selections"
                style={{ display: "flex" }}
                eventid="2558118"
                marketpk="2_2558118_265869284"
                isactive="1"
                status="1"
              >
                <dt className="">
                  <h4 id="selectionName">under 238.5</h4>
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
                  isactive="1"
                  status="1"
                >
                  <p>Suspend</p>
                </dd>
                <dd>
                  <a id="back_1" className="back-1" href="#">
                    <span>1.85</span>
                  </a>
                </dd>
                <dd className="mode-land"></dd>
              </dl> */}
            </div>
          );
        })}

      {/* <div
        id="sportsBookNoBet"
        className="bets-wrap"
        style={{ display: "none" }}
      >
        <p className="no-game">Sports Book has no market</p>
      </div> */}

      {/* <div
        id="sportsBookMarketTemplate"
        className="bets-wrap sports-book"
        style={{ display: "none" }}
      >
        <h4>
          <a
            id="multiMarketPin"
            className="pin-off"
            title="Add to Multi Markets"
          ></a>
          <span id="marketName" className="to-collapse">
            Total sixes
          </span>
          <div className="fancy_info-popup">
            <dl>
              <dt>Min / Max</dt>
              <dd>100.00 / 10000.00</dd>
            </dl>
            <a className="close">Close</a>
          </div>
        </h4>

        <dl
          id="sportsBookSelectionTemplate"
          className="bets-selections"
          style={{ display: "none" }}
        >
          <dt className="">
            <h4 id="selectionName"></h4>
            <ul>
              <li id="before" className="win" style={{ display: "none" }}></li>
              <li
                id="after"
                className="to-lose"
                style={{ display: "none" }}
              ></li>
            </ul>
          </dt>
          <dd id="suspend" className="suspend" style={{ display: "none" }}>
            <p>Suspend</p>
          </dd>
          <dd>
            <a id="back_1" className="back-1" href="#">
              <span></span>
            </a>
          </dd>
          <dd className="mode-land"></dd>
        </dl>
      </div> */}
    </div>
  ) : (
    <div id="sportsBookNoBet" class="bets-wrap" style={{ display: "block" }}>
      <p class="no-game">Sports Book has no market</p>
    </div>
  );
};

export default PreminumFancy;
