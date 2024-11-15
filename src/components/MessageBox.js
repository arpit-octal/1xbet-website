import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import BetSlipContext from "../context/BetSlipContext";

const MessageBox = () => {
  let {
    betfairObj,
    setMessageBox,
    messaageBox,
    isBetPlaced,
    setIsBetPlaced,
    betSelectionObj,
    setBetSelectionObj,
    setBetFairObj,
    defaultStake,
    setUpdatePosition
  } = useContext(BetSlipContext);
  useEffect(() => {
    if (
      isBetPlaced === "placed" ||
      isBetPlaced === "error" ||
      isBetPlaced == "maxProfitError" ||
      isBetPlaced === "unMatched" ||
      isBetPlaced == "clearBet"
    ) {
      setTimeout(() => {
        setIsBetPlaced("");
        setBetSelectionObj({
          inputType: "",
          bidPrice: defaultStake,
          betType: "",
          oddsSelect: "",
          priceToogleType: "",
          layorback: "",
          minAmount: 10,
          maxAmount: 100,
          minAmountText: "",
          exceptAny: "",
          sportsType: "",
        });
        setMessageBox(false);
        setUpdatePosition(true)
        setBetFairObj({});
      }, 3000);
    }
  }, [messaageBox]);
  return messaageBox &&
    (isBetPlaced === "placed" || isBetPlaced === "unMatched") ? (
    <div
      id="msgBox"
      className={`message-wrap ${isBetPlaced === "placed" ? "success" : "error"
        } to-open_bets`}
      style={{ display: messaageBox ? "flex" : "none" }}
    >
      <div className="message">
        <h4 id="header">
          Bet {isBetPlaced === "placed" ? "Matched" : "UnMatched"}
        </h4>
        <p id="info">
          <span id="sideType" className="back">
            {betfairObj?.check}
          </span>
          <strong id="selectionName">{betfairObj?.teamName}</strong>{" "}
          <strong id="stake">$ {betSelectionObj?.bidPrice}</strong> at{" "}
          {betSelectionObj?.priceToogleType}{" "}
          <strong id="odds">{betSelectionObj?.oddsSelect}</strong>
        </p>
      </div>
      <a
        id="close"
        onClick={() => setMessageBox(false)}
        className="close ui-link"
        href="javascript:void(0)"
      >
        Close
      </a>
    </div>
  ) : messaageBox && isBetPlaced === "error" ? (
    <div
      id="msgBox"
      class="message-wrap error"
      style={{ display: messaageBox ? "flex" : "none" }}
    >
      <div class="message">
        <h4 id="header">
          {betSelectionObj?.errorMessage
            ? betSelectionObj?.errorMessage
            : "Bets rejected!!!"}
        </h4>
      </div>
      <a
        id="close"
        onClick={() => setMessageBox(false)}
        className="close ui-link"
        href="javascript:void(0)"
      >
        Close
      </a>
    </div>
  ) : messaageBox && isBetPlaced === "maxProfitError" ? (
    <div
      id="msgBox"
      class="message-wrap error"
      style={{ display: messaageBox ? "flex" : "none" }}
    >
      <div class="message">
        <h4 id="header">Your Profit Should below {betfairObj.maxProfit}</h4>
      </div>
      <a
        id="close"
        onClick={() => setMessageBox(false)}
        className="close ui-link"
        href="javascript:void(0)"
      >
        Close
      </a>
    </div>
  ) : messaageBox && isBetPlaced == "clearBet" ? (
    ""
  ) : (
    // <div id="openBetMsgBox" className="message-wrap up">
    //   <div class="message">
    //     <h4 id="header">Total Cancel 10.00 success!</h4>
    //     <p id="info">
    //       <span id="sideType" class="back">
    //         Back
    //       </span>
    //       <strong id="selectionName">England</strong>{" "}
    //       <strong id="stake">$1,000</strong> at odds{" "}
    //       <strong id="odds">1.29</strong>
    //     </p>
    //   </div>
    //   <a
    //     id="close"
    //     onClick={() => setMessageBox(false)}
    //     className="close ui-link"
    //     href="javascript:void(0)"
    //   >
    //     Close
    //   </a>
    // </div>
    ""
  );
};

export default MessageBox;
