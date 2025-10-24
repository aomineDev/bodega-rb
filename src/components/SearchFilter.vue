<script setup>
defineProps({
  tipoCliente: String,
  search: String,
})

defineEmits(['update:tipoCliente', 'update:search'])
</script>

<template>
  <v-col cols="12" md="6">
    <v-text-field :model-value="search" @update:model-value="$emit('update:search', $event)" label="Buscar cliente"
      prepend-inner-icon="mdi-magnify" variant="underlined" hide-details />
  </v-col>

  <v-col cols="12" md="6" lg="4">
    <v-select :model-value="tipoCliente" @update:model-value="$emit('update:tipoCliente', $event)"
      :items="['Natural', 'Jurídico']" label="Tipo de cliente" variant="underlined" hide-details />
  </v-col>
</template>
