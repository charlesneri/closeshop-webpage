<template>
  <div class="login-wrapper">
    <!-- Animated Background -->
    <div class="background-animation">
      <div class="bg-blob-1"></div>
      <div class="bg-blob-2"></div>
      <div class="bg-blob-3"></div>
    </div>

    <v-container class="login-container" fluid>
      <v-row align="center justify-center" class="min-vh-100">
        <v-col cols="12" sm="10" md="8" lg="5" xl="4">
          <!-- Logo and Brand -->
          <div class="text-center mb-6">
            <v-img
              src="/logo.png"
              alt="CloseShop Logo"
              class="logo-animated mx-auto"
              max-width="80"
              contain
            ></v-img>
            <h1 class="brand-title mt-4">
              Close<span class="brand-accent">Shop</span>
            </h1>
            <p class="brand-tagline">Become a Rider Partner</p>
          </div>

          <!-- Login Card -->
          <v-card class="login-card" elevation="0" rounded="xl">
            <v-card-text class="pa-6 pa-md-8">
              <h2 class="text-h5 font-weight-bold mb-2 text-center">Welcome Back</h2>
              <p class="text-center text-grey mb-6">Sign in to continue your rider application</p>

              <!-- Login Form -->
              <v-form ref="loginFormRef" v-model="loginValid" @submit.prevent="handleLogin">
                <v-text-field
                  v-model="loginForm.email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  :rules="[rules.required, rules.email]"
                  density="comfortable"
                  class="mb-4"
                  bg-color="white"
                ></v-text-field>

                <v-text-field
                  v-model="loginForm.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="[rules.required]"
                  density="comfortable"
                  class="mb-2"
                  bg-color="white"
                ></v-text-field>

                <div class="d-flex justify-end mb-6">
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="showForgotPassword = true"
                    class="forgot-link"
                  >
                    Forgot Password?
                  </v-btn>
                </div>

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="loading"
                  :disabled="!loginValid"
                  class="login-btn"
                >
                  Sign In
                  <v-icon right class="ml-2">mdi-arrow-right</v-icon>
                </v-btn>
              </v-form>

              <!-- Divider -->
              <div class="divider my-6">
                <v-divider></v-divider>
                <span class="divider-text">OR</span>
                <v-divider></v-divider>
              </div>

              <!-- Google Sign In Button -->
              <v-btn
                color="google"
                variant="outlined"
                size="large"
                block
                @click="handleGoogleSignIn"
                :loading="googleLoading"
                class="google-btn"
              >
                <v-icon left class="mr-2">mdi-google</v-icon>
                Continue with Google
              </v-btn>

              <!-- Info Alert -->
              <v-alert
                type="info"
                variant="tonal"
                density="compact"
                class="mt-6 info-alert"
              >
                <div class="d-flex align-center">
                  <v-icon left size="20" class="mr-2">mdi-information</v-icon>
                  <span>Sign in to submit your rider application or check your application status</span>
                </div>
              </v-alert>
            </v-card-text>
          </v-card>

          <!-- Back to Home -->
          <div class="text-center mt-4">
            <v-btn
              variant="text"
              color="white"
              @click="goToHome"
              class="back-home-btn"
              prepend-icon="mdi-arrow-left"
            >
              Back to Home
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="showForgotPassword" max-width="450">
      <v-card class="dialog-card" rounded="xl">
        <v-card-title class="dialog-header">
          <v-icon left size="24" class="mr-2">mdi-lock-reset</v-icon>
          Reset Password
        </v-card-title>
        <v-card-text class="pa-6">
          <p class="mb-4">Enter your email address and we'll send you a link to reset your password.</p>
          <v-text-field
            v-model="resetEmail"
            label="Email Address"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            :rules="[rules.required, rules.email]"
            density="comfortable"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showForgotPassword = false">Cancel</v-btn>
          <v-btn color="primary" @click="sendPasswordReset" :loading="resetLoading">Send Reset Link</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
      rounded="pill"
    >
      <v-icon left size="20" class="mr-2">{{ snackbar.icon }}</v-icon>
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" icon @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { supabase } from '@/utils/supabase'
  import { useAuthUserStore } from '@/stores/authUser'
  import { getSafeInternalPath } from '@/utils/riderAccess'

  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthUserStore()
  const OAUTH_REDIRECT_STORAGE_KEY = 'closeshop:rider-oauth-redirect'

// Form references
const loginFormRef = ref(null)

// Form validations
const loginValid = ref(false)

// Loading states
const loading = ref(false)
const googleLoading = ref(false)
const resetLoading = ref(false)

// Password visibility
const showPassword = ref(false)

// Dialog states
const showForgotPassword = ref(false)

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  icon: 'mdi-check-circle'
})

// Login form data
const loginForm = ref({
  email: '',
  password: ''
})

// Reset password email
const resetEmail = ref('')

// Validation rules
const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'Invalid email address',
  phone: (v) => /^09\d{9}$/.test(v) || 'Invalid phone number (must be 09XXXXXXXXX)',
  password: (v) => {
    if (!v) return 'Password is required'
    if (v.length < 6) return 'Password must be at least 6 characters'
    return true
  }
}

const getPostAuthRedirect = () => (
  getSafeInternalPath(route.query.redirect, '/application-form')
)

const storePendingOAuthRedirect = () => {
  sessionStorage.setItem(OAUTH_REDIRECT_STORAGE_KEY, getPostAuthRedirect())
}

const getAppOrigin = () => {
  const configuredOrigin = String(import.meta.env.VITE_APP_URL || '').trim()
  const currentOrigin = window.location.origin

  if (currentOrigin) {
    return currentOrigin.replace(/\/+$/, '')
  }

  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/, '')
  }

  return ''
}

const getAuthCallbackUrl = () => `${getAppOrigin()}/auth/callback`

// Handle Login
const handleLogin = async () => {
  if (!loginValid.value) return

  loading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.value.email,
      password: loginForm.value.password
    })

    if (error) throw error

    if (data.user) {
      // Update auth store
      await authStore.fetchUser()

      snackbar.value = {
        show: true,
        text: 'Login successful! Redirecting you now...',
        color: 'success',
        icon: 'mdi-check-circle'
      }

      // Return the rider to the route they originally tried to access.
      setTimeout(() => {
        router.push(getPostAuthRedirect())
      }, 1500)
    }
  } catch (error) {
    console.error('Login error:', error)
    snackbar.value = {
      show: true,
      text: error.message || 'Login failed. Please check your credentials.',
      color: 'error',
      icon: 'mdi-alert-circle'
    }
  } finally {
    loading.value = false
  }
}

const handleGoogleSignIn = async () => {
  googleLoading.value = true

  try {
    storePendingOAuthRedirect()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthCallbackUrl(),
      }
    })

    if (error) throw error
  } catch (error) {
    console.error('Google sign in error:', error)
    snackbar.value = {
      show: true,
      text: error.message || 'Google sign in failed. Please try again.',
      color: 'error',
      icon: 'mdi-alert-circle'
    }
    googleLoading.value = false
  }
}

// Send password reset email
const sendPasswordReset = async () => {
  if (!resetEmail.value || !rules.email(resetEmail.value) === true) {
    snackbar.value = {
      show: true,
      text: 'Please enter a valid email address',
      color: 'warning',
      icon: 'mdi-alert'
    }
    return
  }

  resetLoading.value = true

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.value, {
      redirectTo: `${getAppOrigin()}/reset-password`
    })

    if (error) throw error

    snackbar.value = {
      show: true,
      text: 'Password reset link sent to your email!',
      color: 'success',
      icon: 'mdi-check-circle'
    }

    showForgotPassword.value = false
    resetEmail.value = ''
  } catch (error) {
    console.error('Reset password error:', error)
    snackbar.value = {
      show: true,
      text: error.message || 'Failed to send reset link. Please try again.',
      color: 'error',
      icon: 'mdi-alert-circle'
    }
  } finally {
    resetLoading.value = false
  }
}

// Go to register page
const goToRegister = () => {
  router.push('/register')
}

// Go back to home
const goToHome = () => {
  router.push('/rider-portal')
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #182250 0%, #010f30 100%);
  overflow: hidden;
}

/* Animated Background */
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

.bg-blob-3 {
  position: absolute;
  top: 40%;
  left: 30%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  animation: floatBlob 25s ease-in-out infinite;
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

/* Container */
.login-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
}

.min-vh-100 {
  min-height: 100vh;
}

/* Logo Animation */
.logo-animated {
  animation: fadeInUp 0.6s ease-out;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Brand Title */
.brand-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.brand-accent {
  background: linear-gradient(135deg, #ffd89b, #c7e9fb);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-tagline {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* Login Card */
.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 32px !important;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out 0.3s both;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Login Button */
.login-btn {
  border-radius: 60px !important;
  text-transform: none !important;
  font-weight: 700 !important;
  font-size: 1rem !important;
  background: linear-gradient(135deg, #090c57 0%, #090722 100%) !important;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease !important;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4) !important;
}

/* Google Button */
.google-btn {
  border-radius: 60px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  border: 1px solid #e2e8f0 !important;
  background: white !important;
  color: #1a202c !important;
  transition: all 0.3s ease !important;
}

.google-btn:hover {
  background: #f8fafc !important;
  border-color: #090c57 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Forgot Link */
.forgot-link {
  text-transform: none !important;
  font-size: 0.875rem !important;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.divider-text {
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Register Link */
.register-link {
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: normal !important;
}

.register-link:hover {
  text-decoration: underline;
}

/* Info Alert */
.info-alert {
  border-radius: 16px !important;
  background: rgba(102, 126, 234, 0.1) !important;
  border: 1px solid rgba(102, 126, 234, 0.2) !important;
}

/* Back Home Button */
.back-home-btn {
  opacity: 0.8;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  opacity: 1;
  transform: translateX(-4px);
}

/* Dialog Styles */
.dialog-card {
  border-radius: 28px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #101364 100%);
  color: white;
  padding: 20px 24px;
  font-size: 1.25rem;
  font-weight: 700;
}

/* Form Field Customization */
:deep(.v-field) {
  border-radius: 12px !important;
}

:deep(.v-field--focused) {
  border-color: #667eea !important;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .brand-title {
    font-size: 2rem;
  }

  .login-card {
    margin: 16px;
  }

  .pa-6 {
    padding: 24px !important;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 1.75rem;
  }

  .login-card .pa-6 {
    padding: 20px !important;
  }

  .text-h5 {
    font-size: 1.25rem !important;
  }
}
</style>
