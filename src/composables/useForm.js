import { ref, toRefs } from 'vue'
import { rules } from '@/utils/rules'

export const useForm = (initialValue) => {
  const formData = ref(initialValue)
  const formRef = ref(null)

  const resetForm = () => {
    if (!existsFormRef()) return
    console.log(formData.value)

    // formData.value = null

    // formData.value = { ...initialValue }
    Object.keys(formData.value).forEach((k) => (formData.value[k] = null))
    // formRef.value.reset()
    console.log(formData.value)
    console.log(initialValue)
  }

  const isValid = async () => {
    return await formRef.value.validate()
  }

  const asignForm = (data) => {
    Object.assign(formData.value, { ...data })
    console.log(formData.value)
  }

  const handleSubmit = async (callback) => {
    if (!existsFormRef()) return

    const { valid } = await formRef.value.validate()

    if (!valid) return

    await callback()

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
