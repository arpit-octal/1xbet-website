import { isEmpty } from "lodash";
import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import AuthProvider from "../context/AuthContext";
import { apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { useNavigate } from "react-router-dom";
const WalletWrap = ({ user_coins, casionData, recallCasinoAmount, loader }) => {
  let { setWalletOpen, walletOpen } = useContext(AuthProvider);
  const navigate=useNavigate()
  return (
    <div
      id="multiWalletDiv"
      className="overlay"
      style={{ display: walletOpen ? "flex" : "none" }}
    >
      <div className="wallet-detail">
        <div className="wallet-detail-group">
          <dl className="wallet-detail-content">
            <dt>Main Balance</dt>
            <dd className="wallet-balance-num">
              {process.env.REACT_APP_SHOW_CURRENCY == 'true' && <span className="badge-currency" id="currency">
                {process.env.REACT_APP_CURRENCY}
              </span>}
              <span id="mainBalance">
                {user_coins && user_coins?.totalCoins?.toFixed(2)}
              </span>
            </dd>
            <dd className="wallet-exposure">
              Exposure{" "}
              <span id="mainExposure" className="red">
                ( {user_coins && user_coins?.exposure?.toFixed(2)})
              </span>
            </dd>
          </dl>
        </div>
        {/* <div id="walletContent" className="wallet-detail-group">
          <dl id="tempDl" className="wallet-detail-content">
            <dt id="vendorTitle_6">Royal Gaming Balance</dt>
            <dd className="wallet-balance-num">
              <span className="badge-currency" id="vendorCurrency_6">
                PBU
              </span>
              <span id="vendorBalance_6">0</span>
            </dd>
            <dd className="wallet-recall">
              <button
                className="btn-recall ui-btn ui-shadow ui-corner-all"
                id="recall_6"
                onclick="MobileBalanceShowingHandler.recall('6')"
              >
                Recall
              </button>
            </dd>
          </dl>
          <dl id="tempDl" className="wallet-detail-content">
            <dt id="vendorTitle_1">Casino Balance</dt>
            <dd className="wallet-balance-num">
              <span className="badge-currency" id="vendorCurrency_1">
                PBU
              </span>
              <span id="vendorBalance_1">
                {" "}
                {casionData ? casionData : user_coins?.casinoCoins?.toFixed(2)}
              </span>
            </dd>
            <dd className="wallet-recall">
              <button
                className="btn-recall ui-btn ui-shadow ui-corner-all"
                id="recall_1"
                onClick={() => {
                  if (casionData ? casionData : user_coins?.casinoCoins > 0) {
                    if (!loader) {
                      recallCasinoAmount();
                    }
                  }
                }}
              >
                {loader ? "...Loading" : "Recall"}
              </button>
            </dd>
          </dl>
          <dl id="tempDl" className="wallet-detail-content">
            <dt id="vendorTitle_3">BPoker Balance</dt>
            <dd className="wallet-balance-num">
              <span className="badge-currency" id="vendorCurrency_3">
                PBU
              </span>
              <span id="vendorBalance_3">0 Points</span>
            </dd>
            <dd className="wallet-recall">
              <button
                className="btn-recall ui-btn ui-shadow ui-corner-all"
                id="recall_3"
                onclick="MobileBalanceShowingHandler.recall('3')"
              >
                Recall
              </button>
            </dd>
          </dl>
          <dl id="tempDl" className="wallet-detail-content">
            <dt id="vendorTitle_5">SABA Balance</dt>
            <dd className="wallet-balance-num">
              <span className="badge-currency" id="vendorCurrency_5">
                PBU
              </span>
              <span id="vendorBalance_5">0</span>
            </dd>
            <dd className="wallet-recall">
              <button
                className="btn-recall ui-btn ui-shadow ui-corner-all"
                id="recall_5"
                onclick="MobileBalanceShowingHandler.recall('5')"
              >
                Recall
              </button>
            </dd>
          </dl>
          <dl id="tempDl" className="wallet-detail-content">
            <dt id="vendorTitle_4">Sky Trader Balance</dt>
            <dd className="wallet-balance-num">
              <span className="badge-currency" id="vendorCurrency_4">
                PBU
              </span>
              <span id="vendorBalance_4">0</span>
            </dd>
            <dd className="wallet-recall">
              <button
                className="btn-recall ui-btn ui-shadow ui-corner-all"
                id="recall_4"
                onclick="MobileBalanceShowingHandler.recall('4')"
              >
                Recall
              </button>
            </dd>
          </dl>
          <dl id="recallAllDl" className="wallet-detail-content">
            <dd className="align-R">
              <button
                className="btn-recall ui-btn ui-shadow ui-corner-all"
                id="recallAll"
                onclick="MobileBalanceShowingHandler.recall('6,1,3,5')"
              >
                Recall All
              </button>
            </dd>
          </dl>
        </div> */}
        <div
          id="walletTemp"
          className="wallet-detail-group"
          style={{ display: "none" }}
        >
          <dl id="tempDl" className="wallet-detail-content">
            <dt id="vendorTitle">Housie Balance</dt>
            <dd className="wallet-balance-num">
              {process.env.REACT_APP_SHOW_CURRENCY == 'true' && <span className="badge-currency" id="vendorCurrency">
                {process.env.REACT_APP_CURRENCY}
              </span>}
              <span id="vendorBalance">$ 0.00</span>
            </dd>
            <dd className="wallet-recall">
              <button
                className="btn-recall ui-btn ui-shadow ui-corner-all"
                id="recall"
              >
                Recall
              </button>
            </dd>
          </dl>
          <dl id="recallAllDl" className="wallet-detail-content">
            <dd className="align-R">
              <button
                className="btn-recall ui-btn ui-shadow ui-corner-all"
                id="recallAll"
              >
                Recall All
              </button>
            </dd>
          </dl>
        </div>
        <div className="BtnRow">
        <div className="btn-box">
          <button
            className="btn ui-btn ui-shadow ui-corner-all"
            id="balanceClose"
            onClick={() => setWalletOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="btn-box">
          <button
            className="btn ui-btn ui-shadow ui-corner-all"
            id="balanceClose"
            onClick={() => {setWalletOpen(false);navigate('/recharge',{state:{from:'deposit'}})}}
          >
            Deposit
          </button>
        </div>
        <div className="btn-box">
          <button
            className="btn ui-btn ui-shadow ui-corner-all"
            id="balanceClose"
            onClick={() => {setWalletOpen(false);navigate('/recharge',{state:{from:'withdraw'}})}}
          >
            Withdraw
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default WalletWrap;
