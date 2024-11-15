import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
// import Sidebar from "../../components/Sidebar";
import { apiGet } from "../../Utils/apiFetch";
import ExchangeHistory from "./ExchangeHistory";
import apiPath from "../../Utils/apiPath";
import moment from "moment";

const BetHistory = () => {
    const [key, setKey] = useState("Exchange");
    const location = useLocation();
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
            apiPath.getHistory,
            obj
        );
        // console.log(response_users,status)
        if (status === 200) {
            if (response_users.success) {
                setData(response_users.results);
            } else {
                setData([]);
            }
        }
    };
    useEffect(() => {
        // console.log("filter", filter);
        if (filter.filterByDay != "") {
            getData();
        }
    }, [filter.filterByDay]);
    useEffect(() => {
        getData();
    }, [key]);
    // console.log(location?.pathname?.split("/")[2], "location");
    const [pageCount, setPageCount] = useState(0);
    const [viewpage, setViewPage] = useState(0);
    const handlePageClick = (event) => {
        console.log('event: ', event);
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
    // console.log("pageCount", pageCount);
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
                                                className="active"
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
                                            >
                                                Profit & Loss
                                            </Link>
                                        </li>
                                    </ul>
                                </div> */}

                                <div className="common-tab mb-3 profile-loss-sec">
                                    <Tabs
                                        id="controlled-tab-example"
                                        defaultActiveKey="Exchange"
                                        activeKey={key}
                                        onSelect={(k) => {
                                            setKey(k);
                                            let temp = "betfair";
                                            if (k == "Exchange") {
                                                temp = "betfair";
                                            } else if (k == "FancyBet") {
                                                temp = "fancy";
                                            } else if (k == "Sportsbook") {
                                                temp = "sportsbook";
                                            } else if (k == "BookMaker") {
                                                temp = "bookmaker";
                                            } else {
                                                temp = "casino";
                                            }
                                            if (temp !== filter?.betType) {
                                                setData([]);
                                            }
                                            setFilter({
                                                betType: temp,
                                                status: "",
                                                fromPeriod: previousDate,
                                                toPeriod: currentDate,
                                                filterByDay: "",
                                            });
                                        }}
                                    >
                                        <Tab eventKey="Exchange" title="Exchange">
                                            {key === "Exchange" && (
                                                <ExchangeHistory
                                                    filter={filter}
                                                    setFilter={setFilter}
                                                    title={key}
                                                    data={data?.data}
                                                    getData={getData}
                                                    viewpage={viewpage}
                                                    handlePageClick={handlePageClick}
                                                    pageCount={pageCount}
                                                />
                                            )}
                                        </Tab>
                                        <Tab eventKey="FancyBet" title="FancyBet">
                                            {key === "FancyBet" && (
                                                <ExchangeHistory
                                                    filter={filter}
                                                    setFilter={setFilter}
                                                    title={key}
                                                    data={data?.data}
                                                    getData={getData}
                                                    viewpage={viewpage}
                                                    handlePageClick={handlePageClick}
                                                    pageCount={pageCount}
                                                />
                                            )}
                                        </Tab>
                                        {/* <Tab eventKey="Sportsbook" title="Sportsbook">
                                            {key === "Sportsbook" && (
                                                <ExchangeHistory
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
                                                <ExchangeHistory
                                                    title={key}
                                                    filter={filter}
                                                    setFilter={setFilter}
                                                    data={data?.data}
                                                    getData={getData}
                                                    viewpage={viewpage}
                                                    handlePageClick={handlePageClick}
                                                    pageCount={pageCount}
                                                />
                                            )}
                                        </Tab> */}
                                        <Tab eventKey="casino" title="Casino">
                                            {key === "casino" && (
                                                <ExchangeHistory
                                                    title={key}
                                                    filter={filter}
                                                    setFilter={setFilter}
                                                    data={data?.data}
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
                </Container>
            </section>
        </>
    );
};

export default BetHistory;
