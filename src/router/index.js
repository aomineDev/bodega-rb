import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'

import SuppliersView from '@/views/gestion/SuppliersView.vue'
import EmployeesView from '@/views/gestion/EmployeesView.vue'
import ProductsView from '@/views/gestion/ProductsView.vue'
import SalesView from '@/views/pos/SalesView.vue'
import CustomersView from '@/views/pos/CustomersView.vue'
import VouchersView from '@/views/pos/VouchersView.vue'
import LoginView from '@/views/auth/LoginView.vue'

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
          path: 'suppliers',
          component: SuppliersView,
          meta: { title: 'Proveedores' },
        },
        {
          path: 'employees',
          component: EmployeesView,
          meta: { title: 'Empleados' },
        },
        {
          path: 'products',
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
      path: '/login',
      component: LoginView,
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

export default router
