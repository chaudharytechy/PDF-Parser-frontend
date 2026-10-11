import axios from 'axios'

// Base API instance. Reads the backend URL from .env (VITE_API_URL).
// Auth is cookie-based (httpOnly "pdfmindtoken" cookie set by the server),
// so every request must be sent with credentials — no Authorization header.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
  },
})

// If a request comes back 401, the session cookie is missing/expired.
// Clear any cached user info and bounce to sign-in (unless we're already there
// or this *is* the verify call, which handles its own 401 quietly).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isVerifyCall = error?.config?.url?.includes('/user/verify')
    if (error?.response?.status === 401 && !isVerifyCall) {
      localStorage.removeItem('pdfparser_user')
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin'
      }
    }
    return Promise.reject(error)
  }
)

export default api
