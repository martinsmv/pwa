// src/api/LogService.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
})

export default {
    getAll() {
        return api.get('/logs')
    },
    get(id) {
        return api.get(`/logs/${id}`)
    },
    create(data) {
        return api.post('/logs', data)
    },
    update(id, data) {
        return api.put(`/logs/${id}`)
    },
    delete(id) {
        return api.delete(`/logs/${id}`)
    },
}