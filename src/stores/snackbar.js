import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSnackbar = defineStore('snackbar', () => {
  const snackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('green')

  function showSuccessSnackbar(message = '') {
    showSnackbar(message, 'green')
  }

  function showErrorSnackbar(message = '') {
    showSnackbar(message, 'red')
  }

  function showWarningSnackbar(message = '') {
    showSnackbar(message, 'yellow')
  }

  function showSnackbar(message, color) {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
  }

  function closeSnackbar() {
    snackbar.value = false
  }

  return {
    snackbar,
    snackbarMessage,
    snackbarColor,
    showSuccessSnackbar,
    showErrorSnackbar,
    showWarningSnackbar,
    closeSnackbar,
  }
})
