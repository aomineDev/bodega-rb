<template>
  <h1>Reporte de Inventario</h1>

  <template v-if="mdAndUp">
    <filter-inputs
      v-model:category="selectedCategory"
      v-model:dates="selectedDates"
    ></filter-inputs>
  </template>

  <v-data-table :headers="headers" :items="filteredInventoryList" :loading="isPending">
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

  <v-dialog v-model="filterDialog" max-width="500">
    <v-card title="filtros" prepend-icon="mdi-filter">
      <v-card-text>
        <filter-inputs
          v-model:category="selectedCategory"
          v-model:dates="selectedDates"
        ></filter-inputs>
      </v-card-text>
      <v-card-actions>
        <v-btn text="Cerrar" @click="filterDialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="position-fixed bottom-0 right-0 pa-4" v-if="!mdAndUp">
    <v-btn icon="mdi-filter-outline" color="primary" @click="filterDialog = true"></v-btn>
  </div>
</template>

<script setup>
import { useInventory } from '@/composables/query/useInventory'
import ActionMenu from '@/components/ActionMenu.vue'
import { computed, shallowRef } from 'vue'
import { useDate, useDisplay } from 'vuetify'

import FilterInputs from './components/FilterInputs.vue'

const adapter = useDate()
const { getCloseInventoryList } = useInventory()
const { data: inventoryList, isPending } = getCloseInventoryList()
const { mdAndUp } = useDisplay()

const inventoryDetailsDialog = shallowRef(false)
const selectedInventory = shallowRef(null)
const selectedCategory = shallowRef(null)
const selectedDates = shallowRef(null)
const filterDialog = shallowRef(false)

const filteredInventoryList = computed(() => {
  let preFilteredInventoryList = inventoryList.value

  if (selectedCategory.value)
    preFilteredInventoryList = preFilteredInventoryList.filter(
      (item) => item.categoria.id === selectedCategory.value,
    )

  if (selectedDates.value && selectedDates.value?.length > 0) {
    const formattedSelectedDates = selectedDates.value.map((date) => adapter.toISO(date))

    preFilteredInventoryList = preFilteredInventoryList.filter((item) => {
      return formattedSelectedDates.includes(item.fechaInventario)
    })
  }

  return preFilteredInventoryList
})

const headers = [
  { title: 'Categoria', key: 'categoria.nombre' },
  { title: 'Fecha', key: 'fechaInventario' },
  { title: 'Asistente de Almacen', key: 'asistenteAlmacenList' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

function openInventoryDetailsDialog(inventory) {
  selectedInventory.value = inventory
  inventoryDetailsDialog.value = true
}
</script>
