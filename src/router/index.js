import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import LoginView from '@/views/LoginView.vue'
import ProviderView from '@/views/Managment/ProviderView.vue'
import EmployeeView from '@/views/Managment/EmployeeView.vue'
import ProductView from '@/views/Managment/ProductView.vue'

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
          component: ProviderView
        },
        {
          path: 'employee',
          component: EmployeeView
        }, {
          path: 'product',
          component: ProductView
        }
      ]
    }
  ],
})

export default router
