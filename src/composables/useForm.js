import { ref, toRefs } from 'vue'
import { rules } from '@/utils/rules'

export const useForm = (initialValue, onSubmit, options = { resetForm: true }) => {
  const formData = ref(structuredClone(initialValue))
  const formRef = ref(null)

  const resetForm = () => {
    if (!existsFormRef()) return

    const initialValueCopy = structuredClone(initialValue)

    Object.keys(formData.value).forEach((k) => {
      if (!(k in initialValueCopy)) delete formData.value[k]
      else formData.value[k] = initialValueCopy[k]
    })

    formRef.value.resetValidation()
  }

  const isValid = async () => {
    const { valid } = await formRef.value.validate()

    return valid
  }

  const asignForm = (data) => {
    Object.assign(formData.value, { ...data })
  }

  const handleSubmit = async (callback) => {
    if (!existsFormRef()) return

    const valid = await isValid()

    if (!valid) return

    if (onSubmit) await onSubmit()
    else await callback()

    if (options.resetForm) resetForm()
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
