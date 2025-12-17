import { createRouter, createWebHistory } from 'vue-router'

import AnalysisTable from '@/components/AnalysisTable.vue'
import SampleTable from '@/components/SampleTable.vue'
import BoxTable from '@/components/BoxTable.vue'
import BoxPosTable from '@/components/BoxPosTable.vue'
import LogTable from '@/components/LogTable.vue'

const routes = [
    { path: '/', redirect: '/analysis' },

    { path: '/analysis', name: 'analysis', component: AnalysisTable },
    { path: '/sample', name: 'sample', component: SampleTable },
    { path: '/box', name: 'box', component: BoxTable },
    { path: '/boxpos', name: 'boxpos', component: BoxPosTable },
    { path: '/log', name: 'log', component: LogTable },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router