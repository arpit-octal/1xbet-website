import React, { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "wc-toast";

const PaymentPopup = () => {
    let {
        setPaymentModel,
        paymentModel,
        setPaymentObj,
        paymentObj,
    } = useContext(AuthProvider);

    const [loader, setLoader] = useState(false);

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            amount: paymentObj.minAmount ? paymentObj.minAmount : ''
        }
    });
    const onSubmit = async (data) => {

        if (parseFloat(data.amount) < parseFloat(paymentObj.minAmount)) {
            toast.error("You can't enter less then min amount");
        } else if (parseFloat(data.amount) > parseFloat(paymentObj.maxAmount)) {
            toast.error("You can't enter greater then max amount ");
        } else {
            reset()
            setPaymentModel(false);
            // navigate("/payment-submit", { amount: data });
            navigate('/payment-submit', { state: { amount: data.amount } });

        }
    };

    return (
        <div
            id="common_transfer_to_go"
            className="overlay"
            style={{ display: paymentModel && paymentObj.minAmount > 0 ? "flex" : "none" }}
        >
            <div id="commonDialogWrap" className="pop-wrap transfer-wrap-slider payment_popup">
                <button className="popup_close" onClick={() => {
                    setPaymentModel(false);
                    reset()
                }}>X</button>
                <figure><img src={paymentObj?.logoImageUrl} /></figure>
                <figcaption className="amout_vl">
                    <span>Amount
                        (Min {paymentObj?.minAmount} {process.env.REACT_APP_SHOW_CURRENCY == 'true' ? process.env.REACT_APP_CURRENCY : ''}
                        / Max {paymentObj?.maxAmount} {process.env.REACT_APP_SHOW_CURRENCY == 'true' ? process.env.REACT_APP_CURRENCY : ''}):</span>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group>
                            <Form.Control
                                type="number"

                                placeholder="Enter amount"
                                className={errors.amount ? " is-invalid " : ""}
                                {...register("amount", {
                                    required: "Please enter amount",
                                })}
                            />
                            {errors.amount &&
                                errors.amount.message && (
                                    <label className="invalid-feedback text-left">
                                        {errors.amount.message}
                                    </label>
                                )}
                        </Form.Group>

                        <dd>
                            <Button type="submit" className="btn-send w-100" id="loginBtn">
                                Confirm
                            </Button>
                        </dd>

                    </Form>

                </figcaption>

            </div>

        </div>
    );
};

export default PaymentPopup;
