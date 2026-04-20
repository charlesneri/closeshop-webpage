<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'

const router = useRouter()
const route = useRoute()
const applicationId = ref(route.params.applicationId || '')
const application = ref(null)
const loading = ref(true)
const error = ref(null)

const goToApplicationForm = () => {
  router.push('/application-form')
}

const goHome = () => {
  router.push('/rider-portal')
}

const contactSupport = () => {
  window.location.href = 'mailto:support@closeshop.com?subject=Rider Application Inquiry'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Not scheduled'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const loadApplication = async () => {
  loading.value = true
  error.value = null

  try {
    let query = supabase.from('Rider_Registration').select('*')

    if (applicationId.value) {
      // New submission - get by ID
      const { data, error: fetchError } = await query.eq('rider_id', applicationId.value).single()
      if (fetchError) throw fetchError
      application.value = data
    } else {
      // Check if user has existing application
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error: fetchError } = await query
          .eq('profile_id', user.id)
          .order('application_date', { ascending: false })
          .limit(1)
          .single()

        if (!fetchError && data) {
          application.value = data
          applicationId.value = data.rider_id
        }
      }
    }
  } catch (err) {
    console.error('Error loading application:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Logout function
const logout = async () => {
  try {
    await supabase.auth.signOut()
    // Clear any stored application data
    localStorage.removeItem('lastRiderApplication')
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

onMounted(() => {
  loadApplication()
})
</script>

<template>
  <v-container fluid class="status-page">
    <!-- Logout Button - Fixed Position -->
    <div class="logout-button-container">
      <v-btn
        color="error"
        variant="outlined"
        @click="logout"
        prepend-icon="mdi-logout"
        class="logout-btn"
      >
        Logout
      </v-btn>
    </div>

    <v-row justify="center" align="center" class="min-vh-100">
      <v-col cols="12" md="8" lg="6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center pa-8">
          <v-progress-circular indeterminate color="#3f83c7" size="64"></v-progress-circular>
          <p class="mt-4 text-h6">Loading application status...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center pa-8">
          <v-icon size="80" color="error">mdi-alert-circle</v-icon>
          <h3 class="mt-4 text-h4">Unable to Load Application</h3>
          <p class="mt-2 text-body-1">We couldn't find your application. Please contact support.</p>
          <v-btn color="primary" @click="goHome" class="mt-4">Go to Home</v-btn>
        </div>

        <!-- Application Status Display -->
        <div v-else-if="application">
          <!-- Approved Application -->
          <div v-if="application.status === 'approved'">
            <v-card class="status-card" elevation="10" rounded="xl">
              <v-card-text class="text-center pa-8">
                <div class="checkmark-circle mb-6">
                  <div class="checkmark draw"></div>
                </div>
                <h1 class="text-h3 font-weight-bold mb-2 success-title">Application Approved!</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-6">
                  Congratulations! Your rider application has been approved.
                </p>

                <v-divider class="my-4"></v-divider>

                <v-card variant="outlined" class="mb-6 text-left">
                  <v-card-text>
                    <div class="d-flex align-center mb-3">
                      <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                      <strong>What's next?</strong>
                    </div>
                    <ul class="pl-6">
                      <li>Download the CloseShop Rider App from Google Play Store</li>
                      <li>Log in using your registered email address</li>
                      <li>Complete your rider profile setup</li>
                      <li>Start accepting delivery requests</li>
                    </ul>
                  </v-card-text>
                </v-card>

              </v-card-text>
            </v-card>
          </div>

          <!-- Under Review Application -->
          <div v-else-if="application.status === 'under_review'">
            <v-card class="status-card" elevation="10" rounded="xl">
              <v-card-text class="text-center pa-8">
                <v-icon size="80" color="primary" class="mb-4">mdi-progress-clock</v-icon>
                <h1 class="text-h3 font-weight-bold mb-2">Application Under Review</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-6">
                  Your application is currently being reviewed by our team.
                </p>

                <v-divider class="my-4"></v-divider>

                <v-alert type="info" variant="tonal" class="mb-4">
                  <div class="d-flex justify-space-between align-center">
                    <strong>Application Reference Number:</strong>
                    <span class="ref-number font-weight-bold">{{ application.rider_id }}</span>
                  </div>
                </v-alert>

                <v-alert type="info" variant="tonal" class="mb-4">
                  <strong>Estimated review time:</strong> 3-5 business days
                </v-alert>

                <p class="text-grey">We'll notify you via email and SMS once a decision has been made.</p>
              </v-card-text>
            </v-card>
          </div>

          <!-- Interview Scheduled -->
          <div v-else-if="application.status === 'interview_scheduled'">
            <v-card class="status-card" elevation="10" rounded="xl">
              <v-card-text class="text-center pa-8">
                <v-icon size="80" color="warning" class="mb-4">mdi-calendar-clock</v-icon>
                <h1 class="text-h3 font-weight-bold mb-2">Interview Scheduled</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-6">
                  An interview has been scheduled for your rider application.
                </p>

                <v-divider class="my-4"></v-divider>

                <v-card class="mb-6 text-left" variant="outlined">
                  <v-card-text>
                    <div class="d-flex align-center mb-2">
                      <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                      <strong>Interview Date:</strong>
                      <span class="ml-2">{{ formatDate(application.interview_date) }}</span>
                    </div>
                    <div class="d-flex align-center mb-2">
                      <v-icon color="primary" class="mr-2">mdi-clock</v-icon>
                      <strong>Interview Time:</strong>
                      <span class="ml-2">{{ application.interview_time }}</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                      <strong>Location:</strong>
                      <span class="ml-2">{{ application.interview_location || 'CloseShop Office' }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </div>

          <!-- Pending Application -->
          <div v-else-if="application.status === 'pending'">
            <v-card class="status-card" elevation="10" rounded="xl">
              <v-card-text class="text-center pa-8">
                <v-icon size="80" color="warning" class="mb-4">mdi-alert-circle</v-icon>
                <h1 class="text-h3 font-weight-bold mb-2">Application Pending</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-6">
                  You have already submitted a rider application.
                </p>

                <v-divider class="my-4"></v-divider>

                <v-alert type="info" variant="tonal" class="mb-4">
                  <div class="d-flex justify-space-between align-center">
                    <strong>Application Reference Number:</strong>
                    <span class="ref-number font-weight-bold">{{ application.rider_id }}</span>
                  </div>
                </v-alert>

                <p class="text-grey">Please wait for admin approval. This typically takes 3-5 business days.</p>
                <p class="text-caption mt-2">You will receive an email and SMS notification once your application has been processed.</p>
                 <div class="action-buttons">
                  <v-btn variant="outlined" size="large" block @click="goHome" prepend-icon="mdi-home">
                    Back to Home
                  </v-btn>
                </div>

              </v-card-text>
            </v-card>
          </div>

          <!-- Rejected Application -->
          <div v-else-if="application.status === 'rejected'">
            <v-card class="status-card" elevation="10" rounded="xl">
              <v-card-text class="text-center pa-8">
                <v-icon size="80" color="error" class="mb-4">mdi-close-circle</v-icon>
                <h1 class="text-h3 font-weight-bold mb-2">Application Not Approved</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-6">
                  We regret to inform you that your rider application was not approved at this time.
                </p>

                <v-divider class="my-4"></v-divider>

                <v-card class="mb-6 text-left" variant="outlined" color="error">
                  <v-card-text>
                    <div class="d-flex align-center">
                      <v-icon color="error" class="mr-2">mdi-message-alert</v-icon>
                      <strong>Reason:</strong>
                      <span class="ml-2">{{ application.rejection_reason || 'Does not meet the requirements' }}</span>
                    </div>
                  </v-card-text>
                </v-card>

                <v-alert type="warning" variant="tonal" class="mb-4">
                  <strong>What can you do?</strong>
                  <ul class="mt-2">
                    <li>Review the requirements and ensure all documents are valid</li>
                    <li>Update your information and submit a new application</li>
                    <li>Contact support for more information about your rejection</li>
                  </ul>
                </v-alert>

                <div class="action-buttons">
                  <v-btn color="primary" size="large" block class="mb-3" @click="goToApplicationForm" prepend-icon="mdi-file-document">
                    Submit New Application
                  </v-btn>
                  <v-btn variant="outlined" size="large" block @click="contactSupport">
                    Contact Support
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- New Submission Success (Default) -->
          <div v-else>
            <v-card class="status-card" elevation="10" rounded="xl">
              <v-card-text class="text-center pa-8">
                <div class="checkmark-circle mb-6">
                  <div class="checkmark draw"></div>
                </div>
                <h1 class="text-h3 font-weight-bold mb-2 success-title">Application Submitted!</h1>
                <p class="text-subtitle-1 text-grey-darken-1 mb-6">
                  Thank you for applying to become a CloseShop rider partner
                </p>

                <v-divider class="my-4"></v-divider>

                <v-alert type="info" variant="tonal" class="mb-4">
                  <div class="d-flex justify-space-between align-center">
                    <strong>Application Reference Number:</strong>
                    <span class="ref-number font-weight-bold">{{ application.rider_id || applicationId }}</span>
                  </div>
                </v-alert>

                <v-timeline density="compact" align="start" class="mt-6 mb-6">
                  <v-timeline-item dot-color="success" size="small">
                    <div class="timeline-content">
                      <strong>Application Received</strong>
                      <div class="text-caption text-grey">We've received your application</div>
                    </div>
                  </v-timeline-item>
                  <v-timeline-item dot-color="primary" size="small">
                    <div class="timeline-content">
                      <strong>Under Review</strong>
                      <div class="text-caption text-grey">Our team will review your documents (3-5 business days)</div>
                    </div>
                  </v-timeline-item>
                  <v-timeline-item dot-color="grey" size="small">
                    <div class="timeline-content">
                      <strong>Interview Schedule</strong>
                      <div class="text-caption text-grey">If qualified, we'll contact you for an interview</div>
                    </div>
                  </v-timeline-item>
                  <v-timeline-item dot-color="grey" size="small">
                    <div class="timeline-content">
                      <strong>Final Approval</strong>
                      <div class="text-caption text-grey">You'll receive confirmation via email and SMS</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>

                <v-alert type="info" variant="outlined" class="mb-6">
                  <div class="d-flex align-center">
                    <v-icon left class="mr-2">mdi-email-fast</v-icon>
                    <span>We've sent a confirmation email with your application details</span>
                  </div>
                </v-alert>

                <div class="action-buttons">
                  <v-btn variant="outlined" size="large" block @click="goHome" prepend-icon="mdi-home">
                    Back to Home
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- Help Section -->
          <v-card class="help-card mt-4" variant="outlined" rounded="xl">
            <v-card-text class="text-center pa-4">
              <div class="d-flex justify-center align-center">
                <v-icon color="primary" class="mr-2">mdi-help-circle</v-icon>
                <span class="text-body-2">Need help? Contact our support team at</span>
                <a href="mailto:support@closeshop.com" class="ml-1 text-decoration-none">
                  support@closeshop.com
                </a>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.status-page {
  background: linear-gradient(135deg, #4c75dd 0%, #1b3b8a 100%);
  min-height: 100vh;
  position: relative;
}

/* Logout Button Styles */
.logout-button-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.logout-btn {
  background: white !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.status-card {
  background: white;
  transition: transform 0.3s ease;
}

.status-card:hover {
  transform: translateY(-5px);
}

.success-title {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ref-number {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  color: #1976d2;
  letter-spacing: 1px;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  animation: scaleUp 0.5s ease-out;
}

.checkmark.draw {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%) rotate(-45deg);
  width: 30px;
  height: 15px;
  border-left: 4px solid white;
  border-bottom: 4px solid white;
  animation: drawCheckmark 0.4s ease-out 0.2s forwards;
  opacity: 0;
}

@keyframes scaleUp {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes drawCheckmark {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  50% {
    width: 15px;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 30px;
    height: 15px;
    opacity: 1;
  }
}

.timeline-content {
  padding: 8px;
}

.help-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.action-buttons {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .logout-button-container {
    top: 10px;
    right: 10px;
  }

  .logout-btn {
    padding: 4px 12px;
    font-size: 0.875rem;
  }

  .status-card {
    margin: 16px;
  }

  .success-title {
    font-size: 1.75rem !important;
  }

  .checkmark-circle {
    width: 60px;
    height: 60px;
  }

  .checkmark.draw {
    width: 24px;
    height: 12px;
    border-width: 3px;
  }
}
</style>
