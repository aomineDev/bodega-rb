<script setup>
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify/lib/composables/display';
import BaseFilter from '@/components/BaseFilter.vue';
import FabMenu from '@/components/FabMenu.vue';
import ActionMenu from '@/components/ActionMenu.vue';
import { useCheckout } from '@/composables/query/usecheckout';
import { useForm } from '@/composables/useForm';
import { useAuthStore, useSnackbar } from '@/stores';
import { useCajaStore } from '@/stores/checkout';

/* --------------- Variables ---------------*/
// const modalTitle = computed(() => (selectedItem.value ? 'Editar Cliente' : 'Crear Cliente'))

/* --------------- Uses ---------------*/
const { user } = useAuthStore()

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()

const cajaStore = useCajaStore()
cajaStore.fetchCajaAbierta()

const {
  checkouts,
  isPending: isPendingCheckout,
  isError: isErrorCheckout,
  error: errorCheckout,

  createCheckoutAsync,
} = useCheckout()

const {
  formData,
  formRef: openingForm,
  handleSubmit,
  resetForm,
  rules,

  montoApertura,
} = useForm({
  montoApertura: '',
})

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
    { title: 'Empleado Cierre', key: 'EmpleadoCierre' },
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

/* --------------- Responsive ---------------*/
const { mdAndUp, smAndDown } = useDisplay()

/* --------------- Filtros ---------------*/
const search = ref('') //busqueda

/* --------------- Modales ---------------*/
const filterDialog = ref(false)
const checkoutFormModal = ref(false)

/* --------------- Metodos ---------------*/
function handleOpenCheckout() {
  checkoutFormModal.value = true
}

//Cuando el modal se cierra
watch(checkoutFormModal, (isOpen) => {
  if (!isOpen) {
    resetForm()
    // selectedItem.value = null
  }
})

const closeModal = () => (checkoutFormModal.value = false)

const save = async () => {

  const openingObject = {
    ...formData.value,
    empleadoApertura: { id: user.id }
  }

  try {
    const openingData = await createCheckoutAsync(openingObject)
    showSuccessSnackbar('Apertura de caja realizada correctamente')
    console.log(openingData)
  } catch (error) {
    showErrorSnackbar('Error al aperturar caja')
    console.log(error)
  }
  closeModal()
}

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
      <action-menu @view="handleView(item)"></action-menu>
    </template>
  </v-data-table>

  <v-alert v-if="isErrorCheckout" type="error" class="mt-2">
    Error al cargar clientes: {{ errorCheckout?.message }}
  </v-alert>

  <!-- modal apertura y cierre -->
  <v-dialog v-model="checkoutFormModal" max-width="600">
    <v-card title="Hola">
      <v-card-text>
        <v-form ref="openingForm">
          <v-row dense>
            <!-- Monto de apertura -->
            <v-col cols="12">
              <v-text-field v-model="montoApertura" label="Monto de apertura (S/)"
                :rules="[rules.required, rules.precio]" prepend-inner-icon="mdi-cash" inputmode="decimal" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cerrar" variant="plain" @click="closeModal" />
        <v-btn color="primary" text="Guardar" variant="tonal" @click="handleSubmit(save)" />
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

  <fab-menu v-model:FormModal="checkoutFormModal" v-model:filterDialog="filterDialog" />

</template>
