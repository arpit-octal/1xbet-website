import { isEmpty, startCase } from "lodash";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "wc-toast";
import ReactPaginate from "react-paginate";
import helpers from '../Utils/helpers'

function WithdrawRequest(props,) {
    let { loginUser, setPaymentModel, oneClickData, setPaymentObj, user, paymentObj, profileData } = useContext(AuthProvider);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [result, setResult] = useState()
    const [loader, setLoader] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            amount: profileData?.totalCoins
        }
    }
    );

    const myRequests = async () => {
        const data = await apiGet(
            apiPath.withdrawRequest
        );
        console.log('data', data)
        if (data.data.success) {
            setLoader(false);
            setResult(data.data.results)
        } else {
            setLoader(false);
            toast.error(data.data.message);
        }

    }

    const [file, setFile] = useState();
    const [selectedFile, setSelectedFile] = useState('');
    function handleChange(e) {

        setFile(URL.createObjectURL(e.target.files[0]));
        if (e.target.files[0]) {

            setSelectedFile(e.target.files[0]);
        }
    }

    useEffect(() => {
        myRequests()
    }, [])
    return (
        <div>
            <div className="responsive">
                <div className="table-wrapper">
                    <Table>
                        <thead>
                            <tr>
                                <th scope="col">Amount</th>
                                <th scope="col">Bank Name</th>
                                <th scope="col">Account Number</th>
                                <th scope="col">IFSC Code</th>
                                <th scope="col">Status</th>
                                <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result &&
                                result?.map((request, index) => (
                                    <tr key={index}>
                                        <td>{request?.amount}</td>
                                        <td>{request?.bankName || 'N/A'}</td>
                                        <td>{request?.accountNumber || 'N/A'}</td>
                                        <td>{request?.ifscCode || 'N/A'}</td>
                                        <td style={{ fontWeight: 700, color: request?.status === 'Completed' ? 'green' : request?.status === 'Pending' ? '#fecc2b' : 'red' }}>
                                            {request?.paymentStatus ? startCase(request?.paymentStatus) : startCase(request?.status)}
                                        </td>
                                        <td>{helpers.dateFormat(request.createdAt, user.timeZone)}</td>
                                    </tr>
                                ))}
                            {isEmpty(result) && (
                                <tr>
                                    <td colSpan={9}>No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

        </div>

    );
}

export default WithdrawRequest;
