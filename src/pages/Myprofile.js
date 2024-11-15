import React, { useState, useEffect, useContext } from "react";
import {
    Container,
    Row,
    Col,
    Table,
    Form,
    Button,
    Modal,
} from "react-bootstrap";
// import Sidebar from "../components/Sidebar";
import { apiGet, apiPost } from "../Utils/apiFetch";
import apiPath from "../Utils/apiPath";
import { isEmpty, pick } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "wc-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import Loader from "../assets/gif/loader.gif";
import AuthContext from "../context/AuthContext";
const Myprofile = () => {
    let { user } = useContext(AuthContext);
    const parmas = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState("");
    const [password_same, set_password_same] = useState(true);
    const [isLoader, setLoader] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const changePasswordToggle = () => setChangePassword(!changePassword);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({});

    const myProfile = async () => {
        setLoader(true);
        const { status, data: response_users } = await apiGet(apiPath.userProfile);
        if (status === 200) {
            if (response_users.success) {
                setLoader(false);
                setProfileData(response_users.results);
            }
        }
    };

    const onSubmit = async (request) => {
        setLoader(true);
        set_password_same(true);

        if (request.newPassword !== request.confirmPassword) {
            setLoader(false);
            set_password_same(false);
        } else {
            const { status, data: response_users } = await apiPost(
                apiPath.changePassword,
                pick(request, ["oldPassword", "newPassword"])
            );
            if (status === 200) {
                if (response_users.success) {
                    setLoader(false);
                    setChangePassword();
                    toast.success(response_users.message);
                    reset();
                } else {
                    setLoader(false);
                    toast.error(response_users.message);
                }
            }
        }
    };

    useEffect(() => {
        if (user != null) {
            myProfile();
        }
    }, [user]);
    console.log("profileData",profileData)
    return (
        <>
            <section className="py-4 main-inner-outer">
                <Container fluid>
                    <div className="main_content_row">
                        {/* <Sidebar /> */}
                        {isLoader ? (
                            <span className="d-flex justify-content-center align-item-center mt-2 pb-3">
                                {/* <img src={Loader} alt="No_Image" /> */}
                            </span>
                        ) : (
                            <div className="my_account_main">
                                <div className="inner-wrapper my-profile-sec ">
                                    <h2 className="common-heading">Account Details</h2>

                                    <section className="account-table">
                                        <div className="profile-tab">
                                            <Row>
                                                <Col lg={6} md={12}>
                                                    <div className="my_account_table_wrap">
                                                        <h5>About You </h5>
                                                        <div className="table-main-wrapper">
                                                            <Table className="table_caption_style profile_table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            First Name
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            {profileData?.firstName}{" "}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Last Name
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            {profileData?.lastName}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Username
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                        {profileData?.username}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Email
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            {profileData?.email}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Password
                                                                        </td>
                                                                        <td className="text-start">************</td>
                                                                        <td>
                                                                            {location?.pathname?.split("/")[2] !==
                                                                                "mobile" && (
                                                                                    <Link
                                                                                        to="#"
                                                                                        className="text-decoration-none"
                                                                                        onClick={changePasswordToggle}
                                                                                    >
                                                                                        Edit{" "}
                                                                                        <i className="fas fa-pen text-white ps-1"></i>
                                                                                    </Link>
                                                                                )}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Timezone
                                                                        </td>
                                                                        <td className="text-start">
                                                                            {profileData?.timeZone}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>

                                                    {/* <div className="my_account_table_wrap">
                                                        <h5>Address</h5>

                                                        <div className="table-main-wrapper">
                                                            <Table className="table_caption_style profile_table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Address
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            --
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Town/City
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            --
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Country
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            --
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Country/State
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            --
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Postcode
                                                                        </td>
                                                                        <td className="text-start">--</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Timezone
                                                                        </td>
                                                                        <td className="text-start">
                                                                            {profileData?.timeZone}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div> */}
                                                </Col>

                                                <Col lg={6} md={12}>
                                                    <div className="my_account_table_wrap">
                                                        <h5> Contact Details</h5>

                                                        <div className="table-main-wrapper">
                                                            <Table className="table_caption_style profile_table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Primary number
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            {profileData?.phone}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                    <div className="my_account_table_wrap">
                                                        <h5>My Referral</h5>

                                                        <div className="table-main-wrapper">
                                                            <Table className="table_caption_style profile_table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Code
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            {profileData?.referralCode || "N/A"}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                    {/* <div className="my_account_table_wrap">
                                                        <h5>Setting</h5>

                                                        <div className="table-main-wrapper">
                                                            <Table className="table_caption_style profile_table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Currency
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            {process.env.REACT_APP_SHOW_CURRENCY == 'true' ? process.env.REACT_APP_CURRENCY : '--'}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Odds Format
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            --
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div> */}
                                                    {/* <div className="my_account_table_wrap">
                                                        <h5>Commission </h5>

                                                        <div className="table-main-wrapper">
                                                            <Table className="table_caption_style profile_table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-start" width="25%">
                                                                            Comm charged
                                                                        </td>
                                                                        <td className="text-start" colSpan="3">
                                                                            {profileData?.commission} {"%"}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div> */}
                                                </Col>
                                            </Row>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </section>
            {/* change-password */}

            <Modal
                show={changePassword}
                onHide={changePasswordToggle}
                className="change-status-modal p-0"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title-status h4" style={{ display: 'flex', }}>
                        <div>Change Password</div>
                        <span onClick={changePasswordToggle} style={{ position: 'absolute', right: '20px' }}>X</span>
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className="test-status p-4 border-0">
                        <Form
                            className="change-password-sec"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Form.Group className="d-flex  mb-2">
                                <Form.Label>New Password</Form.Label>
                                <div className="common-form-sec">
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter New Password"
                                        className={errors.newPassword ? " is-invalid " : ""}
                                        {...register("newPassword", {
                                            required: "Please enter new password",
                                            validate: (value) => {
                                                if (value === "") {
                                                    return true;
                                                }
                                                var paswd =
                                                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})";
                                                if (value.match(paswd)) {
                                                    return true;
                                                } else {
                                                    return "New Password must have minimum 8 character with 1 lowercase, 1 uppercase, 1 numeric and 1 special character.";
                                                }
                                            },
                                        })}
                                    />
                                    {errors.newPassword && errors.newPassword.message && (
                                        <label className="invalid-feedback text-left">
                                            {errors.newPassword.message}
                                        </label>
                                    )}
                                </div>
                            </Form.Group>
                            <Form.Group className="d-flex  mb-2">
                                <Form.Label>New Password Confirm</Form.Label>
                                <div className="common-form-sec">
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        className={
                                            errors.confirmPassword || password_same === false
                                                ? " is-invalid "
                                                : ""
                                        }
                                        {...register("confirmPassword", {
                                            required: "Please enter confirm password",
                                        })}
                                    />
                                    {errors.confirmPassword && errors.confirmPassword.message && (
                                        <label className="invalid-feedback text-left">
                                            {errors.confirmPassword.message}
                                        </label>
                                    )}
                                    {password_same === false && errors.confirmPassword !== "" && (
                                        <label className="invalid-feedback text-left">
                                            Password does not match.
                                        </label>
                                    )}
                                </div>
                            </Form.Group>

                            <Form.Group className="d-flex  mb-2">
                                <Form.Label>Your Password</Form.Label>
                                <div className="common-form-sec">
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter Old Password"
                                        className={errors.oldPassword ? " is-invalid " : ""}
                                        {...register("oldPassword", {
                                            required: "Please enter password",
                                            validate: (value) => {
                                                if (value === "") {
                                                    return true;
                                                }
                                                var paswd =
                                                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})";
                                                if (value.match(paswd)) {
                                                    return true;
                                                } else {
                                                    return true
                                                    // return "Password must have minimum 8 character with 1 lowercase, 1 uppercase, 1 numeric and 1 special character.";
                                                }
                                            },
                                        })}
                                    />
                                    {errors.oldPassword && errors.oldPassword.message && (
                                        <label className="invalid-feedback text-left">
                                            {errors.oldPassword.message}
                                        </label>
                                    )}
                                </div>
                            </Form.Group>

                            <div className="text-center mt-4">
                                <Button type="submit" className="yellow-btn">
                                    {isLoader ? "Loading..." : "Change"}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Myprofile;
