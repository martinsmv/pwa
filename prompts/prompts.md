ok es funktioniert alles, folgende aufgabestellung baut auf die jetzge auf, mach wieder schritt für schritt anleitung, kein readme sag mir was ich tun soll

Informationssysteme "Vue Datatable"
Einführung
Bei dieser Übung sollen für eine bestehende ReST-Schnittstelle mithilfe eines JS-Frameworks die CRUD Funktionen auf Data-Tables implementiert werden.

Ziele
Das Ziel dieser Übung ist das Bereitstellen einer grundlegenden Datenmanipulation über eine JS-View. Dabei sollen Werkzeuge zum Einsatz kommen, die das leichte Umsetzen und Bereitstellen beschleunigen. Die grafische Oberfläche soll die bestehenden Resourcen sinnvoll nutzen, und für besondere Funktionen (Business Use Cases) erweiterbar sein.

Voraussetzungen
Docker Compose
Kenntnisse über Javascript
Funktionstüchtige ReST Schnittstelle aus "ReST Backend"
Grundlagen über ReST-API
Detailierte Aufgabenstellung
Die funktionstüchtige ReST-API aus dem Backend-Beispiel soll als Quelle für eine CRUD-JS-Implementierung herangezogen werden. Die Datenbank-Implementierung sowie die ReST-API soll ins neue docker-compose.yml übernommen werden. Als Javascript-Implementierung soll eine leicht erweiterbare und wartbare Lösung gewählt werden.

Abgabe
Im Repository soll das README.md die notwendigen Schritte beschreiben. Auch das verwendete docker-compose.yml soll enthalten sein. Bitte alle Binaries und Class-Files in das .gitignore eintragen, sodass keine irrtümliche Abgabe erfolgt (besonders das node-modules Verzeichnis). Die Source-Code Files, sprich die Implementierung soll im Verzeichnis frontend/ abgelegt werden.

Bei der Verwendung von KI-Tools müssen die Prompts im Verzeichnis prompts/ als Markdown-Files exportiert werden. Hier soll darauf geachtet werden, dass die Anfrage als auch die Quellen der Antworten ersichtlich sind.

Help, oh I need somebody
What should I use for a Container?
Um einen Container für die Ausführung einer VueJS-Applikation zu definieren, kann folgendes Service als Beispiel herangezogen werden:


services:
frontend:
image: nginx:stable-alpine
container_name: frontend
restart: always
depends_on:
- backend
volumes:
- './webfrontend:/usr/share/nginx/html'
ports:
- '80:80'
networks:
world:
internal:
ipv4_address: '172.19.2.12'
environment:
TZ: Europe/Vienna
Classroom Repository
Hier finden Sie das Abgabe-Repository zum Entwickeln und Commiten Ihrer Lösung.

Bewertung
Gruppengrösse: 2 Personen

Grundanforderungen überwiegend erfüllt
Datatable für die Tabelle Analysis erstellt
Deployment von Frontend-Implementierung ist lauffähig
Tabellen Sample, Box, BoxPos und Log sind als Axios Klassen vorgesehen
Grundanforderungen zur Gänze erfüllt
OpenAPI Dokumentation ist für alle implementierten Endpunkte generiert
Alle Datenbank-Tabellen sind über die Vue App lesbar erreichbar
Quellen
Vuetify Documentation
Vuetify Basic Data Tables
Vue.js Documentation
Axios Documentation
Vue CLI Documentation
"Vue 3 + Vuetify + Axios" Example
Version 20251021v1

Du:
muss später noch e2e testing machen usw was soll ich noch beim initialisieren des vue projekts ankreuzen
Du:
das ist mein jetziges mainjs:
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

Du:
brauchst du mein dto, damit du das anpssen kannst?
<template>
  <div>
    <v-btn
        class="mb-3"
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
      <template #item.actions="{ item }">
        <v-btn icon size="small" @click="openEditDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" color="error" @click="deleteItem(item)">
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
          <v-btn text @click="closeDialog">Abbrechen</v-btn>
          <v-btn color="primary" @click="saveItem">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AnalysisService from '../api/AnalysisService'

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Sample ID', value: 'sampleId' },
  { title: 'Sample Stamp', value: 'sampleStamp' },
  { title: 'Pol', value: 'pol' },
  { title: 'Nat', value: 'nat' },
  { title: 'Kal', value: 'kal' },
  { title: 'Kommentar', value: 'comment' },
  { title: 'Aktionen', value: 'actions', sortable: false },
]

const items = ref([])
const loading = ref(false)

const dialog = ref(false)
const editedItem = ref({})

function loadData() {
  loading.value = true
  AnalysisService.getAll()
      .then((res) => {
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
        .finally(() => (dialog.value = false))
  } else {
    // Create
    AnalysisService.create(editedItem.value)
        .then(loadData)
        .finally(() => (dialog.value = false))
  }
}

function deleteItem(item) {
  if (!confirm(Analysis #${item.id} wirklich löschen?)) return

  AnalysisService.delete(item.id).then(loadData)
}

onMounted(loadData)
</script>
Du:
also passt analysistable.vue zu dem analysisdto

package org.example.backend;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AnalysisDto {

    private Long id;

    @NotNull
    private String sampleId;

    @NotNull
    private LocalDateTime sampleStamp;

    private BigDecimal pol;
    private BigDecimal nat;
    private BigDecimal kal;
    private BigDecimal anValue;
    private BigDecimal glu;
    private BigDecimal dry;
    private LocalDateTime dateIn;
    private LocalDateTime dateOut;
    private BigDecimal weightMea;
    private BigDecimal weightNrm;
    private BigDecimal weightCur;
    private BigDecimal weightDif;
    private BigDecimal density;
    private String flags;
    private Integer lane;
    private String comment;
    private LocalDateTime dateExported;

    public AnalysisDto() {
    }

    // ----- Getter & Setter -----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSampleId() {
        return sampleId;
    }

    public void setSampleId(String sampleId) {
        this.sampleId = sampleId;
    }

    public LocalDateTime getSampleStamp() {
        return sampleStamp;
    }

    public void setSampleStamp(LocalDateTime sampleStamp) {
        this.sampleStamp = sampleStamp;
    }

    public BigDecimal getPol() {
        return pol;
    }

    public void setPol(BigDecimal pol) {
        this.pol = pol;
    }

    public BigDecimal getNat() {
        return nat;
    }

    public void setNat(BigDecimal nat) {
        this.nat = nat;
    }

    public BigDecimal getKal() {
        return kal;
    }

    public void setKal(BigDecimal kal) {
        this.kal = kal;
    }

    public BigDecimal getAnValue() {
        return anValue;
    }

    public void setAnValue(BigDecimal anValue) {
        this.anValue = anValue;
    }

    public BigDecimal getGlu() {
        return glu;
    }

    public void setGlu(BigDecimal glu) {
        this.glu = glu;
    }

    public BigDecimal getDry() {
        return dry;
    }

    public void setDry(BigDecimal dry) {
        this.dry = dry;
    }

    public LocalDateTime getDateIn() {
        return dateIn;
    }

    public void setDateIn(LocalDateTime dateIn) {
        this.dateIn = dateIn;
    }

    public LocalDateTime getDateOut() {
        return dateOut;
    }

    public void setDateOut(LocalDateTime dateOut) {
        this.dateOut = dateOut;
    }

    public BigDecimal getWeightMea() {
        return weightMea;
    }

    public void setWeightMea(BigDecimal weightMea) {
        this.weightMea = weightMea;
    }

    public BigDecimal getWeightNrm() {
        return weightNrm;
    }

    public void setWeightNrm(BigDecimal weightNrm) {
        this.weightNrm = weightNrm;
    }

    public BigDecimal getWeightCur() {
        return weightCur;
    }

    public void setWeightCur(BigDecimal weightCur) {
        this.weightCur = weightCur;
    }

    public BigDecimal getWeightDif() {
        return weightDif;
    }

    public void setWeightDif(BigDecimal weightDif) {
        this.weightDif = weightDif;
    }

    public BigDecimal getDensity() {
        return density;
    }

    public void setDensity(BigDecimal density) {
        this.density = density;
    }

    public String getFlags() {
        return flags;
    }

    public void setFlags(String flags) {
        this.flags = flags;
    }

    public Integer getLane() {
        return lane;
    }

    public void setLane(Integer lane) {
        this.lane = lane;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getDateExported() {
        return dateExported;
    }

    public void setDateExported(LocalDateTime dateExported) {
        this.dateExported = dateExported;
    }
}

Du:
habe localhost 5173 geöffnet und sehe nur das leere seite mit:
Venlab – Analysis Übersicht
Neue Analysis Neue AnalysisAbbrechenSpeichern

Du:
weclhes tamplate?
Du:
bei dev tools im browser kommt das:
// src/api/AnalysisService.js
import axios from 'axios'

const api = axios.create({
baseURL: 'http://localhost:8081/api', // wichtig: Port & /api
})

export default {
getAll() {
return api.get('/analysis')
},
get(id) {
return api.get(/analysis/${id})
},
create(data) {
return api.post('/analysis', data)
},
update(id, data) {
return api.put(/analysis/${id}, data)
},
delete(id) {
return api.delete(/analysis/${id})
},
}

inn der console
Du:
das steht auch da:
Content Security Policy of your site blocks the use of 'eval' in JavaScript
Du:
http://localhost:8081/api/analysis  liefer daten
Du:
in console steht nur das:
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
  if (!confirm(Analysis #${item.id} wirklich löschen?)) return

  AnalysisService.delete(item.id).then(loadData)
}

onMounted(loadData)
</script>
Du:
package org.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}

Du:
App.vue:13 [Vue warn]: Failed to resolve component: v-container
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ App.vue:13
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
App.vue:13 [Vue warn]: Failed to resolve component: v-main
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ App.vue:13
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
App.vue:13 [Vue warn]: Failed to resolve component: v-app
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ App.vue:13
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-btn
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-icon
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-data-table
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-title
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-text-field
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-col
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-row
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-text
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-spacer
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-actions
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-dialog
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8195
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
mountChildren @ chunk-DGANQRCK.js?v=67a0d388:7804
mountElement @ chunk-DGANQRCK.js?v=67a0d388:7727
processElement @ chunk-DGANQRCK.js?v=67a0d388:7682
patch @ chunk-DGANQRCK.js?v=67a0d388:7548
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8202
run @ chunk-DGANQRCK.js?v=67a0d388:505
setupRenderEffect @ chunk-DGANQRCK.js?v=67a0d388:8330
mountComponent @ chunk-DGANQRCK.js?v=67a0d388:8104
processComponent @ chunk-DGANQRCK.js?v=67a0d388:8056
patch @ chunk-DGANQRCK.js?v=67a0d388:7560
render2 @ chunk-DGANQRCK.js?v=67a0d388:8867
mount @ chunk-DGANQRCK.js?v=67a0d388:6163
app.mount @ chunk-DGANQRCK.js?v=67a0d388:12478
(anonymous) @ main.js:19
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-btn
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-icon
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-data-table
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-title
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-text-field
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-col
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-row
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-text
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-spacer
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-actions
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-dialog
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:134 Analysis data from API: Array(124269)
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-btn
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-icon
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-data-table
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-title
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-text-field
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-col
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-row
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-text
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-spacer
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-actions
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-dialog
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-btn
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-icon
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-data-table
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-title
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-text-field
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-col
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-row
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-text
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-spacer
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card-actions
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-card
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550
AnalysisTable.vue:45 [Vue warn]: Failed to resolve component: v-dialog
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
at <AnalysisTable >
at <App>
warn$1 @ chunk-DGANQRCK.js?v=67a0d388:2195
resolveAsset @ chunk-DGANQRCK.js?v=67a0d388:5111
resolveComponent @ chunk-DGANQRCK.js?v=67a0d388:5073
_sfc_render @ AnalysisTable.vue:45
renderComponentRoot @ chunk-DGANQRCK.js?v=67a0d388:6648
componentUpdateFn @ chunk-DGANQRCK.js?v=67a0d388:8273
run @ chunk-DGANQRCK.js?v=67a0d388:505
runIfDirty @ chunk-DGANQRCK.js?v=67a0d388:543
callWithErrorHandling @ chunk-DGANQRCK.js?v=67a0d388:2342
flushJobs @ chunk-DGANQRCK.js?v=67a0d388:2550


das kommt in console
Du:
hat funktioniert
Du:
Datatable für die Tabelle Analysis erstellt
Deployment von Frontend-Implementierung ist lauffähig
Tabellen Sample, Box, BoxPos und Log sind als Axios Klassen vorgesehen
Du:
ich will nur überweigend erfüllt
Du:
das ist mein compose

services:
db:
image: postgres:16-alpine
container_name: app-postgres
restart: unless-stopped
env_file:
- .env
ports:
- "${POSTGRES_PORT:-5432}:5432"
volumes:
# Persistente Datenbankdaten
- pgdata:/var/lib/postgresql/data
# Backup-Files von Host einbinden (nur lesen)
- ./db-backup:/backup:ro
healthcheck:
test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-appuser} -d ${POSTGRES_DB:-appdb}"]
interval: 10s
timeout: 5s
retries: 5

adminer:
image: adminer:latest
container_name: app-adminer
restart: unless-stopped
ports:
- "8080:8080"
environment:
# Adminer verbindet sich im gleichen Docker-Netz mit 'db'
ADMINER_DEFAULT_SERVER: db
depends_on:
- db

backend:
build:
context: ./backend
dockerfile: Dockerfile
container_name: app-backend
restart: unless-stopped
env_file:
- .env
environment:
SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/${POSTGRES_DB}
SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER}
SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
ports:
- "8081:8080"
depends_on:
db:
condition: service_healthy

volumes:
pgdata:
Du:
passt diese gitignore für frontend backend usw wies in der aufgabe steht:
HELP.md
.gradle
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache
bin/
!**/src/main/**/bin/
!**/src/test/**/bin/

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr
out/
!**/src/main/**/out/
!**/src/test/**/out/

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/

### VS Code ###
.vscode/
