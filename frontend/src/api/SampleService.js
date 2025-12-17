import api from './http'

export default {
    getAll() {
        return api.get('/sample')
    },
    get(sId, sStamp) {
        return api.get(`/sample/${encodeURIComponent(sId)}/${encodeURIComponent(sStamp)}`)
    },
    create(data) {
        return api.post('/sample', data)
    },
    update(sId, sStamp, data) {
        return api.put(`/sample/${encodeURIComponent(sId)}/${encodeURIComponent(sStamp)}`, data)
    },
    delete(sId, sStamp) {
        return api.delete(`/sample/${encodeURIComponent(sId)}/${encodeURIComponent(sStamp)}`)
    },
}