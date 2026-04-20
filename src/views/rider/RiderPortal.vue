<template>
  <v-app>
    <v-main class="rider-portal-main">
      <!-- Hero Section -->
      <div class="hero-section" id="hero-section">
        <div class="hero-content">
          <div class="hero-icon-wrapper">
            <div class="hero-icon-pulse"></div>
            <v-icon size="80" color="#3f83c7" class="hero-icon">mdi-motorbike</v-icon>
          </div>
          <h1 class="hero-title">Become a Rider Partner</h1>
          <p class="hero-subtitle">
            Join our growing fleet of delivery partners and start earning today.
            Deliver for local businesses and be your own boss.
          </p>
          <v-btn
            class="start-application-btn"
            size="x-large"
            color="primary"
            @click="openTermsDialog"
            :loading="loading"
          >
            <v-icon left>mdi-file-document-outline</v-icon>
            Start Your Application
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="benefits-section">
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

      <!-- Requirements Section -->
      <div class="requirements-section">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6">
              <div class="requirements-content">
                <h2 class="section-title text-left">Simple Requirements</h2>
                <p class="requirements-subtitle">Get started in just a few steps</p>
                <v-list class="requirements-list" bg-color="transparent">
                  <v-list-item v-for="req in requirements" :key="req.text">
                    <template v-slot:prepend>
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
                <template v-slot:placeholder>
                  <div class="image-placeholder">
                    <v-progress-circular indeterminate color="#3f83c7"></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section">
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

    <!-- Rider Terms and Conditions Dialog -->
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
                <li>Minimum payout amount is ₱500</li>
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
            <template v-slot:label>
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

    <!-- Application Form Dialog - Integrated with your existing form -->
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

        <!-- Your existing ApplicationForm component integrated here -->
        <div class="application-form-container">
          <ApplicationForm @application-complete="handleApplicationComplete" />
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ApplicationForm from './ApplicationForm.vue'
import { onMounted } from 'vue'

onMounted(() => {
  // Scroll to top when component mounts
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  })
})

const router = useRouter()
const emit = defineEmits(['close'])

// Dialog states
const showRiderTermsDialog = ref(false)
const showApplicationForm = ref(false)
const agreeRiderTerms = ref(false)
const loading = ref(false)

// Benefits data
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

// Requirements data
const requirements = ref([
  { text: 'At least 18 years old with valid ID' },
  { text: 'Valid driver\'s license (for vehicle riders)' },
  { text: 'Smartphone with internet access' },
  { text: 'NBI Clearance or Police Clearance' },
  { text: 'Medical Certificate (fit to work)' },
  { text: 'Proof of address and barangay clearance' }
])

// FAQ data
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
    answer: 'Payouts are processed weekly every Monday. You can receive payments via bank transfer or e-wallets (GCash, PayMaya). Minimum payout is ₱500.'
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

// Methods
const openTermsDialog = () => {
  showRiderTermsDialog.value = true
}

const closeTermsDialog = () => {
  showRiderTermsDialog.value = false
  agreeRiderTerms.value = false
}

const proceedToApplication = () => {
  showRiderTermsDialog.value = false
  showApplicationForm.value = true
  agreeRiderTerms.value = false
}

const closeApplicationForm = () => {
  showApplicationForm.value = false
  emit('close')
}

const handleApplicationComplete = () => {
  // Handle successful application submission
  showApplicationForm.value = false
  emit('close')

  // Optional: Show success message or navigate
  setTimeout(() => {
    router.push('/profile')
  }, 500)
}
</script>

<style scoped>
.rider-portal-main {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 80px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(63, 131, 199, 0.15) 0%, transparent 70%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
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

/* Benefits Section */
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

/* Requirements Section */
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

/* FAQ Section */
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

/* Terms Dialog */
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

/* Application Dialog */
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

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 16px;
  }

  .benefits-section,
  .requirements-section,
  .faq-section {
    padding: 40px 0;
  }

  .benefit-card {
    padding: 24px 16px;
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
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 0.875rem;
  }

  .start-application-btn {
    width: 100%;
  }
}
</style>
