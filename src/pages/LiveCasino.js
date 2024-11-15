import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "wc-toast";
import AuthProvider from "../context/AuthContext";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { easyToGoCasino } from "../Utils/constants";
import obj from "../Utils/helpers";
function LiveCasino() {
  let { user } = useContext(AuthProvider);
  const launchGame = async (platForm, gameType) => {
    const { status, data: response_users } = await apiPost(apiPath.doLoginAndLaunchEasyToCasino, { prod: gameType, type: platForm });
    if (status === 200) {
      if (response_users.status) {
        if (response_users.data.err == 1) {
          javascript: window.open(response_users.data.url, "_blank", "height=900,width=1200");
        } else {
          toast.error("something went wrong");
        }
      }
    }
  };

  return (
    <div>
      <div className="promo-viewport">
        <img src="assets/images/home/kv-betgames-9livegames-m.png" style={{ width: "100%" }} alt="" />
      </div>

      <div id="page">
        <div className="mian-wrap">
          <div className="gamehall">
            {easyToGoCasino.map((res) => {
              return (
                <a
                  className="entrance-half"
                  href="javascript:void(0)"
                  onClick={() => {
                    if (!isEmpty(user)) {
                      launchGame(res?.productTypeCode, res?.code);
                    }
                  }}
                  neua="AEIndia Banner"
                >
                  <dl className="entrance-title">
                    <dt>{res?.product}</dt>
                    <dd>Play Now</dd>
                  </dl>
                  <img src={res?.image} alt="" />
                </a>
              );
            })}
            {/* <a
              className="entrance-half"
              href="javascript:void(0)"
              onClick={() => {
                setCasinoModel(true);
                setCasinoObj({
                  platForm: "SEXYBCRT",
                  gameType: "LIVE",
                  casinoType: "aesexy",
                });
              }}
              neua="AEIndia Banner"
            >
              <dl className="entrance-title">
                <dt>AE India</dt>
                <dd>Play Now</dd>
              </dl>
              <img src="assets/images/home/banner_AEIndia-half.png" alt="" />
            </a>

            <a
              className="entrance-half"
              href="javascript:void(0)"
              onClick={() => {
                setCasinoModel(true);
                setCasinoObj({
                  platForm: "SEXYBCRT",
                  gameType: "LIVE",
                  casinoType: "livecasino",
                });
              }}
              neua="Casino Banner"
            >
              <dl className="entrance-title">
                <dt>Live Casino</dt>
                <dd>Play Now</dd>
              </dl>
              <img src="assets/images/home/banner_casino-half.png" alt="" />
            </a> */}

            {/* <a
              className="entrance-half"
              href="javascript:void(0)"
              onClick={() => {
                setCasinoModel(true);
                setCasinoObj({
                  platForm: "SEXYBCRT",
                  gameType: "LIVE",
                  casinoType: "supernowa",
                });
              }}
              neua="Supernowa Banner"
            >
              <dl className="entrance-title">
                <dt>Supernowa</dt>
                <dd>Play Now</dd>
              </dl>
              <img src="assets/images/home/banner_supernowa-half.jpg" alt="" />
            </a> */}
          </div>

          <div className="support-wrap extend-support">
            <div className="extend-btn">
              <img src={process.env.REACT_APP_URL + "assets/images/home/transparent.gif"} title="customer" className="support-customer" />
              <a href="#">Customer support1</a>

              <a href="#" className="split-line">
                support2
              </a>
            </div>
            <div className="extend-btn">
              <img src={process.env.REACT_APP_URL + "assets/images/home/transparent.gif"} title="WhatsApp" className="support-whatsapp" />
              <a href="#">+91123456789</a>

              <a href="#" className="split-line">
                +91123456789
              </a>
            </div>
            <div className="extend-btn">
              <img src={process.env.REACT_APP_URL + "assets/images/home/transparent.gif"} title="Telegram" className="support-telegram" />
              <a href="#">PoisaBazz001</a>

              <a href="#" className="split-line">
                PoisaBazz002
              </a>
            </div>
            <div className="support-social">
              <div className="social-btn">
                <img src={process.env.REACT_APP_URL + "assets/images/home/transparent.gif"} title="Skype" className="support-skype" />
                <a href="#">Skype</a>
              </div>
              <div className="social-btn">
                <img src={process.env.REACT_APP_URL + "assets/images/home/transparent.gif"} title="Email" className="support-mail" />
                <a href="#">Email</a>
              </div>
              <div className="social-btn">
                <img src={process.env.REACT_APP_URL + "assets/images/home/transparent.gif"} title="Instagram" className="support-ig" />
                <a href="#" className="ui-link">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <ul className="policy-link">
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms and Conditions</a>
            </li>
            <li>
              <a href="#">Rules and Regulations</a>
            </li>
            <li>
              <a href="#">KYC</a>
            </li>
            {/* <li>
              <a href="#">Responsible Gaming</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Self-Exclusion Policy</a>
            </li>
            <li>
              <a href="#">Underage Policy</a>
            </li> */}
          </ul>

          <div className="extra-wrap">
            <div id="powerWrap" className="power-wrap-b" style={{ display: "block" }}>
              <span>Powered by</span>
              <img src={process.env.REACT_APP_URL + "assets/images/home/transparent.gif"} />
            </div>

            <div className="appdl-link-android" style={{ display: "block" }}>
              <a href="#">
                <img src={process.env.REACT_APP_URL + "assets/images/home/btn-appdl-android.png"} alt="" />
              </a>
              <p>v1.11 - 2022-03-23 - 3.1MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveCasino;
