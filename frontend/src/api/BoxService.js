import api from './http'

export default {
    getAll() {
        return api.get('/box')
    },
    get(bId) {
        return api.get(`/box/${bId}`)
    },
    create(data) {
        return api.post('/box', data)
    },
    update(bId, data) {
        return api.put(`/box/${bId}`, data)
    },
    delete(bId) {
        return api.delete(`/box/${bId}`)
    },
}