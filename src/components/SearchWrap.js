import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import obj from "../Utils/helpers";
const SearchWrap = () => {
  let { setSearchToogle, searchToogle } = useContext(AuthProvider);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const location = useLocation();
  const getData = async (key) => {
    if (!isEmpty(keyword)) {
      const { status, data: response_users } = await apiGet(
        `${apiPath.searchEvent}?keyword=${key}`
      );
      if (status === 200) {
        if (response_users.success) {
          if (response_users.results) {
            setList(response_users.results);
          }
        }
      }
    }
  };
  useEffect(() => {
    setSearchToogle(false);
    setKeyword("");
    setList([]);
  }, [location]);
  return (
    <div
      id="searchWrap"
      className="overlay"
      style={{ display: searchToogle ? "block" : "none" }}
    >
      {/* <span
        className="search_overlay_background"
        onClick={() => {
          setSearchToogle(false);
          setKeyword("");
          setList([]);
        }}
      ></span> */}
      <div id="searchPop" className="search-pop">
        <div>
          <a
            id="searchBack"
            className="search-back ui-link"
            onClick={() => {
              setSearchToogle(false);
              setKeyword("");
              setList([]);
            }}
            href="javascript:void(0)"
          >
            Back
          </a>
          <input
            id="searchInput"
            className="search-input"
            data-role="none"
            type="text"
            autocapitalize="off"
            autocomplete="off"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              getData(e.target.value);
            }}
            autoFocus="true"
            placeholder="Search Events"
          />
          <button
            id="searchClear"
            className="search-clear ui-btn ui-shadow ui-corner-all"
            type="reset"
            onClick={() => {
              setSearchToogle(false);
              setKeyword("");
              setList([]);
            }}
          >
            Reset
          </button>
          <button
            id="searchBtn"
            className="search-collapse ui-btn ui-shadow ui-corner-all"
            onClick={() => getData()}
            // onclick="javascript:MobileSearchEventHandler.addExpand(); return false;"
          >
            Search
          </button>
        </div>
        <div
          id="searchResult"
          className="suggestion-wrap"
          style={{ display: "block" }}
        >
          {/* <dl
            id="noMatching"
            className="no-matching"
            style={{ display: "none" }}
          >
            <dt></dt>
            <dd>No events found matching ...</dd>
          </dl> */}
          {list?.length > 0 && (
            <ul id="searchList" style={{ display: "block" }}>
              {list.length > 0 &&
                list.map((item) => {
                  return (
                    <li
                      id="resultTemplate"
                      // onClick={() => {
                      //   setSearchToogle(false);
                      //   setKeyword("");
                      //   setList([]);
                      // }}
                      style={{ display: "block" }}
                    >
                      <Link
                        to={`/match-details/${item.eventId}/${item.marketId}`}
                        className="ui-link"
                      >
                        {obj.matchDateTime(item.eventDateTime)}
                        <span
                          id="marketTime"
                          style={{ paddingLeft: "5px" }}
                          className="time"
                        >
                          {item.eventName}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchWrap;
