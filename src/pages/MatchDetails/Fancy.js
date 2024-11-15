import { isEmpty } from "lodash";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useContext } from "react";
import BetSlipContext from "../../context/BetSlipContext";
import Keyboard from "./Keyboard";

const Fancy = ({
  betType,
  data,
  details,
  slipObj,
  setSlipObj,
  fancyCategory,
  setSelectedTabFunc,
  selectedTab,
  profileData,
  user,
  resetSelection,
  isTv,
  setIsTv,
  key,
  messaageBox,
  loader,
  fancyList
}) => {
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

  const [amountRange, setAmountRange] = useState({
    min: 1,
    max: 100,
    oddsLimit: 0,
  });

  useEffect(() => {
    if (!isEmpty(user)) {
      let obj = profileData?.matchSetting?.find(
        (res) =>
          res?.type == betType &&
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
  }, [data]);
  const [popupMessage, setPopupMessage] = useState({
    check: false,
    id: "",
  });

  let {
    betSelectionObj,
    setBetSelectionObj,
    setBetFairObj,
    defaultStake,
    defaultOdds,
    setBookPosition,
    setBookPositionData,
  } = useContext(BetSlipContext);
  useEffect(() => {
    if (
      betSelectionObj?.betType == "fancy" &&
      id &&
      isEmpty(data?.find((res) => res?.selectionId == id)?.odds)
    ) {
      setBetSelectionObj({});
      setBetFairObj({});
      setPopupMessage({ check: false, id: "" });
    }
  }, [betSelectionObj, data]);
  return fancyList?.length > 0 ? (
    <>
      <div
        id="fancyBetTabWrap"
        className="fancy_bet_tab-wrap ps ps--theme_default ps--active-x"
      >
        <ul className="special_bets-tab" style={{ overflowX: "scroll" }}>
          {fancyCategory?.length > 0 &&
            fancyCategory?.map((res) => {
              return (
                <li
                  onClick={() => { localStorage.setItem("catType", res?.type); setSelectedTabFunc(res.type) }}
                  className={selectedTab == res.type ? "select" : ""}
                >
                  <a href="javascript:void(0)">{res.name}</a>
                </li>
              );
            })}
        </ul>
      </div>
      <div id="fancyBetTag">
        <div className="bets-wrap fancy-bet" style={{ display: "none" }}>
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
            <dd id="suspend" className="suspend" style={{ display: "flex" }}>
              <p id="info">Closed</p>
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
                71<span>250</span>
              </a>
            </dd>
            <dd id="back_1">
              <a className="back-1" href="#">
                71<span>150</span>
              </a>
            </dd>
            <dd className="mode-land"></dd>
            <dd className="mode-land"></dd>
          </dl>
        </div>
        {data?.length > 0 && (
          <dl class="bets-selections-head" style={{ background: "#fff" }}>
            <dt></dt>
            <dd class="mode-land"></dd>
            <dd class="mode-land"></dd>
            <dd style={{ color: "black" }}>No</dd>
            <dd style={{ color: "black" }}>Yes</dd>
            <dd class="mode-land"></dd>
            <dd class="mode-land"></dd>
          </dl>
        )}
        {data?.length > 0 &&
          data?.map((item, index) => {
            // console.log("item?.odds", item);
            // if (
            //   item.odds?.ms == "9" ||
            //   item.odds?.ms == "1" ||
            //   item.odds?.ms == "2"
            // ) {
            if (
              item?.odds?.ms == 4 ||
              item?.odds?.rt?.length == 0 ||
              item?.odds?.ms == 2 ||
              isEmpty(item?.odds?.rt)
            ) {
              return null;
            } else {
              // console.log(item,"item")
              return (
                <div
                  ref={item.selectionId == id && index == id2 ? myRef : null}
                  className={`bets-wrap fancy-bet ${details.fancy == "off" ? "disabled" : ""
                    }`}
                >
                  <h5>
                    <span id="marketName">{item.fancyName}</span>
                    <a
                      href="javascript:void(0)"
                      onClick={() =>
                        setPopupMessage({
                          check: true,
                          id: item.selectionId,
                        })
                      }
                      id="open-fancy_info"
                      className="btn-fancy_info"
                    >
                      fancybet info
                    </a>
                    {popupMessage.check &&
                      item.selectionId == popupMessage.id && (
                        <div
                          id="fancy_popup2"
                          style={{
                            display: "flex",
                            zIndex: 10,
                          }}
                          className="fancy_info-popup"
                        >
                          <dl>
                            <dt>Min / Max</dt>
                            <dd id="minMax">
                              {" "}
                              {amountRange?.min?.toFixed(2)} /{" "}
                              {amountRange?.max?.toFixed(2)}
                            </dd>
                          </dl>
                          <dl>
                            <dt id="rebateName" style={{ display: "none" }}>
                              Rebate
                            </dt>
                            <dd id="rebate" style={{ display: "none" }}></dd>
                          </dl>
                          <a
                            href="javascript:void(0)"
                            onClick={() =>
                              setPopupMessage({
                                check: false,
                                id: "",
                              })
                            }
                            id="close-fancy_info"
                            className="close"
                          >
                            Close
                          </a>
                        </div>
                      )}
                  </h5>
                  <dl className="bets-selections">
                    <dt class="line_market-selection">
                      <dl class="tips">
                        <dt>
                          {(item?.position != "" || item?.position === 0) && !isNaN(Math.abs(item?.position)) && (
                            <span
                              id="before"
                              style={{ marginRight: "5px" }}
                              class="lose"
                            >
                              ({Math.abs(item?.position)})
                            </span>
                          )}

                          {!isEmpty(item?.newPosition) &&
                            !isNaN(Math.abs(item.newPosition)) &&
                            betSelectionObj?.priceToogle &&
                            betSelectionObj?.betType == "fancy" &&
                            slipObj.ri == item.selectionId && (
                              <span
                                id="after"
                                class="to-lose"
                                style={{ display: "block" }}
                              >
                                ({Math.abs(item?.newPosition)})
                              </span>
                            )}
                        </dt>
                      </dl>
                      {/* )} */}
                      {/* {(item?.position != "" || item?.position === 0) && !isNaN(Math.abs(item?.position)) && (
                        <a
                          id="fancyBetBookBtn"
                          href="javascript:void(0)"
                          className="btn-book"
                          onClick={() => {
                            setBookPosition(true);
                            // setIsTv({ ...isTv, status: false });
                            setBookPositionData(item);
                          }}
                        >
                          Book
                        </a>
                      )} */}
                    </dt>

                    {item?.odds?.ms == 1 ? (
                      ""
                    ) : (
                      <dd
                        id="suspend"
                        className="suspend-fancy"
                        style={{ display: "flex" }}
                      >
                        <p id="info">
                          {item?.odds?.ms == 9
                            ? "Ball Running"
                            : item?.odds?.ms == 2
                              ? "In Active"
                              : item?.odds?.ms == 3
                                ? "Suspended"
                                : item?.odds?.ms == 4
                                  ? "Closed"
                                  : ""}
                        </p>
                      </dd>
                    )}
                    {loader &&
                      betSelectionObj?.betType == "fancy" &&
                      slipObj.ri == item.selectionId ? (
                      <dd id="delayBetting" class="suspend-fancy">
                        <p id="info"></p>
                      </dd>
                    ) : (
                      ""
                    )}
                    <dd
                      id="lay_1"
                      onClick={() => {
                        if (
                          !item?.odds?.rt[0]?.rt ||
                          details.fancy == "off" ||
                          details?.sport_setting?.status == "inActive" ||
                          item?.odds?.rt[0]?.rt > amountRange?.oddsLimit
                        ) {
                        } else {
                          if (!messaageBox) {
                            if (betSelectionObj.betType !== betType) {
                              resetSelection(betSelectionObj.betType);
                            }
                            setId(item.selectionId);
                            setId2(index);
                            setBetSelectionObj({
                              ...betSelectionObj,
                              betType: betType,
                              oddsSelect: item?.odds?.rt[0]?.rt,
                              fancyOddSelect: item?.odds?.rt[0]?.pt,
                              layorback: "lay",
                              inputType: "price",
                              expectany: defaultOdds,
                              bidPrice: defaultStake == 0 ? "" : defaultStake,
                              priceToogle: true,
                              priceToogleType: "odds",
                              minAmount: amountRange.min,
                              maxAmount: amountRange.max,
                            });

                            setSlipObj({
                              ...item,
                              ...item?.odds?.rt[0],
                              rt: item?.odds?.rt[0]?.rt,
                              pt: item?.odds?.rt[0]?.pt,
                              runnerName: item?.fancyName,
                            });
                          }
                        }
                      }}
                      style={
                        !item?.odds?.rt[0]?.rt || details?.fancy == "off"
                          ? { cursor: "not-allowed" }
                          : { cursor: "pointer" }
                      }
                      className={
                        !item?.odds?.rt[0]?.rt ||
                          details?.fancy == "off" ||
                          details?.sport_setting?.status == "inActive"
                          ? "single-disabled"
                          : item?.odds?.rt[0]?.rt > amountRange?.oddsLimit
                          ? "single-disabled"
                          : ""
                      }
                    >
                      <a
                        className={
                          item?.odds?.rt[0]?.rt == slipObj?.rt &&
                            item?.odds?.rt[0]?.pt == slipObj?.pt &&
                            slipObj.ri == item.selectionId &&
                            betSelectionObj?.priceToogle
                            ? `lay-1 select ${Number(
                              document.getElementById("odds1")?.name
                            ) !== item?.odds?.rt[0]?.rt && "spark"
                            }`
                            : `lay-1 ${Number(
                              document.getElementById("odds1")?.name
                            ) !== item?.odds?.rt[0]?.rt && "spark"
                            }`
                        }
                        id={"odds1"}
                        name={item?.odds?.rt[0]?.rt}
                        href="javascript:void(0)"
                      >
                        {item?.odds?.rt?.length > 0
                          ? item?.odds?.rt[0]?.rt
                          : !isEmpty(item?.odds?.temp) &&
                          item?.odds?.temp[0]?.rt}
                        {/* {vart1} */}
                        <span>
                          {item?.odds?.rt?.length > 0
                            ? item?.odds?.rt[0]?.pt
                            : !isEmpty(item?.odds?.temp) &&
                            item?.odds?.temp[0]?.pt}
                        </span>
                      </a>
                    </dd>
                    <dd
                      id="back"
                      onClick={() => {
                        if (
                          !item?.odds?.rt[1]?.rt ||
                          details?.fancy == "off" ||
                          details?.sport_setting?.status == "inActive" ||
                          item?.odds?.rt[1]?.rt > amountRange?.oddsLimit
                        ) {
                        } else {
                          if (!messaageBox) {
                            if (betSelectionObj.betType !== betType) {
                              resetSelection(betSelectionObj.betType);
                            }
                            setId(item.selectionId);
                            setId2(index);
                            setBetSelectionObj({
                              ...betSelectionObj,
                              betType: betType,
                              oddsSelect: item?.odds?.rt[1]?.rt,
                              layorback: "back",
                              inputType: "price",
                              bidPrice: defaultStake == 0 ? "" : defaultStake,
                              fancyOddSelect: item?.odds?.rt[1]?.pt,
                              priceToogle: true,
                              priceToogleType: "odds",
                              minAmount: amountRange.min,
                              expectany: defaultOdds,
                              maxAmount: amountRange.max,
                            });
                            setSlipObj({
                              ...item,
                              ...item?.odds?.rt[1],
                              rt: item?.odds?.rt[1]?.rt,
                              pt: item?.odds?.rt[1]?.pt,
                              runnerName: item?.fancyName,
                            });
                          }
                        }
                      }}
                      style={
                        !item?.odds?.rt[1]?.rt ||
                          details?.fancy == "off" ||
                          details?.sport_setting?.status == "inActive"
                          ? { cursor: "not-allowed" }
                          : { cursor: "pointer" }
                      }
                      className={
                        !item?.odds?.rt[1]?.rt ||
                          details?.fancy == "off" ||
                          details?.sport_setting?.status == "inActive"
                          ? "single-disabled"
                          : item?.odds?.rt[1]?.rt > amountRange?.oddsLimit
                          ? "single-disabled"
                          : ""
                      }
                    >
                      <a
                        className={
                          item?.odds?.rt[1]?.rt == slipObj?.rt &&
                            item?.odds?.rt[1]?.pt == slipObj?.pt &&
                            slipObj.ri == item.selectionId &&
                            betSelectionObj?.layorback == "back" &&
                            betSelectionObj?.priceToogle
                            ? `back-1 select ${Number(
                              document.getElementById("odds2")?.name
                            ) !== item?.odds?.rt[1]?.rt && "spark"
                            }`
                            : `back-1 ${Number(
                              document.getElementById("odds2")?.name
                            ) !== item?.odds?.rt[1]?.rt && "spark"
                            }`
                        }
                        id={"odds2"}
                        name={item?.odds?.rt[1]?.rt}
                        href="javascript:void(0)"
                      >
                        {item?.odds?.rt?.length > 0
                          ? item?.odds?.rt[1]?.rt
                          : !isEmpty(item?.odds?.temp) &&
                          item?.odds?.temp[1]?.rt}
                        <span>
                          {item?.odds?.rt?.length > 0
                            ? item?.odds?.rt[1]?.pt
                            : !isEmpty(item?.odds?.temp) &&
                            item?.odds?.temp[1]?.pt}
                        </span>
                      </a>
                    </dd>
                  </dl>
                  {betSelectionObj?.priceToogle &&
                    betSelectionObj?.betType == "fancy" &&
                    slipObj.ri == item.selectionId && (
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
            }
          })}
        {isEmpty(data) && (
          <div id="noGameWrap" class="bets-wrap">
            <p class="no-game">No Fancy Found</p>
          </div>
        )}
      </div>
    </>
  ) : (
    <div id="noGameWrap" class="bets-wrap">
      <p class="no-game">No Fancy Found</p>
    </div>
  );
};

export default Fancy;
