import React from "react";
import helper from "../Utils/helpers";
import { HeaderListing, TableBody } from "./BetsListing";
const OpenBetsDetails = ({
  filtered,
  type,
  sortbyTime,
  betinfo,
  betType,
  clearBets,
}) => {
  return (
    <>
      <h3 id="txnHeader" style={{ display: "flex" }}>
        {betType == "BetFair" ? type : "Matched"}
        {type == "UnMatched" && (
          <a
            id="cancelAll"
            href="javascript:void(0)"
            onClick={() => clearBets("")}
            class="trashcan"
          >
            Cancel All
          </a>
        )}
      </h3>
      {sortbyTime ? (
        <div id="txnList" className="slip-list" style={{ display: "block" }}>
          <HeaderListing type="" type2={type} />
          {filtered?.map((res) => {
            return (
              (type == "Matched" ? res.isMatched : !res.isMatched) && (
                <TableBody
                  res={res}
                  betinfo={betinfo}
                  helper={helper}
                  type={type}
                  clearBets={clearBets}
                />
              )
            );
          })}
        </div>
      ) : (
        <div id="txnList" className="slip-list" style={{ display: "block" }}>
          {filtered?.some(
            (res) =>
              res?.betType == "back" &&
              (type == "Matched" ? res?.isMatched : !res?.isMatched)
          ) && (
            <>
              <HeaderListing type={"Back"} type2={type} />
              {filtered?.map((res) => {
                return (
                  res.betType == "back" &&
                  (type == "Matched" ? res.isMatched : !res.isMatched) && (
                    <TableBody
                      res={res}
                      betinfo={betinfo}
                      helper={helper}
                      type={type}
                      clearBets={clearBets}
                    />
                  )
                );
              })}
            </>
          )}
          {filtered?.some(
            (res) =>
              res.betType == "lay" &&
              (type == "Matched" ? res.isMatched : !res.isMatched)
          ) && (
            <>
              <HeaderListing type="Lay" type2={type} />
              {filtered?.map((res) => {
                return (
                  res.betType == "lay" &&
                  (type == "Matched" ? res.isMatched : !res.isMatched) && (
                    <TableBody
                      res={res}
                      betinfo={betinfo}
                      helper={helper}
                      type={type}
                      clearBets={clearBets}
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

export default OpenBetsDetails;
