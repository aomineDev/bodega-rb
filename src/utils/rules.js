export const rules = {
  // Validacion general
  required: (v) => !!v || 'Campo obligatorio',
  text: (v) => {
    if (!v) return true
    return /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s.'-]{3,}$/.test(v) || 'Información inválida'
  },
  email: (v) => {
    if (!v) return true
    return /.+@.+\..+/.test(v) || 'Email inválido'
  },
  min6: (v) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
  dni: (v) => /^\d{8}$/.test(v) || 'DNI inválido',
  ruc: (v) => /^\d{11}$/.test(v) || 'RUC inválido',
  phone: (v) => {
    if (!v) return true
    return /^9\d{8}$/.test(v) || 'Teléfono inválido'
  },

  //almacen validacion
  cantidad: (v) => (!!v && v > 0) || 'Debe ser mayor que 0',
  precio: (v) => (!!v && v > 0) || 'Precio inválido',
  fecha: (v) => !!v || 'Seleccione una fecha',
  lote: (v) => (!!v && v.trim().length > 0) || 'Lote obligatorio',
  categoria: (v) => !!v || 'Seleccione una categoría',
  proveedor: (v) => !!v || 'Seleccione un proveedor',
  unidadMedida: (v) => !!v || 'Seleccione una unidad de medida',
  rol: (v) => !!v || 'Seleccione un rol',
  stock: (v) => (!!v && v >= 0) || 'Stock invalido',
  montoSuficiente: (total) => (v) => {
    if (v < total) return `El efectivo no cubre el total (S/ ${total})`
    return true
  },
  montoMaximo: (saldoActual) => (v) => {
    const montoNum = parseFloat(v) || 0
    if (montoNum > saldoActual) return `No se puede retirar más de S/ ${saldoActual}`
    return true
  },
  saldoDisponible: (saldoActual) => (vuelto) => {
    const vueltoNum = parseFloat(vuelto) || 0
    if (vueltoNum > saldoActual) {
      return `No hay suficiente saldo en caja para dar S/ ${vueltoNum.toFixed(2)} de vuelto`
    }
    return true
  },

  //empleado
  distinct:
    (arr, key, currentId = null) =>
    (v) => {
      if (!v) return true
      return !arr.some((e) => e[key] === v && e.id !== currentId) || 'Campo ya existe'
    },
}
