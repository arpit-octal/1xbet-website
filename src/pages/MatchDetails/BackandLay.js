import { isEmpty } from "lodash";
import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import BetSlipContext from "../../context/BetSlipContext";


const BackandLay = ({
  back,
  lay,
  item,
  details,
  setSelectedBet,
  setKey,
  setSlipObj,
  slipObj,
  handelBetFairPositions,
  handelBookmakerPositions,
  setCondi,
  betType,
  betmode,
  amountRange,
  index,
  market,
  resetSelection,
  messaageBox,
}) => {
  let { betSelectionObj, setBetSelectionObj, defaultStake, defaultOdds } = useContext(BetSlipContext);
  const myRef = useRef(null);
  const [id, setId] = useState({
    index: "",
    id: "",
    type: "",
  });
  const handleScroll = () => {
    setId({
      index: "",
      id: "",
      type: "",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handle = () => {
    myRef?.current?.scrollIntoView();
  };
  useEffect(() => {
    handle();
  }, [id]);

  const backOdd = () => {
    if (betType === "bookamer") {
      if (back[0]?.ms == 1) {
        return back[0]?.rt;
      } else {
        return null;
      }
    } else {
      return back[0]?.rt;
    }
  };
  const backOddSpan = () => {
    if (betType === "bookamer") {
      if (back[0]?.ms == 1) {
        return back[0]?.bv;
      } else {
        return null;
      }
    } else {
      return back[0]?.bv;
    }
  };

  const layOdd = () => {
    if (betType === "bookamer") {
      if (lay[0]?.ms == 1) {
        return lay[0]?.rt;
      } else {
        return null;
      }
    } else {
      return lay[0]?.rt;
    }
  };
  const layOddSpan = () => {
    if (betType === "bookamer") {
      if (lay[0]?.ms == 1) {
        return lay[0]?.bv;
      } else {
        return null;
      }
    } else {
      return lay[0]?.bv;
    }
  };
  return (
    <>
      <dd
        id="back_1"
        onClick={() => {
          if (betType === 'bookmaker' && Number(back[0]?.ms) !== 1) {

          } else {
            if (market == "" && details?.status == "in_play") {
              if (
                back?.length === 0 ||
                betmode == "off" ||
                details?.sport_setting?.status == "inActive"
              ) {
              } else {
                if (
                  Number(back[0]?.rt) == undefined ||
                  Number(back[0]?.rt) > amountRange?.oddsLimit
                ) {
                } else {
                  if (amountRange?.oddsLimit !== 0) {
                    if (!messaageBox) {
                      if (betSelectionObj.betType !== betType) {
                        resetSelection(betSelectionObj.betType);
                      }
                      setKey(item?.SelectionId);
                      setId({
                        index: index,
                        id: item?.SelectionId,
                        type: betType,
                      });
                      setBetSelectionObj({
                        ...betSelectionObj,
                        betType: betType,
                        oddsSelect: back[0]?.rt,
                        layorback: "back",
                        bidPrice: defaultStake == 0 ? "" : defaultStake,
                        inputType: "price",
                        priceToogle: true,
                        priceToogleType: "odds",
                        expectany: defaultOdds,
                        gameType: details?.gameType,
                        minAmount: amountRange?.min,
                        maxAmount: amountRange?.max,
                      });
                      if (
                        betType == "betFair" &&
                        slipObj?.SelectionId == item?.SelectionId &&
                        betSelectionObj?.layorback == "back"
                      ) {
                        handelBetFairPositions({
                          ...item,
                          ...back[0],
                          teamName: item?.RunnerName,
                          ...details,
                        });
                      } else if (
                        betType == "bookmaker" &&
                        slipObj?.SelectionId == item?.SelectionId &&
                        betSelectionObj?.layorback == "back"
                      ) {
                        handelBookmakerPositions({
                          ...item,
                          ...back[0],
                          teamName: item?.RunnerName,
                          ...details,
                        });
                      }
                      setSlipObj({
                        ...item,
                        ...back[0],
                        teamName: item?.RunnerName,
                        ...details,
                      });
                      setSelectedBet({
                        selectionId: item?.SelectionId,
                        teamName: item?.RunnerName,
                        check: "back",
                      });
                    }
                  }
                }
              }
            }
          }
        }}
        style={
          back?.length === 0 ||
            betmode == "off" ||
            details?.sport_setting?.status == "inActive"
            ? { cursor: "not-allowed" }
            : { cursor: "pointer" }
        }
        className={
          back[0]?.rt == undefined ||
            details?.sport_setting?.status == "inActive"
            ? "single-disabled"
            : back[0]?.rt > amountRange?.oddsLimit
              ? "single-disabled"
              : ""
        }
      >
        <a
          ref={
            index == id.index &&
              betType == id.type &&
              (betType == "bookmaker" ? item?.selectionID : item?.SelectionId) ==
              id.id
              ? myRef
              : null
          }
          name={back[0]?.bv}
          title={back[0]?.rt}
          id={"back_odds_" + index}
          className={
            slipObj?.teamName ==
              (betType == "betFair" ? item?.RunnerName : item?.runnerName) &&
              betSelectionObj?.layorback == "back" &&
              betSelectionObj.betType == betType &&
              betSelectionObj?.priceToogle
              ? `back-1 select ${Number(
                document.getElementById("back_odds_" + index)?.name
              ) !== back[0]?.bv && "spark"
              } ${Number(
                document.getElementById("back_odds_" + index)?.title
              ) !== back[0]?.rt && "spark"
              }`
              : `back-1 ${Number(
                document.getElementById("back_odds_" + index)?.name
              ) !== back[0]?.bv && "spark"
              } ${Number(
                document.getElementById("back_odds_" + index)?.title
              ) !== back[0]?.rt && "spark"
              }`
          }
          href="javascript:void(0)"
        >
          {backOdd()}
          <span>{backOddSpan()}</span>
        </a>
      </dd>
      <dd
        id="lay_1"
        onClick={() => {
          if (betType === 'bookmaker' && Number(lay[0]?.ms) !== 1) {

          } else {
            if (market == "" && details?.status == "in_play") {
              if (
                lay?.length === 0 ||
                betmode == "off" ||
                details?.sport_setting?.status == "inActive"
              ) {
              } else {
                if (
                  Number(lay[0]?.rt) == undefined ||
                  Number(lay[0]?.rt) > amountRange?.oddsLimit
                ) {
                } else {
                  if (!messaageBox) {
                    if (betSelectionObj.betType !== betType) {
                      resetSelection(betSelectionObj.betType);
                    }
                    setKey(item?.SelectionId);
                    setId({
                      index: index,
                      id: item?.SelectionId,
                      type: betType,
                    });
                    setBetSelectionObj({
                      ...betSelectionObj,
                      betType: betType,
                      oddsSelect: lay[0]?.rt,
                      layorback: "lay",
                      bidPrice: defaultStake == 0 ? "" : defaultStake,
                      priceToogle: true,
                      priceToogleType: "odds",
                      gameType: details?.gameType,
                      minAmount: amountRange?.min,
                      maxAmount: amountRange?.max,
                      expectany: defaultOdds,
                      inputType: "price",
                    });
                    if (
                      betType == "betFair" &&
                      slipObj?.SelectionId == item?.SelectionId &&
                      betSelectionObj?.layorback !== "lay"
                    ) {
                      setCondi(true);
                      handelBetFairPositions({
                        ...item,
                        ...lay[0],
                        teamName: item?.RunnerName,
                        ...details,
                      });
                    } else if (
                      betType == "bookmaker" &&
                      slipObj?.SelectionId == item?.SelectionId &&
                      betSelectionObj?.layorback !== "lay"
                    ) {
                      handelBookmakerPositions({
                        ...item,
                        ...back[0],
                        teamName: item?.RunnerName,
                        ...details,
                      });
                    }
                    setSlipObj({
                      ...item,
                      ...lay[0],
                      teamName: item?.RunnerName,
                      ...details,
                    });
                    setSelectedBet({
                      selectionId: item?.SelectionId,
                      teamName: item?.RunnerName,
                      check: "lay",
                    });
                  }
                }
              }
            }
          }
        }}
        className={
          lay[0]?.rt == undefined ||
            details?.sport_setting?.status == "inActive"
            ? "single-disabled"
            : lay[0]?.rt > amountRange?.oddsLimit
              ? "single-disabled"
              : ""
        }
        style={
          lay?.length === 0 ||
            betmode == "off" ||
            details?.sport_setting?.status == "inActive"
            ? { cursor: "not-allowed" }
            : { cursor: "pointer" }
        }
      >
        <a
          ref={
            index == id.index &&
              betType == id.type &&
              (betType == "bookmaker" ? item?.selectionID : item?.SelectionId) ==
              id.id
              ? myRef
              : null
          }
          id={"lay_odds_" + index}
          name={lay[0]?.bv}
          title={lay[0]?.rt}
          className={
            slipObj?.teamName ==
              (betType == "betFair" ? item?.RunnerName : item?.runnerName) &&
              betSelectionObj?.layorback == "lay" &&
              betSelectionObj.betType == betType &&
              betSelectionObj?.priceToogle
              ? `lay-1 select ${Number(document.getElementById("lay_odds_" + index)?.name) !==
              lay[0]?.bv && "spark"
              } ${Number(
                document.getElementById("lay_odds_" + index)?.title
              ) !== lay[0]?.rt && "spark"
              }`
              : `lay-1 ${Number(document.getElementById("lay_odds_" + index)?.name) !==
              lay[0]?.bv && "spark"
              } ${Number(
                document.getElementById("lay_odds_" + index)?.title
              ) !== lay[0]?.rt && "spark"
              }`
          }
          // onClick={() => {
          //   // executeScroll(item.SelectionId);
          //   setScroolUpId(item.SelectionId);
          // }}
          href="javascript:void(0)"
        >
          {layOdd()}
          <span>{layOddSpan()}</span>
        </a>
      </dd>
    </>
  );
};

export default BackandLay;
