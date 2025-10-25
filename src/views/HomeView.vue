<script setup>
import { useSnackbar } from '@/stores/snackbar'
import { ref } from 'vue'

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()

import { useForm } from '@/composables/useForm'

const { formRef, rules, handleSubmit, username, state } = useForm({
  username: '',
  state: null,
})

const handleLogin = () => {
  alert(username.value + ' ' + state.value)


}



const dialog = ref(false)
</script>

<template>
  <h1>Home</h1>
  <v-btn @click="showSuccessSnackbar('Snackbar')">Success Snackbar</v-btn>
  <v-btn @click="showErrorSnackbar('Snackbar')">Error Snackbar</v-btn>
  <h1>{{ username }}</h1>
  <v-form ref="formRef">
    <v-text-field label="Label" v-model="username" :rules="[rules.required]"></v-text-field>
    <v-select label="Estado" :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
      v-model="state" :rules="[rules.required]"></v-select>
    <v-btn color="success" @click="handleSubmit(handleLogin)">login</v-btn>
  </v-form>

  <v-btn @click="dialog = true"> Open Dialog </v-btn>

  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="400" prepend-icon="mdi-update"
      text="Your application will relaunch automatically after the update is complete." title="Update in progress">
      <v-text-field label="Label"></v-text-field>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
