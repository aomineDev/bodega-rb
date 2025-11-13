<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      @click="rail = false"
      :temporary="!mdAndUp"
      :permanent="mdAndUp"
    >
      <template #prepend>
        <v-list-item title="Embutidos RB" class="pt-2 pb-2">
          <template #prepend>
            <v-avatar color="grey-darken-4">
              <v-icon color="white" icon="mdi-store"></v-icon>
            </v-avatar>
          </template>

          <template #append>
            <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </template>

      <v-list density="compact" nav>
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard"
          value="dashboard"
          color="primary"
          to="/home"
        ></v-list-item>

        <v-divider v-role="[ROLES.ADMIN, ROLES.CAJERO]"></v-divider>
        <v-list-subheader v-role="[ROLES.ADMIN, ROLES.CAJERO]">Caja</v-list-subheader>

        <v-list-item
          v-role="[ROLES.ADMIN, ROLES.CAJERO]"
          v-for="item in cajaitems"
          :key="item.value"
          :title="item.title"
          :prepend-icon="item.icon"
          :value="item.value"
          :to="item.to"
          color="primary"
        ></v-list-item>

        <v-divider v-role="[ROLES.ADMIN, ROLES.JEFE_ALMACEN, ROLES.ASISTENTE]"></v-divider>
        <v-list-subheader v-role="[ROLES.ADMIN, ROLES.JEFE_ALMACEN, ROLES.ASISTENTE]"
          >Inventario</v-list-subheader
        >
        <v-list-item
          v-for="item in inventarioItems"
          v-role="item.roles"
          :key="item.value"
          :title="item.title"
          :prepend-icon="item.icon"
          :value="item.value"
          :to="item.to"
          color="primary"
          exact
        ></v-list-item>

        <v-divider v-role="[ROLES.ADMIN, ROLES.JEFE_ALMACEN]"></v-divider>
        <v-list-subheader v-role="[ROLES.ADMIN, ROLES.JEFE_ALMACEN]">Almacen</v-list-subheader>

        <v-list-item
          title="Ingreso de productos"
          prepend-icon="mdi-package-variant-plus"
          value="ingreso"
          color="primary"
          to="/almacen/ingreso-productos"
          v-role="[ROLES.ADMIN, ROLES.JEFE_ALMACEN]"
        ></v-list-item>

        <v-divider></v-divider>
        <v-list-subheader>Gestion</v-list-subheader>

        <v-list-item
          v-for="item in gestionItems"
          v-role="item.roles"
          :key="item.value"
          :title="item.title"
          :prepend-icon="item.icon"
          :value="item.value"
          :to="item.to"
          color="primary"
        ></v-list-item>
      </v-list>

      <template #append>
        <v-divider></v-divider>
        <v-menu location="end">
          <template #activator="{ props }">
            <v-list-item
              :prepend-avatar="user?.imagen"
              :subtitle="rol"
              :title="user?.nombre"
              class="pt-2 pb-2"
              v-bind="props"
              append-icon="mdi-chevron-right"
            >
            </v-list-item>
          </template>

          <v-list min-width="200" density="compact" class="rounded-lg" elevation="2">
            <v-list-item
              :prepend-avatar="user?.imagen"
              :subtitle="rol"
              :title="user?.nombre"
              class="pt-2 pb-2"
            >
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              title="Perfil"
              prepend-icon="mdi-account"
              class="primary"
              to="/perfil"
            ></v-list-item>
            <v-list-item
              title="Log out"
              prepend-icon="mdi-logout"
              class="text-red"
              @click="logout"
            ></v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-navigation-drawer>

    <v-app-bar elevation="1">
      <template #prepend v-if="!mdAndUp">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" icon="mdi-collage"></v-app-bar-nav-icon>
      </template>

      <v-breadcrumbs :items="breandcrumbs">
        <template #divider>
          <v-icon color="grey-lighten-1">mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>

      <template #append>
        <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="toggleTheme"
        ></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container class="container custom-scroll">
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { capitalize } from '@/utils/capitalize'
import { useAuthStore, useThemeStore } from '@/stores'
import { formatRol } from '@/utils/formatRol'
import { ROLES } from '@/utils/constants/roles'
import { storeToRefs } from 'pinia'

const { logout } = useAuthStore()
const { user, role } = storeToRefs(useAuthStore())
const { theme } = storeToRefs(useThemeStore())
const { toggleTheme } = useThemeStore()

const rol = computed(() => formatRol(role.value))

const { mdAndUp } = useDisplay()
const drawer = ref(true)
const rail = ref(false)

const cajaitems = [
  {
    title: 'Ventas',
    icon: 'mdi-cash-register',
    value: 'ventas',
    to: '/caja/ventas',
    roles: [ROLES.ADMIN, ROLES.CAJERO],
  },
  {
    title: 'Clientes',
    icon: 'mdi-account',
    value: 'clientes',
    to: '/caja/clientes',
    roles: [ROLES.ADMIN, ROLES.CAJERO],
  },
  {
    title: 'Comprobantes',
    icon: 'mdi-invoice-list',
    value: 'comprobantes',
    to: '/caja/comprobantes',
    roles: [ROLES.ADMIN, ROLES.CAJERO],
  },
]
const inventarioItems = [
  {
    title: 'inventario',
    icon: 'mdi-clipboard-outline',
    value: 'inventario',
    to: '/inventario',
    roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN],
  },
  {
    title: 'Toma de inventario',
    icon: 'mdi-clipboard-check-outline',
    value: 'toma-inventario',
    to: '/inventario/abiertos',
    roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN, ROLES.ASISTENTE],
  },
  {
    title: 'Reporte de inventario',
    icon: 'mdi-clipboard-list-outline',
    value: 'reporte-inventario',
    to: '/inventario/reporte',
    roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN],
  },
]

const gestionItems = [
  {
    title: 'Proveedores',
    icon: 'mdi-truck-outline',
    value: 'proveedores',
    to: '/gestion/proveedores',
    roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN],
  },
  {
    title: 'Empleados',
    icon: 'mdi-account-group ',
    value: 'empleados',
    to: '/gestion/empleados',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'Productos',
    icon: 'mdi-package-variant-closed',
    value: 'productos',
    to: '/gestion/productos',
    roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN, ROLES.ASISTENTE, ROLES.CAJERO],
  },
  {
    title: 'Categorias',
    icon: 'mdi-sitemap',
    value: 'categorias',
    to: '/gestion/categorias',
    roles: [ROLES.ADMIN],
  },
]

const route = useRoute()

const breandcrumbs = computed(() => [
  'Dashboard',
  ...route.path.split('/').slice(1).map(capitalize),
])

watch(
  mdAndUp,
  (value) => {
    if (value) drawer.value = true
    else drawer.value = false
  },
  { immediate: true },
)
</script>

<style scoped>
.container {
  max-height: calc(100vh - var(--v-layout-top));
  overflow: auto;
}
</style>
