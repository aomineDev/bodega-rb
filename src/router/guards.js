import { useAuthStore } from '@/stores/auth'

export const authGuard = async (to) => {
  const { isAuthenticated, hasAnyRole } = useAuthStore()

  if (!isAuthenticated && to.name !== 'login') return { name: 'login' }
  else if (isAuthenticated && to.name === 'login') return { name: 'home' }

  if (isAuthenticated) {
    if (to.meta.roles && to.meta.roles.length > 0) {
      if (!hasAnyRole(to.meta.roles)) return { name: 'home' }
    }
  }
}
