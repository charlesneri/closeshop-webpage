import { createRouter, createWebHistory } from 'vue-router'
import Webpage from '@/views/mainsite/webpage.vue'
import RiderPortal from '@/views/rider/RiderPortal.vue'
import ApplicationForm from '@/views/rider/ApplicationForm.vue'
import LoginView from '@/views/mainsite/LoginView.vue'
import SubmittedSuccess from '@/views/rider/SubmittedSuccess.vue'
import CallbackView from '@/views/mainsite/auth/CallbackView.vue'
import {
  getCurrentAuthUser,
  getRiderRouteContext,
} from '@/utils/riderAccess'

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
      meta: { requiresAuth: true, riderAccess: 'form' },
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/application-status/:applicationId?',
      name: 'application-status',
      component: SubmittedSuccess,
      meta: { requiresAuth: true, riderAccess: 'status' },
    },
    {
      path: '/application-submitted/:applicationId?',
      redirect: (to) => ({
        name: 'application-status',
        params: { applicationId: to.params.applicationId }
      })
    },
    {
      path: '/submitted-success/:applicationId?',
      redirect: (to) => ({
        name: 'application-status',
        params: { applicationId: to.params.applicationId }
      })
    },
  ]

  const router = createRouter({
  history: createWebHistory(),
  routes
})

const getRequestedApplicationId = (applicationId) => {
  if (Array.isArray(applicationId)) {
    return applicationId[0] || ''
  }

  return applicationId ? String(applicationId) : ''
}

router.beforeEach(async (to) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    return true
  }

  try {
    const user = await getCurrentAuthUser()

    if (!user) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    const { latestApplication, accessState } = await getRiderRouteContext(user.id)

    if (to.meta.riderAccess === 'form') {
      if (latestApplication) {
        return {
          name: 'application-status',
          params: { applicationId: latestApplication.rider_id },
          replace: true,
        }
      }

      if (accessState.blocked) {
        return {
          name: 'rider-portal',
          replace: true,
        }
      }

      return true
    }

    if (to.meta.riderAccess === 'status') {
      if (!latestApplication) {
        if (accessState.blocked) {
          return {
            name: 'rider-portal',
            replace: true,
          }
        }

        return {
          name: 'application-form',
          replace: true,
        }
      }

      const requestedApplicationId = getRequestedApplicationId(to.params.applicationId)
      const latestApplicationId = String(latestApplication.rider_id || '')

      if (requestedApplicationId !== latestApplicationId) {
        return {
          name: 'application-status',
          params: { applicationId: latestApplication.rider_id },
          replace: true,
        }
      }
    }

    return true
  } catch (error) {
    console.error('Unable to validate rider route access:', error)
    return true
  }
})

export default router
