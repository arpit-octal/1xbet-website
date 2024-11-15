import { isEmpty } from "lodash";
import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import BetSlipContext from "../../context/BetSlipContext";
import Keyboard from "./Keyboard";

const PreminumFancyNew = ({
  preminumFancyTab,
  setSelectedTabFuncPreminum,
  data,
  betType,
  setSlipObj,
  slipObj,
  details,
  profileData,
  user,
  resetSelection,
  key,
  messaageBox,
}) => {
  const [selected, setSelected] = useState(data ? data[0]?.id : "");
  let { betSelectionObj, setBetSelectionObj, defaultStake, defaultOdds } =
    useContext(BetSlipContext);
  const [amountRange, setAmountRange] = useState({
    min: 1,
    max: 100,
    oddsLimit: 0,
  });
  useEffect(() => {
    if (!isEmpty(user)) {
      let obj = profileData?.matchSetting?.find(
        (res) =>
          res?.type == "sportBook" &&
          (profileData?.arrayCheck == "details"
            ? true
            : res?.sportType == details?.gameType)
      );
      if (!isEmpty(obj)) {
        setAmountRange({
          ...obj,
          min: Number(obj?.minAmount),
          max: Number(obj?.maxAmount),
          oddsLimit: obj.oddsLimit ? obj.oddsLimit : 0,
        });
      }
    }
  }, [details]);

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
  const [innerId, setInnerId] = useState("");
  useEffect(() => {
    if (key == "Fancy Bet") {
      setInnerId("");
      setSelected("");
    }
  }, [key]);
  // console.log(data, "data");
  return data?.length > 0 ? (
    <>
      {/* <div
        id="fancyBetTabWrap"
        className="special_bets-tab-wrap ps ps--theme_default ps--active-x"
      >
        <ul className="special_bets-tab" style={{ overflowX: "scroll" }}>
          {preminumFancyTab?.length > 0 &&
            preminumFancyTab?.map((res) => {
              return (
                <li>
                  <a href="javascript:void(0)">{res.name}</a>
                </li>
              );
            })}
        </ul>
      </div> */}

      {data?.length > 0 &&
        data?.map((item, index) => {
          // if (item.marketStatus == 1 || item.marketStatus == 0) {
          return (
            <div
              id="sportsBookMarket_2_2558118_265869284"
              className="bets-wrap sports-book new-premimum-fancy"
            >
              <h4
                ref={item?.marketId == id ? myRef : null}
                onClick={() =>
                  setSelected(selected == item?.marketId ? "" : item?.marketId)
                }
              >
                <a
                  id="multiMarketPin"
                  className="pin-off"
                  title="Add to Multi Markets"
                ></a>
                <span id="marketName" className="to-collapse">
                  {item?.fancyName}
                </span>
                <div className="fancy_info-popup">
                  <dl>
                    <dt>Min / Max</dt>
                    <dd>100.00 / 10000.00</dd>
                  </dl>
                  <a className="close">Close</a>
                </div>
                {item?.marketId !== selected ? (
                  <span className="up-down-arrow">
                    <img
                      src={
                        process.env.REACT_APP_URL +
                        "/assets/images/down-arrow.png"
                      }
                      alt=""
                    />
                  </span>
                ) : (
                  <span className="up-down-arrow">
                    <img
                      style={{ transform: "rotate(180deg)" }}
                      src={
                        process.env.REACT_APP_URL +
                        "/assets/images/down-arrow.png"
                      }
                      alt=""
                    />
                  </span>
                )}
              </h4>
              <div className="text-dark daka-score-sec ">
                {item?.marketId == selected &&
                  item?.runners?.map((res) => {
                    // console.log(item,"ress")
                    return (
                      <>
                        <div
                          className={
                            slipObj.selectId == res.runnerId
                              ? `back-active ${Number(
                                document.getElementById("odds1")?.name
                              ) !== res?.backPrices[0]?.price &&
                              "fade-in-out"
                              }`
                              : `rounded-b-md ${Number(
                                document.getElementById("odds1")?.name
                              ) !== res?.backPrices[0]?.price &&
                              "fade-in-out"
                              }`
                          }
                          onClick={() => {
                            if (details?.sport_setting?.status == "active") {
                              if (details.premiumFancy == "on") {
                                if (!messaageBox) {
                                  if (betSelectionObj.betType !== betType) {
                                    resetSelection(betSelectionObj.betType);
                                  }
                                  setBetSelectionObj((prev) => ({
                                    ...betSelectionObj,
                                    betType: betType,
                                    oddsSelect: res?.backPrices[0]?.price,
                                    bidPrice: defaultStake,
                                    priceToogle: true,
                                    layorback: "back",
                                    inputType: "price",
                                    expectany: defaultOdds,
                                    minAmount: amountRange.min,
                                    maxAmount: amountRange.max,
                                  }));
                                  setId(item.marketId);
                                  setInnerId(res.runnerId);
                                  setSlipObj({
                                    ...item,
                                    selectId: res.runnerId,
                                    newSelectId: item.marketId,
                                    obj: res,
                                    eventId: details.eventId,
                                  });
                                }
                              }
                            }
                          }}
                        >
                          {/* {details.premiumFancy == "off" ||
                            details?.sport_setting?.status == "inActive" || item.marketStatus == 2 ? (
                              <div className="suspend-case">
                                <strong>Suspend</strong>
                              </div>
                            ) : (
                              ""
                            )} */}
                          {details?.premiumFancy == "off" ||
                            details?.sport_setting?.status == "inActive" ? (
                            <div className="suspend-case">
                              <strong>{item?.status}</strong>
                            </div>
                          ) : item?.status == "Active" ? (
                            ""
                          ) : (
                            <div className="suspend-case">
                              <strong>{item?.status}</strong>
                            </div>
                          )}
                          <h5>{res.runnerName}</h5>
                          <p id={"odds1"} name={res?.backPrices[0]?.price}>
                            {res?.backPrices[0]?.price}
                          </p>
                          {Math.abs(res.position) != 0 &&
                            !isNaN(Math.abs(res.position)) && (
                              <div className="dolor_tag">
                                <span className="right-arrow">
                                  <img
                                    src={
                                      process.env.REACT_APP_URL +
                                      "/assets/images/down-arrow.png"
                                    }
                                    alt=""
                                  />
                                </span>
                                ${Math.abs(res?.position)?.toFixed(2)}
                              </div>
                            )}
                          {!isNaN(Math.abs(res.newPosition)) &&
                            betSelectionObj?.priceToogle &&
                            betSelectionObj?.betType == betType && (
                              <div
                                className="dolor_tag"
                                style={{ marginLeft: "5px" }}
                              >
                                <span className="right-arrow">
                                  <img
                                    src={
                                      process.env.REACT_APP_URL +
                                      "/assets/images/down-arrow.png"
                                    }
                                    alt=""
                                  />
                                </span>
                                ${Math.abs(res?.newPosition)?.toFixed(2)}
                              </div>
                            )}
                        </div>
                      </>
                    );
                  })}
              </div>
              {betSelectionObj?.priceToogle &&
                betSelectionObj?.betType == "premiumFancy" &&
                innerId == slipObj?.selectId &&
                item?.marketId == selected && (
                  <Keyboard
                    setSlipObj={setSlipObj}
                    details={details}
                    slipObj={slipObj}
                    amountRange={amountRange}
                    betType={betType}
                    resetSelection={resetSelection}
                  />
                )}
            </div>
          );
          // }
        })}
    </>
  ) : (
    <div id="sportsBookNoBet" class="bets-wrap" style={{ display: "block" }}>
      <p class="no-game">Sports Book has no market</p>
    </div>
  );
};

export default PreminumFancyNew;