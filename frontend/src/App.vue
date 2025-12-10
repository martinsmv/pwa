<template>
  <v-app>
    <v-main>
      <v-container class="pa-4">
        <h1 class="mb-4">Venlab – Analysis Übersicht</h1>
        <AnalysisTable />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import AnalysisTable from './components/AnalysisTable.vue'
</script>