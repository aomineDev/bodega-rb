import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userRol = computed(() => user.value?.rol.nombre || '')

  function initAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setAuth({ user: JSON.parse(savedUser), token: savedToken })
    }
  }

  function setAuth(auth) {
    user.value = auth.user
    token.value = auth.token

    localStorage.setItem('token', auth.token)
    localStorage.setItem('user', JSON.stringify(auth.user))
  }

  function logout() {
    user.value = null
    token.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    router.push({ name: 'login' })
  }

  const hasRole = (role) => userRol.value === role

  const hasAnyRole = (roles) => roles.includes(userRol.value)

  return { user, token, userRol, isAuthenticated, initAuth, setAuth, logout, hasRole, hasAnyRole }
})
