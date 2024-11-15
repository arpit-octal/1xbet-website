import React, { useContext } from "react";
import AuthProvider from "../context/AuthContext";

function FancyBetRulesWrap() {
  let { fancyrules, setFancyRules } = useContext(AuthProvider);
  return (
    <>
      <div
        id="fancyBetRulesWrap"
        className="overlay"
        style={{ display: fancyrules ? "flex" : "none" }}
      >
        <div className="side-wrap rules-pop">
          <div className="side-head">
            <h3 id="fancyBetHeader" className="">
              Rules of Fancy Bets
            </h3>
            <h3 id="electionHeader" style={{ display: "none" }}>
              Rules of Election Fancy Bets
            </h3>
            <a
              className="close ui-link"
              href="javascript:void(0)"
              onClick={() => setFancyRules(false)}
            >
              Close
            </a>
          </div>
          <div className="side-content rules-content">
            <ol id="fancyBetRules" name="fancyBetRules">
              <li>
                Once all session/fancy bets are completed and settled there will
                be no reversal even if the Match is Tied or is Abandoned.
              </li>
              <li>
                Advance Session or Player Runs and all Fancy Bets are only valid
                for 20/50 overs full match each side. (Please Note this
                condition is applied only in case of Advance Fancy Bets only).
              </li>
              <li>
                All advance fancy bets market will be suspended 60 mins prior to
                match and will be settled.
              </li>
              <li>
                Under the rules of Session/Fancy Bets if a market gets Suspended
                for any reason whatsoever and does not resume then all previous
                Bets will remain Valid and become HAAR/JEET bets.
              </li>
              <li>
                Incomplete Session/Fancy Bet will be cancelled but Complete
                Session will be settled.
              </li>
              <li>
                In the case of Running Match getting Cancelled/ No Result/
                Abandoned but the session is complete it will still be settled.
                Player runs / fall of wicket will be also settled at the figures
                where match gets stopped due to rain for the inning (D/L) ,
                cancelled , abandoned , no result.
              </li>
              <li>
                If a player gets Retired Hurt and one ball is completed after
                you place your bets then all the betting till then is and will
                remain valid. We Consider Retired Out as Retired Hurt
              </li>
              <li>
                Should a Technical Glitch in Software occur, we will not be held
                responsible for any losses.
              </li>
              <li>
                Should there be a power failure or a problem with the Internet
                connection at our end and session/fancy market does not get
                suspended then our decision on the outcome is final.
              </li>
              <li>
                All decisions relating to settlement of wrong market being
                offered will be taken by management. Management will consider
                all actual facts and decision taken will be full in final.
              </li>
              <li>
                Any bets which are deemed of being suspicious, including bets
                which have been placed from the stadium or from a source at the
                stadium maybe voided at anytime. The decision of whether to void
                the particular bet in question or to void the entire market will
                remain at the discretion of Company. The final decision of
                whether bets are suspicious will be taken by Company and that
                decision will be full and final.
              </li>
              <li>
                Any sort of cheating bet , any sort of Matching (Passing of
                funds), Court Siding (Ghaobaazi on commentary), Sharpening,
                Commission making is not allowed in Company, If any company User
                is caught in any of such act then all the funds belonging that
                account would be seized and confiscated. No argument or claim in
                that context would be entertained and the decision made by
                company management will stand as final authority.
              </li>
              <li>
                Fluke hunting/Seeking is prohibited in Company , All the fluke
                bets will be reversed. Cricket commentary is just an additional
                feature and facility for company user but company is not
                responsible for any delay or mistake in commentary.
              </li>
            </ol>

            <ol id="electionRules" style={{ display: "none" }}>
              <li>
                Election result declared by Election Commission of India will be
                valid in our Exchange.
              </li>
              <li>
                Accidental issues in Election will Not Be counted in our
                Exchange.
              </li>
            </ol>
          </div>
          <ul className="btn-list">
            <li>
              <a
                href="javascript:void(0)"
                className="btn ui-link"
                onClick={() => setFancyRules(false)}
              >
                OK
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default FancyBetRulesWrap;
