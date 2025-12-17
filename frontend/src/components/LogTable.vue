<template>
  <div>
    <v-data-table :headers="headers" :items="items" :loading="loading" item-key="id" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LogService from '../api/LogService'

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Message', key: 'message', sortable: true },
  { title: 'Created', key: 'created', sortable: true },
]

const items = ref([])
const loading = ref(false)

function loadData() {
  loading.value = true
  LogService.getAll()
      .then((res) => (items.value = res.data || []))
      .finally(() => (loading.value = false))
}

onMounted(loadData)
</script>