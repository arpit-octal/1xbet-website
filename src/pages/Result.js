import React, { useState } from "react";
import All_overlay from "../components/All_overlay";

function Result() {
  const [tab, setTab] = useState("today");
  const [selectTab, setSelectTab] = useState("4");
  return (
    <>
      <div className="mian-wrap result">
        <div className="tab-wrap">
          <ul>
            <li
              onClick={() => setTab("today")}
              id="today"
              className={tab == "today" && "select"}
            >
              <a href="javascript:void(0)">Today</a>
            </li>
            <li
              className={tab == "yesterday" && "select"}
              onClick={() => setTab("yesterday")}
              id="yesterday"
            >
              <a href="javascript:void(0)">Yesterday</a>
            </li>
          </ul>
          <div className="custom-select">
            <select
              onChange={(e) => setSelectTab(e.target.value)}
              id="sportsSelect"
              value={selectTab}
            >
              <option value="4">CRICKET</option>
              <option value="1">SOCCER</option>
              <option value="2">TENNIS</option>
            </select>
          </div>
        </div>

        {/* <div className="result-wrap" id="eventResultData">
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 10:00</p>
              <strong id="eventName">Balochistan v Sindh</strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">253/10</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">254/4</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 10:00</p>
              <strong id="eventName">
                Khyber Pakhtunkhwa v Northern (Pak)
              </strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">351/4</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">268/10</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 10:00</p>
              <strong id="eventName">
                Central Punjab (Pak) v Southern Punjab (Pak)
              </strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">177/10</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">274/8</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 10:30</p>
              <strong id="eventName">
                Quetta Gladiators SRL T20 v Multan Sultans SRL T20
              </strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">136/7</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">170/6</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 13:00</p>
              <strong id="eventName">
                Sri Lanka SRL T20 v Bangladesh SRL T20
              </strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">141/9</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">137/6</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 15:30</p>
              <strong id="eventName">
                England SRL T20 v Australia SRL T20
              </strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">198/6</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">188/8</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 18:00</p>
              <strong id="eventName">
                Sunrisers Hyderabad SRL T20 v Gujarat Titans SRL T20
              </strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">161/10</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">173/7</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 18:00</p>
              <strong id="eventName">Dubai v Sharjah</strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">146/5</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">148/8</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 20:30</p>
              <strong id="eventName">
                Delhi Capitals SRL T20 v Kolkata Knight Riders SRL T20
              </strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">163/7</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">162/4</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 21:30</p>
              <strong id="eventName">Guardians v Pelicans</strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">120/7</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">117/7</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-21 22:00</p>
              <strong id="eventName">Ecb Blues v Ajman Heroes</strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">147/5</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">127/8</strong>
            </dd>
          </dl>
          <dl id="eventResultTemplate" style={{ display: "flex" }}>
            <dt>
              <p id="eventDate">2022-12-22 00:00</p>
              <strong id="eventName">Settlers v Warriors</strong>
            </dt>
            <dd>
              <p id="resultTitle1">Home</p>
              <strong id="resultItem1">137/2</strong>
            </dd>
            <dd>
              <p id="resultTitle2">Away</p>
              <strong id="resultItem2">122/5</strong>
            </dd>
          </dl>
        </div> */}
      </div>
    </>
  );
}

export default Result;
