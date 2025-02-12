"use client"
import React, { useEffect, createContext, useState, useRef, use } from 'react'
import axios from 'axios';
import Navbar from './Navbar';

export const BackendContext = createContext();

// Add axios interceptor setup
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await axios.post('/api/users/refresh-token', {}, {
                    withCredentials: true
                });

                if (response.data.success) {
                    // Retry the original request
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                // If refresh token is also expired, logout the user
                setIsLoggedIn(false);
                setUserData(null);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


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


    const checkAuth = async () => {
        try {
            // First try to get current user with existing access token
            const { data } = await axios.get('/api/users/current-user', {
                withCredentials: true
            });
            
            if (data.success) {
                setIsLoggedIn(true);
                setUserData(data.data);
                return;
            }
            
            // If that fails with 401, try to refresh the token
            const refreshResponse = await axios.post('/api/users/refresh-token', {}, {
                withCredentials: true
            });
            
            if (refreshResponse.data.success) {
                // Try getting user data again with new token
                const newUserResponse = await axios.get('/api/users/current-user', {
                    withCredentials: true
                });
                
                if (newUserResponse.data.success) {
                    setIsLoggedIn(true);
                    setUserData(newUserResponse.data.data);
                    return;
                }
            }
            
            // If all attempts fail, ensure user is logged out
            setIsLoggedIn(false);
            setUserData(null);
            
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsLoggedIn(false);
            setUserData(null);
        }
    };
    
    // Use it in useEffect with proper cleanup
    useEffect(() => {
        let mounted = true;
    
        const performAuthCheck = async () => {
            if (!mounted) return;
            await checkAuth();
        };
    
        performAuthCheck();
    
        // Optional: Set up periodic token refresh
        const refreshInterval = setInterval(performAuthCheck, 1000 * 60 * 60); // Check every hour
    
        return () => {
            mounted = false;
            clearInterval(refreshInterval);
        };
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
                setUserData(null);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Logout failed:', error);
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

    // change UI on mobile
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

    return (
        <BackendContext.Provider value={{ isLoggedIn, userData, logoutHandle, searchValue, formSubmit, handleSearchChange, isLogging, isRegistering, setIsLogging, setIsRegistering, loginFormData, setLoginFormData, handleLoginSubmit, handleLoginChange, handleSignupChange, handleSignupSubmit, signupFormData, isLoading, message, onLoginClick, onSignupClick, homeLoading, homeMessage, isMobile, isSearching, setIsSearching, homeFeed }}>
            <Navbar />
            {children}
        </BackendContext.Provider>
    );
}