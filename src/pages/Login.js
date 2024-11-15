import { isEmpty } from "lodash";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
function Login(props) {
  let { loginUser, isLoged } = useContext(AuthProvider);
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    unregister,
    reset: reset2,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      uniqueId: Math.random() * 10000,
    },
  });
  const [getValidateCode, setValidateCode] = useState("");
  const [data, setData] = useState({});
  const onSubmit2 = (data) => {
    if (parseInt(data.validateCode) === parseInt(getValidateCode)) {
      loginUser(data);
    }
  };
  const canvasRef = useRef(null);
  const changeCode = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.font = "bold 120px sans-serif";
    const code = Math.floor(1000 + Math.random() * 9000);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(code, 0, 130);
    setValidateCode(code);
  };

  const getSetting = async (event) => {
    try {
      const { status, data: response_users } = await apiGet(apiPath.getSetting + '?website=' + document?.location?.host);
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results);
        }
      }
    } catch (err) { }
  };
  useEffect(() => {
    changeCode();
    getSetting();
  }, []);
  return (
    <div>
      <div className="login_main">
        <header className="login-head">
          <Link to="/" className="close"></Link>
          <h1>SKYEXCHANGE</h1>
          <div id="powerWrap" className="betfair-wrap">
            <p>Powered by</p>
            <span>
              {/* <img
                src={process.env.REACT_APP_URL + "/assets/images/betfair_black.png"}
                alt=""
                draggable="false"
              /> */}
            </span>
          </div>
        </header>
        <Form onSubmit={handleSubmit2(onSubmit2)}>
          <dl className="form-login">
            <Form.Group
              style={{ marginBottom: "10px" }}
              id="loginNameErrorClass"
            >
              <Form.Control
                type="text"
                autocomplete="off"
                // id="loginName"
                className={errors2.username ? "is-invalid" : ""}
                {...register2("username", {
                  required: "Please enter Username",
                })}
                placeholder="Username"
              />
              {errors2.username && errors2?.username?.message && (
                <label className="invalid-feedback text-left">
                  {errors2.username.message}
                </label>
              )}
            </Form.Group>
            <Form.Group
              style={{ marginBottom: "10px" }}
              id="passwordErrorClass"
            >
              <Form.Control
                type="password"
                autocomplete="off"
                // id="password"
                className={errors2.password ? "is-invalid" : ""}
                {...register2("password", {
                  required: "Please enter password",
                })}
                data-role="none"
                placeholder="Password"
              />
              {errors2.password && errors2.password.message && (
                <label className="invalid-feedback text-left">
                  {errors2.password.message}
                </label>
              )}
            </Form.Group>
            <dd id="validCodeErrorClass" style={{ display: "block" }}>
              <input
                type="number"
                keyboardType="numeric"
                autocomplete="off"
                maxLength="4"
                className={errors2.validateCode ? "is-invalid" : ""}
                {...register2("validateCode", {
                  required: "Please enter validate code",
                  validate: {
                    validate: (value) =>
                      parseInt(value) === parseInt(getValidateCode) ||
                      "Invalid validate code",
                  },
                })}
                onChange={(e) => {
                  if (e.target.value.length == 4) {
                    e.target.blur();
                    unregister("validateCode", { keepValue: true });
                  }
                }}
                // onChange={(e) => {
                //   if (e.target.value.length <= 4) {
                //     setCode(false);
                //   } else {
                //     setCode(true);
                //   }
                // }}
                id="validCode"
                placeholder="Validation Code"
              // onClick={(e) => e.target.blur()}
              // onKeyDown={(e) => e.target.blur()}
              />
              {/* <img
                id="authenticateImage"
                src="assets/images/verifycode.jpg"
                alt=""
              /> */}
              <canvas
                ref={canvasRef}
                onClick={changeCode}
                className="inputcanvas"
                id="authenticateImage"
              />

              {errors2.validateCode && errors2.validateCode.message && (
                <label className="invalid-feedback text-left">
                  {errors2.validateCode.message}
                </label>
              )}
            </dd>
            {/* <dd>
              <input name="valid" type="hidden" id="valid" />
            </dd> */}
            <dd>
              <Button type="submit" className="btn-send w-100" id="loginBtn">
                Login
              </Button>
            </dd>
            {isLoged == "failed" && (
              <dd id="errorMsg" class="state">
                Login name or password is invalid! Please try again.
              </dd>
            )}
          </dl>
        </Form>

        <ul className="policy-link" style={{ display: "block" }}>
          <li>
            <a href="/">Privacy Policy</a>
          </li>
          <li>
            <a href="/">Terms and Conditions</a>
          </li>
          <li>
            <a href="/">Rules and Regulations</a>
          </li>
          <li>
            <a href="/">KYC</a>
          </li>
          <li>
            <a href="/">Responsible Gaming</a>
          </li>
          {/* <li>
            <a href="/">About Us</a>
          </li>
          <li>
            <a href="/">Self-Exclusion Policy</a>
          </li>
          <li>
            <a href="/">Underage Policy</a>
          </li> */}
        </ul>

        {/* <div className="support-wrap extend-support"> */}
        {/* <div className="extend-btn">
            <img
              src={
                process.env.REACT_APP_URL +
                "/assets/images/transparent.gif"
              }
              title="customer"
              className="support-customer"
            />
            <a
              href="#"
              target="_blank"
            >
              Customer support1
            </a>
            <a
              href="#"
              target="_blank"
              className="split-line"
            >
              support2
            </a>
          </div> */}
        {/* { 
            data?.whatsappShowing != "false" ?
          <div className="extend-btn">
            <img
              src="assets/images/transparent.gif"
              title="WhatsApp"
              className="support-whatsapp"
            />
            {data?.whatsappShowing == 'true' && data?.whatsappContent != '' && <a
              href={"http://Wa.me/+" + data?.whatsappContent}
              target="_blank"
            >
              WhatsApp 1
            </a>}
            {data?.whatsappShowing2 == 'true' && data?.whatsappContent2 != '' && <a
              href={"http://Wa.me/+" + data?.whatsappContent2}
              target="_blank"
              className={data?.whatsappShowing == 'true' && "split-line"}
            >
              WhatsApp 2
            </a>} */}
        {/* <a
              href="http://Wa.me/+15705055756"
              target="_blank"
              className="split-line"
            >
              +1 570 5055756
            </a> */}
        {/* </div> */}
        {/* : ""} */}
        {/* {data?.telegramShowing != "false" || data?.telegramShowing2  != "false" ?
          <div className="extend-btn">
            <img
              src={
                process.env.REACT_APP_URL +
                "/assets/images/transparent.gif"
              }
              title="Telegram"
              className="support-telegram"
            />
            {data?.telegramShowing == 'true' && data?.telegramContent != '' && <a href={"http://t.me/" + data?.telegramContent} target="_blank">{data?.telegramContent}</a>}
            {data?.telegramShowing2 == 'true' && data?.telegramContent2 != '' && <a href={"http://t.me/" + data?.telegramContent2} target="_blank" className={data?.telegramShowing == 'true' && "split-line"}>
              {data?.telegramContent2}
            </a>}
          </div>
          : ""} */}

        {/* <div className="support-social"> */}
        {/* <div className="social-btn">
              <img
                src={
                  process.env.REACT_APP_URL +
                  "/assets/images/transparent.gif"
                }
                title="Skype"
                className="support-skype"
              />
              <a href="#" target="_blank">
                Skype
              </a>
            </div> */}

        {/* {data?.facebookShowing == 'true' && data?.facebookContent != '' && <div className="social-btn">
              <img
                src={
                  process.env.REACT_APP_URL +
                  "/assets/images/home/icons8-facebook-48.png"
                }
                title="Email"
                className="support-mail"
              /> */}
        {/* <a href={`mailto:${data?.emailContent}`} target="_blank">
                Email
              </a> */}
        {/* <a href={data?.facebookContent} target="_blank">
                Facebook
              </a>
            </div>} */}

        {/* {data?.instagramShowing == 'true' && data?.instagramContent != '' && <div className="social-btn">
              <img
                src={
                  process.env.REACT_APP_URL +
                  "/assets/images/transparent.gif"
                }
                title="Instagram"
                className="support-ig"
              />
              <a href={data?.instagramContent} target="_blank" className="ui-link">
                Instagram
              </a>
            </div>} */}
        {/* </div> */}
        {/* </div> */}
        {/* <div className="support-wrap extend-supportLink">
          {data?.emailShowing == "true" && data?.emailContent != "" && (
            <a href={`mailto:${data?.emailContent}`}><img src="assets/images/home/mail.svg" /></a>
          )}
          <a href="#"><img src="assets/images/home/twitter.svg" /></a>
          {data?.whatsappShowing == "true" && data?.whatsappContent != "" && (
            <a href={"http://Wa.me/+" + data?.whatsappContent} target="_blank">
              <img src="assets/images/home/whatsappNew.svg" />
            </a>
          )}
          <a href="#"><img src="assets/images/home/skypeNew.svg" /></a>
          {data?.instagramShowing == "true" && data?.instagramContent != "" && (
            <a href={data?.instagramContent} target="_blank"><img src="assets/images/home/instagram.svg" /></a>
          )}
          {data?.facebookShowing == "true" && data?.facebookContent != "" && (
            <a href={data?.facebookContent} target="_blank"><img src="assets/images/home/facebook.svg" /></a>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default Login;
