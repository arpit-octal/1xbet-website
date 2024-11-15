import { isEmpty } from "lodash";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../../context/AuthContext";
import BetSlipContext from "../../context/BetSlipContext";
import PriceList from "./PriceList";

const Keyboard = ({
  details,
  selectedBet,
  setSlipObj,
  resetSelection,
  slipObj,
  amountRange,
  betType,
}) => {
  let {
    setBetSelectionObj,
    betSelectionObj,
    setBetFairObj,
    handelPlaceBookmakerBet,
    handelPlaceFancyBet,
    handelPlacePreminumFancyBet,
    betLoader,
    defaultStake,
    defaultOdds,
  } = useContext(BetSlipContext);
  const navigate = useNavigate();
  let { profileData, user } = useContext(AuthProvider);
  const [messageTab, setMessageTab] = useState(false);
  useEffect(() => {
    setMessageTab(betSelectionObj?.bidPrice >= amountRange.min ? false : true);
  }, [betSelectionObj?.bidPrice]);

  const checkFunc = () => {
    if (
      betSelectionObj?.betType == "betFair" ||
      betSelectionObj?.betType == "bookmaker"
    ) {
      return betSelectionObj?.oddsSelect <= amountRange?.oddsLimit;
    } else {
      return true;
    }
  };
  const disableConditionFunc = () => {
    if (betLoader) {
      return true;
    } else if (
      betSelectionObj?.bidPrice <= amountRange.max &&
      betSelectionObj?.bidPrice >= amountRange.min &&
      messageTab == false &&
      check
    ) {
      return false;
    } else {
      return false;
    }
  };
  let check = checkFunc();
  let disableCondition = disableConditionFunc();

  const [showElement, setShowElement] = useState(true);

  useEffect(() => {
    setTimeout(function () {
      setBetSelectionObj({
        priceToogle: false,
        bidPrice: defaultStake ? defaultStake : "",
        expectany: defaultOdds,
      });
      setSlipObj({});
      resetSelection(betType);
      setShowElement(false)
    }, 10000);
  },
    [])
  return (
    <>
      {showElement ?
        <div
          className={
            betSelectionObj?.layorback == "lay"
              ? "bet_slip-wrap lay"
              : "bet_slip-wrap back"
          }
        >
          {/* <div
        id="messageWrap"
        className="message-wrap"
        style={{
          display: messageTab ? "flex" : "none",
        }}
      >
        <div className="message">
          <h4 id="info" style={{ background: "#f8e71c" }}>
            The stake you have entered are below the minimum.
          </h4>
        </div>
        <a
          id="close"
          className="close"
          onClick={() => setMessageTab(false)}
          href="javascript:void(0)"
        >
          Close
        </a>
      </div> */}

          < ul className="btn-list" >
            <li>
              <p className="dynamic-min-bet">&nbsp;</p>
              <div
                id="inputOdds"
                className={"input-num disable"}
                // className={
                //   betSelectionObj?.betType == "betFair"
                //     ? "input-num"
                //     : "input-num disable"
                // }
              >
                <a
                  id="oddsDown"
                  disabled={betSelectionObj?.betType == "betFair" ? false : true}
                  className="icon-minus"
                  style={{
                    display:"none"
                  }}
                  // style={{
                  //   display:
                  //     betSelectionObj?.betType !== "betFair" ? "none" : "flex",
                  // }}
                  onClick={() => {
                    if (betSelectionObj?.betType == "betFair") {
                      setBetSelectionObj({
                        ...betSelectionObj,
                        inputType: "odds",
                        oddsSelect: Number(
                          Number(betSelectionObj?.oddsSelect) == 1
                            ? Number(betSelectionObj?.oddsSelect)
                            : Number(betSelectionObj?.oddsSelect) - 0.01
                        ).toFixed(2),
                      });
                    }
                  }}
                  href="javascript:void(0)"
                ></a>
                <span
                  id="odds"
                  className={
                    betSelectionObj?.betType == "betFair"
                      ? betSelectionObj?.inputType == "odds"
                        ? "typeing"
                        : "typed"
                      : "typed"
                  }
                >
                  {betSelectionObj?.betType == "fancy"
                    ? `${betSelectionObj?.oddsSelect}/${betSelectionObj?.fancyOddSelect}`
                    : betSelectionObj?.betType !== "betFair"
                      ? betSelectionObj?.oddsSelect
                      : ""}
                  {betSelectionObj?.betType == "betFair" && (
                    <input
                      // onFocus={false}
                      type="number"
                      value={betSelectionObj?.oddsSelect}
                      placeholder="Odds"
                      inputmode="none"
                      disabled={true}
                      // disabled={
                      //   betSelectionObj?.betType == "betFair" ? false : true
                      // }
                      onChange={(e) => {
                        setBetSelectionObj({
                          ...betSelectionObj,
                          oddsSelect: Number(e.target.value),
                        });
                      }}
                      onKeyDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={(e) => {
                        e.target.blur();
                        if (betSelectionObj?.betType == "betFair") {
                          setBetSelectionObj({
                            ...betSelectionObj,
                            inputType:
                              betSelectionObj?.betType == "betFair" ? "odds" : "",
                            oddsSelect: "",
                          });
                        }
                      }}
                    />
                  )}
                </span>
                {/* {console.log(betSelectionObj?.oddsSelect)} */}
                <a
                  id="oddsUp"
                  className="icon-plus"
                  style={{
                    display:"none"
                  }}
                  // style={{
                  //   display:
                  //     betSelectionObj?.betType !== "betFair" ? "none" : "flex",
                  // }}
                  href="javascript:void(0)"
                  disabled={betSelectionObj?.betType == "betFair" ? false : true}
                  onClick={() => {
                    if (betSelectionObj?.betType == "betFair") {
                      setBetSelectionObj({
                        ...betSelectionObj,
                        inputType: "odds",
                        oddsSelect: Number(
                          Number(betSelectionObj?.oddsSelect) + 0.01
                        ).toFixed(2),
                      });
                    }
                    // setOddsSelect((prev) => Number(prev) + 1);
                    // setInputType("odds");
                  }}
                ></a>
              </div>
            </li>
            <li>
              <p className="dynamic-min-bet">
                Min Bet:{" "}
                <strong id="dynamicMinBet">
                  {amountRange.min ? amountRange.min : 10}
                </strong>
              </p>

              <div id="inputOdds" className="input-num input-stake">
                <a
                  id="stakeDown"
                  className="icon-minus"
                  onClick={() => {
                    setBetSelectionObj({
                      ...betSelectionObj,
                      inputType: "price",
                      bidPrice: Number(
                        Number(betSelectionObj.bidPrice) == 1
                          ? Number(betSelectionObj.bidPrice)
                          : Number(betSelectionObj.bidPrice) - 1
                      ),
                    });
                    // setBidPrice((prev) =>
                    //   Number(prev) == 1 ? prev : Number(prev) - 1
                    // );
                    // setInputType("price");
                  }}
                  href="javascript:void(0)"
                ></a>
                <span
                  id="stake"
                  className={
                    betSelectionObj?.inputType == "price"
                      ? "typed typeing"
                      : "typed"
                  }
                >
                  <input
                    // onFocus={true}
                    type="number"
                    value={betSelectionObj?.bidPrice}
                    placeholder="Price"
                    // readOnly="readonly"
                    inputmode="none"
                    onChange={(e) => {
                      setBetSelectionObj({
                        ...betSelectionObj,
                        bidPrice: Number(e.target.value),
                      });
                      // setBidPrice(e.target.value);
                    }}
                    onKeyDown={(event) => {
                      event.preventDefault();
                    }}
                    onClick={(e) => {
                      e.target.blur();
                      setBetSelectionObj({
                        ...betSelectionObj,
                        inputType: "price",
                        bidPrice: "",
                      });
                      // setInputType("price");
                      // setBidPrice("");
                    }}
                  />
                </span>
                <a
                  id="stakeUp"
                  className="icon-plus"
                  href="javascript:void(0)"
                  onClick={() => {
                    setBetSelectionObj({
                      ...betSelectionObj,
                      inputType: "price",
                      bidPrice: Number(Number(betSelectionObj.bidPrice) + 1),
                    });
                    // setBidPrice((prev) => Number(prev) + 1);
                    // setInputType("price");
                  }}
                ></a>
              </div>
            </li>
          </ul >
          <PriceList
            stake={
              profileData?.stake?.length > 0
                ? profileData?.stake
                : profileData?.editStake?.slice(0, 5)
            }
          />
          <ul className="btn-list">
            <li>
              <a
                id="cancel"
                href="javascript:void(0)"
                onClick={() => {
                  setBetSelectionObj({
                    priceToogle: false,
                    bidPrice: defaultStake ? defaultStake : "",
                    expectany: defaultOdds,
                  });
                  setSlipObj({});
                  resetSelection(betType);
                }}
                className="btn"
              >
                Cancel
              </a>
            </li>
            <li>
              <button
                id="placeBet"
                onClick={() => {
                  if (!isEmpty(user)) {
                    if (!betLoader) {
                      if (
                        betSelectionObj?.bidPrice <= amountRange.max &&
                        betSelectionObj?.bidPrice >= amountRange.min &&
                        messageTab == false &&
                        check
                      ) {
                        if (betSelectionObj?.betType == "betFair") {
                          setBetFairObj({
                            ...details,
                            ...selectedBet,
                            betPopup: true,
                            maxProfit: amountRange.maxProfit,
                          });
                        } else if (betSelectionObj.betType == "bookmaker") {
                          handelPlaceBookmakerBet({
                            ...details,
                            ...selectedBet,
                          });
                        } else if (betSelectionObj.betType == "fancy") {
                          handelPlaceFancyBet({
                            ...details,
                            ...selectedBet,
                            ...slipObj,
                          });
                        } else if (betSelectionObj.betType == "premiumFancy" || betSelectionObj.betType == "sportBook") {
                          handelPlacePreminumFancyBet({
                            ...details,
                            ...slipObj,
                          });
                        }
                      }
                    }
                  } else {
                    navigate("/login");
                  }
                }}
                disabled={
                  // betLoader
                  //   ? true
                  //   : betSelectionObj?.bidPrice < amountRange.max &&
                  //     betSelectionObj?.bidPrice > amountRange.min &&
                  //     messageTab == false &&
                  //     check
                  //   ? false
                  //   : true
                  disableCondition
                }
                className={
                  betSelectionObj?.bidPrice <= amountRange.max &&
                    betSelectionObj?.bidPrice >= amountRange.min &&
                    messageTab == false &&
                    check
                    ? "btn-send w-100"
                    : "btn-send w-100 disable"
                }
              >
                Place Bet
              </button>
            </li>
          </ul>
          {
            betSelectionObj.betType !== "betFair" && (
              <div
                id="acceptAnyOddsBox"
                className="bet-setting"
                style={{ display: "flex" }}
              >
                <a
                  id="acceptAnyOdds"
                  href="javascript:void(0)"
                  onClick={() => {
                    if (!defaultOdds) {
                      setBetSelectionObj({
                        ...betSelectionObj,
                        expectany: !betSelectionObj.expectany,
                      });
                    }
                  }}
                  className={
                    betSelectionObj.expectany ? "bet-check checked" : "bet-check"
                  }
                >
                  Accept Any Odds
                </a>
                {/* <span id="sportsBookMaxStake" style={{ display: "flex" }}>
          <a id="getSportsBookMaxStakeBtn" className="max-bet" href="#">
            Max
          </a>
        </span> */}
              </div>
            )
          }
        </div >
        : <></>}
    </>
  );
};

export default Keyboard;
