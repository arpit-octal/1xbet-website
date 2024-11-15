import React, { createContext, useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { useLocation } from "react-router-dom";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import moment from "moment";
import { useContext } from "react";
import AuthProvider from "./AuthContext";

const BetSlipContext = createContext();

export default BetSlipContext;

export const BetSlipProvider = ({ children }) => {
  const location = useLocation();
  let { user, setLoader, profileData, amounutRefresh } =
    useContext(AuthProvider);
  const [refreshCurrentBet, setRefreshCurrentBets] = useState(false);
  let [loading, setLoading] = useState(false);
  const [bookposition, setBookPosition] = useState(false);
  const [bookpositionData, setBookPositionData] = useState("");
  const [defaultStake, setDefaultStake] = useState("");
  const [defaultOdds, setDefaultOdds] = useState(false);
  const [betPlaceBeforeCheck, setBetPlaceBeforeCheck] = useState(false);
  const [loaderCount, setLoaderCount] = useState(5);
  const [betDelay, setBetDelay] = useState(false);
  const [updatePosition, setUpdatePosition] = useState(false)
  const [betSelectionObj, setBetSelectionObj] = useState({
    bidPrice: "",
    inputType: "",
    betType: "",
    oddsSelect: "",
    priceToogleType: "",
    priceToogle: false,
    layorback: "",
    minAmount: 1,
    maxAmount: 100,
    minAmountText: false,
    expectany: defaultOdds,
    gameType: "",
  });
  const [messaageBox, setMessageBox] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loaderPlaceBetfair, setLoaderPlaceBetFair] = useState(false);
  const [multiMarketEventId, setMultiMarketEventId] = useState(null);
  const [isBetPlaced, setIsBetPlaced] = useState("");
  useEffect(() => {
    setBetSelectionObj({
      bidPrice: defaultStake ? defaultStake : "",
      inputType: "",
      betType: "",
      oddsSelect: "",
      priceToogleType: "",
      priceToogle: false,
      layorback: "",
      minAmount: 1,
      maxAmount: 100,
      minAmountText: false,
      expectany: defaultOdds,
      gameType: "",
    });
  }, [location]);
  const [betLoader, setBetLoader] = useState(false);
  const [betPlacedCheck, setBetPlacedCheck] = useState(false);
  const [betfairObj, setBetFairObj] = useState({ betPopup: false });
  const [multimarketLoader, setMultimarketLoader] = useState(false);
  const [unMatchedBets, setUnmacthedBets] = useState([]);
  const [umMachedBetPlace, setUnMatchedBetPlace] = useState(false);

  const getCurrentBets = async () => {
    if (!isEmpty(user)) {
      const { status, data: response_users } = await apiGet(
        apiPath.unMatchedBets
      );
      if (status === 200) {
        if (response_users.success) {
          setUnmacthedBets(response_users.results);
        }
      }
    }
  };
  useEffect(() => {
    getCurrentBets();
    setRefreshCurrentBets(false);
  }, [refreshCurrentBet]);
  const handelPlaceBetfair = async () => {
    if (!isEmpty(user)) {
      setBetFairObj({ ...betfairObj, betPopup: false });
      if (
        Number(
          betfairObj?.check == "lay"
            ? (
              Number(betSelectionObj?.oddsSelect) *
              Number(betSelectionObj?.bidPrice) -
              Number(betSelectionObj?.bidPrice)
            )?.toFixed(2)
            : (
              Number(betSelectionObj?.oddsSelect - 1) *
              Number(betSelectionObj?.bidPrice)
            )?.toFixed(2)
        ) > Number(betfairObj?.maxProfit)
      ) {
        setIsBetPlaced("maxProfitError");
        setMessageBox(true);


        setBetSelectionObj({
          ...betSelectionObj,
          priceToogle: false,
        });
        setBetLoader(true);
        setBetPlacedCheck(true);
      } else {
        setBetPlaceBeforeCheck(true);
        setLoader(true);
        var interval = setInterval(function () {
          if (loaderCount === 0) {
            clearInterval(interval);
          } else {
            setLoaderCount((prev) => prev - 1);
          }
        }, 1000);
        setLoaderPlaceBetFair(true);
        const date = moment(new Date()).format("YYYY-MM-DD, h:mm:ss");
        let result = {
          eventId: betfairObj.eventId,
          marketId: betfairObj.marketId,
          betPlaceTime: date,
          betPlaceType: "betfair",
          bet: [
            {
              selectionId: betfairObj.selectionId,
              teamName: betfairObj.teamName,
              bhav: betSelectionObj.oddsSelect,
              amount: betSelectionObj.bidPrice,
              betType: betfairObj.check,
            },
          ],
        };
        if (!isEmpty(user)) {
          const { data: response_users2 } = await apiPost(
            apiPath.beforeBetPlace,
            result
          );
          if (response_users2?.success) {
            const { status, data: response_users } = await apiPost(
              apiPath.betfairPlaceBet,
              result
            );
            if (status === 200) {
              if (response_users?.results?.matchedFlag) {
                if (response_users?.success) {
                  setIsBetPlaced("placed");
                  setBetPlacedCheck(true);
                  // setTimeout(() => {
                  //   setLoader(false);
                  // },3000)
                  getCurrentBets();
                  // setMessageBox(true);
                  setRefreshCurrentBets(true);
                  // setBetLoader(true);
                  setBetFairObj({ ...betfairObj, betPopup: false });
                  setBetSelectionObj({
                    ...betSelectionObj,
                    priceToogle: false,
                  });
                  amounutRefresh();
                } else {
                  // setBetPlacedCheck(true);
                  // setMessageBox(true);
                  // setLoader(false);
                  setRefreshCurrentBets(true);
                  getCurrentBets();
                  setIsBetPlaced("error");
                  // toast.error(response_users.message);
                  setBetSelectionObj({
                    ...betSelectionObj,
                    priceToogle: false,
                  });
                }
              } else {
                setIsBetPlaced("unMatched");
                setBetPlacedCheck(true);
                setLoader(false);
                getCurrentBets();
                // setMessageBox(true);
                setRefreshCurrentBets(true);
                // setBetLoader(true);
                setBetFairObj({ ...betfairObj, betPopup: false });
                setBetSelectionObj({
                  ...betSelectionObj,
                  priceToogle: false,
                });
              }
            } else {
              setBetFairObj({ ...betfairObj, betPopup: false });
              setBetSelectionObj({
                ...betSelectionObj,
                priceToogle: false,
              });
              setLoader(false);
              setRefreshCurrentBets(true);
              getCurrentBets();
              setBetPlacedCheck(true);
              setMessageBox(true);
              setIsBetPlaced("error");
            }
          } else {
            setBetFairObj({ ...betfairObj, betPopup: false });
            setBetSelectionObj({
              ...betSelectionObj,
              priceToogle: false,
              errorMessage: response_users2.message,
            });
            setLoader(false);
            setRefreshCurrentBets(true);
            getCurrentBets();
            // setBetPlacedCheck(true);
            // setMessageBox(true);
            setIsBetPlaced("error");
          }
        }
      }
      setBetLoader(false);
      getCurrentBets();
      // setLoader(false);
      setShowLogin(true);
    }
    setBetLoader(false);
    // setLoader(false);
  };
  const handelPlaceBetfairUpdate = async (obj) => {
    if (!isEmpty(user)) {
      setLoader(true);
      setLoaderPlaceBetFair(true);
      const date = moment(new Date()).format("YYYY-MM-DD, h:mm:ss");
      let result = {
        eventId: obj.eventId,
        marketId: obj.marketId,
        betPlaceTime: date,
        bet: [
          {
            selectionId: obj.selectionId,
            teamName: obj.teamName,
            bhav: betSelectionObj.oddsSelect,
            amount: betSelectionObj.bidPrice,
            betType: obj.betType,
          },
        ],
      };
      if (!isEmpty(user)) {
        const { status2, data: response_users2 } = await apiGet(
          `${apiPath.clearBets}matchBetId=${obj.matchBetId}`
        );

        const { status, data: response_users } = await apiPost(
          apiPath.betfairPlaceBet,
          result
        );
        if (status === 200) {
          if (response_users.results.matchedFlag) {
            if (response_users.success) {
              setIsBetPlaced("placed");
              setUnMatchedBetPlace(true);
              setBetPlacedCheck(true);
              setLoader(false);
              getCurrentBets();
              setMessageBox(true);
              setRefreshCurrentBets(true);
              setBetLoader(true);
              setBetFairObj({ ...betfairObj, betPopup: false });
              setBetSelectionObj({
                ...betSelectionObj,
                priceToogle: false,
              });
              // toast.success(response_users.message);
            } else {
              setBetPlacedCheck(true);
              setMessageBox(true);
              setRefreshCurrentBets(true);
              setUnMatchedBetPlace(true);
              getCurrentBets();
              setIsBetPlaced("error");
              // toast.error(response_users.message);
            }
          } else {
            setIsBetPlaced("unMatched");
            setBetPlacedCheck(true);
            setLoader(false);
            getCurrentBets();
            setMessageBox(true);
            setUnMatchedBetPlace(true);
            setRefreshCurrentBets(true);
            setBetLoader(true);
            setBetFairObj({ ...betfairObj, betPopup: false });
            setBetSelectionObj({
              ...betSelectionObj,
              priceToogle: false,
            });
          }
        } else {
          setBetFairObj({ ...betfairObj, betPopup: false });
          setBetSelectionObj({
            ...betSelectionObj,
            priceToogle: false,
          });
          setRefreshCurrentBets(true);
          getCurrentBets();
          setUnMatchedBetPlace(true);
          setBetPlacedCheck(true);
          setMessageBox(true);
          setIsBetPlaced("error");
        }
      } else {
        setBetLoader(false);
        getCurrentBets();
        setUnMatchedBetPlace(true);
        setLoader(false);
        setShowLogin(true);
      }
    }
    setBetLoader(false);
    setLoader(false);
  };
  const handelPlaceFancyBet = async (obj) => {
    const date = moment(new Date()).format("YYYY-MM-DD, h:mm:ss");
    // console.log(obj.fancyType == "diamond","obj")
    setLoader(true);
    const resultData = {
      eventId: obj?.eventId,
      marketId: obj?.marketId,
      centralizedId: obj?.centralizedId,
      selectionId: obj?.selectionId,
      betPlaceTime: date,
      fancyName: obj?.fancyName,
      bhav: obj?.pt,
      amount: betSelectionObj?.bidPrice,
      betType: betSelectionObj?.layorback == "back" ? "Yes" : "No",
      exceptAny: betSelectionObj.expectany,
      betRun: obj?.rt,
      runnerName: obj?.runnerName,
      betPlaceType: "fancy",
    };

    if (!isEmpty(user)) {
      if (
        Number(
          betfairObj?.check == "lay"
            ? (
              Number(betSelectionObj?.oddsSelect) *
              Number(betSelectionObj?.bidPrice) -
              Number(betSelectionObj?.bidPrice)
            )?.toFixed(2)
            : (
              Number(betSelectionObj?.oddsSelect - 1) *
              Number(betSelectionObj?.bidPrice)
            )?.toFixed(2)
        ) > Number(betfairObj?.maxProfit?.toFixed(2))
      ) {
        setIsBetPlaced("maxProfitError");
        setMessageBox(true);
        setBetFairObj({ ...betfairObj, betPopup: false });
        setBetSelectionObj({
          ...betSelectionObj,
          priceToogle: false,
        });
        setBetLoader(true);
        setBetPlacedCheck(true);
      } else {
        const { data: response_users2 } = await apiPost(
          apiPath.beforeBetPlace,
          resultData
        );
        if (response_users2.success) {
          let api =
            obj?.fancyType == "diamond"
              ? apiPath.diamondfancyBetPlace
              : apiPath.fancyBetPlace;
          const { status, data: response_users } = await apiPost(
            api,
            resultData
          );
          if (status === 200) {
            if (response_users.success) {
              setBetLoader(true);
              setBetFairObj({
                ...betfairObj,
                check: betSelectionObj?.layorback == "back" ? "Yes" : "No",
                teamName: obj?.fancyName,
                betPopup: false,
              });
              setBetPlacedCheck(true);
              setBetSelectionObj({
                ...betSelectionObj,
                priceToogle: false,
              });
              setIsBetPlaced("placed");
              setLoader(false);
              setMessageBox(true);
              amounutRefresh();
            } else {
              setBetFairObj({
                ...betfairObj,
                check: betSelectionObj?.layorback == "back" ? "Yes" : "No",
                teamName: obj?.fancyName,
                betPopup: false,
              });
              setBetPlacedCheck(true);
              setBetSelectionObj({
                ...betSelectionObj,
                priceToogle: false,
              });
              setMessageBox(true);
              setBetLoader(false);
              setLoader(false);
              setIsBetPlaced("error");
            }
          } else {
            setBetFairObj({
              ...betfairObj,
              check: betSelectionObj?.layorback == "back" ? "Yes" : "No",
              teamName: obj?.fancyName,
              betPopup: false,
            });
            setBetSelectionObj({
              ...betSelectionObj,
              priceToogle: false,
            });
            setMessageBox(true);
            setBetLoader(false);
            setLoader(false);
            setIsBetPlaced("error");
          }
        } else {
          setBetFairObj({
            ...betfairObj,
            check: betSelectionObj?.layorback == "back" ? "Yes" : "No",
            teamName: obj?.fancyName,
            betPopup: false,
          });
          setBetPlacedCheck(true);
          setBetSelectionObj({
            ...betSelectionObj,
            priceToogle: false,
            errorMessage: response_users2?.message,
          });
          setMessageBox(true);
          setBetLoader(false);
          setLoader(false);
          setIsBetPlaced("error");
        }
      }
    }
    setBetLoader(false);
  };
  useEffect(() => {
    if (Number(betSelectionObj.bidPrice) < Number(betSelectionObj.minAmount)) {
      setBetSelectionObj({ ...betSelectionObj, minAmountText: true });
    } else {
      setBetSelectionObj({ ...betSelectionObj, minAmountText: false });
    }
  }, [betSelectionObj?.bidPrice]);
  const handelAddMultiMarket = async (eventId) => {
    if (!isEmpty(user)) {
      setMultimarketLoader(true);
      const result = {
        eventId: eventId,
      };
      if (user) {
        const { status, data: response_users } = await apiPost(
          apiPath.multiMarket,
          result
        );
        if (status === 200) {
          if (response_users.success) {
            if (response_users.results.eventId) {
              setMultiMarketEventId(response_users.results.eventId);
              // setRunApi(!runApi);
              setMultimarketLoader(false);
            } else {
              setMultiMarketEventId(null);
              // setRunApi(!runApi);
              setMultimarketLoader(false);
            }
          } else {
            setMultimarketLoader(false);
            //toast.error(response_users.message);
          }
        }
      } else {
        setMultimarketLoader(false);
        // setShowLogin(true);
      }
    }
  };
  const handelPlaceBookmakerBet = async (obj) => {
    const date = moment(new Date()).format("YYYY-MM-DD, h:mm:ss");
    setLoader(true);
    const resultData = {
      eventId: obj.eventId,
      marketId: obj?.bookmakerMarketId,
      selectionId: obj?.selectionId,
      betPlaceTime: date,
      teamName: obj?.teamName,
      bhav: betSelectionObj?.oddsSelect,
      type: obj?.gameType,
      amount: betSelectionObj.bidPrice,
      betType: betSelectionObj?.layorback,
      exceptAny: betSelectionObj?.expectany,
      betPlaceType: "bookmaker",
    };
    if (!isEmpty(user)) {
      const { data: response_users2 } = await apiPost(
        apiPath.beforeBetPlace,
        resultData
      );
      if (response_users2.success) {
        const { status, data: response_users } = await apiPost(
          apiPath.bookmakerBet,
          resultData
        );
        if (status === 200) {
          if (response_users.success) {
            setIsBetPlaced("placed");
            setBetFairObj({
              ...betfairObj,
              check: betSelectionObj?.layorback,
              teamName: obj?.teamName,
            });
            setBetPlacedCheck(true);
            setLoader(false);
            setBetSelectionObj({
              ...betSelectionObj,
              priceToogle: false,
            });
            setBetLoader(true);
            setMessageBox(true);
            amounutRefresh();
            // toast.success(response_users.message);
          } else {
            setMessageBox(true);
            setBetLoader(false);
            setBetPlacedCheck(true);
            setLoader(false);
            setIsBetPlaced("error");
            // toast.error(response_users.message);
          }
        } else {
          setBetFairObj({
            ...betfairObj,
            check: betSelectionObj?.layorback,
            teamName: obj?.teamName,
          });

          setBetSelectionObj({
            ...betSelectionObj,
            priceToogle: false,
          });
        }
      } else {
        setIsBetPlaced("error");
        setBetFairObj({
          ...betfairObj,
          check: betSelectionObj?.layorback,
          teamName: obj?.teamName,
        });
        setBetPlacedCheck(true);
        setLoader(false);
        setBetSelectionObj({
          ...betSelectionObj,
          priceToogle: false,
          errorMessage: response_users2?.message,
        });
        setBetLoader(true);
        setMessageBox(true);
      }
      setLoader(false);
      setBetLoader(false);
    }
  };
  const handelPlacePreminumFancyBet = async (obj) => {
    // console.log('obj', obj); return false;
    const selectionId = obj?.runners.filter((item) => item?.runnerName == obj.runnerName)
    const date = moment(new Date()).format("YYYY-MM-DD, h:mm:ss");
    setLoader(true);
    const resultData = {
      eventId: obj?.eventId,
      marketId: obj?.marketId,
      fancySelectionId: selectionId[0]?.selectionId,
      selectionId: selectionId[0]?.selectionId,
      betPlaceTime: date,
      // runnerName:obj?.obj?.runnerName,
      fancyName: obj?.fancyName,
      bhav: betSelectionObj?.oddsSelect,
      amount: betSelectionObj.bidPrice,
      betType: betSelectionObj?.layorback == "back" ? "Yes" : "No",
      exceptAny: betSelectionObj?.expectany,
      runnerName: obj?.runnerName,
      // apiSiteSpecifier: obj?.apiSiteSpecifier,
      // apiSiteSelectionId: obj?.obj?.apiSiteSelectionId,
      // apiSiteSpecifier: obj?.newSelectId,
      // apiSiteSelectionId: obj?.newSelectId,
      betPlaceType: "premiumFancy",
      betRun: obj?.rt,
    };
    if (!isEmpty(user)) {
      const { data: response_users2 } = await apiPost(
        apiPath.beforeBetPlace,
        resultData
      );
      if (response_users2.success) {
        const { status, data: response_users } = await apiPost(
          apiPath.preminumFancyBets,
          resultData
        );
        if (status === 200) {
          if (response_users.success) {
            setIsBetPlaced("placed");
            setBetFairObj({
              ...betfairObj,
              check: "back",
              teamName: obj?.marketName,
              selectId: "",
            });
            setBetSelectionObj({
              ...betSelectionObj,
              priceToogle: false,
            });
            setBetPlacedCheck(true);
            setBetLoader(true);
            setMessageBox(true);
            setLoader(false);
            amounutRefresh();
            // toast.success(response_users.message);
          } else {
            setMessageBox(true);
            setBetPlacedCheck(true);
            setBetLoader(false);
            setLoader(false);
            setIsBetPlaced("error");
            setBetFairObj({
              ...betfairObj,
              check: "back",
              teamName: obj?.marketName,
              selectId: "",
            });
            setBetSelectionObj({
              ...betSelectionObj,
              priceToogle: false,
            });
            // toast.error(response_users.message);
          }
        }
      } else {
        setMessageBox(true);
        setBetPlacedCheck(true);
        setBetLoader(false);
        setLoader(false);
        setIsBetPlaced("error");
        setBetFairObj({
          ...betfairObj,
          check: "back",
          teamName: obj?.marketName,
          selectId: "",
        });
        setBetSelectionObj({
          ...betSelectionObj,
          priceToogle: false,
          errorMessage: response_users2?.message,
        });
      }
      setLoader(false);
      setBetLoader(false);
    }
  };
  useEffect(() => {
    if (betSelectionObj?.betType !== "" && betSelectionObj.gameType !== "") {
      var minAmount = profileData?.matchSetting?.find(
        (el) =>
          el.type ==
          (betSelectionObj?.betType == "betFair"
            ? "betFaire"
            : betSelectionObj?.betType == "bookmaker"
              ? "bookmaker"
              : betSelectionObj?.gameType == "fancy"
                ? "fancy"
                : "sportBook") && el.sportType == betSelectionObj?.gameType
      )?.minAmount;
      setBetSelectionObj({ ...betSelectionObj, minAmount: minAmount });
    }
  }, [
    betSelectionObj?.betType,
    betSelectionObj?.gameType,
    betSelectionObj?.bidPrice,
  ]);
  let contextData = {
    betLoader,
    handelAddMultiMarket,
    multimarketLoader,
    handelPlaceBetfair,
    setBetFairObj,
    setBetLoader,
    setMessageBox,
    messaageBox,
    setIsBetPlaced,
    isBetPlaced,
    betSelectionObj,
    setBetSelectionObj,
    betfairObj,
    handelPlaceBookmakerBet,
    handelPlaceFancyBet,
    handelPlacePreminumFancyBet,
    betPlacedCheck,
    setBetPlacedCheck,
    defaultStake,
    setDefaultStake,
    setDefaultOdds,
    defaultOdds,
    setBookPosition,
    bookposition,
    setBookPositionData,
    bookpositionData,
    unMatchedBets,
    refreshCurrentBet,
    setRefreshCurrentBets,
    handelPlaceBetfairUpdate,
    umMachedBetPlace,
    setUnMatchedBetPlace,
    setBetPlaceBeforeCheck,
    betPlaceBeforeCheck,
    setUpdatePosition,
    updatePosition
  };
  return (
    <BetSlipContext.Provider value={contextData}>
      {loading ? null : children}
    </BetSlipContext.Provider>
  );
};
