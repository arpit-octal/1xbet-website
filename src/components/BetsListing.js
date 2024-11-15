import { useState } from "react";
import { useContext } from "react";
import BetSlipContext from "../context/BetSlipContext";
import Keyboard from "../pages/MatchDetails/Keyboard";
import UnMatchedKeyboard from "./UnMatchedKeyboard";

const HeaderListing = ({ type, sortbyTime, secondType, type2 }) => {
  return (
    <dl
      id={
        type == "Back"
          ? "header_back"
          : type == "Lay"
          ? "header_lay"
          : type == "fancy"
          ? "header_no"
          : "header_backLay"
      }
      className="bets-head"
      style={{ display: "flex" }}
    >
      {type == "fancy" ? (
        <dt>
          <h4>{sortbyTime ? "Yes/No" : secondType}</h4>
        </dt>
      ) : (
        <dt>
          <h4>
            {type == "Back" ? "Back" : type == "Lay" ? "Lay" : "Back/Lay"}
          </h4>
        </dt>
      )}
      <dd className="col-odds">
        <span>{type == "fancy" ? "Runs/Odds" : "Odds"}</span>
      </dd>
      <dd className="col-stake">
        <span>Stake</span>
      </dd>
      <dd className="col-profit">
        <span>
          {type == "Back"
            ? "Profit"
            : type == "Lay"
            ? "Liability"
            : "Profit/Liability"}
        </span>
      </dd>

      {type2 == "UnMatched" && <dd id="delete" class="col-delete"></dd>}
    </dl>
  );
};
const TableBody = ({ res, betinfo, helper, betType, type, clearBets }) => {
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
    handelPlaceBetfairUpdate,
  } = useContext(BetSlipContext);
  const [id, setId] = useState("");
  console.log(res.type == "No","ress")
  return (
    <>
      <dl
        class={
          betType == "Fancy"
            ? res.type == "Yes"
              ? "bets-back"
              : "bets-lay"
            : res.betType == "lay"
            ? "bets-lay"
            : "bets-back"
        }
        style={{ display: "flex" }}
      >
        <dt>
          {type == "UnMatched" ? (
            <a
              id="editBtn"
              class={
                betSelectionObj?.priceToogle &&
                betSelectionObj?.priceToogleType == "unMatched" &&
                betSelectionObj?.betType == "betFair" &&
                betSelectionObj.id == res.matchBetId
                  ? "a-edit select"
                  : "a-edit"
              }
              onClick={() => {
                setBetSelectionObj({
                  priceToogle: true,
                  bidPrice: res.amount ? res.amount : "",
                  // inputType: "",
                  betType: "betFair",
                  oddsSelect: res.bhav,
                  priceToogleType: "unMatched",
                  layorback: res.betType,
                  minAmount: 1,
                  maxAmount: 100,
                  minAmountText: false,
                  id: res.matchBetId,
                });
                setId(res.matchBetId);
              }}
              href="javascript:void(0)"
            >
              Edit
            </a>
          ) : (
            <span
              id="sideType"
              class={
                betType == "Fancy"
                  ? res.type == "Yes"
                    ? "back"
                    : "lay"
                  : res.betType == "lay"
                  ? "lay"
                  : "back"
              }
            >
              {betType == "Fancy"
                ? res.type == "Yes"
                  ? "Yes"
                  : "No"
                : res.betType == "lay"
                ? "Lay"
                : "Back"}
            </span>
          )}
          <h4 id="selectionName">
            {betType == "Fancy" ? res?.fancyName : res?.teamName}
          </h4>
        </dt>
        <dd id="odds" class="col-odds">
          {betType == "Fancy" ? (
            <span>
              {res.betRun}/{res.bhav}
            </span>
          ) : (
            <span>{res.bhav}</span>
          )}
        </dd>
        <dd id="stake" class="col-stake" title=" 100">
          <span> {res.amount}</span>
        </dd>
        <dd id="pl" class="col-profit">
          <span> {res?.betType == "lay" || res?.type == "No" ? res?.loseAmount :  res?.profitAmount}</span>
        </dd>
        {type == "UnMatched" && (
          <dd
            onClick={() => clearBets(res.matchBetId)}
            id="delete"
            class={"col-delete"}
          >
            <a href="javascript:void(0)" class="trashcan"></a>
          </dd>
        )}
        {betinfo && (
          <dd id="betInfo" class="col-ref">
            <ul>
              <li id="betId">Ref:{res.matchBetId}</li>
              <li id="placeDate">{helper.dateFormat(res.timeInserted)}</li>
            </ul>
          </dd>
        )}
      </dl>
      {betSelectionObj?.priceToogle &&
      betSelectionObj?.priceToogleType == "unMatched" &&
      betSelectionObj?.betType == "betFair" &&
      betSelectionObj.id == res.matchBetId ? (
        <UnMatchedKeyboard
          res={res}
          // setSelections={setSelections}
          // details={details}
          // selectedBet={selectedBet}
          // setSlipObj={setSlipObj}
          // resetSelection={resetSelection}
          // betType={betType}
          // handelPlaceBetfair={handelPlaceBetfair}
          // amountRange={amountRange}
        />
      ) : (
        ""
      )}
    </>
  );
};
const FancyListing = ({ sortbyTime, filtered, betinfo, helper }) => {
  // console.log(filtered,"=-==========")
  return (
    <>
      <h3 id="txnHeader" style={{ display: "flex" }}>
        Matched
      </h3>
      {sortbyTime ? (
        <div id="txnList" className="slip-list" style={{ display: "block" }}>
          <HeaderListing type="fancy" sortbyTime={sortbyTime} />
          {filtered?.map((res) => {
            return (
              <TableBody
                res={res}
                betinfo={betinfo}
                helper={helper}
                betType="Fancy"
              />
            );
          })}
        </div>
      ) : (
        <div id="txnList" className="slip-list" style={{ display: "block" }}>
          {filtered?.some((res) => res.type == "Yes") && (
            <>
              <HeaderListing
                type={"fancy"}
                sortbyTime={sortbyTime}
                secondType={"Yes"}
              />
              {filtered?.map((res) => {
                return (
                  res.type == "Yes" && (
                    <TableBody
                      res={res}
                      betinfo={betinfo}
                      helper={helper}
                      betType="Fancy"
                    />
                  )
                );
              })}
            </>
          )}
          {filtered?.some((res) => res.type == "No") && (
            <>
              <HeaderListing
                type="fancy"
                sortbyTime={sortbyTime}
                secondType={"No"}
              />
              {filtered?.map((res) => {
                return (
                  res.type == "No" && (
                    <TableBody
                      res={res}
                      betinfo={betinfo}
                      betType="Fancy"
                      helper={helper}
                    />
                  )
                );
              })}
            </>
          )}
        </div>
      )}
    </>
  );
};
const SportsBookListing = ({ sortbyTime, filtered, betinfo, helper }) => {
  console.log(filtered, "filtered");
  return (
    <>
      <h3 id="txnHeader" style={{ display: "flex" }}>
        Matched
      </h3>

      <div id="txnList" className="slip-list" style={{ display: "block" }}>
        <dl
          id={"header_back"}
          className="bets-head"
          style={{ display: "flex" }}
        >
          <dt>
            <h4>{"Back"}</h4>
          </dt>

          <dd className="col-odds">
            <span>{"Odds"}</span>
          </dd>
          <dd className="col-stake">
            <span>Stake</span>
          </dd>
          <dd className="col-profit">
            <span>{"Profit"}</span>
          </dd>
        </dl>
        {filtered?.map((res) => {
          return (
            <dl class={"bets-back"} style={{ display: "flex" }}>
              <dt>
                <span id="sideType" class={"back"}>
                  {"Back"}
                </span>
                <h4 id="selectionName">{res?.fancyName}</h4>
              </dt>
              <dd id="odds" class="col-odds">
                <span>{res.bhav}</span>
              </dd>
              <dd id="stake" class="col-stake" title=" 100">
                <span> {res.amount}</span>
              </dd>
              <dd id="pl" class="col-profit">
                <span> {res.profitAmount}</span>
              </dd>
              {betinfo && (
                <dd id="betInfo" class="col-ref">
                  <ul>
                    <li id="betId">Ref:{res.matchBetId}</li>
                    <li id="placeDate">
                      {helper.dateFormat(res.timeInserted)}
                    </li>
                  </ul>
                </dd>
              )}
            </dl>
          );
        })}
      </div>
    </>
  );
};

export { HeaderListing, TableBody, FancyListing, SportsBookListing };
