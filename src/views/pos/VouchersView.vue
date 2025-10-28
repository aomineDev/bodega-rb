<script setup>

import ActionMenu from '@/components/ActionMenu.vue';
import FabMenu from '@/components/FabMenu.vue';
import BaseFilter from '@/components/BaseFilter.vue';
import { computed, reactive, ref } from 'vue';
import { useDisplay } from 'vuetify'

import { useTicket } from '@/composables/query/useTicket';
import { useBill } from '@/composables/query/useBill';


const {
  tickets,
  isPending: isPendingTicket,
  isError: isErrorTicket,
  error: errorTicket,
} = useTicket()

const {
  bills,
  isPending: isPendingBill,
  isError: isErrorBill,
  error: errorBill,
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
              <v-col cols="6"><strong>RUC:</strong> {{ selectedComprobante.clienteJuridico?.ruc }}</v-col>
              <v-col cols="6"><strong>Dirección:</strong> {{ selectedComprobante.clienteJuridico?.direccion }}</v-col>
              <v-col cols="6"><strong>Teléfono:</strong> {{ selectedComprobante.clienteJuridico?.telefono }}</v-col>
            </template>
            <template v-else>
              <v-col cols="6"><strong>Nombres:</strong> {{ selectedComprobante.clienteNatural?.nombre }}</v-col>
              <v-col cols="6"><strong>DNI:</strong> {{ selectedComprobante.clienteNatural?.dni }}</v-col>
              <v-col cols="6"><strong>Dirección:</strong> {{ selectedComprobante.clienteNatural?.direccion }}</v-col>
              <v-col cols="6"><strong>Teléfono:</strong> {{ selectedComprobante.clienteNatural?.telefono }}</v-col>
            </template>
          </v-row>
        </v-card>

        <v-divider class="my-3"></v-divider>

        <h3 class="text-subtitle-1 mb-2">Detalles de venta</h3>
        <v-table density="compact">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(det, i) in selectedComprobante.detalleVentas" :key="i">
              <td>{{ det.producto.codigoBarra }}</td>
              <td>{{ det.producto.nombre }}</td>
              <td>{{ det.cantidad }}</td>
              <td>S/ {{ det.precioUnitario }}</td>
              <td>S/ {{ det.subTotal }}</td>
            </tr>
          </tbody>
        </v-table>

        <!-- Totales -->
        <v-row class="justify-end mt-3">
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="6" class="text-right font-weight-medium">Grabado:</v-col>
              <v-col cols="6" class="text-right">S/ {{ selectedComprobante.grabado }}</v-col>

              <v-col cols="6" class="text-right font-weight-medium">IGV:</v-col>
              <v-col cols="6" class="text-right">S/ {{ selectedComprobante.igv }}</v-col>

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
