import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import obj from "../Utils/helpers";
import { toast } from "wc-toast";
function CasinoGamePlay() {
    const [inplayCountData, setInplayCountData] = useState({});
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    let { casinoGameUrl } = useContext(AuthProvider);
    const iframe = document.getElementsByClassName("casino-game");
    // const currentURL = iframe?.contentWindow.location.href;+
    // let casinoGameUrl = 'https://stage-game.royalgaming.online?token=b7a43dde-3eb5-442c-a696-d8fcfd8cf9c8&operatorId=poisabazz&userName=c003&partnerId=GAPINR&providerId=RGONLINE&lobby=false&gameId=VGA3101&opentable=VTGA3103&theme=DARK&view=CLASSIC&lobbyType=LIVE:VIRTUAL'
    return (
        <div>
            <div id="page">
                <div className="">
                    <div className="gamehal">
                        {casinoGameUrl ?
                            <iframe id="miniGameIframe" allowFullScreen="allowFullScreen" className="casino-game" src={casinoGameUrl} style={{border: 0, margin: 0, padding: 0}}>
                            </iframe>
                            : ""}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CasinoGamePlay;
