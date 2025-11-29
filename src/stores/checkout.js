import { defineStore } from 'pinia'
import { checkoutService } from '@/services/api/checkoutService'

export const useCajaStore = defineStore('caja', {
  state: () => ({
    cajaAbierta: null,
    loading: false,
  }),

  actions: {
    async fetchCajaAbierta() {
      this.loading = true

      try {
        this.cajaAbierta = await checkoutService.getCajaAbierta()
      } finally {
        this.loading = false
      }
    },

    setCajaAbierta(caja) {
      this.cajaAbierta = caja
    },
  },
})
