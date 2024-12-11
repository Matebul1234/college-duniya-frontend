import React, { useState } from 'react'
import '../assets/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Signup = () => {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const signupdata = { ...signupInfo };
        signupdata[name] = value;
        setSignupInfo(signupdata);
        console.log(name, value)
    }
    console.log("signupInfo", signupInfo)

    const formSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh
        const { name, email, password, confirm_password } = signupInfo;

        if (!name || !email || !password || !confirm_password) {
            toast.error("All fields are required !");
            return;
        }
        // Simple validation
        if (signupInfo.password !== signupInfo.confirm_password) {
            toast.error("Passwords do not match");
            return;
        }

        const sendData = { name, email, password };

        try {
            const url = 'http://localhost:8080/auth/signup';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendData)
            })
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                toast.success(success);
                setTimeout(() => { navigate('/login') }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                toast.error(details)
            } else if (!success) {
                toast.error(message)
            }

            // if (result.message === 'Signup successfully') {
            //     toast.success(result.message || "Signup successful!");
            //     setTimeout(() => {
            //         navigate('/login');
            //     }, 1000);
            // }
            // if (result.message === 'User already exists, you can login') {
            //     toast.warn("User already exists, you can login");
            //     setTimeout(() => {
            //         navigate('/login');
            //     }, 1000);
            // }
            // console.log(result);
        } catch (error) {
            toast.error("somethig went wrong", error)
            return;
        }
        // Mock API call or send data to backend

    };
    return (
        <>
            <div className="login-form">
                <form onSubmit={formSubmit}>
                    <div className="avatar"></div>
                    <h4 className="modal-title">Sign up</h4>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Enter Name.." name='name' value={signupInfo.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Enter Email.." name='email' value={signupInfo.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Enter Password.." name='password' value={signupInfo.password} onChange={handleChange} />
                    </div><div className="form-group">
                        <input type="password" className="form-control" placeholder="Enter Confirm Password.." name='confirm_password' value={signupInfo.confirm_password} onChange={handleChange} />
                    </div>

                    <input type="submit" className="btn btn-primary btn-block btn-lg w-100" value="Sign up" />
                </form>
                <div className="text-center small">Already have an account? <Link to="/login">Login</Link></div>
            </div>
            <div className="tostify_div">
                <ToastContainer />
            </div>
        </>
    )
}

export default Signup