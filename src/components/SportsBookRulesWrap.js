import React from "react";
import { useContext } from "react";
import AuthProvider from "../context/AuthContext";

function SportsBookRulesWrap() {
  let { setPremiumFancyRules, premiumFancyRules } = useContext(AuthProvider);
  return (
    <>
      <div
        id="sportsBookRulesWrap_2"
        className="overlay"
        style={{ display: premiumFancyRules ? "flex" : "none" }}
      >
        <div className="side-wrap rules-download">
          <div className="side-head">
            <h3 id="sportsbookRulesTitle" className="">
              Rules of Premium Cricket
            </h3>
            <a
              className="close ui-link"
              onClick={() => setPremiumFancyRules(false)}
              href="javascript:void(0)"
            >
              Close
            </a>
          </div>
          <div
            id="sportradarCricketRules"
            className="side-content rules-content"
          >
            <dl className="download-list">
              <dt className="icon-pdf">
                <a href="#" className="ui-link">
                  Pre Match Market Details
                </a>
              </dt>
              <dd>
                <a
                  href="https://drive.google.com/open?id=1rkKwnG8Sv09iANXNYriOXOm0e0wjoQqf"
                  target="_blank"
                  className="ui-link"
                >
                  download
                </a>
              </dd>
            </dl>
            <dl className="download-list">
              <dt className="icon-pdf">
                <a href="#" className="ui-link">
                  In Play Market Details
                </a>
              </dt>
              <dd>
                <a
                  target="_blank"
                  href="https://drive.google.com/open?id=13rBX3LjmSfNNKPbCyCxkqnvHZPdmIgLf"
                  className="ui-link"
                >
                  download
                </a>
              </dd>
            </dl>
          </div>
          {/* <div
            id="sportradarTennisRules"
            className="side-content rules-content"
          >
            <p>General Rules:</p>
            <ol>
              <li>
                In case of default, retirement or walkover of any player, all
                undecided bets are considered void.
              </li>
              <li>
                In case of any delay (rain, darkness…) all markets remain
                unsettled and the trading will be continued as soon as the match
                continues.
              </li>
              <li>
                If penalty point(s) are awarded by the umpire, all bets on that
                game will stand.
              </li>
              <li>
                In case of a match is finished before certain points/games were
                finished, all affected point/game related markets are considered
                void.
              </li>
            </ol>
            <p>Settlement and Cancellation Rules:</p>
            <ol>
              <li>
                If markets remain open with an incorrect score which has a
                significant impact on the prices, we reserve the right to void
                betting.
              </li>
              <li>
                If the players/teams are displayed incorrectly, we reserve the
                right to void betting.
              </li>
              <li>
                If a player retires all undecided markets are considered void.
              </li>
              <li>
                If a match tie-break is played as a deciding set in Bo3 format,
                it will be considered as the 3rd set
              </li>
              <li>Every tie-break or Match tie-break counts as 1 game</li>
            </ol>
          </div> */}
          {/* <div
            id="sportradarSoccerRules"
            className="side-content rules-content"
          >
            <dl className="download-list">
              <dt className="icon-pdf">
                <a href="#" className="ui-link">
                  Market Details
                </a>
              </dt>
              <dd>
                <a href="#" className="ui-link">
                  download
                </a>
              </dd>
            </dl>
          </div> */}
          <div
            id="sportradarKabaddiRules"
            className="side-content rules-content"
          ></div>
          <ul className="btn-list">
            <li>
              <a
                className="btn ui-link"
                onClick={() => setPremiumFancyRules(false)}
                href="javascript:void(0)"
              >
                ok
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SportsBookRulesWrap;
