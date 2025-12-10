// src/api/BoxPosService.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
})

export default {
    getAll() {
        return api.get('/boxpos')
    },
    get(id) {
        return api.get(`/boxpos/${id}`)
    },
    create(data) {
        return api.post('/boxpos', data)
    },
    update(id, data) {
        return api.put(`/boxpos/${id}`, data)
    },
    delete(id) {
        return api.delete(`/boxpos/${id}`)
    },
}