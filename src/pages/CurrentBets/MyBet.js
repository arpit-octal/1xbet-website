import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
// import Sidebar from "../../components/Sidebar";
import { apiGet } from "../../Utils/apiFetch";
import Exchange from "./Exchange";
import apiPath from "../../Utils/apiPath";
const MyBet = () => {
    const [key, setKey] = useState("Exchange");
    const [exchangeData, setExchangeData] = useState([]);
    const [fancyData, setFancyData] = useState([]);
    const location = useLocation()
    const [sportsData, setSportsBookData] = useState([]);
    const [bookmakerData, setBookmaker] = useState([]);
    const getExchangeData = async () => {
        const { status, data: response_users } = await apiGet(
            apiPath.getCurrentBetsExchanges,
            ""
        );
        if (status === 200) {
            if (response_users.success) {
                setExchangeData(response_users.results);
            }
        }
    };
    const getFancyBetData = async () => {
        const { status, data: response_users } = await apiGet(
            apiPath.getFancyBets,
            ""
        );
        if (status === 200) {
            if (response_users.success) {
                setFancyData(response_users.results);
            }
        }
    };
    const getSportsBook = async () => {
        const { status, data: response_users } = await apiGet(
            apiPath.getSportsBook,
            ""
        );
        if (status === 200) {
            if (response_users.success) {
                setSportsBookData(response_users.results);
            }
        }
    };
    const getBookmaker = async () => {
        const { status, data: response_users } = await apiGet(
            apiPath.getBookmakerBets,
            ""
        );
        if (status === 200) {
            if (response_users.success) {
                setBookmaker(response_users.results);
            }
        }
    };
    useEffect(() => {
        getExchangeData();
        getSportsBook();
        getBookmaker();
        getFancyBetData();
    }, []);
    return (
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
                                            className="active"
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
                                        >
                                            Profit & Loss
                                        </Link>
                                    </li>
                                </ul>
                            </div> */}
                            <div className="common-tab mb-3">
                                <Tabs
                                    id="controlled-tab-example"
                                    defaultActiveKey="Exchange"
                                    activeKey={key}
                                    onSelect={(k) => setKey(k)}
                                >
                                    <Tab eventKey="Exchange" title="Exchange">
                                        {key === "Exchange" && (
                                            <Exchange title={key} data={exchangeData} />
                                        )}
                                    </Tab>
                                    <Tab eventKey="FancyBet" title="FancyBet">
                                        {key === "FancyBet" && (
                                            <Exchange title={key} data={fancyData} />
                                        )}
                                    </Tab>
                                    {/* <Tab eventKey="Fancy1Bet" title="Sportsbook">
                                        {key === "Fancy1Bet" && (
                                            <Exchange title={key} data={sportsData} />
                                        )}
                                    </Tab> */}
                                    {/* <Tab eventKey="BookMaker" title="BookMaker">
                                        {key === "BookMaker" && (
                                            <Exchange title={key} data={bookmakerData} />
                                        )}
                                    </Tab> */}
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default MyBet;
