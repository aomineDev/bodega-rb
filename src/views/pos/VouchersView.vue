<script setup>

import ActionMenu from '@/components/ActionMenu.vue';
import { computed, ref } from 'vue';

/* --------------- Relleno Tabla ---------------*/
const headers = computed(() => {
  if (tipoCliente.value === 'Natural') {
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
  return tipoCliente.value === 'Natural'
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
        cliente: "Jhordan",
        cajero: { nombre: 'María López' },
        precioTotal: 177.00,
      },
    ]
})
/* --------------------------------------------*/

const tipoCliente = ref('Natural') //select
</script>

<template>

  <h1>Comprobantes</h1>

  <!-- Tabla -->
  <v-data-table :headers="headers" :items="items">
    <template #item.actions="{ item }">
      <action-menu :actions="[
        { label: 'Ver detalles', value: 'view', icon: 'mdi-eye' },
        { label: 'Imprimir', value: 'delete', icon: 'printer-pos', color: 'red' },
      ]" @action="(type) => handleAction(type, item)" />
    </template>
  </v-data-table>

</template>

<style scoped></style>
