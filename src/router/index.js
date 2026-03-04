import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'

const routes = [
  { path: '/', component: () => import('../pages/FormPesquisa.vue') },
  { path: '/login', component: () => import('../pages/LoginAdmin.vue') },
  { 
    path: '/admin', 
    component: () => import('../pages/DashboardAdmin.vue'),
    meta: { requiresAuth: true }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (to.meta.requiresAuth && !session) {
    next('/login')
  } else {
    next()
  }
})