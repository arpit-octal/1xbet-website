import React from "react";
import { Row, Col, Form, Table } from "react-bootstrap";
import moment from "moment";
import obj, { headerData } from "../../Utils/constants";
const Exchange = ({ title, data }) => {
    return (
        <div className="common-container">
            {/* <Form className="bet_status mb-3">
        <Row>
          <Col xl={11} md={12}>
            <Row className="align-items-center">
              <Col lg={3} sm={6} className="mb-lg-0 mb-3">
                <div className="bet-sec d-flex align-items-center">
                  <Form.Label className="mb-0">Bet Status:</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option>All</option>
                    <option value="1">UnMatched</option>
                    <option value="2">Matched</option>
                  </Form.Select>
                </div>
              </Col>
              <Col lg={4}>
                <div className="d-flex align-items-center">
                  <Form.Label className="mb-0 me-2">Order By:</Form.Label>
                  <Form.Check
                    aria-label="option 1"
                    label="Bet Placed"
                    className="mb-0 me-2 d-flex align-items-center"
                  />
                  <Form.Check
                    aria-label="option 1"
                    label="Market"
                    className="mb-0 me-2 d-flex align-items-center"
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form> */}
            <section className="account-table my-bet-sec mt-2">
                <div className="profile-tab">
                    {title === "Exchange" && (
                        <div className="my_account_table_wrap">
                            <h5>UnMatched</h5>
                            <div className="table-main-wrapper">
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
                                        {data && data?.unMatched?.length > 0 ? (
                                            data?.unMatched?.map((item) => {
                                                return (
                                                    <tr>
                                                        <td className="text-start" width="30%">
                                                            {item?.matchName || "N/A"}
                                                        </td>
                                                        <td className="text-end">
                                                            {obj.betCheckObj[item?.eventType]}
                                                        </td>
                                                        <td className="text-end">
                                                            {" "}
                                                            {item?.selectionId || "N/A"}
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
                                                        <td className="text-end">
                                                            {" "}
                                                            {item?.matchName || "N/A"}{" "}
                                                        </td>
                                                        <td className="text-end">
                                                            {" "}
                                                            {item?.matchName || "N/A"}{" "}
                                                        </td>
                                                        <td>
                                                            {item?.betType == "back" || item?.type == "Yes" ? (
                                                                <span className="text-success">
                                                                    {item?.profitAmount}
                                                                </span>
                                                            ) : (
                                                                <span className="text-danger">
                                                                    -({item?.loseAmount})
                                                                </span>
                                                            )}
                                                        </td>
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
                                                <td colSpan="12" className="text-start">
                                                    <span>You have no bets in this time period.</span>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                    <div className="my_account_table_wrap">
                        <h5>Matched</h5>
                        <div className="table-main-wrapper">
                            <Table className="table_caption_style">
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
                                    {data &&
                                        (title === "Exchange" ? data?.matched : data)?.length > 0 ? (
                                        (title === "Exchange" ? data?.matched : data)?.map(
                                            (item) => {
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
                                                        <td className="text-end">
                                                            {" "}
                                                            {item?.amount || "N/A"}
                                                        </td>
                                                        <td className="text-end"> {item?.bhav || "N/A"}</td>
                                                        <td className="text-end">{"N/A"}</td>
                                                        <td className="text-end">
                                                            {" "}
                                                            {item?.bhav || "N/A"}{" "}
                                                        </td>
                                                        <td>
                                                            {item?.betType == "back" || item?.type == "Yes" ? (
                                                                <span className="text-success">
                                                                    {item?.profitAmount}
                                                                </span>
                                                            ) : (
                                                                <span className="text-danger">
                                                                    -({item?.loseAmount})
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            {moment(item?.timeInserted).format(
                                                                "YYYY-MM-DD, h:mm:ss"
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan="12" className="text-start">
                                                <span>You have no bets in this time period.</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default Exchange;
