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
<<<<<<< HEAD
import CategoriesView from '@/views/management/CategoriesView.vue'
=======
import InventoryReportView from '@/views/inventory/InventoryReportView.vue'
import OpenInventoryView from '@/views/inventory/OpenInventoryView.vue'
import { authGuard } from './guards'
import { ROLES } from '@/utils/constants/roles'
>>>>>>> bc5ce19b8e6a5e9ef2585d203c2c1c22fbff9702

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
        },
        {
          path: 'inventario',
          children: [
            {
              path: '',
              component: InventoryView,
              meta: {
                roles: [ROLES.ASISTENTE],
              },
            },
            {
              path: 'abiertos',
              component: OpenInventoryView,
              meta: {
                roles: [ROLES.ADMIN],
              },
            },
            {
              path: 'toma/:id',
              name: 'take-inventory',
              component: TakeInventoryView,
            },
            {
              path: 'reporte',
              component: InventoryReportView,
            },
          ],
        },
        {
          path: 'gestion',
          children: [
            {
              path: 'proveedores',
              component: SuppliersView,
            },
            {
              path: 'empleados',
              component: EmployeesView,
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
              path: 'ventas',
              component: SalesView,
            },
            {
              path: 'comprobantes',
              component: VouchersView,
            },
            {
              path: 'clientes',
              component: CustomersView,
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
