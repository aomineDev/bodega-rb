<script setup>
import { useSnackbar } from '@/stores/snackbar'

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()
</script>

<template>
  <h1>Home</h1>
  <v-btn @click="showSuccessSnackbar('Snackbar')">Success Snackbar</v-btn>
  <v-btn @click="showErrorSnackbar('Snackbar')">Error Snackbar</v-btn>
</template>

<style scoped></style>
