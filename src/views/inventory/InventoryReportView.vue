<template>
  <h1>Reporte de Inventario</h1>

  <v-data-table :headers="headers" :items="inventoryList">
    <template #item.fechaInventario="{ value }">
      {{ adapter.format(value, 'fullDate') }}
    </template>

    <template #item.asistenteAlmacenList="{ value }">
      <ul>
        <li v-for="item in value" :key="item.id">{{ item.nombre }} {{ item.apellidoPaterno }}</li>
      </ul>
    </template>

    <template #item.actions="{ item }">
      <action-menu @view="openInventoryDetailsDialog(item)"></action-menu>
    </template>
  </v-data-table>

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
            </tr>
          </thead>
          <tbody>
            <tr v-for="detalle in selectedInventory?.inventarioDetalles" :key="detalle.id">
              <td>{{ detalle.producto.nombre }}</td>
              <td>{{ detalle.stockSistema }}</td>
              <td>{{ detalle.stockFisico }}</td>
              <td>{{ detalle.diferencia }}</td>
              <td>{{ detalle.observaciones }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text="Cerrar" @click="inventoryDetailsDialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useInventory } from '@/composables/query/useInventory'
import ActionMenu from '@/components/ActionMenu.vue'
import { shallowRef, watch } from 'vue'
import { useDate } from 'vuetify'

const adapter = useDate()
const { getCloseInventoryList } = useInventory()

const { data: inventoryList } = getCloseInventoryList()

const inventoryDetailsDialog = shallowRef(false)
const selectedInventory = shallowRef(null)

function openInventoryDetailsDialog(inventory) {
  selectedInventory.value = inventory
  inventoryDetailsDialog.value = true
}

watch(inventoryList, (value) => {
  console.log(value)
})

const headers = [
  { title: 'Categoria', key: 'categoria.nombre' },
  { title: 'Fecha', key: 'fechaInventario' },
  { title: 'Asistente de Almacen', key: 'asistenteAlmacenList' },
  { title: 'Acciones', key: 'actions', sortable: false },
]
</script>
