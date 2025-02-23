"use client"
import { useEffect, createContext, useState, useRef } from 'react'
import axios from 'axios';
import { debounce } from 'lodash'; // Add this import
import Navbar from './Navbar';
import { useRouter } from 'next/navigation';

export const BackendContext = createContext();

// Add a token management system
const tokenManager = {
    isRefreshing: false,
    refreshSubscribers: [],
    
    subscribeToRefresh(callback) {
        this.refreshSubscribers.push(callback);
    },
    
    onRefreshed(token) {
        this.refreshSubscribers.forEach(callback => callback(token));
        this.refreshSubscribers = [];
    }
};

// Update the axios interceptor
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (tokenManager.isRefreshing) {
                return new Promise(resolve => {
                    tokenManager.subscribeToRefresh(() => {
                        resolve(axios(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            tokenManager.isRefreshing = true;

            try {
                const response = await axios.post('/api/users/refresh-token', {}, {
                    withCredentials: true
                });

                if (response.data.success) {
                    tokenManager.onRefreshed();
                    tokenManager.isRefreshing = false;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                tokenManager.isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const AUTH_STORAGE_KEY = 'streamio_auth_state'

const authUtils = {
  getStoredAuth() {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY))
    } catch {
      return null
    }
  },

  setStoredAuth(data) {
    if (typeof window === 'undefined') return
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    }))
    this.setAxiosDefaults(data.accessToken)
  },

  clearStoredAuth() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(AUTH_STORAGE_KEY)
    delete axios.defaults.headers.common['Authorization']
  },

  setAxiosDefaults(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

export default function Providers({ children }) {
  // Remove old login states and handlers
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
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
  const router = useRouter();

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      const storedAuth = authUtils.getStoredAuth()
      
      if (storedAuth?.accessToken) {
        // Set axios defaults and state immediately
        authUtils.setAxiosDefaults(storedAuth.accessToken)
        setIsLoggedIn(true)
        setUserData(storedAuth.user)

        // Verify token in background
        try {
          const { data } = await axios.get('/api/users/current-user')
          if (!data.success) {
            handleLogout()
          }
        } catch (error) {
          handleLogout()
        }
      }
      
      setIsAuthChecking(false)
    }

    initAuth()
  }, [])

  // Update logoutHandle
  const logoutHandle = async () => {
    try {
      await axios.post('/api/users/logout', {}, {
        withCredentials: true
      })
    } finally {
      authUtils.clearStoredAuth()
      router.push('/welcome')
      setIsLoggedIn(false)
      setUserData(null)
    }
  }

  // Add token refresh interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          const storedAuth = authUtils.getStoredAuth()

          try {
            const { data } = await axios.post('/api/users/refresh-token', {
              refreshToken: storedAuth?.refreshToken
            })

            if (data.success) {
              authUtils.setStoredAuth(data.data)
              originalRequest.headers['Authorization'] = `Bearer ${data.data.accessToken}`
              return axios(originalRequest)
            }
          } catch (refreshError) {
            handleLogout()
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      }
    )

    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  // Keep mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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
 } finally {
            setHomeLoading(false);
        }
    })()
}, [isLoggedIn])

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

return (
    <BackendContext.Provider value={{
      isLoggedIn,
      userData,
      isAuthChecking,
      logoutHandle,
      isMobile,
      searchValue, 
      formSubmit, 
      handleSearchChange, 
      setIsLoggedIn, 
      setUserData, 
      setMessage, 
      isLogging, 
      isRegistering, 
      setIsLogging, 
      setIsRegistering, 
      loginFormData, 
      setLoginFormData, 
      handleLoginSubmit, 
      handleLoginChange, 
      handleSignupChange, 
      handleSignupSubmit, 
      signupFormData, 
      isLoading, 
      message, 
      onLoginClick, 
      onSignupClick, 
      homeLoading, 
      homeMessage, 
      isSearching, 
      setIsSearching, 
      homeFeed, 
      setIsLoading,
      authUtils
    }}>
      {children}
    </BackendContext.Provider>
  )
}