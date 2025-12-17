<template>
  <div>
    <v-alert v-if="error" type="error" class="mb-3">{{ error }}</v-alert>
    <v-data-table :headers="headers" :items="items" :loading="loading" item-key="id" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LogService from '../api/LogService'

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Level', key: 'level', sortable: true },
  { title: 'Info', key: 'info', sortable: true },
  { title: 'Created', key: 'dateCreated', sortable: true },
]

const items = ref([])
const loading = ref(false)
const error = ref('')

function loadData() {
  error.value = ''
  loading.value = true
  LogService.getAll()
      .then((res) => (items.value = res.data || []))
      .catch((e) => (error.value = e?.response?.data?.message || e.message))
      .finally(() => (loading.value = false))
}

onMounted(loadData)
</script>