import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Form, Table, Button } from "react-bootstrap";
import moment from "moment";
import helpers from "../../Utils/helpers";
import obj, { headerData } from "../../Utils/constants";
// import transparentGif from "../../assets/images/transparent.gif";
import { toast } from "wc-toast";
import { apiGet } from "../../Utils/apiFetch";
import apiPath from "../../Utils/apiPath";
import ReactPaginate from "react-paginate";
import AuthContext from "../../context/AuthContext";

const ProfitLossHistory = ({
    title,
    filter,
    setFilter,
    data,
    getData,
    betType,
    viewpage,
    handlePageClick,
    pageCount,
}) => {
    let { user } = useContext(AuthContext);
    const showDetail = (event, id) => {
        const detailDiv = document.getElementById(id);

        if (detailDiv.style.display === "none") {
            detailDiv.style.setProperty("display", "contents");
            event.target.className = "fas fa-minus-square pe-2";
        } else {
            detailDiv.style.setProperty("display", "none");
            event.target.className = "fas fa-plus-square pe-2";
        }
    };
    let { loginUserDetailData } = useContext(AuthContext);
    const [getProperty, setProperty] = useState("none");
    const showDetail1 = (event, id) => {
        const detailDiv = document.getElementById(id);

        if (detailDiv.style.display === "none") {
            detailDiv.style.setProperty("display", "contents");
            event.target.className = "fas fa-minus-square pe-2";
        } else {
            detailDiv.style.setProperty("display", "none");
            event.target.className = "fas fa-plus-square pe-2";
        }
    };
    const redirectCasino = async (userId, platform, platformTxId, type) => {
        const { status, data: response_users } = await apiGet(
            apiPath.casinoWalletHistory +
            "?userId=" +
            userId +
            "&platform=" +
            platform +
            "&platformTxId=" +
            platformTxId
        );
        //console.log(response_users, status);
        if (status === 200) {
            if (response_users.status) {
                if (response_users.data?.status === "0000") {
                    if (type === 1) {
                        javascript: window.open(
                            response_users.data?.txnUrl,
                            "_blank",
                            "height=900,width=1200"
                        );
                    } else {
                        javascript: window.open(
                            response_users.data?.url,
                            "_blank",
                            "height=900,width=1200"
                        );
                    }
                } else {
                    toast.error(response_users.data.desc);
                }
            } else {
                toast.error(response_users.data.desc);
            }
        } else {
            toast.error(response_users.data.desc);
        }
    };
    console.log(loginUserDetailData, "-----------");
    return (
        <div className="common-container">
            <Form className="bet_status mb-3">
                <Row>
                    <Col xl={11} md={12}>
                        <Row>
                            <Col xl={11} md={12}>
                                <Row className="align-items-center">
                                    {/* {title == "Exchange" && (
                    <Col xxl={3} lg={3} md={8} className="mb-lg-0 mb-3">
                      <div className="bet-sec d-flex align-items-center">
                        <Form.Label className="mb-0">Bet Status:</Form.Label>
                        <Form.Select
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              status: e.target.value,
                            })
                          }
                          value={filter.status}
                          aria-label="Default select example"
                        >
                          <option value="">All</option>
                          <option value="unMatched">UnMatched</option>
                          <option value="Matched">Matched</option>
                        </Form.Select>
                      </div>
                    </Col>
                  )} */}
                                    <Col xxl={3} lg={4} md={6} sm={6}>
                                        <div className="d-flex align-items-center betting-time-zone">
                                            <Form.Label className="mb-0 pe-3">Period</Form.Label>
                                            <div className="d-flex align-items-center">
                                                <Form.Control
                                                    type="date"
                                                    onChange={(e) =>
                                                        setFilter({
                                                            ...filter,
                                                            fromPeriod: e.target.value,
                                                            filterByDay: "",
                                                        })
                                                    }
                                                    max={new Date().toISOString().split("T")[0]}
                                                    value={filter.fromPeriod}
                                                />
                                                <Form.Control
                                                    className="small_form_control"
                                                    type="text"
                                                    placeholder="09:00"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                    <Col xxl={3} lg={4} md={6} sm={6}>
                                        <div className="d-flex align-items-center betting-time-zone">
                                            <Form.Label className="mb-0 pe-3">to</Form.Label>

                                            <div className="d-flex align-items-center">
                                                <Form.Control
                                                    type="date"
                                                    onChange={(e) =>
                                                        setFilter({
                                                            ...filter,
                                                            toPeriod: e.target.value,
                                                            filterByDay: "",
                                                        })
                                                    }
                                                    min={
                                                        filter?.fromPeriod
                                                            ? new Date(filter?.fromPeriod)
                                                                .toISOString()
                                                                .split("T")[0]
                                                            : new Date()
                                                    }
                                                    max={new Date().toISOString().split("T")[0]}
                                                    value={filter.toPeriod}
                                                />
                                                <Form.Control
                                                    className="small_form_control"
                                                    type="text"
                                                    placeholder="08:59"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="input-list-data profile-data">
                            <ul className="input-list">
                                <li>
                                    <a
                                        onClick={(e) =>
                                            setFilter({
                                                ...filter,
                                                filterByDay: "today",
                                            })
                                        }
                                        style={{
                                            background: filter.filterByDay === "today" ? "green" : "",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Just For Today
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={(e) =>
                                            setFilter({
                                                ...filter,
                                                filterByDay: "yesterday",
                                            })
                                        }
                                        style={{
                                            background:
                                                filter.filterByDay === "yesterday" ? "green" : "",
                                            cursor: "pointer",
                                        }}
                                    >
                                        From Yesterday
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={getData}
                                        style={{ cursor: "pointer" }}
                                        className="btn-send"
                                    >
                                        Get P & L
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => {
                                            setFilter({
                                                betType:
                                                    title === "Exchange"
                                                        ? "betfair"
                                                        : title === "FancyBet"
                                                            ? "fancy"
                                                            : title === "Fancy1Bet"
                                                                ? "sportBook"
                                                                : title === "BookMaker"
                                                                    ? "bookmaker"
                                                                    : "casino",
                                                status: "",
                                                toPeriod: "",
                                                fromPeriod: "",
                                                filterByDay: "",
                                            });
                                            getData("reset");
                                        }}
                                        className="btn-send"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Reset
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Form>
            <section className="account-table my-bet-sec">
                <div className="profile-tab">
                    <div className="my_account_table_wrap">
                        {/* <h5>Matched</h5> */}
                        <div className="table-main-wrapper">
                            {/* <Table className="table_caption_style">
                <thead>
                  <tr>
                    {headerData.map((res) => {
                      return (
                        <th scope="col" className={res.class} width={res.widht}>
                          {res.title}
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {data && data?.length > 0 ? (
                    data?.map((item) => {
                      return (
                        <tr>
                          <td className="text-start" width="30%">
                            {item?.matchName || "N/A"}
                          </td>
                          <td className="text-end">
                            {obj?.betCheckObj[item?.eventType]}
                          </td>
                          <td className="text-end">
                            {" "}
                            {item?.selectionId || "N/A"}
                          </td>
                          <td className="text-end">
                            {" "}
                            {title === "FancyBet"
                              ? item?.betRun
                              : item?.betType}
                          </td>
                          <td className="text-end">
                            {" "}
                            {title === "FancyBet"
                              ? item?.sessionBetId
                              : item?.matchBetId}
                          </td>
                          <td className="text-end"> {item?.amount || "N/A"}</td>
                          <td className="text-end"> {item?.bhav || "N/A"}</td>
                          <td className="text-end">{"N/A"}</td>
                          <td className="text-end"> {item?.bhav || "N/A"} </td>
                          <td>
                            {" "}
                            {moment(item?.timeInserted).format(
                              "YYYY-MM-DD, h:mm:ss"
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-start">
                        <span>You have no bets in this time period.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table> */}

                            <div id="report" data-report="profitAndLossReport">
                                <ul id="spotsUl" className="total-show">
                                    {/* <li id="totalPL">
                    Total P/L: IR
                    <span className="red">(24.12)</span>
                  </li>
                  <li id="sumOfQuery" className="sports-switch">
                    IR <span className="red">(24.12)</span>
                  </li> */}
                                    {/* <li className="sports-switch">
                    <select name="sports" id="sports">
                      <option value="0">ALL</option>
                      <option value="4">CRICKET</option>
                    </select>
                  </li> */}
                                </ul>

                                <div className="profit_loss_table">
                                    {title === "casino" ? (
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th scope="col">Market</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Profit / Loss</th>
                                                </tr>
                                            </thead>
                                            {data?.data && data?.data?.length > 0 ? (
                                                data?.data?.map((item, index) => {
                                                    // const resultTotalStake = item?.bets_list.reduce((a, v) => {
                                                    //   a = parseInt(a) + parseInt(v.amount);
                                                    //   return a;
                                                    // }, 0);

                                                    return (
                                                        <>
                                                            <tr
                                                                id="summary0"
                                                                style={{ display: "table-row" }}
                                                                key={index + 1}
                                                            >
                                                                <td id="title" className="align-L">
                                                                    Casino
                                                                    <span className="angle_unicode">▸</span>
                                                                    <strong> {item?.gameDetails?.game_name}</strong>
                                                                    <span className="angle_unicode">▸</span>
                                                                    {helpers.dateFormat(item.createdAt, user?.user?.timeZone)}
                                                                </td>
                                                                <td>{item.status == 'result' ? "Settled" : item.status == 'rollback' ? 'Rollback' : "In Settlement"}</td>
                                                                <td>
                                                                {Math.sign(item?.profitLossAmount) < 0 ? (
                                                                            <span className="text-danger">
                                                                                ({helpers.currencyFormat(item?.profitLossAmount)})
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-success">
                                                                                (
                                                                                {helpers.currencyFormat(
                                                                                    Math.abs(item?.profitLossAmount)
                                                                                )}
                                                                                )
                                                                            </span>
                                                                        )}
                                                                    <i
                                                                        id={"icon_" + item?.platformTxId}
                                                                        class="fas fa-plus-square"
                                                                        onClick={(e) =>
                                                                            showDetail1(e, item?.platformTxId)
                                                                        }
                                                                    ></i>
                                                                </td>
                                                            </tr>

                                                            <tr
                                                                className="expand"
                                                                id={item?.platformTxId}
                                                                style={{ display: getProperty }}
                                                            >
                                                                <td colSpan="7" className="expand_wrap">
                                                                    <table className="table-commission">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th>Platform</th>
                                                                                <th>Valid Turnover</th>
                                                                                <th>Win/Loss</th>
                                                                                <th>PT/Comm.</th>
                                                                                <th>Profit / Loss</th>
                                                                                <th>Action</th>
                                                                            </tr>
                                                                            <tr
                                                                                id="txRow0"
                                                                                style={{ display: "table-row" }}
                                                                                className="even"
                                                                            >
                                                                                <td id="betID">
                                                                                    <Button
                                                                                        className="theme_dark_btn"
                                                                                        onClick={() =>
                                                                                            redirectCasino(
                                                                                                item?.clientName,
                                                                                                item?.platform,
                                                                                                item?.platformTxId,
                                                                                                1
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {item.platform}
                                                                                    </Button>
                                                                                </td>
                                                                                <td>0.00</td>
                                                                                <td>{item?.playerPL}</td>
                                                                                <td>0.00</td>
                                                                                <td>{item?.playerPL}</td>
                                                                                <td>
                                                                                    <Button
                                                                                        className="theme_dark_btn"
                                                                                        onClick={() =>
                                                                                            redirectCasino(
                                                                                                item?.clientName,
                                                                                                item?.platform,
                                                                                                item?.platformTxId,
                                                                                                2
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Get Result
                                                                                    </Button>
                                                                                </td>
                                                                            </tr>
                                                                            <tr class="casino-grand-total">
                                                                                <td>Grand Total</td>
                                                                                <td id="totalTurnover">0.00</td>
                                                                                <td id="totalPayout">
                                                                                    {item?.playerPL}
                                                                                </td>
                                                                                <td id="totalTaxRebate">0.00</td>
                                                                                <td id="totalBalance">
                                                                                    {item?.playerPL}
                                                                                </td>
                                                                                <td></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={10}>
                                                        <span>You have no bets in this time period.</span>
                                                    </td>
                                                </tr>
                                            )}
                                        </Table>
                                    ) : (
                                        <table
                                            id="reportTable"
                                            className="table01 table-pnl"
                                            style={{ display: `table` }}
                                        >
                                            <tbody>
                                                <tr>
                                                    <th width="" className="align-L">
                                                        Market
                                                    </th>
                                                    <th width="15%">Start Time</th>
                                                    <th width="15%">Settled date</th>
                                                    <th width="18%">Profit/Loss</th>
                                                </tr>
                                                {data?.data && data?.data?.length > 0 ? (
                                                    data?.data?.map((item, index) => {
                                                        // console.log(item.eventName == "Islamabad United v Lahore Qalandars" ,"temp")
                                                        const resultTotalStake = item?.bets_list?.reduce(
                                                            (a, v) => {
                                                                a = parseInt(a) + parseInt(v.amount);
                                                                return a;
                                                            },
                                                            0
                                                        );
                                                        const backTotalProfitAmount =
                                                            item?.bets_list?.reduce((a, v) => {
                                                                if (
                                                                    v?.betType === "back" &&
                                                                    v?.teamSelectionWin === v?.selectionId
                                                                ) {
                                                                    a = parseInt(a) + parseInt(v.profitAmount);
                                                                }
                                                                return a;
                                                            }, 0);
                                                        const backTotalLoseAmount = item?.bets_list?.reduce(
                                                            (a, v) => {
                                                                if (
                                                                    v?.betType === "back" &&
                                                                    v?.teamSelectionWin !== v?.selectionId
                                                                ) {
                                                                    a = parseInt(a) + parseInt(v.loseAmount);
                                                                }
                                                                return a;
                                                            },
                                                            0
                                                        );
                                                        let backSubTotalresult =
                                                            backTotalProfitAmount > backTotalLoseAmount
                                                                ? backTotalProfitAmount - backTotalLoseAmount
                                                                : -(
                                                                    backTotalLoseAmount - backTotalProfitAmount
                                                                );
                                                        const layTotalProfitAmount =
                                                            item?.bets_list?.reduce((a, v) => {
                                                                if (
                                                                    v?.betType === "lay" &&
                                                                    v?.teamSelectionWin !== v?.selectionId
                                                                ) {
                                                                    a = parseInt(a) + parseInt(v.profitAmount);
                                                                }
                                                                return a;
                                                            }, 0);
                                                        const layTotalLoseAmount = item?.bets_list?.reduce(
                                                            (a, v) => {
                                                                if (
                                                                    v?.betType === "lay" &&
                                                                    v?.teamSelectionWin === v?.selectionId
                                                                ) {
                                                                    a = parseInt(a) + parseInt(v.loseAmount);
                                                                }
                                                                return a;
                                                            },
                                                            0
                                                        );
                                                        let laySubTotalresult =
                                                            layTotalProfitAmount > layTotalLoseAmount
                                                                ? layTotalProfitAmount - layTotalLoseAmount
                                                                : -(layTotalLoseAmount - layTotalProfitAmount);

                                                        let marketSubTotal =
                                                            backSubTotalresult + laySubTotalresult;
                                                        const yesTotalProfitAmount =
                                                            item?.bets_list?.reduce((a, v) => {
                                                                if (
                                                                    v?.type == "Yes" &&
                                                                    v?.decisionRun >= v?.betRun
                                                                ) {
                                                                    a = parseInt(a) + parseInt(v.profitAmount);
                                                                }
                                                                return a;
                                                            }, 0);
                                                        const yesTotalLoseAmount = item?.bets_list?.reduce(
                                                            (a, v) => {
                                                                if (
                                                                    v?.type == "Yes" &&
                                                                    v?.decisionRun < v?.betRun
                                                                ) {
                                                                    a = parseInt(a) + parseInt(v.loseAmount);
                                                                }
                                                                return a;
                                                            },
                                                            0
                                                        );
                                                        let yesSubTotalresult =
                                                            yesTotalProfitAmount > yesTotalLoseAmount
                                                                ? yesTotalProfitAmount - yesTotalLoseAmount
                                                                : -(yesTotalLoseAmount - yesTotalProfitAmount);
                                                        const noTotalProfitAmount = item?.bets_list?.reduce(
                                                            (a, v) => {
                                                                if (
                                                                    v?.type == "No" &&
                                                                    v?.decisionRun < v?.betRun
                                                                ) {
                                                                    a = parseInt(a) + parseInt(v.profitAmount);
                                                                }
                                                                return a;
                                                            },
                                                            0
                                                        );
                                                        const noTotalLoseAmount = item?.bets_list?.reduce(
                                                            (a, v) => {
                                                                if (
                                                                    v?.type == "No" &&
                                                                    v?.decisionRun >= v?.betRun
                                                                ) {
                                                                    a = parseInt(a) + parseInt(v.loseAmount);
                                                                }
                                                                return a;
                                                            },
                                                            0
                                                        );
                                                        let noSubTotalresult =
                                                            noTotalProfitAmount > noTotalLoseAmount
                                                                ? noTotalProfitAmount - noTotalLoseAmount
                                                                : -(noTotalLoseAmount - noTotalProfitAmount);
                                                        const resultCommission = item?.bets_list?.reduce(
                                                            (a, v) => {
                                                                a =
                                                                    parseInt(a) +
                                                                    parseInt(v.commission ? v.commission : 0);
                                                                return a;
                                                            },
                                                            0
                                                        );

                                                        let fancyMarketSubTotal =
                                                            yesSubTotalresult + noSubTotalresult;

                                                        let fancyNetAmount =
                                                            fancyMarketSubTotal -
                                                            (fancyMarketSubTotal *
                                                                loginUserDetailData?.commission || 0) /
                                                            100;
                                                        let netAmount =
                                                            marketSubTotal -
                                                            (marketSubTotal *
                                                                loginUserDetailData?.commission || 0) /
                                                            100;
                                                        return (
                                                            <>
                                                                <tr
                                                                    id="summary0"
                                                                    style={{ display: "table-row" }}
                                                                    key={index + 1}
                                                                >
                                                                    <td id="title" className="align-L">
                                                                        {item?.gameType}
                                                                        <span className="angle_unicode">▸</span>
                                                                        <strong> {item?.eventName}</strong>
                                                                        <span className="angle_unicode">▸</span>
                                                                        Match Odds
                                                                    </td>
                                                                    <td id="startTime"> {helpers.dateFormat(item?.eventDateTime, user?.user?.timeZone)}</td>
                                                                    <td id="settledDate">
                                                                        {" "}
                                                                        {helpers.dateFormat(item?.eventDateTime, user?.user?.timeZone)}
                                                                    </td>
                                                                    <td>
                                                                        <a
                                                                            id="pl0"
                                                                            className="expand-open"
                                                                            href="#"
                                                                        >
                                                                            {betType == "fancy" ? (
                                                                                fancyNetAmount > 0 ? (
                                                                                    Math.abs(fancyNetAmount)
                                                                                ) : (
                                                                                    <span className="red">
                                                                                        (-{Math.abs(fancyNetAmount)})
                                                                                    </span>
                                                                                )
                                                                            ) : netAmount > 0 ? (
                                                                                netAmount
                                                                            ) : (
                                                                                <span className="red">
                                                                                    (-{Math.abs(netAmount)})
                                                                                </span>
                                                                            )}
                                                                        </a>
                                                                        <i
                                                                            id={"icon_" + item?._id}
                                                                            className="fas fa-plus-square"
                                                                            onClick={(e) => showDetail(e, item?._id)}
                                                                        ></i>
                                                                    </td>
                                                                </tr>
                                                                {item?.bets_list?.length > 0 && (
                                                                    <tr
                                                                        className="expand"
                                                                        id={item?._id}
                                                                        style={{ display: getProperty }}
                                                                        key={item?._id}
                                                                    >
                                                                        <td colSpan="4" className="expand_wrap">
                                                                            <table className="table-commission">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th width="9%">Bet ID</th>
                                                                                        <th width="">Selection</th>
                                                                                        <th width="9%">Odds</th>
                                                                                        <th width="13%">Stake</th>
                                                                                        <th width="8%">Type</th>
                                                                                        <th width="16%">Placed</th>
                                                                                        <th width="23%">Profit/Loss</th>
                                                                                    </tr>
                                                                                    {item?.bets_list?.map(
                                                                                        (betData, i) => {
                                                                                            return (
                                                                                                <tr
                                                                                                    id="txRow0"
                                                                                                    style={{
                                                                                                        display: "table-row",
                                                                                                    }}
                                                                                                    className="even"
                                                                                                    key={i + 1}
                                                                                                >
                                                                                                    <td id="betID">
                                                                                                        {betType == "fancy"
                                                                                                            ? betData?.sessionBetId
                                                                                                            : betData?.matchBetId}
                                                                                                    </td>
                                                                                                    <td id="matchSelection">
                                                                                                        {betType == "fancy"
                                                                                                            ? betData?.fancyName
                                                                                                            : betData?.teamName}
                                                                                                    </td>
                                                                                                    <td id="txOddsMatched">
                                                                                                        {betType == "fancy"
                                                                                                            ? betData?.betRun +
                                                                                                            "/" +
                                                                                                            betData?.bhav
                                                                                                            : betData?.bhav}

                                                                                                        { }
                                                                                                    </td>
                                                                                                    <td id="txStake">
                                                                                                        {" "}
                                                                                                        {betData?.amount}
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {betType == "fancy" ? (
                                                                                                            <span
                                                                                                                id="matchType"
                                                                                                                className={
                                                                                                                    betData?.type === "No"
                                                                                                                        ? "lay"
                                                                                                                        : "back"
                                                                                                                }
                                                                                                            >
                                                                                                                {betData?.type}
                                                                                                            </span>
                                                                                                        ) : (
                                                                                                            <span
                                                                                                                id="matchType"
                                                                                                                className={
                                                                                                                    betData?.betType ===
                                                                                                                        "lay"
                                                                                                                        ? "lay"
                                                                                                                        : "back"
                                                                                                                }
                                                                                                            >
                                                                                                                {betData?.betType}
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </td>
                                                                                                    <td id="placed">
                                                                                                        {betData?.createdAt}
                                                                                                    </td>
                                                                                                    {betType == "fancy" ? (
                                                                                                        <td id="txLiability">
                                                                                                            {betData?.type == "No" ? (
                                                                                                                betData?.decisionRun <
                                                                                                                    betData?.betRun ? (
                                                                                                                    <span>
                                                                                                                        {
                                                                                                                            betData?.profitAmount
                                                                                                                        }
                                                                                                                    </span>
                                                                                                                ) : (
                                                                                                                    <span className="red">
                                                                                                                        (-
                                                                                                                        {
                                                                                                                            betData?.loseAmount
                                                                                                                        }
                                                                                                                        )
                                                                                                                    </span>
                                                                                                                )
                                                                                                            ) : betData?.decisionRun >=
                                                                                                                betData?.betRun ? (
                                                                                                                <span>
                                                                                                                    {
                                                                                                                        betData?.profitAmount
                                                                                                                    }
                                                                                                                </span>
                                                                                                            ) : (
                                                                                                                <span className="red">
                                                                                                                    (-
                                                                                                                    {betData?.loseAmount})
                                                                                                                </span>
                                                                                                            )}
                                                                                                        </td>
                                                                                                    ) : (betData?.teamSelectionWin ==
                                                                                                        betData?.selectionId &&
                                                                                                        betData?.betType ==
                                                                                                        "back") ||
                                                                                                        (betData?.teamSelectionWin !=
                                                                                                            betData?.selectionId &&
                                                                                                            betData?.betType ==
                                                                                                            "lay") ? (
                                                                                                        <td id="txLiability">
                                                                                                            {betData?.profitAmount}
                                                                                                        </td>
                                                                                                    ) : (
                                                                                                        <td id="txLiability">
                                                                                                            <span className="red">
                                                                                                                (-{betData?.loseAmount})
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    )}
                                                                                                </tr>
                                                                                            );
                                                                                        }
                                                                                    )}

                                                                                    <tr className="sum-pl">
                                                                                        <td colSpan="7">
                                                                                            <dl>
                                                                                                <dt>Total Stakes</dt>
                                                                                                <dd id="totalStakes">
                                                                                                    {resultTotalStake}
                                                                                                </dd>
                                                                                                {betType == "fancy" ? (
                                                                                                    <>
                                                                                                        <dt id="backSubTotalTitle">
                                                                                                            Yes subtotal
                                                                                                        </dt>
                                                                                                        <dd id="backSubTotal">
                                                                                                            {" "}
                                                                                                            {yesSubTotalresult ? (
                                                                                                                yesTotalProfitAmount >
                                                                                                                    yesTotalLoseAmount ? (
                                                                                                                    Math.abs(
                                                                                                                        yesSubTotalresult
                                                                                                                    )
                                                                                                                ) : (
                                                                                                                    <span className="red">
                                                                                                                        (-
                                                                                                                        {Math.abs(
                                                                                                                            yesSubTotalresult
                                                                                                                        )}
                                                                                                                        )
                                                                                                                    </span>
                                                                                                                )
                                                                                                            ) : (
                                                                                                                Math.abs(
                                                                                                                    yesSubTotalresult
                                                                                                                )
                                                                                                            )}
                                                                                                        </dd>

                                                                                                        <dt id="laySubTotalTitle">
                                                                                                            No subtotal
                                                                                                        </dt>
                                                                                                        <dd id="laySubTotal">
                                                                                                            {noSubTotalresult ? (
                                                                                                                noTotalProfitAmount >
                                                                                                                    noTotalLoseAmount ? (
                                                                                                                    Math.abs(
                                                                                                                        noSubTotalresult
                                                                                                                    )
                                                                                                                ) : (
                                                                                                                    <span className="red">
                                                                                                                        (-
                                                                                                                        {Math.abs(
                                                                                                                            noSubTotalresult
                                                                                                                        )}
                                                                                                                        )
                                                                                                                    </span>
                                                                                                                )
                                                                                                            ) : (
                                                                                                                Math.abs(
                                                                                                                    noSubTotalresult
                                                                                                                )
                                                                                                            )}
                                                                                                        </dd>
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <>
                                                                                                        <dt id="backSubTotalTitle">
                                                                                                            Back subtotal
                                                                                                        </dt>
                                                                                                        <dd id="backSubTotal">
                                                                                                            {" "}
                                                                                                            {backSubTotalresult ? (
                                                                                                                backTotalProfitAmount >
                                                                                                                    backTotalLoseAmount ? (
                                                                                                                    Math.abs(
                                                                                                                        backSubTotalresult
                                                                                                                    )
                                                                                                                ) : (
                                                                                                                    <span className="red">
                                                                                                                        (-
                                                                                                                        {Math.abs(
                                                                                                                            backSubTotalresult
                                                                                                                        )}
                                                                                                                        )
                                                                                                                    </span>
                                                                                                                )
                                                                                                            ) : (
                                                                                                                Math.abs(
                                                                                                                    backSubTotalresult
                                                                                                                )
                                                                                                            )}
                                                                                                        </dd>

                                                                                                        <dt id="laySubTotalTitle">
                                                                                                            Lay subtotal
                                                                                                        </dt>
                                                                                                        <dd id="laySubTotal">
                                                                                                            {" "}
                                                                                                            {layTotalProfitAmount >
                                                                                                                layTotalLoseAmount ? (
                                                                                                                Math.abs(
                                                                                                                    laySubTotalresult
                                                                                                                )
                                                                                                            ) : (
                                                                                                                <span className="red">
                                                                                                                    (-
                                                                                                                    {Math.abs(
                                                                                                                        laySubTotalresult
                                                                                                                    )}
                                                                                                                    )
                                                                                                                </span>
                                                                                                            )}
                                                                                                        </dd>
                                                                                                    </>
                                                                                                )}

                                                                                                <dt>Market subtotal</dt>

                                                                                                {betType == "fancy" ? (
                                                                                                    <dd id="marketTotal">
                                                                                                        {yesTotalProfitAmount >
                                                                                                            yesTotalLoseAmount ||
                                                                                                            noTotalProfitAmount >
                                                                                                            noTotalLoseAmount ? (
                                                                                                            Math.abs(
                                                                                                                fancyMarketSubTotal
                                                                                                            )
                                                                                                        ) : (
                                                                                                            <span className="red">
                                                                                                                (-
                                                                                                                {Math.abs(
                                                                                                                    fancyMarketSubTotal
                                                                                                                )}
                                                                                                                )
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </dd>
                                                                                                ) : (
                                                                                                    <>
                                                                                                        <dd id="marketTotal">
                                                                                                            {backTotalProfitAmount >
                                                                                                                backTotalLoseAmount ||
                                                                                                                layTotalProfitAmount >
                                                                                                                layTotalLoseAmount ? (
                                                                                                                Math.abs(marketSubTotal)
                                                                                                            ) : (
                                                                                                                <span className="red">
                                                                                                                    (-
                                                                                                                    {Math.abs(
                                                                                                                        marketSubTotal
                                                                                                                    )}
                                                                                                                    )
                                                                                                                </span>
                                                                                                            )}
                                                                                                        </dd>
                                                                                                    </>
                                                                                                )}

                                                                                                <dt
                                                                                                    id="commissionTitle"
                                                                                                    style={{ display: "block" }}
                                                                                                >
                                                                                                    Commission
                                                                                                </dt>
                                                                                                <dd
                                                                                                    id="commission"
                                                                                                    style={{ display: "block" }}
                                                                                                >
                                                                                                    {betType == "fancy"
                                                                                                        ? (fancyMarketSubTotal *
                                                                                                            loginUserDetailData?.commission || 0) /
                                                                                                        100
                                                                                                        : (marketSubTotal *
                                                                                                            loginUserDetailData?.commission || 0) /
                                                                                                        100}
                                                                                                </dd>

                                                                                                <dt className="net_total">
                                                                                                    Net Market Total
                                                                                                </dt>
                                                                                                {betType == "fancy" ? (
                                                                                                    <dd
                                                                                                        id="netTotal"
                                                                                                        className="net_total"
                                                                                                    >
                                                                                                        {fancyNetAmount > 0 ? (
                                                                                                            fancyNetAmount
                                                                                                        ) : (
                                                                                                            <span className="red">
                                                                                                                (-
                                                                                                                {Math.abs(
                                                                                                                    fancyNetAmount
                                                                                                                )}
                                                                                                                )
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </dd>
                                                                                                ) : (
                                                                                                    <>
                                                                                                        <dd
                                                                                                            id="netTotal"
                                                                                                            className="net_total"
                                                                                                        >
                                                                                                            {netAmount > 0 ? (
                                                                                                                netAmount
                                                                                                            ) : (
                                                                                                                <span className="red">
                                                                                                                    (-
                                                                                                                    {Math.abs(netAmount)})
                                                                                                                </span>
                                                                                                            )}
                                                                                                        </dd>
                                                                                                    </>
                                                                                                )}
                                                                                            </dl>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" className="text-start">
                                                            <span>You have no bets in this time period.</span>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                {data?.data?.length > 0 && (
                                    <div className="bottom-pagination">
                                        <ReactPaginate
                                            breakLabel="..."
                                            nextLabel=" >"
                                            forcePage={viewpage}
                                            onPageChange={handlePageClick}
                                            pageRangeDisplayed={10}
                                            pageCount={pageCount}
                                            previousLabel="< "
                                            renderOnZeroPageCount={null}
                                            activeClassName="p-1"
                                            activeLinkClassName="pagintion-li"
                                        />
                                    </div>
                                )}
                                <p className="table-other">
                                    Profit and Loss is shown net of commission.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default ProfitLossHistory;
