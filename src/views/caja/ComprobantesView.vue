<script setup>

import ActionMenu from '@/components/ActionMenu.vue';

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
</script>

<template>

  <v-data-table :headers="headers" :items="items">
    <template #[`item.actions`]="{ item }">
      <action-menu @action="(type) => handleAction(type, item)" />
    </template>
  </v-data-table>

</template>

<style scoped></style>
