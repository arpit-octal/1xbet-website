import { isEmpty } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthProvider from "../../context/AuthContext";
import BetSlipContext from "../../context/BetSlipContext";
import { apiGet } from "../../Utils/apiFetch";
import apiPath from "../../Utils/apiPath";
import InplayTabs from "./InplayTabs";

function Inplay() {

  const [type, setType] = useState("inplay");
  let { user, setSearchToogle, setLoader, inPlayScore } = useContext(AuthProvider);
  let { handelAddMultiMarket } = useContext(BetSlipContext);
  const [loading, setLoading] = useState(false);
  const [sportsData, setSportsData] = useState([]);

  const fetchAllSport = async () => {
    setLoader(true);
    let temp = user ? `&userId=${user.user._id}` : "";
    const { status, data: response_users } = await apiGet(
      apiPath.userInPlaySport + "?type=" + type + temp
    );

    if (status === 200) {
      setLoader(false);
      if (response_users.success) {
        setLoader(false);
        setSportsData(response_users.results[type]);
        if (inPlayScore?.length > 0) {
          setSportsData(
            response_users.results[type].map((res) => {
              let temp = inPlayScore.find(
                (item) => item?.eventId == res?.eventId
              );
              return {
                ...res,
                score:
                  temp?.eventId == res?.eventId
                    ? temp?.score == 0
                      ? ""
                      : temp?.score
                    : "",
                timeElapsed:
                  temp?.eventId == res?.eventId ? temp?.timeElapsed : "",
              };
            })
          );
        }
        setLoader(false);
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchAllSport();
  }, [loading, type]);

  // console.log("sportsData", sportsData);
  return (
    <>
      <div className="mian-wrap">
        <div className="tab-wrap">
          <ul>
            <li
              id="inplay"
              className={type == "inplay" ? "select" : ""}
              onClick={() => {
                setType("inplay");

              }}
            >
              <a href="javascript:void(0)" neua="In-Play">
                In-Play
              </a>
            </li>
            <li
              id="today"
              className={type == "today" ? "select" : ""}
              onClick={() => {
                setType("today");

              }}
            >
              <a href="javascript:void(0)">Today</a>
            </li>
            <li
              id="tomorrow"
              className={type == "tomorrow" ? "select" : ""}
              onClick={() => {
                setType("tomorrow");

              }}
            >
              <a href="javascript:void(0)">Tomorrow</a>
            </li>
            <li id="result">
              <Link to={isEmpty(user) ? "/login" : "/result"}>Result</Link>
            </li>
          </ul>
          <a
            className="a-search"
            onClick={() => setSearchToogle(true)}
            href="javascript:void(0)"
          >
            Search
          </a>
        </div>
        {
          sportsData && sportsData.length > 0 && (
            <>
              <InplayTabs
                type={type}
                data={sportsData || []}
                handelAddMultiMarket={handelAddMultiMarket}
                setLoading={setLoading}
                sportsType={"Cricket"}
                sportsId={4}
              />
              <InplayTabs
                type={type}
                data={sportsData || []}
                handelAddMultiMarket={handelAddMultiMarket}
                setLoading={setLoading}
                sportsType={"Soccer"}
                sportsId={1}
              />
              <InplayTabs
                type={type}
                data={sportsData || []}
                handelAddMultiMarket={handelAddMultiMarket}
                setLoading={setLoading}
                sportsType={"Tennis"}
                sportsId={2}
              /></>
          )
        }

      </div>
    </>
  );
}

export default Inplay;
