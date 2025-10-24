export function useValidation() {
  const rules = {
    required: (v) => !!v || 'Campo obligatorio',
    email: (v) => /.+@.+\..+/.test(v) || 'Email inválido',
    min6: (v) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
    dni: (v) => /^\d{8}$/.test(v) || 'DNI inválido',
    phone: (v) => /^\d{9}$/.test(v) || 'Teléfono inválido',
  }

  /**
   * @param {Ref} formRef
   * @param {Ref} dataRef
   */
  const resetForm = (formRef, dataRef) => {
    if (dataRef && dataRef.value) {
      Object.keys(dataRef.value).forEach((key) => {
        dataRef.value[key] = ''
      })
    }
    if (formRef && formRef.value) {
      formRef.value.resetValidation()
    }
  }

  return { rules, resetForm }
}
