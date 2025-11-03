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
          component: HomeView,
        },
        {
          path: 'inventario',
          children: [
            {
              path: '',
              component: InventoryView,
            },
            {
              path: 'toma',
              component: TakeInventoryView,
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
      component: LoginView,
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

export default router
