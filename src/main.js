import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { VueQueryPlugin } from '@tanstack/vue-query'

import { vuetify } from '@/plugins/vuetify'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { roleDirective } from './directives/role'

const app = createApp(App)

app.use(createPinia())

const { initAuth } = useAuthStore()

initAuth()

app.use(router)
app.use(vuetify)
app.use(VueQueryPlugin)

app.directive('role', roleDirective)

app.mount('#app')
