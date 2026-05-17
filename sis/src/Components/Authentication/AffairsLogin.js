import logo from '../../Images/logo.jpeg';
import luxorUniversity from '../../Images/luxorUniversity.png';

import axios from "axios";
import './athentication.css';
import './login.css';

import Fail from '../Modals/Fail';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AffairsLogin() {
    const navigate = useNavigate();

    const [failModal, setFailModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    function closeModal() {
        if (failModal) {
            setFailModal(false);
        }
    }

    const getErrorMessage = (error) => {
        if (!error.response) {
            return "Network error. Please check your internet connection.";
        }

        const responseData = error.response.data;

        if (typeof responseData === "string") {
            return responseData;
        }

        if (responseData?.errors) {
            return Object.values(responseData.errors).flat().join(" | ");
        }

        return (
            responseData?.message ||
            responseData?.title ||
            responseData?.error ||
            "Login failed. Please check your email and password."
        );
    };

    const loginAffairs = async (payload) => {
        const response = await axios.post(
            "https://ssis.runasp.net/api/Auth/login",
            payload
        );
        return response.data;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setFailModal(false);
        setErrorMessage("");

        try {
            const res = await loginAffairs(data);

            console.log("LOGIN RESPONSE:", res);

            // ✅ Extract token
            const token =
                res?.token ||
                res?.Token ||
                res?.data?.token ||
                res?.data?.Token;

            if (!token) {
                throw new Error("Login succeeded but token was not returned.");
            }

            // ✅ Extract role - THIS IS THE KEY FIX
            const role =
                res?.role ||
                res?.Role ||
                res?.roles?.[0] ||
                res?.data?.role ||
                res?.data?.Role ||
                res?.data?.roles?.[0] ||
                "";

            // ✅ Block non-admin users from accessing Affairs dashboard
            const allowedRoles = ["admin", "affairs", "studentaffairs"];
            if (role && !allowedRoles.includes(role.toLowerCase())) {
                setErrorMessage(
                    `Access denied. This portal is for Affairs staff only. Your role is: ${role}`
                );
                setFailModal(true);
                return;
            }

            // ✅ Extract name & email
            const userName =
                res?.userName || res?.fullName || res?.name ||
                res?.data?.userName || res?.data?.fullName || "Admin";

            const userEmail =
                res?.email || res?.Email ||
                res?.data?.email || data.email;

            // ✅ Save everything to localStorage
            localStorage.setItem("token",      token);
            localStorage.setItem("userEmail",  userEmail);
            localStorage.setItem("userName",   userName);
            localStorage.setItem("userRole",   role);   // ← THE CRITICAL FIX

            navigate("/HomeAffaris");

        } catch (error) {
            console.log("LOGIN ERROR:", error);
            const msg = getErrorMessage(error);
            setErrorMessage(msg);
            setFailModal(true);
        }
    };

    return (
        <div
            onClick={closeModal}
            className='studentRegister row justify-content-center align-items-center p-4 m-0'
        >
            <div className='row form-login rounded-3 row-cols-md-2 row-cols-sm-1 row-cols-1 p-2'>

                <div className='col logos1 row justify-content-center align-items-center'>
                    <div className='row'>
                        <div className='col'>
                            <h3 className='text-center' style={{ color: "#0a3f8e" }}>
                                Student Affairs Login Form
                            </h3>
                            <div className='row justify-content-evenly align-items-center text-center gap-1 p-2'>
                                <div className='col'>
                                    <img className='photoStyler rounded-2' src={logo} alt="logo" />
                                </div>
                                <div className='col'>
                                    <img className='photoStyler rounded-2' src={luxorUniversity} alt="luxor university" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bottom-login col row align-items-center justify-content-center'>
                    <form onSubmit={handleLogin}>
                        <div className='row row-cols-lg-1 row-cols-md-1 row-cols-sm-2 row-cols-1 align-items-center'>

                            <div className='col ps-5'>
                                <div className='col'>
                                    <label>Email</label>
                                    <input
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                        className='input form-control'
                                        type="email"
                                        placeholder='....@gmail.com'
                                        required
                                    />
                                </div>

                                <div className='col'>
                                    <label>Password</label>
                                    <input
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                        className='input form-control'
                                        type="password"
                                        placeholder='*******'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='col text-center'>
                                <div className='row justify-content-center align-items-end p-2'>
                                    <button
                                        type="submit"
                                        className='col w-50 border-0 p-2 rounded-2 m-1 register login12'
                                    >
                                        Login
                                    </button>
                                </div>
                                <a className='text-primary forgetPassword'>Forget Password??</a>
                            </div>

                        </div>
                    </form>
                </div>

            </div>

            <Fail visible={failModal} Message={errorMessage} />
        </div>
    );
}