<template>
  <div>
    <v-btn class="mb-4" color="primary" @click="openCreateDialog">Neue Box</v-btn>

    <v-alert v-if="error" type="error" class="mb-3">{{ error }}</v-alert>

    <v-data-table :headers="headers" :items="items" :loading="loading" item-key="bId">
      <template #item.actions="{ item }">
        <v-btn icon size="small" @click="openEditDialog(item.raw)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon size="small" color="error" @click="deleteItem(item.raw)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="650">
      <v-card>
        <v-card-title>{{ edited.bId ? 'Box bearbeiten' : 'Neue Box' }}</v-card-title>
        <v-card-text>
          <v-alert v-if="dialogError" type="error" class="mb-3">{{ dialogError }}</v-alert>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field label="Box ID (immutable)" v-model="edited.bId" :disabled="!!edited.bId" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Name" v-model="edited.name" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Num Max" v-model.number="edited.numMax" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Type" v-model.number="edited.type" />
            </v-col>
            <v-col cols="12">
              <v-text-field label="Comment" v-model="edited.comment" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeDialog">Abbrechen</v-btn>
          <v-btn color="primary" @click="saveItem">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BoxService from '../api/BoxService'

const headers = [
  { title: 'Box ID', key: 'bId', sortable: true },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Num Max', key: 'numMax', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Comment', key: 'comment', sortable: true },
  { title: 'Aktionen', key: 'actions', sortable: false },
]

const items = ref([])
const loading = ref(false)
const dialog = ref(false)
const edited = ref({})
const error = ref('')
const dialogError = ref('')

function loadData() {
  error.value = ''
  loading.value = true
  BoxService.getAll()
      .then((res) => (items.value = res.data || []))
      .catch((e) => (error.value = e?.response?.data?.message || e.message))
      .finally(() => (loading.value = false))
}

function openCreateDialog() {
  dialogError.value = ''
  edited.value = { bId: '', name: '', numMax: 40, type: 1, comment: '' }
  dialog.value = true
}

function openEditDialog(item) {
  dialogError.value = ''
  edited.value = { ...item }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

function saveItem() {
  dialogError.value = ''
  const data = { ...edited.value }

  if (edited.value.bId) {
    BoxService.update(edited.value.bId, data)
        .then(loadData)
        .catch((e) => (dialogError.value = e?.response?.data?.message || e.message))
        .finally(() => (dialog.value = false))
  } else {
    BoxService.create(data)
        .then(loadData)
        .catch((e) => (dialogError.value = e?.response?.data?.message || e.message))
        .finally(() => (dialog.value = false))
  }
}

function deleteItem(item) {
  if (!confirm(`Box ${item.bId} wirklich löschen?`)) return
  BoxService.delete(item.bId)
      .then(loadData)
      .catch((e) => (error.value = e?.response?.data?.message || e.message))
}

onMounted(loadData)
</script>