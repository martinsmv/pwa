<template>
  <div>
    <v-btn class="mb-4" color="primary" @click="openCreateDialog">Neue BoxPos</v-btn>

    <v-alert v-if="error" type="error" class="mb-3">{{ error }}</v-alert>

    <v-data-table :headers="headers" :items="items" :loading="loading" item-key="__key">
      <template #item.actions="{ item }">
        <v-btn icon size="small" @click="openEditDialog(item.raw)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon size="small" color="error" @click="deleteItem(item.raw)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="650">
      <v-card>
        <v-card-title>{{ isEdit ? 'BoxPos bearbeiten' : 'Neue BoxPos' }}</v-card-title>
        <v-card-text>
          <v-alert v-if="dialogError" type="error" class="mb-3">{{ dialogError }}</v-alert>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field label="Box ID (immutable)" v-model="edited.bId" :disabled="isEdit" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="BoxPos ID (immutable)" v-model.number="edited.bposId" :disabled="isEdit" />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field label="Sample ID" v-model="edited.sampleId" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Sample Stamp (ISO, z.B. 2024-07-30T10:00:42Z)"
                  v-model="edited.sampleStamp"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                  label="Date Exported (ISO, optional)"
                  v-model="edited.dateExported"
                  hint="z.B. 2024-07-31T09:19:34.924Z"
                  persistent-hint
              />
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
import { ref, onMounted, computed } from 'vue'
import BoxPosService from '../api/BoxPosService'

const headers = [
  { title: 'Box ID', key: 'bId', sortable: true },
  { title: 'BoxPos ID', key: 'bposId', sortable: true },
  { title: 'Sample ID', key: 'sampleId', sortable: true },
  { title: 'Sample Stamp', key: 'sampleStamp', sortable: true },
  { title: 'Date Exported', key: 'dateExported', sortable: true },
  { title: 'Aktionen', key: 'actions', sortable: false },
]

const items = ref([])
const loading = ref(false)
const dialog = ref(false)
const edited = ref({})
const error = ref('')
const dialogError = ref('')

const isEdit = computed(() => !!edited.value.__isEditKey)

function normalizeRow(row) {
  return { ...row, __key: `${row.bId}|${row.bposId}` }
}

function loadData() {
  error.value = ''
  loading.value = true
  BoxPosService.getAll()
      .then((res) => (items.value = (res.data || []).map(normalizeRow)))
      .catch((e) => (error.value = e?.response?.data?.message || e.message))
      .finally(() => (loading.value = false))
}

function openCreateDialog() {
  dialogError.value = ''
  edited.value = {
    bId: '',
    bposId: null,
    sampleId: '',
    sampleStamp: '',
    dateExported: '',
  }
  dialog.value = true
}

function openEditDialog(item) {
  dialogError.value = ''
  edited.value = { ...item, __isEditKey: true }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

function saveItem() {
  dialogError.value = ''
  const data = { ...edited.value }
  delete data.__key
  delete data.__isEditKey

  if (isEdit.value) {
    BoxPosService.update(edited.value.bId, edited.value.bposId, data)
        .then(loadData)
        .catch((e) => (dialogError.value = e?.response?.data?.message || e.message))
        .finally(() => (dialog.value = false))
  } else {
    BoxPosService.create(data)
        .then(loadData)
        .catch((e) => (dialogError.value = e?.response?.data?.message || e.message))
        .finally(() => (dialog.value = false))
  }
}

function deleteItem(item) {
  if (!confirm(`BoxPos ${item.bId}/${item.bposId} wirklich löschen?`)) return
  BoxPosService.delete(item.bId, item.bposId)
      .then(loadData)
      .catch((e) => (error.value = e?.response?.data?.message || e.message))
}

onMounted(loadData)
</script>