import api from './http'
const resource = '/samples'

export default {
    getAll() {
        return api.get(resource)
    },
    // weitere Methoden später
}