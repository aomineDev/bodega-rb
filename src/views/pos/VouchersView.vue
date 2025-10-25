<script setup>

import ActionMenu from '@/components/ActionMenu.vue';
import FabMenu from '@/components/FabMenu.vue';
import BaseFilter from '@/components/BaseFilter.vue';
import { computed, reactive, ref } from 'vue';
import { useDisplay } from 'vuetify'

/* --------------- Relleno Tabla ---------------*/
const headers = computed(() => {
  if (filtros.tipoComprobante === 'Boletas') {
    return [
      { title: 'N°', key: 'comprobanteId' },
      { title: 'Fecha', key: 'fecha' },
      { title: 'Hora', key: 'hora' },
      { title: 'Cliente', key: 'clienteNatural.nombre' },
      { title: 'Cajero', key: 'cajero.nombre' },
      { title: 'Total (S/)', key: 'precioTotal' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ]
  } else {
    return [
      { title: 'N°', key: 'comprobanteId' },
      { title: 'Fecha', key: 'fecha' },
      { title: 'Hora', key: 'hora' },
      { title: 'Cliente', key: 'clienteJuridico.nombre' },
      { title: 'Cajero', key: 'cajero.nombre' },
      { title: 'Total (S/)', key: 'precioTotal' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ]
  }
})

const items = computed(() => {
  return filtros.tipoComprobante === 'Boletas'
    ? [
      {
        comprobanteId: 1,
        fecha: '2025-10-23',
        hora: '10:32',
        clienteNatural: { nombre: 'Jhordan' },
        cajero: { nombre: 'María López' },
        precioTotal: 177.00,
      },
    ]
    : [
      {
        comprobanteId: 1,
        fecha: '2025-10-23',
        hora: '10:32',
        clienteJuridico: { nombre: 'Manuel' },
        cajero: { nombre: 'María López' },
        precioTotal: 177.00,
      },
    ]
})
/* --------------------------------------------*/

const { mdAndUp, smAndDown } = useDisplay()

//Modales
const filterDialog = ref(false)

//FAP
const handleActionFabMenu = (type) => {
  if (type === 'filter') filterDialog.value = true
}

/* --------------- Filtros ---------------*/
const filtros = reactive({
  rangoFechas: [],
  tipoComprobante: 'Boletas',
})

const selectFilter = computed(() => [
  {
    key: 'rangoFechas',
    label: 'Rango de fechas',
    type: 'range',
    model: filtros.rangoFechas
  },
  {
    key: 'tipoComprobante',
    label: 'Tipo de comprobante',
    type: 'select',
    items: ['Boletas', 'Facturas'],
    model: filtros.tipoComprobante
  }
])


const search = ref('')
</script>

<template>

  <h1>Comprobantes</h1>

  <!-- Filtros -->
  <v-card v-if="mdAndUp" elevation="0" class="mb-4 pa-4">
    <v-row>
      <base-filter v-model:search="search" :filters="selectFilter"
        @update:filter="({ key, value }) => filtros[key] = value" />
    </v-row>
  </v-card>

  <!-- Tabla -->
  <v-data-table :headers="headers" :items="items">
    <template #item.actions="{ item }">
      <action-menu :actions="[
        { label: 'Ver detalles', value: 'view', icon: 'mdi-eye' },
        { label: 'Imprimir', value: 'delete', icon: 'mdi-printer-pos' },
      ]" @action="(type) => handleAction(type, item)" />
    </template>
  </v-data-table>

  <!-- Filtro móvil -->
  <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
    <v-card title="Filtrar Comprobantes">
      <v-card-text>
        <base-filter v-model:search="search" :filters="selectFilter"
          @update:filter="({ key, value }) => filtros[key] = value" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cerrar" variant="plain" @click="filterDialog = false" />
        <v-btn color="primary" text="Aplicar" variant="tonal" @click="filterDialog = false" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <fab-menu v-if="smAndDown" :actions="[
    { type: 'filter', icon: 'mdi-filter', label: 'Filtrar', color: 'secondary' },
  ]" @action="handleActionFabMenu" />

</template>

<style scoped></style>
