import api from './http'

export default {
    getAll() {
        return api.get('/boxpos')
    },
    get(bId, bposId) {
        return api.get(`/boxpos/${encodeURIComponent(bId)}/${bposId}`)
    },
    create(data) {
        return api.post('/boxpos', data)
    },
    update(bId, bposId, data) {
        return api.put(`/boxpos/${encodeURIComponent(bId)}/${bposId}`, data)
    },
    delete(bId, bposId) {
        return api.delete(`/boxpos/${encodeURIComponent(bId)}/${bposId}`)
    },
}