import { createRouter, createWebHistory } from 'vue-router'
import AnalysisTable from '@/components/AnalysisTable.vue'
import SampleTable from '@/components/SampleTable.vue'
import BoxTable from '@/components/BoxTable.vue'
import BoxPosTable from '@/components/BoxPosTable.vue'
import LogTable from '@/components/LogTable.vue'
import Login from '@/views/Login.vue'

const routes = [
    { path: '/login', component: Login },
    { path: '/', component: AnalysisTable },
    { path: '/sample', component: SampleTable },
    { path: '/box', component: BoxTable },
    { path: '/boxpos', component: BoxPosTable },
    { path: '/log', component: LogTable },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.path !== '/login' && localStorage.getItem('loggedIn') !== 'true') {
        next('/login')
    } else {
        next()
    }
})

export default router