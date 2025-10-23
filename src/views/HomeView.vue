<script setup>

import ActionMenu from '@/components/ActionMenu.vue';

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
  <v-data-table :items="items">
    <template #headers>
      <tr>
        <th>Nombre</th>
        <th>Especie</th>
        <th>Acciones</th>
      </tr>
    </template>

    <template #item="{ item }">
      <tr>
        <td>{{ item.name }}</td>
        <td>{{ item.species }}</td>
        <td>
          <ActionMenu @action="(type) => handleAction(type, item)" />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<style scoped></style>
