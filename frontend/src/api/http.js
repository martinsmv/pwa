import axios from 'axios'

// Backend läuft bei dir aktuell auf 8081:
const api = axios.create({
    baseURL: 'http://localhost:8081/api',
})

export default api