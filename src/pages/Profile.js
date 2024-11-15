import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import All_overlay from "../components/All_overlay";
import AuthProvider from "../context/AuthContext";
import { Link } from "react-router-dom";

function Profile() {
  let { logoutUser, user, setSettingToogle } = useContext(AuthProvider);
  let token = localStorage.getItem("token") || "";
  // console.log(`${process.env.REACT_APP_URL}my-profile/mobile/${token}`,"=========")
  //   let temp =
  //     "http://sabaexch.com/my-profile/mobile/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzZjg3ZjY1NzA0N2JhYWMwMGY5MjRhZSIsInVzZXJUeXBlIjoidXNlciIsImNyZWF0ZWRCeUlkIjoiNjNmODdmMjc3MDQ3YmFhYzAwZjkyNDFhIiwiYXV0aG9yaXR5IjoxLCJlbWFpbCI6Imxva3VAbWFpbGluYXRvci5jb20iLCJ1bmlxdWVJZCI6IjU4ODkuMjk5ODQ0NTMzOTgiLCJ1c2VybmFtZSI6Imxva3V1c2VybTEiLCJwaG9uZSI6OTk5OTk5OTk5LCJmaXJzdE5hbWUiOiJsb2t1IiwibGFzdE5hbWUiOiJVc2VyIiwid2Vic2l0ZSI6bnVsbCwidGltZVpvbmUiOiJBc2lhL0tvbGthdGEiLCJiZXRzQmxvY2tlZCI6ZmFsc2UsInRvdGFsQ29pbnMiOjE3MjQxLjE2LCJjYXNpbm9Db2lucyI6MCwiYWVDYXNpbm9Vc2VySWQiOiJsb2t1dXNlcm0xIiwiZXhwb3N1cmUiOjM2OCwic3RhdHVzIjoiYWN0aXZlIn0sImlhdCI6MTY3ODM2NjA3MSwiZXhwIjoxNjc4NDUyNDcxfQ.m27dt7FG4AXsla9DxtrctNDHkRvJ1P7KeWkAEUNikII";
  //  let temp2 = "http://localhost:7002/my-profile/mobile/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzZjg3ZjY1NzA0N2JhYWMwMGY5MjRhZSIsInVzZXJUeXBlIjoidXNlciIsImNyZWF0ZWRCeUlkIjoiNjNmODdmMjc3MDQ3YmFhYzAwZjkyNDFhIiwiYXV0aG9yaXR5IjoxLCJlbWFpbCI6Imxva3VAbWFpbGluYXRvci5jb20iLCJ1bmlxdWVJZCI6Ijc0NzMuNzE3MDM0NzQ5MTgzIiwidXNlcm5hbWUiOiJsb2t1dXNlcm0xIiwicGhvbmUiOjk5OTk5OTk5OSwiZmlyc3ROYW1lIjoibG9rdSIsImxhc3ROYW1lIjoiVXNlciIsIndlYnNpdGUiOm51bGwsInRpbWVab25lIjoiQXNpYS9Lb2xrYXRhIiwiYmV0c0Jsb2NrZWQiOmZhbHNlLCJ0b3RhbENvaW5zIjoxNzI0MS4xNiwiY2FzaW5vQ29pbnMiOjAsImFlQ2FzaW5vVXNlcklkIjoibG9rdXVzZXJtMSIsImV4cG9zdXJlIjozNjgsInN0YXR1cyI6ImFjdGl2ZSJ9LCJpYXQiOjE2NzgzNjY1MzgsImV4cCI6MTY3ODQ1MjkzOH0.1DLRYLJFsG-BzM86RbnQovqIAaQR_1xyU_qSuBv1S1c"
  //   // console.log(temp.split("/"), "temp");
  //   console.log(temp2.split("/")[3],temp2.split("/")[4], "temp2");
  return (
    <>
      <All_overlay />

      <div className="mian-wrap">
        <div className="path-wrap profileHead">
          <p className="account-id">
            <span>{user ? user?.user?.username : ""}</span>
            <span className="time-zone">{user ? user?.user?.timeZoneOffset : ""}</span>
          </p>

          <Link
            className="btn profileBtn"
            to={`/my-profile`}
            // target="_blank"
          >
            <span className="iconLeft">
              <img src="/assets/images/profileIcon/myprofile.png" />
            </span>
            My Profile
          </Link>
        </div>

        <div style={{ padding: "1vh 4vw" }}>
          <div className="dubbleGrid">
            {process.env.REACT_APP_ENABLE_PAYMENT == "true" && (
              <>
                <Link to={"/recharge"} state={{ from: "deposit" }} className="whiteWrapper d-flex align-items-center text-white bg-success">
                  {/* <span className="iconLeft">
                    <img src="/assets/images/profileIcon/DepositMoney.png" />
                  </span> */}
                  Deposit Money
                </Link>
                <Link to={"/recharge"} state={{ from: "withdraw" }} className="whiteWrapper d-flex align-items-center text-white bg-danger">
                  {/* <span className="iconLeft">
                    <img src="/assets/images/profileIcon/WithdrawMoney.png" />
                  </span> */}
                  Withdraw Money
                </Link>
              </>
            )}
          </div>

          <div className="whiteWrapperBlock">
            <Link to={`/balance`} className="whiteWrapper d-flex align-items-center">
              <span className="iconLeft">
                <img src="/assets/images/profileIcon/BalanceOverview.png" />
              </span>
              Balance Overview
            </Link>
          </div>

          <div className="whiteWrapperBlock">
            <Link to={`/mybets`} className="whiteWrapper d-flex align-items-center">
              <span className="iconLeft">
                <img src="/assets/images/profileIcon/MyBets.png" />
              </span>
              My Bets
            </Link>

            <Link to={`/betshistory`} className="whiteWrapper d-flex align-items-center">
              <span className="iconLeft">
                <img src="/assets/images/profileIcon/BetsHistory.png" />
              </span>
              Bets History
            </Link>
          </div>

          <div className="whiteWrapperBlock">
            <Link to={`/profit_loss`} className="whiteWrapper d-flex align-items-center">
              <span className="iconLeft">
                <img src="/assets/images/profileIcon/Profit&Loss.png" />
              </span>
              Profit &amp; Loss
            </Link>

            <Link to={`/account-statement`} className="whiteWrapper d-flex align-items-center">
              <span className="iconLeft">
                <img src="/assets/images/profileIcon/AccountStatement.png" />
              </span>
              Account Statement
            </Link>
          </div>
          {process.env.REACT_APP_ENABLE_PAYMENT == "true" && (
            <>
              <div className="whiteWrapperBlock">
                <Link to={"/withdraw-requests"} state={{ from: "withdraw" }} className="whiteWrapper d-flex align-items-center">
                  <span className="iconLeft">
                    <img src="/assets/images/profileIcon/withdraw.png" />
                  </span>
                  My Withdraw Requests
                </Link>

                <Link to={"/deposit-requests"} state={{ from: "deposit" }} className="whiteWrapper d-flex align-items-center">
                  <span className="iconLeft ml-2">
                    <img src="/assets/images/profileIcon/Deposit.png" />
                  </span>
                  My Deposit Requests
                </Link>
              </div>
              <div className="whiteWrapperBlock">
                <Link onClick={() => setSettingToogle(true)} className="whiteWrapper d-flex align-items-center" to="#" title="Setting">
                  <span className="iconLeft ml-2">
                    <img src="/assets/images/profileIcon/chip settings.png" />
                  </span>
                  Chip Setting
                </Link>
              </div>
            </>
          )}
          <Button style={{ width: "100%" }} onClick={() => logoutUser()} id="logout" className="logout">
            LOGOUT
          </Button>
        </div>
        {/* <li className="">
            <a
              href={`${process.env.REACT_APP_URL}activity-logs`}
            // target="_blank"
            >
              Activity Log
            </a>
          </li> */}
      </div>
    </>
  );
}

export default Profile;
