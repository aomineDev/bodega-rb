<script setup>
import { ref } from 'vue'
import { VBtn, VIcon, VTooltip } from 'vuetify/components'

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
})

defineEmits(['action'])
const open = ref(false)
</script>

<template>
  <div class="fab-menu">
    <transition-group name="fab-slide" tag="div">
      <template v-if="open">
        <div v-for="(action, index) in actions" :key="action.type" class="fab-action"
          :style="{ bottom: `${70 + index * 60}px` }">
          <v-tooltip location="left">
            <template #activator="{ props: tooltipProps }">
              <v-btn v-bind="tooltipProps" :color="action.color" icon elevation="3"
                @click="$emit('action', action.type)">
                <v-icon>{{ action.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ action.label }}</span>
          </v-tooltip>
        </div>
      </template>
    </transition-group>

    <!-- Botón principal -->
    <v-btn color="primary" icon elevation="4" @click="open = !open">
      <v-icon>{{ open ? 'mdi-close' : 'mdi-cog' }}</v-icon>
    </v-btn>
  </div>
</template>

<style scoped>
.fab-menu {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1100;
}

.fab-action {
  position: absolute;
  right: 0;
  transition: all 0.25s ease;
}

.fab-slide-enter-active,
.fab-slide-leave-active {
  transition: all 0.25s ease;
}

.fab-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fab-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
