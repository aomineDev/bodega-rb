<template>
  <h1>Inventario</h1>

  <v-btn @click="inventoryFormDialog = true" color="primary" prepend-icon="mdi-plus">Crear</v-btn>

  <v-data-table
    :headers="headers"
    :items="inventoryList"
    :loading="isPending"
    loading-text="Cargando inventario..."
    no-data-text="No se encontraron invetarios"
  >
    <template #item.fechaInventario="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #item.asistenteAlmacen="{ value }">
      {{ value.nombre }} {{ value.apellidoPaterno }}
    </template>

    <template #item.actions="{ item }">
      <action-menu
        @view="handleView(item)"
        @edit="handleEdit(item)"
        @delete="handleDelete(item)"
      ></action-menu>
    </template>
  </v-data-table>

  <v-dialog v-model="inventoryFormDialog" max-width="600">
    <v-card prepend-icon="mdi-clipboard-outline" title="Crear Inventario">
      <v-card-text>
        <v-form ref="formRef">
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                :readonly="isEditing"
                label="Categorias"
                :items="categoryList"
                item-value="id"
                item-title="nombre"
                color="primary"
                v-model="categoria"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-date-input
                label="Fecha"
                :min="today"
                color="primary"
                :display-format="formatDate"
                v-model="inventoryDate"
              ></v-date-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                label="Asistente de Almacen"
                color="primary"
                item-title="nombre"
                item-value="id"
                :items="employees"
                v-model="asistenteAlmacen"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Cerrar" @click="inventoryFormDialog = false"></v-btn>
        <v-btn text="Guardar" color="primary" @click="handleSubmit"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useCategory } from '@/composables/query/useCategory'
import { useEmployeesByRol } from '@/composables/query/useEmployee'
import { useInventory } from '@/composables/query/useInventario'
import { useForm } from '@/composables/useForm'
import { useSnackbar } from '@/stores/snackbar'
import { ROLES } from '@/utils/constants/roles'
import { shallowRef, watch } from 'vue'

import ActionMenu from '@/components/ActionMenu.vue'
import { useDateInput } from '@/composables/useDateInput'

const {
  formRef,
  formData,
  handleSubmit,
  resetForm,
  asignForm: assignForm,
  categoria,
  fechaInventario,
  asistenteAlmacen,
} = useForm(
  {
    categoria: null,
    fechaInventario: null,
    asistenteAlmacen: null,
  },
  handleCreateOrEdit,
)

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()
const { inputDate: inventoryDate, today, formatDate } = useDateInput(fechaInventario)

const { inventoryList, isPending, createInventory } = useInventory()
const { category: categoryList } = useCategory()
const { data: employees } = useEmployeesByRol(ROLES.ASISTENTE)

const inventoryFormDialog = shallowRef(false)
const isEditing = shallowRef(false)

const headers = [
  { title: 'Categoria', key: 'categoria.nombre' },
  { title: 'Fecha', key: 'fechaInventario' },
  { title: 'Asistente de Almacen', key: 'asistenteAlmacen' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

watch(inventoryFormDialog, (value) => {
  if (!value) {
    resetForm()
    isEditing.value = false
  }
})

function handleView(inventory) {
  assignForm(inventory)
  inventoryFormDialog.value = true
}

function handleEdit(inventory) {
  isEditing.value = true
  assignForm(inventory)
  inventoryFormDialog.value = true
}

function handleDelete(inventory) {
  console.log(inventory)
}

function handleCreateOrEdit() {
  const inventory = {
    ...formData.value,
    categoria: { id: formData.value.categoria },
    asistenteAlmacen: { id: formData.value.asistenteAlmacen },
  }

  try {
    createInventory(inventory)

    inventoryFormDialog.value = false
    showSuccessSnackbar('Inventario creado')
  } catch (e) {
    console.log(e)
    showErrorSnackbar('Error al crear inventario')
  }
}
</script>
