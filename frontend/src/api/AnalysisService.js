// src/api/AnalysisService.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8081/api', // wichtig: Port & /api
})

export default {
    getAll() {
        return api.get('/analysis')
    },
    get(id) {
        return api.get(`/analysis/${id}`)
    },
    create(data) {
        return api.post('/analysis', data)
    },
    update(id, data) {
        return api.put(`/analysis/${id}`, data)
    },
    delete(id) {
        return api.delete(`/analysis/${id}`)
    },
}