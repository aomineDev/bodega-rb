<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card :title :prepend-icon>
      <v-card-text class="text-center text-body-2">
        <div>
          <v-icon size="100" :color :icon class="mb-4"></v-icon>
        </div>
        <slot></slot>
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cerrar" @click="dialog = false"></v-btn>
        <v-btn :text="actionText" :color @click="onAction"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const { type } = defineProps({
  title: String,
  message: String,
  'prepend-icon': String,
  actionText: {
    type: String,
    default: 'Confirmar',
  },
  onAction: {
    type: Function,
    required: true,
  },
  type: {
    type: String,
    default: 'confirm',
    validator(value) {
      return ['confirm', 'error', 'warning', 'info', 'success', 'delete'].includes(value)
    },
  },
})

const color = computed(() => {
  if (type === 'confirm') return 'primary'
  if (type === 'error') return 'error'
  if (type === 'delete') return 'error'
  if (type === 'warning') return 'warning'
  if (type === 'info') return 'info'
  if (type === 'success') return 'success'

  return 'primary'
})

const icon = computed(() => {
  if (type === 'confirm') return 'mdi-help-circle-outline'
  if (type === 'error') return 'mdi-alert-octagon-outline'
  if (type === 'delete') return 'mdi-delete-alert-outline'
  if (type === 'warning') return 'mdi-alert-outline'
  if (type === 'info') return 'mdi-alert-circle-outline'
  if (type === 'success') return 'mdi-check-circle-outline'

  return 'mdi-alert-circle-outline'
})

const dialog = defineModel({ default: false })
</script>
