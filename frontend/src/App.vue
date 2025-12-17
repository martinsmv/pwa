<template>
  <v-app>
    <v-main>
      <v-container class="pa-4">
        <h1 class="text-h5 mb-4">Venlab – Vue CRUD</h1>

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
import AnalysisTable from './components/AnalysisTable.vue'
import SampleTable from './components/SampleTable.vue'
import BoxTable from './components/BoxTable.vue'
import BoxPosTable from './components/BoxPosTable.vue'
import LogTable from './components/LogTable.vue'

const tab = ref('analysis')
</script>