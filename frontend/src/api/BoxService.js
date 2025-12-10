// src/api/BoxService.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
})

export default {
    getAll() {
        return api.get('/boxes')
    },
    get(id) {
        return api.get(`/boxes/${id}`)
    },
    create(data) {
        return api.post('/boxes', data)
    },
    update(id, data) {
        return api.put(`/boxes/${id}`, data)
    },
    delete(id) {
        return api.delete(`/boxes/${id}`)
    },
}