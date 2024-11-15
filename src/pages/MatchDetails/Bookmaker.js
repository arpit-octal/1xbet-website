import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import BetSlipContext from "../../context/BetSlipContext";
import BackandLay from "./BackandLay";
import EmptyOdds from "./EmptyOdds";
import Keyboard from "./Keyboard";

const Bookmaker = ({
  data,
  details,
  betType,
  back_odds,
  lay_odds,
  bookmakerObj,
  setSlipObj,
  slipObj,
  profileData,
  handelBookmakerPositions,
  resetSelection,
  user,
  messaageBox,
}) => {
  let {
    handelPlaceBetfair,
    setBetFairObj,
    betSelectionObj,
    setBetSelectionObj,
  } = useContext(BetSlipContext);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedBet, setSelectedBet] = useState({
    selectionId: "",
    teamName: "",
    check: "",
  });
  const [key, setKey] = useState("");
  const [amountRange, setAmountRange] = useState({
    min: 1,
    max: 100,
    oddsLimit: 0,
  });
  useEffect(() => {
    if (!isEmpty(user)) {
      let obj = profileData?.matchSetting?.find(
        (res) =>
          res?.type == betType &&
          (profileData?.arrayCheck == "details"
            ? true
            : res?.sportType == details?.gameType)
      );
      if (!isEmpty(obj)) {
        setAmountRange({
          ...obj,
          min: Number(obj?.minAmount),
          max: Number(obj?.maxAmount),
          oddsLimit: obj.oddsLimit ? obj.oddsLimit : 0,
        });
      }
    }
  }, []);
  // useEffect(() => {
  //   if (
  //     (betSelectionObj.betType == "bookmaker" && bookmakerObj?.ms == 9) ||
  //     bookmakerObj?.ms == 2 ||
  //     bookmakerObj?.ms == 3 ||
  //     bookmakerObj?.ms == 4
  //   ) {
  //     setBetSelectionObj({});
  //     setBetFairObj({});
  //     resetSelection("bookmaker");
  //   }
  // }, [bookmakerObj.ms]);
  // console.log('error 1', back_odds, lay_odds)
  return (
    <div id="bookMakerWrap">
      <div
        className={`bets-wrap bets-bookmaker ${details.bookMaker == "off"
          ? "disabled"
          : amountRange.oddsLimit == 0
            ? "disabled"
            : ""
          }`}
        style={{ display: "block" }}
      >
        <h4>
          <a id="multiMarketPin" className="pin-off" href="#">
            Pin to Multi Markets
          </a>
          <span>Bookmaker Market</span>
          <p>| Zero Commission</p>
          <a
            href="javascript:void(0)"
            onClick={() => setPopupMessage(true)}
            id="openBookMakerInfo"
            className="btn-fancy_info"
          ></a>
          {popupMessage && (
            <div
              id="bookMakerMinMax"
              style={{
                display: "flex",
                zIndex: 10,
              }}
              className="fancy_info-popup"
            >
              <dl>
                <dt>Min / Max</dt>
                <dd id="minMax">
                  {" "}
                  {amountRange?.min?.toFixed(2)} /{" "}
                  {amountRange?.max?.toFixed(2)}
                </dd>
              </dl>
              <dl>
                <dt id="rebateName" style={{ display: "none" }}>
                  Rebate
                </dt>
                <dd id="rebate" style={{ display: "none" }}></dd>
              </dl>
              <a
                href="javascript:void(0)"
                onClick={() => setPopupMessage(false)}
                id="closeBookMakerInfo"
                className="close"
              >
                Close
              </a>
            </div>
          )}
        </h4>
        <dl class="bets-selections-head">
          <dt></dt>
          <dd class="mode-land"></dd>
          <dd class="mode-land"></dd>
          <dd>Back</dd>
          <dd>Lay</dd>
          <dd class="mode-land"></dd>
          <dd class="mode-land"></dd>
        </dl>
        {data.map((res) => {
          const the_odds_back = back_odds;
          let filterOddsBack = the_odds_back
            ?.filter((todd) => todd.name == res.RunnerName)
            ?.sort((a, b) => {
              return a - b;
            });
          const the_odds_lay = lay_odds;
          const filterOddsLay = the_odds_lay
            ?.filter((todd) => todd.name == res.RunnerName)
            ?.sort((a, b) => {
              return a - b;
            });

          // console.log(filterOddsBack[0]?.ms, "filterOddsBack")
          // console.log(filterOddsLay, "filterOddsLay")
          return (
            <>
              <dl className="bets-selections" style={{ display: "flex" }}>
                <dt>
                  <h4 id="runnerName">{res.RunnerName}</h4>
                  <ul id="winLoss">
                    {Math.abs(res.position) != 0 &&
                      !isNaN(Math.abs(res.position)) && (
                        <li
                          id="withBet"
                          class={res.position <= 0 ? "lose" : "win"}
                          style={{ display: "list-item" }}
                        >
                          {parseFloat(Math.abs(res.position)).toFixed(2)}
                        </li>
                      )}

                    {Math.abs(res.newPosition) != 0 &&
                      !isNaN(Math.abs(res.newPosition)) && (
                        <li
                          id="withBet"
                          class={res.newPosition <= 0 ? "to-lose" : "to-win"}
                          style={{ display: "list-item" }}
                        >
                          ( {parseFloat(Math.abs(res.newPosition)).toFixed(2)})
                        </li>
                      )}
                  </ul>

                  {/* {Math.abs(res?.position) != 0 &&
                    !isNaN(Math.abs(res?.position)) && (
                      <ul>
                        <li
                          id="before"
                          class="win"
                          style={{ display: "none" }}
                        ></li>
                        <li
                          id="after"
                          className={res?.position <= 0 ? "to-lose" : "to-win"}
                        >
                          ( {Math.abs(res?.position)?.toFixed(2)})
                        </li>
                      </ul>
                    )} */}
                </dt>
                {/* {bookmakerObj?.rt !== 1 ? (
                  <>
                    <dd id="suspend" class="suspend-fancy">
                      <p id="info">
                        {bookmakerObj?.ms == 9
                          ? "Ball Running"
                          : bookmakerObj?.ms == 2
                          ? "In Active"
                          : bookmakerObj?.ms == 3
                          ? "Suspended"
                          : bookmakerObj?.ms == 4
                          ? "Closed"
                          : ""}
                      </p>
                    </dd>
                    <EmptyOdds />
                  </>
                ) : !the_odds_lay.map((item) =>
                    item.ri == res.selectionID ? true : false
                  )[0] ||
                  !the_odds_back.map((item) =>
                    item.ri == res.selectionID ? true : false
                  )[0] ? (
                  <>
                    <dd id="suspend" class="suspend-fancy">
                      <p id="info">Suspended</p>
                    </dd>
                    <EmptyOdds />
                  </>
                ) : ( */}
                {details?.sport_setting?.status == "inActive" ? (
                  <>
                    <dd id="suspend" class="suspend-fancy">
                      <p id="info">Suspended</p>
                    </dd>
                    <EmptyOdds />
                  </>
                ) : (
                  <>
                    {filterOddsBack[0]?.ms != 1 || filterOddsLay[0]?.ms != 1 ? (
                      <dd id="suspend" class="suspend-fancy">
                        <p id="info">
                          {filterOddsBack[0]?.ms == 9 || filterOddsLay[0]?.ms == 9
                            ? "Ball Running"
                            : filterOddsBack[0]?.ms == 2 || filterOddsLay[0]?.ms == 2
                              ? "In Active"
                              : filterOddsBack[0]?.ms == 3 || filterOddsLay[0]?.ms == 3
                                ? "Suspended"
                                : filterOddsBack[0]?.ms == 4 || filterOddsLay[0]?.ms == 4
                                  ? "Closed"
                                  : "Suspended"}
                        </p>
                      </dd>
                    ) : ""}

                    {isEmpty(bookmakerObj) ? (
                      <>
                        {/* <dd id="suspend" class="suspend-fancy">
                          <p id="info">Suspended</p>
                        </dd>
                        <EmptyOdds /> */}
                      </>
                    ) : (
                      <BackandLay
                        back={filterOddsBack || []}
                        lay={filterOddsLay || []}
                        setSelectedBet={setSelectedBet}
                        item={res}
                        setKey={setKey}
                        market={""}
                        messaageBox={messaageBox}
                        betmode={details.bookMaker}
                        setSlipObj={setSlipObj}
                        resetSelection={resetSelection}
                        details={details}
                        slipObj={slipObj}
                        handelBookmakerPositions={handelBookmakerPositions}
                        amountRange={amountRange}
                        // setCondi={setCondi}
                        // handelBetFairPositions={handelBetFairPositions}
                        // executeScroll={executeScroll}
                        betType={betType}
                      />
                    )}
                  </>
                )}
              </dl>
              {betSelectionObj?.priceToogle &&
                betSelectionObj?.priceToogleType == "odds" &&
                key == res.SelectionId &&
                betSelectionObj?.betType == "bookmaker" ? (
                <Keyboard
                  // tempSelection={tempSelection}
                  // setSelections={setSelections}
                  details={details}
                  betType={betType}
                  selectedBet={selectedBet}
                  setSlipObj={setSlipObj}
                  resetSelection={resetSelection}
                  // resetSelection={resetSelection}
                  handelPlaceBetfair={handelPlaceBetfair}
                  amountRange={amountRange}
                />
              ) : (
                ""
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Bookmaker;
