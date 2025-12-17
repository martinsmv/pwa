<template>
  <div>
    <v-btn class="mb-4" color="primary" @click="openCreateDialog">Neuer Sample</v-btn>

    <v-data-table :headers="headers" :items="items" :loading="loading" item-key="__key">
      <template #item.actions="{ item }">
        <v-btn icon size="small" @click="openEditDialog(item.raw)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon size="small" color="error" @click="deleteItem(item.raw)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="650">
      <v-card>
        <v-card-title>{{ isEdit ? 'Sample bearbeiten' : 'Neuer Sample' }}</v-card-title>
        <v-card-text>
          <v-alert v-if="error" type="error" class="mb-3">{{ error }}</v-alert>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field label="Sample ID (immutable)" v-model="edited.sampleId" :disabled="isEdit" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Sample Stamp (immutable)"
                  v-model="edited.sampleStamp"
                  :disabled="isEdit"
                  hint="ISO: 2024-01-01T12:34:56"
                  persistent-hint
              />
            </v-col>

            <v-col cols="12">
              <v-text-field label="Comment" v-model="edited.comment" />
            </v-col>
            <v-col cols="12">
              <v-text-field label="Flags" v-model="edited.flags" />
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
import SampleService from '../api/SampleService'

const headers = [
  { title: 'Sample ID', key: 'sampleId', sortable: true },
  { title: 'Sample Stamp', key: 'sampleStamp', sortable: true },
  { title: 'Comment', key: 'comment', sortable: true },
  { title: 'Flags', key: 'flags', sortable: true },
  { title: 'Aktionen', key: 'actions', sortable: false },
]

const items = ref([])
const loading = ref(false)

const dialog = ref(false)
const edited = ref({})
const error = ref('')

const isEdit = computed(() => !!edited.value.__isEditKey)

function normalizeRow(row) {
  // Table braucht stabilen key
  return { ...row, __key: `${row.sampleId}|${row.sampleStamp}` }
}

function loadData() {
  loading.value = true
  SampleService.getAll()
      .then((res) => {
        items.value = (res.data || []).map(normalizeRow)
      })
      .catch((e) => (error.value = e?.response?.data?.message || e.message))
      .finally(() => (loading.value = false))
}

function openCreateDialog() {
  error.value = ''
  edited.value = { sampleId: '', sampleStamp: '', comment: '', flags: '' }
  dialog.value = true
}

function openEditDialog(item) {
  error.value = ''
  edited.value = { ...item, __isEditKey: true }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

function saveItem() {
  error.value = ''
  const data = { ...edited.value }
  delete data.__key
  delete data.__isEditKey

  if (isEdit.value) {
    SampleService.update(edited.value.sampleId, edited.value.sampleStamp, data)
        .then(loadData)
        .catch((e) => (error.value = e?.response?.data?.message || e.message))
        .finally(() => (dialog.value = false))
  } else {
    SampleService.create(data)
        .then(loadData)
        .catch((e) => (error.value = e?.response?.data?.message || e.message))
        .finally(() => (dialog.value = false))
  }
}

function deleteItem(item) {
  if (!confirm(`Sample ${item.sampleId} @ ${item.sampleStamp} wirklich löschen?`)) return
  SampleService.delete(item.sampleId, item.sampleStamp).then(loadData)
}

onMounted(loadData)
</script>