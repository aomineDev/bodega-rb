<template>
  <v-dialog v-model="dialogVisible" max-width="400">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ titulo }}
      </v-card-title>
      <v-card-text>
        {{ texto }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Cancelar</v-btn>
        <v-btn color="red" @click="confirmarEliminar">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  titulo: {
    type: String,
    default: 'Eliminar registro'
  },
  texto: {
    type: String,
    default: '¿Estás seguro de eliminar este elemento?'
  }
})

const emit = defineEmits(['update:modelValue', 'confirmar'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function closeDialog() {
  emit('update:modelValue', false)
}

function confirmarEliminar() {
  emit('confirmar')
  emit('update:modelValue', false)
}
</script>
