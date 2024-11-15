import { isEmpty } from "lodash";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "wc-toast";

function PaymentSubmit(props) {
    let {
        loginUser,
        setPaymentModel,
        oneClickData,
        setPaymentObj,
        user,
        paymentObj,
    } = useContext(AuthProvider);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            amount: state.amount,
        },
    });

    const [file, setFile] = useState();
    const [selectedFile, setSelectedFile] = useState("");
    function handleChange(e) {
        setFile(URL.createObjectURL(e.target.files[0]));
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }
    const onSubmit = async (data) => {
        setLoader(true);
        const formData = new FormData();

        if (selectedFile) {
            if (selectedFile.name) {
                formData.append("image", selectedFile, selectedFile.name);
            }
        }

        formData.append("amount", data.amount);
        // formData.append("customerName", data.customerName);
        // formData.append("utrNumber", data.utrNumber);

        try {
            const { status, data: response_users } = await apiPost(
                apiPath.submitPaymentRequest,
                formData
            );

            if (status === 200) {
                if (response_users.success) {
                    setLoader(false);
                    setPaymentObj({});
                    toast.success(response_users.message);
                    reset();
                    navigate("/profile");
                } else {
                    setLoader(false);
                    toast.error(response_users.results.message);
                }
            } else {
                setLoader(false);
                toast.error(response_users.message);
            }
        } catch (err) {
            setLoader(false);
            toast.error(err.response.data.message);
        }
    };
    return (
        <div>
            <div className="instration_wrap">
                {/* <div className="instration__colapse">
                    <strong>Instruction</strong>
                    <ol>
                        <li>
                            Make your payment to the provided Recipient details and{" "}
                            <b>make a screenshot</b> of sucessful payment. Payment details for
                            transferring the funds provided in section{" "}
                            <b>«Make a Transfer»</b> below.
                        </li>
                        <li>
                            Use the section <b>«Request a Deposit»</b> to put your deposit
                            amount and correct transaction UTR number/ID mentioned in payment
                            slip. If required — fill the other fields like{" "}
                            <b>«Customer Name»</b>.
                        </li>
                        <li>
                            <b>Upload a screenshot</b> from step 1.
                        </li>
                        <li>
                            Click on <b>«Make Payment»</b> button and wait till your request
                            will be proceeded.
                        </li>
                    </ol>
                </div> */}

                <div className="transfer_section">
                    <div className="instration_title">1. Make a Transfer</div>

                    <div className="card-layout__content card-layout__content_small">
                        {paymentObj?.key1 && (
                            <div className="card-layout__item card-layout__item_info">
                                <span className="title">{paymentObj?.key1}</span>
                                <span className="copy_value">
                                    <span className="card-layout__item_text">
                                        {paymentObj?.value1}
                                    </span>
                                    <span className="copy">
                                        <img src="assets/images/copy.png" alt="" />
                                    </span>
                                </span>
                            </div>
                        )}
                        {paymentObj?.key2 && (
                            <div className="card-layout__item card-layout__item_info">
                                <span className="title">{paymentObj?.key2}</span>
                                <span className="copy_value">
                                    <span className="card-layout__item_text">
                                        {paymentObj?.value2}
                                    </span>
                                    <span className="copy">
                                        <img src="assets/images/copy.png" alt="" />
                                    </span>
                                </span>
                            </div>
                        )}
                        {paymentObj?.key3 && (
                            <div className="card-layout__item card-layout__item_info">
                                <span className="title">{paymentObj?.key3}</span>
                                <span className="copy_value">
                                    <span className="card-layout__item_text">
                                        {paymentObj?.value3}
                                    </span>
                                    <span className="copy">
                                        <img src="assets/images/copy.png" alt="" />
                                    </span>
                                </span>
                            </div>
                        )}
                        {paymentObj?.key4 && (
                            <div className="card-layout__item card-layout__item_info">
                                <span className="title">{paymentObj?.key4}</span>
                                <span className="copy_value">
                                    <span className="card-layout__item_text">
                                        {paymentObj?.value4}
                                    </span>
                                    <span className="copy">
                                        <img src="assets/images/copy.png" alt="" />
                                    </span>
                                </span>
                            </div>
                        )}
                        {paymentObj?.qrImageUrl && (
                            <div className="card-layout__item card-layout__item_info">
                                <span className="title">QR Code</span>
                                <span className="copy_value">
                                    <span className="card-layout__item_text">
                                        <img src={paymentObj?.qrImageUrl} alt={paymentObj?.qrImageUrl} style={{ width: `100px` }}></img>
                                    </span>
                                    <span className="copy">
                                        <img src="assets/images/copy.png" alt="" />
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="Request_section">
                    <div className="instration_title">2. Request a Deposit</div>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <dd>
                            <Form.Group>
                                {/* <Form.Label>Amount:</Form.Label> */}
                                <Form.Control
                                    type="number"
                                    disabled={true}
                                    className={errors.amount ? " is-invalid " : ""}
                                    {...register("amount", {
                                        required: "Please enter amount",
                                    })}
                                />
                                {errors.amount && errors.amount.message && (
                                    <label className="invalid-feedback text-left">
                                        {errors.amount.message}
                                    </label>
                                )}
                            </Form.Group>
                        </dd>

                        {/* <dd>
                            <Form.Group>
                                <Form.Control
                                    placeholder="Enter Customer Name"
                                    className={errors.amount ? " is-invalid " : ""}
                                    {...register("customerName", {
                                        required: "Please enter customer name",
                                    })}
                                />
                                {errors.customerName && errors.customerName.message && (
                                    <label className="invalid-feedback text-left">
                                        {errors.customerName.message}
                                    </label>
                                )}
                            </Form.Group>
                        </dd>
                        <dd>
                            <Form.Group>
                                <Form.Control
                                    placeholder="Enter 12 UTR number"
                                    className={errors.amount ? " is-invalid " : ""}
                                    {...register("utrNumber", {
                                        required: "Please enter 12 digit utr number ",
                                    })}
                                />
                                {errors.utrNumber && errors.utrNumber.message && (
                                    <label className="invalid-feedback text-left">
                                        {errors.utrNumber.message}
                                    </label>
                                )}
                            </Form.Group>
                        </dd> */}

                        <dd>
                            <Form.Group>
                                <input
                                    type="file"
                                    accept=".png, .jpeg, .jpg"
                                    onChange={handleChange}
                                    className="width_form"
                                />
                                <img src={file} className="mt-4" />
                            </Form.Group>
                        </dd>

                        <dd>
                            <Button
                                type="submit"
                                className="btn-send w-100"
                                id="loginBtn"
                                disabled={loader}
                            >
                                {loader ? "Loading..." : "Submit"}
                            </Button>
                        </dd>

                        <dd>
                            <Button
                                className="btn-send w-100"
                                id="loginBtn"
                                onClick={(e) => navigate("/recharge")}
                            >
                                Return
                            </Button>
                        </dd>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default PaymentSubmit;
