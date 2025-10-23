<script setup>
defineProps({
  actions: {
    type: Array,
    default: () => [
      { label: 'Ver detalles', value: 'view', icon: 'mdi-eye' },
      { label: 'Editar', value: 'edit', icon: 'mdi-pencil' },
      { label: 'Eliminar', value: 'delete', icon: 'mdi-delete' },
    ],
  },
})
defineEmits(['action'])
</script>

<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text"></v-btn>
    </template>

    <v-list elevation="2">
      <v-list-item v-for="action in actions" :key="action.value" @click="$emit('action', action.value)"
        class="cursor-pointer">
        <template #prepend>
          <v-icon>{{ action.icon }}</v-icon>
        </template>

        <template #title>
          {{ action.label }}
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
