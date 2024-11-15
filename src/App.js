import React, { useContext, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "@fortawesome/fontawesome-free/css/all.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; 
import "../src/assets/css/sky.css";
// import "../src/assets/css/style.css";
// import "../src/assets/css/responsive.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Inplay from "./pages/Inplay/Inplay";
import Today from "./pages/Today";
import Tomorrow from "./pages/Tomorrow";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import MultiMarket from "./pages/MultiMarket/Multimarket";
import Signup from "./pages/Signup";
import Sports from "./pages/Sports";
import SportsDetail from "./pages/SportsDetail";
import BidDetail from "./pages/MatchDetails/BidDetail";
import Recharge from "./pages/Recharge";
import WithdrawRequest from "./pages/WithdrawRequest";
import DepositRequest from './pages/DepositRequest'
import PaymentWithdrawSubmit from "./pages/PaymentWithdrawSubmit";
import PaymentSubmit from "./pages/PaymentSubmit";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AuthProvider from "./context/AuthContext";
import AllOverlay from "./components/All_overlay";
import { useEffect } from "react";
import { isEmpty } from "lodash";
import LiveCasino from "./pages/LiveCasino";
import CasinoGames from "./pages/CasinoGames";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import Blog from "./pages/Blog";
import CasinoGamePlay from "./pages/CasinoGamePlay";
import Myprofile from "./pages/Myprofile"
import Balance from "./pages/Balance"
import MyBet from "./pages/CurrentBets/MyBet";
import BetHistory from "./pages/BetHistory/BetHistory";
import ProfitLoss from "./pages/ProfitLoss/ProfitLoss";
import Activitylog from "./pages/Activitylog";
import Accountstatement from "./pages/Accountstatement";
import WebView from "./pages/WebView";
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  let { user } = useContext(AuthProvider);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (isEmpty(user)) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767 && !redirected) {
        // Redirect the user to the mobile app installation page
        setRedirected(true);
        window.location.href = '/web-view';
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Check screen size on component mount
    if(window?.location?.pathname !== '/web-view'){
      handleResize();
    }

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [redirected]);

  return (
    <div className="App">
      <AllOverlay />
      <wc-toast position="top-right"></wc-toast>
      {location.pathname !== "/login" && location.pathname !== "/blog" && location.pathname !== "/web-view" &&(
        <Header />
      )}
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        <Route exact path="/blog" element={<Blog />}></Route>
        <Route exact path="/inplay" element={<Inplay />}></Route>
        <Route exact path="/today" element={<Today />}></Route>
        <Route exact path="/tomorrow" element={<Tomorrow />}></Route>
        <Route exact path="/result" element={<Result />}></Route>
        <Route exact path="/profile" element={<Profile />}></Route>
        <Route exact path="/multiMarket" element={<MultiMarket />}></Route>
        <Route exact path="/sports" element={<Sports />}></Route>
        <Route exact path="/sportsdetail" element={<SportsDetail />}></Route>
        <Route exact path="/payment-submit" element={<PaymentSubmit />}></Route>
        <Route exact path="/payment-withdraw-submit" element={<PaymentWithdrawSubmit />}></Route>
        <Route exact path="/withdraw-requests" element={<WithdrawRequest />}></Route>
        <Route exact path="/deposit-requests" element={<DepositRequest />}></Route>
        <Route exact path="/live-casino" element={<LiveCasino />}></Route>
        <Route exact path="/recharge" element={<Recharge />}></Route>
        <Route exact path="/casino-games" element={<CasinoGames />}></Route>
        <Route exact path="/casino-game-play" element={<CasinoGamePlay />}></Route>
        <Route exact path="/my-profile" element={<Myprofile />}></Route>
        <Route exact path="/balance" element={<Balance />}></Route>
        <Route exact path="/mybets" element={<MyBet />}></Route>
        <Route exact path="/betshistory" element={<BetHistory />}></Route>
        <Route exact path="/profit_loss" element={<ProfitLoss />}></Route>
        <Route exact path="/account-statement" element={<Accountstatement />}></Route>
        <Route exact path="/web-view" element={<WebView />}></Route>
        {/* <Route exact path="/activity-logs" element={<Activitylog />}></Route> */}
        <Route
          exact
          path="/match-details/:eventId/:marketId"
          element={<BidDetail />}
        ></Route>
      </Routes>
      {location.pathname !== "/login" && location.pathname !== "/blog" && location.pathname !== "/web-view" && location.pathname !== "/casino-game-play" &&(
        <Footer />
      )}
    </div>
  );
}
export default App;
