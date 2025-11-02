<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'

defineProps({
  search: String,
  filters: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['update:search', 'update:filter'])
</script>

<template>
  <v-row dense>
    <v-col cols="12" md="6">
      <v-text-field :model-value="search" @update:model-value="$emit('update:search', $event)" label="Buscar"
        prepend-inner-icon="mdi-magnify" variant="underlined" hide-details />
    </v-col>

    <!-- Campos dinámicos -->
    <template v-for="filter in filters" :key="filter.key">
      <v-col cols="12" md="6" lg="3">
        <!-- Buscador -->
        <v-select v-if="filter.type === 'select'" :model-value="filter.model"
          @update:model-value="$emit('update:filter', { key: filter.key, value: $event })" :items="filter.items"
          :label="filter.label" variant="underlined" :item-title="filter.itemTitle" :item-value="filter.itemValue"
          clearable hide-details />
        <!-- Date simple -->
        <v-date-input v-else-if="filter.type === 'date'" :model-value="filter.model"
          @update:model-value="$emit('update:filter', { key: filter.key, value: $event })" :label="filter.label"
          variant="underlined" hide-details />

        <!-- Date Range -->
        <v-date-input v-else-if="filter.type === 'range'" :model-value="filter.model"
          @update:model-value="$emit('update:filter', { key: filter.key, value: $event })" :label="filter.label"
          multiple="range" variant="underlined" clearable hide-details />

      </v-col>

    </template>
  </v-row>
</template>
