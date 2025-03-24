import axios from "axios"
import { Navigate } from "react-router-dom"

const axiosInstance = axios.create({
  baseURL: `http://localhost:6868/`,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token: ")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    console.log({ error })
    return Promise.reject(error.response.data)
  },
)


export default axiosInstance;