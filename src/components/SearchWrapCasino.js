import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { toast } from "wc-toast";
import obj from "../Utils/helpers";
const SearchWrapCasino = () => {
  let { setSearchToogleCasino, searchToogleCasino, setCasinoGameUrl, setLoader, user_coins,user } = useContext(AuthProvider);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const location = useLocation();
  const getData = async (key) => {
      if (!isEmpty(keyword)) {
      const { status, data: response_users } = await apiGet(
        `${apiPath.casinoGamesList}?searchKey=${key}`
      );
      console.log('response_users: ', response_users);
      if (status === 200) {
          // if (response_users.success) {
              console.log('response_users.results: ', response_users.results);
              if (response_users.data) {
              console.log('status: ', status);
            setList(response_users?.data);
          }
        // }
      }
    }
  };
  const casinoGameURL = async (gameId, providerName) => {
    try {
      setLoader(true);
      const data = {
        gameId,
        providerName,
        balance: user_coins?.totalCoins,
      };
      console.log("data====>>>", data);
      const { status, data: response } = await apiPost(apiPath.casinoGameLogin, data);
      console.log("response", response.url);
      if (status === 200) {
        if (response.status == 0) {
          if (response) {
            setCasinoGameUrl(response.url);
            setLoader(false);
            navigate("/casino-game-play");
          }
        } else {
          setLoader(false);
          toast.error(response.errorDescripion);
        }
      }
    } catch (error) {
      console.error("error:", error);
    }
  };
  useEffect(() => {
    setSearchToogleCasino(false);
    setKeyword("");
    setList([]);
  }, [location]);
  return (
    <div
      id="searchWrap"
      className="overlay"
      style={{ display: searchToogleCasino ? "block" : "none" }}
    >
      {/* <span
        className="search_overlay_background"
        onClick={() => {
          setSearchToogleCasino(false);
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
              setSearchToogleCasino(false);
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
            placeholder="Search Games"
          />
          <button
            id="searchClear"
            className="search-clear ui-btn ui-shadow ui-corner-all"
            type="reset"
            onClick={() => {
              setSearchToogleCasino(false);
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
                      //   setSearchToogleCasino(false);
                      //   setKeyword("");
                      //   setList([]);
                      // }}
                      style={{ display: "block" }}
                    >
                      <Link
                        // to={`/match-details/${item.eventId}/${item.marketId}`}
                        className="ui-link"
                        onClick={() => {
                        if (!isEmpty(user)) {
                          casinoGameURL(item?.game_id, item?.provider_name);
                        } else {
                          navigate("/login");
                        }
                      }}
                      >
                        {/* {obj.matchDateTime(item.eventDateTime)} */}
                        <span
                          id="marketTime"
                          style={{ "paddingLeft": "24px", display: "flex", paddingTop: "5px" }}
                          className="time"
                        >
                          <img src={item.url_thumb} style={{width: "50px", height: "50px"}}/> {item.game_name}
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

export default SearchWrapCasino;
