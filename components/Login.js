import React, { useContext } from 'react'
import { BackendContext } from './Main';

const Login = () => {
    const backendData = useContext(BackendContext);

    return (
        <div className="form-container">
            <p className="title">Login</p>
            <form onSubmit={backendData.handleLoginSubmit} className="form">
                <div className="input-group">
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder=""
                        value={backendData.loginFormData.email}
                        onChange={backendData.handleLoginChange}
                    />
                </div>
                <div className='mx-auto w-fit mt-3' >Or</div>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder=""
                        value={backendData.loginFormData.username}
                        onChange={backendData.handleLoginChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder=""
                        value={backendData.loginFormData.password}
                        onChange={backendData.handleLoginChange}
                    />
                </div>
                <button className="sign bg-primary text-secondary mt-4">Login</button>
            </form>
            <p className="signup mt-3">Don't have an account?
                <a rel="noopener noreferrer" href="#" className>Sign up</a>
            </p>
        </div>
    )
}

export default Login
