import { isEmpty } from "lodash";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import BetSlipContext from "../../context/BetSlipContext";
import BackandLay from "./BackandLay";
import Keyboard from "./Keyboard";

const MatchDetails = ({
  selections,
  back_odds,
  lay_odds,
  details,
  totalMatched,
  setSlipObj,
  setSelections,
  slipObj,
  handelBetFairPositions,
  resetSelection,
  setCondi,
  betType,
  profileData,
  user,
  messaageBox,
  betFairMs,
  setMarketDepth,
  loader,
  setLoader,
}) => {
  let {
    handelPlaceBetfair,
    betSelectionObj,
    setIsBetPlaced,
    setBetPlacedCheck,
    setMessageBox,
    isBetPlaced,
  } = useContext(BetSlipContext);
  const [selectedBet, setSelectedBet] = useState({
    selectionId: "",
    teamName: "",
    check: "",
  });
  const [key, setKey] = useState("");
  const [amountRange, setAmountRange] = useState({
    min: 1,
    max: 100,
    oddsLimit: 0,
  });

  useEffect(() => {
    if (!isEmpty(user)) {
      let obj = profileData?.matchSetting?.find(
        (res) =>
          res?.type == "betFaire" &&
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
  }, []);

  const disabledCheck = () => {
    if (details?.status !== "in_play") {
      return "disabled";
    } else if (details.matchOdds == "off") {
      return "disabled";
    } else if (amountRange?.oddsLimit == 0) {
      return "disabled";
    } else {
      return "";
    }
  };

  let check = disabledCheck();
  const [betDelay, setBetDelay] = useState(false);
  const [popupMessage, setPopMessage] = useState(false);
  useEffect(() => {
    if (loader && betSelectionObj?.betType == "betFair") {
      setBetDelay(true);
      let temp = setTimeout(
        () => {
          setBetDelay(false);
          setLoader(false);
          setMessageBox(true);
        },
        amountRange?.betDelay ? amountRange?.betDelay * 1000 : 5000
      );
      if (isBetPlaced == "error") {
        setLoader(false);
        setBetPlacedCheck(true);
        setMessageBox(true);
        setBetDelay(false);
        clearTimeout(temp);
      } else if (isBetPlaced == "unMatched") {
        setLoader(false);
        setBetPlacedCheck(true);
        setMessageBox(true);
        setBetDelay(false);
        clearTimeout(temp);
      }
    }
  }, [loader, betSelectionObj.betType, isBetPlaced]);

  return (
    <>
      <div
        id="marketBetsWrap"
        className={`bets-wrap asiahadicap ${check} ${betDelay ? "cooldown" : ""
          }`}
      >
        <a
          id="minMaxButton"
          onClick={() => setPopMessage(true)}
          className="bet-limit"
          href="javascript:void(0)"
        ></a>
        {popupMessage && (
          <div
            id="minMaxBox"
            class="limit_info-popup"
            style={{ display: "flex" }}
          >
            <a
              class="close"
              href="javascript:void(0)"
              onClick={() => setPopMessage(false)}
            >
              Close
            </a>
            <dl>
              <dt id="minMaxDt">Min / Max</dt>
              <dt id="maxDt" style={{ display: "none" }}>
                Max
              </dt>
              <dd id="minMaxInfo">
                {amountRange?.min?.toFixed(2)} / {amountRange?.max?.toFixed(2)}
              </dd>
            </dl>
          </div>
        )}

        <dl id="betsHead" className="bets-selections-head">
          <dt>
            <a
              // onClick={() => setMarketDepth(true)}
              className="a-depth"
              href="#"
              id="marketDepthBtn"
            >
              Markets Depth
            </a>
            <p>
              <span>Matched</span>
              <strong id="totalMatched">USD {totalMatched}</strong>
            </p>
          </dt>
          <dd className="mode-land"></dd>
          <dd className="mode-land"></dd>
          <dd>Back</dd>
          <dd>Lay</dd>
          <dd className="mode-land"></dd>
          <dd className="mode-land"></dd>
        </dl>
        {selections?.length > 0 &&
          selections?.map((item, index) => {
            const filter_odds_back = back_odds.filter(
              (todd) => todd.ri === item.SelectionId
            );
            const filter_odds_lay = lay_odds.filter(
              (todd) => todd.ri === item.SelectionId
            );


            return (
              <>
                <dl id="section-1" className="bets-selections">
                  <dt>
                    <h4 id="runnerName">{item.RunnerName}</h4>
                    <ul id="winLoss">
                      {(Math.abs(item.position) != 0 ||
                        selections.some((res) => res?.position !== 0)) &&
                        !isNaN(Math.abs(item.position)) && (
                          <li
                            id="withBet"
                            class={item.position <= 0 ? "lose" : "win"}
                            style={{ display: "list-item" }}
                          >
                            {parseFloat(Math.abs(item.position)).toFixed(2)}
                          </li>
                        )}

                      {betSelectionObj?.priceToogle &&
                        betSelectionObj?.priceToogleType == "odds" &&
                        betSelectionObj?.betType == "betFair" &&
                        !isNaN(Math.abs(item.newPosition)) && (
                          <li
                            id="withBet"
                            class={item.newPosition <= 0 ? "to-lose" : "to-win"}
                            style={{ display: "list-item" }}
                          >
                            ({" "}
                            {parseFloat(Math.abs(item.newPosition)).toFixed(2)})
                          </li>
                        )}
                    </ul>
                  </dt>
                  {/* <dd
                    id="suspend"
                    className="suspend"
                    style={{ display: "flex" }}
                  >
                    <p>Suspend</p>
                  </dd> */}
                  {/* <dd
                    id="closed"
                    className="suspend"
                    style={{ display: "flex" }}
                  >
                    <p>Closed</p>
                  </dd> */}
                  {/* <dd
                    id="nonRunner"
                    className="suspend"
                    style={{ display: "none" }}
                  >
                    <p>Non Runner</p>
                  </dd> */}
                  {/* {Math.abs(item.position) != 0 &&
                    !isNaN(Math.abs(item.position)) && (
                      <ul id="winLoss">
                        <li
                          id="withBet"
                          class={item.position <= 0 ? "to-lose" : "to-win"}
                          style={{ display: "list-item" }}
                        >
                          ( {parseFloat(Math.abs(item.position,newPosition)).toFixed(2)})
                        </li>
                      </ul>

                    )} */}
                  {/* {console.log('betFairMs---', betFairMs)} */}
                  {betFairMs != 1 && (
                    <dd id="suspend" class="suspend-fancy">
                      <p id="info">
                        {betFairMs == 9
                          ? "Ball Running"
                          : betFairMs == 2
                            ? "In Active"
                            : betFairMs == 3
                              ? "Suspended"
                              : betFairMs == 4
                                ? "Closed"
                                : "Suspended"}
                      </p>
                    </dd>
                  )}
                  <BackandLay
                    back={filter_odds_back || []}
                    lay={filter_odds_lay || []}
                    setSelectedBet={setSelectedBet}
                    item={item}
                    market={""}
                    setKey={setKey}
                    setSlipObj={setSlipObj}
                    index={index}
                    details={details}
                    betmode={details.matchOdds}
                    slipObj={slipObj}
                    setCondi={setCondi}
                    handelBetFairPositions={handelBetFairPositions}
                    messaageBox={messaageBox}
                    betType={betType}
                    amountRange={amountRange}
                    resetSelection={resetSelection}
                  />
                </dl>
                {betSelectionObj?.priceToogle &&
                  betSelectionObj?.priceToogleType == "odds" &&
                  key == item.SelectionId &&
                  betSelectionObj?.betType == "betFair" ? (
                  <Keyboard
                    setSelections={setSelections}
                    details={details}
                    selectedBet={selectedBet}
                    setSlipObj={setSlipObj}
                    resetSelection={resetSelection}
                    betType={betType}
                    handelPlaceBetfair={handelPlaceBetfair}
                    amountRange={amountRange}
                  />
                ) : (
                  ""
                )}
              </>
            );
          })}
      </div>
    </>
  );
};

export default MatchDetails;
