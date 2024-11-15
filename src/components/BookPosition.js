import { isEmpty } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import AuthProvider from "../context/AuthContext";
import BetSlipContext from "../context/BetSlipContext";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import obj from "../Utils/constants";
const BookPosition = () => {
  let { setBookPosition, bookposition, setBookPositionData, bookpositionData } =
    useContext(BetSlipContext);
  let { user } = useContext(AuthProvider);
  const [data, setData] = useState([]);
  const getFancyBetPosition = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.bookPosition +
        `?eventId=${bookpositionData.eventId}&type=${
          obj.betCheckObj[bookpositionData.categoryType]
        }&selectionId=${bookpositionData.selectionId}&marketId=${
          bookpositionData.marketId
        }`
    );

    if (status === 200) {
      if (response_users.success) {
        setData(response_users.results);
      }
    }
  };
  useEffect(() => {
    if (bookposition && !isEmpty(bookpositionData) && !isEmpty(user)) {
      getFancyBetPosition();
    }
  }, [bookpositionData, bookposition]);
  // console.log(
  //   data.noBet[0]?.lossRunRange,
  //   data.yesBet[0]?.lossRunRange,
  //   data.noBet[0]?.lossRunRange + 1,
  //   data.yesBet[0]?.lossRunRange - 1,
  //   "data"
  // );
  // console.log(
  //   data.noBet[0]?.positionLoseAmount,
  //   data.yesBet[0]?.positionLoseAmount,
  //   "data"
  // );
  // const [lost,setLoss] = useState({

  // })
  return (
    <div
      id="fancyBetBookLeftSide"
      className="overlay"
      style={{
        display: bookposition && !isEmpty(bookpositionData) ? "flex" : "none",
      }}
    >
      <div id="sideWrap" className="side-wrap full-pop">
        <div className="side-head">
          <h3 className="">Book Position</h3>
          <a
            className="close"
            href="javascript:void(0)"
            onClick={() => {
              setBookPosition(false);
              setBookPositionData("");
            }}
          >
            Close
          </a>
        </div>
        <div id="sideContent" className="side-content">
          <div className="path-wrap">
            <ul>
              <li id="headerName">{bookpositionData?.fancyName}</li>
            </ul>
          </div>
          <table id="table" className="table table-fancy">
            <tbody>
              <tr>
                <th width="40%">Runs</th>
                <th width="60%">Amount</th>
              </tr>
              <tr id="trTemp">
                <td id="runs" className="">
                  <strong></strong>
                </td>
                <td id="exposure" className="">
                  <strong></strong>
                </td>
              </tr>

              {data?.bets?.length > 0 &&
                data?.bets?.map((res) => {
                  return (
                    <>
                      <tr id="runsEx" style={{ display: "table-row" }}>
                        <td id="runs" className="col-back">
                          {res.betRun}
                        </td>
                        <td id="exposure" className="col-back">
                          {(res.position>=0)?res.position:`(${res.position})`}
                        </td>
                      </tr>
                    </>
                  );
              })}

              {data?.noBet?.length > 0 &&
                data?.noBet?.map((res) => {
                  return (
                    <>
                      <tr id="runsEx" style={{ display: "table-row" }}>
                        <td id="runs" className="col-back">
                          {res.profitRunRange}
                        </td>
                        <td id="exposure" className="col-back">
                          {res.positionProfitAmount}
                        </td>
                      </tr>
                      <tr>
                        <td id="runs" className="col-lay">
                          {res.lossRunRange}
                        </td>
                        <td id="exposure" className="col-lay">
                          {`(- ${res.positionLoseAmount})`}
                        </td>
                      </tr>
                      <tr>
                        <td id="runs" className="col-lay">
                          {res.lossRunRange + 1}
                        </td>
                        <td id="exposure" className="col-lay">
                          {`(- ${res.positionLoseAmount})`}
                        </td>
                      </tr>
                    </>
                  );
                })}
              {data?.yesBet?.length > 0 &&
                data?.yesBet?.map((res) => {
                  return (
                    <>
                      <tr id="runsEx" style={{ display: "table-row" }}>
                        <td id="runs" className="col-back">
                          {res.profitRunRange}
                        </td>
                        <td id="exposure" className="col-back">
                          {res.positionProfitAmount}
                        </td>
                      </tr>
                      <tr>
                        <td id="runs" className="col-lay">
                          {res.lossRunRange}
                        </td>
                        <td id="exposure" className="col-lay">
                          {`(- ${res.positionLoseAmount})`}
                        </td>
                      </tr>
                      <tr>
                        <td id="runs" className="col-lay">
                          {res.lossRunRange - 1}
                        </td>
                        <td id="exposure" className="col-lay">
                          {`(- ${res.positionLoseAmount})`}
                        </td>
                      </tr>
                    </>
                  );
                })}
              {/* <tr id="runsEx" style={{ display: "table-row" }}>
                <td id="runs" className="col-back">
                  <strong>2</strong>
                </td>
                <td id="exposure" className="col-back">
                  <strong> 100.00</strong>
                </td>
              </tr>
              <tr id="runsEx" style={{ display: "table-row" }}>
                <td id="runs" className="col-lay">
                  <strong>3</strong>
                </td>
                <td id="exposure" className="col-lay">
                  <strong className="red">( 115.00)</strong>
                </td>
              </tr>
              <tr id="runsEx" style={{ display: "table-row" }}>
                <td id="runs" className="col-lay">
                  <strong>4</strong>
                </td>
                <td id="exposure" className="col-lay">
                  <strong className="red">( 115.00)</strong>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookPosition;
