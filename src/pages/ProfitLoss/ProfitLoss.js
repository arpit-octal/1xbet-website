import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Tabs, Tab, Form, Table } from "react-bootstrap";
import { Link, useLoaderData, useLocation } from "react-router-dom";
// import Sidebar from "../../components/Sidebar";
import AuthContext from "../../context/AuthContext";
import { apiGet } from "../../Utils/apiFetch";
import apiPath from "../../Utils/apiPath";
import ProfitLossHistory from "./ProfitLossHistory";
import moment from "moment";
const ProfitLoss = () => {
    const [currentDateTime, setCurrentDateTime] = useState("");
    let { user } = useContext(AuthContext);
    const location = useLocation();
    const getCurrentDateTIme = () => {
        var today = new Date(),
            date =
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate() +
                " " +
                today.getHours() +
                ":" +
                today.getMinutes();

        setCurrentDateTime(date);
    };

    useEffect(() => {
        getCurrentDateTIme();
    }, []);
    const [pageCount, setPageCount] = useState(0);
    const [viewpage, setViewPage] = useState(0);

    const [key, setKey] = useState("Exchange");
    var previousDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    var currentDate = moment().format("YYYY-MM-DD");
    const [filter, setFilter] = useState({
        betType: "betfair",
        status: "",
        fromPeriod: previousDate,
        toPeriod: currentDate,
        filterByDay: "",
        page: 1,
        limit: 10,
    });
    const [data, setData] = useState([]);

    const getData = async (type) => {
        if (filter.filterByDay != "") {
            if (filter.filterByDay == "today") {
                filter.fromPeriod = currentDate;
                filter.toPeriod = currentDate;
            }
            if (filter.filterByDay == "yesterday") {
                filter.fromPeriod = previousDate;
                filter.toPeriod = currentDate;
            }
        }
        console.log("filter", filter);
        let obj;
        if (type !== "reset") {
            obj = {
                ...filter,
                betType:
                    key == "Exchange"
                        ? "betfair"
                        : key == "FancyBet"
                            ? "fancy"
                            : key == "Sportsbook"
                                ? "sportBook"
                                : key == "BookMaker"
                                    ? "bookmaker"
                                    : "casino",
            };
        } else {
            obj = {
                status: "",
                toPeriod: "",
                fromPeriod: "",
                filterByDay: "",
                betType:
                    key == "Exchange"
                        ? "betfair"
                        : key == "FancyBet"
                            ? "fancy"
                            : key == "Sportsbook"
                                ? "sportBook"
                                : key == "BookMaker"
                                    ? "bookmaker"
                                    : "casino",
            };
        }

        const { status, data: response_users } = await apiGet(
            apiPath.getProfitLoss,
            obj
        );
        if (status === 200) {
            if (response_users.success) {
                setData(response_users?.results);
            } else {
                setData("");
            }
        } else {
            setData("");
        }
    };
    useEffect(() => {
        if (filter.filterByDay != "") {
            getData();
        }
    }, [filter.filterByDay]);
    useEffect(() => {
        getData();
    }, [key]);

    const handlePageClick = (event) => {
        setFilter((prevState) => {
            return {
                ...prevState,
                page: event.selected + 1,
            };
        });
        setViewPage(event.selected);
    };
    useEffect(() => {
        setPageCount(data?.totalPages || []);
    }, [data]);
    useEffect(() => {
        // getData();
        setViewPage(filter.page ? filter.page - 1 : 0);
    }, [filter]);

    return (
        <>
            <section className="py-4 main-inner-outer">
                <Container fluid>
                    <div className="main_content_row">
                        {/* <Sidebar /> */}

                        <div className="my_account_main">
                            <div className="inner-wrapper">
                                <h2 className="common-heading">My Bets</h2>

                                {/* <div className="bet-history-menu">
                                    <ul className="list-unstyled">
                                        <li>
                                            <Link
                                                to={
                                                    location?.pathname?.split("/")[2] == "mobile"
                                                        ? "/mybets/mobile"
                                                        : "/mybets"
                                                }
                                            >
                                                Current Bets
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={
                                                    location?.pathname?.split("/")[2] == "mobile"
                                                        ? "/betshistory/mobile"
                                                        : "/betshistory"
                                                }
                                            >
                                                Bets History
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={
                                                    location?.pathname?.split("/")[2] == "mobile"
                                                        ? "/profit_loss/mobile"
                                                        : "/profit_loss"
                                                }
                                                className="active"
                                            >
                                                Profit & Loss
                                            </Link>
                                        </li>
                                    </ul>
                                </div> */}

                                <div className="common-tab mb-3 bg-white p-2 profile-loss-sec">
                                    <div className="profile-wallet-heading">
                                        <h4>Profit & Loss - Main wallet</h4>
                                        <ul className="acc-info">
                                            <li className="user">
                                                {user && user?.user?.username
                                                    ? user?.user?.username
                                                    : ""}
                                            </li>
                                            <li className="time">{currentDateTime}</li>
                                        </ul>
                                    </div>



                                    <div className="profile-taber">

                                        <Tabs
                                            id="controlled-tab-example"
                                            defaultActiveKey="Exchange"
                                            activeKey={key}
                                            onSelect={(k) => {
                                                setKey(k);
                                                setFilter({
                                                    betType: "",
                                                    status: "",
                                                    fromPeriod: previousDate,
                                                    toPeriod: currentDate,
                                                    filterByDay: "",
                                                    page: 1,
                                                    limit: 10,
                                                });
                                            }}
                                        >
                                            <Tab eventKey="Exchange" title="Exchange">
                                                {key === "Exchange" && (
                                                    <ProfitLossHistory
                                                        betType={"betfair"}
                                                        filter={filter}
                                                        setFilter={setFilter}
                                                        title={key}
                                                        data={data}
                                                        getData={getData}
                                                        viewpage={viewpage}
                                                        handlePageClick={handlePageClick}
                                                        pageCount={pageCount}
                                                    />
                                                )}
                                            </Tab>
                                            <Tab eventKey="FancyBet" title="FancyBet">
                                                {key === "FancyBet" && (
                                                    <ProfitLossHistory
                                                        betType={"fancy"}
                                                        filter={filter}
                                                        setFilter={setFilter}
                                                        title={key}
                                                        data={data}
                                                        getData={getData}
                                                        viewpage={viewpage}
                                                        handlePageClick={handlePageClick}
                                                        pageCount={pageCount}
                                                    />
                                                )}
                                            </Tab>
                                            {/* <Tab eventKey="Sportsbook" title="Sportsbook">
                                            {key === "Sportsbook" && (
                                                <ProfitLossHistory
                                                    betType={"sportBook"}
                                                    filter={filter}
                                                    setFilter={setFilter}
                                                    title={key}
                                                    data={data}
                                                    getData={getData}
                                                    viewpage={viewpage}
                                                    handlePageClick={handlePageClick}
                                                    pageCount={pageCount}
                                                />
                                            )}
                                        </Tab> */}
                                            {/* <Tab eventKey="BookMaker" title="BookMaker">
                                                {key === "BookMaker" && (
                                                    <ProfitLossHistory
                                                        betType={"bookmaker"}
                                                        title={key}
                                                        filter={filter}
                                                        setFilter={setFilter}
                                                        data={data}
                                                        getData={getData}
                                                        viewpage={viewpage}
                                                        handlePageClick={handlePageClick}
                                                        pageCount={pageCount}
                                                    />
                                                )}
                                            </Tab> */}
                                            <Tab eventKey="casino" title="Casino">
                                                {key === "casino" && (
                                                    <ProfitLossHistory
                                                        betType={"bookmaker"}
                                                        title={key}
                                                        filter={filter}
                                                        setFilter={setFilter}
                                                        data={data}
                                                        getData={getData}
                                                        viewpage={viewpage}
                                                        handlePageClick={handlePageClick}
                                                        pageCount={pageCount}
                                                    />
                                                )}
                                            </Tab>
                                        </Tabs>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default ProfitLoss;
