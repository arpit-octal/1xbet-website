import React, { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const CasinoPopup = () => {
  let {
    setCasinoModel,
    casinoModel,
    setCasinoRangeAmount,
    casinoRangeAmount,
    user_coins,
    setCasinoObj,
    casinoObj,
  } = useContext(AuthProvider);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async () => {
    setLoader(true);
    const { status, data: response_users1 } = await apiPost(
      apiPath.casinoAmountAdd,
      { amount: casinoRangeAmount }
    );
    if (status === 200) {
      if (response_users1.success) {
        const { status, data: response_users } = await apiPost(
          casinoObj?.platForm && casinoObj?.gameType
            ? apiPath.doLoginAndLaunchGame
            : apiPath.casinoWalletLogin,
          casinoObj?.platForm && casinoObj?.gameType
            ? {
              userId: response_users1?.results?.aeCasinoUserId,
              platForm: casinoObj?.platForm,
              gameType: casinoObj?.gameType,
              gameCode: casinoObj?.casinoType
            }
            : { userId: response_users1?.results?.aeCasinoUserId, platForm: casinoObj?.platForm }
        );
        if (status === 200) {
          if (response_users.status) {
            if (response_users.data.status === "0000") {
              setLoader(false);
              javascript: window.open(
                response_users.data.url,
                "_blank",
                "height=900,width=1200"
              );
              setCasinoModel(false);
              setCasinoObj({});
              setCasinoRangeAmount(0);
            } else {
              // setCasinoModel(false);
              // setCasinoObj({});
              setLoader(false);
              setCasinoModel(false);
              setCasinoObj({});
              setCasinoRangeAmount(0);
            }
          } else {
            // setCasinoModel(false);
            // setCasinoObj({});
            setLoader(false);
            setCasinoModel(false);
            setCasinoObj({});
            setCasinoRangeAmount(0);
            setLoader(false);
          }
        }
      } else {
        // setCasinoModel(false);
        // setCasinoObj({});
        setLoader(false);
      }
    } else {
      // setCasinoModel(false);
      // setCasinoObj({});
      setLoader(false);
    }
  };
  const onSubmit1 = async () => {
    setLoader(true);
    try {
      const { status, data: response_users1 } = await apiPost(
        casinoObj.casinoType === "aesexy"
          ? apiPath.casinoAmountAdd
          : apiPath.easytogoCasinoAmountAdd,
        { amount: casinoRangeAmount }
      );
      if (status === 200) {
        if (response_users1.success) {
          setLoader(false);
          navigate("/live-casino");
          setCasinoModel(false);
          setCasinoObj({});
          setCasinoRangeAmount(0);
        } else {
          setLoader(false);
        }
      } else {
        setLoader(false);
      }
    } catch (err) {
      setLoader(false);
    }
  };
  return (
    <div
      id="common_transfer_to_go"
      className="overlay"
      style={{ display: casinoModel ? "flex" : "none" }}
    >
      <div id="commonDialogWrap" className="pop-wrap transfer-wrap-slider">
        <h3 id="commonTitle">Casino</h3>
        <div className="available-wrap">
          <h4 id="commonPlayerBalance">
            <span>Main Balance</span>
            {user_coins && user_coins?.totalCoins?.toFixed(2)}
          </h4>
          <h4 id="commonPlayerVendorBalance">
            <span id="commonVendorBalanceTitle">Casino Balance</span>
            {user_coins && user_coins?.casinoCoins?.toFixed(2)}
          </h4>
        </div>
        <div className="transfer-content">
          <div className="amount-input typeing">
            <input
              id="commonDeposit"
              type="number"
              autoComplete={false}
              autoCorrect={false}
              maxlength="8"
              placeholder="Amount"
              value={casinoRangeAmount}
              onChange={(e) => {
                if (e.target.value > user_coins?.totalCoins) {
                  setCasinoRangeAmount(user_coins?.totalCoins);
                } else {
                  const numStr = String(e.target.value);
                  if (numStr.includes('.')) {

                    if (numStr.split('.')[1].length < 3) {
                      setCasinoRangeAmount(e.target.value);
                    }
                  } else {
                    setCasinoRangeAmount(e.target.value);
                  }
                }
              }}
              onKeyDown={event => {
                if (event.key === "E" || event.key === "e" || event.key === "+" || event.key === "-") {
                  event.preventDefault();
                }
              }}
            />
          </div>
          <ul className="slider">
            <li id="commonZeroBtn">0</li>
            <li class="col-slider">
              <div class="balance-percent">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div style={{ width: "80%", background: "#fff" }}>
                <Slider
                  value={casinoRangeAmount}
                  min={0}
                  max={user_coins?.totalCoins}
                  trackStyle={{
                    backgroundImage:
                      "linear-gradient(180deg, #ffb80c 15%, #ffa00c 100%)",
                    borderRadius: "0.2666666667vw solid #cb8009",
                    backgroundPosition: "inherit",
                    height: 10,
                  }}
                  id="commonSlideBar"
                  handleStyle={{
                    border: "0.2666666667vw solid #cb8009",
                    height: 26,
                    borderRadius: "4.2666666667vw",
                    width: 26,
                    boxShadow:
                      "inset 0 0.2666666667vw 0 0 rgb(255 255 255 / 50%)",
                    marginTop: -9,
                    backgroundImage:
                      "linear-gradient(180deg, #ffb80c 15%, #ffa00c 100%)",
                  }}
                  onChange={(e) => {
                    if (e > user_coins?.totalCoins) {
                      setCasinoRangeAmount(user_coins?.totalCoins);
                    } else {
                      setCasinoRangeAmount(e);
                    }
                  }}
                  railStyle={{ backgroundColor: "#d1dde5", height: 10 }}
                />
              </div>

              {/* <input
                id="commonSlideBar"
                type="range"
                min={0}
                max={user_coins?.totalCoins}
                value={casinoRangeAmount}
                onChange={(e) => {
                  if (e.target.value > user_coins?.totalCoins) {
                    setCasinoRangeAmount(user_coins?.totalCoins);
                  } else {
                    setCasinoRangeAmount(e.target.value);
                  }
                }}
                style={
                  {
                    // width: "86%",
                    // position: "absolute",
                    // width: "1px",
                    // height: "1px",
                    // overflow: "hidden",
                    // opacity: "0",
                  }
                }
              /> */}
              {/* <div
                class="slider-bar rangeslider--horizontal"
                id="js-rangeslider-0"
              >
                <div class="slider-bar_fill" style={{ width: "17.5px" }}></div>
                <div class="slider-bar_handle" style={{ left: "0px" }}></div>
              </div> */}
            </li>
            <li id="commonMaxBtn">Max</li>
          </ul>
        </div>
        <p
          id="commonErrorMsg"
          className="error"
          style={{ display: "none" }}
        ></p>

        <ul className="btn-list">
          <li>
            <a
              id="commonCancelBtn"
              href="javascript:void(0)"
              onClick={() => {
                setCasinoModel(false);
                setCasinoRangeAmount(0);
              }}
              className="btn"
            >
              Cancel
            </a>
          </li>
          <li>
            <a
              id="commonDepositAndLogin"
              href="javascript:void(0)"
              className={loader ? "btn-send disable" : "btn-send"}
              onClick={() => {
                if (!loader) {
                  if (casinoObj.casinoType === "livecasino") {
                    onSubmit1();
                  } else {
                    onSubmit();
                  }
                }
              }}
            >
              {loader ? "....Loading" : "Enter"}
            </a>
          </li>
          <li>
            <a
              id="openResetPasswordBtn"
              className="btn"
              href="#reset-wrap_pop"
              style={{ display: "none" }}
            >
              Reset Password
            </a>
          </li>
        </ul>

        <p id="vendorRules" className="rules" style={{ display: "none" }}></p>
      </div>
      <div
        id="vendorResetPasswordDiv"
        className="pop-wrap transfer-wrap-slider reset-wrap"
        style={{ display: "none" }}
      >
        <a id="closeVendorResetPasswordDiv" className="close">
          Close
        </a>
        <div className="transfer-title">
          <h2 id="vendorResetPasswordTitle">Reset Sky Trader Password</h2>
        </div>
        <div className="reset_con">
          <dl className="login-panel">
            <input type="hidden" id="rk" />
            <input type="hidden" id="isFirstLogin" />
            <dd>
              <input
                maxlength="8"
                id="updatePassword"
                type="Password"
                placeholder="New Sky Trader Password"
              />
            </dd>
            <dd>
              <input
                maxlength="8"
                id="updatePasswordConfirm"
                type="Password"
                placeholder="New Sky Trader Password Confirm"
              />
            </dd>
            <dd>
              <input
                maxlength="40"
                id="loginPassword"
                type="Password"
                placeholder="Your SKYEXCHANGE Password"
              />
            </dd>
            <dd>
              <a id="vendorResetPassword" className="btn-send">
                Reset Password
              </a>
            </dd>
            <dd
              id="resetVendorPasswordErrorMsg"
              style={{ display: "none" }}
              className="error"
            ></dd>
          </dl>

          <ul className="note">
            <li>Password must have 6 to 8 alphanumeric without white space</li>
            <li>Password cannot be the same as username/nickname</li>
            <li>
              Must contain at least 1 capital letter, 1 small letter and 1
              number
            </li>
            <li>
              Password must not contain any special characters (!,@,#,etc..)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CasinoPopup;
