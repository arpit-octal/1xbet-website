import React, { useContext, useState } from "react";
import { Row, Col, Form, Table, Button } from "react-bootstrap";
import moment from "moment";
import helpers from "../../Utils/helpers";
import obj, { headerData } from "../../Utils/constants";
import { toast } from "wc-toast";
import { apiGet } from "../../Utils/apiFetch";
import apiPath from "../../Utils/apiPath";
import ReactPaginate from "react-paginate";
import AuthContext from "../../context/AuthContext";
const ExchangeHistory = ({
    title,
    filter,
    setFilter,
    data,
    getData,
    viewpage,
    handlePageClick,
    pageCount,
}) => {
    let { user } = useContext(AuthContext);
    const [getProperty, setProperty] = useState("none");
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
    console.log(filter, "filter");
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
                                        Get History
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
                        <h5>Matched</h5>
                        <div className="table-main-wrapper">
                            {title === "casino" ? (
                                <Table>
                                    <thead>
                                        <tr>
                                            <th scope="col">Market</th>
                                            <th scope="col">Bet Placed</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Stake</th>
                                            <th scope="col">Profit / Loss</th>
                                        </tr>
                                    </thead>
                                    {data && data?.length > 0 ? (
                                        data?.map((item, index) => {
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
                                                        {/* <td>
                                                            {" "}
                                                            <i
                                                                id={"icon_" + item?.platformTxId}
                                                                class="fas fa-plus-square"
                                                                onClick={(e) =>
                                                                    showDetail(e, item?.platformTxId)
                                                                }
                                                            ></i>{" "}
                                                            {item?.platformTxId}
                                                        </td>
                                                        <td>{item?.clientName}</td> */}
                                                        <td id="title" className="align-L">
                                                            Casino
                                                            <span className="angle_unicode">▸</span>
                                                            <strong> {item?.gameDetails[0]?.game_name}</strong>
                                                            <span className="angle_unicode">▸</span>
                                                            {item?.gameDetails[0]?.game_id}
                                                        </td>
                                                        {/* <td>null</td> */}
                                                        {/* <td>back</td> */}
                                                        <td id="settledDate">
                                                            {" "}
                                                            {helpers.dateFormat(item.createdAt, user?.user?.timeZone)}
                                                        </td>
                                                        <td>{item.status == 'result' ? "Settled" : item.status == 'rollback' ? 'Rollback' : "In Settlement"}</td>
                                                        <td>{item?.betAmount}</td>
                                                        {/* <td>0.00</td> */}
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
                                                                        <th>Bet Taken</th>
                                                                        <th>Odds Req.</th>
                                                                        <th>Stake</th>
                                                                        <th>Liability</th>
                                                                        <th>Odds Matched</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                    <tr
                                                                        id="txRow0"
                                                                        style={{ display: "table-row" }}
                                                                        className="even"
                                                                    >
                                                                        <td id="betID">
                                                                            {" "}
                                                                            {helpers.dateFormat(item.timeInserted, user?.user?.timeZone)}
                                                                        </td>
                                                                        <td>0.00</td>
                                                                        <td>{item?.betAmount}</td>
                                                                        <td>
                                                                            {item?.loseAmount
                                                                                ? item?.loseAmount
                                                                                : "-"}
                                                                        </td>
                                                                        <td>0.00</td>
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
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={12}>
                                                <span>You have no bets in this time period.</span>
                                            </td>
                                        </tr>
                                    )}
                                </Table>
                            ) : (
                                <Table className="table_caption_style">
                                    <thead>
                                        <tr>
                                            {headerData.map((res) => {
                                                return (
                                                    <th
                                                        scope="col"
                                                        className={res.class}
                                                        width={res.widht}
                                                    >
                                                        {res.title}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data && data?.length > 0 ? (
                                            data?.map((item) => {
                                                // console.log(item, "item");
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
                                                            {item?.teamName || item?.fancyName}
                                                        </td>
                                                        <td className="text-end">
                                                            {" "}
                                                            {item?.betType || item?.type}
                                                        </td>
                                                        <td className="text-end">
                                                            {" "}
                                                            {item?.matchBetId || "N/A"}
                                                        </td>
                                                        <td className="text-end">
                                                            {" "}
                                                            {item?.amount || "N/A"}
                                                        </td>
                                                        <td className="text-end"> {item?.bhav || "N/A"}</td>
                                                        <td className="text-end"> {item?.bhav || "N/A"}</td>
                                                        <td className="text-end">
                                                            {" "}
                                                            {item?.bhav || "N/A"}{" "}
                                                        </td>
                                                        {console.log(filter.betType)}
                                                        {filter.betType == "betfair" ||
                                                            filter.betType == "Bookmaker" ? (
                                                            <td className="text-end">
                                                                {(item?.teamSelectionWin == item?.selectionId &&
                                                                    item?.betType == "back") ||
                                                                    (item?.teamSelectionWin != item?.selectionId &&
                                                                        item?.betType == "lay") ? (
                                                                    <span className="text-success">
                                                                        {item?.profitAmount}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-danger">
                                                                        -({item?.loseAmount})
                                                                    </span>
                                                                )}
                                                            </td>
                                                        ) : filter.betType === "sportsbook" ? (
                                                            <td>
                                                                {item?.teamSelectionWin && item?.teamSelectionWin.split(',').includes(item?.fancySelectionId) ? (
                                                                    <span className="text-success">
                                                                        {item?.profitAmount}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-danger">
                                                                        -({item?.loseAmount})
                                                                    </span>
                                                                )}
                                                            </td>
                                                        ) : (
                                                            <td className="text-end">
                                                                {item?.type == "No" ? (
                                                                    item?.decisionRun < item?.betRun ? (
                                                                        <span className="text-success">
                                                                            {item?.profitAmount}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-danger">
                                                                            -({item?.loseAmount})
                                                                        </span>
                                                                    )
                                                                ) : item?.decisionRun >= item?.betRun ? (
                                                                    <span className="text-success">
                                                                        {item?.profitAmount}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-danger">
                                                                        -({item?.loseAmount})
                                                                    </span>
                                                                )}
                                                            </td>
                                                        )}

                                                        <td>
                                                            {" "}{helpers.dateFormat(item?.timeInserted, user?.user?.timeZone)}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="12" className="text-start">
                                                    <span>You have no bets in this time period.</span>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}

                        </div>
                        <div className="bottom-pagination">
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel=" >"
                                forcePage={viewpage}
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                pageCount={pageCount}
                                previousLabel="< "
                                renderOnZeroPageCount={null}
                                activeClassName="p-1"
                                activeLinkClassName="pagintion-li"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default ExchangeHistory;
