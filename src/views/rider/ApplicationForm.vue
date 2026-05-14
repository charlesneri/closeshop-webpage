<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import {
  getCurrentAuthUser,
  getRiderRouteContext,
} from '@/utils/riderAccess'

const router = useRouter()

// Stepper state
const currentStep = ref(1)
const personalValid = ref(false)
const vehicleValid = ref(false)
const documentsValid = ref(false)
const submitting = ref(false)
const agreeTerms = ref(false)
const showTermsDialog = ref(false)
const isLoggedIn = ref(false)
const userProfile = ref(null)
const accessState = ref({
  blocked: false,
  reason: '',
  status: '',
  title: '',
  message: '',
})
const latestApplication = ref(null)

// File selection dialog
const showFileOptionsDialog = ref(false)
const currentFileField = ref('')

// Camera state
const showCameraDialog = ref(false)
const video = ref(null)
let stream = null

// Form references
const personalForm = ref(null)
const vehicleForm = ref(null)
const documentsForm = ref(null)

// File input refs
const validIdInput = ref(null)
const driversLicenseInput = ref(null)
const orCrInput = ref(null)
const nbiClearanceInput = ref(null)

// PSGC Address Data
const provinces = ref([])
const cities = ref([])
const barangays = ref([])
const loadingProvinces = ref(false)
const loadingCities = ref(false)
const loadingBarangays = ref(false)

// Form data
const personalInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street_address: '',
  province_code: '',
  province_name: '',
  city_code: '',
  city_name: '',
  barangay_code: '',
  barangay_name: '',
  birthdate: null,
  gender: '',
})

const vehicleInfo = ref({
  vehicleType: '',
  brand: '',
  model: '',
  year: '',
  color: '',
  plateNumber: '',
  orCrNumber: '',
})

const documents = ref({
  validId: null,
  validIdPreview: null,
  driversLicense: null,
  driversLicensePreview: null,
  orCr: null,
  orCrPreview: null,
  nbiClearance: null,
  nbiClearancePreview: null,
})

const stepSummaries = [
  { value: 1, title: 'Personal Info', shortTitle: 'Profile' },
  { value: 2, title: 'Vehicle Details', shortTitle: 'Vehicle' },
  { value: 3, title: 'Documents', shortTitle: 'Docs' },
  { value: 4, title: 'Review & Submit', shortTitle: 'Review' },
]

const formProgress = computed(() => (currentStep.value / stepSummaries.length) * 100)
const uploadedRequiredDocuments = computed(() => (
  ['validId', 'driversLicense', 'orCr'].filter((field) => !!documents.value[field]).length
))
const progressLabel = computed(() => {
  const activeStep = stepSummaries.find((step) => step.value === currentStep.value)
  return activeStep?.title || 'Application'
})

const blockedAlertType = computed(() => (
  accessState.value.reason === 'application_rejected' ? 'error' : 'warning'
))

// Vehicle options
const vehicleTypes = [
  'Motorcycle - Under 200cc',
  'Motorcycle - 200cc and above',
  'Scooter',
  'Electric Bike',
  'Car',
  'Van',
  'Bicycle',
]

// Validation rules
const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'Invalid email address',
  phone: (v) => /^09\d{9}$/.test(v) || 'Invalid phone number (must be 09XXXXXXXXX)',
  age: (v) => {
    if (!v) return 'Birthdate is required'
    const birthDate = new Date(v)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 18 || 'You must be at least 18 years old'
  },
  year: (v) => {
    if (!v) return true
    const year = parseInt(v)
    const currentYear = new Date().getFullYear()
    return (year >= 1990 && year <= currentYear) || `Year must be between 1990 and ${currentYear}`
  },
  plateNumber: (v) => {
    if (!v) return true
    return /^[A-Z0-9]{3,10}$/.test(v) || 'Invalid plate number format'
  },
}

// PSGC API Functions
const fetchProvinces = async () => {
  loadingProvinces.value = true
  try {
    const response = await fetch('https://psgc.gitlab.io/api/provinces/')
    const data = await response.json()
    provinces.value = data.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching provinces:', error)
  } finally {
    loadingProvinces.value = false
  }
}

const fetchCities = async (provinceCode) => {
  loadingCities.value = true
  cities.value = []
  personalInfo.value.city_code = ''
  personalInfo.value.city_name = ''
  barangays.value = []
  personalInfo.value.barangay_code = ''
  personalInfo.value.barangay_name = ''

  try {
    const response = await fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`)
    const data = await response.json()
    cities.value = data.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching cities:', error)
  } finally {
    loadingCities.value = false
  }
}

const fetchBarangays = async (cityCode) => {
  loadingBarangays.value = true
  barangays.value = []
  personalInfo.value.barangay_code = ''
  personalInfo.value.barangay_name = ''

  try {
    const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`)
    const data = await response.json()
    barangays.value = data.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching barangays:', error)
  } finally {
    loadingBarangays.value = false
  }
}

// Watch for selections
watch(() => personalInfo.value.province_code, (newProvinceCode) => {
  if (newProvinceCode) {
    const selectedProvince = provinces.value.find(p => p.code === newProvinceCode)
    personalInfo.value.province_name = selectedProvince?.name || ''
    fetchCities(newProvinceCode)
  }
})

watch(() => personalInfo.value.city_code, (newCityCode) => {
  if (newCityCode) {
    const selectedCity = cities.value.find(c => c.code === newCityCode)
    personalInfo.value.city_name = selectedCity?.name || ''
    fetchBarangays(newCityCode)
  }
})

watch(() => personalInfo.value.barangay_code, (newBarangayCode) => {
  if (newBarangayCode) {
    const selectedBarangay = barangays.value.find(b => b.code === newBarangayCode)
    personalInfo.value.barangay_name = selectedBarangay?.name || ''
  }
})

// Watch for document changes
watch(documents, () => {
  documentsValid.value = !!documents.value.validId && !!documents.value.driversLicense && !!documents.value.orCr
}, { deep: true })

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getFileName = (file) => {
  if (!file) return ''
  if (file.name) return file.name
  return 'Photo captured'
}

const getFullAddress = () => {
  const parts = []
  if (personalInfo.value.street_address) parts.push(personalInfo.value.street_address)
  if (personalInfo.value.barangay_name) parts.push(personalInfo.value.barangay_name)
  if (personalInfo.value.city_name) parts.push(personalInfo.value.city_name)
  if (personalInfo.value.province_name) parts.push(personalInfo.value.province_name)
  return parts.join(', ')
}

const goToStatusPage = () => {
  if (!latestApplication.value?.rider_id) return

  router.push({
    name: 'application-status',
    params: { applicationId: latestApplication.value.rider_id }
  })
}

const contactSupport = () => {
  window.location.href = 'mailto:support@closeshop.com?subject=Rider Application Access'
}

// Load user data from auth
const loadUserData = async () => {
  try {
    const user = await getCurrentAuthUser()

    if (user) {
      isLoggedIn.value = true

      const {
        profile,
        latestApplication: existingApplication,
        accessState: nextAccessState,
      } = await getRiderRouteContext(user.id)

      latestApplication.value = existingApplication
      accessState.value = nextAccessState

      // Set user profile for header display
      const userName = `${profile?.first_name || user.user_metadata?.first_name || ''} ${profile?.last_name || user.user_metadata?.last_name || ''}`.trim() || 'User'

      userProfile.value = {
        name: userName,
        email: user.email,
        avatar: profile?.avatar_url || user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3f83c7&color=fff`,
        role: profile?.role || 'user'
      }

      if (accessState.value.blocked) {
        return
      }

      // Populate form with existing user data
      personalInfo.value.firstName = profile?.first_name || user.user_metadata?.first_name || ''
      personalInfo.value.lastName = profile?.last_name || user.user_metadata?.last_name || ''
      personalInfo.value.email = user.email || ''
      personalInfo.value.phone = profile?.phone || ''

      // Load existing address if any
      if (profile?.address_id) {
        const { data: address } = await supabase
          .from('addresses')
          .select('*')
          .eq('id', profile.address_id)
          .single()

        if (address) {
          personalInfo.value.street_address = address.street || ''
          personalInfo.value.province_name = address.province_name || ''
          personalInfo.value.city_name = address.city_name || ''
          personalInfo.value.barangay_name = address.barangay_name || ''
        }
      }
    } else {
      isLoggedIn.value = false
      showLoginPrompt()
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

const showLoginPrompt = () => {
  const shouldLogin = confirm(
    'Please login to your CloseShop account to submit a rider application.\n\n' +
    'If you don\'t have an account, you can:\n' +
    '1. Register with email and password\n' +
    '2. Sign in with Google\n\n' +
    'Click OK to login/register or Cancel to go back.'
  )

  if (shouldLogin) {
    router.push('/login')
  } else {
    router.push('/')
  }
}

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!personalInfo.value.birthdate) {
      alert('Please enter your birthdate')
      return
    }

    const birthDate = new Date(personalInfo.value.birthdate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    if (age < 18) {
      alert('You must be at least 18 years old to become a rider')
      return
    }

    if (!personalInfo.value.province_code || !personalInfo.value.city_code || !personalInfo.value.barangay_code) {
      alert('Please complete your address (Province, City/Municipality, and Barangay)')
      return
    }
  }

  if (currentStep.value < 4) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const showFileOptions = (field) => {
  currentFileField.value = field
  showFileOptionsDialog.value = true
}

const openGallery = () => {
  showFileOptionsDialog.value = false

  const inputMap = {
    validId: validIdInput,
    driversLicense: driversLicenseInput,
    orCr: orCrInput,
    nbiClearance: nbiClearanceInput,
  }

  setTimeout(() => {
    if (inputMap[currentFileField.value]) {
      inputMap[currentFileField.value].value.click()
    }
  }, 100)
}

const handleFileSelect = (event, field) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size / 1024 / 1024 > 5) {
      alert('File size must be less than 5MB')
      return
    }

    documents.value[field] = file

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        documents.value[`${field}Preview`] = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      documents.value[`${field}Preview`] = null
    }
  }
  event.target.value = ''
}

const removeFile = (field) => {
  documents.value[field] = null
  documents.value[`${field}Preview`] = null

  const inputMap = {
    validId: validIdInput,
    driversLicense: driversLicenseInput,
    orCr: orCrInput,
    nbiClearance: nbiClearanceInput,
  }
  if (inputMap[field] && inputMap[field].value) {
    inputMap[field].value.value = ''
  }
}

const openCamera = async () => {
  showFileOptionsDialog.value = false

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera is not supported on this browser')
      return
    }

    stream = await navigator.mediaDevices.getUserMedia({ video: true })
    showCameraDialog.value = true

    setTimeout(() => {
      if (video.value) {
        video.value.srcObject = stream
        video.value.play()
      }
    }, 100)
  } catch (err) {
    console.error('Error accessing camera:', err)
    alert('Unable to access camera. Please check your camera settings.')
  }
}

const capturePhoto = () => {
  if (video.value && video.value.videoWidth > 0) {
    const canvas = document.createElement('canvas')
    canvas.width = video.value.videoWidth
    canvas.height = video.value.videoHeight
    const context = canvas.getContext('2d')
    context.drawImage(video.value, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' })
        documents.value[currentFileField.value] = file

        const reader = new FileReader()
        reader.onload = (e) => {
          documents.value[`${currentFileField.value}Preview`] = e.target.result
        }
        reader.readAsDataURL(file)

        closeCamera()
      },
      'image/jpeg',
      0.8,
    )
  }
}

const closeCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
  if (video.value) {
    video.value.srcObject = null
  }
  showCameraDialog.value = false
}

// Upload file to Supabase storage
const uploadFile = async (file, folder, fileName) => {
  if (!file) return null

  const fileExt = file.name.split('.').pop()
  const timestamp = Date.now()
  const filePath = `${folder}/${fileName}_${timestamp}.${fileExt}`

  const { data, error } = await supabase.storage.from('rider_info').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('rider_info').getPublicUrl(filePath)

  return publicUrl
}

// Submit application
const submitApplication = async () => {
  const user = await getCurrentAuthUser()

  if (!user) {
    alert('Please login to submit your rider application')
    router.push('/login')
    return
  }

  const missingDocs = []
  if (!documents.value.validId) missingDocs.push('Valid ID')
  if (!documents.value.driversLicense) missingDocs.push("Driver's License")
  if (!documents.value.orCr) missingDocs.push('OR/CR')

  if (missingDocs.length > 0) {
    const confirmSubmit = confirm(
      `WARNING: You are missing the following required documents:\n\n` +
      `- ${missingDocs.join('\n- ')}\n\n` +
      `Your application may be REJECTED or DELAYED significantly.\n\n` +
      `Do you still want to submit your application?`
    )
    if (!confirmSubmit) return
  }

  submitting.value = true

  try {
    let profileId = user.id

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingProfile) {
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: personalInfo.value.email,
            first_name: personalInfo.value.firstName,
            last_name: personalInfo.value.lastName,
            phone: personalInfo.value.phone,
          }
        ])

      if (createProfileError) throw createProfileError
    } else {
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          first_name: personalInfo.value.firstName,
          last_name: personalInfo.value.lastName,
          phone: personalInfo.value.phone,
        })
        .eq('id', user.id)

      if (updateProfileError) console.error('Error updating profile:', updateProfileError)
    }

    const userFolder = `users/${user.id}/rider_documents`

    let validIdUrl = null
    let driversLicenseUrl = null
    let orCrUrl = null
    let nbiClearanceUrl = null

    if (documents.value.validId) {
      validIdUrl = await uploadFile(documents.value.validId, userFolder, 'valid_id')
    }

    if (documents.value.driversLicense) {
      driversLicenseUrl = await uploadFile(documents.value.driversLicense, userFolder, 'drivers_license')
    }

    if (documents.value.orCr) {
      orCrUrl = await uploadFile(documents.value.orCr, userFolder, 'or_cr')
    }

    if (documents.value.nbiClearance) {
      nbiClearanceUrl = await uploadFile(documents.value.nbiClearance, userFolder, 'nbi_clearance')
    }

    const fullAddress = getFullAddress()

    const { data, error } = await supabase
      .from('Rider_Registration')
      .insert([
        {
          profile_id: profileId,
          first_name: personalInfo.value.firstName,
          last_name: personalInfo.value.lastName,
          email: personalInfo.value.email,
          phone: personalInfo.value.phone,
          address: fullAddress,
          street_address: personalInfo.value.street_address,
          province: personalInfo.value.province_name,
          city: personalInfo.value.city_name,
          barangay: personalInfo.value.barangay_name,
          birthdate: personalInfo.value.birthdate,
          gender: personalInfo.value.gender,
          vehicle_type: vehicleInfo.value.vehicleType,
          vehicle_brand: vehicleInfo.value.brand,
          vehicle_model: vehicleInfo.value.model,
          vehicle_year: vehicleInfo.value.year,
          vehicle_color: vehicleInfo.value.color,
          vehicle_plate: vehicleInfo.value.plateNumber,
          vehicle_or_cr_number: vehicleInfo.value.orCrNumber,
          valid_id_url: validIdUrl,
          drivers_license_url: driversLicenseUrl,
          or_cr_url: orCrUrl,
          nbi_clearance_url: nbiClearanceUrl,
          status: 'pending',
          application_date: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error

    await supabase
      .from('notifications')
      .insert([
        {
          type: 'rider_application',
          title: 'New Rider Application',
          message: `${personalInfo.value.firstName} ${personalInfo.value.lastName} has applied to become a rider.`,
          priority: 'high'
        }
      ])

    // Navigate to the unified status page with the new application reference.
    router.push({
      name: 'application-status',
      params: { applicationId: data.rider_id }
    })

  } catch (error) {
    console.error('Error submitting application:', error)
    alert(`Failed to submit application: ${error.message || 'Please try again.'}`)
  } finally {
    submitting.value = false
  }
}

const goToProfile = () => {
  router.push('/rider-portal')
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

// Load data on mount
onMounted(async () => {
  await fetchProvinces()
  await loadUserData()
})
</script>

<template>
  <v-container fluid class="rider-application-container">
    <!-- Loading State -->
    <div v-if="!isLoggedIn" class="text-center pa-8">
      <v-progress-circular indeterminate color="#3f83c7" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Checking authentication...</p>
      <p class="text-grey">Redirecting to login...</p>
    </div>

    <div v-else-if="accessState.blocked" class="application-shell">
      <v-card class="user-profile-header mb-6" elevation="2" rounded="xl">
        <v-card-text class="pa-6 pa-md-8 text-center">
          <v-icon :color="blockedAlertType === 'error' ? 'error' : 'warning'" size="56">
            {{ blockedAlertType === 'error' ? 'mdi-alert-circle' : 'mdi-shield-alert-outline' }}
          </v-icon>
          <h2 class="mt-4 mb-3">{{ accessState.title }}</h2>
          <p class="blocked-message mx-auto">
            {{ accessState.message }}
          </p>

          <v-alert :type="blockedAlertType" variant="tonal" class="mt-5 text-left">
            New rider applications are currently unavailable for this account.
          </v-alert>

          <div class="blocked-actions mt-6">
            <v-btn
              v-if="latestApplication?.rider_id"
              color="primary"
              size="large"
              prepend-icon="mdi-clipboard-text-clock-outline"
              @click="goToStatusPage"
            >
              View Application Status
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              prepend-icon="mdi-home"
              @click="goToProfile"
            >
              Back to Rider Portal
            </v-btn>
            <v-btn
              variant="text"
              color="primary"
              size="large"
              prepend-icon="mdi-email-fast"
              @click="contactSupport"
            >
              Contact Support
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Main Application Form -->
    <div v-else class="application-shell">
      <v-card class="user-profile-header mb-6" elevation="2" rounded="xl">
        <v-card-text class="pa-4 pa-md-6">
          <div class="profile-header-shell">
            <div class="profile-identity">
              <v-avatar size="68" class="profile-avatar">
                <v-img :src="userProfile?.avatar" alt="User Avatar"></v-img>
              </v-avatar>
              <div class="profile-copy">
                <p class="profile-eyebrow mb-2">Rider onboarding</p>
                <h2 class="text-h5 font-weight-bold mb-1">
                  Welcome back, {{ userProfile?.name || 'User' }}!
                </h2>
                <div class="profile-meta">
                  <span class="profile-email">{{ userProfile?.email }}</span>
                  <v-chip v-if="userProfile?.role === 'admin'" size="x-small" color="primary" class="ml-0 ml-sm-2">
                    Admin
                  </v-chip>
                </div>
              </div>
            </div>

            <div class="profile-actions">
              <v-chip class="steps-chip" color="primary" variant="tonal">
                {{ stepSummaries.length }}-step application
              </v-chip>
              <v-btn class="header-logout-btn" variant="outlined" color="error" @click="logout" prepend-icon="mdi-logout">
                Logout
              </v-btn>
            </div>
          </div>

          <div class="header-progress-panel">
            <div class="header-progress-copy">
              <h3 class="header-progress-title">Complete your rider application</h3>
              <p class="header-progress-subtitle">
                Finish each step once, review everything carefully, and submit when you are ready.
              </p>
            </div>

            <div class="header-progress-stats">
              <div class="summary-stat">
                <span class="summary-stat-value">{{ currentStep }}/{{ stepSummaries.length }}</span>
                <span class="summary-stat-label">Current step</span>
              </div>
              <div class="summary-stat">
                <span class="summary-stat-value">{{ uploadedRequiredDocuments }}/3</span>
                <span class="summary-stat-label">Docs uploaded</span>
              </div>
              <div class="summary-stat">
                <span class="summary-stat-value">{{ progressLabel }}</span>
                <span class="summary-stat-label">Current focus</span>
              </div>
            </div>

            <div class="progress-strip">
              <div class="progress-strip-header">
                <span>{{ progressLabel }}</span>
                <span>{{ Math.round(formProgress) }}%</span>
              </div>
              <v-progress-linear
                :model-value="formProgress"
                color="primary"
                bg-color="rgba(63, 131, 199, 0.12)"
                height="10"
                rounded
              ></v-progress-linear>
            </div>

            <div class="step-chip-row">
              <v-chip
                v-for="step in stepSummaries"
                :key="step.value"
                :color="currentStep === step.value ? 'primary' : currentStep > step.value ? 'success' : 'grey-lighten-2'"
                :variant="currentStep >= step.value ? 'flat' : 'tonal'"
                class="step-status-chip"
              >
                {{ step.shortTitle }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Progress Stepper -->
      <v-stepper v-model="currentStep" class="application-stepper" elevation="0">
        <v-stepper-header>
          <v-stepper-item :complete="currentStep > 1" :value="1">
            Personal Info
            <template #subtitle>Basic details</template>
          </v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item :complete="currentStep > 2" :value="2">
            Vehicle Details
            <template #subtitle>Your ride</template>
          </v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item :complete="currentStep > 3" :value="3">
            Documents
            <template #subtitle>Requirements</template>
          </v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item :value="4">
            Review & Submit
            <template #subtitle>Final check</template>
          </v-stepper-item>
        </v-stepper-header>

        <v-stepper-window v-model="currentStep">
          <!-- Step 1: Personal Information -->
          <v-stepper-window-item :value="1">
            <v-card class="form-card" elevation="2">
              <v-card-text>
                <v-form ref="personalForm" v-model="personalValid">
                  <div class="form-section">
                    <h3 class="section-title">
                      <v-icon class="mr-2" color="#3f83c7">mdi-account-circle</v-icon>
                      Personal Information
                    </h3>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="personalInfo.firstName"
                          label="First Name"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-account"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="personalInfo.lastName"
                          label="Last Name"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-account"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="personalInfo.email"
                          label="Email Address"
                          :rules="[rules.required, rules.email]"
                          variant="outlined"
                          prepend-inner-icon="mdi-email"
                          readonly
                          density="comfortable"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="personalInfo.phone"
                          label="Phone Number"
                          :rules="[rules.required, rules.phone]"
                          variant="outlined"
                          prepend-inner-icon="mdi-phone"
                          placeholder="09XXXXXXXXX"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="personalInfo.street_address"
                          label="House/Unit #, Street, Subdivision"
                          variant="outlined"
                          prepend-inner-icon="mdi-home"
                          placeholder="e.g., Block 1 Lot 2, Phase 3, Evergreen Subdivision"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="personalInfo.province_code"
                          :items="provinces"
                          item-title="name"
                          item-value="code"
                          label="Province"
                          :rules="[rules.required]"
                          variant="outlined"
                          :loading="loadingProvinces"
                          prepend-inner-icon="mdi-map"
                          density="comfortable"
                        >
                          <template v-slot:no-data>
                            <v-list-item>No provinces found</v-list-item>
                          </template>
                        </v-select>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-select
                          v-model="personalInfo.city_code"
                          :items="cities"
                          item-title="name"
                          item-value="code"
                          label="City/Municipality"
                          :rules="[rules.required]"
                          variant="outlined"
                          :disabled="!personalInfo.province_code"
                          :loading="loadingCities"
                          prepend-inner-icon="mdi-city"
                          density="comfortable"
                        >
                          <template v-slot:no-data>
                            <v-list-item>Select a province first</v-list-item>
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="personalInfo.barangay_code"
                          :items="barangays"
                          item-title="name"
                          item-value="code"
                          label="Barangay"
                          :rules="[rules.required]"
                          variant="outlined"
                          :disabled="!personalInfo.city_code"
                          :loading="loadingBarangays"
                          prepend-inner-icon="mdi-home-variant"
                          density="comfortable"
                        >
                          <template v-slot:no-data>
                            <v-list-item>Select a city/municipality first</v-list-item>
                          </template>
                        </v-select>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="personalInfo.birthdate"
                          label="Birthdate"
                          type="date"
                          :rules="[rules.required, rules.age]"
                          variant="outlined"
                          prepend-inner-icon="mdi-calendar"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="personalInfo.gender"
                          :items="['Male', 'Female', 'Prefer not to say']"
                          label="Gender"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="comfortable"
                        ></v-select>
                      </v-col>
                    </v-row>

                    <v-alert type="info" variant="tonal" density="compact" class="mt-4">
                      <strong>Address Format:</strong> Please provide your complete address starting with house/unit number, street, and subdivision/barangay.
                    </v-alert>
                  </div>
                </v-form>
              </v-card-text>

              <v-card-actions class="form-actions">
                <v-spacer></v-spacer>
                <v-btn color="primary" size="large" @click="nextStep" :disabled="!personalValid">
                  Next
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-window-item>

          <!-- Step 2: Vehicle Details -->
          <v-stepper-window-item :value="2">
            <v-card class="form-card" elevation="2">
              <v-card-text>
                <v-form ref="vehicleForm" v-model="vehicleValid">
                  <div class="form-section">
                    <h3 class="section-title">
                      <v-icon class="mr-2" color="#3f83c7">mdi-motorbike</v-icon>
                      Vehicle Information
                    </h3>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="vehicleInfo.vehicleType"
                          :items="vehicleTypes"
                          label="Vehicle Type"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-car-side"
                          density="comfortable"
                        ></v-select>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="vehicleInfo.brand"
                          label="Brand"
                          :rules="[rules.required]"
                          variant="outlined"
                          placeholder="e.g., Honda, Yamaha, Toyota"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="vehicleInfo.model"
                          label="Model"
                          :rules="[rules.required]"
                          variant="outlined"
                          placeholder="e.g., Click 125i, Mio i125"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="vehicleInfo.year"
                          label="Year Model"
                          :rules="[rules.required, rules.year]"
                          variant="outlined"
                          placeholder="YYYY"
                          maxlength="4"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="vehicleInfo.color"
                          label="Color"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-palette"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="vehicleInfo.plateNumber"
                          label="Plate Number"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-license-plate"
                          placeholder="ABC-1234"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="vehicleInfo.orCrNumber"
                          label="OR/CR Number"
                          :rules="[rules.required]"
                          variant="outlined"
                          prepend-inner-icon="mdi-file-document"
                          placeholder="Official Receipt/Certificate of Registration Number"
                          density="comfortable"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-alert type="info" variant="tonal" density="compact" class="mt-4">
                      <strong>Note:</strong> Your vehicle must be registered and in good condition. We may request additional documents for verification.
                    </v-alert>
                  </div>
                </v-form>
              </v-card-text>

              <v-card-actions class="form-actions">
                <v-btn variant="text" @click="previousStep">
                  <v-icon left>mdi-arrow-left</v-icon>
                  Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" size="large" @click="nextStep" :disabled="!vehicleValid">
                  Next
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-window-item>

          <!-- Step 3: Documents -->
          <v-stepper-window-item :value="3">
            <v-card class="form-card" elevation="2">
              <v-card-text>
                <div class="form-section">
                  <h3 class="section-title">
                    <v-icon class="mr-2" color="#3f83c7">mdi-folder-account</v-icon>
                    Required Documents
                  </h3>

                  <v-alert type="info" variant="tonal" class="mb-4">
                    <strong>Document Requirements:</strong> Please upload clear, readable copies. Accepted formats: JPG, PNG, PDF (Max 5MB each)
                  </v-alert>

                  <!-- Valid Government ID -->
                  <v-row>
                    <v-col cols="12">
                      <div class="document-upload-section">
                        <label class="document-label">
                          <v-icon left size="18" color="#3f83c7">mdi-card-account-details</v-icon>
                          Valid Government ID *
                        </label>
                        <div class="upload-buttons">
                          <v-btn
                            color="primary"
                            variant="outlined"
                            @click="showFileOptions('validId')"
                            class="mr-2"
                          >
                            <v-icon left>mdi-plus-circle</v-icon>
                            Upload File
                          </v-btn>
                          <input
                            type="file"
                            ref="validIdInput"
                            style="display: none"
                            accept="image/*,.pdf"
                            @change="handleFileSelect($event, 'validId')"
                          />
                        </div>
                        <div v-if="documents.validId" class="file-preview mt-2">
                          <v-chip color="success" class="mr-2">
                            <v-icon left size="16">mdi-check-circle</v-icon>
                            {{ getFileName(documents.validId) }}
                          </v-chip>
                          <v-btn icon size="small" color="error" @click="removeFile('validId')">
                            <v-icon size="16">mdi-close</v-icon>
                          </v-btn>
                        </div>
                        <div v-if="documents.validIdPreview" class="image-preview mt-2">
                          <v-img
                            :src="documents.validIdPreview"
                            max-width="200"
                            max-height="150"
                            contain
                            class="preview-image"
                          ></v-img>
                        </div>
                        <small class="text-grey">Valid IDs: Passport, Driver's License, National ID, Postal ID, Voter's ID</small>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Driver's License -->
                  <v-row>
                    <v-col cols="12">
                      <div class="document-upload-section">
                        <label class="document-label">
                          <v-icon left size="18" color="#3f83c7">mdi-card-account-details</v-icon>
                          Driver's License *
                        </label>
                        <div class="upload-buttons">
                          <v-btn
                            color="primary"
                            variant="outlined"
                            @click="showFileOptions('driversLicense')"
                            class="mr-2"
                          >
                            <v-icon left>mdi-plus-circle</v-icon>
                            Upload File
                          </v-btn>
                          <input
                            type="file"
                            ref="driversLicenseInput"
                            style="display: none"
                            accept="image/*,.pdf"
                            @change="handleFileSelect($event, 'driversLicense')"
                          />
                        </div>
                        <div v-if="documents.driversLicense" class="file-preview mt-2">
                          <v-chip color="success" class="mr-2">
                            <v-icon left size="16">mdi-check-circle</v-icon>
                            {{ getFileName(documents.driversLicense) }}
                          </v-chip>
                          <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="removeFile('driversLicense')"
                          >
                            <v-icon size="16">mdi-close</v-icon>
                          </v-btn>
                        </div>
                        <div v-if="documents.driversLicensePreview" class="image-preview mt-2">
                          <v-img
                            :src="documents.driversLicensePreview"
                            max-width="200"
                            max-height="150"
                            contain
                            class="preview-image"
                          ></v-img>
                        </div>
                        <small class="text-grey">Required for vehicle riders. For bicycle riders, upload a valid ID instead.</small>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- OR/CR Document -->
                  <v-row>
                    <v-col cols="12">
                      <div class="document-upload-section">
                        <label class="document-label">
                          <v-icon left size="18" color="#3f83c7">mdi-file-document</v-icon>
                          OR/CR Document *
                        </label>
                        <div class="upload-buttons">
                          <v-btn
                            color="primary"
                            variant="outlined"
                            @click="showFileOptions('orCr')"
                            class="mr-2"
                          >
                            <v-icon left>mdi-plus-circle</v-icon>
                            Upload File
                          </v-btn>
                          <input
                            type="file"
                            ref="orCrInput"
                            style="display: none"
                            accept="image/*,.pdf"
                            @change="handleFileSelect($event, 'orCr')"
                          />
                        </div>
                        <div v-if="documents.orCr" class="file-preview mt-2">
                          <v-chip color="success" class="mr-2">
                            <v-icon left size="16">mdi-check-circle</v-icon>
                            {{ getFileName(documents.orCr) }}
                          </v-chip>
                          <v-btn icon size="small" color="error" @click="removeFile('orCr')">
                            <v-icon size="16">mdi-close</v-icon>
                          </v-btn>
                        </div>
                        <div v-if="documents.orCrPreview" class="image-preview mt-2">
                          <v-img
                            :src="documents.orCrPreview"
                            max-width="200"
                            max-height="150"
                            contain
                            class="preview-image"
                          ></v-img>
                        </div>
                        <small class="text-grey">Official Receipt/Certificate of Registration</small>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- NBI Clearance (Optional) -->
                  <v-row>
                    <v-col cols="12">
                      <div class="document-upload-section">
                        <label class="document-label">
                          <v-icon left size="18" color="#3f83c7">mdi-shield-account</v-icon>
                          NBI Clearance (Optional but recommended)
                        </label>
                        <div class="upload-buttons">
                          <v-btn
                            color="primary"
                            variant="outlined"
                            @click="showFileOptions('nbiClearance')"
                            class="mr-2"
                          >
                            <v-icon left>mdi-plus-circle</v-icon>
                            Upload File
                          </v-btn>
                          <input
                            type="file"
                            ref="nbiClearanceInput"
                            style="display: none"
                            accept="image/*,.pdf"
                            @change="handleFileSelect($event, 'nbiClearance')"
                          />
                        </div>
                        <div v-if="documents.nbiClearance" class="file-preview mt-2">
                          <v-chip color="success" class="mr-2">
                            <v-icon left size="16">mdi-check-circle</v-icon>
                            {{ getFileName(documents.nbiClearance) }}
                          </v-chip>
                          <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="removeFile('nbiClearance')"
                          >
                            <v-icon size="16">mdi-close</v-icon>
                          </v-btn>
                        </div>
                        <div v-if="documents.nbiClearancePreview" class="image-preview mt-2">
                          <v-img
                            :src="documents.nbiClearancePreview"
                            max-width="200"
                            max-height="150"
                            contain
                            class="preview-image"
                          ></v-img>
                        </div>
                        <small class="text-grey">Valid within 6 months from date of issue</small>
                      </div>
                    </v-col>
                  </v-row>

                  <v-alert type="warning" variant="tonal" density="compact" class="mt-4">
                    <strong>Important:</strong> All documents must be clear and readable. Upload only valid and up-to-date documents. Submitting false documents will result in immediate disqualification.
                  </v-alert>
                </div>
              </v-card-text>

              <v-card-actions class="form-actions">
                <v-btn variant="text" @click="previousStep">
                  <v-icon left>mdi-arrow-left</v-icon>
                  Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" size="large" @click="nextStep" :disabled="!documentsValid">
                  Next
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-window-item>

          <!-- Step 4: Review & Submit -->
          <v-stepper-window-item :value="4">
            <v-card class="form-card" elevation="2">
              <v-card-text>
                <div class="form-section">
                  <h3 class="section-title">
                    <v-icon class="mr-2" color="#3f83c7">mdi-clipboard-check</v-icon>
                    Review Your Application
                  </h3>
                  <p class="review-subtitle">Please verify that all information is correct before submitting</p>

                  <!-- Personal Information Review -->
                  <v-expansion-panels variant="accordion" class="review-panels mb-4">
                    <v-expansion-panel>
                      <v-expansion-panel-title class="review-title">
                        <v-icon left class="mr-2" color="#3f83c7">mdi-account-circle</v-icon>
                        Personal Information
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-table density="compact">
                          <tbody>
                            <tr>
                              <td class="font-weight-bold">Full Name:</td>
                              <td>{{ personalInfo.firstName }} {{ personalInfo.lastName }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Email:</td>
                              <td>{{ personalInfo.email }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Phone:</td>
                              <td>{{ personalInfo.phone }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Address:</td>
                              <td>
                                {{ personalInfo.street_address }},
                                {{ personalInfo.barangay_name }},
                                {{ personalInfo.city_name }},
                                {{ personalInfo.province_name }}
                              </td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Birthdate:</td>
                              <td>{{ formatDate(personalInfo.birthdate) }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Gender:</td>
                              <td>{{ personalInfo.gender }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <!-- Vehicle Information Review -->
                    <v-expansion-panel>
                      <v-expansion-panel-title class="review-title">
                        <v-icon left class="mr-2" color="#3f83c7">mdi-motorbike</v-icon>
                        Vehicle Information
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-table density="compact">
                          <tbody>
                            <tr>
                              <td class="font-weight-bold">Vehicle Type:</td>
                              <td>{{ vehicleInfo.vehicleType }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Brand:</td>
                              <td>{{ vehicleInfo.brand }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Model:</td>
                              <td>{{ vehicleInfo.model }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Year:</td>
                              <td>{{ vehicleInfo.year }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Color:</td>
                              <td>{{ vehicleInfo.color }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Plate Number:</td>
                              <td>{{ vehicleInfo.plateNumber }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">OR/CR Number:</td>
                              <td>{{ vehicleInfo.orCrNumber }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </v-expansion-panel-text>
                    </v-expansion-panel>

                    <!-- Documents Review -->
                    <v-expansion-panel>
                      <v-expansion-panel-title class="review-title">
                        <v-icon left class="mr-2" color="#3f83c7">mdi-folder-account</v-icon>
                        Documents Uploaded
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-list>
                          <v-list-item v-if="documents.validId">
                            <template #prepend>
                              <v-icon color="success">mdi-check-circle</v-icon>
                            </template>
                            <v-list-item-title>Valid Government ID</v-list-item-title>
                            <v-list-item-subtitle>{{ getFileName(documents.validId) }}</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item v-else>
                            <template #prepend>
                              <v-icon color="error">mdi-close-circle</v-icon>
                            </template>
                            <v-list-item-title>Valid Government ID</v-list-item-title>
                            <v-list-item-subtitle class="text-error">Not uploaded</v-list-item-subtitle>
                          </v-list-item>

                          <v-list-item v-if="documents.driversLicense">
                            <template #prepend>
                              <v-icon color="success">mdi-check-circle</v-icon>
                            </template>
                            <v-list-item-title>Driver's License</v-list-item-title>
                            <v-list-item-subtitle>{{ getFileName(documents.driversLicense) }}</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item v-else>
                            <template #prepend>
                              <v-icon color="error">mdi-close-circle</v-icon>
                            </template>
                            <v-list-item-title>Driver's License</v-list-item-title>
                            <v-list-item-subtitle class="text-error">Not uploaded</v-list-item-subtitle>
                          </v-list-item>

                          <v-list-item v-if="documents.orCr">
                            <template #prepend>
                              <v-icon color="success">mdi-check-circle</v-icon>
                            </template>
                            <v-list-item-title>OR/CR Document</v-list-item-title>
                            <v-list-item-subtitle>{{ getFileName(documents.orCr) }}</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item v-else>
                            <template #prepend>
                              <v-icon color="error">mdi-close-circle</v-icon>
                            </template>
                            <v-list-item-title>OR/CR Document</v-list-item-title>
                            <v-list-item-subtitle class="text-error">Not uploaded</v-list-item-subtitle>
                          </v-list-item>

                          <v-list-item v-if="documents.nbiClearance">
                            <template #prepend>
                              <v-icon color="success">mdi-check-circle</v-icon>
                            </template>
                            <v-list-item-title>NBI Clearance</v-list-item-title>
                            <v-list-item-subtitle>{{ getFileName(documents.nbiClearance) }}</v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <!-- Terms and Conditions -->
                  <div class="terms-section mt-6">
                    <v-checkbox
                      v-model="agreeTerms"
                      color="primary"
                      :rules="[(v) => !!v || 'You must agree to the terms and conditions']"
                    >
                      <template v-slot:label>
                        <span>
                          I hereby declare that all the information provided in this application is true and correct to the best of my knowledge.
                          I understand that providing false information may result in the rejection of my application or termination of my rider status.
                          I agree to the
                          <a href="#" @click.prevent="showTermsDialog = true" class="terms-link">Terms and Conditions</a>.
                        </span>
                      </template>
                    </v-checkbox>
                  </div>

                  <v-alert type="warning" variant="tonal" class="mt-4">
                    <strong>Note:</strong> You will need to present original copies of all documents during the final interview and verification process.
                  </v-alert>
                </div>
              </v-card-text>

              <v-card-actions class="form-actions">
                <v-btn variant="text" @click="previousStep">
                  <v-icon left>mdi-arrow-left</v-icon>
                  Back
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  size="large"
                  :loading="submitting"
                  @click="submitApplication"
                  :disabled="!agreeTerms"
                >
                  Submit Application
                  <v-icon right>mdi-check</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>
    </div>

    <!-- File Selection Options Dialog -->
    <v-dialog v-model="showFileOptionsDialog" max-width="400">
      <v-card class="dialog-card">
        <v-card-title class="dialog-header">
          <v-icon left size="24" color="#3f83c7">mdi-file-upload</v-icon>
          Select File Source
        </v-card-title>
        <v-card-text class="text-center pa-6">
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn color="primary" size="large" block class="mb-4" @click="openCamera">
                <v-icon left size="24">mdi-camera</v-icon>
                Take Photo
              </v-btn>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-btn color="secondary" size="large" block @click="openGallery">
                <v-icon left size="24">mdi-image-multiple</v-icon>
                Choose from Gallery
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showFileOptionsDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Camera Dialog -->
    <v-dialog v-model="showCameraDialog" max-width="500" persistent>
      <v-card class="dialog-card">
        <v-card-title class="dialog-header d-flex justify-space-between align-center">
          <span>Take Photo</span>
          <v-btn icon @click="closeCamera">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <video
            ref="video"
            autoplay
            playsinline
            class="camera-video"
            style="width: 100%; height: auto"
          ></video>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="closeCamera">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="capturePhoto">Capture</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Terms and Conditions Dialog -->
    <v-dialog v-model="showTermsDialog" max-width="700">
      <v-card class="dialog-card">
        <v-card-title class="dialog-header">
          <v-icon left size="24" color="#3f83c7">mdi-file-document</v-icon>
          Rider Terms and Conditions
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="terms-content-dialog">
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showTermsDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.rider-application-container {
  background:
    radial-gradient(circle at top right, rgba(63, 131, 199, 0.12), transparent 30%),
    linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 24px 0 72px;
}

.application-shell {
  max-width: 1240px;
  margin: 0 auto;
}

.user-profile-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(63, 131, 199, 0.2);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  transition: all 0.3s ease;
}

.user-profile-header:hover {
  border-color: rgba(63, 131, 199, 0.4);
  box-shadow: 0 8px 20px rgba(63, 131, 199, 0.1) !important;
}

.profile-header-shell {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.profile-identity {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.profile-avatar {
  border: 3px solid rgba(63, 131, 199, 0.16);
  box-shadow: 0 10px 24px rgba(63, 131, 199, 0.18);
}

.profile-copy {
  min-width: 0;
}

.profile-eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #3f83c7;
}

.profile-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.profile-email {
  font-size: 0.92rem;
  color: #64748b;
  overflow-wrap: anywhere;
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-left: auto;
}

.blocked-message {
  max-width: 760px;
  color: #475569;
  line-height: 1.7;
}

.blocked-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.steps-chip {
  font-weight: 700;
}

.header-logout-btn {
  border-color: rgba(239, 68, 68, 0.28) !important;
  background: white !important;
  font-weight: 600 !important;
}

.header-progress-panel {
  margin-top: 24px;
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(63, 131, 199, 0.08), rgba(15, 23, 42, 0.02));
  border: 1px solid rgba(63, 131, 199, 0.12);
}

.header-progress-copy {
  margin-bottom: 18px;
}

.header-progress-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.header-progress-subtitle {
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.header-progress-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.summary-stat {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(63, 131, 199, 0.12);
  min-width: 0;
}

.summary-stat-value {
  display: block;
  font-size: 1.02rem;
  font-weight: 700;
  color: #0f172a;
  overflow-wrap: anywhere;
}

.summary-stat-label {
  display: block;
  margin-top: 4px;
  font-size: 0.78rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.progress-strip {
  margin-bottom: 18px;
}

.progress-strip-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  color: #334155;
}

.step-chip-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.step-status-chip {
  font-weight: 700;
}

.application-stepper {
  background: transparent;
  margin: 20px auto;
  max-width: 1200px;
}

.application-stepper :deep(.v-stepper-header) {
  gap: 8px;
  padding: 8px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.04);
}

.application-stepper :deep(.v-stepper-item) {
  min-width: 0;
}

.form-card {
  border-radius: 28px;
  margin: 20px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06) !important;
}

.form-section {
  padding: 28px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  border-left: 4px solid #3f83c7;
  padding-left: 16px;
}

.form-actions {
  position: sticky;
  bottom: 0;
  z-index: 2;
  padding: 18px 24px;
  background: rgba(248, 250, 252, 0.96);
  backdrop-filter: blur(16px);
  border-top: 1px solid #e2e8f0;
  gap: 12px;
}

.document-upload-section {
  margin-bottom: 24px;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.document-label {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
  display: block;
  font-size: 0.95rem;
}

.upload-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.file-preview {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.image-preview {
  margin-top: 12px;
}

.preview-image {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.review-panels {
  margin-top: 16px;
}

.review-panels :deep(.v-expansion-panel) {
  border-radius: 18px !important;
  margin-bottom: 10px;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
}

.review-panels :deep(.v-table__wrapper) {
  overflow-x: auto;
}

.review-panels :deep(table) {
  min-width: 100%;
}

.review-panels :deep(td) {
  padding: 14px 10px;
  vertical-align: top;
}

.review-title {
  font-weight: 600;
  color: #0f172a;
}

.review-subtitle {
  color: #64748b;
  margin-bottom: 20px;
}

.terms-section {
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.terms-link {
  color: #3f83c7;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.terms-content-dialog {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
}

.terms-scrollable {
  padding-right: 8px;
}

.dialog-header {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
  padding: 16px 20px;
}

.dialog-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.camera-video {
  width: 100%;
  height: auto;
  background: #000;
  min-height: 300px;
  object-fit: cover;
}

@media (max-width: 768px) {
  .rider-application-container {
    padding: 12px 0 48px;
  }

  .profile-header-shell,
  .profile-identity,
  .profile-actions {
    align-items: stretch;
  }

  .profile-identity {
    flex-direction: column;
    text-align: center;
  }

  .profile-actions {
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
  }

  .blocked-actions {
    flex-direction: column;
  }

  .blocked-actions .v-btn {
    width: 100%;
  }

  .header-progress-panel {
    padding: 18px;
  }

  .header-progress-stats {
    grid-template-columns: 1fr;
  }

  .application-stepper {
    margin: 16px auto;
  }

  .application-stepper :deep(.v-stepper-header) {
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: none;
  }

  .application-stepper :deep(.v-stepper-header::-webkit-scrollbar) {
    display: none;
  }

  .application-stepper :deep(.v-stepper-item) {
    min-width: 150px;
  }

  .application-stepper :deep(.v-stepper-item__subtitle) {
    display: none;
  }

  .form-card {
    margin: 12px;
  }

  .form-section {
    padding: 16px;
  }

  .section-title {
    font-size: 1.1rem;
    margin-bottom: 16px;
  }

  .document-upload-section {
    padding: 12px;
  }

  .form-actions {
    padding: 16px;
  }

  .upload-buttons {
    flex-direction: column;
  }

  .upload-buttons .v-btn {
    width: 100%;
  }

  .camera-video {
    min-height: 250px;
  }

  .terms-content-dialog {
    max-height: 50vh;
  }
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
    gap: 12px;
  }

  .form-actions .v-btn {
    width: 100%;
  }

  .profile-actions {
    flex-direction: column;
  }

  .steps-chip,
  .header-logout-btn {
    width: 100%;
    justify-content: center;
  }

  .progress-strip-header {
    font-size: 0.82rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .review-title {
    font-size: 0.9rem;
  }
}
</style>
