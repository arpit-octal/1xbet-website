import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
// import Sidebar from "../components/Sidebar";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { isEmpty } from "lodash";
import ReactPaginate from "react-paginate";
import helpers from "../Utils/helpers";
import AuthContext from "../context/AuthContext";
const Activitylog = () => {
    let { user } = useContext(AuthContext);
    const [getLogData, setLogData] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [search_params, setSearchParams] = useState({
        page: 1,
        limit: 10,
    });
    const myLogData = async () => {
        const { status, data: response_users } = await apiGet(
            apiPath.activityLogs,
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
        myLogData();
    }, [search_params]);
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
                                                <Table className="table_caption_style">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="text-start">
                                                                Login Date & Time
                                                            </th>
                                                            <th scope="col" className="text-end">
                                                                Login Status
                                                            </th>
                                                            <th scope="col" className="text-end">
                                                                IP Address
                                                            </th>
                                                            <th scope="col" className="text-end">
                                                                ISP
                                                            </th>
                                                            <th scope="col" className="text-end">
                                                                City/State/Country
                                                            </th>
                                                            <th scope="col" className="text-end">
                                                                User Agent Type
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {getLogData.data &&
                                                            getLogData.data.map((item, key) => (
                                                                <tr key={key}>
                                                                    <td>
                                                                        {helpers.dateFormat(
                                                                            item.activityDate,
                                                                            user.timeZone
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        <span className="text-end">
                                                                            {item.activityStatus}
                                                                        </span>
                                                                    </td>
                                                                    <td>{item.ip}</td>

                                                                    <td>{item.isp}</td>
                                                                    <td>{item.region}</td>
                                                                    <td>{item.userAgent}</td>
                                                                </tr>
                                                            ))}
                                                        {isEmpty(getLogData.data) ? (
                                                            <tr>
                                                                <td colSpan={9}>No records found</td>
                                                            </tr>
                                                        ) : null}
                                                    </tbody>
                                                </Table>

                                            </div>

                                            <div className="bottom-pagination">
                                                <ReactPaginate
                                                    breakLabel="..."
                                                    nextLabel=" >"
                                                    onPageChange={handlePageClick}
                                                    pageRangeDisplayed={3}
                                                    pageCount={pageCount}
                                                    previousLabel="< "
                                                    renderOnZeroPageCount={null}
                                                    activeClassName="p-0"
                                                    activeLinkClassName="pagintion-li"
                                                />
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

export default Activitylog;
