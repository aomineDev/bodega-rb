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
      <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard" value="dashboard" active-color="primary"
        to="/home"></v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>Caja</v-list-subheader>

      <v-list-item v-for="item in cajaitems" :key="item.value" :title="item.title" :prepend-icon="item.icon"
        :value="item.value" :to="item.to" color="primary"></v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>Inventario</v-list-subheader>

      <v-list-item v-for="item in inventarioItems" :key="item.value" :title="item.title" :prepend-icon="item.icon"
        :value="item.value" :to="item.to" active-color="primary"></v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>Almacen</v-list-subheader>

      <v-list-item title="Ingreso de productos" prepend-icon="mdi-package-variant-plus" value="ingreso"
        active-color="primary" to="/managment/products-entry"></v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>Gestion</v-list-subheader>

      <v-list-item v-for="item in gestionItems" :key="item.value" :title="item.title" :prepend-icon="item.icon"
        :value="item.value" :to="item.to" active-color="primary"></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider></v-divider>

      <v-menu location="end">
        <template v-slot:activator="{ props }">
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

    <v-app-bar-title>
      <v-breadcrumbs :items="['Dashboard', 'Home']">
        <template #divider>
          <v-icon color="grey-lighten-1">mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-app-bar-title>

    <template #append>
      <v-btn icon="mdi-bell"></v-btn>

      <v-btn icon="mdi-magnify"></v-btn>

      <v-btn icon="mdi-dots-vertical"></v-btn>
    </template>
  </v-app-bar>

  <v-main>
    <v-container>
      <RouterView />
    </v-container>
  </v-main>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import router from '@/router'
import { useDisplay } from 'vuetify'

const { setUser } = useUserStore()
const { mobile } = useDisplay()
const drawer = ref(true)
const rail = ref(false)
// const userMenu = ref(false)

const cajaitems = [
  { title: 'Ventas', icon: 'mdi-view-dashboard', value: 'dashboard', to: '/path' },
  { title: 'Clientes', icon: 'mdi-account', value: 'clientes', to: '/about' },
  { title: 'Boletas / Facturas', icon: 'mdi-cog', value: 'boletas', to: '/path' },
]
const inventarioItems = [
  { title: 'Tima de inventario', icon: 'mdi-account', value: 'inventario', to: '/path' },
  { title: 'Auditoria', icon: 'mdi-account', value: 'inventario', to: '/path' },
]

const gestionItems = [
  { title: 'Proveedores', icon: 'mdi-truck-outline', value: 'proveedores', to: '/managment/provider' },
  { title: 'Empleados', icon: 'mdi-account-group ', value: 'empleados', to: '/managment/employee' },
  { title: 'Productos', icon: 'mdi-package-variant-closed', value: 'productos', to: '/managment/product' },
  { title: 'Categorias', icon: 'mdi-account', value: 'categorias', to: '/path' },
]

const logout = () => {
  setUser(null)
  router.push('/login')
}
</script>
