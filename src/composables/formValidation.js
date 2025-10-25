export function useValidation() {
  const rules = {
    required: (v) => !!v || 'Campo obligatorio',
    email: (v) => /.+@.+\..+/.test(v) || 'Email inválido',
    min6: (v) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
    dni: (v) => /^\d{8}$/.test(v) || 'DNI inválido',
    phone: (v) => /^\d{9}$/.test(v) || 'Teléfono inválido',

    //almacen validacion
    cantidad: (v) => (!!v && v > 0) || 'Debe ser mayor que 0',
    precio: (v) => (!!v && v > 0) || 'Precio inválido',
    fecha: (v) => !!v || 'Seleccione una fecha',
    lote: (v) => !!v && v.trim().length > 0 || 'Lote obligatorio',
    categoria: (v) => !!v || 'Seleccione una categoría',
  }

  return { rules }
}
