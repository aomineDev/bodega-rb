<script setup>
import { useSnackbar } from '@/stores/snackbar'
import { ref, watch } from 'vue'
import ActionMenu from '@/components/ActionMenu.vue'

import { useForm } from '@/composables/useForm'
import { usePruebas } from '@/composables/query/usePrueba'

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()

const {
  pruebas,
  isPending,
  isError,
  error,
  createPruebaAsync,
  updatePruebaAsync,
  deletePruebaAsync,
} = usePruebas()

const { formData, formRef, rules, handleSubmit, name, asignForm, resetForm } = useForm({
  name: null,
})
const dialog = ref(false)
const editingPrueba = ref(null)

const handleLogin = async () => {
  try {
    if (editingPrueba.value) {
      await updatePruebaAsync({ ...formData.value, id: editingPrueba.value.id })
      showSuccessSnackbar('Prueba actualizada')
    } else {
      await createPruebaAsync(formData.value)
      showSuccessSnackbar('Prueba creada')
    }

    dialog.value = false
  } catch (error) {
    showErrorSnackbar('Error al crear la prueba')
    console.log(error)
  }
}

watch(dialog, (value) => {
  if (!value) {
    resetForm()
    editingPrueba.value = null
  }
})

const handleEdit = () => {
  editingPrueba.value = pruebas.value[0]
  asignForm(editingPrueba.value)
  dialog.value = true
}

const handleDelete = async () => {
  try {
    editingPrueba.value = pruebas.value[0]

    await deletePruebaAsync(editingPrueba.value.id)
    showSuccessSnackbar('Prueba eliminada')
  } catch (error) {
    showErrorSnackbar('Error al eliminar la prueba')
    console.log(error)
  }
}
</script>

<template>
  <div v-if="isPending">
    <h1>Loading...</h1>
  </div>
  <div v-else-if="isError">
    <h1>Error: {{ error.message }}</h1>
  </div>
  <div v-else>
    <h1>Pruebas</h1>
    <ul>
      <li v-for="prueba in pruebas" :key="prueba.id">
        {{ prueba.name }}
      </li>
    </ul>
  </div>

  <h1>Home</h1>
  <v-btn color="yellow" @click="test" text="test"></v-btn>
  <v-btn @click="showSuccessSnackbar('Snackbar')">Success Snackbar</v-btn>
  <v-btn @click="showErrorSnackbar('Snackbar')">Error Snackbar</v-btn>
  <action-menu @edit="handleEdit" @delete="handleDelete"></action-menu>

  <v-btn @click="dialog = true">Open Dialog</v-btn>

  <v-dialog v-model="dialog" width="auto">
    <v-card
      max-width="400"
      prepend-icon="mdi-update"
      text="Your application will relaunch automatically after the update is complete."
      title="Update in progress"
    >
      <v-form ref="formRef">
        <v-text-field label="Nombre" v-model="name" :rules="[rules.required]"></v-text-field>
      </v-form>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="handleSubmit(handleLogin)"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
