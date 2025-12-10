// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 🔹 Vuetify importieren
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Icons (für <v-icon mdi-...>)
import '@mdi/font/css/materialdesignicons.css'

// Vuetify-Instanz
const vuetify = createVuetify({
    components,
    directives,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify) // ⬅️ GANZ WICHTIG

app.mount('#app')