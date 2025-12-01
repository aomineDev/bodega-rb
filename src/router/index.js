import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'

import SuppliersView from '@/views/management/SuppliersView.vue'
import EmployeesView from '@/views/management/EmployeesView.vue'
import ProductsView from '@/views/management/ProductsView.vue'
import SalesView from '@/views/pos/SalesView.vue'
import CustomersView from '@/views/pos/CustomersView.vue'
import VouchersView from '@/views/pos/VouchersView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import ProductEntryView from '@/views/warehouse/ProductEntryView.vue'
import InventoryView from '@/views/inventory/InventoryView.vue'
import TakeInventoryView from '@/views/inventory/TakeInventoryView.vue'
import CategoriesView from '@/views/management/CategoriesView.vue'
import InventoryReportView from '@/views/inventory/InventoryReportView.vue'
import OpenInventoryView from '@/views/inventory/OpenInventoryView.vue'
import { authGuard } from './guards'
import { ROLES } from '@/utils/constants/roles'
import ProfileView from '@/views/profile/ProfileView.vue'
import CashClosureView from '@/views/pos/CashClosureView.vue'
import { useAuthStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: '',
          redirect: '/home',
        },
        {
          path: 'home',
          name: 'home',
          component: HomeView,
          beforeEnter: () => {
            const { role } = useAuthStore()

            if (role !== ROLES.ADMIN) return { name: 'profile' }
          },
        },
        {
          path: 'inventario',
          children: [
            {
              path: '',
              component: InventoryView,
              meta: {
                roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN],
              },
            },
            {
              path: 'abiertos',
              component: OpenInventoryView,
              meta: {
                roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN, ROLES.ASISTENTE],
              },
            },
            {
              path: 'toma/:id',
              name: 'take-inventory',
              component: TakeInventoryView,
              meta: {
                roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN, ROLES.ASISTENTE],
              },
            },
            {
              path: 'reporte',
              component: InventoryReportView,
              meta: {
                roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN],
              },
            },
          ],
        },
        {
          path: 'gestion',
          children: [
            {
              path: 'proveedores',
              component: SuppliersView,
              meta: {
                roles: [ROLES.ADMIN, ROLES.JEFE_ALMACEN],
              },
            },
            {
              path: 'empleados',
              component: EmployeesView,
              meta: {
                roles: [ROLES.ADMIN],
              },
            },
            {
              path: 'productos',
              component: ProductsView,
            },
            {
              path: 'categorias',
              component: CategoriesView,
            },
          ],
        },
        {
          path: 'caja',
          children: [
            {
              path: 'cierre-de-caja',
              component: CashClosureView,
              meta: {
                roles: [ROLES.ADMIN, ROLES.CAJERO],
              },
            },
            {
              path: 'ventas',
              component: SalesView,
              meta: {
                roles: [ROLES.ADMIN, ROLES.CAJERO],
              },
            },
            {
              path: 'comprobantes',
              component: VouchersView,
              meta: {
                roles: [ROLES.ADMIN, ROLES.CAJERO],
              },
            },
            {
              path: 'clientes',
              component: CustomersView,
              meta: {
                roles: [ROLES.ADMIN, ROLES.CAJERO],
              },
            },
          ],
        },
        {
          path: '/almacen',
          children: [
            {
              path: 'ingreso-productos',
              component: ProductEntryView,
            },
          ],
        },
        {
          path: '/perfil',
          name: 'profile',
          component: ProfileView,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach(authGuard)

export default router
