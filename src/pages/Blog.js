import React from "react";
import "../assets/css/blog.css";
const Blog = () => {
  return (
    <>
      <div className="home-banner">
        <div className="home-content-banner">
          <div className="width-40-perc">
            <h1>#javaexchange</h1>
            <h2>Official Website for Betting and Sports Exchange</h2>
            <div className="home-banner-buttons">
              <ul>
                <li>
                  <a
                    href="https://api.whatsapp.com/send?phone=918607485952"
                    target="_blank"
                  >
                    <img
                      src="../assets/images/whatsapp-icon.png"
                      alt="javaexch"
                    />
                    Whastapp
                  </a>
                </li>
                <li>
                  <a
                    href="https://api.whatsapp.com/send/?phone=601112112083"
                    target="_blank"
                  >
                    <img
                      src="../assets/images/whatsapp-icon.png"
                      alt="javaexchange cricket"
                    />
                    Whastapp
                  </a>
                </li>
                <li>
                  <a
                    href="https://api.whatsapp.com/send?phone=918670234545"
                    target="_blank"
                  >
                    <img
                      src="../assets/images/whatsapp-icon.png"
                      alt="javaexchange cricket"
                    />
                    Whastapp
                  </a>
                </li>
                <li>
                  <a href="https://t.me/javaexch" target="_blank">
                    {/* <img src="uploads/join-us-icon.png" alt="javaexchange login" />{" "} */}
                    <img
                      src="../assets/images/join-us-icon.png"
                      alt="javaexchange cricket"
                    />
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="http://wa.link/javaonlineid" target="_blank">
                    <img
                      src="../assets/images/join-us-icon.png"
                      alt="javaexchange cricket"
                    />
                    {/* <img src="uploads/join-us-icon.png" alt="javaexchangeid" />{" "} */}
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="width-60-perc">
            <img
              src="../assets/images/home-banner-img.png"
              class="img-fluid"
              alt="javaexch"
            />
          </div>
        </div>
      </div>

      <section class="about-skyexch">
        <div class="">
          <div class="m-dis-center">
            <img
              src="../assets/images/about-exch.jpg"
              class="img-fluid m-ab-img"
              alt="javaexchange cricket"
            />
          </div>
        </div>
      </section>

      <div className="footer-section">
        <div class="left-footer">
          <p>2022 © javaonlineid. All Rights Reserved</p>

          <ul>
            <li>Follow Us:</li>
            <li>
              {" "}
              <a href="javascript:void(0)">
                <img src="../assets/images/facebook-app-symbol.png" />
              </a>{" "}
            </li>
            <li>
              {" "}
              <a href="javascript:void(0)">
                <img src="../assets/images/twitter.png" />
              </a>{" "}
            </li>
            <li>
              {" "}
              <a href="javascript:void(0)">
                <img src="../assets/images/instagram.png" />
              </a>{" "}
            </li>
          </ul>
        </div>

        <div class="ride-side-announcement text-end m-t-center">
          <a href="javascript:void(0)">
            <img src="../assets/images/join-us-icon.png" alt="javaexchangeid" />{" "}
            Join Us
          </a>
          <a href="javascript:void(0)">
            <img src="../assets/images/whatsapp-icon.png" alt="javaexch" />{" "}
            Whatsapp now
          </a>
        </div>
      </div>
    </>
  );
};

export default Blog;
