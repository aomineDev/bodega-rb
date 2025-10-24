export function useValidation() {
  const rules = {
    required: (v) => !!v || 'Campo obligatorio',
    email: (v) => /.+@.+\..+/.test(v) || 'Email inválido',
    min6: (v) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
    dni: (v) => /^\d{8}$/.test(v) || 'DNI inválido',
    phone: (v) => /^\d{9}$/.test(v) || 'Teléfono inválido',
  }

  return { rules }
}
