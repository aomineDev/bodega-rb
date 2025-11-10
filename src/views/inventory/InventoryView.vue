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

  <alert-dialog
    v-model="confirmDialog"
    title="Abrir Inventario"
    prepend-icon="mdi-clipboard-outline"
    @action="openInventory"
  >
    ¿Está seguro de abrir el inventario de <strong>{{ selectedCategory.nombre }}</strong
    >? <br />
  </alert-dialog>

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
        <v-form ref="formRef" @submit.prevent="handleSubmit">
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

  <alert-dialog
    v-model="confirmCloseInventoryDialog"
    title="Cerrar Inventario"
    prepend-icon="mdi-clipboard-outline"
    @action="closeInventory"
  >
    ¿Está seguro de cerrar el inventario de <strong>{{ selectedCategory.nombre }}</strong
    >? <br />
    <strong>El stock de los productos sera remplazado por el stock del inventario.</strong>
  </alert-dialog>
</template>

<script setup>
import { useCategory } from '@/composables/query/useCategory'
import { useInventory } from '@/composables/query/useInventory'
import { useForm } from '@/composables/useForm'
import { useSnackbar } from '@/stores/snackbar'
import { computed, shallowRef } from 'vue'
import { useInventoryDetails } from '@/composables/query/useInventoryDetails'
import AlertDialog from '@/components/AlertDialog.vue'

const headers = [
  { title: 'Categoria', key: 'category.nombre' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

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
const { getOpenInventoryList, createInventoryAsync, closeInventoryAsync } = useInventory()
const { category: categoryList, isPending } = useCategory()
const { updateObservationsAsync } = useInventoryDetails()

const { data: openInventoryList } = getOpenInventoryList()

const selectedCategory = shallowRef(null)
const confirmDialog = shallowRef(false)
const confirmCloseInventoryDialog = shallowRef(false)
const inventoryDetailsDialog = shallowRef(false)
const inventoryObservationsDialog = shallowRef(false)
const selectedDetail = shallowRef(null)

const categoryIventory = computed(() => {
  if (!openInventoryList.value || !categoryList.value) return undefined

  return categoryList.value.map((item) => {
    return {
      category: item,
      state: openInventoryList.value.some((inventory) => inventory.categoria.id === item.id),
    }
  })
})

const selectedInventory = computed(() => {
  if (!openInventoryList.value) return null

  return openInventoryList.value.find((item) => item.categoria.id === selectedCategory.value.id)
})

function handleSwitchInventoryState(categoryInventory) {
  selectedCategory.value = categoryInventory.category

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
</script>
