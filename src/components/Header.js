import { isEmpty } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import io from "socket.io-client";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import obj from "../Utils/helpers";
import MessageBox from "./MessageBox";
import BetSlipContext from "../context/BetSlipContext";
import WalletWrap from "./WalletWrap";
const Header = () => {
  let { user, user_coins, setUserCoins, logoutUser, setOpenBetsToogle, setSettingToogle, setIsTv, setAnnouncmentToogle, isTv, setWalletOpen, setInPlayScore, walletOpen } = useContext(AuthProvider);
  const location = useLocation();
  let { betLoader, unMatchedBets } = useContext(BetSlipContext);
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(false);

  // const refreshAmount = () => {
  //   setRefresh(true);
  //   const newSocket = io(
  //     `${process.env.REACT_APP_API_BASE_URL}?token=${localStorage.getItem('token')}&userType=front`,
  //     {
  //       transports: ["websocket"],
  //     }
  //   );
  //   const coinListener = (message) => {
  //     console.log(message.results);
  //     setUserCoins(message.results);
  //     setRefresh(false);
  //   };
  //   const forceLogout = (message) => {
  //     const uniqueId = localStorage.getItem("uniqueId");
  //     if (uniqueId !== message.results.uniqueId) {
  //       logoutUser();
  //     }
  //   };

  //   const InPlayScore = (message) => {
  //     setInPlayScore(JSON.parse(message));
  //   };
  //   newSocket.emit("getCoins", { user_id: user ? user.user._id : "" });
  //   newSocket.on("listenGetCoin", coinListener);
  //   newSocket.on("scoreAll", InPlayScore);
  //   newSocket.on("listenForceLogout", forceLogout);
  //   return () => newSocket.close();
  // };

  const recallCasinoAmount = async (event) => {
    if (!isEmpty(user)) {
      setLoader(true);
      try {
        const { status, data: response_users } = await apiPost(apiPath.withdrawCasinoAmount, { amount: user_coins?.casinoCoins });
        if (status === 200) {
          if (response_users.status) {
            if (response_users.data.status === "0000") {
              setLoader(false);
              mainBalanceClick();
              // refreshAmount();
              // setWalletOpen(false);
              // window.location.reload();
              // toast.success(response_users.message);
            } else {
              // setWalletOpen(false);
              setLoader(false);
              // toast.error(response_users.data?.desc);
            }
          } else {
            // setWalletOpen(false);
            setLoader(false);
            // toast.error(response_users.message);
          }
        }
      } catch (err) {
        // conso/le.log("1111111");
        setLoader(false);
        // toast.error(err.response.message);
      }
    }
  };
  const [casionData, setCasinoData] = useState(0);
  const mainBalanceClick = async () => {
    const { status, data: response_users } = await apiPost(apiPath.awcBalance);
    if (status === 200) {
      setCasinoData(response_users?.data?.balance);
    }
  };
  const getCoins = async () => {
    if (!isEmpty(user)) {
      const { status, data } = await apiGet(apiPath.refreshAmount);
      if (status === 200) {
        if (data.success) {
          setUserCoins({
            exposure: data?.results?.exposure,
            totalCoins: data?.results?.totalCoins,
          });
        }
      }
    }
  };
  useEffect(() => {
    if (!isEmpty(user)) {
      getCoins();
      mainBalanceClick();
    }
  }, [user]);

  // useEffect(() => {
  //   if (isEmpty(user_coins)) {
  //     setUserCoins({
  //       exposure: user?.user?.exposure,
  //       totalCoins: user?.user?.totalCoins,
  //     });
  //   }
  // }, [user_coins]);
  return (
    <>
      {!isEmpty(user) && (
        <header id="headerMain1">
          <ul>
            {location.pathname == "/casino-game-play" ? (
              <a href="/" style={{ background: "transparent", padding: "0px" }}>
                <img src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/back.png"} alt="img" />
              </a>
            ) : (
              ""
            )}
            <li className="logo logoInner">
              <a href="/" style={{ "background-color": "transparent" }}>
                <img src={process.env.REACT_APP_URL + "/assets/images/logo.svg"} alt="img" />
              </a>
            </li>
            {/* <li><h6 className="top-logo"></h6></li> */}

            <li className="main-wallet">
              <a
                id="multiWallet"
                href="javascript:void(0)"
                onClick={() => {
                  setWalletOpen(true);
                  mainBalanceClick();
                }}
                className={walletOpen ? "a-wallet ui-link open" : "a-wallet ui-link"}
              >
                {refresh ? (
                  <p className="loading-bar" id="menuRefreshLoading">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </p>
                ) : (
                  <ul id="accountCredit">
                    <li>
                      <span style={{ marginRight: "3px" }}>Main</span>
                      <span id="betCredit">
                        {process.env.REACT_APP_SHOW_CURRENCY == "true" ? process.env.REACT_APP_CURRENCY : ""} {user_coins ? user_coins?.totalCoins?.toFixed(2) : 0.0}
                        {/* PBU {user_coins ? user_coins?.totalCoins?.toFixed(2) : 0.00} */}
                      </span>
                    </li>
                    <li>
                      <span style={{ marginRight: "3px" }}>Exposure</span>
                      <span
                        id="totalExposure"
                        style={{
                          color: user_coins?.exposure > 0 && "white",
                          background: user_coins?.exposure && "red",
                          padding: "2px",
                        }}
                      >
                        {user_coins ? user_coins?.exposure?.toFixed(2) : 0.0}
                      </span>
                    </li>
                    {/* <li className="nums">
                      +<span id="vendorQuantity">5</span>
                    </li> */}
                  </ul>
                )}
              </a>
              <a className="a-refresh ui-link" id="menuRefresh" href="javascript:void(0)" onClick={() => getCoins()} title="Refresh Main Wallet">
                <img src={process.env.REACT_APP_URL + "/assets/images/home/transparent.gif"} alt={""} />
              </a>
            </li>

            <li className="li-tv_bet">
              {location?.pathname?.split("/")[1] == "match-details" && isTv.id !== "" && (
                <a id="openTV" className="a-open_tv ui-link" href="#" onClick={() => setIsTv({ ...isTv, status: true })} style={{ display: isTv.id == "" ? "none" : "flex" }}>
                  <img src={process.env.REACT_APP_URL + "/assets/images/home/transparent.gif"} alt={""} />
                </a>
              )}
              <a
                id="openBetsBtn"
                onClick={() => {
                  setOpenBetsToogle(true);
                }}
                className="a-open_bets ui-link"
                href="javascript:void(0)"
              >
                <img src={process.env.REACT_APP_URL + "/assets/images/home/transparent.gif"} alt={""} />
                {/* Bets */}
                {unMatchedBets?.length > 0 && (
                  <div>
                    <span class="slip-note"></span>
                    <span class="slip-note"></span>
                    <span class="slip-note"></span>
                  </div>
                )}
              </a>
            </li>

            {/* <li>
              <a onClick={() => setSettingToogle(true)} className="a-setting ui-link" href="javascript:void(0)" title="Setting">
                <img src={process.env.REACT_APP_URL + "/assets/images/home/transparent.gif"} alt={""} />
              </a>
            </li> */}
          </ul>
          <MessageBox />
          <WalletWrap user_coins={user_coins} recallCasinoAmount={recallCasinoAmount} casionData={casionData} loader={loader} />
        </header>
      )}
      {isEmpty(user) && (
        <header style={{ alignItems: "center" }}>
          <a href="/" style={{ display: "contents" }}>
            <h1 className="top-logo"></h1>
          </a>
          {/* <a className="btn-signup ui-link">Sign up</a> */}
          <Link to="/login" className="login-index ui-link">
            Login
          </Link>
          {process.env?.REACT_APP_ENABLE_SIGNUP == "true" && (
            <Link to="/signup" className="bg-transparent ui-link signUpBtn">
              Register
            </Link>
          )}

          <div id="msgBox" className="message-wrap success to-open_bets" style={{ display: "none" }}>
            <div className="message">
              <h4 id="header">Bet Matched</h4>
              <p id="info">
                <span id="sideType" className="back">
                  Back
                </span>
                <strong id="selectionName">England</strong> <strong id="stake">$1,000</strong> at odds <strong id="odds">1.29</strong>
              </p>
            </div>
            <a id="close" className="close ui-link" href="#">
              Close
            </a>
          </div>
          <div id="multiWalletDiv" className="overlay" style={{ display: "none" }}>
            <div className="wallet-detail">
              <div className="wallet-detail-group">
                <dl className="wallet-detail-content">
                  <dt>Main Balance</dt>
                  <dd className="wallet-balance-num">
                    {process.env.REACT_APP_SHOW_CURRENCY == "true" && (
                      <span className="badge-currency" id="currency">
                        {process.env.REACT_APP_CURRENCY}
                      </span>
                    )}
                    <span id="mainBalance">$ 0.00</span>
                  </dd>
                  <dd className="wallet-exposure">
                    Exposure <span id="mainExposure">$ 0.00</span>
                  </dd>
                </dl>
              </div>
              <div id="walletContent" className="wallet-detail-group"></div>
              <div id="walletTemp" className="wallet-detail-group" style={{ display: "none" }}>
                <dl id="tempDl" className="wallet-detail-content">
                  <dt id="vendorTitle">Housie Balance</dt>
                  <dd className="wallet-balance-num">
                    {process.env.REACT_APP_SHOW_CURRENCY == "true" && (
                      <span className="badge-currency" id="vendorCurrency">
                        {process.env.REACT_APP_CURRENCY}
                      </span>
                    )}
                    <span id="vendorBalance">$ 0.00</span>
                  </dd>
                  <dd className="wallet-recall">
                    <button className="btn-recall ui-btn ui-shadow ui-corner-all" id="recall">
                      Recall
                    </button>
                  </dd>
                </dl>
                <dl id="recallAllDl" className="wallet-detail-content">
                  <dd className="align-R">
                    <button className="btn-recall ui-btn ui-shadow ui-corner-all" id="recallAll">
                      Recall All
                    </button>
                  </dd>
                </dl>
              </div>
              <div className="btn-box">
                <button className="btn ui-btn ui-shadow ui-corner-all" id="balanceClose">
                  Close
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      {/* {!isEmpty(user) && ( */}

      {/* )} */}
    </>
  );
};

export default Header;
