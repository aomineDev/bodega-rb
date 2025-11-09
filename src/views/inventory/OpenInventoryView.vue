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

  <v-dialog v-model="confirmTakeInventoryDialog" max-width="500">
    <v-card title="Tomar Inventario">
      <v-card-text class="text-center text-body-2">
        <div>
          <v-icon size="100" color="primary" icon="mdi-alert-circle-outline" class="mb-4"></v-icon>
        </div>
        ¿Está seguro de tomar el inventario de
        <strong>{{ selectedIventory.categoria.nombre }}</strong
        >? <br />
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cerrar" @click="confirmTakeInventoryDialog = false"></v-btn>
        <v-btn
          text="Confirmar"
          color="primary"
          :to="{ name: 'take-inventory', params: { id: selectedIventory.id } }"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useInventory } from '@/composables/query/useInventory'
import { shallowRef, toRaw } from 'vue'

const { getOpenInventoryList } = useInventory()
const { data: inventoryList } = getOpenInventoryList()

const confirmTakeInventoryDialog = shallowRef(false)
const selectedIventory = shallowRef(null)

const headers = [
  { title: 'Categoria', key: 'categoria.nombre' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

function openConfirmTakeIventoryDialog(inventory) {
  console.log(inventory.id)
  selectedIventory.value = toRaw(inventory)

  confirmTakeInventoryDialog.value = true
}
</script>
