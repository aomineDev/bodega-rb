<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      @click="rail = false"
      :temporary="mobile"
      :permanent="!mobile"
    >
      <v-list>
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" :title="user">
          <template #append>
            <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-list density="compact" nav>
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard"
          value="dashboard"
          active-color="primary"
          to="/home"
        ></v-list-item>

        <v-list-item
          v-for="item in cajaitems"
          :key="item.value"
          :title="item.title"
          :prepend-icon="item.icon"
          :value="item.value"
          :to="item.to"
          color="primary"
        ></v-list-item>

        <v-divider></v-divider>
        <v-list-subheader>Inventario</v-list-subheader>

        <v-list-item
          v-for="item in inventarioItems"
          :key="item.value"
          :title="item.title"
          :prepend-icon="item.icon"
          :value="item.value"
          :to="item.to"
          active-color="primary"
        ></v-list-item>

        <v-divider></v-divider>
        <v-list-subheader>Almacen</v-list-subheader>

        <v-list-item
          title="Ingreso de productos"
          prepend-icon="mdi-view-dashboard"
          value="ingrteso"
          active-color="primary"
          to="/path"
        ></v-list-item>

        <v-divider></v-divider>
        <v-list-subheader>Gestion</v-list-subheader>

        <v-list-item
          v-for="item in gestionItems"
          :key="item.value"
          :title="item.title"
          :prepend-icon="item.icon"
          :value="item.value"
          :to="item.to"
          active-color="primary"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-btn color="error" @click="logout" block variant="text">
          <v-icon start>mdi-logout</v-icon>
          Cerrar Sesión
        </v-btn>
      </template>
    </v-navigation-drawer>

    <v-app-bar :elevation="2">
      <template #prepend v-if="mobile">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>
        <v-breadcrumbs :items="['Embutidos RB', 'Dashboard']"></v-breadcrumbs
      ></v-app-bar-title>

      <template #append>
        <v-btn icon="mdi-heart"></v-btn>

        <v-btn icon="mdi-magnify"></v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import router from '@/router'
import { useDisplay } from 'vuetify'

const { user, setUser } = useUserStore()
const { mobile } = useDisplay()
const drawer = ref(true)
const rail = ref(true)

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
  { title: 'Proveedores', icon: 'mdi-account', value: 'proveedores', to: '/path' },
  { title: 'Empleados', icon: 'mdi-account', value: 'empleados', to: '/path' },
  { title: 'Productos', icon: 'mdi-account', value: 'productos', to: '/path' },
  { title: 'Categorias', icon: 'mdi-account', value: 'categorias', to: '/path' },
]

const logout = () => {
  setUser(null)
  router.push('/login')
}
</script>
