import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import LoginView from '@/views/LoginView.vue'

import SuppliersView from '@/views/gestion/SuppliersView.vue'
import EmployeesView from '@/views/gestion/EmployeesView.vue'
import ProductsView from '@/views/gestion/ProductsView.vue'
import SalesView from '@/views/pos/CustomersView.vue'
import CustomersView from '@/views/pos/CustomersView.vue'
import VouchersView from '@/views/pos/VouchersView.vue'

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
          meta: { title: 'Home' },
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
      path: '/pos',
      component: DashboardLayout,
      children: [
        {
          path: 'sales',
          component: SalesView,
          meta: { title: 'Ventas' },
        },
        {
          path: 'vouchers',
          component: VouchersView,
          meta: { title: 'Comprobantes' },
        },
        {
          path: 'customers',
          component: CustomersView,
          meta: { title: 'Clientes' },
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
