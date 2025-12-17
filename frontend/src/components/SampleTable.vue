<template>
  <div>
    <v-btn class="mb-4" color="primary" @click="openCreateDialog">Neuer Sample</v-btn>

    <v-alert v-if="error" type="error" class="mb-3">{{ error }}</v-alert>

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
          <v-alert v-if="dialogError" type="error" class="mb-3">{{ dialogError }}</v-alert>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field label="Sample ID (immutable)" v-model="edited.sid" :disabled="isEdit" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Sample Stamp (immutable, ISO Z)"
                  v-model="edited.sstamp"
                  :disabled="isEdit"
                  hint="z.B. 2023-07-27T12:37:06Z"
                  persistent-hint
              />
            </v-col>

            <v-col cols="12">
              <v-text-field label="Comment" v-model="edited.comment" />
            </v-col>
            <v-col cols="12">
              <v-text-field label="Flags" v-model="edited.sFlags" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Lane" v-model.number="edited.lane" />
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
  { title: 'Sample ID', key: 'sid', sortable: true },
  { title: 'Sample Stamp', key: 'sstamp', sortable: true },
  { title: 'Comment', key: 'comment', sortable: true },
  { title: 'Flags', key: 'sFlags', sortable: true },
  { title: 'Lane', key: 'lane', sortable: true },
  { title: 'Aktionen', key: 'actions', sortable: false },
]

const items = ref([])
const loading = ref(false)
const dialog = ref(false)
const edited = ref({})
const error = ref('')
const dialogError = ref('')

const isEdit = computed(() => !!edited.value.__isEditKey)

function normalizeRow(apiRow) {
  const sid = apiRow?.id?.sid ?? ''
  const sstamp = apiRow?.id?.sstamp ?? ''
  return {
    // flatten id
    sid,
    sstamp,

    // fields
    comment: apiRow.comment ?? null,
    sFlags: apiRow.sflags ?? apiRow.sFlags ?? null, // falls API "sflags" liefert
    lane: apiRow.lane ?? null,

    // keep original if you want
    __raw: apiRow,

    __key: `${sid}|${sstamp}`,
  }
}

function toApiPayload(uiRow) {
  // Backend erwartet Sample mit EmbeddedId
  return {
    id: {
      sid: uiRow.sid,
      sstamp: uiRow.sstamp,
    },
    comment: uiRow.comment ?? null,
    sFlags: uiRow.sFlags ?? null,
    lane: uiRow.lane ?? null,
  }
}

function loadData() {
  error.value = ''
  loading.value = true
  SampleService.getAll()
      .then((res) => (items.value = (res.data || []).map(normalizeRow)))
      .catch((e) => (error.value = e?.response?.data?.message || e.message))
      .finally(() => (loading.value = false))
}

function openCreateDialog() {
  dialogError.value = ''
  edited.value = { sid: '', sstamp: '', comment: '', sFlags: '-----', lane: 0 }
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
  const payload = toApiPayload(edited.value)

  if (isEdit.value) {
    SampleService.update(edited.value.sid, edited.value.sstamp, payload)
        .then(loadData)
        .catch((e) => (dialogError.value = e?.response?.data?.message || e.message))
        .finally(() => (dialog.value = false))
  } else {
    SampleService.create(payload)
        .then(loadData)
        .catch((e) => (dialogError.value = e?.response?.data?.message || e.message))
        .finally(() => (dialog.value = false))
  }
}

function deleteItem(item) {
  if (!confirm(`Sample ${item.sid} @ ${item.sstamp} wirklich löschen?`)) return
  SampleService.delete(item.sid, item.sstamp)
      .then(loadData)
      .catch((e) => (error.value = e?.response?.data?.message || e.message))
}

onMounted(loadData)
</script>