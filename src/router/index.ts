import { createRouter, createWebHistory } from 'vue-router'
import Workspace from '@/pages/Workspace.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'workspace',
      component: Workspace,
    },
  ],
})

export default router
