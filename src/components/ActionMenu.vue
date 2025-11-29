<script setup>
defineProps({
  onView: Function,
  onEdit: Function,
  onDelete: Function,
  onMovement: Function,
})
</script>

<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text"></v-btn>
    </template>

    <v-list elevation="2">
      <v-list-item v-if="onView" @click="onView" class="cursor-pointer" prepend-icon="mdi-eye" title="Ver detalles">
      </v-list-item>
      <v-list-item v-if="onEdit" @click="onEdit" class="cursor-pointer" prepend-icon="mdi-pencil" title="Editar">
      </v-list-item>
      <v-list-item v-if="onMovement" @click="onMovement" class="cursor-pointer" prepend-icon="mdi-swap-horizontal-bold"
        title="Movimientos">
      </v-list-item>
      <v-list-item v-if="onDelete" @click="onDelete" class="cursor-pointer text-red" prepend-icon="mdi-delete"
        title="Eliminar">
      </v-list-item>
    </v-list>
  </v-menu>
</template>
