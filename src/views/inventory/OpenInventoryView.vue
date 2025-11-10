<template>
  <h1>Inventarios Abiertos</h1>
  <v-data-table :headers="headers" :items="inventoryList" hide-default-footer>
    <template #item.actions="{ item }">
      <v-btn
        icon="mdi-clipboard-edit-outline"
        variant="text"
        color="primary"
        @click="openConfirmTakeIventoryDialog(item)"
      ></v-btn>
    </template>
  </v-data-table>

  <alert-dialog
    v-model="confirmTakeInventoryDialog"
    title="Tomar Inventario"
    prepend-icon="mdi-clipboard-edit-outline"
    @action="takeInventory"
  >
    ¿Está seguro de tomar el inventario de
    <strong>{{ selectedIventory.categoria.nombre }}</strong
    >? <br />
  </alert-dialog>
</template>

<script setup>
import { useInventory } from '@/composables/query/useInventory'
import { useAuthStore } from '@/stores/auth'
import { useSnackbar } from '@/stores/snackbar'
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import AlertDialog from '@/components/AlertDialog.vue'

const { getOpenInventoryList, addAssistantAsync } = useInventory()
const { data: inventoryList } = getOpenInventoryList()
const { showErrorSnackbar } = useSnackbar()
const router = useRouter()
const { user: asistente } = useAuthStore()
const confirmTakeInventoryDialog = shallowRef(false)
const selectedIventory = shallowRef(null)

const headers = [
  { title: 'Categoria', key: 'categoria.nombre' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

function openConfirmTakeIventoryDialog(inventory) {
  selectedIventory.value = inventory

  confirmTakeInventoryDialog.value = true
}

async function takeInventory() {
  try {
    const isAssistantExists = selectedIventory.value.asistenteAlmacenList.some(
      (item) => item.id === asistente.id,
    )

    if (!isAssistantExists)
      await addAssistantAsync({ id: selectedIventory.value.id, asistente: { id: asistente.id } })

    router.push({ name: 'take-inventory', params: { id: selectedIventory.value.id } })
  } catch (error) {
    console.log(error)
    showErrorSnackbar('Error al tomar inventario')
  }
}
</script>
