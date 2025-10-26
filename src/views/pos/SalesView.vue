<script setup>

import ActionMenu from '@/components/ActionMenu.vue';
import { ref } from 'vue';

const headers = [
  { title: 'Nombre', key: 'name' },
  { title: 'Especie', key: 'species' },
  { title: 'Dieta', key: 'diet' },
  { title: 'Hábitat', key: 'habitat' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const items = [
  {
    name: 'African Elephant',
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
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
]

const producto = ref([
  {
    id: 1,
    codigoBarra: '1234567890123',
    nombre: 'Leche gloria',
    descripcion: 'Leche de toro',
    precioUnitario: 8.50,
    precioPromocion: 6.50,
    inicioPromocion: '2025-10-20',
    finPromocion: '2025-10-31',
    stockActual: 85,
    unidadMedida: 'unidad',
    imagen: '/milk.PNG',
    categoria: 'Conservas',
    proveedor: 'Alicorp'
  },
  {
    id: 2,
    codigoBarra: '9876543210987',
    nombre: 'Atun',
    descripcion: 'Atun en aceite',
    precioUnitario: 7.50,
    precioPromocion: 3.50,
    inicioPromocion: '2025-10-20',
    finPromocion: '2025-10-31',
    stockActual: 20,
    unidadMedida: 'unidad',
    imagen: '/atun.jpg',
    categoria: 'Conservas',
    proveedor: 'Alicorp'
  }, {
    id: 3,
    codigoBarra: '9876543210987',
    nombre: 'Galletas integrales',
    descripcion: 'Galletas integrales de trigo',
    precioUnitario: 5.50,
    precioPromocion: 3.50,
    inicioPromocion: '2025-10-20',
    finPromocion: '2025-10-31',
    stockActual: 5,
    unidadMedida: 'unidad',
    imagen: '/galleta.PNG',
    categoria: 'Conservas',
    proveedor: 'Alicorp'
  }
])
</script>

<template>
  <h1>Ventas</h1>
  <v-row>
    <v-col cols="12" md="9">
      <v-row>
        <v-col v-for="(item, index) in producto" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :elevation="isHovering ? 4 : 1"
              :class="['transition-fast', 'd-flex', 'flex-column', 'align-center']" rounded="xl">
              <!-- Imagen -->
              <v-img height="220" :src="item.imagen" cover
                :gradient="isHovering ? 'to top, rgba(0,0,0,.4), rgba(0,0,0,0)' : undefined" class="transition-slow">
                <template #placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary" />
                  </v-row>
                </template>
              </v-img>

              <!-- Separador -->
              <v-divider :thickness="2" />

              <!-- Título -->
              <v-card-title class="text-h6 font-weight-medium text-center transition-fast"
                :class="{ 'text-primary': isHovering }">
                {{ item.nombre }}
              </v-card-title>

              <!-- Botón -->
              <v-card-actions class="justify-center pb-4">
                <v-btn color="primary" variant="flat" prepend-icon="mdi-cart-plus" @click="agregar(item)"
                  :elevation="isHovering ? 4 : 1" class="transition-fast">
                  Agregar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" md="3">
      <v-data-table :headers="headers" :items="items">
        <template #[`item.actions`]="{ item }">
          <action-menu @action="(type) => handleAction(type, item)" />
        </template>
      </v-data-table>
    </v-col>
  </v-row>

</template>

<style scoped></style>
