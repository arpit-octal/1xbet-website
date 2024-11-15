import moment from "moment/moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import AuthProvider from "../context/AuthContext";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";

const Anouncement = () => {
  let { setAnnouncmentToogle, announcmentToogle } = useContext(AuthProvider);
  const [message, setMessage] = useState([]);
  const messageList = async () => {
    let hostname = window.location.hostname;
    hostname = hostname.replace(/^www\./, '');
    hostname = hostname.replace(/^ag\./, '');
    hostname = hostname || "sabaexch.com";

    const { status, data: response_users } = await apiGet(apiPath.messageList + "?domain=" + hostname);
    if (status === 200) {
      if (response_users.success) {
        setMessage(response_users.results);

      }
    }
  };

  useEffect(() => {
    messageList();
  }, []);
  return (
    <div
      id="announcementPopUp"
      className="overlay"
      style={{ display: announcmentToogle ? "flex" : "none" }}
    >
      <div className="news-wrap marquee-pop">
        <div className="side-head">
          <h3 className="a-depth">Announcement</h3>
          <a
            className="close ui-link"
            onClick={() => setAnnouncmentToogle(false)}
            href="javascript:void(0)"
          >
            Close
          </a>
        </div>
        <div className="announce-wrap" id="announcementContent">
          {message.length > 0 &&
            message.map((item) => {
              return (
                <div id="announcementTemplate" className="article-wrap">
                  <dl className="article-date">
                    <dt id="date_0">{moment(item?.msgDate).format("D")}</dt>
                    <dd id="month_0">{moment(item?.msgDate).format("MMM")}</dd>
                    <dd id="year_0">{moment(item?.msgDate).format("YYYY")}</dd>
                  </dl>
                  <p id="textByLanguageType_0">{item.message}</p>
                </div>
              );
            })}
        </div>

        {/* <div>
          <ul>
            <li id="pageNumber">
              <a href="javascript:void(0)" className="ui-link"></a>
            </li>
          </ul>

          <ul id="pageNumberContent" className="pages">
            <li id="prev">
              <a href="javascript:void(0)" className="ui-link disable">
                Prev
              </a>
            </li>
            <li id="pageNumber">
              <a href="javascript:void(0)" className="ui-link select">
                1
              </a>
            </li>
            <li id="next">
              <a href="javascript:void(0)" className="ui-link disable">
                Next
              </a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Anouncement;
