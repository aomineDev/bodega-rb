<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify/lib/composables/display'

defineProps({
  onAdd: Function,
  color: {
    type: String,
    default: 'primary',
  },
  direction: {
    type: String,
    default: 'up',
  },
})

const { smAndDown } = useDisplay()
const filterDialog = defineModel('filterDialog')
const FormModal = defineModel('FormModal')

const openFilterModal = () => {
  filterDialog.value = true
}

const openFormModal = () => {
  FormModal.value = true
}

const open = ref(false)
</script>

<template>
  <div v-if="smAndDown" class="position-fixed bottom-0 right-0 pa-4">
    <v-speed-dial v-model="open" :location="`bottom center`" :direction="direction">
      <template #activator="{ props: activatorProps }">
        <v-fab v-bind="activatorProps" :color="color" icon elevation="2">
          <v-icon size="large">{{ open ? 'mdi-close' : 'mdi-cog' }}</v-icon>
        </v-fab>
      </template>

      <!-- Acción Filtrar -->
      <v-tooltip location="left" v-if="!(filterDialog == undefined)">
        <template #activator="{ props: tooltipProps }">
          <v-btn v-bind="tooltipProps" color="secondary" icon elevation="2" @click="openFilterModal">
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </template>
        <span>Filtrar</span>
      </v-tooltip>

      <!-- Acción Agregar -->
      <v-tooltip location="left" v-if="!(FormModal == undefined)">
        <template #activator="{ props: tooltipProps }">
          <v-btn v-bind="tooltipProps" color="primary" icon elevation="2" @click="openFormModal">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar</span>
      </v-tooltip>
    </v-speed-dial>
  </div>
</template>
