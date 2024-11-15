import { isEmpty } from "lodash";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
const Footer = () => {
  const navigate = useNavigate();
  let { user, setGameFooter, gameFooter } = useContext(AuthProvider);
  return (
    <div>
      {/* {gameFooter && (
        <div className="lobby" data-v-2a94eb60="" data-v-5f5b6ef7="">
          <div className="gmnheader" data-v-302cf84b="" data-v-2a94eb60="">
            <div className="header__img" data-v-302cf84b="">
              <div className="header__img__title" data-v-302cf84b="">
                <picture
                  className="pictureClass"
                  data-v-28fc9a52=""
                  data-v-302cf84b=""
                >
                  <img
                    className="icon-promote"
                    src={process.env.REACT_APP_URL + "/assets/images/icon-title.webp"}
                    alt=""
y
                  />
                </picture>
                <span className="header__number" data-v-302cf84b="">
                  2
                </span>
              </div>
            </div>

            <div className="header__close" data-v-302cf84b="">
              <img
                className="icon-promote"
                src={process.env.REACT_APP_URL + "/assets/images/icon-close.webp"}
                onClick={() => setGameFooter(false)}
                alt=""

              />
            </div>
          </div>
        </div>
      )} */}
      <nav>
        <ul className="bottom-navigation-menu">
          {/* <li id="mini" className="game-nav">
            <a
              href="javascript:void(0)"
              onClick={() => {
                if (!isEmpty(user)) {
                  setGameFooter(true);
                } else {
                  navigate("/login");
                }
              }}
              neua="Sports"
              className="ui-link"
            >
              <img
                className="icon-promote"
                src={process.env.REACT_APP_URL + "/assets/images/home/promot.gif"}
                alt=""
              // src={process.env.REACT_APP_URL + '/yourPathHere.jpg' }
              />
              Sports
            </a>
          </li> */}

          <li id="home" className={window.location.pathname == "/" ? "select main-nav" : ""}>
            <Link to="/" neua="Home" className="ui-link">
              {window.location.pathname == "/" ? (
                <img className="icon-home2" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/home_active.png"} alt="" />
              ) : (
                <img className="icon-home2" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/home_gray.png"} alt="" />
              )}
              Home
            </Link>
          </li>

          <li id="casino" className={window.location.pathname == "/casino-games" ? "select main-nav" : ""}>
            <Link to="/casino-games" neua="Sports" className="ui-link">
              {window.location.pathname == "/casino-games" ? (
                <img className="" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/casino_active.png"} alt="" />
              ) : (
                <img className="" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/casino_gray.png"} alt="" />
              )}
              Casino
            </Link>
          </li>

          <li id="sports" className={window.location.pathname == "/sports" ? "select main-nav" : ""}>
            <Link to="/sports" neua="Sports" className="ui-link">
              {window.location.pathname == "/sports" ? (
                <img className="icon-sports2" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/sport_active.png"} alt="" />
              ) : (
                <img className="icon-home2" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/sports_gray.png"} alt="" />
              )}
              Sports
            </Link>
          </li>

          {/* <li id="inPlay">
            <Link to="/inplay" neua="In-Play" className="ui-link">
              <img
                className="icon-inplay"
                src={process.env.REACT_APP_URL + "/assets/images/home/transparent.gif"}
                alt=""
              />
              In-Play
            </Link>
          </li> */}

          <li id="support">
            <Link to={"http://Wa.me/+918147049979"} target="_blank" neua="Multi Markets" className="ui-link">
              <img className="icon-pin2" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/whatsup_gray.png"} alt="" />
              Support
            </Link>
          </li>
          <li id="account" className={window.location.pathname == "/profile" ? "select main-nav" : ""}>
            <Link to={user ? "/profile" : "/login"}>
              {isEmpty(user) ? (
                <>
                  {window.location.pathname == "/login" ? (
                    <img className="icon-account2" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/login_active.png"} alt="" />
                  ) : (
                    <img className="icon-account2" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/login_gray.png"} alt="" />
                  )}
                </>
              ) : (
                <>
                  {window.location.pathname == "/profile" ? (
                    <img className="icon-account2" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/account_active.png"} alt="" />
                  ) : (
                    <img className="icon-account2" src={process.env.REACT_APP_URL + "/assets/images/bottom_icon/account_gray.png"} alt="" />
                  )}
                </>
              )}
              {!isEmpty(user) ? "Account" : "Login"}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Footer;
