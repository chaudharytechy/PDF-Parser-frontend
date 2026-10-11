import api from './api.js'

// Matches userRoute.js exactly:
//   POST /user/register
//   POST /user/login
//   GET  /user/verify   (protected — confirms the pdfmindtoken cookie is valid)
// There is no logout endpoint in the backend (the cookie is httpOnly, so the
// client can't clear it directly). signOut() below is a best-effort client-side
// reset — see the note in AuthContext.
const authService = {
  async register(payload) {
    const { data } = await api.post('/user/register', payload)
    return data
  },

  async login(payload) {
    const { data } = await api.post('/user/login', payload)
    return data
  },

  async verify() {
    const { data } = await api.get('/user/verify')
    return data
  },
}

export default authService
