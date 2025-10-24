<template>
  <v-container>
    <v-row class="align-center mb-2">
      <v-col cols="6">
        <h2 class="text-h5 font-weight-bold">Ingreso de Productos</h2>
      </v-col>
    </v-row>

    <v-row class="align-center mb-2 justify-space-between">
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-text-field
          v-model="search"
          label="Buscar ingreso..."
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          density="compact"
          hide-details
          class="w-100"
        />
      </v-col>

      <v-col cols="12" md="auto" class="d-flex align-center justify-end">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="h-100"
          style="min-height: 40px;"
          @click="dialogNuevo = true"
        >
          NUEVO INGRESO
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :items-per-page="5"
      class="elevation-1"
    >
      <template #[`item.estado`]="{ item }">
        <v-chip
          :color="item.estado === 'Pendiente' ? 'orange' : 'green'"
          variant="flat"
        >
          {{ item.estado }}
        </v-chip>
      </template>

      <template #[`item.actions`]="{ item }">
        <ActionMenu @action="(type) => handleAction(type, item)" />
      </template>
    </v-data-table>

    <ModalEliminar
      v-model="dialogEliminar"
      :titulo="`Eliminar ingreso #${selectedItem?.id || ''}`"
      :texto="`¿Deseas eliminar el ingreso de ${selectedItem?.proveedor || ''}?`"
      @confirmar="confirmarEliminar"
    />
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import ActionMenu from "@/components/ActionMenu.vue";

const search = ref("");
const dialogNuevo = ref(false);
const dialogEliminar = ref(false);
const selectedItem = ref(null);

const headers = [
  { title: "# Ingreso", key: "id", align: "start" },
  { title: "Proveedor", key: "proveedor" },
  { title: "Documento", key: "documento" },
  { title: "N° Documento", key: "nDocumento" },
  { title: "Fecha", key: "fecha" },
  { title: "Hora", key: "hora" },
  { title: "Total", key: "total" },
  { title: "Estado", key: "estado" },
  { title: "Acciones", key: "actions", sortable: false },
];

const items = ref([
  {
    id: 1,
    proveedor: "Distribuidora Norte",
    documento: "Factura",
    nDocumento: "F001-12345",
    fecha: "2025-10-23",
    hora: "10:30",
    total: "S/ 450.00",
    estado: "Pendiente",
  },
  {
    id: 2,
    proveedor: "Alimentos del Sur",
    documento: "Boleta",
    nDocumento: "B002-9876",
    fecha: "2025-10-22",
    hora: "09:45",
    total: "S/ 780.00",
    estado: "Aprobado",
  },
]);

const filteredItems = computed(() =>
  items.value.filter((i) =>
    i.proveedor.toLowerCase().includes(search.value.toLowerCase())
  )
);

function handleAction(type, item) {
  selectedItem.value = item;
  if (type === "view") console.log("Ver detalles", item);
  if (type === "edit") dialogNuevo.value = true;
  if (type === "delete") dialogEliminar.value = true;
}

function confirmarEliminar() {
  if (!selectedItem.value) return;
  items.value = items.value.filter((i) => i.id !== selectedItem.value.id);
  console.log("Eliminado:", selectedItem.value);
  selectedItem.value = null;
}
</script>
