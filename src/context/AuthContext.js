import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { pick, isEmpty } from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import { apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import io from "socket.io-client";
const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(
    localStorage.getItem("token")
      ? jwt_decode(localStorage.getItem("token"))
      : ""
  );
  const [paymentModel, setPaymentModel] = useState(false);
  const [paymentObj, setPaymentObj] = useState({});
  const [gameFooter, setGameFooter] = useState(false);
  const [show_model, setShowModel] = useState(false);
  const [oneClickData, setOneClickData] = useState({});
  const [casinoRangeAmount, setCasinoRangeAmount] = useState(0);
  const [marketDepthData, setMarketDepthData] = useState({});
  const [marketDepth, setMarketDepth] = useState(false);
  const [casinoModel, setCasinoModel] = useState(false);
  const [inPlayScore, setInPlayScore] = useState([]);
  const [casinoObj, setCasinoObj] = useState({});
  const [fancyrules, setFancyRules] = useState(false);
  const [premiumFancyRules, setPremiumFancyRules] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [loader, setLoader] = useState(false);
  const [openBetsToogle, setOpenBetsToogle] = useState(false);
  const [searchToogle, setSearchToogle] = useState(false);
  const [searchToogleCasino, setSearchToogleCasino] = useState(false);
  const [settingToogle, setSettingToogle] = useState(false);
  const [announcmentToogle, setAnnouncmentToogle] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [openBetSelection, setOpenBetSelection] = useState("open");
  const [vendor, setVendor] = useState("");
  const [casinoGameUrl, setCasinoGameUrl] = useState("");
  const location = useLocation();
  let [loading, setLoading] = useState(false);
  const [isTv, setIsTv] = useState({
    status: true,
    id: "",
  });
  // useEffect(() => {
  //   if (openBetsToogle || settingToogle || walletOpen || announcmentToogle) {
  //     setIsTv({
  //       ...isTv,
  //       status: false,
  //     });
  //   }
  // }, [openBetsToogle, settingToogle, walletOpen, announcmentToogle]);

  let [user_coins, setUserCoins] = useState({
    exposure: 0.00,
    totalCoins: 0.00,
  });
  const navigate = useNavigate();
  const [isLoged, setIsLoged] = useState("");
  useEffect(() => {
    if (location?.pathname?.split("/")[1] !== "match-details") {
      setIsTv({ id: "", status: false });
    }
  }, [location?.pathname]);
  let logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  // console.log(user, 'user')
  const amounutRefresh = async () => {
    let randomId = user ? user?.user?._id : 112233;
    const newSocket = io(
      `${process.env.REACT_APP_API_BASE_URL1}?token=${randomId}&userType=front`,
      {
        transports: ["websocket"],
      }
    );
    const coinListener = (message) => {
      setUserCoins(message.results);
    };

    const forceLogout = (message) => {
      const uniqueId = localStorage.getItem("uniqueId");
      if (uniqueId !== message.results.uniqueId) {
        logoutUser();
      }
    };

    const InPlayScore = (message) => {
      setInPlayScore(JSON.parse(message));
    };
    newSocket.emit("getCoins", { user_id: user ? user.user._id : "" });
    newSocket.on("listenGetCoin", coinListener);
    newSocket.on("scoreAll", InPlayScore);
    newSocket.on("listenForceLogout", forceLogout);
    return () => newSocket.close();
  }
  useEffect(() => {

    if (!isEmpty(user)) {

      amounutRefresh()
    }
  }, [user]);

  let loginUser = async (body) => {
    let hostname = window.location.hostname;
    hostname = hostname.replace(/^www\./, '');
    hostname = hostname.replace(/^ag\./, '');
    body.website = hostname || "SABAEXCH";

    const { status, data } = await apiPost(
      apiPath.loginUser,
      pick(body, ["username", "password", "uniqueId", "website"])
    );
    if (status === 200) {
      if (data.success) {
        localStorage.setItem("token", data.results.token);
        localStorage.setItem("refresh_token", data.results.refresh_token);
        setUserCoins({
          exposure: data.results.exposure,
          totalCoins: data.results.totalCoins,
        });
        setUser(jwt_decode(data.results.token));
        setTimeout(() => {
          navigate("/");
          window.location.reload()
        }, 500);

        setIsLoged("loged");
      } else {

        setIsLoged("failed");
      }
    } else {

      setIsLoged("failed");
    }
  };
  let oneClickloginUser = async (body) => {
    let hostname = window.location.hostname;
    hostname = hostname.replace(/^www\./, '');
    hostname = hostname.replace(/^ag\./, '');
    body.website = hostname || "SABAEXCH";

    const { status, data } = await apiPost(
      apiPath.loginUser,
      pick(body, ["username", "password", "uniqueId", "website"])
    );
    if (status === 200) {
      if (data.success) {
        localStorage.setItem("token", data.results.token);
        localStorage.setItem("refresh_token", data.results.refresh_token);
        setUserCoins({
          exposure: data.results.exposure,
          totalCoins: data.results.totalCoins,
        });
        setUser(jwt_decode(data.results.token));

        navigate("/profile");
        setIsLoged("loged");
      } else {

        setIsLoged("failed");
      }
    } else {

      setIsLoged("failed");
    }
  };
  let contextData = {
    user: user,
    oneClickloginUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    user_coins,
    setUserCoins: setUserCoins,
    setOpenBetsToogle,
    openBetsToogle,
    setSettingToogle,
    settingToogle,
    setAnnouncmentToogle,
    announcmentToogle,
    setSearchToogle,
    searchToogle,
    setLoader,
    loader,
    isLoged,
    setIsLoged,
    setIsTv,
    isTv,
    setWalletOpen,
    walletOpen,
    setProfileData,
    profileData,
    setFancyRules,
    fancyrules,
    setPremiumFancyRules,
    premiumFancyRules,
    setCasinoModel,
    casinoModel,
    setCasinoRangeAmount,
    casinoRangeAmount,
    setCasinoObj,
    casinoObj,
    inPlayScore,
    setOpenBetSelection,
    openBetSelection,
    setMarketDepth,
    marketDepth,
    setMarketDepthData,
    marketDepthData,
    amounutRefresh,
    setGameFooter,
    gameFooter,
    vendor,
    setVendor,
    setPaymentModel, paymentModel, paymentObj, setPaymentObj, setShowModel, show_model, setOneClickData, oneClickData,
    setCasinoGameUrl,
    casinoGameUrl,
    searchToogleCasino,
    setSearchToogleCasino

  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
