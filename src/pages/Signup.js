import { isEmpty } from "lodash";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { toast } from "wc-toast";

function Signup(props) {
    let { oneClickloginUser, isLoged, setShowModel, setOneClickData } = useContext(AuthProvider);
    const [data, setData] = useState({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
            uniqueId: Math.random() * 10000,
        },
    });
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
        reset: reset2,
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
            uniqueId: Math.random() * 10000,
        },
    });
    const [password_same, set_password_same] = useState();


    const [check, setCheck] = useState(false);
    const [isLoader, setLoader] = useState(false);


    const onSubmit = async (request) => {
        setLoader(true);
        console.log("apiPath?.addUser", apiPath?.addUser)
        try {
            console.log("apiPath?.addUser", apiPath?.addUser)
            const { status, data: response_users } = await apiPost(
                apiPath?.addUser,
                { createdBy: props.id }
            );
            if (status === 200) {
                if (response_users.success) {
                    setLoader(false);
                    let obj = { uniqueId: Math.random() * 10000, username: response_users?.results?.username, password: response_users?.results?.pwd }
                    oneClickloginUser(obj);
                    setShowModel(true);
                    toast.success(response_users.message);
                    setOneClickData(response_users.results);
                    reset();
                } else {
                    setLoader(false);
                    toast.error(response_users.message);
                }
            } else {
                setLoader(false);
                toast.error(response_users.message);
            }
        } catch (err) {
            setLoader(false);
            // toast.error(err.response.data.message);
        }

    };
    const navigate = useNavigate();

    const getSetting = async (event) => {
        try {
            const { status, data: response_users } = await apiGet(apiPath.getSetting + "?website=" + document?.location?.host);
            if (status === 200) {
                if (response_users.success) {
                    setData(response_users.results);
                }
            }
        } catch (err) { }
    };

    const onSubmit2 = async (request) => {


        setLoader(true);
        set_password_same(true);

        if (request.password !== request.confirmPassword) {
            set_password_same(false);
        } else {
            /**
             * ! request.userType = "super_admin";
             * * This should be managed by Backend.
             */
            try {
                const { status, data: response_users } = await apiPost(
                    apiPath.register,
                    { ...request }
                );
                if (status === 200) {
                    if (response_users.success) {
                        setLoader(false);
                        navigate("/login")
                        toast.success(response_users.message);
                        reset();
                    } else {
                        setLoader(false);
                        toast.error(response_users.message);
                    }
                } else {
                    setLoader(false);
                    toast.error(response_users.message);
                }
            } catch (err) {
                setLoader(false);
                toast.error(err.response.data.message);
            }
        }
    };

    useEffect(() => {
        getSetting()
    })



    return (
        <div className="login_main signUp">
            <header className="login-head">
                <Link to="/" className="close"></Link>
                <h1>{process.env.REACT_APP_SITE_NAME}</h1>
                {/* <div id="powerWrap" className="betfair-wrap">
            <p>Powered by</p>
            <span>

            </span>
          </div> */}
            </header>
            <div className="signup_tabs">
                <Tabs
                    defaultActiveKey="byemail"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >

                    <Tab eventKey="byemail">
                        <Form onSubmit={handleSubmit2(onSubmit2)}>
                            <dl className="form-login">

                                {/* <dd>
                  <Form.Select aria-label="Default select example" className="theme_select">
                    <option>Select Country</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </dd>
                <dd>
                  <Form.Select aria-label="Default select example" className="theme_select">
                    <option>Select City</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </dd> */}

                                {/* <dd>
                  <Form.Select aria-label="Default select example" className="theme_select">
                    <option>Select Currency</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>

                </dd> */}
                                {/* <dd>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter First Name"
                                            className={errors2.firstName ? " is-invalid " : ""}
                                            {...register2("firstName", {
                                                required: "Please enter first name",
                                                minLength: {
                                                    value: 2,
                                                    message:
                                                        "First name should contain at least 2 characters.",
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message:
                                                        "First name should contain at least 15 characters.",
                                                },
                                            })}
                                        />
                                        {errors2.firstName && errors2.firstName.message && (
                                            <label className="invalid-feedback text-left">
                                                {errors2.firstName.message}
                                            </label>
                                        )}
                                    </Form.Group>
                                </dd>
                                <dd>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Last Name"
                                            className={errors2.lastName ? " is-invalid " : ""}
                                            {...register2("lastName", {
                                                required: "Please enter last name",
                                                minLength: {
                                                    value: 2,
                                                    message:
                                                        "First name should contain at least 2 characters.",
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message:
                                                        "First name should contain at least 15 characters.",
                                                },
                                            })}
                                        />
                                        {errors2.lastName && errors2.lastName.message && (
                                            <label className="invalid-feedback text-left">
                                                {errors2.lastName.message}
                                            </label>
                                        )}
                                    </Form.Group>
                                </dd> */}
                                <dd>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Mobile Number"
                                            className={errors2.phone ? " is-invalid " : ""}
                                            {...register2("phone", {
                                                required: "Please enter mobile",
                                                maxLength: {
                                                    value: 15,
                                                    message: "Max length is 15 characters.",
                                                },
                                                minLength: {
                                                    value: 8,
                                                    message: "Min length is 8 characters.",
                                                },
                                                pattern: {
                                                    value: /^[0-9]*$/,
                                                    message: "Invalid mobile number.",
                                                },
                                            })}
                                        />
                                        {errors2.phone && errors2.phone.message && (
                                            <label className="invalid-feedback text-left">
                                                {errors2.phone.message}
                                            </label>
                                        )}
                                    </Form.Group>
                                </dd>
                                {/* <dd>
                                    <Form.Group>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter Email"
                                            className={errors2.email ? " is-invalid " : ""}
                                            {...register2("email", {
                                                required: "Please enter email",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address.",
                                                },
                                            })}
                                        />
                                        {errors2.email && errors2.email.message && (
                                            <label className="invalid-feedback text-left">
                                                {errors2.email.message}
                                            </label>
                                        )}
                                    </Form.Group>
                                </dd> */}

                                <dd>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter username"
                                            className={errors2.username ? " is-invalid " : ""}
                                            {...register2("username", {
                                                required: "Please enter username",
                                                minLength: {
                                                    value: 2,
                                                    message:
                                                        "Username should contain at least 2 characters.",
                                                },
                                                maxLength: {
                                                    value: 30,
                                                    message:
                                                        "Username should contain at least 30 characters.",
                                                },
                                            })}
                                        />
                                        {errors2.username && errors2.username.message && (
                                            <label className="invalid-feedback text-left">
                                                {errors2.username.message}
                                            </label>
                                        )}
                                    </Form.Group>
                                </dd>
                                <dd>
                                    <Form.Group>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter Password"
                                            className={errors2.password ? " is-invalid " : ""}
                                            {...register2("password", {
                                                required: "Please enter password",
                                                minLength: {
                                                    value: 8,
                                                    message:
                                                        "Password should contain atleast 8 characters",
                                                },
                                                maxLength: {
                                                    value: 16,
                                                    message:
                                                        "Password should contain maximum 16 characters",
                                                }
                                                // pattern: {
                                                //   value:
                                                //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                                //   message:
                                                //     "Your password should contain at-least 1 Uppercase, 1 Lowercase, 1 Numeric and 1 special character",
                                                // },
                                            })}
                                        />
                                        {errors2.password && errors2.password.message && (
                                            <label className="invalid-feedback text-left">
                                                {errors2.password.message}
                                            </label>
                                        )}
                                    </Form.Group>
                                </dd>

                                <dd>
                                    <Form.Group>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm Password"
                                            className={errors2.confirmPassword ? " is-invalid " : ""}
                                            {...register2("confirmPassword", {
                                                required: "Please enter confirm password",
                                            })}
                                        />
                                        {errors2.confirmPassword &&
                                            errors2.confirmPassword.message && (
                                                <label className="invalid-feedback text-left">
                                                    {errors2.confirmPassword.message}
                                                </label>
                                            )}
                                        {password_same === false &&
                                            errors2.confirmPassword !== "" && (
                                                <label className="invalid-feedback text-left">
                                                    Password does not match.
                                                </label>
                                            )}
                                    </Form.Group>
                                </dd>

                                <dd>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Referral Code"
                                            {...register2("refferedCode")}
                                        />
                                    </Form.Group>
                                </dd>







                                {/* <dd className="my-15">
                                    This site is protected by reCAPTCHA and the Google <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.
                                </dd> */}

                                <dd>
                                    <label className="agree_tag">
                                        <input type="checkbox" className="theme_checkbox" />
                                        <div> By clicking this button you confirm that you have read and agree to
                                            the <a href="#" style={{ color: 'red', cursor: 'pointer' }}>Terms and Conditions</a> and <a href="#" style={{ color: 'red', cursor: 'pointer' }}>Privacy Policy</a> of the
                                            company and confirm that you are of legal age. For support please contact me on <a href={"http://Wa.me/+" + data?.whatsappContent} target="_blank" style={{ color: 'black', cursor: 'pointer' }}>WhatsApp.</a></div>
                                    </label>
                                </dd>

                                <dd>
                                    <Button type="submit" className="btn-send w-100" id="loginBtn">
                                        Register
                                    </Button>
                                </dd>
                                <dd>
                                    <a href={"http://Wa.me/+" + data?.whatsappContent} target="_blank" style={{ color: 'black', cursor: 'pointer' }} className="btn-send whatsup w-100" id="loginBtn">
                                        <img src="assets/images/home/whatsappNew.svg"  className="registerWhatsup"/><span>Get Instant ID</span>
                                    </a>
                                </dd>


                            </dl>

                        </Form>
                    </Tab>
                </Tabs>

            </div>
        </div >
    );
}

export default Signup;