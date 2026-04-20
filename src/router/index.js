import { createRouter, createWebHistory } from 'vue-router'
import Webpage from '@/views/mainsite/webpage.vue'
import RiderPortal from '@/views/rider/RiderPortal.vue'
import ApplicationForm from '@/views/rider/ApplicationForm.vue'
import LoginView from '@/views/mainsite/LoginView.vue'
import SubmittedSuccess from '@/views/rider/SubmittedSuccess.vue'
import CallbackView from '@/views/mainsite/auth/CallbackView.vue'

const routes = [
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: CallbackView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'webpage',
      component: Webpage,
    },

    {
      path: '/rider-portal',
      name: 'rider-portal',
      component: RiderPortal,
    },

    {
      path: '/application-form',
      name: 'application-form',
      component: ApplicationForm,
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/application-submitted/:applicationId?',
      name: 'submitted-success',
      component: SubmittedSuccess,
    },
    //
    {
      path: '/application-status/:applicationId?',
      name: 'application-status',
      component: () => import('@/views/rider/SubmittedSuccess.vue')
    },
    {
      path: '/submitted-success/:applicationId?',
      redirect: '/application-status/:applicationId' // Redirect to unified status page
    },
  ]

  const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
