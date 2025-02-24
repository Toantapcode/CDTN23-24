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
    const token = localStorage.getItem("token")
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
    console.log({ response })
    return response.data
  },
  function (error) {
    console.log({ error })
    return Promise.reject(error.response.data)
  },
)

// const ProtectedRoute = ({children}) => {
//   const token = localStorage.getItem('token');

//   if (!token) {
//     return <Navigate to path='/login' replace />
//   }
//   return children;
// }

export default axiosInstance;