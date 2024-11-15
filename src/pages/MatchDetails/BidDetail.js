import { cond, isEmpty } from "lodash";
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
import { ConsoleView } from "react-device-detect";
import PreminumFancy from "./PreminumFancy";
import PremiumFancyLatest from "./PremiumFancyLatest";
// import PreminumFancyNew from "./OldPremiumFancy";
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
    setUpdatePosition,
    updatePosition
  } = useContext(BetSlipContext);
  const location = useLocation();
  const { y } = useScrollPosition();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [details, setDetails] = useState({});
  const [totalMatched, setTotalMatched] = useState({});
  const [selections, setSelections] = useState([]);
  const [position, setPosition] = useState({});
  const [bookmakerData, setBookmerData] = useState({});
  const [bookmakerSelections, setBookmakerSelections] = useState([]);
  const [back_odds, setBackOdds] = useState([]);
  const [lay_odds, setLayOdds] = useState([]);
  const [tempSelection, setTempSelection] = useState([]);
  const [selectionDemo, setSelectionDemo] = useState([]);
  const [fancyList, setFancyList] = useState([]);
  const [premiumFancyList, setPremiumFancyList] = useState([]);
  const [betFairMs, setBetFairMs] = useState(1);
  const [fancyPosition, setFancyPosition] = useState([]);
  const [premiumFancyPosition, setPremiumFancyPosition] = useState([]);
  const [bookmakerBackOdds, setBookmakerBackOdds] = useState([]);
  const [bookmakerLayOdds, setBookmakerLayOdds] = useState([]);
  const [fancyCentralizedIdArray, setFancyCentralizedIdArray] = useState([]);
  const [matchCentralizedIds, setMatchCentralizedIds] = useState({});
  const [fancyCategory, setFancyCategory] = useState([]);
  const [premiumFancyCategory, setPremiumFancyCategory] = useState([]);
  const [fancyCategoryTabArray, setFancyCategoryTabArray] = useState([]);
  const [premiumFancyCategoryTabArray, setPremiumFancyCategoryTabArray] = useState([]);
  const [preminumFancy, setPremiumFancy] = useState([]);
  const [preminumFancyTab, setPremiumFancyTab] = useState([]);
  const [mute, setMute] = useState(true);
  const [condi, setCondi] = useState(false);
  const [key, setKey] = useState("Fancy Bet");
  const [popupMessage, setPopupMessage] = useState(false);
  const [slipObj, setSlipObj] = useState({});
  const [selectedTab, setSelectedTab] = useState("All");
  const [scoreId, setScoreId] = useState("0");
  const [minSportBook, setMinSportBook] = useState(0);
  const [online, setOnline] = useState(false);
  const [seek, setSeek] = useState(true);
  const ref = useRef(null);
  const setSelectedTabFunc = (id) => {
    if (id == "All") {
      setFancyCategoryTabArray(fancyList);
    } else if (id == "More") {
      let arr = fancyList?.filter(
        (res) =>
          res?.categoryType !== 1 &&
          res?.categoryType !== 2 &&
          res?.categoryType !== 3 &&
          res?.categoryType !== 4 &&
          res?.categoryType !== 5 &&
          res?.categoryType !== 6 &&
          res?.categoryType !== 7 &&
          res?.categoryType !== 8 &&
          res?.categoryType !== 9 &&
          res?.categoryType !== 10 &&
          res?.categoryType !== 11 &&
          res?.categoryType !== 14
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
  useEffect(() => {
    localStorage.setItem("catType", "All")
  }, [])


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
              response_users?.results?.channel == 'false' ||
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
          setTotalMatched(response_users?.results?.totalMatched);
          setLoader(false);
          setMatchCentralizedIds(result);
          setSelectionDemo(response_users?.results?.jsonData || []);
          setSelections(response_users?.results?.jsonData || []);
          setTempSelection(response_users?.results?.jsonData || []);
          setBookmakerSelections(response_users?.results?.jsonData || []);
          setFancyList(response_users?.results?.fancyList || []);
          // console.log(
          //   response_users?.results?.fancyList,
          //   "response_users?.results?.fancyList"
          // );
          if (
            response_users?.results?.gameType == "cricket" &&
            !response_users?.results?.eventName?.includes(" SRL ")
          ) {
            if (
              response_users?.results?.fancyList?.length == 0 &&
              !isEmpty(user)
            ) {
              if (response_users?.results.fancy == "off") {
                setKey("Preminum Fancy");
              } else if (response_users?.results.premiumFancy == "off") {
                setKey("Fancy Bet");
              } else {
                !details?.eventName?.includes(" T10 ")
                  ? setKey("Preminum Fancy")
                  : setKey("Fancy Bet");
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
          } else {
            setKey("Preminum Fancy");
          }

          fancyCentralizedIdArr?.length &&
            setFancyCentralizedIdArray(fancyCentralizedIdArr);
        } else {
          setDetails(response_users?.results);
          setTotalMatched(response_users?.results?.totalMatched);
        }
      }
      setLoader(false);
    }
  };

  // const getPremiumFancyList = async () => {
  //   const { status, data: response_users } = await apiGet(
  //     apiPath.getPremiumFancy + `?eventId=${parmas.eventId}`
  //   );
  //   if (status === 200) {
  //     if (response_users.success) {
  //       let temp =
  //         response_users?.results?.data?.length > 0
  //           ? response_users?.results?.data?.filter((res) => {
  //             return res?.sportsBookSelection?.length > 0;
  //           })
  //           : [];
  //       setPremiumFancy(
  //         temp?.length > 0
  //           ? temp?.map((res, index) => {
  //             return { ...res, check: index < 5 ? true : false };
  //           })
  //           : []
  //       );
  //       // let temp = categoryArray?.filter((f) =>
  //       //   response_users?.results?.data?.some(
  //       //     (item) => item.categoryType === f.type
  //       //   )
  //       // );
  //       // setPremiumFancyTabArr(response_users?.results.data || []);
  //       // setPremiumFancyTab([
  //       //   { type: "All", name: "All" },
  //       //   ...temp,
  //       //   { type: "More", name: "More" },
  //       // ]);
  //     }
  //   }
  // };

  const getMatchData = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.getMatchOdds + `?marketId=${parmas.marketId}`
    );
    if (status === 200) {
      if (response_users.success) {
        // console.log('response_users',response_users?.results)
        const socket_data = response_users?.results;
        if (
          socket_data &&
          socket_data?.eventId &&
          parmas?.eventId == socket_data?.eventId
        ) {
          if (socket_data.ms) {
            setBetFairMs(socket_data.ms);
          }
          // console.log('socket_data.rt',socket_data.rt)
          if (socket_data.rt?.length) {
            const back_odds = socket_data.rt.filter((rt) => rt.ib) || [];
            const lay_odds = socket_data.rt.filter((rt) => !rt.ib) || [];
            // console.log('back_odds, lay_odds',back_odds, lay_odds)

            setBackOdds(back_odds);
            setLayOdds(lay_odds);
            setTotalMatched(socket_data?.totalMatched);
          }
        }
      }
    }
  };

  useEffect(() => {
    getMatchDetails();
    //getPremiumFancyList();
    // getMatchData();
  }, []);

  useEffect(() => {
    if (multimarketLoader) {
      setTimeout(() => {
        getMatchDetails("multi");
      }, 1000);
    }
  }, [multimarketLoader]);

  // useEffect(() => {
  //   // if(fancyPosition?.length > 0){
  //   //   setFancyList(
  //   //     fancyList?.map((res) => {
  //   //       let obj = fancyPosition?.find(
  //   //         (item) =>
  //   //           item.selectionId == res.selectionId &&
  //   //           item.fancyName == res.name
  //   //       );
  //   //       return {
  //   //         ...res,
  //   //         odds: res,
  //   //         fancyName: res.name,
  //   //         position: !isEmpty(obj) ? obj?.position : "",
  //   //       };
  //   //     })
  //   //   );
  //   //   setFancyCategoryTabArray(
  //   //     fancyList?.map((res) => {
  //   //       let obj = fancyPosition?.find(
  //   //         (item) =>
  //   //           item.selectionId == res.selectionId &&
  //   //           item.fancyName == res.name
  //   //       );
  //   //       return {
  //   //         ...res,
  //   //         odds: res,
  //   //         fancyName: res.name,
  //   //         position: !isEmpty(obj) ? obj?.position : "",
  //   //       };
  //   //     })
  //   //   );
  //   // }
  //   if (
  //     !isEmpty(slipObj) &&
  //     betSelectionObj?.betType == "fancy" &&
  //     betSelectionObj?.bidPrice > 0
  //   ) {
  //     handelFancyPositions(slipObj);
  //   }
  // }, [fancyList,fancyPosition]);

  useEffect(() => {
    if (details?.eventId) {
      let newSocket = "";
      let randomId = user ? user?.user?._id : 112233;
      if (user) {
        newSocket = io(
          `${process.env.REACT_APP_API_BASE_URL1}?token=${randomId}&userType=front&eventId=${details?.eventId}`,
          {
            transports: ["websocket"],
            forceNew: true
          }
        );
      } else {
        newSocket = io(
          `${process.env.REACT_APP_API_BASE_URL1}?token=${randomId}&eventId=${details?.eventId}`,
          {
            transports: ["websocket"],
            forceNew: true
          }
        );
      }
      if (!isEmpty(user)) {

        const refreshPage = (e) => {
          if (!isEmpty(e)) {
            window.location.reload();
          }
        };

        const listenBetfairOdds = (event) => {
          const socket_data =
            (event &&
              event?.results?.find(
                (item) => item.eventId == parmas?.eventId
              )) ||
            [];
          if (
            socket_data &&
            socket_data?.eventId &&
            parmas?.eventId == socket_data?.eventId
          ) {
            // console.log('socket_data--------------', socket_data)
            if (socket_data.ms) {
              setBetFairMs(socket_data.ms);
            }
            if (socket_data.rt?.length) {
              const back_odds = socket_data.rt.filter((rt) => rt.ib) || [];
              const lay_odds = socket_data.rt.filter((rt) => !rt.ib) || [];
              setBackOdds(back_odds);
              setLayOdds(lay_odds);
              setTotalMatched(socket_data?.totalMatched);
            }
          }
        };

        const listenDiamondFancy = (message) => {
          var tempData = localStorage.getItem("catType");

          if (message?.eventId === parmas?.eventId) {
            if (message?.results?.length > 0) {
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
              setFancyPosition((prev) => {
                setFancyList(
                  message.results.map((res) => {
                    let obj = prev?.find(
                      (item) =>
                        item.selectionId == res.selectionId &&
                        item.fancyName == res.name
                    );
                    return {
                      ...res,
                      odds: res,
                      fancyName: res.name,
                      position: !isEmpty(obj) ? obj?.position : "",
                    };
                  })
                );
                if (tempData == "All") {

                  setFancyCategoryTabArray(
                    message.results.map((res) => {
                      let obj = prev?.find(
                        (item) =>
                          item.selectionId == res.selectionId &&
                          item.fancyName == res.name
                      );
                      return {
                        ...res,
                        odds: res,
                        fancyName: res.name,
                        position: !isEmpty(obj) ? obj?.position : "",
                      };
                    })
                  );
                } else if (tempData == "More") {
                  let arr = message.results?.filter(
                    (res) =>
                      res?.categoryType !== 1 &&
                      res?.categoryType !== 2 &&
                      res?.categoryType !== 3 &&
                      res?.categoryType !== 4 &&
                      res?.categoryType !== 5 &&
                      res?.categoryType !== 6 &&
                      res?.categoryType !== 7 &&
                      res?.categoryType !== 8 &&
                      res?.categoryType !== 9 &&
                      res?.categoryType !== 10 &&
                      res?.categoryType !== 11 &&
                      res?.categoryType !== 14
                  );
                  setFancyCategoryTabArray(
                    arr.map((res) => {
                      let obj = prev?.find(
                        (item) =>
                          item.selectionId == res.selectionId &&
                          item.fancyName == res.name
                      );
                      return {
                        ...res,
                        odds: res,
                        fancyName: res.name,
                        position: !isEmpty(obj) ? obj?.position : "",
                      };
                    })
                  );
                } else {
                  let temp = message.results?.filter((res) => {
                    return res?.categoryType == tempData;
                  });
                  setFancyCategoryTabArray(
                    temp.map((res) => {
                      let obj = prev?.find(
                        (item) =>
                          item.selectionId == res.selectionId &&
                          item.fancyName == res.name
                      );
                      return {
                        ...res,
                        odds: res,
                        fancyName: res.name,
                        position: !isEmpty(obj) ? obj?.position : "",
                      };
                    })
                  );
                }
                return prev;
              });
              // if (
              //   !isEmpty(slipObj) &&
              //   betSelectionObj?.betType == "fancy" &&
              //   betSelectionObj?.bidPrice > 0
              // ) {
              //   handelFancyPositions(slipObj);
              // }
            }
            // for (const fancy_odd of message.results) {
            //   setFancyList((current) =>
            //     current.map((obj) => {
            //       if (obj.centralizedId == fancy_odd.mi) {
            //         return {
            //           ...obj,
            //           categoryType: fancy_odd?.categoryType,
            //           odds: fancy_odd,
            //         };
            //       }
            //       return obj;
            //     })
            //   );
            //   setFancyCategoryTabArray((current) =>
            //     current.map((obj) => {
            //       if (obj.centralizedId == fancy_odd.mi) {
            //         return {
            //           ...obj,
            //           categoryType: fancy_odd?.categoryType,
            //           odds: fancy_odd,
            //         };
            //       }
            //       return obj;
            //     })
            //   );
            // }
          }
        };
        const listenDiamondPremiumFancy = (message) => {
          var tempData = localStorage.getItem("catType");
          if (message?.eventId == parmas?.eventId) {
            if (message?.results?.length > 0) {
              setPremiumFancyCategory([{ type: "All", name: "All" }]);
              setPremiumFancyPosition((prev) => {
                setPremiumFancyList(
                  message.results.map((res) => {
                    let obj = prev?.find(
                      (item) =>
                        item.selectionId == res.selectionId &&
                        item.fancyName == res.name
                    );
                    return {
                      ...res,
                      odds: res,
                      fancyName: res.name,
                      position: !isEmpty(obj) ? obj?.position : "",
                    };
                  })
                );
                // if (tempData == "All") {

                setPremiumFancyCategoryTabArray(
                  message.results.map((res) => {
                    let obj = prev?.find(
                      (item) =>
                        item.selectionId == res.selectionId &&
                        item.fancyName == res.name
                    );
                    return {
                      ...res,
                      odds: res,
                      fancyName: res.name,
                      position: !isEmpty(obj) ? obj?.position : "",
                    };
                  })
                );
                // }
                // else if (tempData == "More") {
                //   let arr = message.results?.filter(
                //     (res) =>
                //       res?.categoryType !== 1 &&
                //       res?.categoryType !== 2 &&
                //       res?.categoryType !== 3 &&
                //       res?.categoryType !== 4 &&
                //       res?.categoryType !== 5 &&
                //       res?.categoryType !== 6 &&
                //       res?.categoryType !== 7 &&
                //       res?.categoryType !== 8 &&
                //       res?.categoryType !== 9 &&
                //       res?.categoryType !== 10 &&
                //       res?.categoryType !== 11 &&
                //       res?.categoryType !== 14
                //   );
                //   setFancyCategoryTabArray(
                //     arr.map((res) => {
                //       let obj = prev?.find(
                //         (item) =>
                //           item.selectionId == res.selectionId &&
                //           item.fancyName == res.name
                //       );
                //       return {
                //         ...res,
                //         odds: res,
                //         fancyName: res.name,
                //         position: !isEmpty(obj) ? obj?.position : "",
                //       };
                //     })
                //   );
                // } else {
                //   let temp = message.results?.filter((res) => {
                //     return res?.categoryType == tempData;
                //   });
                //   setFancyCategoryTabArray(
                //     temp.map((res) => {
                //       let obj = prev?.find(
                //         (item) =>
                //           item.selectionId == res.selectionId &&
                //           item.fancyName == res.name
                //       );
                //       return {
                //         ...res,
                //         odds: res,
                //         fancyName: res.name,
                //         position: !isEmpty(obj) ? obj?.position : "",
                //       };
                //     })
                //   );
                // }
                return prev;
              });
              // if (
              //   !isEmpty(slipObj) &&
              //   betSelectionObj?.betType == "fancy" &&
              //   betSelectionObj?.bidPrice > 0
              // ) {
              //   handelFancyPositions(slipObj);
              // }
            }
            // for (const fancy_odd of message.results) {
            //   setFancyList((current) =>
            //     current.map((obj) => {
            //       if (obj.centralizedId == fancy_odd.mi) {
            //         return {
            //           ...obj,
            //           categoryType: fancy_odd?.categoryType,
            //           odds: fancy_odd,
            //         };
            //       }
            //       return obj;
            //     })
            //   );
            //   setFancyCategoryTabArray((current) =>
            //     current.map((obj) => {
            //       if (obj.centralizedId == fancy_odd.mi) {
            //         return {
            //           ...obj,
            //           categoryType: fancy_odd?.categoryType,
            //           odds: fancy_odd,
            //         };
            //       }
            //       return obj;
            //     })
            //   );
            // }
          }
        };

        newSocket.on("listenDiamondFancy", listenDiamondFancy);
        newSocket.on("listenDiamondPremiumFancy", listenDiamondPremiumFancy);
        newSocket.on("listenBetFairOdds", listenBetfairOdds);

      } else {
        const listenBetfairOdds = (event) => {

          const socket_data =
            (event &&
              event?.results?.find(
                (item) => item.eventId == parmas?.eventId
              )) ||
            [];
          // console.log('socket_data----------------------', socket_data.eventId, parmas?.eventId, socket_data.ms)
          if (
            socket_data &&
            socket_data?.eventId &&
            parmas?.eventId == socket_data?.eventId
          ) {
            if (socket_data.ms) {
              setBetFairMs(socket_data.ms);
            }
            // console.log('socket_data.rt',socket_data.rt)
            if (socket_data.rt?.length) {
              const back_odds = socket_data.rt.filter((rt) => rt.ib) || [];
              const lay_odds = socket_data.rt.filter((rt) => !rt.ib) || [];
              // console.log('back_odds, lay_odds',back_odds, lay_odds)

              setBackOdds(back_odds);
              setLayOdds(lay_odds);
              setTotalMatched(socket_data?.totalMatched);
            }
          }
        };
        const listenDiamondFancy = (message) => {
          if (message?.eventId === parmas?.eventId) {
            if (message?.results?.length > 0) {
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
              setFancyList(
                message.results.map((res) => {
                  // let obj = fancyPosition?.find(
                  //   (item) =>
                  //     item.selectionId == res.selectionId &&
                  //     item.fancyName == res.name
                  // );
                  // console.log(obj,'obj')
                  return {
                    ...res,
                    odds: res,
                    fancyName: res.name,
                  };
                })
              );
              setFancyCategoryTabArray(
                message.results.map((res) => {
                  return {
                    ...res,
                    odds: res,
                    fancyName: res.name,
                  };
                })
              );
              handelFancyPositions(slipObj);
            }
          }
        };
        const listenDiamondPremiumFancy = (message) => {
          if (message?.eventId === parmas?.eventId) {
            if (message?.results?.length > 0) {
              setPremiumFancyCategory([{ type: "All", name: "All" }]);
              setPremiumFancyList(
                message.results.map((res) => {
                  // let obj = fancyPosition?.find(
                  //   (item) =>
                  //     item.selectionId == res.selectionId &&
                  //     item.fancyName == res.name
                  // );
                  // console.log(obj,'obj')
                  return {
                    ...res,
                    odds: res,
                    fancyName: res.name,
                  };
                })
              );
              setPremiumFancyCategoryTabArray(
                message.results.map((res) => {
                  return {
                    ...res,
                    odds: res,
                    fancyName: res.name,
                  };
                })
              );
              handlePremiumFancyPositions(slipObj);
            }
          }
        };
        newSocket.on("listenDiamondFancy", listenDiamondFancy);
        newSocket.on("listenDiamondPremiumFancy", listenDiamondPremiumFancy);
        newSocket.on("listenBetFairOdds", listenBetfairOdds);

      }

      newSocket.on("disconnect", function () {
        console.log('disconnect', '1')
        newSocket.connect();
      });
      return () => newSocket.close();
    }
  }, [details?.eventId]);
  // console.log("---------------", fancyList)

window.addEventListener('online', () => {
  // console.log('Internet connection is now enabled.');
  setTimeout(() => {
    setOnline(true)
    
  }, 2000);
});
useEffect(() => {
  if(online) {
    getMatchDetails();
  }
}, [online]);

window.addEventListener('offline', () => {
    // console.log('Internet connection is now disabled.');
    setOnline(false)
    setDetails({})
});
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      // window.location.reload();
    }
  });

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
                (item) => item?.selectionId == `B${res?.SelectionId}`
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

  // useEffect(() => {
  //  if(tempSelection?.length > 0 && selections?.length > 0){
  //   setSelectionDemo((current) =>
  //   tempSelection.length > 0
  //     ? current.map((res) => {
  //       let obj = tempSelection.find(
  //         (item) => item.selectionId == res.SelectionId
  //       );
  //       return {
  //         ...res,
  //         position:
  //           obj?.selectionId == res?.SelectionId ? obj?.position : 0,
  //         newPosition: 0,
  //       };
  //     })
  //     : current.map((res) => {
  //       return {
  //         ...res,
  //         position: 0,
  //         newPosition: 0,
  //       };
  //     })
  // );
  // setSelections((current) =>
  // tempSelection.length > 0
  //     ? current.map((res) => {
  //       let obj = tempSelection.find(
  //         (item) => item?.selectionId == res?.SelectionId
  //       );
  //       return {
  //         ...res,
  //         position:
  //           obj?.selectionId == res?.SelectionId ? obj?.position : 0,
  //         newPosition: 0,
  //       };
  //     })
  //     : current.map((res) => {
  //       return {
  //         ...res,
  //         position: 0,
  //         newPosition: 0,
  //       };
  //     })
  // );
  //  }
  // },[tempSelection,selections])

  const getFancyBetPosition = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.betFancyPosition +
      `?eventId=${parmas.eventId}&type=${details.gameType}`
    );
    if (status === 200) {
      if (response_users.success) {
        setFancyPosition(response_users?.results);
        setFancyList((prev) => {
          return prev?.map((res) => {
            let obj = response_users?.results?.find(
              (item) =>
                item.selectionId == res.selectionId &&
                item.fancyName == res.name
            );
            return {
              ...res,
              odds: res,
              fancyName: res.name,
              position: !isEmpty(obj) ? obj?.position : "",
            };
          });
        });
        setFancyCategoryTabArray((prev) => {
          return prev?.map((res) => {
            let obj = response_users?.results?.find(
              (item) =>
                item.selectionId == res.selectionId &&
                item.fancyName == res.name
            );
            return {
              ...res,
              odds: res,
              fancyName: res.name,
              position: !isEmpty(obj) ? obj?.position : "",
            };
          });
        });
      }
    }
  };

  // const getPremiumFancyBetPosition = async () => {
  //   const { status, data: response_users } = await apiGet(
  //     apiPath.betPremiumFancyPosition +
  //     `?eventId=${parmas.eventId}&type=${details.gameType}`
  //   );
  //   if (status === 200) {
  //     if (response_users.success) {
  //       setPremiumFancyPosition(response_users?.results);
  //       setPremiumFancy((current) => {
  //         return response_users?.results.length > 0
  //           ? current?.map((res) => {
  //             let obj = response_users?.results?.find(
  //               (item) =>
  //                 item?.fancyName == res?.marketName &&
  //                 res?.id == item?.marketId
  //             );
  //             return obj?.marketId == res?.id &&
  //               obj?.fancyName == res?.marketName
  //               ? {
  //                 ...res,
  //                 sportsBookSelection: res?.sportsBookSelection?.map(
  //                   (temp) => {
  //                     return temp?.id == obj?.selectionId &&
  //                       temp?.selectionName == obj?.runnerName
  //                       ? {
  //                         ...temp,
  //                         position: obj?.profitAmount,
  //                         newPosition: 0,
  //                       }
  //                       : {
  //                         ...temp,
  //                         position: obj?.loseAmount,
  //                         newPosition: 0,
  //                       };
  //                   }
  //                 ),
  //               }
  //               : res;
  //           })
  //           : current;
  //       });
  //     }
  //   }
  // };

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
          // getPremiumFancyBetPosition();
          setBetPlacedCheck(false);
        }
      } else if (updatePosition) {
        getBetPosition();
        setUpdatePosition(false);
      }
    }
  }, [betPlacedCheck, isBetPlaced, updatePosition]);

  useEffect(() => {
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

  useEffect(() => {
    if (!isEmpty(details)) {
      setTimeout(() => {
        getBetPosition();
        getFancyBetPosition();
        // getPremiumFancyBetPosition();
      }, 1500);
    }
  }, [details]);

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
              position:
                obj?.position == 0 || obj?.position ? obj?.position : "",
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
          (rl) => rl.SelectionId == slipObj.SelectionId
        );
        let otherTeamPosition = bookmakerSelections.find(
          (rl) =>
            rl.SelectionId !== slipObj.SelectionId &&
            rl.RunnerName != "The Draw"
        );
        if (
          Math.abs(bookmakerSelections[0]?.position) !== 0 &&
          Math.abs(bookmakerSelections[1]?.position) !== 0
        ) {
          let backProfit = (slipObj.rt / 100) * betSelectionObj?.bidPrice;
          let backLoss = betSelectionObj?.bidPrice;
          currentPosition.newPosition = currentPosition.position + backProfit;
          otherTeamPosition.newPosition = otherTeamPosition.position - backLoss;

          const result = bookmakerSelections.map((data) => {
            if (data.SelectionId == currentPosition.SelectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            if (data.SelectionId == otherTeamPosition.SelectionId) {
              data.newPosition = otherTeamPosition.newPosition
                ? parseFloat(otherTeamPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setBookmakerSelections(result);
        } else {
          // console.log('postion',slipObj.rt)
          let backProfit = (slipObj.rt / 100) * betSelectionObj?.bidPrice;
          let backLoss = betSelectionObj?.bidPrice;
          currentPosition.newPosition = backProfit;
          otherTeamPosition.newPosition = -backLoss;

          const result = bookmakerSelections?.map((data) => {
            if (data.SelectionId == currentPosition.SelectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            if (data.SelectionId == otherTeamPosition.SelectionId) {
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
          (rl) => rl.SelectionId == slipObj.SelectionId
        );
        let otherTeamPosition = bookmakerSelections.find(
          (rl) =>
            rl.SelectionId !== slipObj.SelectionId &&
            rl.RunnerName != "The Draw"
        );
        if (
          Math.abs(bookmakerSelections[0]?.position) !== 0 &&
          Math.abs(bookmakerSelections[1]?.position) !== 0
        ) {
          let backProfit = betSelectionObj?.bidPrice;
          let backLoss = (slipObj.rt / 100) * betSelectionObj?.bidPrice;
          currentPosition.newPosition = currentPosition.position - backLoss;
          otherTeamPosition.newPosition =
            otherTeamPosition.position + backProfit;
          const result = bookmakerSelections.map((data) => {
            if (data.SelectionId == currentPosition.SelectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            if (data.SelectionId == otherTeamPosition.SelectionId) {
              data.newPosition = otherTeamPosition.newPosition
                ? parseFloat(otherTeamPosition.newPosition).toFixed(2)
                : null;
            }
            return data;
          });
          setBookmakerSelections(result);
        } else {
          let backProfit = betSelectionObj?.bidPrice;
          let backLoss = (slipObj.rt / 100) * betSelectionObj?.bidPrice;
          currentPosition.newPosition = -backLoss;
          otherTeamPosition.newPosition = backProfit;
          const result = bookmakerSelections.map((data) => {
            if (data.SelectionId == currentPosition.SelectionId) {
              data.newPosition = currentPosition.newPosition
                ? parseFloat(currentPosition.newPosition).toFixed(2)
                : null;
            }
            if (data.SelectionId == otherTeamPosition.SelectionId) {
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
          (rl) => rl?.selectionId == slipObj?.selectionId
        );
        if (
          !isNaN(Math.abs(currentPosition?.position)) &&
          !isEmpty(currentPosition?.type)
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
          if (currentPosition) currentPosition.newPosition = backProfit;
          const result = fancyList.map((data) => {
            if (data?.selectionId == currentPosition?.selectionId) {
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

  const handlePremiumFancyPositions = (slipObj) => {
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
      handlePremiumFancyPositions(slipObj);
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
      if (premiumFancyList?.length >= 12) {
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
  }, [y, key, details, premiumFancyList, fancyList, betSelectionObj]);

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

  useEffect(() => {
    if (isTv?.status) {
      setControls(true);
    }
  }, [isTv]);

  return (
    <>
      <div id="mainWrap" className="mainWrap">
        {!isEmpty(user) && details?.status == "in_play" && temp && details?.isTvOn ? (
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

              <iframe id="miniGameIframe" className="" style={{ width: '100%', height: '100%', overflow: 'hidden', overflowX: 'hidden', background: '#000000' }} src={
                details?.adsStatus
                  ? details?.adsContent
                  : `https://dtv.diamondapi.uk/tv/index.html?eventId=${details?.eventId}`
              }>
              </iframe>
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
                <li></li>
              )}
            </ul>
          </h4>

          {details.eventId !== "0" && !isEmpty(user) && details.status == 'in_play' ? (
            <div id="matchTrackerWrap" className="match-tracker-wrap">
              <iframe
                className="responsive-iframe w-100"
                style={{
                  overflowX: "hidden",
                  overflow: "hidden",
                  height: "231px",
                  backgroundColor: "#000000",
                }}
                id="scoreId"
                src={`https://diamondapi.uk/dcasino/sr.php?eventid=${details.eventId}&sportid=${details.eventType}`}
              ></iframe>
              <ul class="match-btn" style={{ paddingBottom: "10px" }}>
                {/* <li>
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
                </li> */}
                <li>
                  <a
                    href="javascript:void(0)"
                    class="btn-refresh new-btn-refresh"
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
                      {/* <a
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
                      ></a> */}
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

        {details?.matchOdds == "on" &&
          selections?.length > 0 &&
          back_odds?.length > 0 &&
          back_odds?.length > 0 && (
            <div id="naviMarket" className="market-type ps ps--theme_default">
              <ul id="naviMarketList">
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
          (back_odds.filter((el) => el?.rt !== 0).length > 0 &&
          lay_odds.filter((el) => el?.rt !== 0).length > 0) ? (
            <MatchDetails
              selections={selections}
              back_odds={back_odds}
              betFairMs={betFairMs}
              lay_odds={lay_odds}
              messaageBox={messaageBox}
              details={details}
              totalMatched={totalMatched}
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
          ) : <div className="noMatchOddsData">No match odds data</div>}
        {details?.bookMaker == "on" &&
          bookmakerSelections?.length > 0 &&
          (bookmakerBackOdds?.length > 0 || bookmakerLayOdds?.length > 0) && (
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

        {/* {console.log(fancyList, preminumFancy, "=======")} */}
        {/* Fancy Listing  */}
        {details?.fancy == "off" && details?.premiumFancy == "off"
          ? ("")
          : (fancyList?.length > 0 || premiumFancyList?.length > 0) ? (
            <div
              id={
                key == "Fancy Bet"
                  ? "fancyBetTable_32011225"
                  : "sportsBookWrap"
              }
              style={{
                display: "block",
                marginBottom:
                  fancyCategoryTabArray?.filter(
                    (res) => res?.odds?.rt?.length > 0
                  )?.length > 0 || premiumFancyList?.length > 0
                    ? "90px"
                    : "0",
                background: "#e0e6e",
              }}
            >
              <div
                id={key == "Fancy Bet" ? "fancyBetHead" : "sportsBookHead"}
                className={
                  key == "Fancy Bet"
                    ? "fancy_bet-head"
                    : "sportsbook_bet-head"
                }
              >
                <h4
                  className="in-play"
                  onClick={() => {
                    setKey(
                      key == "Fancy Bet" ? "Fancy Bet" : "Preminum Fancy"
                    );
                    setPopupMessage(false);
                  }}
                >
                  {key == "Fancy Bet" &&
                    details?.fancy == "on" &&
                    details?.gameType == "cricket" ? (
                    <>
                      <span>
                        <pre>in-play</pre>
                        Fancy Bet
                      </span>
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
                    </>
                  ) : (
                    !isEmpty(user) &&
                    details?.premiumFancy == "on" &&
                    !details?.eventName.includes(" T10 ") && (
                      <>
                        <span>
                          <pre>in-play</pre>
                          Premium Fancy
                        </span>
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
                      </>
                    )
                  )}
                </h4>
                {key == "Fancy Bet" ? (
                  !isEmpty(user) ? (
                    details?.premiumFancy == "on" &&
                      !details?.eventName.includes(" T10 ") ? (
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
                        Premium Fancy
                      </a>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )
                ) : details?.gameType == "cricket" &&
                  details?.fancy == "on" ? (
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
                {key == "Preminum Fancy" && !isEmpty(user) && (
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
                  fancyList={fancyList || []}
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
                // <PremiumFancyNew
                //   preminumFancyTab={[]}
                //   setSelectedTabFuncPreminum={setSelectedTabFunc || []}
                //   data={premiumFancyCategoryTabArray || []}
                //   betType={"premiumFancy"}
                //   setSlipObj={setSlipObj}
                //   setPremiumFancy={setPremiumFancyList}
                //   slipObj={slipObj}
                //   resetSelection={resetSelection}
                //   key={key}
                //   messaageBox={messaageBox}
                //   details={details}
                //   profileData={
                //     details?.matchSetting?.length > 0
                //       ? { ...details, arrayCheck: "details" }
                //       : { ...profileData, arrayCheck: "profile" }
                //   }
                //   user={user}
                // />
                <PremiumFancyLatest
                  betType="sportBook"
                  data={premiumFancyCategoryTabArray || []}
                  details={details}
                  fancyList={premiumFancyList || []}
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
                  fancyCategory={premiumFancyCategory}
                  setSelectedTabFunc={setSelectedTabFunc}
                  selectedTab={selectedTab}
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
          )
            : (
              <div className={`bets-new-wrap`}>
              </div>
            )
        }
      </div>
    </>
  );
}
export default BidDetail;
