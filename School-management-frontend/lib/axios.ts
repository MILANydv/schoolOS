import axios from "axios"

const instance = axios.create({
  baseURL: "/api", // Assuming your API routes are under /api
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    // You might get the token from a Zustand store or localStorage
    // const token = useAuthStore.getState().token;
    const token = localStorage.getItem("auth-storage")
      ? JSON.parse(localStorage.getItem("auth-storage")!).state.token
      : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error:", error.response.data)
      console.error("Status:", error.response.status)
      console.error("Headers:", error.response.headers)
      // You might want to show a toast notification here
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request Error:", error.message)
    }
    return Promise.reject(error)
  },
)

export default instance
