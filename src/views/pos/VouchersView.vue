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
        detalleVentas: [
          { codigo: '00023', descripcion: 'Producto A', cantidad: 2, precioUnit: 13, total: 26 },
          { codigo: '00532', descripcion: 'Producto B', cantidad: 2, precioUnit: 4, total: 8 },
        ],
      },
    ]
    : [
      {
        comprobanteId: 2,
        fecha: '2025-10-23',
        hora: '10:32',
        clienteJuridico: { nombre: 'Manuel' },
        cajero: { nombre: 'María López' },
        precioTotal: 177.00,
        detalleVentas: [
          { codigo: '01001', descripcion: 'Producto X', cantidad: 5, precioUnit: 50, total: 250 },
          { codigo: '01002', descripcion: 'Producto Y', cantidad: 1, precioUnit: 70.5, total: 70.5 },
        ],
      },
    ]
})

/* --------------- Responsividad y modales ---------------*/
const { mdAndUp, smAndDown } = useDisplay()

const selectedComprobante = ref(null)
const comprobanteDetailModal = ref(false)
const filterDialog = ref(false)

/* --------------- Acciones ---------------*/
const handleView = (item) => {
  selectedComprobante.value = item
  comprobanteDetailModal.value = true
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
      <action-menu @view="handleView(item)"></action-menu>
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

  <!-- Modal: Detalles -->
  <v-dialog v-model="comprobanteDetailModal" max-width="900">
    <v-card v-if="selectedComprobante">
      <v-card-title class="text-h6 font-weight-bold">
        Detalles de {{ filtros.tipoComprobante.slice(0, -1) }}
      </v-card-title>

      <v-card-text>
        <h2 class="text-center mt-4 mb-2">
          {{ filtros.tipoComprobante === 'Facturas' ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA' }}
        </h2>

        <v-row>
          <!-- Encabezado empresa -->
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-avatar size="60" class="mr-3">
              <v-img src="" />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Embutidos RB</div>
              <div class="text-body-2">Huaycán, Av. Andrés Avelino Cáceres</div>
              <div class="text-body-2">Teléfono: 935456467</div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-row dense>
              <v-col cols="6"><strong>N°:</strong></v-col>
              <v-col cols="6">{{ selectedComprobante.comprobanteId }}</v-col>
              <v-col cols="6"><strong>Fecha emisión:</strong></v-col>
              <v-col cols="6">{{ selectedComprobante.fecha }}</v-col>
              <v-col cols="6"><strong>Hora emisión:</strong></v-col>
              <v-col cols="6">{{ selectedComprobante.hora }}</v-col>
              <v-col cols="6"><strong>Tipo pago:</strong></v-col>
              <v-col cols="6">Efectivo</v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <!-- Datos cliente -->
        <v-card variant="outlined" class="pa-3 mb-4">
          <h3 class="text-center mb-2">
            Datos del {{ filtros.tipoComprobante === 'Facturas' ? 'cliente (empresa)' :
              'cliente' }}
          </h3>
          <v-row dense>
            <template v-if="filtros.tipoComprobante === 'Facturas'">
              <v-col cols="6"><strong>Razón social:</strong> {{ selectedComprobante.clienteJuridico?.nombre }}</v-col>
              <v-col cols="6"><strong>RUC:</strong> 20123456789</v-col>
            </template>
            <template v-else>
              <v-col cols="6"><strong>Nombres:</strong> {{ selectedComprobante.clienteNatural?.nombre }}</v-col>
              <v-col cols="6"><strong>DNI:</strong> 74657463</v-col>
            </template>
            <v-col cols="6"><strong>Dirección:</strong> CAL PEDRO RUIZ 129</v-col>
            <v-col cols="6"><strong>Teléfono:</strong> 987654567</v-col>
          </v-row>
        </v-card>

        <v-divider class="my-3"></v-divider>

        <h3 class="text-subtitle-1 mb-2">Detalles de venta</h3>
        <v-table density="compact">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(det, i) in selectedComprobante.detalleVentas" :key="i">
              <td>{{ det.codigo }}</td>
              <td>{{ det.descripcion }}</td>
              <td>{{ det.cantidad }}</td>
              <td>S/ {{ det.precioUnit }}</td>
              <td>S/ {{ det.total }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- Totales -->
        <v-row class="justify-end mt-3">
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="6" class="text-right font-weight-medium">Grabado:</v-col>
              <v-col cols="6" class="text-right">S/ 200</v-col>

              <v-col cols="6" class="text-right font-weight-medium">IGV:</v-col>
              <v-col cols="6" class="text-right">S/ 12</v-col>

              <v-col cols="6" class="text-right font-weight-bold text-primary">Total:</v-col>
              <v-col cols="6" class="text-right font-weight-bold text-primary">S/ {{
                selectedComprobante.precioTotal.toFixed(2) }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>


      <v-card-actions>
        <v-spacer />
        <v-btn text="Cerrar" variant="plain" @click="boletaDialog = false" />
        <v-btn color="primary" text="Imprimir" variant="tonal" @click="printBoleta" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <fab-menu v-model:filterDialog="filterDialog" />

</template>

<style scoped></style>
