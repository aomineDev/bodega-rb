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
      const montoNum = Number(monto)
      if (tipo === 'INGRESO') this.cajaAbierta.saldoActual += montoNum
      else if (tipo === 'RETIRO') this.cajaAbierta.saldoActual -= montoNum
    },
  },
})
