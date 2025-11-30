import { defineStore } from 'pinia'
import { checkoutService } from '@/services/api/checkoutService'

export const useCajaStore = defineStore('caja', {
  state: () => ({
    cajaAbierta: null,
    loading: false,
  }),

  getters: {
    saldoActual: (state) => state.cajaAbierta?.saldoActual ?? 0,
  },

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

    actualizarSaldo(monto, tipo) {
      if (!this.cajaAbierta) return

      const cantidad = Number(monto)

      switch (tipo) {
        case 'VENTA':
        case 'INGRESO':
          this.cajaAbierta.saldoActual += cantidad
          break

        case 'VUELTO':
        case 'RETIRO':
          this.cajaAbierta.saldoActual -= cantidad
          break
      }
    },
  },
})
