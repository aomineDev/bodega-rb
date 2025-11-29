<script setup>
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify/lib/composables/display';
import BaseFilter from '@/components/BaseFilter.vue';
import FabMenu from '@/components/FabMenu.vue';
import ActionMenu from '@/components/ActionMenu.vue';
import { useCheckout } from '@/composables/query/useCheckout';
import { useForm } from '@/composables/useForm';
import { useAuthStore, useSnackbar } from '@/stores';
import { useCajaStore } from '@/stores/checkout';
import { useMovement } from '@/composables/query/useMovement';
import { useReconciliation } from '@/composables/query/useReconciliation';

/* --------------- Variables ---------------*/
const formVisible = ref(false)
const formTitle = ref("")

/* --------------- Uses ---------------*/
const { user } = useAuthStore()

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()

const cajaStore = useCajaStore()
cajaStore.fetchCajaAbierta()

const saldoActual = computed(() => cajaStore.saldoActual)

const {
  checkouts,
  isPending: isPendingCheckout,
  isError: isErrorCheckout,
  error: errorCheckout,

  generatePdf,
  getResumenCajaQuery,
  createCheckoutAsync,
  cerrarCajaAsync,
} = useCheckout()

const resumenCajaId = ref(null)
const { data: resumenCaja, refetch: refetchResumenCaja } = getResumenCajaQuery(resumenCajaId)

watch(
  () => cajaStore.cajaAbierta,
  (caja) => {
    if (caja?.id) {
      resumenCajaId.value = caja.id
      refetchResumenCaja()
    }
  },
  { immediate: true }
)

const {
  formData: formDataOpening,
  formRef: openingForm,
  handleSubmit: handleSubmitOpening,
  resetForm: resetFormOpening,
  rules: rulesOpening,

  montoApertura,
} = useForm({
  montoApertura: '',
})

const {
  formData: formDataMovement,
  formRef: movementForm,
  handleSubmit: handleSubmitMovement,
  resetForm: resetFormMovement,
  rules,

  monto,
  detalle,
  tipo,
} = useForm({
  monto: '',
  detalle: '',
  tipo: '',
})

const {
  formData: formDataReconciliation,
  formRef: reconciliationForm,
  handleSubmit: handleSubmitReconciliation,
  resetForm: resetFormReconciliation,
  rules: rulesReconciliation,

  totalFisico,
  observaciones,
} = useForm({
  totalFisico: '',
  observaciones: '',
})

const {
  getByCajaQuery,

  createMovementAsync,
} = useMovement()

const { createPruebaAsync: createReconciliationAsync } = useReconciliation()


const { data: movementsCheckout } = getByCajaQuery(
  computed(() => cajaStore.cajaAbierta?.id ?? null)
)

/* --------------- Content table ---------------*/
const headers = computed(() => {
  return [
    { title: 'Id', key: 'id' },
    { title: 'Fecha Apertura', key: 'fechaApertura' },
    { title: 'Hora Apertura', key: 'horaApertura' },
    { title: 'Fecha Cierre', key: 'fechaCierre' },
    { title: 'Hora Cierre', key: 'horaCierre' },
    { title: 'Monto Cierre', key: 'montoCierre' },
    { title: 'Estado', key: 'estado' },
    { title: 'Empleado Apertura', key: 'empleadoApertura' },
    { title: 'Empleado Cierre', key: 'empleadoCierre' },
    { title: 'Acciones', key: 'actions', sortable: false },
  ]
})

const items = computed(() => {
  const data = checkouts.value ?? []

  return data.map(item => ({
    ...item,
    empleadoApertura: `${item.empleadoApertura?.nombre || ''} ${item.empleadoApertura?.apellidoPaterno || ''}`.trim(),
    empleadoCierre: `${item.empleadoCierre?.nombre || ''} ${item.empleadoCierre?.apellidoPaterno || ''}`.trim(),
  }))
})

const headersMovement = [
  { title: "Tipo", key: "tipo" },
  { title: "Monto", key: "monto" },
  { title: "Detalle", key: "detalle" },
  { title: "Fecha", key: "fecha" },
  { title: "Hora", key: "hora" }
]

/* --------------- Responsive ---------------*/
const { mdAndUp, smAndDown } = useDisplay()

/* --------------- Filtros ---------------*/
const search = ref('') //busqueda

/* --------------- Modales ---------------*/
const filterDialog = ref(false)
const checkoutFormModal = ref(false)
const movimientosModal = ref(false)
const cierreCajaModal = ref(false)
const comprobanteDetailModal = ref(false)
const pdfUrl = ref(null)

/* --------------- Metodos ---------------*/
function handleOpenCheckout() {
  checkoutFormModal.value = true
}

function handleCloseCheckout() {
  cierreCajaModal.value = true
}

const handleMovement = async () => {
  movimientosModal.value = true
}

//Cuando el modal se cierra
watch(checkoutFormModal, (isOpen) => {
  if (!isOpen) {
    resetFormOpening()
  }
})

const closeModal = () => (checkoutFormModal.value = false)

const save = async () => {

  const openingObject = {
    ...formDataOpening.value,
    empleadoApertura: { id: user.id }
  }

  try {
    const openingData = await createCheckoutAsync(openingObject)
    showSuccessSnackbar('Apertura de caja realizada correctamente')

    cajaStore.setCajaAbierta(openingData)
  } catch (error) {
    showErrorSnackbar('Error al aperturar caja')
    console.log(error)
  }
  closeModal()
}

// Guardar movimiento
const saveMovimiento = async () => {
  const payload = {
    ...formDataMovement.value,
    caja: { id: cajaStore.cajaAbierta.id },
    empleado: { id: user.id }
  }

  console.log(payload)

  try {
    await createMovementAsync(payload)
    showSuccessSnackbar("Movimiento registrado")
    resetFormMovement()

    cajaStore.actualizarSaldo(payload.monto, payload.tipo)

    formVisible.value = false
  } catch (error) {
    showErrorSnackbar("Error al registrar movimiento", error)
  }
}

function openIngreso() {
  formVisible.value = true
  formTitle.value = "Registrar Ingreso"
  tipo.value = "INGRESO"
}

function openRetiro() {
  formVisible.value = true
  formTitle.value = "Registrar Retiro"
  tipo.value = "RETIRO"
}

async function closeReconciliation() {
  const payload = {
    ...formDataReconciliation.value,
    caja: { id: cajaStore.cajaAbierta.id },
    cajero: { id: user.id }
  }

  try {
    const reconciliationObject = await createReconciliationAsync(payload)

    await closeCheckout(reconciliationObject.totalFisico)

    showSuccessSnackbar('Caja cerrada correctamente')
    cierreCajaModal.value = false
    resetFormReconciliation()
  } catch (error) {
    showErrorSnackbar('Error al cerrar la caja')
    console.error(error)
  }
}

async function closeCheckout(totalFisico) {

  const closeCheckoutObject = {
    montoCierre: totalFisico,
    empleadoCierre: { id: user.id }
  }

  try {
    const CheckoutObject = await cerrarCajaAsync({
      id: cajaStore.cajaAbierta.id,
      ...closeCheckoutObject
    });

    console.log(CheckoutObject)

    showSuccessSnackbar('Caja cerrada correctamente');
    cajaStore.setCajaAbierta(null);
    cierreCajaModal.value = false;
    resetFormReconciliation();
  } catch (error) {
    showErrorSnackbar('Error al cerrar la caja');
    console.error(error);
  }

}

const handleView = async (item) => {
  pdfUrl.value = await generatePdf(item.id)
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

</script>

<template>
  <h1>Cierre de caja</h1>

  <!-- Filtros -->
  <v-card v-if="mdAndUp" elevation="0" class="mb-4 pa-6">
    <v-row>
      <base-filter v-model:search="search" />
      <v-col cols="12" md="2" class="d-flex justify-end align-center">
        <v-btn prepend-icon="mdi-cash-plus" color="primary" elevation="1" @click="handleOpenCheckout"
          v-if="!cajaStore.cajaAbierta">
          Aperturar
        </v-btn>

        <v-btn prepend-icon="mdi-cash-remove" color="red" elevation="1" @click="handleCloseCheckout" v-else>
          Cerrar
        </v-btn>

      </v-col>
    </v-row>
  </v-card>

  <!-- Tabla -->
  <v-data-table :headers="headers" :items="items" :search="search" :loading="isPendingCheckout"
    loading-text="Cargando caja..." no-data-text="No se encontraron cajas">
    <template #item.actions="{ item }">
      <action-menu v-if="item.estado" @movement="handleMovement(item)" />
      <action-menu v-else @view="handleView(item)" />
    </template>

  </v-data-table>

  <v-alert v-if="isErrorCheckout" type="error" class="mt-2">
    Error al cargar clientes: {{ errorCheckout?.message }}
  </v-alert>

  <!-- modal apertura y cierre -->
  <v-dialog v-model="checkoutFormModal" max-width="600">
    <v-card title="Apertura de caja">
      <v-card-text>
        <v-form ref="openingForm">
          <v-row dense>
            <!-- Monto de apertura -->
            <v-col cols="12">
              <v-text-field v-model="montoApertura" label="Monto de apertura (S/)" type="number"
                :rules="[rulesOpening.required, rulesOpening.precio]" prepend-inner-icon="mdi-cash"
                inputmode="decimal" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cerrar" variant="plain" @click="closeModal" />
        <v-btn color="primary" text="Guardar" variant="tonal" @click="handleSubmitOpening(save)" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- modal movimientos -->
  <v-dialog v-model="movimientosModal" max-width="700">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Movimientos de Caja
      </v-card-title>

      <v-card-text>
        <!-- Saldo actual -->
        <v-alert type="info" class="mb-4" border="start" colored-border>
          Saldo actual en caja: <strong>S/ {{ saldoActual }}</strong>
        </v-alert>

        <!-- Botones para acciones -->
        <div class="d-flex justify-center mb-4 ga-4">
          <v-btn color="primary" prepend-icon="mdi-cash-plus" @click="openIngreso">
            Ingreso
          </v-btn>

          <v-btn color="red" prepend-icon="mdi-cash-minus" @click="openRetiro">
            Retiro
          </v-btn>
        </div>

        <!-- Formulario Ingreso/Retiro -->
        <v-expand-transition>
          <v-card v-if="formVisible" class="pa-4 mb-6" elevation="1">
            <h4 class="mb-4">{{ formTitle }}</h4>

            <v-form ref="movementForm">
              <v-row dense>
                <!-- Monto -->
                <v-col cols="12" md="6">
                  <v-text-field v-model="monto" label="Monto (S/)" prepend-inner-icon="mdi-cash" :rules="[
                    rules.required,
                    rules.precio,
                    tipo === 'RETIRO' ? rules.montoMaximo(cajaStore.saldoActual) : () => true
                  ]" inputmode="decimal" />
                </v-col>

                <!-- Detalle -->
                <v-col cols="12" md="6">
                  <v-text-field v-model="detalle" label="Detalle" />
                </v-col>
              </v-row>

              <v-btn color="primary" class="mt-2" @click="handleSubmitMovement(saveMovimiento)">
                Guardar
              </v-btn>
            </v-form>
          </v-card>
        </v-expand-transition>

        <!-- Tabla de Movimientos -->
        <v-data-table :headers="headersMovement" :items="movementsCheckout" class="mt-4"
          no-data-text="No hay movimientos aún" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="plain" text="Cerrar" @click="movimientosModal = false" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal Cierre de Caja -->
  <v-dialog v-model="cierreCajaModal" max-width="700">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Cierre de Caja
      </v-card-title>

      <v-card-text>
        <!-- Resumen de ventas -->
        <v-row dense>
          <v-col cols="12" md="6">
            <v-card outlined class="pa-4 mb-4">
              <h4 class="mb-3">
                <v-icon class="me-2">mdi-cart</v-icon> Resumen de ventas del día
              </h4>
              <div class="d-flex flex-column">
                <div class="d-flex justify-space-between py-1">
                  <div>Ventas en efectivo</div>
                  <div>S/ {{ resumenCaja?.ventasEfectivo ?? 0 }}</div>
                </div>
                <div class="d-flex justify-space-between py-1">
                  <div>Ventas tarjeta</div>
                  <div>S/ {{ resumenCaja?.ventasTarjeta ?? 0 }}</div>
                </div>
                <div class="d-flex justify-space-between py-1">
                  <div>Ventas Yape</div>
                  <div>S/ {{ resumenCaja?.ventasYape ?? 0 }}</div>
                </div>
                <div class="d-flex justify-space-between py-1">
                  <div>Ventas Plin</div>
                  <div>S/ {{ resumenCaja?.ventasPlin ?? 0 }}</div>
                </div>
                <v-divider class="my-2" />
                <div class="d-flex justify-space-between py-1 fw-bold">
                  <div>Total</div>
                  <div>S/ {{ resumenCaja?.ventasDelDia ?? 0 }}</div>
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card outlined class="pa-4 mb-4">
              <h4 class="mb-3">
                <v-icon class="me-2">mdi-bank</v-icon> Resumen de pagos electrónicos
              </h4>
              <div class="d-flex flex-column">
                <div class="d-flex justify-space-between py-1">
                  <div>Ventas tarjeta</div>
                  <div>S/ {{ resumenCaja?.ventasTarjeta ?? 0 }}</div>
                </div>
                <div class="d-flex justify-space-between py-1">
                  <div>Ventas Yape</div>
                  <div>S/ {{ resumenCaja?.ventasYape ?? 0 }}</div>
                </div>
                <div class="d-flex justify-space-between py-1">
                  <div>Ventas Plin</div>
                  <div>S/ {{ resumenCaja?.ventasPlin ?? 0 }}</div>
                </div>
                <v-divider class="my-2" />
                <div class="d-flex justify-space-between py-1 fw-bold">
                  <div>Total</div>
                  <div>S/ {{ resumenCaja?.ventasElectronicas ?? 0 }}</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Resumen de cierre -->
        <v-card outlined class="pa-4 mb-4">
          <h4 class="mb-3">
            <v-icon class="me-2">mdi-file-document-outline</v-icon> Resumen de cierre
          </h4>
          <div class="d-flex flex-column">
            <div class="d-flex justify-space-between py-1">
              <div>Apertura de caja</div>
              <div>S/ {{ resumenCaja?.apertura ?? 0 }}</div>
            </div>
            <div class="d-flex justify-space-between py-1">
              <div>Ventas en efectivo</div>
              <div>S/ {{ resumenCaja?.ventasEfectivo ?? 0 }}</div>
            </div>
            <div class="d-flex justify-space-between py-1">
              <div>Ingresos</div>
              <div>S/ {{ resumenCaja?.ingresos ?? 0 }}</div>
            </div>
            <div class="d-flex justify-space-between py-1">
              <div>Vuelto</div>
              <div>S/ {{ resumenCaja?.egresosVuelto ?? 0 }}</div>
            </div>
            <div class="d-flex justify-space-between py-1">
              <div>Retiros</div>
              <div>S/ {{ resumenCaja?.egresosRetiro ?? 0 }}</div>
            </div>
            <v-divider class="my-2" />
            <div class="d-flex justify-space-between py-1 fw-bold">
              <div>Ingresos totales</div>
              <div>S/ {{ resumenCaja?.ingresosTotales ?? 0 }}</div>
            </div>
            <div class="d-flex justify-space-between py-1 fw-bold">
              <div>Egresos totales</div>
              <div>S/ {{ resumenCaja?.egresosTotales ?? 0 }}</div>
            </div>
            <div class="d-flex justify-space-between py-1 fw-bold">
              <div>Saldo calculado</div>
              <div>S/ {{ resumenCaja?.saldoCalculado ?? 0 }}</div>
            </div>
          </div>
        </v-card>

        <!-- Arqueo de caja -->
        <v-card outlined class="pa-4 mb-4">
          <h4 class="mb-3">
            <v-icon class="me-2">mdi-clipboard-check-outline</v-icon> Arqueo de caja
          </h4>
          <v-form ref="reconciliationForm">
            <div class="d-flex flex-column">
              <div class="d-flex justify-space-between py-1">
                <div>Saldo según sistema</div>
                <div>S/ {{ resumenCaja?.saldoCalculado ?? 0 }}</div>
              </div>
              <div class="d-flex justify-space-between py-1">
                <div>Total físico</div>
                <div style="width: 120px;">
                  <v-text-field v-model.number="totalFisico" label="S/" type="number" inputmode="decimal" hide-details
                    dense :rules="[rulesReconciliation.required, rulesReconciliation.precio]" />
                </div>
              </div>
              <div class="d-flex justify-space-between py-1">
                <div>Diferencia</div>
                <div>S/ {{ (totalFisico - resumenCaja?.saldoCalculado ?? 0).toFixed(2) }}</div>
              </div>
              <div class="d-flex justify-space-between py-1">
                <div>Observaciones</div>
                <div style="width: 400px;">
                  <v-textarea v-model="observaciones" rows="2" placeholder="Opcional" variant="underlined" hide-details
                    dense />
                </div>
              </div>
            </div>
          </v-form>
        </v-card>

      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="plain" text @click="cierreCajaModal = false">Cancelar</v-btn>
        <v-btn color="primary" text @click="handleSubmitReconciliation(closeReconciliation)">Cerrar Caja</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Detalles -->
  <v-dialog v-model="comprobanteDetailModal" max-width="900">
    <v-card>
      <v-card-title>Vista previa del cierre de caja</v-card-title>
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

  <fab-menu v-model:filterDialog="filterDialog" />


</template>
