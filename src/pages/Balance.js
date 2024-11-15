import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Tabs, Tab, Form, Table } from "react-bootstrap";
// import Sidebar from "../components/Sidebar";
import AuthContext from "../context/AuthContext";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { isEmpty } from "lodash";
import helpers from "../Utils/helpers";
import { useLocation } from "react-router-dom";

const Balance = () => {
    let { user, user_coins } = useContext(AuthContext);
    const location = useLocation();
    const [getLogData, setLogData] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [search_params, setSearchParams] = useState({
        page: 1,
        limit: 10,
    });
    const myStatementData = async () => {
        const { status, data: response_users } = await apiGet(
            apiPath.transactionLogs,
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
    return (
        <>
            <section className="py-4 main-inner-outer">
                <Container fluid>
                    <div className="main_content_row">
                        {/* <Sidebar /> */}

                        <div className="my_account_main">
                            <div className="inner-wrapper">
                                <h2 className="common-heading">Summary</h2>

                                <div className="bg-white p-3 total-balance-summary mb-3">
                                    <div className="total-left-balance">
                                        <dt>Total Balance</dt>
                                        <strong>
                                            {!isEmpty(user_coins)
                                                ? helpers.currencyFormat(user_coins.totalCoins)
                                                : helpers.currencyFormat(user?.user?.totalCoins)}{" "}
                                            {process.env.REACT_APP_SHOW_CURRENCY == 'true' && <sub>{process.env.REACT_APP_CURRENCY}</sub>}
                                        </strong>
                                    </div>

                                    <div className="wlcome-sec">
                                        <h6>Welcome,</h6>
                                        <p>
                                            View your account details here. You can manage funds,
                                            review and change your settings and see the performance of
                                            your betting activity.
                                        </p>
                                    </div>
                                </div>

                                {location?.pathname?.split("/")[2] !== "mobile" && (
                                    <section className="account-table balance-acccount-table">
                                        <div className="profile-tab">
                                            <div className="my_account_table_wrap">
                                                <div className="table-main-wrapper">
                                                    <Table className="table_caption_style">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" className="text-start">
                                                                    Date
                                                                </th>
                                                                <th scope="col" className="text-end">
                                                                    Transaction No
                                                                </th>
                                                                <th scope="col" className="text-end">
                                                                    Debits
                                                                </th>
                                                                <th scope="col" className="text-end">
                                                                    Credits
                                                                </th>
                                                                <th scope="col" className="text-end">
                                                                    Balance
                                                                </th>
                                                                <th scope="col" className="text-end">
                                                                    Remarks
                                                                </th>
                                                                <th scope="col" className="text-end">
                                                                    From/To
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {getLogData.data &&
                                                                getLogData.data.map((item, key) => (
                                                                    <tr key={key}>
                                                                        <td>
                                                                            {helpers.dateFormat(
                                                                                item?.createdAt,
                                                                                user?.user?.timeZone
                                                                            )}
                                                                        </td>
                                                                        <td>{item?._id}</td>
                                                                        <td>
                                                                            {item?.transactionType === "credit" ? (
                                                                                <span className="text-success">
                                                                                    {helpers.currencyFormat(item?.amount)}
                                                                                </span>
                                                                            ) : (
                                                                                "-"
                                                                            )}{" "}
                                                                        </td>
                                                                        <td>
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
                                                                            {helpers.currencyFormat(item?.newBalance)}
                                                                        </td>
                                                                        <td>{item?.remark}</td>
                                                                        <td>
                                                                            {item?.createdByData?.username}{" "}
                                                                            <span className="angle_unicode">▸</span>{" "}
                                                                            {item?.userData?.username}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            {isEmpty(getLogData.data) ? (
                                                                <tr>
                                                                    <td colSpan={10}>No records found</td>
                                                                </tr>
                                                            ) : null}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default Balance;
