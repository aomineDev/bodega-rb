export function useValidation() {
  const rules = {
    required: (v) => !!v || 'Campo obligatorio',
    text: (v) => /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,}$/.test(v) || 'Informacion inválida',
    email: (v) => /.+@.+\..+/.test(v) || 'Email inválido',
    min6: (v) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
    dni: (v) => /^\d{8}$/.test(v) || 'DNI inválido',
    ruc: (v) => /^\d{11}$/.test(v) || 'RUC inválido',
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
