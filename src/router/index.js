import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'

import SuppliersView from '@/views/management/SuppliersView.vue'
import EmployeesView from '@/views/management/EmployeesView.vue'
import ProductsView from '@/views/management/ProductsView.vue'
import SalesView from '@/views/pos/SalesView.vue'
import CustomersView from '@/views/pos/CustomersView.vue'
import VouchersView from '@/views/pos/VouchersView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import TakeInventoryView from '@/views/inventory/TakeInventoryView.vue'
import AuditView from '@/views/inventory/AuditView.vue'
import ProductEntryView from '@/views/almacen/ProductEntryView.vue'

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
          path: 'about',
          component: AboutView,
        },
      ],
    },
    {
      path: '/gestion',
      component: DashboardLayout,
      children: [
        {
          path: 'proveedores',
          component: SuppliersView,
          meta: { title: 'Proveedores' },
        },
        {
          path: 'empleados',
          component: EmployeesView,
          meta: { title: 'Empleados' },
        },
        {
          path: 'productos',
          component: ProductsView,
          meta: { title: 'Productos' },
        },
      ],
    },
    {
      path: '/caja',
      component: DashboardLayout,
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
      component: DashboardLayout,
      children: [
        {
          path: 'ingreso-productos',
          component: ProductEntryView,
          meta: { title: 'Ingreso de Productos' },
        }
      ],
    },
    {
      path: '/inventory',
      component: DashboardLayout,
      children: [
        {
          path: 'toma-inventario',
          component: TakeInventoryView,
        },
        {
          path: 'auditoria',
          component: AuditView,
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
