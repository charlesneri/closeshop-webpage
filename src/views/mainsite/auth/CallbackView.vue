<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from '@/stores/authUser'

const router = useRouter()
const authStore = useAuthUserStore()
const status = ref('Processing your login...')
const error = ref(null)

onMounted(async () => {
  try {
    // Get the session after OAuth redirect
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) throw sessionError

    if (session?.user) {
      status.value = 'Login successful! Redirecting to application form...'

      // Check if user profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      // If profile doesn't exist, create one
      if (!existingProfile) {
        status.value = 'Creating your account...'

        const fullName = session.user.user_metadata?.full_name || ''
        const firstName = fullName.split(' ')[0] || ''
        const lastName = fullName.split(' ').slice(1).join(' ') || ''

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || firstName,
              last_name: session.user.user_metadata?.last_name || lastName,
              avatar_url: session.user.user_metadata?.avatar_url || null
            }
          ])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      // Update auth store
      await authStore.fetchUser()

      // Redirect to application form after 1.5 seconds
      setTimeout(() => {
        router.push('/application-form')
      }, 1500)
    } else {
      throw new Error('No session found')
    }
  } catch (err) {
    console.error('Callback error:', err)
    error.value = err.message || 'Authentication failed. Please try again.'
    status.value = 'Authentication failed'

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/rider-login')
    }, 3000)
  }
})
</script>

<template>
  <div class="callback-wrapper">
    <div class="background-animation">
      <div class="bg-blob-1"></div>
      <div class="bg-blob-2"></div>
      <div class="bg-blob-3"></div>
    </div>

    <v-container class="callback-container" fluid>
      <v-row align="center justify-center" class="min-vh-100">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="callback-card" elevation="10" rounded="xl">
            <v-card-text class="text-center pa-8">
              <div v-if="!error">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="64"
                  class="mb-4"
                ></v-progress-circular>
                <h3 class="text-h5 font-weight-bold mb-2">{{ status }}</h3>
                <p class="text-grey">Please wait while we set up your account...</p>
              </div>

              <div v-else>
                <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
                <h3 class="text-h5 font-weight-bold mb-2">Authentication Failed</h3>
                <p class="text-grey">{{ error }}</p>
                <p class="text-caption">Redirecting to login page...</p>
                <v-btn color="primary" @click="router.push('/rider-login')" class="mt-4">
                  Go to Login
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.callback-wrapper {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #182250 0%, #010f30 100%);
  overflow: hidden;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.bg-blob-1 {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: floatBlob 20s ease-in-out infinite;
}

.bg-blob-2 {
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: floatBlob 15s ease-in-out infinite reverse;
}

@keyframes floatBlob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.callback-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
}

.min-vh-100 {
  min-height: 100vh;
}

.callback-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 32px !important;
  overflow: hidden;
}
</style>
