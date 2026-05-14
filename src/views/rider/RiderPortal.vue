<template>
  <v-app>
    <v-app-bar :style="{ background: colorPalette.primary.gradient }" prominent elevated class="modern-navbar">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white" class="d-md-none nav-icon"></v-app-bar-nav-icon>
      <v-img
        :src="logoUrl"
        alt="Closeshop Logo"
        max-height="40"
        max-width="40"
        class="ml-2 mr-2 mr-sm-4 nav-logo nav-logo-clickable"
        @click="goToWebpage"
        contain
      ></v-img>
      <v-toolbar-title class="font-weight-bold text-white responsive-toolbar-title app-title app-title-clickable" @click="goToWebpage">
        CloseShop
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="desktop-nav">
        <v-btn
          v-for="item in navItems"
          :key="item.title"
          @click="handleNavAction(item)"
          variant="text"
          color="white"
          :class="['desktop-nav-btn', { 'website-nav-btn': item.type === 'route' }]"
          rounded
        >
          <span class="nav-text">{{ item.title }}</span>
          <span class="nav-indicator"></span>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary class="portal-drawer">
      <div class="drawer-header">
        <v-img
          :src="logoUrl"
          alt="Closeshop Logo"
          max-height="42"
          max-width="42"
          class="drawer-logo"
          contain
        ></v-img>
        <div class="drawer-brand">
          <span class="drawer-title">CloseShop</span>
          <span class="drawer-caption">Rider portal navigation</span>
        </div>
      </div>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          @click="handleNavAction(item)"
          class="responsive-drawer-item"
        >
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title class="responsive-list-text">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="rider-portal-main">
      <div class="hero-section" id="hero-section">
        <div class="hero-content">
          <div class="hero-top-stack">
            <v-chip
              v-if="existingApplication"
              class="status-chip"
              color="white"
              variant="flat"
              prepend-icon="mdi-timeline-check-outline"
            >
              Latest application: {{ formatStatusLabel(existingApplication.status) }}
            </v-chip>

            <div class="hero-icon-wrapper">
              <div class="hero-icon-pulse"></div>
              <v-icon size="80" color="#3f83c7" class="hero-icon">mdi-motorbike</v-icon>
            </div>
          </div>

          <h1 class="hero-title">Become a Rider Partner</h1>
          <p class="hero-subtitle">
            Join our growing fleet of delivery partners and start earning today.
            Deliver for local businesses and be your own boss.
          </p>

          <div class="hero-actions">
            <v-btn
              class="start-application-btn"
              size="x-large"
              color="primary"
              @click="handlePrimaryAction"
              :loading="loading"
              :disabled="isPrimaryActionDisabled"
            >
              {{ primaryActionLabel }}
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>

            <v-btn
              class="secondary-hero-btn"
              size="x-large"
              variant="outlined"
              color="white"
              @click="goToWebpage"
            >
              <v-icon left>mdi-arrow-left-circle-outline</v-icon>
              Back to Main Website
            </v-btn>
          </div>

          <p class="hero-helper-text mt-4">
            {{ heroHelperText }}
          </p>

          <v-alert
            v-if="riderAccessState.blocked"
            :type="accessAlertType"
            variant="tonal"
            class="portal-access-alert mt-5"
          >
            <strong>{{ riderAccessState.title }}</strong>
            <div class="portal-access-alert-text">{{ riderAccessState.message }}</div>
          </v-alert>

          <div class="hero-highlights">
            <div v-for="highlight in heroHighlights" :key="highlight.label" class="hero-highlight-card">
              <v-icon size="22" color="#8ec5ff">{{ highlight.icon }}</v-icon>
              <strong>{{ highlight.value }}</strong>
              <span>{{ highlight.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="benefits-section" id="benefits-section">
        <v-container>
          <div class="text-center mb-8">
            <h2 class="section-title">Why Partner With Us?</h2>
            <p class="section-subtitle">Enjoy flexible hours, competitive earnings, and more</p>
          </div>

          <v-row>
            <v-col v-for="benefit in benefits" :key="benefit.title" cols="12" sm="6" md="3">
              <v-card class="benefit-card" elevation="0">
                <div class="benefit-icon-wrapper">
                  <v-icon size="36" :color="benefit.color">{{ benefit.icon }}</v-icon>
                </div>
                <h3 class="benefit-title">{{ benefit.title }}</h3>
                <p class="benefit-description">{{ benefit.description }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <div class="requirements-section" id="requirements-section">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6">
              <div class="requirements-content">
                <h2 class="section-title text-left">Simple Requirements</h2>
                <p class="requirements-subtitle">Get started in just a few steps</p>

                <v-list class="requirements-list" bg-color="transparent">
                  <v-list-item v-for="req in requirements" :key="req.text">
                    <template #prepend>
                      <div class="req-check">
                        <v-icon color="#3f83c7" size="20">mdi-check-circle</v-icon>
                      </div>
                    </template>
                    <v-list-item-title>{{ req.text }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-img
                src="https://picsum.photos/500/400?random=10"
                alt="Rider Requirements"
                class="requirements-image"
                cover
              >
                <template #placeholder>
                  <div class="image-placeholder">
                    <v-progress-circular indeterminate color="#3f83c7"></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <div class="faq-section" id="faq-section">
        <v-container>
          <div class="text-center mb-8">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <p class="section-subtitle">Everything you need to know about becoming a rider</p>
          </div>

          <v-row justify="center">
            <v-col cols="12" md="8">
              <v-expansion-panels variant="accordion" class="faq-accordion">
                <v-expansion-panel v-for="(faq, index) in faqs" :key="index">
                  <v-expansion-panel-title>
                    <span class="faq-question">{{ faq.question }}</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <p class="faq-answer">{{ faq.answer }}</p>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>

    <v-dialog v-model="showRiderTermsDialog" max-width="650" persistent>
      <v-card class="terms-dialog">
        <v-card-title class="terms-header">
          <div class="terms-header-icon">
            <v-icon size="28" color="#3f83c7">mdi-file-document</v-icon>
          </div>
          <span>Rider Terms & Conditions</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="terms-content">
          <div class="terms-scrollable">
            <div class="terms-section">
              <h4>1. Eligibility Requirements</h4>
              <p>To become a rider with CloseShop, you must:</p>
              <ul>
                <li>Be at least 18 years of age or older</li>
                <li>Possess a valid government-issued ID</li>
                <li>Hold a valid driver's license (for vehicle riders)</li>
                <li>Have a clean background record with no pending criminal cases</li>
                <li>Be physically fit and capable of performing delivery duties</li>
              </ul>
            </div>

            <div class="terms-section">
              <h4>2. Vehicle and Equipment Requirements</h4>
              <p>All delivery vehicles must meet the following standards:</p>
              <ul>
                <li>Properly registered with LTO (for motor vehicles)</li>
                <li>Comprehensive insurance coverage</li>
                <li>Regular maintenance and roadworthiness</li>
                <li>Proper signage as required by CloseShop</li>
                <li>Smartphone with internet access for the rider app</li>
              </ul>
            </div>

            <div class="terms-section">
              <h4>3. Document Submission and Verification</h4>
              <p>You agree to provide accurate and verifiable documents including:</p>
              <ul>
                <li>Valid government ID (Passport, Driver's License, National ID)</li>
                <li>Proof of address (utility bill, barangay clearance)</li>
                <li>Vehicle registration and insurance (if applicable)</li>
                <li>Barangay clearance or police clearance</li>
                <li>Medical certificate (within the last 3 months)</li>
              </ul>
              <p><strong>Note:</strong> Submitting false documents will result in immediate disqualification and possible legal action.</p>
            </div>

            <div class="terms-section">
              <h4>4. Background Check Authorization</h4>
              <p>By accepting these terms, you authorize CloseShop to:</p>
              <ul>
                <li>Conduct a background check through third-party agencies</li>
                <li>Verify your identity and submitted documents</li>
                <li>Check for any history of fraud or criminal activity</li>
                <li>Contact your provided references for character verification</li>
              </ul>
            </div>

            <div class="terms-section">
              <h4>5. Code of Conduct</h4>
              <p>As a CloseShop rider, you must:</p>
              <ul>
                <li>Maintain professional and courteous behavior with customers</li>
                <li>Follow all traffic laws and safety regulations</li>
                <li>Wear the required rider identification at all times</li>
                <li>Complete deliveries within the promised time frame</li>
                <li>Handle customer orders with care and respect</li>
                <li>Not engage in any illegal activities while using the platform</li>
              </ul>
            </div>

            <div class="terms-section">
              <h4>6. Fees, Commissions, and Payouts</h4>
              <p>Understanding your earnings:</p>
              <ul>
                <li>A commission fee of 10-15% per successful delivery will be deducted</li>
                <li>Payouts are processed weekly every Monday</li>
                <li>Minimum payout amount is PHP 500</li>
                <li>Bank transfer fees may apply for certain payout methods</li>
                <li>Rates are subject to change with 30 days prior notice</li>
              </ul>
            </div>

            <div class="terms-section">
              <h4>7. Delivery Responsibilities and Liability</h4>
              <p>You are responsible for:</p>
              <ul>
                <li>Ensuring orders are delivered to the correct address</li>
                <li>Reporting any delays or issues immediately</li>
                <li>Liability for lost or damaged orders up to the order value</li>
                <li>Maintaining delivery proof (photos, signatures)</li>
                <li>Returning undelivered orders to the shop</li>
              </ul>
            </div>

            <div class="terms-section">
              <h4>8. Account Status and Termination</h4>
              <p>CloseShop reserves the right to:</p>
              <ul>
                <li>Suspend or terminate rider status for policy violations</li>
                <li>Deactivate accounts with low performance ratings</li>
                <li>Immediately terminate for fraud or illegal activities</li>
                <li>Review rider status periodically based on performance metrics</li>
              </ul>
            </div>

            <div class="terms-section">
              <h4>9. Data Privacy and Confidentiality</h4>
              <p>Your privacy is important to us. We will:</p>
              <ul>
                <li>Protect your personal information in accordance with the Data Privacy Act</li>
                <li>Not share your information with third parties without consent</li>
                <li>Use your data only for application and delivery operations</li>
                <li>Provide you access to your information upon request</li>
              </ul>
            </div>

            <div class="terms-section">
              <h4>10. Amendments to Terms</h4>
              <p>CloseShop may update these terms from time to time. You will be notified of significant changes via email or app notification. Continued use of the platform constitutes acceptance of updated terms.</p>
            </div>
          </div>

          <v-checkbox
            v-model="agreeRiderTerms"
            class="terms-checkbox mt-4"
            color="primary"
          >
            <template #label>
              <span class="terms-checkbox-label">
                I confirm that I have read, understood, and agree to all the
                <strong>Terms and Conditions</strong> outlined above. I certify that all information
                I will provide in my application is true and accurate.
              </span>
            </template>
          </v-checkbox>
        </v-card-text>
        <v-card-actions class="terms-actions">
          <v-btn
            variant="text"
            color="grey-darken-1"
            @click="closeTermsDialog"
            class="cancel-btn"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="proceedToApplication"
            :disabled="!agreeRiderTerms"
            class="agree-btn"
            size="large"
          >
            I Agree & Proceed
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showApplicationForm"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      :scrim="false"
    >
      <v-card class="application-dialog-wrapper">
        <v-toolbar color="#3f83c7" class="application-toolbar" elevation="2">
          <v-btn icon @click="closeApplicationForm" color="white">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title class="text-white">
            Application Form
          </v-toolbar-title>
        </v-toolbar>

        <div class="application-form-container">
          <ApplicationForm />
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ApplicationForm from './ApplicationForm.vue'
import {
  getCurrentAuthUser,
  getRiderRouteContext,
} from '@/utils/riderAccess'

const router = useRouter()

const drawer = ref(false)
const showRiderTermsDialog = ref(false)
const showApplicationForm = ref(false)
const agreeRiderTerms = ref(false)
const loading = ref(false)
const existingApplication = ref(null)
const riderAccessState = ref({
  blocked: false,
  reason: '',
  status: '',
  title: '',
  message: '',
})

const colorPalette = {
  primary: {
    gradient: 'linear-gradient(135deg, #3f83c7 0%, #5a95d1 100%)',
  },
}

const logoUrl = ref('/logo.png')

const navItems = [
  { title: 'MAIN WEBSITE', type: 'route', route: '/', icon: 'mdi-arrow-left-circle-outline' },
  { title: 'HOME', type: 'section', value: 'hero-section', icon: 'mdi-home' },
  { title: 'BENEFITS', type: 'section', value: 'benefits-section', icon: 'mdi-star-circle' },
  { title: 'REQUIREMENTS', type: 'section', value: 'requirements-section', icon: 'mdi-clipboard-text' },
  { title: 'FAQ', type: 'section', value: 'faq-section', icon: 'mdi-frequently-asked-questions' },
]

const heroHighlights = [
  { icon: 'mdi-calendar-clock-outline', value: '3-5 Days', label: 'Typical review time' },
  { icon: 'mdi-wallet-outline', value: 'Weekly', label: 'Rider payouts' },
  { icon: 'mdi-cellphone-check', value: 'Mobile First', label: 'Apply from your phone' },
]

const benefits = ref([
  {
    icon: 'mdi-clock-outline',
    title: 'Flexible Schedule',
    description: 'Choose your own working hours. Work when it suits you best.',
    color: '#3f83c7'
  },
  {
    icon: 'mdi-cash-multiple',
    title: 'Competitive Earnings',
    description: 'Earn competitive delivery fees plus tips from satisfied customers.',
    color: '#10b981'
  },
  {
    icon: 'mdi-shield-check',
    title: 'Insurance Coverage',
    description: 'Get protected with our rider insurance while on delivery.',
    color: '#f59e0b'
  },
  {
    icon: 'mdi-chart-line',
    title: 'Growth Opportunities',
    description: 'Advance to team leader or operations roles as you gain experience.',
    color: '#8b5cf6'
  }
])

const requirements = ref([
  { text: 'At least 18 years old with valid ID' },
  { text: 'Valid driver\'s license (for vehicle riders)' },
  { text: 'Smartphone with internet access' },
  { text: 'NBI Clearance or Police Clearance' },
  { text: 'Medical Certificate (fit to work)' },
  { text: 'Proof of address and barangay clearance' }
])

const faqs = ref([
  {
    question: 'How long does the application process take?',
    answer: 'The initial application review takes 3-5 business days. If approved, you will be scheduled for a brief orientation and verification interview. The entire process typically takes 1-2 weeks.'
  },
  {
    question: 'Do I need my own vehicle?',
    answer: 'Yes, you need your own vehicle. We accept motorcycles, scooters, bicycles, cars, and vans. For walking deliveries, you only need a smartphone with GPS capability.'
  },
  {
    question: 'What are the requirements for bicycle riders?',
    answer: 'Bicycle riders need a valid ID, proof of address, medical certificate, and NBI clearance. A driver\'s license is not required for bicycle riders.'
  },
  {
    question: 'How and when do I get paid?',
    answer: 'Payouts are processed weekly every Monday. You can receive payments via bank transfer or e-wallets (GCash, PayMaya). Minimum payout is PHP 500.'
  },
  {
    question: 'Is there a training program for new riders?',
    answer: 'Yes, approved applicants must attend a half-day orientation and training session covering app usage, delivery protocols, safety guidelines, and customer service standards.'
  },
  {
    question: 'Can I work as a rider part-time?',
    answer: 'Absolutely! Our platform allows both full-time and part-time riders. You can choose your own schedule and accept deliveries when you\'re available.'
  }
])

const primaryActionLabel = computed(() => {
  if (existingApplication.value) return 'Check Application Status'
  if (riderAccessState.value.blocked) return 'Application Unavailable'
  return 'Start Your Application'
})

const isPrimaryActionDisabled = computed(() => (
  riderAccessState.value.blocked && !existingApplication.value
))

const heroHelperText = computed(() => {
  if (existingApplication.value) {
    return 'Pick up right where you left off and review your current rider application.'
  }

  if (riderAccessState.value.blocked) {
    return riderAccessState.value.message
  }

  return 'Complete the online application, upload your documents, and our team will review everything in 3 to 5 business days.'
})

const accessAlertType = computed(() => (
  riderAccessState.value.reason === 'application_rejected' ? 'error' : 'warning'
))

const formatStatusLabel = (status = '') => (
  status
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Submitted'
)

const goToWebpage = () => {
  drawer.value = false
  router.push('/')
}

const scrollToSection = (sectionId) => {
  drawer.value = false
  const section = document.getElementById(sectionId)

  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

const handleNavAction = (item) => {
  if (item.type === 'route') {
    goToWebpage()
    return
  }

  if (item.value) {
    scrollToSection(item.value)
  }
}

const loadExistingApplication = async () => {
  try {
    const user = await getCurrentAuthUser()

    if (!user) {
      existingApplication.value = null
      riderAccessState.value = {
        blocked: false,
        reason: '',
        status: '',
        title: '',
        message: '',
      }
      return null
    }

    const { latestApplication, accessState } = await getRiderRouteContext(user.id)

    existingApplication.value = latestApplication
    riderAccessState.value = accessState
    return existingApplication.value
  } catch (error) {
    console.error('Error loading rider application:', error)
    existingApplication.value = null
    riderAccessState.value = {
      blocked: false,
      reason: '',
      status: '',
      title: '',
      message: '',
    }
    return null
  }
}

const openTermsDialog = () => {
  showRiderTermsDialog.value = true
}

const closeTermsDialog = () => {
  showRiderTermsDialog.value = false
  agreeRiderTerms.value = false
}

const proceedToApplication = () => {
  if (riderAccessState.value.blocked) {
    showRiderTermsDialog.value = false
    return
  }

  showRiderTermsDialog.value = false
  showApplicationForm.value = true
  agreeRiderTerms.value = false
}

const handlePrimaryAction = async () => {
  loading.value = true

  try {
    const application = await loadExistingApplication()

    if (application) {
      router.push({
        name: 'application-status',
        params: { applicationId: application.rider_id }
      })
      return
    }

    if (riderAccessState.value.blocked) {
      return
    }

    openTermsDialog()
  } finally {
    loading.value = false
  }
}

const closeApplicationForm = () => {
  showApplicationForm.value = false
}

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'auto'
  })

  loadExistingApplication()
})
</script>

<style scoped>
.rider-portal-main {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding-top: 0;
}

.modern-navbar {
  background: linear-gradient(135deg, #2f507b 0%, #1b334a 25%, #101c29 50%, #0c1b2b 75%, #1e3a5f 100%) !important;
  background-size: 300% 300% !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  animation: gradientShift 8s ease infinite;
}

.modern-navbar :deep(.v-toolbar__content) {
  padding-inline: 12px 18px;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.nav-logo {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.nav-logo-clickable,
.app-title-clickable {
  cursor: pointer;
}

.nav-logo:hover {
  transform: scale(1.05) rotate(5deg);
}

.app-title {
  font-size: clamp(1.25rem, 4vw, 1.5rem) !important;
  font-weight: 800 !important;
  letter-spacing: -0.3px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-right: 0.5rem;
}

.website-nav-btn {
  background: rgba(255, 255, 255, 0.08) !important;
}

.desktop-nav-btn {
  position: relative;
  min-width: auto !important;
  width: auto !important;
  padding: 8px 18px !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px;
  white-space: nowrap;
  text-transform: none !important;
  opacity: 0.85;
  transition: all 0.3s ease !important;
  border-radius: 40px !important;
  overflow: hidden;
}

.desktop-nav-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.desktop-nav-btn:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

.desktop-nav-btn:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.desktop-nav-btn .nav-text {
  position: relative;
  z-index: 1;
}

.nav-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, white, transparent);
  border-radius: 2px;
  transform: translateX(-50%);
  transition: width 0.3s ease;
  z-index: 1;
}

.desktop-nav-btn:hover .nav-indicator {
  width: 70%;
}

.portal-drawer :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 18px 16px;
}

.drawer-logo {
  flex-shrink: 0;
}

.drawer-brand {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.drawer-title {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.drawer-caption {
  font-size: 0.82rem;
  color: #64748b;
}

.responsive-drawer-item {
  margin: 6px 10px;
  border-radius: 16px;
}

.responsive-drawer-item:hover {
  background: rgba(63, 131, 199, 0.08);
}

.responsive-drawer-item .responsive-list-text {
  font-size: 0.95rem !important;
  font-weight: 600;
}

.hero-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 72px 20px 84px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  box-shadow: 0 26px 60px rgba(15, 23, 42, 0.18);
}

.hero-section,
.benefits-section,
.requirements-section,
.faq-section {
  scroll-margin-top: 110px;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(63, 131, 199, 0.15) 0%, transparent 70%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-top-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}

.status-chip {
  display: inline-flex;
  max-width: 100%;
  border-radius: 999px !important;
  font-weight: 700;
  color: #0f172a !important;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
}

.status-chip :deep(.v-chip__content) {
  white-space: normal;
  text-align: center;
  justify-content: center;
  line-height: 1.4;
}

.hero-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 0;
}

.hero-icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: rgba(63, 131, 199, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulseRing 2s ease-out infinite;
}

@keyframes pulseRing {
  0% {
    width: 60px;
    height: 60px;
    opacity: 0.8;
  }
  100% {
    width: 120px;
    height: 120px;
    opacity: 0;
  }
}

.hero-icon {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto 32px auto;
  line-height: 1.6;
}

.hero-helper-text {
  max-width: 620px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.portal-access-alert {
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}

.portal-access-alert-text {
  margin-top: 6px;
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.start-application-btn {
  padding: 12px 32px !important;
  font-weight: 700 !important;
  font-size: 1.125rem !important;
  text-transform: none !important;
  border-radius: 50px !important;
  box-shadow: 0 8px 20px rgba(63, 131, 199, 0.3) !important;
  transition: all 0.3s ease !important;
}

.start-application-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(63, 131, 199, 0.4) !important;
}

.secondary-hero-btn {
  border-color: rgba(255, 255, 255, 0.35) !important;
  color: white !important;
  background: rgba(255, 255, 255, 0.04) !important;
  text-transform: none !important;
  font-weight: 700 !important;
  border-radius: 50px !important;
}

.secondary-hero-btn:hover {
  background: rgba(255, 255, 255, 0.08) !important;
}

.hero-highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.hero-highlight-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: white;
  backdrop-filter: blur(10px);
}

.hero-highlight-card strong {
  font-size: 1rem;
  font-weight: 800;
}

.hero-highlight-card span {
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.76);
}

.benefits-section {
  padding: 60px 0;
  background: white;
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 1rem;
  color: #64748b;
}

.benefit-card {
  text-align: center;
  padding: 32px 20px;
  border-radius: 24px;
  transition: all 0.3s ease;
  height: 100%;
  background: white;
  border: 1px solid rgba(63, 131, 199, 0.1);
}

.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(63, 131, 199, 0.1);
  border-color: rgba(63, 131, 199, 0.3);
}

.benefit-icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(63, 131, 199, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  transition: all 0.3s ease;
}

.benefit-card:hover .benefit-icon-wrapper {
  transform: scale(1.05);
  background: rgba(63, 131, 199, 0.15);
}

.benefit-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.benefit-description {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

.requirements-section {
  padding: 60px 0;
  background: #f8fafc;
}

.requirements-content {
  padding: 20px;
}

.requirements-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 32px;
}

.requirements-list {
  background: transparent;
}

.req-check {
  margin-right: 12px;
}

.requirements-list .v-list-item {
  padding: 8px 0;
}

.requirements-image {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.image-placeholder {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
}

.faq-section {
  padding: 60px 0;
  background: white;
}

.faq-accordion {
  border-radius: 24px;
  overflow: hidden;
}

.faq-question {
  font-weight: 600;
  color: #0f172a;
}

.faq-answer {
  color: #475569;
  line-height: 1.6;
}

.terms-dialog {
  border-radius: 28px !important;
  overflow: hidden;
}

.terms-header {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  font-size: 1.5rem;
  font-weight: 700;
}

.terms-header-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.terms-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.terms-scrollable {
  padding-right: 8px;
}

.terms-section {
  margin-bottom: 24px;
}

.terms-section h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.terms-section p {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 12px;
}

.terms-section ul {
  margin: 8px 0 0 20px;
  padding-left: 0;
}

.terms-section li {
  font-size: 0.875rem;
  color: #475569;
  margin-bottom: 6px;
}

.terms-checkbox {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.terms-checkbox-label {
  font-size: 0.875rem;
  color: #334155;
}

.terms-actions {
  padding: 16px 24px;
  gap: 12px;
}

.agree-btn {
  min-width: 180px;
  font-weight: 600 !important;
}

.application-dialog-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.application-toolbar {
  flex-shrink: 0;
}

.application-form-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

@media (max-width: 959px) {
  .desktop-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 52px 16px 56px;
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
  }

  .hero-top-stack {
    padding-top: calc(env(safe-area-inset-top, 0px) + 44px);
  }

  .status-chip {
    max-width: min(100%, 360px);
    height: auto !important;
    padding: 8px 14px !important;
  }

  .benefits-section,
  .requirements-section,
  .faq-section {
    padding: 40px 0;
  }

  .benefit-card {
    padding: 24px 16px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-highlights {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .terms-actions {
    flex-direction: column;
  }

  .agree-btn {
    width: 100%;
  }

  .application-form-container {
    padding: 12px;
  }

  .modern-navbar :deep(.v-toolbar__content) {
    padding-inline: 8px 12px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle,
  .hero-helper-text {
    font-size: 0.875rem;
  }

  .start-application-btn {
    width: 100%;
  }

  .secondary-hero-btn {
    width: 100%;
  }

  .status-chip {
    max-width: 100%;
    height: auto !important;
    padding: 8px 12px !important;
  }
}
</style>
