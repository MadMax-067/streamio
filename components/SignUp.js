import React from 'react'

const SignUp = () => {
    return (
        <div className="form-container">
            <p className="title">Sign up</p>
            <form className="form">
                <div className="input-group">
                    <label htmlFor="fullName">Full name</label>
                    <input type="text" name="fullName" id="fullName" placeholder />
                </div>
                <div className="input-group">
                    <label htmlFor="email">E-Mail</label>
                    <input type="text" name="email" id="email" placeholder />
                </div>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" placeholder />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder />
                </div>
                <div className="input-group">
                    <label htmlFor="avatar">Avatar</label>
                    <input type="file" name="avatar" id="avatar" placeholder />
                </div>
                <button className="sign bg-primary text-secondary mt-4">Sign up</button>
            </form>
            <p className="signup mt-3">Already have an account?
                <a rel="noopener noreferrer" href="#" className>Login</a>
            </p>
        </div>
    )
}

export default SignUp
