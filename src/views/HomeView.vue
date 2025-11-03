<script setup>
// import { ref } from 'vue'
// import { usePruebas } from '@/composables/query/usePrueba'

// const id = ref(null)
// const { pruebas, isPending, isError, error, getQuery } = usePruebas()

// const { data: prueba } = getQuery(id)
</script>

<template>
  <h1>Home</h1>
  <!-- <div v-if="isPending">
    <h1>Loading...</h1>
  </div>
  <div v-else-if="isError">
    <h1>Error: {{ error.message }}</h1>
  </div>
  <div v-else>
    <h1>Pruebas</h1>
    <v-select
      label="Pruebas"
      :items="pruebas"
      v-model="id"
      item-title="name"
      item-value="id"
      variant="solo"
    ></v-select>

    <div v-if="prueba">
      <h1>{{ prueba.name }}</h1>
    </div>
  </div> -->
</template>
