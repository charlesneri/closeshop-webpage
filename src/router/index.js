import { createRouter, createWebHistory } from 'vue-router'
import Webpage from '@/views/mainsite/webpage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'webpage',
      component: Webpage,
    },
   
  ],
})

export default router
