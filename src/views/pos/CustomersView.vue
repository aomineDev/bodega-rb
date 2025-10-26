<script setup>
import ActionMenu from '@/components/ActionMenu.vue'
import FabMenu from '@/components/FabMenu.vue'
import BaseFilter from '@/components/BaseFilter.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { computed, reactive, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useForm } from '@/composables/useForm'

/* --------------- Relleno Tabla ---------------*/
const headers = computed(() => {
  if (filtros.tipoCliente === 'Natural') {
    return [
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
      { title: 'Representante', key: 'representante' },
      { title: 'Acciones', key: 'actions', sortable: false },
    ]
  }
})

const items = computed(() => {
  return filtros.tipoCliente === 'Natural'
    ? [
        {
          personaId: 1,
          nombre: 'Juan',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'López',
          dni: '12345678',
          direccion: 'maz q lt 3',
          telefono: '987527333',
          email: 'cslis@gmail.com',
          fechaNacimiento: '2006/06/23',
        },
      ]
    : [
        {
          personaId: 2,
          razonSocial: 'Tech S.A.C.',
          ruc: '20123456789',
          representante: 'Carlos Ramos',
        },
      ]
})
/* --------------------------------------------*/

const {
  formData,
  formRef: clienteForm,
  handleSubmit,
  resetForm,
  rules,

  nombre,
  apellidoPaterno,
  apellidoMaterno,
  dni,
  fechaNacimiento,
  razonSocial,
  ruc,
  nombreComercial,
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
  nombreComercial: '',
  tipoContribuyente: '',
  actividadEconomica: '',
  direccion: '',
  telefono: '',
  email: '',
})

const { mdAndUp, smAndDown } = useDisplay()
const customerEdit = ref(false)
const customerId = ref(null)
const modalTitle = computed(() => (customerEdit.value ? 'Editar Cliente' : 'Crear Cliente'))
const actionLabel = computed(() => (customerEdit.value ? 'Actualizar' : 'Crear'))

// Modales
const clienteFormModal = ref(false)
const filterDialog = ref(false)

//dropdown
const handleAction = (type, item) => {
  if (type === 'edit') {
    customerEdit.value = true
    customerId.value = item.personaId || null
    clienteFormModal.value = true

    Object.assign(formData.value, item)
    console.log('Editar', item)
  } else if (type === 'delete') {
    console.log('Eliminar', item.nombre || item.razonSocial)
  }
}

//FAP
const handleActionFabMenu = (type) => {
  if (type === 'add') {
    customerEdit.value = false
    customerId.value = null
    clienteFormModal.value = true
  }
  if (type === 'filter') filterDialog.value = true
}

//Cuando el modal se cierra
watch(clienteFormModal, (isOpen) => {
  if (!isOpen) resetForm()
})

//Acciones Modal
const closeModal = () => (clienteFormModal.value = false)

const save = async () => {
  console.log('Formulario válido:', formData.value)
  clienteFormModal.value = false
}

/* --------------- Filtros ---------------*/
const filtros = reactive({
  tipoCliente: 'Natural',
})
const search = ref('') //busqueda

const selectFilter = [
  { label: 'Editar', value: 'edit', icon: 'mdi-pencil' },
  { label: 'Eliminar', value: 'delete', icon: 'mdi-delete', color: 'red' },
]
</script>

<template>
  <h1>Clientes</h1>

  <!-- Filtros -->
  <v-card v-if="mdAndUp" elevation="0" class="mb-4 pa-4">
    <v-row>
      <base-filter
        v-model:search="search"
        :filters="[
          {
            key: 'tipoCliente',
            label: 'Tipo de cliente',
            type: 'select',
            items: ['Natural', 'Jurídico'],
            model: filtros.tipoCliente,
          },
        ]"
        @update:filter="({ key, value }) => (filtros[key] = value)"
      />

      <v-col cols="12" md="2" class="d-flex justify-end align-center">
        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          elevation="1"
          @view="handleActionFabMenu('add')"
        >
          Crear Cliente
        </v-btn>
      </v-col>
    </v-row>
  </v-card>

  <!-- Tabla -->
  <v-data-table :headers="headers" :items="items">
    <template #item.actions="{ item }">
      <action-menu :actions="selectFilter" @action="(type) => handleAction(type, item)" />
    </template>
  </v-data-table>

  <!-- Filtro móvil -->
  <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
    <v-card title="Filtrar Clientes">
      <v-card-text>
        <base-filter
          v-model:search="search"
          :filters="[
            {
              key: 'tipoCliente',
              label: 'Tipo de cliente',
              type: 'select',
              items: ['Natural', 'Jurídico'],
              model: tipoCliente,
            },
          ]"
          @update:filter="({ key, value }) => (filtros[key] = value)"
        />
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
                  <v-text-field
                    v-model="nombre"
                    label="Nombre"
                    :rules="[rules.required, rules.text]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="apellidoPaterno"
                    label="Apellido Paterno"
                    :rules="[rules.required, rules.text]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="apellidoMaterno"
                    label="Apellido Materno"
                    :rules="[rules.required, rules.text]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="dni"
                    label="DNI"
                    :counter="8"
                    :rules="[rules.required, rules.dni]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="direccion" label="Dirección" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="telefono"
                    label="Teléfono"
                    :counter="9"
                    :rules="[rules.required, rules.phone]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-date-input
                    v-model="fechaNacimiento"
                    label="Fecha de nacimiento"
                    :rules="[rules.required]"
                  ></v-date-input>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="razonSocial"
                    label="Razón Social"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="ruc"
                    label="RUC"
                    counter="11"
                    :rules="[rules.required, rules.ruc]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="nombreComercial"
                    label="Nombre Comercial"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="tipoContribuyente"
                    label="Tipo Contribuyente"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="actividadEconomica"
                    label="Actividad Economica"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="direccion" label="Dirección" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="telefono" label="Teléfono" :counter="9" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                  />
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

  <fab-menu v-if="smAndDown" @action="handleActionFabMenu" />
</template>

<style scoped></style>
