<template>
  <!-- <v-layout> -->
  <v-navigation-drawer v-model="drawer" :rail="rail" @click="rail = false" :temporary="mobile" :permanent="!mobile">
    <template v-slot:prepend>
      <v-list-item title="Embutidos RB" class="pt-2 pb-2">
        <template v-slot:prepend>
          <v-avatar color="grey-darken-4">
            <v-icon color="white">mdi-store</v-icon>
          </v-avatar>
        </template>

        <template #append>
          <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>
      <v-divider></v-divider>
    </template>

    <v-list density="compact" nav>
      <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard" value="dashboard" color="primary"
        to="/home"></v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>Caja</v-list-subheader>

      <v-list-item v-for="item in cajaitems" :key="item.value" :title="item.title" :prepend-icon="item.icon"
        :value="item.value" :to="item.to" color="primary"></v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>Inventario</v-list-subheader>

      <v-list-item v-for="item in inventarioItems" :key="item.value" :title="item.title" :prepend-icon="item.icon"
        :value="item.value" :to="item.to" color="primary"></v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>Almacen</v-list-subheader>

      <v-list-item title="Ingreso de productos" prepend-icon="mdi-package-variant-plus" value="ingreso" color="primary"
        to="/managment/products-entry"></v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>Gestion</v-list-subheader>

      <v-list-item v-for="item in gestionItems" :key="item.value" :title="item.title" :prepend-icon="item.icon"
        :value="item.value" :to="item.to" color="primary"></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider></v-divider>

      <v-menu location="end">
        <template #activator="{ props }">
          <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" subtitle="admin" title="omar"
            class="pt-2 pb-2" v-bind="props" append-icon="mdi-chevron-right">
          </v-list-item>
        </template>

        <v-list min-width="200" density="compact" class="rounded-lg" elevation="2">
          <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" subtitle="admin" title="omar"
            class="pt-2 pb-2">
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item title="Perfil" prepend-icon="mdi-account" class="primary"
            @click="console.log('click')"></v-list-item>
          <v-list-item title="Log out" prepend-icon="mdi-logout" class="text-red" @click="logout"></v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-navigation-drawer>

  <v-app-bar elevation="1">
    <template #prepend v-if="mobile">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" icon="mdi-collage"></v-app-bar-nav-icon>
    </template>

    <v-breadcrumbs :items="breandcrumbs">
      <template #divider>
        <v-icon color="grey-lighten-1">mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <template #append>
      <v-btn icon="mdi-bell"></v-btn>

      <v-btn icon="mdi-magnify"></v-btn>

      <v-btn icon="mdi-dots-vertical"></v-btn>
    </template>
  </v-app-bar>

  <v-main>
    <v-container>
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { capitalize } from '@/utils/capitalize'

const router = useRouter()
const { setUser } = useUserStore()
const { mobile } = useDisplay()
const drawer = ref(true)
const rail = ref(false)

const cajaitems = [
  { title: 'Ventas', icon: 'mdi-view-dashboard', value: 'ventas', to: '/caja/ventas' },
  { title: 'Clientes', icon: 'mdi-account', value: 'clientes', to: '/caja/clientes' },
  { title: 'Comprobantes', icon: 'mdi-cog', value: 'comprobantes', to: '/caja/comprobantes' },
]
const inventarioItems = [
  { title: 'Toma de inventario', icon: 'mdi-clipboard-list', value: 'toma-inventario', to: '/inventory/toma-inventario' },
  { title: 'Auditoría', icon: 'mdi-magnify', value: 'auditoria', to: '/inventory/auditoria' },
]

const gestionItems = [
  {
    title: 'Proveedores',
    icon: 'mdi-truck-outline',
    value: 'proveedores',
    to: '/gestion/proveedores',
  },
  { title: 'Empleados', icon: 'mdi-account-group ', value: 'empleados', to: '/gestion/empleados' },
  {
    title: 'Productos',
    icon: 'mdi-package-variant-closed',
    value: 'productos',
    to: '/gestion/productos',
  },
  { title: 'Categorias', icon: 'mdi-account', value: 'categorias', to: '/path' },
]

const route = useRoute()

const breandcrumbs = computed(() => [
  'Dashboard',
  ...route.path.split('/').slice(1).map(capitalize),
])

// se movera a auth service
const logout = () => {
  setUser(null)
  router.push('/login')
}
</script>
npm
