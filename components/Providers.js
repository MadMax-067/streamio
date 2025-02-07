"use client"
import React, { useEffect, createContext, useState, useRef, use } from 'react'
import axios from 'axios';
import Navbar from './Navbar';

export const BackendContext = createContext();

export default function Providers({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [searchResult, setSearchResults] = useState();
    const [homeFeed, setHomeFeed] = useState();
    const [searchValue, setSearchValue] = useState("");
    const [isLogging, setIsLogging] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [homeMessage, setHomeMessage] = useState("");
    const [homeLoading, setHomeLoading] = useState(false);
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
        try {
            const response = await axios.post(`/api/users/login`, {
                username: loginFormData.username,
                email: loginFormData.email,
                password: loginFormData.password
            }, {
                withCredentials: true
            });
            if (response.data.success) {
                setMessage(response.data.message);
                setUserData(response?.data?.data?.user);
                setIsLogging(false);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                setMessage(response.data.message);
            }
            setLoginFormData({
                email: '',
                username: '',
                password: ''
            });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed. Please try again.');
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
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

        try {
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
                setMessage("User registered successfully, verify your email to continue.");
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Signup failed. Please try again.');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
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
            setHomeLoading(true);
            try {
                if (isLoggedIn) {
                    const response = await axios.get(`/api/dashboard`);
                    setHomeFeed(response.data.data.videos);
                }
            } catch (error) {
                setHomeMessage(error.response?.data?.message || '😥Unable to fetch videos.')
            } finally {
                setHomeLoading(false);
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

    const onLoginClick = () => {
        setMessage("");
        setIsRegistering(false);
        setIsLogging(true);
    };
    const onSignupClick = () => {
        setMessage("");
        setIsLogging(false);
        setIsRegistering(true);
    };

    // change the data-skill-counton mobile
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check window only on client side
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize(); // Initial check
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const onVideoClick = (vidId) => {
        // setIsLoading(true);
        // try {
        //     const { data } = await axios.post(`/api/users/login`, {
        //         username: loginFormData.username,
        //         email: loginFormData.email,
        //         password: loginFormData.password
        //     }, {
        //         withCredentials: true
        //     });
        //     if (response.data.success) {
        //         setMessage(response.data.message);
        //         setUserData(response?.data?.data?.user);
        //         setIsLogging(false);
        //         setIsLoggedIn(true);
        //     } else {
        //         setIsLoggedIn(false);
        //         setMessage(response.data.message);
        //     }
        //     setLoginFormData({
        //         email: '',
        //         username: '',
        //         password: ''
        //     });
        // } catch (error) {
        //     setMessage(error.response?.data?.message || 'Login failed. Please try again.');
        //     setIsLoggedIn(false);
        // } finally {
        //     setIsLoading(false);
        // }
        // setIsLoading(false);
    };

    return (
        <BackendContext.Provider value={{ isLoggedIn, userData, logoutHandle, searchValue, formSubmit, handleSearchChange, isLogging, isRegistering, setIsLogging, setIsRegistering, loginFormData, setLoginFormData, handleLoginSubmit, handleLoginChange, handleSignupChange, handleSignupSubmit, signupFormData, isLoading, message, onLoginClick, onSignupClick, homeLoading, homeMessage, isMobile, isSearching, setIsSearching, homeFeed, onVideoClick }}>
            <Navbar />
            {children}
        </BackendContext.Provider>
    );
}