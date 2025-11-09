import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSnackbar = defineStore('snackbar', () => {
  const snackbar = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('green')
  const snackBarLocaltion = ref('bottom right')

  function showSuccessSnackbar(message, location) {
    showSnackbar(message, 'green', location)
  }

  function showErrorSnackbar(message, location) {
    showSnackbar(message, 'red', location)
  }

  function showWarningSnackbar(message, location) {
    showSnackbar(message, 'yellow', location)
  }

  function showSnackbar(message = '', color = 'green', location = 'bottom right') {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackBarLocaltion.value = location
    snackbar.value = true
  }

  function closeSnackbar() {
    snackbar.value = false
  }

  return {
    snackbar,
    snackbarMessage,
    snackbarColor,
    snackBarLocaltion,
    showSuccessSnackbar,
    showErrorSnackbar,
    showWarningSnackbar,
    closeSnackbar,
  }
})
