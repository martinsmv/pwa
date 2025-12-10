<template>
  <div class="pa-4">
    <h1 class="text-h5 mb-4">Venlab – Analysis Übersicht</h1>

    <v-btn
        class="mb-4"
        color="primary"
        @click="openCreateDialog"
    >
      Neue Analysis
    </v-btn>

    <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        item-key="id"
        class="elevation-1"
    >
      <!-- Aktionen-Spalte -->
      <template #item.actions="{ item }">
        <!-- in Vuetify 3 liegt das rohe Objekt in item.raw -->
        <v-btn
            icon
            size="small"
            @click="openEditDialog(item.raw)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
            icon
            size="small"
            color="error"
            @click="deleteItem(item.raw)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Dialog für Create/Update -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h6">
            {{ editedItem.id ? 'Analysis bearbeiten' : 'Neue Analysis' }}
          </span>
        </v-card-title>

        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Sample ID"
                  v-model="editedItem.sampleId"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Sample Stamp"
                  v-model="editedItem.sampleStamp"
                  hint="ISO-Format: 2024-01-01T12:34:56"
                  persistent-hint
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                  label="Pol"
                  type="number"
                  v-model.number="editedItem.pol"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                  label="Nat"
                  type="number"
                  v-model.number="editedItem.nat"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                  label="Kal"
                  type="number"
                  v-model.number="editedItem.kal"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                  label="Kommentar"
                  v-model="editedItem.comment"
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
import { ref, onMounted } from 'vue'
import AnalysisService from '../api/AnalysisService'

// Vuetify 3: headers benutzen "key" statt "value"
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Sample ID', key: 'sampleId' },
  { title: 'Sample Stamp', key: 'sampleStamp' },
  { title: 'Pol', key: 'pol' },
  { title: 'Nat', key: 'nat' },
  { title: 'Kal', key: 'kal' },
  { title: 'Kommentar', key: 'comment' },
  { title: 'Aktionen', key: 'actions', sortable: false },
]

const items = ref([])
const loading = ref(false)

const dialog = ref(false)
const editedItem = ref({})

function loadData() {
  loading.value = true
  AnalysisService.getAll()
      .then((res) => {
        console.log('Analysis data from API:', res.data) // DEBUG
        // falls dein Backend eine Page zurückliefert:
        // items.value = res.data.content || res.data
        items.value = res.data
      })
      .catch((err) => {
        console.error('Fehler beim Laden:', err)
      })
      .finally(() => {
        loading.value = false
      })
}

function openCreateDialog() {
  editedItem.value = {}
  dialog.value = true
}

function openEditDialog(item) {
  editedItem.value = { ...item }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

function saveItem() {
  if (editedItem.value.id) {
    // Update
    AnalysisService.update(editedItem.value.id, editedItem.value)
        .then(loadData)
        .finally(() => {
          dialog.value = false
        })
  } else {
    // Create
    AnalysisService.create(editedItem.value)
        .then(loadData)
        .finally(() => {
          dialog.value = false
        })
  }
}

function deleteItem(item) {
  if (!confirm(`Analysis #${item.id} wirklich löschen?`)) return

  AnalysisService.delete(item.id).then(loadData)
}

onMounted(loadData)
</script>