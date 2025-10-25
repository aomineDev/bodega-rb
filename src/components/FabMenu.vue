<script setup>
import { ref } from 'vue'

defineProps({
  actions: {
    type: Array,
    default: () => [
      { type: 'filter', icon: 'mdi-filter', label: 'Filtrar', color: 'secondary' },
      { type: 'add', icon: 'mdi-plus', label: 'Agregar', color: 'primary' },
    ],
  },
  color: {
    type: String,
    default: 'primary',
  },
  direction: {
    type: String,
    default: 'up',
  },
})

defineEmits(['action'])
const open = ref(false)
</script>

<template>
  <div class="fab-fixed">
    <v-speed-dial v-model="open" :location="`bottom center`" :direction="direction">
      <template #activator="{ props: activatorProps }">
        <v-fab v-bind="activatorProps" :color="color" icon elevation="2">
          <v-icon size="large">{{ open ? 'mdi-close' : 'mdi-cog' }}</v-icon>
        </v-fab>
      </template>

      <!-- Botones secundarios -->
      <template v-for="action in actions" :key="action.type">
        <v-tooltip location="left">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="tooltipProps"
              :color="action.color"
              icon
              elevation="2"
              @click="$emit('action', action.type)"
            >
              <v-icon>{{ action.icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ action.label }}</span>
        </v-tooltip>
      </template>
    </v-speed-dial>
  </div>
</template>

<style scoped>
.fab-fixed {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}
</style>
