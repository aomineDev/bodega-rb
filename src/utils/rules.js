export const rules = {
  // Validacion general
  required: (v) => !!v || 'Campo obligatorio',
  text: (v) => /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,}$/.test(v) || 'Informacion inválida',
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

  distinct:
    (arr, key, currentId = null) =>
    (v) => {
      if (!v) return true
      return !arr.some((e) => e[key] === v && e.id !== currentId) || 'Campo ya existe'
    },
}
