import React, { useContext } from 'react'
import { BackendContext } from './Main'

const SignUp = () => {
    const backendData = useContext(BackendContext);

    return (
        <div className="form-container">
            <p className="title">Sign up</p>
            <form onSubmit={backendData.handleSignupSubmit} className="form">
                <div className="input-group">
                    <label htmlFor="fullName">Full name</label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={backendData.signupFormData.fullName}
                        onChange={backendData.handleSignupChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        value={backendData.signupFormData.email}
                        onChange={backendData.handleSignupChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={backendData.signupFormData.username}
                        onChange={backendData.handleSignupChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={backendData.signupFormData.password}
                        onChange={backendData.handleSignupChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="avatar">Profile Picture</label>
                    <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        onChange={backendData.handleSignupChange}
                    />
                </div>
                <button type="submit" className="sign bg-primary text-secondary mt-4" disabled={backendData.isLoading} >
                    {backendData.isLoading ? 'Signing up...' : 'Sign up'}
                </button>
            </form>
            {backendData.message && <div className="message">{backendData.message}</div>}
            <p className="signup mt-3">Already have an account?
                <a className='cursor-pointer' onClick={backendData.onLoginClick} >Login</a>
            </p>
        </div>
    )
}

export default SignUp
