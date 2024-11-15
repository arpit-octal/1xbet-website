import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
// import Sidebar from "../components/Sidebar";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { isEmpty } from "lodash";
import helpers from "../Utils/helpers";
import AuthContext from "../context/AuthContext";
import ReactPaginate from "react-paginate";

const Accountstatement = () => {
    let { user } = useContext(AuthContext);
    const [getLogData, setLogData] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [search_params, setSearchParams] = useState({
        page: 1,
        limit: 50,
    });
    const myStatementData = async () => {
        const { status, data: response_users } = await apiGet(
            apiPath.transactionBetLogs,
            search_params
        );
        if (status === 200) {
            if (response_users.success) {
                setLogData(response_users.results);
            }
        }
    };

    const handlePageClick = (event) => {
        setSearchParams((prevState) => {
            return {
                ...prevState,
                page: event.selected + 1,
            };
        });
    };

    useEffect(() => {
        setPageCount(getLogData?.totalPages || []);
    }, [getLogData]);

    useEffect(() => {
        myStatementData();
    }, [search_params]);

    let final =
        getLogData && getLogData.data[getLogData.data.length - 1]?.newBalance;
    return (
        <>
            <section className="py-4 main-inner-outer">
                <Container fluid>
                    <div className="main_content_row">
                        {/* <Sidebar /> */}

                        <div className="my_account_main">
                            <div className="inner-wrapper">
                                <h2 className="common-heading">Account Statement</h2>

                                <section className="account-table balance-acccount-table">
                                    <div className="profile-tab">
                                        <div className="my_account_table_wrap">
                                            <div className="table-main-wrapper">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Date/Time</th>
                                                            <th scope="col">Deposit From Upline</th>
                                                            <th scope="col">Deposit to Downline</th>
                                                            <th scope="col">WihtDraw By Upline</th>
                                                            <th scope="col">WithDraw From Downline</th>
                                                            <th scope="col">Balance</th>
                                                            <th scope="col">Remark</th>
                                                            <th scope="col">From/To</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getLogData.data &&
                                                            getLogData.data.map((item, key) => {
                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            {helpers.dateFormat(
                                                                                item?.createdAt,
                                                                                user?.user?.timeZone
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {item?.transactionType === "credit" ? (
                                                                                <span className="text-success">
                                                                                    {helpers.currencyFormat(item?.amount)}
                                                                                </span>
                                                                            ) : (
                                                                                "-"
                                                                            )}
                                                                        </td>
                                                                        <td>-</td>
                                                                        <td>
                                                                            {" "}
                                                                            {item?.transactionType === "debit" ? (
                                                                                <span className="text-danger">
                                                                                    {"(" +
                                                                                        helpers.currencyFormat(
                                                                                            item?.amount
                                                                                        ) +
                                                                                        ")"}
                                                                                </span>
                                                                            ) : (
                                                                                "-"
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {helpers.currencyFormat(item?.commission)}
                                                                        </td>
                                                                        <td>
                                                                            {/* {item?.transactionType === "debit" ? (
                                        <span className="text-danger">
                                          {"(" +
                                            helpers.currencyFormat(
                                              item?.amount
                                            ) +
                                            ")"}
                                        </span>
                                      ) : (
                                        "-"
                                      )} */}
                                                                            {helpers.currencyFormat(item?.newBalance)}
                                                                        </td>
                                                                        <td>
                                                                            {(item?.forBet != 0 ||
                                                                                item?.forBet != "0") &&
                                                                                `${item?.eventType === "4"
                                                                                    ? "Cricket"
                                                                                    : item?.eventType === "1"
                                                                                        ? "Soccer"
                                                                                        : item?.eventType === "2"
                                                                                            ? "Tennis"
                                                                                            : "Casino"
                                                                                }
                                        / Match /
                                        ${item?.matchName} / ${item?.eventId
                                                                                } / ${item?.runnerName}`}
                                                                        </td>
                                                                        <td>
                                                                            {item?.agentData?.username}{" "}
                                                                            <span>
                                                                                <i className="fas fa-arrow-right"> </i>
                                                                            </span>{" "}
                                                                            {item?.forBet != 0 || item?.forBet != "0"
                                                                                ? "-->"
                                                                                : `Agent ->${item?.userData?.username}`}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        {isEmpty(getLogData.data) ? (
                                                            <tr>
                                                                <td colSpan={9}>No records found</td>
                                                            </tr>
                                                        ) : null}
                                                    </tbody>
                                                </Table>
                                                <div className="bottom-pagination">
                                                    <ReactPaginate
                                                        breakLabel="..."
                                                        nextLabel=" >"
                                                        // forcePage={viewpage}
                                                        onPageChange={handlePageClick}
                                                        pageRangeDisplayed={10}
                                                        pageCount={pageCount}
                                                        previousLabel="< "
                                                        renderOnZeroPageCount={null}
                                                        activeClassName="p-1"
                                                        activeLinkClassName="pagintion-li"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default Accountstatement;
