import React from "react";

import FancyBetRulesWrap from "../components/FancyBetRulesWrap";
import SportsBookRulesWrap from "../components/SportsBookRulesWrap";
import RulesofPremium from "../components/RulesofPremium";
import Backhome from "../components/Backhome";
import Please_login_to_proceed from "../components/Please_login_to_proceed";
import Openbets from "./Openbets";
import Setting from "./Setting";
import Anouncement from "./Anouncement";
import SearchWrap from "./SearchWrap";
import SearchWrapCasino from "./SearchWrapCasino";
import Loader from "./Loader";
import BetPlacePopup from "./BetPlacePopup";
import WalletWrap from "./WalletWrap";
import MessageBox from "./MessageBox";
import BookPosition from "./BookPosition";
import CasinoPopup from "./CasinoPopup";
import MarketDepth from "./MarketDepth";
import GameFooter from "./GameFooter";
import PaymentPopup from "./PaymentPopup";

function AllOverlay() {
  return (
    <>
      {/* <WalletWrap/> */}
      {/* <MessageBox /> */}
      {/* <GameFooter/> */}
      <PaymentPopup />
      <MarketDepth/>
      <CasinoPopup/>
      <BookPosition/>
      <BetPlacePopup />
      <SearchWrap />
      <SearchWrapCasino />
      <Loader />
      <FancyBetRulesWrap />
      <Anouncement />
      <SportsBookRulesWrap />
      <RulesofPremium />
      <Backhome />
      <Please_login_to_proceed />
      <Openbets />
      <Setting />
    </>
  );
}

export default AllOverlay;
