<template>
  <h1>Inventario</h1>

  <v-data-table
    :headers="headers"
    :items="categoryIventory"
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
      <v-switch
        color="primary"
        :model-value="item.state"
        readonly
        @click="handleSwitchInventoryState(item)"
      ></v-switch>
    </template>
  </v-data-table>

  <v-dialog v-model="confirmDialog" max-width="500">
    <v-card title="Abrir Inventario">
      <v-card-text class="text-center text-body-2">
        <div>
          <v-icon size="100" color="primary" icon="mdi-alert-circle-outline" class="mb-4"></v-icon>
        </div>
        ¿Está seguro de abrir el inventario de <strong>{{ selectedCategory.nombre }}</strong
        >? <br />
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cerrar" @click="confirmDialog = false"></v-btn>
        <v-btn text="Confirmar" color="primary" @click="openInventory"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="inventoryDetailsDialog" max-width="800">
    <v-card prepend-icon="mdi-clipboard-outline" :title="selectedInventory?.categoria?.nombre">
      <v-divider></v-divider>
      <v-card-text>
        <v-table fixed-header>
          <thead>
            <tr>
              <th>Producto</th>
              <th>S. Sistema</th>
              <th>S. Fisico</th>
              <th>Diferencia</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detalle in selectedInventory?.inventarioDetalles" :key="detalle.id">
              <td>{{ detalle.producto.nombre }}</td>
              <td>{{ detalle.stockSistema }}</td>
              <td>{{ detalle.stockFisico }}</td>
              <td>{{ detalle.diferencia }}</td>
              <td>{{ detalle.observaciones }}</td>
              <td>
                <v-btn
                  icon="mdi-pencil"
                  @click="openInventoryObservationsDialog(detalle)"
                  color="primary"
                  variant="text"
                ></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text="Cerrar" @click="inventoryDetailsDialog = false"></v-btn>
        <v-btn text="Guardar" color="primary" @click="confirmCloseInventoryDialog = true"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="inventoryObservationsDialog" max-width="500">
    <v-card title="Agregar Observaciones">
      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
            label="Observaciones"
            v-model="observaciones"
            counter="100"
            color="primary"
            :rules="[rules.required]"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cerrar" @click="inventoryObservationsDialog = false"></v-btn>
        <v-btn text="Guardar" color="primary" @click="handleSubmit"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="confirmCloseInventoryDialog" max-width="500">
    <v-card title="Cerrar Inventario">
      <v-card-text class="text-center text-body-2">
        <div>
          <v-icon size="100" color="primary" icon="mdi-alert-circle-outline" class="mb-4"></v-icon>
        </div>
        ¿Está seguro de cerrar el inventario de <strong>{{ selectedCategory.nombre }}</strong
        >? <br />
        <strong>El stock de los productos sera remplazado por el stock del inventario.</strong>
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cerrar" @click="confirmCloseInventoryDialog = false"></v-btn>
        <v-btn text="Confirmar" color="primary" @click="closeInventory"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- <v-btn @click="inventoryFormDialog = true" color="primary" prepend-icon="mdi-plus">Crear</v-btn>

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
        @view="openInventoryDetailsDialog(item)"
        @edit="openEditFormDialog(item)"
        @delete="openDeleteDialog(item)"
      ></action-menu>
    </template>
  </v-data-table>

  <v-dialog v-model="inventoryFormDialog" max-width="600">
    <v-card prepend-icon="mdi-clipboard-outline" :title="iventoryFormDialogTitle">
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
                v-model="categoria.id"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-date-input
                label="Fecha"
                :min="today"
                color="primary"
                :display-format="formatDate"
                v-model="inventoryDate"
                autocomplete="off"
                :rules="[rules.required]"
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
                v-model="asistenteAlmacen.id"
                :rules="[rules.required]"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cerrar" @click="inventoryFormDialog = false"></v-btn>
        <v-btn text="Guardar" color="primary" @click="handleSubmit"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="inventoryDeleteDialog" max-width="500">
    <v-card title="Eliminar Inventario">
      <v-card-text class="text-center text-body-2">
        <div>
          <v-icon size="100" color="red" icon="mdi-alert-octagon-outline"></v-icon>
        </div>
        ¿Está seguro que desea eliminar el inventario? <br />
        <strong>Esta acción no se puede deshacer.</strong>
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cerrar" @click="inventoryDeleteDialog = false"></v-btn>
        <v-btn text="Eliminar" color="red" @click="deleteInventory"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

   -->
</template>

<script setup>
import { useCategory } from '@/composables/query/useCategory'
import { useInventory } from '@/composables/query/useInventory'
import { useForm } from '@/composables/useForm'
import { useSnackbar } from '@/stores/snackbar'
import { computed, shallowRef } from 'vue'

import { useInventoryDetails } from '@/composables/query/useInventoryDetails'

const {
  formRef,
  formData,
  handleSubmit,
  asignForm: assignForm,
  rules,
  observaciones,
} = useForm(
  {
    observaciones: null,
  },
  saveObservations,
)

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()
// const { inputDate: inventoryDate, today, formatDate } = useDateInput(fechaInventario)

// const {
//   inventoryList,
//   isPending,
//   createInventoryAsync,
//   deleteInventoryAsync,
//   updateInventoryAsync,
// } = useInventory()
const { getOpenInventoryList, createInventoryAsync, closeInventoryAsync } = useInventory()
const { category: categoryList, isPending } = useCategory()
const { data: openInventoryList } = getOpenInventoryList()
const { updateObservationsAsync } = useInventoryDetails()
// const { data: employees } = useEmployeesByRol(ROLES.ASISTENTE)

const categoryIventory = computed(() => {
  if (!openInventoryList.value || !categoryList.value) return undefined

  return categoryList.value.map((item) => {
    return {
      category: item,
      state: openInventoryList.value.some((inventory) => inventory.categoria.id === item.id),
    }
  })
})

const selectedCategory = shallowRef(null)
const confirmDialog = shallowRef(false)
const confirmCloseInventoryDialog = shallowRef(false)
// const inventoryFormDialog = shallowRef(false)
// const inventoryDeleteDialog = shallowRef(false)
const inventoryDetailsDialog = shallowRef(false)
const inventoryObservationsDialog = shallowRef(false)
const selectedDetail = shallowRef(null)
// const isEditing = computed(() => !!selectedInventory.value)
// const iventoryFormDialogTitle = computed(() =>
//   isEditing.value ? 'Editar Inventario' : 'Crear Inventario',
// )

const selectedInventory = computed(() => {
  if (!openInventoryList.value) return null

  return openInventoryList.value.find((item) => item.categoria.id === selectedCategory.value.id)
})

const headers = [
  { title: 'Categoria', key: 'category.nombre' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

function handleSwitchInventoryState(categoryInventory) {
  selectedCategory.value = categoryInventory.category
  console.log('click')

  if (categoryInventory.state) inventoryDetailsDialog.value = true
  else confirmDialog.value = true
}

async function openInventory() {
  try {
    await createInventoryAsync({
      categoria: {
        id: selectedCategory.value.id,
      },
    })
    confirmDialog.value = false
    showSuccessSnackbar('Inventario abierto')
  } catch (error) {
    console.log(error)
    showErrorSnackbar('Error al abrir inventario')
  }
}

function openInventoryObservationsDialog(detail) {
  selectedDetail.value = detail
  assignForm({ observaciones: detail.observaciones })
  inventoryObservationsDialog.value = true
}

async function saveObservations() {
  try {
    await updateObservationsAsync({ id: selectedDetail.value.id, ...formData.value })

    inventoryObservationsDialog.value = false
    showSuccessSnackbar('Observaciones guardadas')
  } catch (error) {
    console.log(error)
    showErrorSnackbar('Error al guardar observaciones')
  }
}

async function closeInventory() {
  try {
    await closeInventoryAsync(selectedInventory.value.id)

    showSuccessSnackbar('Inventario cerrado')
    confirmCloseInventoryDialog.value = false
    inventoryDetailsDialog.value = false
  } catch (error) {
    console.log(error)
    showErrorSnackbar('Error al cerrar inventario')
  }
}

// watch(inventoryFormDialog, (value) => {
//   if (!value) {
//     resetForm()
//     selectedInventory.value = null
//   }
// })

// watch(inventoryDeleteDialog, (value) => {
//   if (!value) {
//     selectedInventory.value = null
//   }
// })

// watch(inventoryDetailsDialog, (value) => {
//   if (!value) {
//     selectedInventory.value = null
//   }
// })

// function openInventoryDetailsDialog(inventory) {
//   selectedInventory.value = inventory

//   inventoryDetailsDialog.value = true
// }

// function openEditFormDialog(inventory) {
//   selectedInventory.value = inventory

//   assignForm({
//     fechaInventario: inventory.fechaInventario,
//     asistenteAlmacen: {
//       id: inventory.asistenteAlmacen.id,
//     },
//     categoria: {
//       id: inventory.categoria.id,
//     },
//   })

//   inventoryFormDialog.value = true
// }

// function openDeleteDialog(inventory) {
//   selectedInventory.value = inventory

//   inventoryDeleteDialog.value = true
// }

// async function deleteInventory() {
//   try {
//     await deleteInventoryAsync(selectedInventory.value.id)

//     inventoryDeleteDialog.value = false
//     showSuccessSnackbar('Inventario eliminado')
//   } catch (e) {
//     console.log(e)
//     showErrorSnackbar('Error al eliminar inventario')
//   }
// }

// async function createOrEditInventory() {
//   try {
//     if (isEditing.value) {
//       await updateInventoryAsync({ ...formData.value, id: selectedInventory.value.id })
//       showSuccessSnackbar('Inventario actualizado')
//     } else {
//       await createInventoryAsync(formData.value)
//       showSuccessSnackbar('Inventario creado')
//     }
//     inventoryFormDialog.value = false
//   } catch (e) {
//     console.log(e)
//     showErrorSnackbar('Error al crear inventario')
//   }
// }
</script>
