<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'
import {
  getCurrentAuthUser,
  getRiderAccessState,
  getLatestRiderApplication,
  getOwnedRiderApplicationById,
} from '@/utils/riderAccess'

const router = useRouter()
const route = useRoute()
const logoUrl = '/logo.png'

const applicationId = ref(route.params.applicationId || '')
const application = ref(null)
const loading = ref(true)
const error = ref(null)
const riderProfile = ref(null)
const userProfile = ref({
  name: '',
  email: '',
  avatar: '',
})

const buildAvatarUrl = (name) => (
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Rider Partner')}&background=3f83c7&color=fff`
)

const normalizedStatus = computed(() => application.value?.status || 'submitted')

const statusLabel = computed(() => (
  normalizedStatus.value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Submitted'
))

const userDisplayName = computed(() => {
  if (userProfile.value.name) return userProfile.value.name

  const applicationName = `${application.value?.first_name || ''} ${application.value?.last_name || ''}`.trim()
  return applicationName || 'Rider Partner'
})

const userEmail = computed(() => (
  userProfile.value.email || application.value?.email || ''
))

const userAvatar = computed(() => (
  userProfile.value.avatar || buildAvatarUrl(userDisplayName.value)
))

const accessState = computed(() => (
  getRiderAccessState({
    profile: riderProfile.value,
    application: application.value,
  })
))

const statusMeta = computed(() => {
  switch (normalizedStatus.value) {
    case 'approved':
      return {
        chipColor: 'success',
        icon: 'mdi-badge-account-horizontal',
        title: 'Application Approved!',
        description: 'Congratulations. Your rider application has been approved and you are ready for the next onboarding steps.',
      }
    case 'under_review':
      return {
        chipColor: 'primary',
        icon: 'mdi-progress-clock',
        title: 'Application Under Review',
        description: 'Our team is reviewing your documents and rider details. We will notify you as soon as a decision is made.',
      }
    case 'interview_scheduled':
      return {
        chipColor: 'warning',
        icon: 'mdi-calendar-clock',
        title: 'Interview Scheduled',
        description: 'You passed the first review stage. Please prepare for your scheduled rider interview.',
      }
    case 'pending':
      return {
        chipColor: 'warning',
        icon: 'mdi-timer-sand',
        title: 'Application Pending',
        description: 'Your application is safely in queue. Please keep your phone and email accessible while the review is ongoing.',
      }
    case 'rejected':
      return {
        chipColor: 'error',
        icon: 'mdi-close-circle',
        title: 'Application Not Approved',
        description: 'Your most recent rider application was rejected by the admin team. New rider applications are disabled for this account unless support advises otherwise.',
      }
    case 'deactivated':
    case 'inactive':
    case 'disabled':
    case 'suspended':
    case 'blocked':
    case 'banned':
      return {
        chipColor: 'error',
        icon: 'mdi-account-cancel-outline',
        title: 'Rider Access Disabled',
        description: 'Your rider application or rider account has been disabled by an administrator. New rider applications are unavailable for this account.',
      }
    default:
      return {
        chipColor: 'primary',
        icon: 'mdi-check-decagram',
        title: 'Application Submitted!',
        description: 'Thank you for applying to become a CloseShop rider partner. We have received your application successfully.',
      }
  }
})

const reviewMessage = computed(() => {
  if (normalizedStatus.value === 'interview_scheduled') {
    return 'Bring your original documents and arrive a few minutes early for your interview schedule.'
  }

  if (normalizedStatus.value === 'pending' || normalizedStatus.value === 'under_review') {
    return 'Typical review time is 3 to 5 business days. We will update you by email and SMS once there is movement.'
  }

  return ''
})

const shouldShowTimeline = computed(() => (
  ['submitted', 'pending', 'under_review'].includes(normalizedStatus.value)
))

const timelineSteps = [
  {
    title: 'Application received',
    description: 'We have received your rider application.',
    tone: 'success',
  },
  {
    title: 'Under review',
    description: 'Our team checks your information and uploaded documents.',
    tone: 'primary',
  },
  {
    title: 'Interview schedule',
    description: 'Qualified applicants receive interview instructions.',
    tone: 'warning',
  },
  {
    title: 'Final approval',
    description: 'You receive confirmation by email and SMS.',
    tone: 'muted',
  },
]

const formatDate = (dateString) => {
  if (!dateString) return 'Not scheduled'

  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'Unavailable'

  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const goHome = () => {
  router.push('/rider-portal')
}

const contactSupport = () => {
  window.location.href = 'mailto:support@closeshop.com?subject=Rider Application Inquiry'
}

const loadUserProfile = async (user) => {
  if (!user) return

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    riderProfile.value = profile || null

    const name = `${profile?.first_name || user.user_metadata?.first_name || ''} ${profile?.last_name || user.user_metadata?.last_name || ''}`.trim()

    userProfile.value = {
      name: name || user.user_metadata?.full_name || '',
      email: profile?.email || user.email || '',
      avatar: profile?.avatar_url || user.user_metadata?.avatar_url || '',
    }
  } catch (profileError) {
    console.error('Error loading user profile:', profileError)
  }
}

const loadApplication = async () => {
  loading.value = true
  error.value = null

  try {
    const user = await getCurrentAuthUser()

    if (!user) {
      await router.replace({
        name: 'login',
        query: { redirect: route.fullPath },
      })
      return
    }

    await loadUserProfile(user)

    let riderApplication = null

    if (applicationId.value) {
      riderApplication = await getOwnedRiderApplicationById(user.id, applicationId.value)
    }

    if (!riderApplication) {
      riderApplication = await getLatestRiderApplication(user.id)
    }

    if (!riderApplication) {
      throw new Error('We could not find a rider application linked to this account.')
    }

    application.value = riderApplication
    applicationId.value = riderApplication.rider_id || applicationId.value
  } catch (loadError) {
    console.error('Error loading application:', loadError)
    error.value = loadError.message || 'Unable to load your rider application.'
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  try {
    await supabase.auth.signOut()
    localStorage.removeItem('lastRiderApplication')
    router.push('/login')
  } catch (logoutError) {
    console.error('Error logging out:', logoutError)
  }
}

onMounted(() => {
  loadApplication()
})
</script>

<template>
  <v-app class="status-page">
    <v-app-bar flat class="status-app-bar">
      <div class="status-app-start">
        <v-img
          :src="logoUrl"
          alt="Closeshop Logo"
          max-height="38"
          max-width="38"
          class="status-app-logo"
          contain
        ></v-img>
        <div class="status-app-brand">
          <span class="status-app-title">CloseShop</span>
          <span class="status-app-subtitle">Rider Application</span>
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-btn variant="text" color="white" prepend-icon="mdi-arrow-left" @click="goHome" class="status-app-back">
        Rider Portal
      </v-btn>

      <v-menu location="bottom end" offset="12">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="status-app-avatar-trigger" rounded="0">
            <div class="avatar-menu-shell">
              <v-avatar size="48" class="identity-avatar">
                <v-img :src="userAvatar" :alt="`${userDisplayName} avatar`"></v-img>
              </v-avatar>
              <span class="avatar-menu-indicator">
                <v-icon size="14">mdi-chevron-down</v-icon>
              </span>
            </div>
          </v-btn>
        </template>

        <v-list class="account-menu" density="comfortable" min-width="220">
          <v-list-item>
            <template #prepend>
              <v-avatar size="36">
                <v-img :src="userAvatar" :alt="`${userDisplayName} avatar`"></v-img>
              </v-avatar>
            </template>
            <v-list-item-title>{{ userDisplayName }}</v-list-item-title>
            <v-list-item-subtitle>{{ userEmail || 'Signed in rider' }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="logout"
          ></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="status-main">
      <div class="status-shell">
        <v-row justify="center">
          <v-col cols="12" xl="10" lg="10" md="11">
          <section class="identity-panel">
            <div class="identity-main">
              <div class="identity-copy">
                <p class="identity-eyebrow">Rider application status</p>
                <h1 class="identity-name">{{ userDisplayName }}</h1>
                <p class="identity-email">
                  {{ userEmail || 'Application updates and next steps appear here.' }}
                </p>
                <p class="identity-hint">
                  Track every review step, interview schedule, and approval update in one place.
                </p>
              </div>
            </div>

            <div class="identity-actions">
              <div class="meta-pill">
                <span class="meta-pill-label">Reference</span>
                <strong class="meta-pill-value ref-number">{{ application?.rider_id || applicationId || 'Pending' }}</strong>
              </div>
              <div class="meta-pill" :class="`meta-pill--${normalizedStatus}`">
                <span class="meta-pill-label">Status</span>
                <strong class="meta-pill-value">{{ statusLabel }}</strong>
              </div>
            </div>
          </section>

          <section v-if="loading" class="state-shell">
            <v-progress-circular indeterminate color="primary" size="52"></v-progress-circular>
            <p class="state-title">Loading application status...</p>
            <p class="state-subtitle">Please wait while we pull the latest rider update.</p>
          </section>

          <section v-else-if="error" class="panel panel--error">
            <div class="panel-head panel-head--error">
              <v-icon size="34" color="error">mdi-alert-circle</v-icon>
              <div>
                <h2 class="status-title">Unable to Load Application</h2>
                <p class="status-description">{{ error }}</p>
              </div>
            </div>

            <div class="action-buttons">
              <v-btn color="primary" size="large" @click="goHome" prepend-icon="mdi-home">
                Back to Rider Portal
              </v-btn>
              <v-btn variant="outlined" size="large" @click="contactSupport">
                Contact Support
              </v-btn>
            </div>
          </section>

          <div v-else-if="application" class="content-shell">
            <section class="panel panel--status" :class="`panel--${normalizedStatus}`">
              <div class="status-hero">
                <div class="status-icon-badge" :class="`status-${normalizedStatus}`">
                  <v-icon size="28" color="white">{{ statusMeta.icon }}</v-icon>
                </div>

                <div class="status-copy">
                  <p class="status-kicker">{{ statusLabel }}</p>
                  <h2 class="status-title">{{ statusMeta.title }}</h2>
                  <p class="status-description">{{ statusMeta.description }}</p>
                </div>
              </div>

              <div class="facts-grid">
                <div class="fact-item">
                  <span class="fact-label">Application reference</span>
                  <span class="fact-value ref-number">{{ application.rider_id || applicationId }}</span>
                </div>
                <div class="fact-item">
                  <span class="fact-label">Submitted</span>
                  <span class="fact-value">{{ formatDateTime(application.application_date) }}</span>
                </div>
                <div class="fact-item">
                  <span class="fact-label">Current status</span>
                  <span class="fact-value">{{ statusLabel }}</span>
                </div>
              </div>

              <div v-if="reviewMessage" class="inline-note">
                <v-icon size="18" color="primary">mdi-information-outline</v-icon>
                <span>{{ reviewMessage }}</span>
              </div>

              <section v-if="normalizedStatus === 'approved'" class="detail-section">
                <h3 class="detail-title">What happens next</h3>
                <ul class="detail-list">
                  <li>Download the CloseShop Rider App from Google Play.</li>
                  <li>Log in using your registered email address.</li>
                  <li>Complete your final rider profile setup and onboarding tasks.</li>
                  <li>Start accepting delivery requests once your account is activated.</li>
                </ul>
              </section>

              <section v-else-if="normalizedStatus === 'interview_scheduled'" class="detail-section">
                <h3 class="detail-title">Interview details</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">{{ formatDate(application.interview_date) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Time</span>
                    <span class="detail-value">{{ application.interview_time || 'To be confirmed' }}</span>
                  </div>
                  <div class="detail-item detail-item-wide">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">{{ application.interview_location || 'CloseShop Office' }}</span>
                  </div>
                </div>
              </section>

              <section v-else-if="accessState.blocked" class="detail-section detail-section--danger">
                <h3 class="detail-title">{{ accessState.title }}</h3>
                <p class="detail-reason">
                  {{ accessState.message }}
                </p>
                <ul class="detail-list compact-list">
                  <li>New rider applications are currently disabled for this account.</li>
                  <li>Review the admin decision and keep the application reference for support follow-up.</li>
                  <li>Contact support if you believe this decision needs clarification or correction.</li>
                </ul>
              </section>

              <section v-else-if="shouldShowTimeline" class="detail-section">
                <h3 class="detail-title">What happens next</h3>
                <div class="timeline-list">
                  <div v-for="step in timelineSteps" :key="step.title" class="timeline-item">
                    <span class="timeline-dot" :class="`timeline-dot--${step.tone}`"></span>
                    <div class="timeline-copy">
                      <strong>{{ step.title }}</strong>
                      <p>{{ step.description }}</p>
                    </div>
                  </div>
                </div>
              </section>

              <div class="action-buttons">
                <template v-if="accessState.blocked">
                  <v-btn variant="outlined" size="large" @click="goHome" prepend-icon="mdi-home">
                    Back to Rider Portal
                  </v-btn>
                  <v-btn variant="outlined" size="large" @click="contactSupport">
                    Contact Support
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn variant="outlined" size="large" @click="goHome" prepend-icon="mdi-home">
                    Back to Rider Portal
                  </v-btn>
                  <v-btn variant="text" size="large" color="primary" @click="contactSupport" prepend-icon="mdi-email-fast">
                    Contact Support
                  </v-btn>
                </template>
              </div>
            </section>

            <section class="support-strip">
              <v-icon color="primary" size="18">mdi-help-circle-outline</v-icon>
              <span>Need help?</span>
              <a href="mailto:support@closeshop.com" class="help-link">
                closeshop8600@gmail.com
              </a>
            </section>
          </div>
        </v-col>
      </v-row>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.status-page {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(63, 131, 199, 0.08), transparent 180px),
    #f8fafc;
}

.status-app-bar {
  background: linear-gradient(135deg, #3f83c7 0%, #2f6fb6 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 12px 28px rgba(47, 111, 182, 0.18);
}

.status-app-bar :deep(.v-toolbar__content) {
  padding-inline: 16px;
  gap: 12px;
}

.status-app-start {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.status-app-logo {
  flex-shrink: 0;
}

.status-app-brand {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.status-app-title {
  font-size: 1rem;
  font-weight: 800;
  color: white;
  line-height: 1.1;
}

.status-app-subtitle {
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.76);
}

.status-app-back {
  font-weight: 600 !important;
  text-transform: none !important;
}

.status-app-avatar-trigger {
  min-width: auto !important;
  padding: 0 !important;
  height: auto !important;
}

.status-main {
  background: transparent;
}

.status-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 16px 56px;
}

.identity-panel,
.panel,
.state-shell,
.support-strip {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #dbe4ef;
  border-radius: 0;
}

.identity-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  padding: 12px 0 24px;
  margin-bottom: 28px;
  border-left: 0;
  background: transparent;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid #dbe4ef;
}

.identity-main {
  display: flex;
  align-items: center;
  min-width: 0;
}

.avatar-menu-shell {
  position: relative;
  display: inline-flex;
}

.identity-avatar {
  border: 2px solid rgba(63, 131, 199, 0.18);
}

.avatar-menu-indicator {
  position: absolute;
  right: -4px;
  bottom: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: white;
  color: #334155;
}

.identity-copy {
  min-width: 0;
}

.identity-eyebrow {
  margin: 0 0 8px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #3f83c7;
}

.identity-name {
  margin: 0 0 8px;
  font-size: clamp(1.45rem, 3vw, 1.95rem);
  line-height: 1.1;
  overflow-wrap: anywhere;
  color: #0f172a;
}

.identity-email {
  margin: 0;
  color: #64748b;
  overflow-wrap: anywhere;
}

.identity-hint {
  margin: 10px 0 0;
  max-width: 620px;
  color: #475569;
  line-height: 1.65;
}

.identity-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-left: auto;
}

.meta-pill {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 0;
  min-width: 140px;
}

.meta-pill-label {
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.meta-pill-value {
  font-size: 0.96rem;
  font-weight: 700;
  color: #0f172a;
}

.account-menu {
  border: 1px solid #dbe4ef;
}

.state-shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  text-align: center;
  padding: 40px 24px;
}

.state-title {
  margin: 18px 0 8px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
}

.state-subtitle {
  margin: 0;
  color: #64748b;
}

.content-shell {
  display: grid;
  gap: 20px;
}

.panel {
  padding: 28px 0 4px;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  border-bottom: 1px solid #dbe4ef;
  background: transparent;
}

.panel-head,
.status-hero {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}

.status-icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 0;
  flex-shrink: 0;
}

.status-approved {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.status-under_review,
.status-submitted {
  background: linear-gradient(135deg, #3f83c7, #2563eb);
}

.status-interview_scheduled,
.status-pending {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
}

.status-rejected {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.status-copy {
  min-width: 0;
}

.status-kicker {
  margin: 0 0 8px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #3f83c7;
}

.status-title {
  margin: 0 0 8px;
  font-size: clamp(1.45rem, 3vw, 2rem);
  line-height: 1.1;
  color: #0f172a;
}

.status-description {
  margin: 0;
  color: #64748b;
  line-height: 1.65;
  max-width: 700px;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.fact-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 0;
}

.fact-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.fact-value {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  overflow-wrap: anywhere;
}

.ref-number {
  font-family: 'Courier New', monospace;
  color: #2563eb;
}

.inline-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
  padding: 14px 0;
  color: #475569;
  background: rgba(248, 250, 252, 0.8);
}

.detail-section {
  margin-bottom: 20px;
  padding: 18px 0 0;
  border-top: 1px solid #e2e8f0;
}

.detail-title {
  margin: 0 0 14px;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.detail-list {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  line-height: 1.7;
}

.compact-list {
  margin-top: 14px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 0;
}

.detail-item-wide {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.detail-value {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  overflow-wrap: anywhere;
}

.detail-reason {
  margin: 0;
  color: #475569;
  line-height: 1.7;
}

.detail-section--danger {
  border-top-color: rgba(239, 68, 68, 0.18);
}

.timeline-list {
  display: grid;
  gap: 14px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 12px;
  align-items: start;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  background: #cbd5e1;
}

.timeline-dot--success {
  background: #22c55e;
}

.timeline-dot--primary {
  background: #3f83c7;
}

.timeline-dot--warning {
  background: #f59e0b;
}

.timeline-dot--muted {
  background: #94a3b8;
}

.timeline-copy strong {
  display: block;
  margin-bottom: 4px;
  color: #0f172a;
}

.timeline-copy p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.support-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 0;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid #dbe4ef;
  background: transparent;
}

.help-link {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}

.help-link:hover {
  text-decoration: underline;
}

@media (max-width: 960px) {
  .facts-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-item-wide {
    grid-column: auto;
  }
}

@media (max-width: 768px) {
  .status-shell {
    padding: 16px 12px 40px;
  }

  .identity-panel,
  .identity-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .identity-actions {
    width: 100%;
    margin-left: 0;
    justify-content: flex-start;
  }

  .panel-head,
  .status-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .status-app-back {
    padding-inline: 8px !important;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .v-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .meta-pill {
    width: 100%;
  }

  .status-app-subtitle {
    display: none;
  }

  .status-app-back {
    min-width: auto !important;
  }

  .identity-name {
    font-size: 1.55rem;
  }

  .status-icon-badge {
    width: 54px;
    height: 54px;
  }

  .status-title {
    font-size: 1.6rem;
  }

  .support-strip {
    align-items: flex-start;
  }
}
</style>
