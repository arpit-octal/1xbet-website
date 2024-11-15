import { isEmpty } from "lodash";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useContext } from "react";
import BetSlipContext from "../../context/BetSlipContext";
import Keyboard from "./Keyboard";

const PremiumFancyLatest = ({
    betType,
    data,
    details,
    slipObj,
    setSlipObj,
    fancyCategory,
    setSelectedTabFunc,
    selectedTab,
    profileData,
    user,
    resetSelection,
    isTv,
    setIsTv,
    key,
    messaageBox,
    loader,
    fancyList
}) => {

    const myRef = useRef(null);
    const [id, setId] = useState("");
    const [id2, setId2] = useState("");
    const handleScroll = () => {
        setId("");
        setId2("");
    };
    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // useEffect(() => {
    //     if (!isEmpty(id)) {
    //         myRef.current.scrollIntoView(true);
    //     }
    // }, [id]);
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
    }, [data]);
    const [popupMessage, setPopupMessage] = useState({
        check: false,
        id: "",
    });

    let {
        betSelectionObj,
        setBetSelectionObj,
        setBetFairObj,
        defaultStake,
        defaultOdds,
        setBookPosition,
        setBookPositionData,
    } = useContext(BetSlipContext);
    // useEffect(() => {
    //     console.log('betSelectionObj?.betType == "sportBook"', betSelectionObj?.betType == "sportBook")
    //     console.log('id', id)
    //     console.log('isEmpty(data?.find((res) => res?.selectionId == id)?.odds)', isEmpty(data?.find((res) => res?.selectionId == id)?.odds))
    //     if (
    //         betSelectionObj?.betType == "sportBook" &&
    //         id &&
    //         isEmpty(data?.find((res) => res?.selectionId == id)?.odds)
    //     ) {
    //         setBetSelectionObj({});
    //         setBetFairObj({});
    //         setPopupMessage({ check: false, id: "" });
    //     }
    // }, [betSelectionObj, data]);
    return fancyList?.length > 0 ? (
        <>
            {/* <div
                id="fancyBetTabWrap"
                className="fancy_bet_tab-wrap ps ps--theme_default ps--active-x"
            >
                <ul className="special_bets-tab" style={{ overflowX: "scroll" }}>
                    {fancyCategory?.length > 0 &&
                        fancyCategory?.map((res) => {
                            return (
                                <li
                                    onClick={() => { localStorage.setItem("catType", res?.type); setSelectedTabFunc(res.type) }}
                                    className={selectedTab == res.type ? "select" : ""}
                                >
                                    <a href="javascript:void(0)">{res.name}</a>
                                </li>
                            );
                        })}
                </ul>
            </div> */}
            <div id="fancyBetTag">
                <div className="bets-wrap fancy-bet" style={{ display: "none" }}>
                    <dl className="bets-selections">
                        <dt className="line_market-selection">
                            <dl className="tips">
                                <dt>
                                    <span
                                        id="before"
                                        className="win"
                                        style={{ display: "none" }}
                                    ></span>
                                    <span
                                        id="after"
                                        className="to-lose"
                                        style={{ display: "none" }}
                                    ></span>
                                </dt>
                                <dd id="remarkFirstRow" style={{ display: "none" }}></dd>
                                <dd id="remarkSecondRow" style={{ display: "none" }}></dd>
                            </dl>
                            <a
                                id="fancyBetBookBtn"
                                href="#"
                                className="btn-book"
                                style={{ display: "none" }}
                            >
                                Book
                            </a>
                        </dt>
                        <dd id="suspend" className="suspend" style={{ display: "flex" }}>
                            <p id="info">Closed</p>
                        </dd>
                        <dd
                            id="delayBetting"
                            className="suspend-fancy"
                            style={{ display: "none" }}
                        >
                            <p id="info"></p>
                        </dd>
                        <dd id="lay_1">
                            <a className="lay-1" href="#">
                                71<span>250</span>
                            </a>
                        </dd>
                        <dd id="back_1">
                            <a className="back-1" href="#">
                                71<span>150</span>
                            </a>
                        </dd>
                        <dd className="mode-land"></dd>
                        <dd className="mode-land"></dd>
                    </dl>
                </div>
                {data?.length > 0 && (
                    <dl class="bets-selections-head" style={{ background: "#fff" }}>
                        <dt></dt>
                        <dd class="mode-land"></dd>
                        <dd class="mode-land"></dd>
                        <dd style={{ color: "black" }}>No</dd>
                        <dd style={{ color: "black" }}>Yes</dd>
                        <dd class="mode-land"></dd>
                        <dd class="mode-land"></dd>
                    </dl>
                )}
                {data?.length > 0 &&
                    data?.map((item, index) => {
                        return <>
                            <div key={index}
                                // ref={runner?.selectionId == id && index == id2 ? myRef : null}
                                className={`bets-wrap fancy-bet ${details?.premiumFancy == "off" ? "disabled" : ""
                                    }`}
                            >
                                <h5>
                                    <span id="marketName">{item?.fancyName}</span>
                                    <a
                                        href="javascript:void(0)"
                                        onClick={() =>
                                            setPopupMessage({
                                                check: true,
                                                id: item.marketId,
                                            })
                                        }
                                        id="open-fancy_info"
                                        className="btn-fancy_info"
                                    >
                                        fancybet info
                                    </a>
                                    {popupMessage.check &&
                                        item.marketId == popupMessage.id && (
                                            <div
                                                id="fancy_popup2"
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
                                                        {item?.min} /{" "}
                                                        {item?.max}
                                                    </dd>
                                                </dl>
                                                <dl>
                                                    <dt id="rebateName" style={{ display: "none" }}>
                                                        Rebet
                                                    </dt>
                                                    <dd id="rebate" style={{ display: "none" }}></dd>
                                                </dl>
                                                <a
                                                    href="javascript:void(0)"
                                                    onClick={() =>
                                                        setPopupMessage({
                                                            check: false,
                                                            id: "",
                                                        })
                                                    }
                                                    id="close-fancy_info"
                                                    className="close"
                                                >
                                                    Close
                                                </a>
                                            </div>
                                        )}
                                </h5>


                            </div>
                            {item?.runners?.length > 0 && item?.runners?.map((runner) => {
                                if (
                                    runner?.ms == 4 ||
                                    runner?.rt?.length == 0 ||
                                    runner?.ms == 2 ||
                                    isEmpty(runner?.rt)
                                ) {

                                    return null;
                                } else {

                                    return (
                                        <>
                                            <dl className="bets-selections">

                                                <dt class="line_market-selection">{runner?.runnerName}
                                                    <dl class="tips">
                                                        <dt>
                                                            {(item?.position != "" || item?.position === 0) && !isNaN(Math.abs(item?.position)) && (
                                                                <span
                                                                    id="before"
                                                                    style={{ marginRight: "5px" }}
                                                                    class="lose"
                                                                >
                                                                    ({Math.abs(item?.position)})
                                                                </span>
                                                            )}

                                                            {!isEmpty(item?.newPosition) &&
                                                                !isNaN(Math.abs(item.newPosition)) &&
                                                                betSelectionObj?.priceToogle &&
                                                                betSelectionObj?.betType == "sportBook" &&
                                                                slipObj.ri == item.selectionId && (
                                                                    <span
                                                                        id="after"
                                                                        class="to-lose"
                                                                        style={{ display: "block" }}
                                                                    >
                                                                        ({Math.abs(item?.newPosition)})
                                                                    </span>
                                                                )}
                                                        </dt>
                                                    </dl>
                                                    {(item?.position != "" || item?.position === 0) && !isNaN(Math.abs(item?.position)) && (
                                                        <a
                                                            id="fancyBetBookBtn"
                                                            href="javascript:void(0)"
                                                            className="btn-book"
                                                            onClick={() => {
                                                                setBookPosition(true);
                                                                setBookPositionData(item);
                                                            }}
                                                        >
                                                            Book
                                                        </a>
                                                    )}
                                                </dt>

                                                {runner?.ms == 1 ? (
                                                    ""
                                                ) : (
                                                    <dd
                                                        id="suspend"
                                                        className="suspend-fancy"
                                                        style={{ display: "flex" }}
                                                    >
                                                        <p id="info">
                                                            {runner?.ms == 9
                                                                ? "Ball Running"
                                                                : runner?.ms == 2
                                                                    ? "In Active"
                                                                    : runner?.ms == 3
                                                                        ? "Suspended"
                                                                        : runner?.ms == 4
                                                                            ? "Closed"
                                                                            : ""}
                                                        </p>
                                                    </dd>
                                                )}
                                                {loader &&
                                                    betSelectionObj?.betType == "sportBook" &&
                                                    slipObj.ri == runner.selectionId ? (
                                                    <dd id="delayBetting" class="suspend-fancy">
                                                        <p id="info"></p>
                                                    </dd>
                                                ) : (
                                                    ""
                                                )}
                                                <dd
                                                    id="lay_1"
                                                    onClick={() => {
                                                        if (
                                                            !runner?.rt[0]?.rt ||
                                                            details.fancy == "off" ||
                                                            details?.sport_setting?.status == "inActive"
                                                        ) {
                                                        } else {
                                                            if (!messaageBox) {
                                                                if (betSelectionObj.betType !== betType) {
                                                                    resetSelection(betSelectionObj.betType);
                                                                }
                                                                setId(runner.selectionId);
                                                                setId2(index);
                                                                setBetSelectionObj({
                                                                    ...betSelectionObj,
                                                                    betType: betType,
                                                                    oddsSelect: runner?.rt[0]?.rt,
                                                                    fancyOddSelect: runner?.rt[0]?.pt,
                                                                    layorback: "lay",
                                                                    inputType: "price",
                                                                    expectany: defaultOdds,
                                                                    bidPrice: defaultStake == 0 ? "" : defaultStake,
                                                                    priceToogle: true,
                                                                    priceToogleType: "odds",
                                                                    minAmount: amountRange.min,
                                                                    maxAmount: amountRange.max,
                                                                });

                                                                setSlipObj({
                                                                    ...item,
                                                                    ...runner?.rt[0],
                                                                    rt: runner?.rt[0]?.rt,
                                                                    pt: runner?.rt[0]?.pt,
                                                                    runnerName: runner?.runnerName,
                                                                    marketId: runner?.marketId
                                                                });
                                                            }
                                                        }
                                                    }}
                                                    style={
                                                        !runner?.rt[0]?.rt || details?.fancy == "off"
                                                            ? { cursor: "not-allowed" }
                                                            : { cursor: "pointer" }
                                                    }
                                                    className={
                                                        !runner?.rt[0]?.rt ||
                                                            details?.fancy == "off" ||
                                                            details?.sport_setting?.status == "inActive"
                                                            ? "single-disabled"
                                                            : ""
                                                    }
                                                >
                                                    <a
                                                        className={
                                                            runner?.rt[0]?.rt == slipObj?.rt &&
                                                                runner?.rt[0]?.pt == slipObj?.pt &&
                                                                slipObj.marketId == runner.marketId &&
                                                                slipObj.ri == item.selectionId &&
                                                                betSelectionObj?.priceToogle
                                                                ? `lay-1 select ${Number(
                                                                    document.getElementById("odds1")?.name
                                                                ) !== runner?.rt[0]?.rt && "spark"
                                                                }`
                                                                : `lay-1 ${Number(
                                                                    document.getElementById("odds1")?.name
                                                                ) !== runner?.rt[0]?.rt && "spark"
                                                                }`
                                                        }
                                                        id={"odds1"}
                                                        name={runner?.rt[0]?.rt}
                                                        href="javascript:void(0)"
                                                    >
                                                        {runner?.rt?.length > 0
                                                            ? runner?.rt[0]?.rt
                                                            : !isEmpty(runner?.temp) &&
                                                            runner?.temp[0]?.rt}
                                                        {/* <span>
                                                            {runner?.rt?.length > 0
                                                                ? runner?.rt[0]?.pt
                                                                : !isEmpty(runner?.temp) &&
                                                                runner?.temp[0]?.pt}
                                                        </span> */}
                                                    </a>
                                                </dd>
                                                <dd
                                                    id="back"
                                                    onClick={() => {
                                                        if (
                                                            !runner?.rt[1]?.rt ||
                                                            details?.fancy == "off" ||
                                                            details?.sport_setting?.status == "inActive"
                                                        ) {
                                                        } else {
                                                            if (!messaageBox) {
                                                                if (betSelectionObj.betType !== betType) {
                                                                    resetSelection(betSelectionObj.betType);
                                                                }
                                                                setId(runner.selectionId);
                                                                setId2(index);
                                                                setBetSelectionObj({
                                                                    ...betSelectionObj,
                                                                    betType: betType,
                                                                    oddsSelect: runner?.rt[1]?.rt,
                                                                    layorback: "back",
                                                                    inputType: "price",
                                                                    bidPrice: defaultStake == 0 ? "" : defaultStake,
                                                                    fancyOddSelect: runner?.rt[1]?.pt,
                                                                    priceToogle: true,
                                                                    priceToogleType: "odds",
                                                                    minAmount: amountRange.min,
                                                                    expectany: defaultOdds,
                                                                    maxAmount: amountRange.max,
                                                                });
                                                                setSlipObj({
                                                                    ...item,
                                                                    ...runner?.rt[1],
                                                                    rt: runner?.rt[1]?.rt,
                                                                    pt: runner?.rt[1]?.pt,
                                                                    runnerName: runner?.runnerName,
                                                                    marketId: runner?.marketId
                                                                });
                                                            }
                                                        }
                                                    }}
                                                    style={
                                                        !runner?.rt[1]?.rt ||
                                                            details?.fancy == "off" ||
                                                            details?.sport_setting?.status == "inActive"
                                                            ? { cursor: "not-allowed" }
                                                            : { cursor: "pointer" }
                                                    }
                                                    className={
                                                        !runner?.rt[1]?.rt ||
                                                            details?.fancy == "off" ||
                                                            details?.sport_setting?.status == "inActive"
                                                            ? "single-disabled"
                                                            : ""
                                                    }
                                                >
                                                    <a
                                                        className={
                                                            runner?.rt[1]?.rt == slipObj?.rt &&
                                                                slipObj.marketId == runner.marketId &&
                                                                runner?.rt[1]?.pt == slipObj?.pt &&
                                                                slipObj.ri == runner.selectionId &&
                                                                betSelectionObj?.layorback == "back" &&
                                                                betSelectionObj?.priceToogle
                                                                ? `back-1 select ${Number(
                                                                    document.getElementById("odds2")?.name
                                                                ) !== runner?.rt[1]?.rt && "spark"
                                                                }`
                                                                : `back-1 ${Number(
                                                                    document.getElementById("odds2")?.name
                                                                ) !== runner?.rt[1]?.rt && "spark"
                                                                }`
                                                        }
                                                        id={"odds2"}
                                                        name={runner?.rt[1]?.rt}
                                                        href="javascript:void(0)"
                                                    >
                                                        {runner?.rt?.length > 0
                                                            ? runner?.rt[1]?.rt
                                                            : !isEmpty(runner?.temp) &&
                                                            runner?.temp[1]?.rt}
                                                        {/* <span>
                                                            {runner?.rt?.length > 0
                                                                ? runner?.rt[1]?.pt
                                                                : !isEmpty(runner?.temp) &&
                                                                runner?.temp[1]?.pt}
                                                        </span> */}
                                                    </a>
                                                </dd>
                                            </dl>
                                            {betSelectionObj?.priceToogle &&
                                                betSelectionObj?.betType == "sportBook" &&
                                                slipObj.marketId == runner.marketId && (
                                                    <Keyboard
                                                        setSlipObj={setSlipObj}
                                                        details={details}
                                                        slipObj={slipObj}
                                                        amountRange={amountRange}
                                                        betType={betType}
                                                        resetSelection={resetSelection}
                                                    />
                                                )}
                                        </>
                                    );
                                }
                            })
                            }
                        </>

                    })}
                {isEmpty(data) && (
                    <div id="noGameWrap" class="bets-wrap">
                        <p class="no-game">No Premium Fancy Found</p>
                    </div>
                )}
            </div >
        </>
    ) : (
        <div id="noGameWrap" class="bets-wrap">
            <p class="no-game">Coming Soon...</p>
        </div>
    );
};

export default PremiumFancyLatest;
