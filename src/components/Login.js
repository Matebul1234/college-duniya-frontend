import React, { useState } from 'react'
import '../assets/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const signupdata = { ...loginInfo };
        signupdata[name] = value;
        setLoginInfo(signupdata);
        console.log(name, value)
    }
    console.log("loginInfo", loginInfo)

    const formSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh
        const { email, password } = loginInfo;

        if (!email || !password) {
            toast.error("Email and Password  are required !");
            return;
        }

        try {
            const url = 'http://localhost:8080/auth/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            })
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                toast.success(success);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => { navigate('/notes') }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                toast.error(details)
            } else if (!success) {
                toast.error(message)
            }


        } catch (error) {
            toast.error("somethig went wrong", error)
            return;
        }

    };
    return (
        <>
            <div className="login-form">
                <form onSubmit={formSubmit}>
                    <div className="avatar"></div>
                    <h4 className="modal-title">Login</h4>
                    <div className="form-group">
                        <label htmlFor="name">Email</label>
                        <input type="text" className="form-control" placeholder="Enter Email.." name='email' value={loginInfo.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Enter Password.." name='password' value={loginInfo.password} onChange={handleChange} />
                    </div>

                    <input type="submit" className="btn btn-primary btn-block btn-lg w-100" value="Login" />
                </form>
                <div className="text-center small">Don't have an account? <Link to="/signup">Login</Link></div>
            </div>
            <div className="tostify_div">
                <ToastContainer />
            </div>
        </>
    )
}

export default Login