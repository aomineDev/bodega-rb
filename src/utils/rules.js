export const rules = {
  // Validacion general
  required: (v) => !!v || 'Campo obligatorio',
  text: (v) => /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,}$/.test(v) || 'Informacion inválida',
  email: (v) => /.+@.+\..+/.test(v) || 'Email inválido',
  min6: (v) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
  dni: (v) => /^\d{8}$/.test(v) || 'DNI inválido',
  ruc: (v) => /^\d{11}$/.test(v) || 'RUC inválido',
  phone: (v) => /^\d{9}$/.test(v) || 'Teléfono inválido',

  //almacen validacion
  cantidad: (v) => (!!v && v > 0) || 'Debe ser mayor que 0',
  precio: (v) => (!!v && v > 0) || 'Precio inválido',
  fecha: (v) => !!v || 'Seleccione una fecha',
  lote: (v) => (!!v && v.trim().length > 0) || 'Lote obligatorio',
  categoria: (v) => !!v || 'Seleccione una categoría',
}
