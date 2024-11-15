import { isEmpty } from "lodash";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { useNavigate, useLocation } from "react-router-dom";

function Recharge(props) {
    let { loginUser, setPaymentModel, oneClickData, setPaymentObj, user } = useContext(AuthProvider);
    const navigate = useNavigate();
    const location = useLocation();
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

    const [data, setData] = useState({});
    const onSubmit2 = (data) => {

        loginUser(data);

    };
    const getData = async () => {
        const { status, data: response_users } = await apiGet(
            apiPath.paymentList
        );
        if (status === 200) {
            if (response_users.success) {
                setData(response_users?.results?.data || []);

            }
        }

    };
    useEffect(() => {

        getData();
    }, []);
    return (
        <div>
            <div className="account_detail">
                {/* <div className="acc-number-main">
                    <dd className="acc-number">ACCOUNT {oneClickData?.username}  </dd>
                    <p>Select payment method to top up your account: </p>
                </div>


                <div className="excl">
                    If you do not receive the deposit amount in your gaming account within
                    3 hours please contact our general queries with the proof of transaction confirmation.
                </div> */}


                <div className="bank_block">
                    <h4>RECOMMENDED METHODS </h4>
                    <ul>
                        {data?.length > 0 && data?.map((item, index) => {
                            return (
                                <li>
                                    <a href="javascript:void(0)" onClick={() => {
                                        if (!isEmpty(user)) {
                                            if (location?.state?.from !== 'withdraw') {
                                                setPaymentModel(true);
                                                setPaymentObj(item);
                                            } else {
                                                setPaymentObj(item);
                                                navigate("/payment-withdraw-submit");
                                            }
                                        } else {
                                            navigate("/login");
                                        }
                                    }}>
                                        <figure><img src={item?.logoImageUrl} className="h-auto" /></figure>
                                        <figcaption className="text-dark">
                                            {item?.paymentName}
                                        </figcaption>
                                    </a>
                                </li>)
                        })}



                    </ul>


                </div>


            </div>
        </div>
    );
}

export default Recharge;
