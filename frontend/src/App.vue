<template>
  <v-app>
    <v-main>
      <v-container class="pa-4">
        <div class="d-flex align-center mb-4">
          <h1 class="text-h5">Venlab – Vue CRUD</h1>
          <v-spacer />

          <v-switch
              v-model="isDark"
              inset
              hide-details
              label="Dark"
              @update:modelValue="toggleTheme"
          />
        </div>

        <v-tabs v-model="tab" class="mb-4">
          <v-tab value="analysis">Analysis</v-tab>
          <v-tab value="sample">Sample</v-tab>
          <v-tab value="box">Box</v-tab>
          <v-tab value="boxpos">BoxPos</v-tab>
          <v-tab value="log">Log</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="analysis"><AnalysisTable /></v-window-item>
          <v-window-item value="sample"><SampleTable /></v-window-item>
          <v-window-item value="box"><BoxTable /></v-window-item>
          <v-window-item value="boxpos"><BoxPosTable /></v-window-item>
          <v-window-item value="log"><LogTable /></v-window-item>
        </v-window>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'

import AnalysisTable from './components/AnalysisTable.vue'
import SampleTable from './components/SampleTable.vue'
import BoxTable from './components/BoxTable.vue'
import BoxPosTable from './components/BoxPosTable.vue'
import LogTable from './components/LogTable.vue'

const tab = ref('analysis')

const theme = useTheme()

// ✅ gespeichertes Theme laden (optional, aber praktisch)
const saved = localStorage.getItem('theme') // 'dark' | 'light' | null
if (saved === 'dark' || saved === 'light') {
  theme.global.name.value = saved
}

const isDark = ref(theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', theme.global.name.value)
}
</script>