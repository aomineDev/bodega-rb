import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import LoginView from '@/views/LoginView.vue'
import VentasView from '@/views/caja/VentasView.vue'
import ComprobantesView from '@/views/caja/ComprobantesView.vue'
import ClientesView from '@/views/caja/ClientesView.vue'
import SuppliersView from '@/views/gestion/suppliersView.vue'
import EmployeesView from '@/views/gestion/EmployeesView.vue'
import ProductsView from '@/views/gestion/ProductsView.vue'

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
          component: VentasView,
          meta: { title: 'Ventas' },
        },
        {
          path: 'comprobantes',
          component: ComprobantesView,
          meta: { title: 'Comprobantes' },
        },
        {
          path: 'clientes',
          component: ClientesView,
          meta: { title: 'Clientes' },
        },
      ],
    },
  ],
})

export default router
