import { isEmpty, isNumber } from "lodash";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AuthProvider from "../../context/AuthContext";
import BetSlipContext from "../../context/BetSlipContext";
import { apiGet } from "../../Utils/apiFetch";
import apiPath from "../../Utils/apiPath";
import Bookmaker from "./Bookmaker";
import MatchDetails from "./MatchDetails";
import Fancy from "./Fancy";
import ReactPlayer from "react-player";
import { categoryArray } from "../../Utils/constants";
import helpers from "../../Utils/helpers";
import PremiumFancyNew from "./PremiumFancyNew";
import axios from "axios";
import moment from "moment";
import { useScrollPosition } from "react-use-scroll-position";
import obj from "../../Utils/constants";
import { io } from "socket.io-client";
import LoadingImage from "../../assets/images/cover-live.png";
function BidDetail() {
  const parmas = useParams();
  const navigate = useNavigate();
  let {
    user,
    setLoader,
    setIsTv,
    isTv,
    profileData,
    setFancyRules,
    setPremiumFancyRules,
    setMarketDepth,
    setMarketDepthData,
    loader,
  } = useContext(AuthProvider);
  let {
    handelAddMultiMarket,
    multimarketLoader,
    betLoader,
    setBetLoader,
    betSelectionObj,
    isBetPlaced,
    betPlacedCheck,
    setBetPlacedCheck,
    messaageBox,
  } = useContext(BetSlipContext);
  const location = useLocation();
  const { y } = useScrollPosition();
  let locationOddsData = location?.state?.odds;
  const [scrollPosition, setScrollPosition] = useState(0);
  const [details, setDetails] = useState({});
  const [selections, setSelections] = useState([]);
  const [position, setPosition] = useState({});
  const [bookmakerData, setBookmerData] = useState({});
  const [bookmakerSelections, setBookmakerSelections] = useState([]);
  const [back_odds, setBackOdds] = useState([]);
  const [lay_odds, setLayOdds] = useState([]);
  const [tempSelection, setTempSelection] = useState([]);
  const [selectionDemo, setSelectionDemo] = useState([]);
  const [fancyList, setFancyList] = useState([]);
  const [betFairMs, setBetFairMs] = useState(1);
  const [fancyPosition, setFancyPosition] = useState([]);
  const [premiumFancyPosition, setPremiumFancyPosition] = useState([]);
  const [bookmakerBackOdds, setBookmakerBackOdds] = useState([]);
  const [bookmakerLayOdds, setBookmakerLayOdds] = useState([]);
  const [fancyCentralizedIdArray, setFancyCentralizedIdArray] = useState([]);
  const [matchCentralizedIds, setMatchCentralizedIds] = useState({});
  const [fancyCategory, setFancyCategory] = useState([]);
  const [fancyCategoryTabArray, setFancyCategoryTabArray] = useState([]);
  const [preminumFancy, setPremiumFancy] = useState([]);
  const [preminumFancyTab, setPremiumFancyTab] = useState([]);
  const [mute, setMute] = useState(true);
  const [condi, setCondi] = useState(false);
  const [preminumFancyTabArr, setPremiumFancyTabArr] = useState([]);
  const [key, setKey] = useState("Fancy Bet");
  const [popupMessage, setPopupMessage] = useState(false);
  const [slipObj, setSlipObj] = useState({});
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedTabPremium, setSelectedTabPremium] = useState("All");
  const [ip, setIP] = useState("");
  const [scoreId, setScoreId] = useState("0");
  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };
  const setSelectedTabFunc = (id) => {
    if (id == "All") {
      setFancyCategoryTabArray(fancyList);
    } else if (id == "More") {
      let arr = fancyList?.filter(
        (res) =>
          res.categoryType !== 1 &&
          res.categoryType !== 2 &&
          res.categoryType !== 3 &&
          res.categoryType !== 4 &&
          res.categoryType !== 5 &&
          res.categoryType !== 6 &&
          res.categoryType !== 7 &&
          res.categoryType !== 8 &&
          res.categoryType !== 9 &&
          res.categoryType !== 10 &&
          res.categoryType !== 11 &&
          res.categoryType !== 14
      );
      setFancyCategoryTabArray(arr);
    } else {
      let temp = fancyList?.filter((res) => {
        return res?.categoryType == id;
      });
      setFancyCategoryTabArray(temp);
    }
    setSelectedTab(id);
  };
  const setSelectedTabFuncPreminum = (id) => {
    if (id == "All") {
      setPremiumFancyTabArr(
        preminumFancy?.filter((res) => {
          return res.odds?.rt?.length > 0;
        })
      );
    } else if (id == "More") {
      let arr = preminumFancy?.filter(
        (res) =>
          res.categoryType !== 1 &&
          res.categoryType !== 2 &&
          res.categoryType !== 3 &&
          res.categoryType !== 4 &&
          res.categoryType !== 5 &&
          res.categoryType !== 6 &&
          res.categoryType !== 7 &&
          res.categoryType !== 8 &&
          res.categoryType !== 9 &&
          res.categoryType !== 10 &&
          res.categoryType !== 11 &&
          res.categoryType !== 14 &&
          res.odds?.rt?.length > 0
      );
      setPremiumFancyTabArr(arr);
    } else {
      let temp = preminumFancy?.filter((res) => {
        return res?.categoryType == id && res.odds?.rt?.length > 0;
      });
      setPremiumFancyTabArr(temp);
    }
    setSelectedTabPremium(id);
  };
  const getMatchDetails = async (typeCheck = "") => {
    setLoader(true);
    let temp = user
      ? `?eventId=${parmas?.eventId}&userId=${user ? user?.user?._id : ""}`
      : `?eventId=${parmas?.eventId}`;
    const { status, data: response_users } = await apiGet(
      apiPath.matchDetail + temp
    );
    if (status === 200) {
      if (response_users?.success) {
        if (typeCheck == "") {
          const result = {
            centralizedId: response_users?.results?.centralizedId || "",
            bookmakerCentralizedId:
              response_users.results?.bookmakerCentralizedId || "",
          };
          response_users?.results?.jsonData?.map((it) => {
            it.position = 0;
          });
          const fancyCentralizedIdArr = response_users?.results?.fancyList?.map(
            (rt) => rt.centralizedId
          );
          let temp = categoryArray?.filter((f) =>
            response_users?.results?.fancyList.some(
              (item) => item?.categoryType === f.type
            )
          );
          setFancyCategoryTabArray(response_users?.results?.fancyList || []);
          setFancyCategory(
            temp?.length > 0
              ? [
                { type: "All", name: "All" },
                ...temp,
                { type: "More", name: "More" },
              ]
              : [{ type: "All", name: "All" }]
          );
          setScoreId(
            response_users?.results.scoreId == undefined
              ? "0"
              : response_users?.results.scoreId
          );
          setIsTv({
            id:
              response_users?.results?.channel == false ||
                response_users?.results?.channel == ""
                ? false
                : response_users?.results?.channel,
            status: response_users?.results?.channel ? true : false,
          });

          setMarketDepthData({
            array: response_users?.results?.jsonData || [],
            matchName: response_users?.results?.eventName,
          });
          setDetails(response_users?.results);
          setLoader(false);
          setMatchCentralizedIds(result);
          setSelectionDemo(response_users?.results?.jsonData || []);
          setSelections(response_users?.results?.jsonData || []);
          setTempSelection(response_users?.results?.jsonData || []);
          setBookmakerSelections(
            response_users?.results?.jsonBookmakerData || []
          );
          setFancyList(response_users?.results?.fancyList || []);
          if (
            response_users?.results?.fancyList?.length == 0 &&
            !isEmpty(user)
          ) {
            if (response_users?.results.fancy == "off") {
              setKey("Preminum Fancy");
            } else if (response_users?.results.premiumFancy == "off") {
              setKey("Fancy Bet");
            } else {
              setKey("Preminum Fancy");
            }
          } else {
            if (response_users?.results.fancy == "off") {
              setKey("Preminum Fancy");
            } else if (response_users?.results.premiumFancy == "off") {
              setKey("Fancy Bet");
            } else {
              setKey("Fancy Bet");
            }
          }
          fancyCentralizedIdArr?.length &&
            setFancyCentralizedIdArray(fancyCentralizedIdArr);
        } else {
          setDetails(response_users?.results);
        }
      }
      setLoader(false);
    }
  };
  const getPremiumFancyList = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.getPremiumFancy + `?eventId=${parmas.eventId}`
    );
    if (status === 200) {
      if (response_users.success) {
        let temp = response_users?.results?.data.filter((res) => {
          return res?.sportsBookSelection?.length > 0;
        });
        setPremiumFancy(
          temp?.length > 0
            ? temp?.map((res, index) => {
              return { ...res, check: index < 5 ? true : false };
            })
            : []
        );
        // let temp = categoryArray?.filter((f) =>
        //   response_users?.results?.data?.some(
        //     (item) => item.categoryType === f.type
        //   )
        // );
        // setPremiumFancyTabArr(response_users?.results.data || []);
        // setPremiumFancyTab([
        //   { type: "All", name: "All" },
        //   ...temp,
        //   { type: "More", name: "More" },
        // ]);
      }
    }
  };
  //   const { status, data: response_users } = await apiGet(
  //     apiPath.matchScore + `?eventId=${parmas.eventId}`
  //   );
  //   console.log(response_users, "users");
  //   if (status === 200) {
  //     if (response_users.success) {
  //       console.log(response_users, "resposne");
  //       setScoreUrl(response_users?.results?.data?.scoreUrl);
  //       setStreamingUrl(response_users?.results?.data?.streamingUrl);
  //     }
  //   }
  // };
  useEffect(() => {
    getMatchDetails();
    getPremiumFancyList();
  }, []);
  useEffect(() => {
    if (multimarketLoader) {
      setTimeout(() => {
        console.log("wokring");
        getMatchDetails("multi");
      }, 1000);
    }
  }, [multimarketLoader]);
  // Socket Start
  useEffect(() => {
    let filterSocketBetfair =
      locationOddsData?.data?.find(
        (el) => el.mi == matchCentralizedIds?.centralizedId
      ) || {};
    if ("rt" in filterSocketBetfair && filterSocketBetfair?.rt.length > 0) {
      const back_odds = filterSocketBetfair?.rt.filter((rt) => rt.ib) || [];

      const lay_odds = filterSocketBetfair?.rt.filter((rt) => !rt.ib) || [];
      setBackOdds(back_odds);
      setLayOdds(lay_odds);
    }

    let filterSocketBookmater =
      locationOddsData?.data?.find(
        (el) => el.mi == matchCentralizedIds?.bookmakerCentralizedId
      ) || {};

    if (filterSocketBookmater?.ms != undefined) {
      setBookmerData(filterSocketBookmater);
    }
    if (filterSocketBookmater?.rt?.length) {
      const back_odds = filterSocketBookmater?.rt.filter((rt) => rt.ib) || [];
      const lay_odds = filterSocketBookmater?.rt.filter((rt) => !rt.ib) || [];
      setBookmakerBackOdds(back_odds);
      setBookmakerLayOdds(lay_odds);
    }
  }, [
    !back_odds.length && !lay_odds && !bookmakerBackOdds && !bookmakerLayOdds,
  ]);
  useEffect(() => {
    if (details?.fancyType == "diamond") {
      const newSocket = io(
        `${process.env.REACT_APP_API_BASE_URL1}?token=${localStorage.getItem(
          "token"
        )}&userType=front`,
        {
          transports: ["websocket"],
        }
      );
      const coinListener = (message) => {
        if (message?.eventId === parmas?.eventId) {
          // let updated =  message.results.filter((res) => {
          //     if (res?.ms !== 4 || res?.ms !== 2) {
          //       return res;
          //     }
          //   });
          let temp = categoryArray?.filter((f) =>
            message?.results?.some((item) => item?.categoryType === f.type)
          );
          setFancyCategory(
            temp.length > 0
              ? [
                { type: "All", name: "All" },
                ...temp,
                { type: "More", name: "More" },
              ]
              : [{ type: "All", name: "All" }]
          );
          // console.log(message.results, "result");
          for (const fancy_odd of message.results) {
            setFancyList((current) =>
              current.map((obj) => {
                if (obj.centralizedId == fancy_odd.mi) {
                  return {
                    ...obj,
                    categoryType: fancy_odd?.categoryType,
                    odds: fancy_odd,
                  };
                }
                return obj;
              })
            );
            setFancyCategoryTabArray((current) =>
              current.map((obj) => {
                if (obj.centralizedId == fancy_odd.mi) {
                  return {
                    ...obj,
                    categoryType: fancy_odd?.categoryType,
                    odds: fancy_odd,
                  };
                }
                return obj;
              })
            );
          }
        }

        // setUserCoins(message.results);
        // setRefresh(false);
      };
      newSocket.on("listenDiamondFancy", coinListener);
      return () => newSocket.close();
    }
  }, [details]);
  useEffect(() => {
    if (
      matchCentralizedIds?.centralizedId ||
      matchCentralizedIds?.bookmakerCentralizedId ||
      fancyCentralizedIdArray?.length > 0
    ) {
      const connect = () => {
        const ACCESS_TOKEN =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudGlkIjoiOWJldCIsImRhdGV0aW1lIjoxNjgwNDk4NDE5MTM0LCJpYXQiOjE2ODA0OTg0MTl9.dWkK1RPdcsvqvPTKvSHLoeOMEE0rvZEVY-3MJIREy_w";
        const matchOddsSocket = new WebSocket(
          `wss://central3.satsport248.com:8881?token=${ACCESS_TOKEN}`
        );
        matchOddsSocket.onopen = (event) => {
          matchOddsSocket.send(
            JSON.stringify({
              action: "set",
              markets: !fancyCentralizedIdArray?.length
                ? `${matchCentralizedIds?.centralizedId},${matchCentralizedIds?.bookmakerCentralizedId}`
                : `${matchCentralizedIds?.centralizedId},${matchCentralizedIds?.bookmakerCentralizedId
                },${fancyCentralizedIdArray.join(",")}`,
            })
          );
        };
        matchOddsSocket.onmessage = (event) => {
          const socket_data =
            event && event?.data ? JSON.parse(event?.data) : [];
          let filterSocketBetfair =
            socket_data && socket_data?.data?.length > 0
              ? socket_data?.data?.find((el) => {
                return el?.mi == matchCentralizedIds?.centralizedId;
              }) || {}
              : [];

          if (!isEmpty(filterSocketBetfair)) {
            setBetFairMs(filterSocketBetfair.ms);
          }
          if (
            "rt" in filterSocketBetfair &&
            filterSocketBetfair?.rt?.length > 0
          ) {
            const back_odds =
              filterSocketBetfair?.rt?.filter((rt) => rt.ib) || [];
            const lay_odds =
              filterSocketBetfair?.rt?.filter((rt) => !rt.ib) || [];

            setBackOdds(back_odds);
            setLayOdds(lay_odds);
          }
          let filterSocketBookmater =
            socket_data?.data.length > 0
              ? socket_data?.data?.filter(
                (el) => el?.mi == matchCentralizedIds?.bookmakerCentralizedId
              )
              : [];
          if (details?.fancyType !== "diamond") {
            for (const fancy_odd of socket_data?.data) {
              setFancyList((current) =>
                current?.map((obj) => {
                  if (obj.centralizedId == fancy_odd?.mi) {
                    return {
                      ...obj,
                      odds: {
                        bmi: fancy_odd?.bmi,
                        ip: fancy_odd?.ip,
                        mi: fancy_odd?.mi,
                        ms: fancy_odd?.ms,
                        eid: fancy_odd?.eid,
                        grt: fancy_odd?.grt,
                        rt: fancy_odd?.rt?.length > 0 ? fancy_odd?.rt : [],
                        temp:
                          fancy_odd?.rt?.length > 0
                            ? fancy_odd?.rt
                            : obj?.odds?.temp,
                      },
                    };
                  }
                  return obj;
                })
              );
              setFancyCategoryTabArray((current) =>
                current.map((obj) => {
                  if (obj.centralizedId == fancy_odd.mi) {
                    return {
                      ...obj,
                      // odds: {
                      //   ...fancy_odd,
                      // },
                      odds: {
                        bmi: fancy_odd?.bmi,
                        ip: fancy_odd?.ip,
                        mi: fancy_odd?.mi,
                        ms: fancy_odd?.ms,
                        eid: fancy_odd?.eid,
                        grt: fancy_odd?.grt,
                        rt: fancy_odd?.rt?.length > 0 ? fancy_odd?.rt : [],
                        temp:
                          fancy_odd?.rt?.length > 0
                            ? fancy_odd?.rt
                            : obj?.odds?.temp,
                      },
                    };
                  }
                  return obj;
                })
              );
            }
          }
          if (filterSocketBookmater[0]?.ms != undefined) {
            setBookmerData(filterSocketBookmater[0]);
          }
          if (filterSocketBookmater[0]?.rt?.length) {
            const back_odds =
              filterSocketBookmater[0]?.rt.filter((rt) => rt.ib) || [];
            const lay_odds =
              filterSocketBookmater[0]?.rt.filter((rt) => !rt.ib) || [];
            setBookmakerBackOdds(back_odds);
            setBookmakerLayOdds(lay_odds);
          }
        };
        matchOddsSocket.onerror = (e) => {
          setTimeout(() => {
            connect();
            console.log(e, "error");
          }, 1000);
        };
        matchOddsSocket.onclose = (e) => {
          setTimeout(() => {
            connect();
            console.log(e, "close");
          }, 1000);
        };
      };
      connect();
    }
  }, [matchCentralizedIds]);
  useEffect(() => {
    if (!isEmpty(user)) {
      let newSocket = "";
      let randomId = Math.floor(100000 + Math.random() * 900000);
      if (user) {
        newSocket = io(
          `${process.env.REACT_APP_API_BASE_URL1}?token=${localStorage.getItem(
            "token"
          )}&userType=front`,
          {
            transports: ["websocket"],
          }
        );
      } else {
        newSocket = io(
          `${process.env.REACT_APP_API_BASE_URL1}?user_id=${randomId}`,
          {
            transports: ["websocket"],
          }
        );
      }
      const coinListener = (message) => {
        const socket_data = message;
        if (socket_data.eventId == parmas.eventId) {
          // if (preminumFancy?.length > 0) {
          for (let temp of socket_data.results) {
            setPremiumFancy((current) => {
              if (current?.length == 0) {
                return socket_data.results.filter((res) => {
                  return res?.sportsBookSelection?.length > 0;
                });
              } else {
                return current?.map((res, index) => {
                  if (res?.sportsBookSelection?.length > 0) {
                    if (res?.id == temp?.id) {
                      return {
                        ...res,
                        sportsBookSelection: temp?.sportsBookSelection,
                        marketStatus: temp?.marketStatus,
                        check: res.check,
                        // marketStatus:
                        //   temp.sportsBookSelection == undefined ||
                        //   temp?.sportsBookSelection?.length == 0
                        //     ? 2
                        //     : temp?.marketStatus,
                      };
                    } else {
                      return { ...res, check: res.check };
                    }
                  }
                });
              }
            });
          }
          // } else {
          //   if (socket_data?.results?.length > 0) {
          //     setPremiumFancy(
          //       socket_data.results.filter((res, index) => {
          //         if (
          //           res?.marketStatus == 1 ||
          //           res?.marketStatus == 0 ||
          //           res?.sportsBookSelection?.length > 0
          //         ) {
          //           return { ...res, check: res.check };
          //         } else {
          //           return { ...res, check: res.check };
          //         }
          //       })
          //     );
          //   }
          // }
        }
      };
      // const coinListener = (message) => {
      //   const socket_data = message;
      //   if (
      //     socket_data?.results?.length > 0 &&
      //     parmas?.eventId == socket_data?.eventId
      //   ) {
      //     if (preminumFancy?.length > 0) {
      //       for (let temp of socket_data.data) {
      //         setPremiumFancy((current) => {
      //           current?.map((res) => {
      //             if (res?.marketId == temp?.marketId) {
      //               return {
      //                 ...res,
      //                 runners: temp?.runners,
      //                 status: temp.status,
      //               };
      //             } else {
      //               return res;
      //             }
      //           });
      //         });
      //       }
      //     } else {
      //       setPremiumFancy(socket_data?.results);
      //     }
      //   }
      // };
      newSocket.emit("setPremiumFancy", {
        user_id: user?.user?._id ? user?.user?._id : randomId,
        eventId: parmas.eventId,
      });
      const refreshPage = (e) => {
        if (!isEmpty(e)) {
          window.location.reload();
        }
      };
      const betFairOdds = (e) => {
        console.log(e, "eeeeeeeeeeeeeee");
      };
      newSocket.on("betFairOdds", betFairOdds);
      newSocket.on("refreshPage", refreshPage);
      newSocket.on("listenPremiumFancy", coinListener);
    }
  }, []);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setPremiumFancy((current) => {
  //       return current.map((res, index) => {
  //         return { ...res, check: index < 5 ? true : false };
  //       });
  //     });
  //   }, 4000);
  // }, []);
  // console.log(preminumFancy,"premuiunm")
  // Socket End

  // useEffect(() => {
  //   if (user) {
  //     let newSocket = "";
  //     let randomId = Math.floor(100000 + Math.random() * 900000);
  //     if (user) {
  //       newSocket = io(
  //         `${process.env.REACT_APP_API_BASE_URL}?token=${localStorage.getItem(
  //           "token"
  //         )}&userType=front`,
  //         {
  //           transports: ["websocket"],
  //         }
  //       );
  //     } else {
  //       newSocket = io(
  //         `${process.env.REACT_APP_API_BASE_URL}?user_id=${randomId}`,
  //         {
  //           transports: ["websocket"],
  //         }
  //       );
  //     }
  //     const coinListener = (message) => {
  //       const socket_data = message?.results;
  //       // console.log(message,"socket data")
  //       if (
  //         socket_data?.length &&
  //         message?.results[0]?.eventId === parmas?.eventId
  //       ) {
  //         setPremiumFancy(socket_data);
  //       }
  //     };
  //     newSocket.emit("setPremiumFancy", {
  //       user_id: user?.user?._id ? user?.user?._id : randomId,
  //       eventId: parmas.eventId,
  //     });
  //     newSocket.on("listenPremiumFancy", coinListener);
  //   }
  // }, []);
  // Socket End
  const getBetPosition = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.betPosition +
      `?eventId=${parmas.eventId}&type=${details.gameType}`
    );
    if (status === 200) {
      //BET FAIR
      if (response_users.success) {
        setTempSelection(response_users?.results?.betFair);
        setPosition(response_users?.results);
        setSelectionDemo((current) =>
          response_users?.results?.betFair.length > 0
            ? current.map((res) => {
              let obj = response_users?.results?.betFair.find(
                (item) => item.selectionId == res.SelectionId
              );
              return {
                ...res,
                position:
                  obj.selectionId == res.SelectionId ? obj?.position : 0,
                newPosition: 0,
              };
            })
            : current.map((res) => {
              return {
                ...res,
                position: 0,
                newPosition: 0,
              };
            })
        );
        setSelections((current) =>
          response_users?.results?.betFair.length > 0
            ? current.map((res) => {
              let obj = response_users?.results?.betFair.find(
                (item) => item.selectionId == res.SelectionId
              );
              return {
                ...res,
                position:
                  obj.selectionId == res.SelectionId ? obj?.position : 0,
                newPosition: 0,
              };
            })
            : current.map((res) => {
              return {
                ...res,
                position: 0,
                newPosition: 0,
              };
            })
        );
        // BOOKMAKER
        setBookmakerSelections((current) =>
          response_users?.results?.bookmaker?.length > 0
            ? current?.map((res) => {
              let obj = response_users?.results?.bookmaker?.find(
                (item) => item?.selectionId == res?.selectionID
              );
              return {
                ...res,
                position: obj?.position ? obj?.position : 0,
                newPosition: 0,
              };
            })
            : current?.map((res) => {
              return {
                ...res,
                position: 0,
                newPosition: 0,
              };
            })
        );
        setBetLoader(false);
      }
    }
  };
  const getFancyBetPosition = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.betFancyPosition +
      `?eventId=${parmas.eventId}&type=${details.gameType}`
    );

    if (status === 200) {
      if (response_users.success) {
        setFancyPosition(response_users?.results);
        setFancyList((current) =>
          response_users?.results?.length > 0
            ? current?.map((res) => {
              let obj = response_users?.results?.find(
                (item) =>
                  item.selectionId == res.selectionId &&
                  item.fancyName == res.fancyName
              );
              return {
                ...res,
                position: obj?.position ? obj?.position : 0,
                type: obj?.type,
              };
            })
            : current?.map((res) => {
              return {
                ...res,
                newPosition: 0,
              };
            })
        );
        setFancyCategoryTabArray((current) =>
          response_users?.results?.length > 0
            ? current?.map((res) => {
              let obj = response_users?.results?.find(
                (item) =>
                  item.selectionId == res.selectionId &&
                  item.fancyName == res.fancyName
              );
              return {
                ...res,
                position: obj?.position ? obj?.position : 0,
                type: obj?.type,
              };
            })
            : current?.map((res) => {
              return {
                ...res,
                newPosition: 0,
              };
            })
        );

        // setBetLoader(false);
      }
    }
  };
  const getPremiumFancyBetPosition = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.betPremiumFancyPosition +
      `?eventId=${parmas.eventId}&type=${details.gameType}`
    );

    if (status === 200) {
      if (response_users.success) {
        setPremiumFancyPosition(response_users?.results);
        setPremiumFancy((current) => {
          return response_users?.results.length > 0
            ? current?.map((res) => {
              let obj = response_users?.results?.find(
                (item) =>
                  item?.fancyName == res?.marketName &&
                  res?.id == item?.marketId
              );
              return obj?.marketId == res?.id &&
                obj?.fancyName == res?.marketName
                ? {
                  ...res,
                  sportsBookSelection: res?.sportsBookSelection?.map(
                    (temp) => {
                      return temp?.id == obj?.selectionId &&
                        temp?.selectionName == obj?.runnerName
                        ? {
                          ...temp,
                          position: obj?.profitAmount,
                          newPosition: 0,
                        }
                        : {
                          ...temp,
                          position: obj?.loseAmount,
                          newPosition: 0,
                        };
                    }
                  ),
                }
                : res;
            })
            : current;
        });
      }
    }
  };
  useEffect(() => {
    if (!isEmpty(user)) {
      if (
        (betPlacedCheck && isBetPlaced == "placed") ||
        (betPlacedCheck && isBetPlaced === "error") ||
        (betPlacedCheck && isBetPlaced == "maxProfitError") ||
        (betPlacedCheck && isBetPlaced == "unMatched") ||
        (betPlacedCheck && isBetPlaced == "clearBet")
      ) {
        if (betSelectionObj?.betType == "fancy") {
          getFancyBetPosition();
          setBetPlacedCheck(false);
        } else if (
          betSelectionObj?.betType == "bookmaker" ||
          betSelectionObj?.betType == "betFair"
        ) {
          getBetPosition();
          setBetPlacedCheck(false);
        } else if (betSelectionObj?.betType == "premiumfancy") {
          getPremiumFancyBetPosition();
          setBetPlacedCheck(false);
        }
      }
    }
  }, [betPlacedCheck, isBetPlaced]);
  useEffect(() => {
    setTimeout(() => {
      getBetPosition();
      getFancyBetPosition();
      getPremiumFancyBetPosition();
    }, 1500);
    if (!isEmpty(user)) {
      let obj = (
        details?.matchSetting?.length > 0
          ? details?.matchSetting
          : profileData?.matchSetting
      )?.find(
        (res) =>
          res?.type == "sportBook" &&
          (details?.matchSetting?.length > 0
            ? details?.matchSetting
            : profileData?.matchSetting
              ? true
              : res?.sportType == details?.gameType)
      );
      if (!isEmpty(obj)) {
        setMinSportBook(Number(obj?.minAmount));
      }
    }
  }, []);
  const resetSelection = (type) => {
    if (type == "betFair") {
      setSelectionDemo((current) =>
        position?.betFair?.length > 0
          ? current?.map((res) => {
            let obj = position?.betFair?.find(
              (item) => item.selectionId == res.SelectionId
            );
            return {
              ...res,
              position:
                obj.selectionId == res.SelectionId ? obj?.position : 0,
              newPosition: 0,
            };
          })
          : current.map((res) => {
            return {
              ...res,
              position: 0,
              newPosition: 0,
            };
          })
      );
      setSelections((current) =>
        position?.betFair?.length > 0
          ? current?.map((res) => {
            let obj = position?.betFair?.find(
              (item) => item.selectionId == res.SelectionId
            );
            return {
              ...res,
              position:
                obj.selectionId == res.SelectionId ? obj?.position : 0,
              newPosition: 0,
            };
          })
          : current.map((res) => {
            return {
              ...res,
              position: 0,
              newPosition: 0,
            };
          })
      );
    } else if (type == "bookmaker") {
      setBookmakerSelections((current) =>
        position?.bookmaker?.length > 0
          ? current?.map((res) => {
            let obj = position?.bookmaker?.find(
              (item) => item?.selectionId == res?.selectionID
            );
            return {
              ...res,
              position: obj?.position ? obj?.position : 0,
              newPosition: 0,
            };
          })
          : current?.map((res) => {
            return {
              ...res,
              position: 0,
              newPosition: 0,
            };
          })
      );
    } else if (type == "fancy") {
      setFancyCategoryTabArray((current) =>
        fancyPosition?.length > 0
          ? current?.map((res) => {
            let obj = fancyPosition?.find(
              (item) =>
                item.selectionId == res.selectionId &&
                item.fancyName == res.fancyName
            );
            return {
              ...res,
              position: obj?.position ? obj.position : 0,
              type: obj?.type,
              newPosition: 0,
            };
          })
          : current?.map((res) => {
            return {
              ...res,
              newPosition: 0,
            };
          })
      );
      setFancyList((current) =>
        fancyPosition?.length > 0
          ? current?.map((res) => {
            let obj = fancyPosition?.find(
              (item) =>
                item.selectionId == res.selectionId &&
                item.fancyName == res.fancyName
            );
            return {
              ...res,
              position: obj?.position ? obj.position : 0,
              type: obj?.type,
              newPosition: 0,
            };
          })
          : current?.map((res) => {
            return {
              ...res,
              newPosition: 0,
            };
          })
      );
    } else if (type == "premiumFancy") {
      setPremiumFancy((current) => {
        return premiumFancyPosition?.length > 0
          ? current?.map((res) => {
            let obj = premiumFancyPosition?.find(
              (item) =>
                item?.fancyName == res?.marketName &&
                res?.id == item?.marketId
            );
            return obj?.marketId == res?.id &&
              obj?.fancyName == res?.marketName
              ? {
                ...res,
                sportsBookSelection: res?.sportsBookSelection?.map(
                  (temp) => {
                    return temp?.id == obj?.selectionId &&
                      temp?.selectionName == obj?.runnerName
                      ? {
                        ...temp,
                        position: obj?.profitAmount,
                        newPosition: 0,
                      }
                      : {
                        ...temp,
                        position: obj?.loseAmount,
                        newPosition: 0,
                      };
                  }
                ),
              }
              : res;
          })
          : current;
      });
    }
  };
  const handelBetFairPositions = (slipObj) => {
    let temp = [...selections];
    let newselection = temp.map((data) => {
      let positionTemp = [...tempSelection].find(
        (el) => el.selectionId == data.SelectionId
      )?.position;
      data.position = positionTemp ? positionTemp : 0;
      return data;
    });
    setSelections(newselection);
    let selectionsTemp = [...newselection];
    if (betSelectionObj?.bidPrice > 0) {
      if (slipObj.ib) {
        let currentPosition = selectionsTemp.find(
          (rl) => rl.SelectionId == slipObj.ri
        );
        let otherTeamPosition;
        let thirdTeamPosition;
        if (slipObj.teamName == "The Draw") {
          otherTeamPosition = selectionsTemp[0];
          thirdTeamPosition = selectionsTemp[1];
        } else {
          otherTeamPosition = selectionsTemp.find(
            (rl) => rl.SelectionId !== slipObj.ri && rl.RunnerName != "The Draw"
          );
          thirdTeamPosition = selectionsTemp[2] ? selectionsTemp[2] : false;
        }
        let backProfit = (slipObj.rt - 1) * betSelectionObj?.bidPrice;
        let backLoss = betSelectionObj?.bidPrice;
        if (
          Math.abs(selectionsTemp[0]?.position) !== 0 &&
          Math.abs(selectionsTemp[1]?.position) !== 0
        ) {
          currentPosition.newPosition = currentPosition.position + backProfit;
          otherTeamPosition.newPosition = otherTeamPosition.position - backLoss;
          if (thirdTeamPosition) {
            thirdTeamPosition.newPosition =
              thirdTeamPosition.position - backLoss;
          }
          const result = selectionsTemp.map((data) => {
            if (data.SelectionId == currentPosition.SelectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition.toFixed(2))
                : 0;
            }
            if (data.SelectionId == otherTeamPosition.SelectionId) {
              data.newPosition = otherTeamPosition.newPosition
                ? parseFloat(otherTeamPosition.newPosition.toFixed(2))
                : 0;
            }
            if (
              thirdTeamPosition &&
              data.SelectionId == thirdTeamPosition.SelectionId
            ) {
              data.newPosition = thirdTeamPosition.newPosition
                ? parseFloat(thirdTeamPosition.newPosition.toFixed(2))
                : 0;
            }
            return data;
          });
          setSelections(result);
        } else {
          currentPosition.newPosition = backProfit;
          otherTeamPosition.newPosition = -backLoss;
          if (thirdTeamPosition) {
            thirdTeamPosition.newPosition = -backLoss;
          }
          const result = selectionsTemp.map((data) => {
            if (data.SelectionId == currentPosition.SelectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition.toFixed(2))
                : 0;
            }
            if (data.SelectionId == otherTeamPosition.SelectionId) {
              data.newPosition = otherTeamPosition.newPosition
                ? parseFloat(otherTeamPosition.newPosition.toFixed(2))
                : 0;
            }
            if (
              thirdTeamPosition &&
              data.SelectionId == thirdTeamPosition.SelectionId
            ) {
              data.newPosition = thirdTeamPosition.newPosition
                ? parseFloat(thirdTeamPosition.newPosition.toFixed(2))
                : 0;
            }
            return data;
          });
          setSelections(result);
        }
      } else {
        let currentPosition = selectionsTemp.find(
          (rl) => rl.SelectionId == slipObj.ri
        );
        let otherTeamPosition;
        let thirdTeamPosition;
        if (slipObj.teamName == "The Draw") {
          otherTeamPosition = selectionsTemp[0];
          thirdTeamPosition = selectionsTemp[1];
        } else {
          otherTeamPosition = selectionsTemp.find(
            (rl) => rl.SelectionId !== slipObj.ri && rl.RunnerName != "The Draw"
          );
          thirdTeamPosition = selectionsTemp[2] ? selectionsTemp[2] : false;
        }

        if (
          Math.abs(selectionsTemp[0]?.position) !== 0 &&
          Math.abs(selectionsTemp[1]?.position) !== 0
        ) {
          let backProfit = betSelectionObj?.bidPrice;
          let backLoss = (slipObj.rt - 1) * betSelectionObj?.bidPrice;
          currentPosition.newPosition =
            Number(currentPosition?.position) - Number(backLoss);
          otherTeamPosition.newPosition =
            Number(otherTeamPosition?.position) + Number(backProfit);
          if (thirdTeamPosition) {
            thirdTeamPosition.newPosition =
              Number(thirdTeamPosition?.position) + Number(backProfit);
          }
          const result = selectionsTemp.map((data) => {
            if (data?.SelectionId == currentPosition?.SelectionId) {
              data.newPosition = currentPosition?.newPosition
                ? parseFloat(currentPosition?.newPosition)
                : 0;
            }
            if (data?.SelectionId == otherTeamPosition?.SelectionId) {
              data.newPosition = otherTeamPosition?.newPosition
                ? parseFloat(otherTeamPosition?.newPosition)
                : 0;
            }
            if (
              thirdTeamPosition &&
              data?.SelectionId == thirdTeamPosition?.SelectionId
            ) {
              data.newPosition = thirdTeamPosition?.newPosition
                ? parseFloat(thirdTeamPosition?.newPosition)
                : 0;
            }
            return data;
          });
          setSelections(result);
        } else {
          let backProfit = betSelectionObj?.bidPrice;
          let backLoss = (slipObj.rt - 1) * betSelectionObj?.bidPrice;
          currentPosition.newPosition = -Number(backLoss);
          otherTeamPosition.newPosition = Number(backProfit);
          if (thirdTeamPosition) {
            thirdTeamPosition.newPosition = Number(backProfit);
          }
          const result = selectionsTemp.map((data) => {
            if (data?.SelectionId == currentPosition?.SelectionId) {
              data.newPosition = currentPosition?.newPosition
                ? parseFloat(currentPosition?.newPosition)
                : 0;
            }
            if (data?.SelectionId == otherTeamPosition?.SelectionId) {
              data.newPosition = otherTeamPosition?.newPosition
                ? parseFloat(otherTeamPosition?.newPosition)
                : 0;
            }
            if (
              thirdTeamPosition &&
              data?.SelectionId == thirdTeamPosition?.SelectionId
            ) {
              data.newPosition = thirdTeamPosition?.newPosition
                ? parseFloat(thirdTeamPosition?.newPosition)
                : 0;
            }
            return data;
          });
          setSelections(result);
        }
      }
    }
  };
  const handelBookmakerPositions = (slipObj) => {
    if (betSelectionObj?.bidPrice >= 0) {
      if (slipObj.ib) {
        let currentPosition = bookmakerSelections.find(
          (rl) => rl.selectionID == slipObj.selectionID
        );
        let otherTeamPosition = bookmakerSelections.find(
          (rl) =>
            rl.selectionID !== slipObj.selectionID &&
            rl.runnerName != "The Draw"
        );
        if (
          Math.abs(bookmakerSelections[0]?.position) !== 0 &&
          Math.abs(bookmakerSelections[1]?.position) !== 0
        ) {
          let backProfit = (slipObj.rt - 1) * betSelectionObj?.bidPrice;
          let backLoss = betSelectionObj?.bidPrice;
          currentPosition.newPosition = currentPosition.position + backProfit;
          otherTeamPosition.newPosition = otherTeamPosition.position - backLoss;

          const result = bookmakerSelections.map((data) => {
            if (data.selectionID == currentPosition.selectionID) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            if (data.selectionID == otherTeamPosition.selectionID) {
              data.newPosition = otherTeamPosition.newPosition
                ? parseFloat(otherTeamPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setBookmakerSelections(result);
        } else {
          let backProfit = (slipObj.rt - 1) * betSelectionObj?.bidPrice;
          let backLoss = betSelectionObj?.bidPrice;
          currentPosition.newPosition = backProfit;
          otherTeamPosition.newPosition = -backLoss;

          const result = bookmakerSelections?.map((data) => {
            if (data.selectionID == currentPosition.selectionID) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            if (data.selectionID == otherTeamPosition.selectionID) {
              data.newPosition = otherTeamPosition.newPosition
                ? parseFloat(otherTeamPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setBookmakerSelections(result);
        }
      } else {
        let currentPosition = bookmakerSelections.find(
          (rl) => rl.selectionID == slipObj.selectionID
        );
        let otherTeamPosition = bookmakerSelections.find(
          (rl) =>
            rl.selectionID !== slipObj.selectionID &&
            rl.runnerName != "The Draw"
        );
        if (
          Math.abs(bookmakerSelections[0]?.position) !== 0 &&
          Math.abs(bookmakerSelections[1]?.position) !== 0
        ) {
          let backProfit = betSelectionObj?.bidPrice;
          let backLoss = (slipObj.rt - 1) * betSelectionObj?.bidPrice;
          currentPosition.newPosition = currentPosition.position - backLoss;
          otherTeamPosition.newPosition =
            otherTeamPosition.position + backProfit;
          const result = bookmakerSelections.map((data) => {
            if (data.selectionID == currentPosition.selectionID) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            if (data.selectionID == otherTeamPosition.selectionID) {
              data.newPosition = otherTeamPosition.newPosition
                ? parseFloat(otherTeamPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setBookmakerSelections(result);
        } else {
          let backProfit = betSelectionObj?.bidPrice;
          let backLoss = (slipObj.rt - 1) * betSelectionObj?.bidPrice;
          currentPosition.newPosition = -backLoss;
          otherTeamPosition.newPosition = backProfit;
          const result = bookmakerSelections.map((data) => {
            if (data.selectionID == currentPosition.selectionID) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            if (data.selectionID == otherTeamPosition.selectionID) {
              data.newPosition = otherTeamPosition.newPosition
                ? parseFloat(otherTeamPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setBookmakerSelections(result);
        }
      }
    }
  };
  const handelFancyPositions = (slipObj) => {
    if (betSelectionObj?.bidPrice >= 0) {
      if (slipObj.ib) {
        let currentPosition = fancyList.find(
          (rl) => rl.selectionId == slipObj.selectionId
        );
        if (
          Math.abs(currentPosition.position) !== 0 &&
          !isEmpty(currentPosition.type)
        ) {
          let backLoss = betSelectionObj?.bidPrice + currentPosition.position;
          currentPosition.newPosition = backLoss;
          const result = fancyList.map((data) => {
            if (data.selectionId == currentPosition.selectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setFancyCategoryTabArray(result);
          setFancyList(result);
        } else {
          let backLoss = betSelectionObj?.bidPrice;
          currentPosition.newPosition = backLoss;
          const result = fancyList.map((data) => {
            if (data.selectionId == currentPosition.selectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setFancyCategoryTabArray(result);
          setFancyList(result);
        }
      } else {
        let currentPosition = fancyList.find(
          (rl) => rl.selectionId == slipObj.selectionId
        );
        if (
          !isNaN(Math.abs(currentPosition.position)) &&
          !isEmpty(currentPosition.type)
        ) {
          let backProfit =
            (betSelectionObj?.bidPrice * betSelectionObj.fancyOddSelect) / 100;
          currentPosition.newPosition = backProfit + currentPosition.position;
          const result = fancyList.map((data) => {
            if (data.selectionId == currentPosition.selectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setFancyCategoryTabArray(result);
          setFancyList(result);
        } else {
          let backProfit =
            (betSelectionObj?.bidPrice * betSelectionObj.fancyOddSelect) / 100;
          currentPosition.newPosition = backProfit;
          const result = fancyList.map((data) => {
            if (data.selectionId == currentPosition.selectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setFancyCategoryTabArray(result);
          setFancyList(result);
        }
      }
    }
  };
  const handelPreminumFancyPositions = (slipObj) => {
    if (betSelectionObj?.bidPrice >= 0) {
      let backProfit =
        (betSelectionObj.oddsSelect - 1) * betSelectionObj?.bidPrice;
      let backLoss = betSelectionObj?.bidPrice;
      setPremiumFancy((current) => {
        return current?.map((rl) =>
          rl?.id === slipObj?.newMarketId
            ? {
              ...rl,
              sportsBookSelection: rl?.sportsBookSelection?.map((res) => {
                return res.id === slipObj.selectId
                  ? {
                    ...res,
                    position:
                      res.position !== 0 && !isNaN(Math.abs(res.position))
                        ? res.position
                        : 0,
                    newPosition:
                      res.position !== 0 && !isNaN(Math.abs(res.position))
                        ? Number(backProfit) + Number(res.position)
                        : Number(backProfit),
                  }
                  : {
                    ...res,
                    position:
                      res.position !== 0 && !isNaN(Math.abs(res.position))
                        ? res.position
                        : 0,
                    newPosition:
                      res.position !== 0 && !isNaN(Math.abs(res.position))
                        ? Number(backLoss) - Number(res.position)
                        : -Number(backLoss),
                  };
              }),
            }
            : rl
        );
      });
      // setPremiumFancy((current) => {
      //   return current?.map((rl) =>
      //     rl.marketId === slipObj.marketId
      //       ? {
      //           ...rl,
      //           runners: rl.runners?.map((res) => {
      //             return res.runnerId === slipObj.selectId
      //               ? {
      //                   ...res,
      //                   position:
      //                     res.position !== 0 && !isNaN(Math.abs(res.position))
      //                       ? res.position
      //                       : 0,
      //                   newPosition:
      //                     res.position !== 0 && !isNaN(Math.abs(res.position))
      //                       ? Number(backProfit) + Number(res.position)
      //                       : Number(backProfit),
      //                 }
      //               : {
      //                   ...res,
      //                   position:
      //                     res.position !== 0 && !isNaN(Math.abs(res.position))
      //                       ? res.position
      //                       : 0,
      //                   newPosition:
      //                     res.position !== 0 && !isNaN(Math.abs(res.position))
      //                       ? Number(backLoss) - Number(res.position)
      //                       : -Number(backLoss),
      //                 };
      //           }),
      //         }
      //       : rl
      //   );
      // });
    }
  };
  useEffect(() => {
    if (
      !isEmpty(slipObj) &&
      betSelectionObj?.betType == "betFair" &&
      betSelectionObj?.bidPrice > 0
    ) {
      handelBetFairPositions(slipObj);
    } else if (
      !isEmpty(slipObj) &&
      betSelectionObj?.betType == "bookmaker" &&
      betSelectionObj?.bidPrice > 0
    ) {
      handelBookmakerPositions(slipObj);
    } else if (
      !isEmpty(slipObj) &&
      betSelectionObj?.betType == "fancy" &&
      betSelectionObj?.bidPrice > 0
    ) {
      handelFancyPositions(slipObj);
    } else if (
      !isEmpty(slipObj) &&
      betSelectionObj?.betType == "premiumFancy" &&
      betSelectionObj?.bidPrice > 0
    ) {
      handelPreminumFancyPositions(slipObj);
    }
  }, [
    betSelectionObj?.bidPrice,
    slipObj,
    betSelectionObj?.oddsSelect,
    betSelectionObj?.betType,
  ]);
  let header1 = document.getElementById("headerMain1")
    ? Number(document.getElementById("headerMain1")?.offsetHeight)
    : 0;
  let header2 = document.getElementById("headerMain2")
    ? Number(document.getElementById("headerMain2")?.offsetHeight)
    : 0;
  let videoFrame = document?.getElementById("videoFrame")?.offsetHeight
    ? Number(document?.getElementById("videoFrame")?.offsetHeight)
    : 0;
  let [pop, setPop] = useState("");
  useEffect(() => {
    const check = () => {
      if (pop && y >= 280 && isTv?.status && isTv?.id !== "") {
        return header1 + header2;
      } else if (isTv?.status && isTv?.id !== "") {
        return header1 + header2 + videoFrame;
      } else {
        return header1 + header2;
      }
    };

    let temp = check();
    if (!isEmpty(user)) {
      var allElements = document.getElementsByTagName("*");
      for (var i = 0, len = allElements.length; i < len; i++) {
        var element = allElements[i];
        element.style.scrollMarginTop = `${temp}px`;
      }
    }
    if (key == "Fancy Bet") {
      if (
        fancyCategoryTabArray?.filter((res) => res.odds?.rt?.length > 0)
          ?.length > 7
      ) {
        setPop(true);
      } else {
        setPop(false);
      }
    } else if (key == "Preminum Fancy") {
      if (preminumFancy?.length >= 12) {
        setPop(true);
      } else {
        setPop(false);
      }
    }
    // setPop(
    //   key == "Fancy Bet"
    //     ? fancyCategoryTabArray?.filter((res) => res.odds?.rt?.length > 0)
    //         ?.length >= 6
    //     : preminumFancy?.length >= 12
    // );
  }, [y, key, details, preminumFancy, fancyList, betSelectionObj]);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);
  let timeDiff = moment.duration(
    moment(details.eventDateTime).diff(moment(new Date()))
  )?._data;
  let temp =
    timeDiff?.days <= 0 &&
    timeDiff?.hours <= 1 &&
    timeDiff?.years <= 0 &&
    timeDiff?.months <= 0 &&
    timeDiff?.minutes <= 5;
  const [controls, setControls] = useState(true);
  useEffect(() => {
    // if (ref?.current?.getSecondsLoaded() > 0) {
    const timeoutID = window.setTimeout(() => {
      setControls(false);
    }, 4000);
    return () => window.clearTimeout(timeoutID);
    // }
  }, [controls]);
  const [minSportBook, setMinSportBook] = useState(0);
  // useEffect(() => {
  //   if (!isEmpty(user)) {
  //     let obj = (
  //       details?.matchSetting?.length > 0
  //         ? details?.matchSetting
  //         : profileData?.matchSetting
  //     )?.find(
  //       (res) =>
  //         res?.type == "sportBook" &&
  //         (details?.matchSetting?.length > 0
  //           ? details?.matchSetting
  //           : profileData?.matchSetting
  //           ? true
  //           : res?.sportType == details?.gameType)
  //     );
  //     if (!isEmpty(obj)) {
  //       setMinSportBook(Number(obj?.minAmount));
  //     }
  //   }
  // }, [details]);
  const [seek, setSeek] = useState(true);
  const ref = useRef(null);
  useEffect(() => {
    if (isTv?.status) {
      setControls(true);
    }
  }, [isTv]);
  return (
    <>
      <div id="mainWrap" className="mainWrap">
        {!isEmpty(user) && details?.status == "in_play" && temp ? (
          isTv?.id !== "false" && isTv?.status ? (
            <div
              className={
                pop && y >= 280 ? "is-outside vedio_wrap" : "vedio_wrap"
              }
            >
              {controls && (
                <div className="tv-control vedio_up_icon">
                  <a
                    class="close"
                    id="closeStreamingBox"
                    href="javascript:void(0)"
                    onClick={() => {
                      setIsTv({ ...isTv, status: false });
                      setSeek(true);
                    }}
                    style={{ display: "flex" }}
                  >
                    Close
                  </a>
                </div>
              )}
              {pop && y >= 280
                ? ""
                : controls && (
                  <div
                    className="tv-control vedio_up_icon"
                    style={{ marginBottom: "20px" }}
                  >
                    <a
                      class={mute ? "btn-volume_off" : "btn-volume_on"}
                      onClick={() => setMute(!mute)}
                      href="javascript:void(0)"
                      id="mute"
                    >
                      Close
                    </a>
                    <a
                      className="btn-line"
                      href="javascript:void(0)"
                      id="changeLineBtn"
                    >
                      <span id="tvLine">4</span>
                    </a>
                  </div>
                )}
              {ref?.current?.getSecondsLoaded() == null ||
                ref?.current?.getSecondsLoaded() == 0 ? (
                <div
                  className="tv-control live_img"
                  style={{
                    padding: "0",
                    margin: "0",
                    width: "100%",
                    height: "100%",
                    // overflowY: "hidden",
                  }}
                >
                  <img
                    src={LoadingImage}
                    alt="Thumbnail"
                    onClick={() => setControls(true)}
                    style={{
                      overflowY: "hidden",
                      height: "auto",
                      width: "100%",
                      overflowX: "hidden",
                      overflowY: "hidden",
                    }}
                  />
                </div>
              ) : (
                ""
              )}
              <ReactPlayer
                muted={mute}
                controls={false}
                ref={ref}
                // light={LoadingImage}
                // light={
                //   <img
                //     src={LoadingImage}
                //     alt="Thumbnail"
                //     width="100%"
                //     height="auto"
                //   />
                // }
                // onBufferEnd={(e) => console.log(e, "play")}
                // onSeek={(e) => {
                //   console.log(e, "eeeeeeeeeeeeeeeee");
                //   setSeek(!isNumber(e));
                // }}
                playsinline={true}
                loop={true}
                playing={true}
                id="videoFrame"
                style={{
                  overflowX: "hidden",
                  overflow: "hidden",
                  backgroundColor: "#000000",
                }}
                onClick={() => setControls(true)}
                width="100%"
                height="auto"
                url={
                  details?.adsStatus
                    ? details?.adsContent
                    : `https://mediasrv789-ss247-23-prod-sa-ulivestreaming.com/${details.channel}/index.m3u8`
                }
                // onError={(e) => e == "hlsError" && window.location.reload()}
                config={{
                  file: {
                    attributes: {
                      preload: "none",
                      //forceHLS: true,
                    },
                    hlsOptions: {
                      //autoStartLoad: false,
                      startLevel: 3,
                    },
                  },
                }}
              />
            </div>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        <div className="game-wrap">
          <h4 id="gameInfo" class="game-info">
            {obj?.matchType[details?.gameType]}
            <ul id="infoIcon" class="info-icon">
              {scoreId !== "0" && details?.status == "in_play" ? (
                <li id="inPlayIcon">
                  <img
                    className="info-inplay"
                    src={
                      process.env.REACT_APP_URL +
                      "/assets/images/home/transparent.gif"
                    }
                  />
                  In-Play
                </li>
              ) : (
                <li>
                  {/* <span id="lowLiquidityTag" class="game-low_liq">
                    Low Liquidity
                  </span> */}
                </li>
              )}
            </ul>
          </h4>

          {scoreId !== "0" && !isEmpty(user) ? (
            <div id="matchTrackerWrap" className="match-tracker-wrap">
              <iframe
                className="responsive-iframe w-100"
                // style={{
                //   height: "180px",
                //   width: "100%",
                //   backgroundColor:"black"
                // }}
                style={{
                  overflowX: "hidden",
                  overflow: "hidden",
                  height: "180px",
                  backgroundColor: "#000000",
                }}
                // scrolling="no"
                // autoplay="true"
                // preload=""
                id="scoreId"
                // playsinline=""
                // id="videoFrame"
                src={`https://www.satsports.net/score_widget/index.html?id=${details.scoreId}`}
              ></iframe>
              <ul class="match-btn" style={{ paddingBottom: "10px" }}>
                <li>
                  <a
                    onClick={() => {
                      if (isEmpty(user)) {
                        navigate("/login");
                      } else {
                        handelAddMultiMarket(parmas?.eventId);
                      }
                    }}
                    id="liveMultiMarketPin"
                    href="javascript:void(0)"
                    className={
                      !isEmpty(details?.multi_market)
                        ? "btn-pin select"
                        : "btn-pin"
                    }
                  >
                    Pin
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    class="btn-refresh"
                    onClick={() => {
                      getMatchDetails();
                    }}
                  >
                    Refresh
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <table
                id="gameTeam"
                class="game-team"
                style={{ background: "#172832", color: "white" }}
              >
                <tbody>
                  <tr>
                    <th>
                      <a
                        onClick={() => {
                          if (isEmpty(user)) {
                            navigate("/login");
                          } else {
                            handelAddMultiMarket(parmas?.eventId);
                          }
                        }}
                        id="multiMarketPin"
                        className={
                          !isEmpty(details?.multi_market) ? "pin-on" : "pin-off"
                        }
                        href="javascript:void(0)"
                      ></a>
                      <h4 id="teamHome">{details?.eventName?.split("v")[0]}</h4>
                      <h4 id="teamAway">{details?.eventName?.split("v")[1]}</h4>
                      <ul id="time" class="scores-time">
                        {temp.days == 0 &&
                          temp.hours == 0 &&
                          temp?.years == 0 &&
                          temp?.months == 0 &&
                          temp.minutes > 0 &&
                          temp?.minutes < profileData?.beforeInPlay ? (
                          <span id="dateTimeInfo" className="time">
                            Starting in {temp?.minutes}'
                          </span>
                        ) : details.status == "in_play" ? (
                          <span id="dateTimeInfo" className="time">
                            {/* In-Play {details?.timeElapsed} */}
                            {helpers.matchDateTime(details.eventDateTime)}
                          </span>
                        ) : (
                          <span id="dateTimeInfo" className="time">
                            {helpers.matchDateTime(details.eventDateTime)}
                          </span>
                        )}
                      </ul>
                    </th>
                    <td class="team-refresh">
                      <a
                        id="refresh"
                        class="refresh"
                        href="javascript:void(0)"
                        onClick={() => {
                          getMatchDetails();
                        }}
                      ></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
        {/* {scoreId !== "0" ? (
          ""
        ) : (
          <ul class="match-btn" style={{ paddingBottom: "10px" }}>
            <li>
              <a
                onClick={() => {
                  if (isEmpty(user)) {
                    navigate("/login");
                  } else {
                    handelAddMultiMarket(parmas.eventId);
                  }
                }}
                id="liveMultiMarketPin"
                href="javascript:void(0)"
                className={
                  !isEmpty(details.multi_market) ? "btn-pin select" : "btn-pin"
                }
              >
                Pin
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                class="btn-refresh"
                onClick={() => {
                  getMatchDetails();
                }}
              >
                Refresh
              </a>
            </li>
          </ul>
        )} */}
        {details?.matchOdds == "on" &&
          selections?.length > 0 &&
          back_odds?.length > 0 &&
          back_odds?.length > 0 && (
            <div id="naviMarket" className="market-type ps ps--theme_default">
              <ul id="naviMarketList">
                {/* <li id="naviAllMarketTemaplate">
              <a href="#">
                All<span className="icon-arrow_down"></span>
              </a>
            </li> */}
                {selections?.length > 0 &&
                  back_odds?.length > 0 &&
                  back_odds?.length > 0 && (
                    <li id="naviMarket_1_207539177" className="select">
                      <a href="#">Match Odds</a>
                    </li>
                  )}
              </ul>
            </div>
          )}
        {details?.matchOdds == "on" &&
          selections?.length > 0 &&
          back_odds?.length > 0 &&
          back_odds?.length > 0 && (
            <MatchDetails
              selections={selections}
              back_odds={back_odds}
              betFairMs={betFairMs}
              lay_odds={lay_odds}
              messaageBox={messaageBox}
              details={details}
              setSlipObj={setSlipObj}
              setMarketDepth={setMarketDepth}
              tempSelection={tempSelection}
              setSelections={setSelections}
              slipObj={slipObj}
              user={user}
              loader={loader}
              setLoader={setLoader}
              betType="betFair"
              handelBetFairPositions={handelBetFairPositions}
              resetSelection={resetSelection}
              setCondi={setCondi}
              profileData={
                details?.matchSetting?.length > 0
                  ? { ...details, arrayCheck: "details" }
                  : { ...profileData, arrayCheck: "profile" }
              }
            />
          )}
        {details?.bookMaker == "on" && bookmakerSelections?.length > 0 && (
          <Bookmaker
            betType="bookmaker"
            data={bookmakerSelections}
            bookmakerObj={bookmakerData}
            details={details}
            back_odds={bookmakerBackOdds || []}
            lay_odds={bookmakerLayOdds || []}
            setSlipObj={setSlipObj}
            handelBookmakerPositions={handelBookmakerPositions}
            slipObj={slipObj}
            messaageBox={messaageBox}
            resetSelection={resetSelection}
            profileData={
              details?.matchSetting?.length > 0
                ? { ...details, arrayCheck: "details" }
                : { ...profileData, arrayCheck: "profile" }
            }
            user={user}
          // handelBetFairPositions={handelBetFairPositions}
          />
        )}
        {/* Fancy Listing  */}
        {details?.fancy == "off" && details?.premiumFancy == "off" ? (
          ""
        ) : fancyCategoryTabArray?.filter((res) => res?.odds?.rt?.length > 0)
          ?.length > 0 || preminumFancy?.length > 0 ? (
          <div
            id={
              key == "Fancy Bet" ? "fancyBetTable_32011225" : "sportsBookWrap"
            }
            style={{
              display: "block",
              marginBottom:
                fancyCategoryTabArray?.filter(
                  (res) => res?.odds?.rt?.length > 0
                )?.length > 0 || preminumFancy?.length > 0
                  ? "90px"
                  : "0",
              background: "#e0e6e",
            }}
          >
            <div
              id={key == "Fancy Bet" ? "fancyBetHead" : "sportsBookHead"}
              className={
                key == "Fancy Bet" ? "fancy_bet-head" : "sportsbook_bet-head"
              }
            >
              <h4
                className="in-play"
                onClick={() => {
                  setKey(key == "Fancy Bet" ? "Fancy Bet" : "Preminum Fancy");
                  setPopupMessage(false);
                }}
              >
                {key == "Fancy Bet" &&
                  details?.fancy == "on" &&
                  details?.gameType == "cricket" ? (
                  <span>
                    <pre>in-play</pre>
                    Fancy Bet
                  </span>
                ) : (
                  details?.premiumFancy == "on" && (
                    <span>
                      <pre>in-play</pre>
                      Preminum Fancy
                    </span>
                  )
                )}
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    key == "Fancy Bet"
                      ? setFancyRules(true)
                      : setPremiumFancyRules(true);
                    setPopupMessage(false);
                  }}
                  className="btn-head_rules"
                >
                  Rules
                </a>
              </h4>

              {/* <a
              href="javascript:void(0)"
              id="showSportsBookBtn"
              onClick={() => {
                setKey(key !== "Fancy Bet" ? "Fancy Bet" : "Preminum Fancy");
                setPopupMessage(false);
              }}
              className="other-tab"
            >
              {key == "Fancy Bet" && <span className="tag-new">New</span>}
              {key !== "Fancy Bet" ? "Fancy Bet" : "Preminum Fancy"}
            </a> */}

              {key == "Fancy Bet" ? (
                !isEmpty(user) ? (
                  details?.premiumFancy == "on" ? (
                    <a
                      href="javascript:void(0)"
                      id="showSportsBookBtn"
                      onClick={() => {
                        setKey("Preminum Fancy");
                        setPopupMessage(false);
                      }}
                      className="other-tab"
                    >
                      <span className="tag-new">New</span>
                      Preminum Fancy
                    </a>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )
              ) : details?.gameType == "cricket" && details?.fancy == "on" ? (
                fancyList?.length > 0 && (
                  <a
                    href="javascript:void(0)"
                    id="showSportsBookBtn"
                    onClick={() => {
                      setKey("Fancy Bet");
                      setPopupMessage(false);
                    }}
                    className="other-tab"
                  >
                    Fancy Bet
                  </a>
                )
              ) : (
                ""
              )}
              {key == "Preminum Fancy" && (
                <>
                  <a
                    id="minMaxBtn_2"
                    onClick={() => setPopupMessage(true)}
                    href="javascript:void(0)"
                    class="btn-fancy_info"
                  >
                    Min
                  </a>
                  {popupMessage && (
                    <div
                      id="minMaxWrap_2"
                      class="fancy_info-popup"
                      style={{ display: "flex" }}
                    >
                      <dl>
                        <dt>Min</dt>
                        <dd id="minMaxInfo_2">{minSportBook}</dd>
                      </dl>

                      <a
                        href="javascript:void(0)"
                        onClick={() => setPopupMessage(false)}
                        class="close"
                      >
                        Close
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
            {key == "Fancy Bet" &&
              details.fancy == "on" &&
              details?.gameType == "cricket" ? (
              <Fancy
                betType="fancy"
                data={fancyCategoryTabArray || []}
                details={details}
                back_odds={[]}
                lay_odds={[]}
                setSlipObj={setSlipObj}
                isTv={isTv}
                resetSelection={resetSelection}
                slipObj={slipObj}
                key={key}
                loader={loader}
                messaageBox={messaageBox}
                setIsTv={setIsTv}
                fancyCategory={fancyCategory}
                setSelectedTabFunc={setSelectedTabFunc}
                selectedTab={selectedTab}
                profileData={
                  details?.matchSetting?.length > 0
                    ? { ...details, arrayCheck: "details" }
                    : { ...profileData, arrayCheck: "profile" }
                }
                user={user}
              />
            ) : key == "Preminum Fancy" &&
              !isEmpty(user) &&
              details?.premiumFancy == "on" ? (
              <PremiumFancyNew
                preminumFancyTab={preminumFancyTab}
                setSelectedTabFuncPreminum={setSelectedTabFuncPreminum}
                data={preminumFancy || []}
                betType={"premiumFancy"}
                setSlipObj={setSlipObj}
                setPremiumFancy={setPremiumFancy}
                slipObj={slipObj}
                resetSelection={resetSelection}
                key={key}
                messaageBox={messaageBox}
                details={details}
                profileData={
                  details?.matchSetting?.length > 0
                    ? { ...details, arrayCheck: "details" }
                    : { ...profileData, arrayCheck: "profile" }
                }
                user={user}
              />
            ) : (
              // <PreminumFancy
              //   preminumFancyTab={preminumFancyTab}
              //   setSelectedTabFuncPreminum={setSelectedTabFuncPreminum}
              //   data={preminumFancy || []}
              //   betType={"premiumFancy"}
              //   setSlipObj={setSlipObj}
              //   slipObj={slipObj}
              //   details={details}
              //   profileData={profileData}
              //   user={user}
              // />
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
export default BidDetail;
