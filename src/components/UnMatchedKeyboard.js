import { isEmpty } from "lodash";
import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import BetSlipContext from "../context/BetSlipContext";
import PriceList from "../pages/MatchDetails/PriceList";

const UnMatchedKeyboard = ({
  details,
  selectedBet,
  setSlipObj,
  resetSelection,
  slipObj,
  amountRange,
  betType,
  res,
}) => {
  let {
    setBetSelectionObj,
    betSelectionObj,
    betLoader,
    defaultStake,
    defaultOdds,
    handelPlaceBetfairUpdate
  } = useContext(BetSlipContext);
  const navigate = useNavigate();
  let { profileData, user } = useContext(AuthProvider);
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
          <ul className="btn-list">
            <li>
              <div
                id="inputOdds"
                className={
                  res.amount == betSelectionObj.bidPrice
                    ? "input-num"
                    : "input-num disable"
                }
              >
                <a
                  id="oddsDown"
                  disabled={betSelectionObj?.betType == "betFair" ? false : true}
                  className="icon-minus"
                  style={{
                    display:
                      betSelectionObj?.betType !== "betFair" ? "none" : "flex",
                  }}
                  onClick={() => {
                    if (res.amount == betSelectionObj.bidPrice) {
                      setBetSelectionObj({
                        ...betSelectionObj,
                        inputType: "odds",
                        oddsSelect: Number(
                          Number(betSelectionObj?.oddsSelect) == 1
                            ? Number(betSelectionObj?.oddsSelect)
                            : Number(betSelectionObj?.oddsSelect) - 1
                        ),
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
                  {res.amount !== betSelectionObj.bidPrice
                    ? betSelectionObj?.oddsSelect
                    : ""}
                  {res.amount == betSelectionObj.bidPrice && (
                    <input
                      onFocus={false}
                      type="number"
                      value={betSelectionObj?.oddsSelect}
                      placeholder="Odds"
                      inputmode="none"
                      disabled={
                        betSelectionObj?.betType == "betFair" ? false : true
                      }
                      onChange={(e) => {
                        if (res.amount == betSelectionObj.bidPrice) {
                          setBetSelectionObj({
                            ...betSelectionObj,
                            oddsSelect: Number(e.target.value),
                          });
                        }
                      }}
                      onKeyDown={(event) => {
                        if (res.amount == betSelectionObj.bidPrice) {
                          event.preventDefault();
                        }
                      }}
                      onClick={(e) => {
                        if (res.amount == betSelectionObj.bidPrice) {
                          e.target.blur();
                          if (betSelectionObj?.betType == "betFair") {
                            setBetSelectionObj({
                              ...betSelectionObj,
                              inputType:
                                betSelectionObj?.betType == "betFair" ? "odds" : "",
                              oddsSelect: "",
                            });
                          }
                        }
                      }}
                    />
                  )}
                </span>
                <a
                  id="oddsUp"
                  className="icon-plus"
                  style={{
                    display:
                      betSelectionObj?.betType !== "betFair" ? "none" : "flex",
                  }}
                  href="javascript:void(0)"
                  disabled={betSelectionObj?.betType == "betFair" ? false : true}
                  onClick={() => {
                    if (res.amount == betSelectionObj.bidPrice) {
                      setBetSelectionObj({
                        ...betSelectionObj,
                        inputType: "odds",
                        oddsSelect: Number(Number(betSelectionObj?.oddsSelect) + 1),
                      });
                    }
                  }}
                ></a>
              </div>
            </li>
            <li>
              <div
                id="inputOdds"
                className={
                  res.bhav !== betSelectionObj.oddsSelect
                    ? "input-num disable"
                    : "input-num"
                }
              >
                <a
                  id="oddsDown"
                  className="icon-minus"
                  onClick={() => {
                    if (res.bhav == betSelectionObj.oddsSelect) {
                      setBetSelectionObj({
                        ...betSelectionObj,
                        inputType: "price",
                        bidPrice: Number(
                          Number(betSelectionObj.bidPrice) == 1
                            ? Number(betSelectionObj.bidPrice)
                            : Number(betSelectionObj.bidPrice) - 1
                        ),
                      });
                    }
                    // setBidPrice((prev) =>
                    //   Number(prev) == 1 ? prev : Number(prev) - 1
                    // );
                    // setInputType("price");
                  }}
                  href="javascript:void(0)"
                ></a>
                <span
                  id="odds"
                  className={
                    betSelectionObj?.inputType == "price" ? "typeing" : "typed"
                  }
                >
                  {res.bhav !== betSelectionObj.oddsSelect ? (
                    betSelectionObj?.bidPrice
                  ) : (
                    <input
                      onFocus={false}
                      type="number"
                      value={betSelectionObj?.bidPrice}
                      placeholder="Price"
                      // readOnly="readonly"
                      inputmode="none"
                      onChange={(e) => {
                        if (res.bhav == betSelectionObj.oddsSelect) {
                          setBetSelectionObj({
                            ...betSelectionObj,
                            bidPrice: Number(e.target.value),
                          });
                        }
                      }}
                      onKeyDown={(event) => {
                        if (res.bhav == betSelectionObj.oddsSelect) {
                          event.preventDefault();
                        }
                      }}
                      onClick={(e) => {
                        if (res.bhav == betSelectionObj.oddsSelect) {
                          e.target.blur();
                          setBetSelectionObj({
                            ...betSelectionObj,
                            inputType: "price",
                            bidPrice: "",
                          });
                          // setInputType("price");
                          // setBidPrice("");
                        }
                      }}
                    />
                  )}
                </span>
                <a
                  id="oddsUp"
                  className="icon-plus"
                  href="javascript:void(0)"
                  onClick={() => {
                    if (res.bhav == betSelectionObj.oddsSelect) {
                      setBetSelectionObj({
                        ...betSelectionObj,
                        inputType: "price",
                        bidPrice: Number(Number(betSelectionObj.bidPrice) + 1),
                      });
                    }
                    // setBidPrice((prev) => Number(prev) + 1);
                    // setInputType("price");
                  }}
                ></a>
              </div>
            </li>
          </ul>
          <PriceList stake={profileData.stake || []} />
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
                        res.bhav == betSelectionObj.oddsSelect &&
                        res.amount == betSelectionObj.bidPrice
                      ) {
                      } else {
                        handelPlaceBetfairUpdate(res);
                      }
                    }
                  } else {
                    navigate("/login");
                  }
                }}
                disabled={
                  betLoader
                    ? true
                    : res.bhav == betSelectionObj.oddsSelect &&
                      res.amount == betSelectionObj.bidPrice
                      ? true
                      : false
                }
                className={
                  res.bhav == betSelectionObj.oddsSelect &&
                    res.amount == betSelectionObj.bidPrice
                    ? "btn-send w-100 disable"
                    : "btn-send w-100"
                }
              >
                Ok
              </button>
            </li>
          </ul>
        </div>
        : <></>}
    </>
  );
};

export default UnMatchedKeyboard;
