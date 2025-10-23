<script setup>
import { ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { RouterView } from 'vue-router'

const x = ref(0)

const { data, isPending, error } = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('https://pokeapi.co/api/v2/pokemon/mewtwo').then((r) => r.json()),
})

watch(data, () => {
  if (data) console.log(data.value)
})
</script>

<template>
  <h1>You did it! {{ x }}</h1>
  <v-btn color="primary"> Button </v-btn>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <div v-if="data">
    <p>{{ data.name }}</p>
    <img :src="data.sprites.front_default" alt="" />
  </div>
  <span v-else-if="error">error</span>
  <span v-else-if="isPending">Loading...</span>

  <RouterView />
</template>

<style scoped></style>
