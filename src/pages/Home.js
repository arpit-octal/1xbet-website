import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import obj from "../Utils/helpers";
import { toast } from "wc-toast";
import CasinoGamesHome from "./CasinoGamesHome";
import TopCasinoGames from "./TopCasinoGames";
import Slider from "react-slick";

function Home() {
  var settings = {
    dots: false,
    infinite: true,
    navigator: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    loop: true,
  };

  const [inplayCountData, setInplayCountData] = useState({});
  const [vendors, setVendors] = useState();
  const [data, setData] = useState({});
  const navigate = useNavigate();
  let { isLoged, setIsLoged, setCasinoModel, setCasinoObj, user, setVendor, setLoader, user_coins, setCasinoGameUrl, setAnnouncmentToogle } = useContext(AuthProvider);
  const inPlayCount = async () => {
    const { status, data: response_users } = await apiGet(apiPath.inPlayCount);
    if (status === 200) {
      if (response_users.success) {
        if (response_users.results) {
          setInplayCountData(response_users.results);
        }
      }
    }
  };

  const casinoVenders = async () => {
    try {
      setLoader(true);
      const { status, data: response } = await apiGet(apiPath.casinoVendors);
      if (status === 200) {
        if (!response.error) {
          if (response.data) {
            let data = [];
            if (response.data.length > 0) {
              data = response.data.map((item) => {
                if (item.providerName != "") {
                  return {
                    name: item.providerName,
                    image: `/assets/images/home/${item.providerName.toLowerCase()}.jpeg`,
                  };
                } else {
                  return {
                    name: item.providerName,
                    image: "/assets/images/home/vendor.png",
                  };
                }
              });
            }
            setVendors([...data, { name: "Evolution Gaming", image: "/assets/images/home/evolution-gaming.jpeg" }]);
            setLoader(false);
          }
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const getSetting = async (event) => {
    try {
      const { status, data: response_users } = await apiGet(apiPath.getSetting + "?website=" + document?.location?.host);
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results);
        }
      }
    } catch (err) {}
  };

  // useEffect(() => {
  //   if (isLoged) {
  //     window.location.reload();
  //     setIsLoged(false);
  //   }
  // }, [isLoged]);
  useEffect(() => {
    inPlayCount();
    casinoVenders();
    getSetting();
    // console.log('------')
  }, []);

  const [message, setMessage] = useState([]);
  const messageList = async () => {
    let hostname = window.location.hostname;
    hostname = hostname.replace(/^www\./, "");
    hostname = hostname.replace(/^ag\./, "");
    hostname = hostname || "sabaexch.com";

    const { status, data: response_users } = await apiGet(apiPath.messageList + "?domain=" + hostname);
    if (status === 200) {
      if (response_users.success) {
        setMessage(response_users.results);
      }
    }
  };
  useEffect(() => {
    messageList();
  }, []);

  return (
    <div>
      <Slider {...settings} className="homeSlider">
        <div>
          <img src="/assets/images/home/Banner1.jpg" style={{ width: "100%" }} alt="" />
        </div>

        <div>
          <img src="/assets/images/home/Banner2.jpg" style={{ width: "100%" }} alt="" />
        </div>

        <div>
          <img src="/assets/images/home/Banner3.jpg" style={{ width: "100%" }} alt="" />
        </div>
      </Slider>

      {/* <div id="headerMain2" className="marquee-box" style={{ display: "flex" }}>
        <h4></h4>
        <div
          class="marquee"
          onClick={() => {
            setAnnouncmentToogle(message.length > 0 ? true : false);
          }}
        >
          <marquee class="js-marquee-wrapper">
            <div class="js-marquee">
              {message?.length > 0 &&
                message?.map((item) => {
                  return (
                    <a>
                      <span> {obj.msgDateFormat(item.msgDate)}</span>
                      {item.message}
                    </a>
                  );
                })}
            </div>
          </marquee>
        </div>
      </div> */}
      <div id="page">
        <div className="mian-wrap">
          {/* <TopCasinoGames/> */}
          <CasinoGamesHome />

          {/* <div className="support-wrap extend-support">
            {data?.whatsappShowing != "false" ? (
              <div className="extend-btn">
                <img src="assets/images/transparent.gif" title="WhatsApp" className="support-whatsapp" />
                {data?.whatsappShowing == "true" && data?.whatsappContent != "" && (
                  <a href={"http://Wa.me/+" + data?.whatsappContent} target="_blank">
                    WhatsApp 1
                  </a>
                )}
                {data?.whatsappShowing2 == "true" && data?.whatsappContent2 != "" && (
                  <a href={"http://Wa.me/+" + data?.whatsappContent2} target="_blank" className="split-line">
                    WhatsApp 2
                  </a>
                )}
              </div>
            ) : (
              ""
            )}

            {data?.telegramShowing != "false" || data?.telegramShowing2 != "false" ? (
              <div className="extend-btn">
                <img src={process.env.REACT_APP_URL + "/assets/images/transparent.gif"} title="Telegram" className="support-telegram" />
                {data?.telegramShowing == "true" && data?.telegramContent != "" && (
                  <a href={"http://t.me/" + data?.telegramContent} target="_blank">
                    {data?.telegramContent}
                  </a>
                )}
                {data?.telegramShowing2 == "true" && data?.telegramContent2 != "" && (
                  <a href={"http://t.me/" + data?.telegramContent2} target="_blank" className="split-line">
                    {data?.telegramContent2}
                  </a>
                )}
              </div>
            ) : (
              ""
            )}
            <div className="support-social">
              {data?.facebookShowing == "true" && data?.facebookContent != "" && (
                <div className="social-btn">
                  <img src={process.env.REACT_APP_URL + "/assets/images/home/icons8-facebook-48.png"} title="Email" className="support-mail" />
                  <a href={`mailto:${data?.emailContent}`} target="_blank">
                    Email
                  </a>
                  <a href="https://m.facebook.com/groups/299170486016271/?ref=share&mibextid=NSMWBT" target="_blank">
                    Facebook
                  </a>
                </div>
              )}

              {data?.instagramShowing == "true" && data?.instagramContent != "" && (
                <div className="social-btn">
                  <img src={process.env.REACT_APP_URL + "/assets/images/transparent.gif"} title="Instagram" className="support-ig" />
                  <a href={data?.instagramContent} target="_blank" className="ui-link">
                    Instagram
                  </a>
                </div>
              )}
            </div>
          </div> */}

          <div className="support-wrap extend-supportLink">
            {/* {data?.emailShowing == "true" && data?.emailContent != "" && (
              <a href={`mailto:${data?.emailContent}`}><img src="assets/images/home/mail.svg" /></a>
            )} */}
            {data?.telegramShowing == "true" && data?.telegramContent != "" && (
              <a href={`https://web.telegram.org/` + data?.telegramContent} target="_blank">
                <img src="assets/images/home/twitter.svg" />
              </a>
            )}
            {/* <a href="#"><img src="assets/images/home/twitter.svg" /></a> */}
            {data?.whatsappShowing == "true" && data?.whatsappContent != "" && (
              <a href={"http://Wa.me/+" + data?.whatsappContent} target="_blank">
                <img src="assets/images/home/whatsappNew.svg" />
              </a>
            )}
            {/* <a href="#"><img src="assets/images/home/skypeNew.svg" /></a> */}
            {data?.instagramShowing == "true" && data?.instagramContent != "" && (
              <a href={data?.instagramContent} target="_blank">
                <img src="assets/images/home/instagram.svg" />
              </a>
            )}
            {data?.facebookShowing == "true" && data?.facebookContent != "" && (
              <a href={data?.facebookContent} target="_blank">
                <img src="assets/images/home/facebook.svg" />
              </a>
            )}
          </div>

          <div>
            <h4></h4>
          </div>

          <div id="powerWrap" className="betfair-wrap betfair-login ">
            <p className="">Powered by</p>
            <span></span>
          </div>

          <ul className="policy-link">
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms and Conditions</a>
            </li>
            <li>
              <a href="#">Rules and Regulations</a>
            </li>
            <li>
              <a href="#">KYC</a>
            </li>
            <li>
              <a href="#">Responsible Gaming</a>
            </li>
            {/* <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Self-Exclusion Policy</a>
            </li>
            <li>
              <a href="#">Underage Policy</a>
            </li> */}
          </ul>

          <div className="extra-wrap"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
