import { ref, toRefs } from 'vue'
import { rules } from '@/utils/rules'

export const useForm = (initialValue, onSubmit) => {
  const formData = ref({ ...initialValue })
  const formRef = ref(null)

  const resetForm = () => {
    if (!existsFormRef()) return

    Object.keys(formData.value).forEach((k) => {
      if (!(k in initialValue)) delete formData.value[k]
      else formData.value[k] = null
    })

    formRef.value.resetValidation()
  }

  const isValid = async () => {
    const { valid } = await formRef.value.validate()

    return valid
  }

  const cleanFormData = () => {
    Object.keys(formData.value).forEach((key) => {
      if (formData.value[key] === '') formData.value[key] = null
    })
  }

  const asignForm = (data) => {
    Object.assign(formData.value, { ...data })
    console.log(formData.value)
  }

  const handleSubmit = async (callback) => {
    if (!existsFormRef()) return

    const valid = await isValid()

    if (!valid) return

    cleanFormData()

    if (onSubmit) await onSubmit()
    else await callback()

    resetForm()
  }

  const existsFormRef = () => {
    return formRef.value !== null
  }

  return {
    ...toRefs(formData.value),
    formData,
    formRef,
    isValid,
    resetForm,
    handleSubmit,
    rules,
    asignForm,
  }
}
