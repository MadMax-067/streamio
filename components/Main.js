"use client"
import React, { useEffect, createContext, useState, useRef } from 'react'
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Hero from './Hero';
import SignUp from './SignUp';
import Login from './Login';
import { motion, AnimatePresence } from "motion/react"



export const BackendContext = createContext();

const Main = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [searchResult, setSearchResults] = useState();
    const [homeFeed, setHomeFeed] = useState();
    const [searchValue, setSearchValue] = useState("");
    const [isLogging, setIsLogging] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const loginRef = useRef(null);
    const signUpRef = useRef(null);
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        username: '',
        password: ''
    });
    const [signupFormData, setSignupFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        avatar: null
    });


    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await axios.get('/api/users/current-user', { withCredentials: true });
            if (data.success) {
                setIsLoggedIn(true);
                setUserData(data.data);
            } else {
                console.log(data.message);
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, [isLoggedIn]);

    const handleClickOutside = (event) => {
        if (loginRef.current && loginRef.current.contains(event.target)) return;
        if (signUpRef.current && signUpRef.current.contains(event.target)) return;
        setIsLogging(false);
        setIsRegistering(false);
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLoginChange = (e) => {
        setLoginFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await axios.post(`/api/users/login`, {
            username: loginFormData.username,
            email: loginFormData.email,
            password: loginFormData.password
        }, {
            withCredentials: true
        });
        if (response.data.success) {
            setMessage(response.data.message);
            setIsLogging(false)
            setIsLoggedIn(true);
        }else{
            setMessage(response.data.message);
        }
        setLoginFormData({
            email: '',
            username: '',
            password: ''
        });
        setIsLoading(false);
    };

    const handleSignupChange = (e) => {
        const { name, value, files } = e.target;
        setSignupFormData(prevData => ({
            ...prevData,
            [name]: files ? files[0] : value
        }));
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const submissionData = new FormData();
        submissionData.append('fullName', signupFormData.fullName);
        submissionData.append('email', signupFormData.email);
        submissionData.append('username', signupFormData.username);
        submissionData.append('password', signupFormData.password);
        submissionData.append('avatar', signupFormData.avatar);

        const { data } = await axios.post('/api/users/register', submissionData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        setSignupFormData({
            fullName: '',
            email: '',
            username: '',
            password: '',
            avatar: null
        });
        if (data.success) {
            setMessage(data.message);
            console.log('Signup response:', data);
        } else {
            setMessage(data.message);
        }
        setIsLoading(false);
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const formSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.get(`/api/global-search?search=${searchValue}`);
        setSearchResults(response.data.data.results);
    };

    useEffect(() => {
        (async () => {
            if (isLoggedIn) {
                const response = await axios.get(`/api/dashboard`);
                setHomeFeed(response.data.data.videos);
            }
        })()
    }, [isLoggedIn])



    const logoutHandle = async () => {
        try {
            const { data } = await axios.post(`/api/users/logout`, {}, {
                withCredentials: true
            });
            if (data.success) {
                setIsLoggedIn(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <BackendContext.Provider value={{ isLoggedIn, userData, logoutHandle, searchValue, formSubmit, handleSearchChange, setIsLogging, setIsRegistering, loginFormData, setLoginFormData, handleLoginSubmit, handleLoginChange, handleSignupChange, handleSignupSubmit, signupFormData, isLoading, message }}>
            <main className='grid'>
                <Navbar />
                <AnimatePresence>
                    {isLogging && (
                        <motion.div ref={loginRef}
                            key="loginModal"
                            exit={{ opacity: 0 }}
                            className='fixedBox'
                        >
                            <Login />
                        </motion.div>
                    )}
                    {isRegistering && (
                        <motion.div ref={signUpRef}
                            key="signUpModal"
                            exit={{ opacity: 0 }}
                            className='fixedBox'
                        >
                            <SignUp />
                        </motion.div>
                    )}
                </AnimatePresence>
                <Sidebar />
                <Hero homeFeed={homeFeed} />
            </main>
        </BackendContext.Provider>
    )
}

export default Main;
