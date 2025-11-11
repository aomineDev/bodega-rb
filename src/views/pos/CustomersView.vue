<script setup>
import ActionMenu from '@/components/ActionMenu.vue'
import FabMenu from '@/components/FabMenu.vue'
import BaseFilter from '@/components/BaseFilter.vue'
import { useSnackbar } from '@/stores/snackbar'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { computed, reactive, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

import { useForm } from '@/composables/useForm'
import { useNaturalCustomer } from '@/composables/query/useNaturalCustomer'
import { useJuridicalCustomer } from '@/composables/query/useJuridicalCustomer'
import { useIntegration } from '@/composables/query/useIntegration'

const { showSuccessSnackbar, showErrorSnackbar, showWarningSnackbar } = useSnackbar()

const {
  naturalCustomers,
  isPending: isPendingNatural,
  isError: isErrorNatural,
  error: errorNatural,
  createNaturalCustomerAsync,
  updateNaturalCustomerAsync,
} = useNaturalCustomer()

const {
  juridicalCustomers,
  isPending: isPendingJuridical,
  isError: isErrorJuridical,
  error: errorJuridical,
  createJuridicalCustomerAsync,
  updateJuridicalCustomerAsync,
} = useJuridicalCustomer()

/* --------------- Relleno Tabla ---------------*/
const headers = computed(() => {
  if (filtros.tipoCliente === 'Natural') {
    return [
      { title: 'DNI', key: 'dni' },
      { title: 'Nombre', key: 'nombre' },
      { title: 'Apellido Paterno', key: 'apellidoPaterno' },
      { title: 'Apellido Materno', key: 'apellidoMaterno' },
      { title: 'Dirección', key: 'direccion' },
      { title: 'Telefono', key: 'telefono' },
      { title: 'Email', key: 'email' },
      { title: 'Fecha Nacimiento', key: 'fechaNacimiento' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ]
  } else {
    return [
      { title: 'Razón Social', key: 'razonSocial' },
      { title: 'RUC', key: 'ruc' },
      { title: 'Tipo Contribuyente', key: 'tipoContribuyente' },
      { title: 'Dirección', key: 'direccion' },
      { title: 'Telefono', key: 'telefono' },
      { title: 'Email', key: 'email' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ]
  }
})

const items = computed(() => {
  return filtros.tipoCliente === 'Natural'
    ? naturalCustomers.value || []
    : juridicalCustomers.value || []
})

const isPending = computed(() =>
  filtros.tipoCliente === 'Natural' ? isPendingNatural.value : isPendingJuridical.value,
)

const isError = computed(() =>
  filtros.tipoCliente === 'Natural' ? isErrorNatural.value : isErrorJuridical.value,
)

const error = computed(() =>
  filtros.tipoCliente === 'Natural' ? errorNatural.value : errorJuridical.value,
)

/* --------------------------------------------*/
const {
  formData,
  formRef: clienteForm,
  handleSubmit,
  asignForm,
  resetForm,
  rules,

  nombre,
  apellidoPaterno,
  apellidoMaterno,
  dni,
  fechaNacimiento,
  razonSocial,
  ruc,
  tipoContribuyente,
  actividadEconomica,
  direccion,
  telefono,
  email,
} = useForm({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  dni: '',
  fechaNacimiento: '',
  razonSocial: '',
  ruc: '',
  tipoContribuyente: '',
  actividadEconomica: '',
  direccion: '',
  telefono: '',
  email: '',
  fechaRegistro: '',
})

const { mdAndUp, smAndDown } = useDisplay()
const modalTitle = computed(() => (selectedItem.value ? 'Editar Cliente' : 'Crear Cliente'))
const actionLabel = computed(() => (selectedItem.value ? 'Actualizar' : 'Crear'))
const selectedItem = ref(null)

/* ---------------------- BUSQUEDA API -------------------------- */
const { getCustomerByDni, getCustomerByRuc } = useIntegration()

const isBuscando = ref(false)
const { refetch: refetchDni } = getCustomerByDni(dni)
const { refetch: refetchRuc } = getCustomerByRuc(ruc)

const searchCustomer = async (tipo) => {
  const isDni = tipo === 'DNI'
  const value = isDni ? dni.value : ruc.value
  const customers = isDni ? naturalCustomers.value : juridicalCustomers.value
  const refetchFn = isDni ? refetchDni : refetchRuc

  if (!value || (isDni ? value.length < 8 : value.length < 11)) {
    showWarningSnackbar(`Ingrese un ${tipo} válido`)
    return
  }

  const found = customers?.find((c) => c[isDni ? 'dni' : 'ruc'] === value)
  if (found) {
    showWarningSnackbar('El cliente ya existe en la base de datos')
    return
  }

  try {
    isBuscando.value = true
    const result = await refetchFn()

    if (result?.data) {
      const data = result.data
      if (isDni) {
        nombre.value = data.first_name || ''
        apellidoPaterno.value = data.first_last_name || ''
        apellidoMaterno.value = data.second_last_name || ''
      } else {
        razonSocial.value = data.razon_social || ''
        tipoContribuyente.value = data.tipo || ''
        actividadEconomica.value = data.actividad_economica || ''
        direccion.value = data.direccion || ''
      }

      showSuccessSnackbar(`Datos obtenidos`)
    } else {
      showErrorSnackbar(`No se encontraron datos`)
    }
  } catch (error) {
    console.error(error)
    showErrorSnackbar(`Error al consultar`)
  } finally {
    isBuscando.value = false
  }
}

// Modales
const clienteFormModal = ref(false)
const filterDialog = ref(false)

/* --------------- MENU ACCIONES ---------------*/
const handleEdit = (item) => {
  selectedItem.value = item
  asignForm(selectedItem.value)
  clienteFormModal.value = true
}

const handleAdd = () => {
  clienteFormModal.value = true
}

//Cuando el modal se cierra
watch(clienteFormModal, (isOpen) => {
  if (!isOpen) {
    resetForm()
    selectedItem.value = null
  }
})

const closeModal = () => (clienteFormModal.value = false)

const save = async () => {
  if (filtros.tipoCliente === 'Natural') {
    try {
      if (selectedItem.value) {
        await updateNaturalCustomerAsync({ ...formData.value, id: selectedItem.value.id })
        showSuccessSnackbar('Cliente natural actualizado')
      } else {
        await createNaturalCustomerAsync(formData.value)
        showSuccessSnackbar('Cliente natural creado')
      }
    } catch (error) {
      showErrorSnackbar('Error al crear cliente natural')
      console.log(error)
    }
  } else {
    try {
      if (selectedItem.value) {
        await updateJuridicalCustomerAsync({ ...formData.value, id: selectedItem.value.id })
        showSuccessSnackbar('Cliente juridico actualizado')
      } else {
        await createJuridicalCustomerAsync(formData.value)
        showSuccessSnackbar('Cliente juridico creado')
      }
    } catch (error) {
      showErrorSnackbar('Error al crear cliente juridico')
      console.log(error)
    }
  }

  clienteFormModal.value = false
}

/* --------------- Filtros ---------------*/
const filtros = reactive({
  tipoCliente: 'Natural',
})

const search = ref('') //busqueda
</script>

<template>
  <h1>Clientes</h1>

  <!-- Filtros -->
  <v-card v-if="mdAndUp" elevation="0" class="mb-4 pa-4">
    <v-row>
      <base-filter v-model:search="search" :filters="[
        {
          key: 'tipoCliente',
          label: 'Tipo de cliente',
          type: 'select',
          items: ['Natural', 'Jurídico'],
          model: filtros.tipoCliente,
        },
      ]" @update:filter="({ key, value }) => (filtros[key] = value)" />

      <v-col cols="12" md="2" class="d-flex justify-end align-center">
        <v-btn prepend-icon="mdi-plus" color="primary" elevation="1" @click="handleAdd">
          Crear Cliente
        </v-btn>
      </v-col>
    </v-row>
  </v-card>

  <!-- Tabla -->
  <v-data-table :headers="headers" :items="items" :search="search" :loading="isPending"
    loading-text="Cargando clientes..." no-data-text="No se encontraron clientes">
    <template #item.actions="{ item }">
      <action-menu @edit="handleEdit(item)" />
    </template>
  </v-data-table>

  <v-alert v-if="isError" type="error" class="mt-2">
    Error al cargar clientes: {{ error?.message }}
  </v-alert>

  <!-- Filtro móvil -->
  <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
    <v-card title="Filtrar Clientes">
      <v-card-text>
        <base-filter v-model:search="search" :filters="[
          {
            key: 'tipoCliente',
            label: 'Tipo de cliente',
            type: 'select',
            items: ['Natural', 'Jurídico'],
            model: tipoCliente,
          },
        ]" @update:filter="({ key, value }) => (filtros[key] = value)" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cerrar" variant="plain" @click="filterDialog = false" />
        <v-btn color="primary" text="Aplicar" variant="tonal" @click="filterDialog = false" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Crear y Editar -->
  <template>
    <v-dialog v-model="clienteFormModal" max-width="600">
      <template #activator="{ props }">
        <v-btn v-bind="props" prepend-icon="mdi-account" variant="tonal"> Crear Cliente </v-btn>
      </template>

      <v-card :title="modalTitle">
        <v-card-text>
          <v-form ref="clienteForm">
            <v-row dense>
              <template v-if="filtros.tipoCliente === 'Natural'">
                <v-col cols="12" md="6">
                  <v-mask-input label="DNI" v-model="dni" :counter="8" mask="########" variant="underlined" :rules="[
                    rules.required,
                    rules.distinct(naturalCustomers, 'dni', selectedItem?.id),
                  ]">
                    <template #append-inner>
                      <v-btn icon="mdi-magnify" variant="text" density="compact" @click="searchCustomer('DNI')"
                        :loading="isBuscando" />
                    </template>
                  </v-mask-input>
                </v-col>

                <v-text-field v-model="nombre" label="Nombre" :rules="[rules.required, rules.text]" />

                <v-col cols="12" md="6">
                  <v-text-field v-model="apellidoPaterno" label="Apellido Paterno"
                    :rules="[rules.required, rules.text]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="apellidoMaterno" label="Apellido Materno"
                    :rules="[rules.required, rules.text]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="direccion" label="Dirección" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-mask-input label="Teléfono" v-model="telefono" :counter="9" mask="#########" :rules="[
                    rules.phone,
                    rules.distinct(naturalCustomers, 'telefono', selectedItem?.id),
                  ]" variant="underlined">
                  </v-mask-input>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="email" label="Email" :rules="[
                    rules.email,
                    rules.distinct(naturalCustomers, 'email', selectedItem?.id),
                  ]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-date-input v-model="fechaNacimiento" label="Fecha de nacimiento"
                    variant="underlined"></v-date-input>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" md="6">
                  <v-mask-input label="RUC" v-model="ruc" :counter="11" mask="###########" variant="underlined" :rules="[
                    rules.required,
                    rules.ruc,
                    rules.distinct(juridicalCustomers, 'ruc', selectedItem?.id),
                  ]">
                    <template #append-inner>
                      <v-btn icon="mdi-magnify" variant="text" density="compact" @click="searchCustomer('RUC')"
                        :loading="isBuscando" />
                    </template>
                  </v-mask-input>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="razonSocial" label="Razón Social" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="tipoContribuyente" label="Tipo Contribuyente" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="actividadEconomica" label="Actividad Economica" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="direccion" label="Dirección" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-mask-input label="Teléfono" v-model="telefono" :counter="9" mask="#########" :rules="[rules.phone]"
                    variant="underlined">
                  </v-mask-input>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="email" label="Email" :rules="[rules.required, rules.email]" />
                </v-col>
              </template>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text="Cerrar" variant="plain" @click="closeModal()" />
          <v-btn color="primary" :text="actionLabel" variant="tonal" @click="handleSubmit(save)" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>

  <fab-menu v-model:FormModal="clienteFormModal" v-model:filterDialog="filterDialog" />
</template>

<style scoped></style>
