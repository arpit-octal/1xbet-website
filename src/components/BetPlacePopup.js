import React from "react";
import { useContext } from "react";
import AuthProvider from "../context/AuthContext";
import BetSlipContext from "../context/BetSlipContext";

const BetPlacePopup = () => {
  let { handelPlaceBetfair, betfairObj, setBetFairObj, betSelectionObj } =
    useContext(BetSlipContext);
  return (
    <div
      id="confirmBetPop"
      className="overlay"
      style={{ display: betfairObj?.betPopup ? "flex" : "none" }}
    >
      <div className="pop-wrap">
        <h3>Please Confirm Your Bet</h3>

        <dl className="info-bet">
          <dt>
            <span id="sideType" className={betfairObj?.check}>
              {betfairObj?.check}
            </span>
            <h4 id="runnerName">{betfairObj?.teamName}</h4>
          </dt>
          <dd>
            <span>{betSelectionObj?.priceToogleType}</span>
            <strong id="odds">{betSelectionObj?.oddsSelect}</strong>
          </dd>
          <dd>
            <span>Stake</span>
            <strong id="stake"> {betSelectionObj?.bidPrice}</strong>
          </dd>
          <dd>
            <span id="plName">
              {betfairObj?.check == "lay" ? "Libality" : "Profit"}
            </span>
            <strong id="pl" className={betfairObj?.check == "lay" && "red"}>
              {" "}
              {betfairObj?.check == "lay"
                ? (
                  Number(betSelectionObj?.oddsSelect) *
                  Number(betSelectionObj?.bidPrice) -
                  Number(betSelectionObj?.bidPrice)
                )?.toFixed(2)
                : (
                  Number(betSelectionObj?.oddsSelect - 1) *
                  Number(betSelectionObj?.bidPrice)
                )?.toFixed(2)}
            </strong>
          </dd>
        </dl>

        <dd
          id="asianHandicapForecast"
          className="bet-forecast"
          style={{ display: "none" }}
        >
          <div className="bet-forecast-info">
            <span id="forecastDesc_1"></span>
            <span id="winLoss_1"></span>
          </div>
          <div className="bet-forecast-info">
            <span id="forecastDesc_2"></span>
            <span id="winLoss_2"></span>
          </div>
          <div className="bet-forecast-info">
            <span id="forecastDesc_3"></span>
            <span id="winLoss_3"></span>
          </div>
        </dd>
        <ul className="btn-list">
          <li>
            <a
              onClick={() => setBetFairObj({ ...betfairObj, betPopup: false })}
              id="back"
              href="javascript:void(0)"
              className="btn"
            >
              Back
            </a>
          </li>
          <li>
            <a
              id="confirm"
              href="javascript:void(0)"
              onClick={() => {
                handelPlaceBetfair();
              }}
              className="btn-send"
            >
              Confirm
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BetPlacePopup;
