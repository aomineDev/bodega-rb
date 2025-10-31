<script setup>

import ActionMenu from '@/components/ActionMenu.vue';
import FabMenu from '@/components/FabMenu.vue';
import BaseFilter from '@/components/BaseFilter.vue';
import { computed, reactive, ref, watch } from 'vue';
import { useDisplay } from 'vuetify'

import { useTicket } from '@/composables/query/useTicket';
import { useBill } from '@/composables/query/useBill';


const {
  tickets,
  isPending: isPendingTicket,
  isError: isErrorTicket,
  error: errorTicket,
  generatePdfTicket,
} = useTicket()

const {
  bills,
  isPending: isPendingBill,
  isError: isErrorBill,
  error: errorBill,
  generatePdfBill,
} = useBill()

/* --------------- Relleno Tabla ---------------*/
const headers = computed(() => {
  if (filtros.tipoComprobante === 'Boletas') {
    return [
      { title: 'N° boleta', key: 'id' },
      { title: 'Fecha', key: 'fecha' },
      { title: 'Hora', key: 'hora' },
      { title: 'Cliente', key: 'cliente' },
      { title: 'Cajero', key: 'cajero' },
      { title: 'Total (S/)', key: 'precioTotal' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ]
  } else {
    return [
      { title: 'N° factura', key: 'id' },
      { title: 'Fecha', key: 'fecha' },
      { title: 'Hora', key: 'hora' },
      { title: 'Cliente', key: 'cliente' },
      { title: 'Cajero', key: 'cajero' },
      { title: 'Total (S/)', key: 'precioTotal' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ]
  }
})

const items = computed(() => {
  const data = filtros.tipoComprobante === 'Boletas'
    ? tickets.value || []
    : bills.value || []

  return data.map(item => ({
    ...item,
    cliente: filtros.tipoComprobante === 'Boletas'
      ? `${item.clienteNatural?.nombre || ''} ${item.clienteNatural?.apellidoPaterno || ''}`.trim()
      : item.clienteJuridico?.razonSocial || '',
  }))
})


const isPending = computed(() =>
  filtros.tipoComprobante === 'Boleta' ? isPendingTicket.value : isPendingBill.value
)

const isError = computed(() =>
  filtros.tipoComprobante === 'Boleta' ? isErrorTicket.value : isErrorBill.value
)

const error = computed(() =>
  filtros.tipoComprobante === 'Boleta' ? errorTicket.value : errorBill.value
)

/* --------------- Responsividad y modales ---------------*/
const { mdAndUp, smAndDown } = useDisplay()

const comprobanteDetailModal = ref(false)
const filterDialog = ref(false)

/* --------------- Acciones ---------------*/
const pdfUrl = ref(null)

const handleView = async (item) => {
  filtros.tipoComprobante === 'Boletas' ? pdfUrl.value = await generatePdfTicket(item.id) : pdfUrl.value = await generatePdfBill(item.id)
  comprobanteDetailModal.value = true
}

const printPdf = () => {
  const iframe = document.getElementById('pdfPreviewFrame')
  iframe.contentWindow.print()
}

watch(comprobanteDetailModal, (val) => {
  if (!val && pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
    pdfUrl.value = null
  }
})

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
  <v-data-table :headers="headers" :items="items" :loading="isPending" loading-text="Cargando comprobantes..."
    no-data-text="No se encontraron comprobantes">
    <template #item.actions="{ item }">
      <action-menu @view="handleView(item)"></action-menu>
    </template>
  </v-data-table>

  <v-alert v-if="isError" type="error" class="mt-2">
    Error al cargar clientes: {{ error?.message }}
  </v-alert>

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

  <!-- Modal: Detalles -->
  <v-dialog v-model="comprobanteDetailModal" max-width="900">
    <v-card>
      <v-card-title>Vista previa del comprobante</v-card-title>
      <v-card-text>
        <iframe v-if="pdfUrl" :src="pdfUrl" id="pdfPreviewFrame" width="100%" height="600px"
          style="border:none;"></iframe>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text="Cerrar" @click="comprobanteDetailModal = false" />
        <v-btn color="primary" variant="tonal" text="Imprimir" @click="printPdf" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <fab-menu v-model:filterDialog="filterDialog" />

</template>

<style scoped></style>
