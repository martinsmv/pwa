import api from './http'

export default {
    getAll() {
        return api.get('/log')
    },
    get(id) {
        return api.get(`/log/${id}`)
    },
}