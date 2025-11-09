import { useAuthStore } from '@/stores/auth'

export const roleDirective = {
  mounted: (el, binding) => {
    const { hasAnyRole } = useAuthStore()

    const requiredRoles = Array.isArray(binding.value) ? binding.value : [binding.value]

    if (!hasAnyRole(requiredRoles)) el.parentNode.removeChild(el)
  },
}
