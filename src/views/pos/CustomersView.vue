<script setup>

import ActionMenu from '@/components/ActionMenu.vue';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { ref } from 'vue';
import { useValidation } from '@/composables/useFormValidation';

// Variables reactivas
const clienteFormModal = ref(false)
const clienteForm = ref(null)
const search = ref('')
const { rules, resetForm } = useValidation()

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Especie', key: 'species' },
  { title: 'Dieta', key: 'diet' },
  { title: 'Hábitat', key: 'habitat' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const items = [
  {
    name: 'African',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
  {
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
  {
    name: 'African Jirafa',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
]

const handleAction = (type, item) => {
  if (type === 'view') {
    console.log('Ver detalles de', item.name)
  } else if (type === 'edit') {
    console.log('Editar', item.name)
  } else if (type === 'delete') {
    console.log('Eliminar', item.name)
  }
}

const form = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  dni: '',
  direccion: '',
  telefono: '',
  email: '',
  fechaNacimiento: '',
})

const save = async () => {
  const { valid } = await clienteForm.value.validate()
  if (!valid) return

  console.log('Formulario válido:', form.value)
  clienteFormModal.value = false
}

const closeModal = () => {
  resetForm(clienteForm, form)
  clienteFormModal.value = false
}
</script>

<template>
  <h1>Clientes</h1>
  <!-- Filtros -->
  <v-card elevation="0" class="mb-4 pa-4">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="search" label="Buscar cliente" prepend-inner-icon="mdi-magnify" variant="underlined"
          hide-details />
      </v-col>

      <v-col cols="12" md="4">
        <v-select label="Tipo de cliente" :items="['Cliente Natural', 'Cliente Jurídico']" variant="underlined"
          hide-details />
      </v-col>

      <v-col cols="12" md="2" class="d-flex justify-end align-center">
        <v-btn prepend-icon="mdi-plus" color="primary" elevation="1" @click="clienteFormModal = true">
          Crear Cliente
        </v-btn>
      </v-col>
    </v-row>
  </v-card>

  <!-- Tabla -->
  <v-data-table :headers="headers" :items="items">
    <template #[`item.actions`]="{ item }">
      <action-menu @action="(type) => handleAction(type, item)" />
    </template>
  </v-data-table>

  <!-- Modales -->
  <template>
    <v-dialog v-model="clienteFormModal" max-width="600">
      <template #activator="{ props }">
        <v-btn v-bind="props" prepend-icon="mdi-account" variant="tonal">
          Crear Cliente
        </v-btn>
      </template>

      <v-card title="Crear Cliente">
        <v-card-text>
          <v-form ref="clienteForm">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.nombre" label="Nombre" :rules="[rules.required]" variant="underlined" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.apellidoPaterno" label="Apellido Paterno" :rules="[rules.required]"
                  variant="underlined" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.apellidoMaterno" label="Apellido Materno" :rules="[rules.required]"
                  variant="underlined" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.dni" label="DNI" :counter="8" :rules="[rules.required]"
                  variant="underlined" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.direccion" label="Dirección" :rules="[rules.required]"
                  variant="underlined" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.telefono" label="Teléfono" :counter="9" :rules="[rules.required]"
                  variant="underlined" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.email" label="Email" :rules="[rules.required, rules.email]"
                  variant="underlined" />
              </v-col>

              <v-col cols="12" md="6">
                <v-date-input v-model="form.fechaNacimiento" label="Fecha de nacimiento" :rules="[rules.required]"
                  variant="underlined"></v-date-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text="Cerrar" variant="plain" @click="closeModal()" />
          <v-btn color="primary" text="Crear" variant="tonal" @click="save" />
        </v-card-actions>

      </v-card>
    </v-dialog>
  </template>

</template>

<style scoped></style>
