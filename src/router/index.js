import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import LoginView from '@/views/LoginView.vue'
import ProviderView from '@/views/managment/ProviderView.vue'
import EmployeeView from '@/views/managment/EmployeeView.vue'
import ProductView from '@/views/managment/ProductView.vue'
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
      path: '/login',
      component: LoginView,
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
    {
      path: '/managment',
      component: DashboardLayout,
      children: [
        {
          path: 'provider',
          component: ProviderView,
          meta: { title: 'Proveedores' },
        },
        {
          path: 'employee',
          component: EmployeeView,
          meta: { title: 'Empleados' },
        },
        {
          path: 'product',
          component: ProductView,
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
  ],
})

export default router
