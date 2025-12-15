<script setup>
import { ref, onMounted } from 'vue'

const drawer = ref(false)
const activeTab = ref('home')
const downloadDialog = ref(false)
const isLoading = ref(false)
const downloadSuccess = ref(false)
const downloadError = ref('')
const shopCreationStep = ref(1)
const accountCreationStep = ref(1) // Added for account creation guide
const imageViewer = ref({
  open: false,
  title: '',
  src: '',
  alt: '',
})

// Color Palette based on #3f83c7
const colorPalette = {
  primary: {
    main: '#3f83c7',
    light: '#6ba1d4',
    dark: '#2c5c8d',
    lighter: '#a0c2e5',
    gradient: 'linear-gradient(135deg, #3f83c7 0%, #5a95d1 100%)',
    gradientLight: 'linear-gradient(135deg, #6ba1d4 0%, #8bb5df 100%)',
  },
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  background: {
    light: '#f8fafc',
    lighter: '#ffffff',
    gray: '#f1f5f9',
  },
}

// Using local images with correct paths
const logoUrl = ref('/logo.png')
const heroImage = ref('https://picsum.photos/800/400?random=2&blur=1')
const apkUrl = ref('/closeshop.apk')
const isMobileDevice = ref(false)

// Account creation guide images
const accountCreationImages = ref([
  {
    id: 1,
    src: '/CreateAccGuide/step01.png',
    alt: 'Step 1 - Register page with form fields',
    title: 'Step 1: Go to Register Page',
    description: 'Open the Closeshop app and navigate to the Register page. Fill in all the required details including your name, email, and password.',
  },
  {
    id: 2,
    src: '/CreateAccGuide/step002.png',
    alt: 'Step 2 - Email verification',
    title: 'Step 2: Verify Your Email',
    description: 'Check your email inbox for a verification link from Closeshop. Click the link to verify your email address and activate your account.',
  },
  {
    id: 3,
    src: '/CreateAccGuide/step3.jpg',
    alt: 'Step 3 - Login page',
    title: 'Step 3: Login to Your Account',
    description: 'Return to the Closeshop app and go to the Login page. Enter your verified email and password to access your new account.',
  },
])

// Shop creation guide images
const shopGuideImages = ref([
  {
    id: 1,
    src: '/CreateShopGuide/step1.jpg',
    alt: 'Step 1 - Profile Page with Create Shop button',
    title: 'Step 1: Access Create Shop',
    description: 'Go to your profile page and click the "Create Shop" button. Note: If you already have a shop, this button will be replaced with "View Shop".',
  },
  {
    id: 2,
    src: '/CreateShopGuide/step2.jpg',
    alt: 'Step 2 - Shop Details Form',
    title: 'Step 2: Fill Shop Details',
    description: 'Fill in all the details of your shop and click the "Save Shop" button. Note: For testing purposes, you can use sample images for the Valid ID upload.',
  },
  {
    id: 3,
    src: '/CreateShopGuide/step3.jpg',
    alt: 'Step 3 - Shop Status Page',
    title: 'Step 3: Wait for Approval',
    description: 'Wait for the status of your shop creation. An admin will review your details and either approve or reject your shop application.',
  },
])

// Navigation guide images
const navigationImages = ref([
  {
    id: 'home',
    src: '/NavigatePage/homepage.jpg',
    alt: 'Home Page showing shops and products',
    title: 'Home Page',
    description: 'Displays shops based on your current location (city-based) and all available products.',
  },
  {
    id: 'cart',
    src: '/NavigatePage/cartpage.jpg',
    alt: 'Cart Page showing shopping cart items',
    title: 'Cart Page',
    description: 'Displays all items/products added to your shopping cart.',
  },
  {
    id: 'map',
    src: '/NavigatePage/mappage.jpg',
    alt: 'Map Page showing shop locations',
    title: 'Map Page',
    description: 'Displays shops on the map with markers. Click markers to view routes between your location and shops, and directly access shop items.',
  },
  {
    id: 'messages',
    src: '/NavigatePage/msgpage.jpg',
    alt: 'Messages Page showing conversations',
    title: 'Messages Page',
    description: 'Displays your conversation history and active chats with other users.',
  },
  {
    id: 'profile',
    src: '/NavigatePage/profpage.jpg',
    alt: 'Profile Page with user information',
    title: 'Profile Page',
    description: 'Your personal profile page. If you have created a shop, this page will include a button to access your shop dashboard.',
  },
])

const navItems = [
  { title: 'Home', value: 'home', icon: 'mdi-home' },
  { title: 'About', value: 'about', icon: 'mdi-information' },
  { title: 'Guide', value: 'guide', icon: 'mdi-book-open' },
  { title: 'Download', value: 'download-section', icon: 'mdi-download' },
]

const appInfo = ref({
  Developer: 'Charles Q. Neri, Queen Zayvy P. Israel, Nel O. Ochate',
  Size: '12.7 MB',
  Requires: 'Android 8.0 or higher',
  'Last Updated': 'December 2025',
})

const footerLinks = ref([
  { text: 'GitHub', icon: 'mdi-github', href: 'https://github.com' },
  { text: 'Twitter', icon: 'mdi-twitter', href: 'https://twitter.com' },
  { text: 'Facebook', icon: 'mdi-facebook', href: 'https://facebook.com' },
  { text: 'Email Support', icon: 'mdi-email', href: 'mailto:support@closeshop.com' },
])

// Navigation functions
const scrollToSection = (sectionId) => {
  drawer.value = false
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

// Image viewer functions
const openImageViewer = (image) => {
  imageViewer.value = {
    open: true,
    title: image.title,
    src: image.src,
    alt: image.alt,
  }
}

const closeImageViewer = () => {
  imageViewer.value.open = false
}

const navigateImages = (direction, imageArray) => {
  if (imageViewer.value.open) {
    let currentImageIndex = imageArray.findIndex((img) => img.src === imageViewer.value.src)
    
    if (currentImageIndex !== -1) {
      if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % imageArray.length
      } else {
        currentImageIndex = (currentImageIndex - 1 + imageArray.length) % imageArray.length
      }

      const nextImage = imageArray[currentImageIndex]
      imageViewer.value = {
        open: true,
        title: nextImage.title,
        src: nextImage.src,
        alt: nextImage.alt,
      }
    }
  }
}

// Keyboard navigation for image viewer
const handleKeydown = (event) => {
  if (imageViewer.value.open) {
    if (event.key === 'Escape') {
      closeImageViewer()
    } else if (event.key === 'ArrowRight') {
      // Determine which array to navigate
      if (accountCreationImages.value.find(img => img.src === imageViewer.value.src)) {
        navigateImages('next', accountCreationImages.value)
      } else if (shopGuideImages.value.find(img => img.src === imageViewer.value.src)) {
        navigateImages('next', shopGuideImages.value)
      } else {
        navigateImages('next', navigationImages.value)
      }
    } else if (event.key === 'ArrowLeft') {
      // Determine which array to navigate
      if (accountCreationImages.value.find(img => img.src === imageViewer.value.src)) {
        navigateImages('prev', accountCreationImages.value)
      } else if (shopGuideImages.value.find(img => img.src === imageViewer.value.src)) {
        navigateImages('prev', shopGuideImages.value)
      } else {
        navigateImages('prev', navigationImages.value)
      }
    }
  }
}

// Step navigation functions
const nextAccountStep = () => {
  if (accountCreationStep.value < 3) {
    accountCreationStep.value++
  }
}

const prevAccountStep = () => {
  if (accountCreationStep.value > 1) {
    accountCreationStep.value--
  }
}

const nextShopStep = () => {
  if (shopCreationStep.value < 3) {
    shopCreationStep.value++
  }
}

const prevShopStep = () => {
  if (shopCreationStep.value > 1) {
    shopCreationStep.value--
  }
}

const restartAccountGuide = () => {
  accountCreationStep.value = 1
}

const restartShopGuide = () => {
  shopCreationStep.value = 1
}

const downloadAPK = async () => {
  isLoading.value = true
  downloadSuccess.value = false
  downloadError.value = ''

  try {
    // Create a direct link element for mobile compatibility
    const link = document.createElement('a')
    link.href = apkUrl.value
    link.download = 'closeshop.apk'

    // For mobile devices, we need to handle it differently
    if (isMobileDevice.value) {
      // Mobile device handling
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      // Create a click event and trigger it
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false,
      })
      link.dispatchEvent(clickEvent)

      // Show instructions for mobile users
      downloadDialog.value = true
      downloadSuccess.value = true

      // For iOS devices, show special instructions
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        downloadError.value =
          'iOS devices cannot install APK files directly. Please use an Android device.'
      }
    } else {
      // Desktop handling with blob download
      const response = await fetch(apkUrl.value)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      link.href = url

      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      downloadSuccess.value = true
      downloadDialog.value = true
    }

    setTimeout(() => {
      downloadDialog.value = false
    }, 8000) // Increased timeout for mobile users to read instructions
  } catch (error) {
    console.error('Download error:', error)
    downloadError.value = 'Download failed. Please try again or use the direct link.'
    downloadDialog.value = true

    // Fallback: open in new tab
    window.open(apkUrl.value, '_blank')
  } finally {
    isLoading.value = false
  }
}

// Initialize on mount
onMounted(() => {
  console.log('Closeshop App mounted successfully')
  document.addEventListener('keydown', handleKeydown)

  // Detect mobile device
  isMobileDevice.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
})
</script>

<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar :style="{ background: colorPalette.primary.gradient }" prominent elevated>
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>
      <v-img
        :src="logoUrl"
        alt="Closeshop Logo"
        max-height="40"
        max-width="40"
        class="ml-2 mr-4"
        contain
      ></v-img>
      <v-toolbar-title class="font-weight-bold text-white responsive-toolbar-title">Closeshop</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex align-center">
        <v-btn
          v-for="item in navItems"
          :key="item.value"
          :value="item.value"
          @click="scrollToSection(item.value)"
          variant="text"
          color="white"
          class="mx-1 responsive-nav-btn"
          rounded
        >
          <v-icon left size="small">{{ item.icon }}</v-icon>
          <span class="responsive-btn-text">{{ item.title }}</span>
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav dense>
        <v-list-item
          v-for="item in navItems"
          :key="item.value"
          @click="scrollToSection(item.value)"
          class="responsive-drawer-item"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title class="responsive-list-text">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <!-- Hero Section -->
      <section id="home" class="hero-section">
        <v-container fluid class="fill-height pa-0">
          <v-row align="center" justify="center" class="fill-height">
            <v-col cols="12" md="10" lg="8" class="text-center">
              <v-card class="pa-8 pa-sm-12 hero-card" elevation="0">
                <v-img
                  :src="logoUrl"
                  alt="Closeshop Logo"
                  max-height="140"
                  max-width="140"
                  class="mx-auto mb-8 logo-pulse responsive-logo"
                  contain
                ></v-img>

                <h1 class="responsive-h1 gradient-text">Closeshop</h1>

                <p class="responsive-hero-subtitle">
                  Connecting businesses with customers seamlessly
                </p>

                <!-- Download Button -->
                <v-btn
                  :style="{ background: colorPalette.primary.gradient }"
                  size="x-large"
                  class="mb-4 download-btn responsive-download-btn"
                  @click="downloadAPK"
                  rounded
                  elevation="4"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  <template v-slot:loader>
                    <v-progress-circular
                      indeterminate
                      color="white"
                      size="24"
                    ></v-progress-circular>
                  </template>
                  <v-icon left>mdi-download</v-icon>
                  <span class="responsive-btn-label">
                    {{
                      isLoading
                        ? 'Downloading...'
                        : isMobileDevice
                          ? 'Get on Android'
                          : 'Get Closeshop Now'
                    }}
                  </span>
                </v-btn>

                <div class="mt-8">
                  <v-chip
                    class="ma-1 responsive-chip"
                    :color="colorPalette.primary.main"
                    text-color="white"
                    size="small"
                  >
                    <v-icon left size="small">mdi-shield-check</v-icon>
                    <span class="responsive-chip-text">Secure</span>
                  </v-chip>
                  <v-chip
                    class="ma-1 responsive-chip"
                    :color="colorPalette.primary.main"
                    text-color="white"
                    size="small"
                  >
                    <v-icon left size="small">mdi-account-group</v-icon>
                    <span class="responsive-chip-text">10K+ Users</span>
                  </v-chip>
                  <v-chip
                    class="ma-1 responsive-chip"
                    :color="colorPalette.primary.main"
                    text-color="white"
                    size="small"
                  >
                    <v-icon left size="small">mdi-star</v-icon>
                    <span class="responsive-chip-text">4.8 Rating</span>
                  </v-chip>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- About Section -->
      <section id="about" class="py-16 about-section">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center mb-12">
              <h2 class="responsive-section-title">About Closeshop</h2>
              <p class="responsive-section-subtitle">
                A revolutionary shopping platform developed by Caraga State University students
              </p>
              <v-divider width="100" class="mx-auto mt-6 primary-divider"></v-divider>
            </v-col>

            <!-- Features -->
            <v-col cols="12" md="7">
              <v-card class="pa-6 h-100 info-card" elevation="2">
                <div class="d-flex align-center mb-6">
                  <div class="icon-wrapper mr-4">
                    <v-icon size="48" :color="colorPalette.primary.main">mdi-star-circle</v-icon>
                  </div>
                  <h3 class="responsive-feature-title">Key Features</h3>
                </div>
                <v-list lines="two" class="py-0 feature-list">
                  <!-- Feature 1 -->
                  <v-list-item class="px-0 mb-3 feature-item responsive-feature-item">
                    <template v-slot:prepend>
                      <v-icon :color="colorPalette.primary.main" class="mr-3 mr-sm-4 feature-icon">
                        mdi-school
                      </v-icon>
                    </template>
                    <v-list-item-title class="responsive-feature-text">
                      Developed by Caraga State University students
                    </v-list-item-title>
                  </v-list-item>

                  <!-- Feature 2 -->
                  <v-list-item class="px-0 mb-3 feature-item responsive-feature-item">
                    <template v-slot:prepend>
                      <v-icon :color="colorPalette.primary.main" class="mr-3 mr-sm-4 feature-icon">
                        mdi-chart-line
                      </v-icon>
                    </template>
                    <v-list-item-title class="responsive-feature-text">
                      Helps business owners grow online visibility
                    </v-list-item-title>
                  </v-list-item>

                  <!-- Feature 3 -->
                  <v-list-item class="px-0 mb-3 feature-item responsive-feature-item">
                    <template v-slot:prepend>
                      <v-icon :color="colorPalette.primary.main" class="mr-3 mr-sm-4 feature-icon">
                        mdi-cart
                      </v-icon>
                    </template>
                    <v-list-item-title class="responsive-feature-text">
                      Improves shopping experience for consumers
                    </v-list-item-title>
                  </v-list-item>

                  <!-- Feature 4 -->
                  <v-list-item class="px-0 mb-3 feature-item responsive-feature-item">
                    <template v-slot:prepend>
                      <v-icon :color="colorPalette.primary.main" class="mr-3 mr-sm-4 feature-icon">
                        mdi-account-group
                      </v-icon>
                    </template>
                    <v-list-item-title class="responsive-feature-text">
                      Easy-to-use interface for all users
                    </v-list-item-title>
                  </v-list-item>

                  <!-- Feature 5 -->
                  <v-list-item class="px-0 mb-3 feature-item responsive-feature-item">
                    <template v-slot:prepend>
                      <v-icon :color="colorPalette.primary.main" class="mr-3 mr-sm-4 feature-icon">
                        mdi-map-marker
                      </v-icon>
                    </template>
                    <v-list-item-title class="responsive-feature-text">
                      Display shop on the map for better visibility and connectivity
                    </v-list-item-title>
                  </v-list-item>

                  <!-- Feature 6 -->
                  <v-list-item class="px-0 mb-3 feature-item responsive-feature-item">
                    <template v-slot:prepend>
                      <v-icon :color="colorPalette.primary.main" class="mr-3 mr-sm-4 feature-icon">
                        mdi-handshake
                      </v-icon>
                    </template>
                    <v-list-item-title class="responsive-feature-text">
                      Location-based Platform to connect local businesses and customers
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <!-- App Info -->
            <v-col cols="12" md="5">
              <v-card class="pa-6 h-100 info-card" elevation="2">
                <div class="d-flex align-center mb-6">
                  <div class="icon-wrapper mr-4">
                    <v-icon size="48" :color="colorPalette.primary.main">mdi-information</v-icon>
                  </div>
                  <h3 class="responsive-feature-title">App Details</h3>
                </div>
                <v-simple-table class="app-info-table">
                  <template v-slot:default>
                    <tbody>
                      <!-- Developer -->
                      <tr class="info-row responsive-info-row">
                        <td class="font-weight-bold responsive-table-header py-3" style="color: #3f83c7">
                          Developer
                        </td>
                        <td class="responsive-table-data py-3">
                          <span class="app-info-text">Charles Q. Neri, Queen Zayvy P. Israel, Nel O. Ochate</span>
                        </td>
                      </tr>
                      <!-- Size -->
                      <tr class="info-row responsive-info-row">
                        <td class="font-weight-bold responsive-table-header py-3" style="color: #3f83c7">
                          Size
                        </td>
                        <td class="responsive-table-data py-3">
                          <span class="app-info-text">12.7 MB</span>
                        </td>
                      </tr>
                      <!-- Requires -->
                      <tr class="info-row responsive-info-row">
                        <td class="font-weight-bold responsive-table-header py-3" style="color: #3f83c7">
                          Requires
                        </td>
                        <td class="responsive-table-data py-3">
                          <span class="app-info-text">Android 8.0 or higher</span>
                        </td>
                      </tr>
                      <!-- Last Updated -->
                      <tr class="info-row responsive-info-row">
                        <td class="font-weight-bold responsive-table-header py-3" style="color: #3f83c7">
                          Last Updated
                        </td>
                        <td class="responsive-table-data py-3">
                          <span class="app-info-text">December 2025</span>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Guide Section -->
      <section id="guide" class="py-16 guide-section">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center mb-12">
              <h2 class="responsive-section-title">User Guide</h2>
              <p class="responsive-section-subtitle">
                Learn how to make the most of Closeshop with our step-by-step guides
              </p>
              <v-divider width="100" class="mx-auto mt-6 primary-divider"></v-divider>
            </v-col>

            <!-- How to Create an Account Guide -->
            <v-col cols="12" class="mb-16">
              <v-card class="pa-6 guide-card" elevation="2">
                <div class="d-flex align-center mb-6">
                  <v-icon size="48" :color="colorPalette.primary.main" class="mr-4"
                    >mdi-account-plus</v-icon
                  >
                  <h3 class="responsive-guide-title">How to Create an Account</h3>
                </div>

                <v-stepper v-model="accountCreationStep" class="elevation-0">
                  <v-stepper-header class="stepper-header">
                    <v-stepper-step
                      :complete="accountCreationStep > 1"
                      step="1"
                      :color="colorPalette.primary.main"
                      class="responsive-stepper-step"
                    >
                      <span class="responsive-step-text">Register Account</span>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step
                      :complete="accountCreationStep > 2"
                      step="2"
                      :color="colorPalette.primary.main"
                      class="responsive-stepper-step"
                    >
                      <span class="responsive-step-text">Verify Email</span>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="3" :color="colorPalette.primary.main" class="responsive-stepper-step">
                      <span class="responsive-step-text">Login to Account</span>
                    </v-stepper-step>
                  </v-stepper-header>

                  <v-stepper-items>
                    <v-stepper-content step="1">
                      <div class="step-content">
                        <h4 class="responsive-step-title">
                          {{ accountCreationImages[0].title }}
                        </h4>

                        <!-- Clickable Image Container -->
                        <div
                          class="image-container mb-4"
                          @click="openImageViewer(accountCreationImages[0])"
                        >
                          <v-img
                            :src="accountCreationImages[0].src"
                            :alt="accountCreationImages[0].alt"
                            class="rounded-lg clickable-image"
                            contain
                            :style="{ 'max-height': '400px' }"
                          >
                            <template v-slot:placeholder>
                              <div class="image-placeholder">
                                <v-icon size="48" color="grey">mdi-image</v-icon>
                              </div>
                            </template>
                          </v-img>
                          <div class="image-overlay">
                            <v-icon size="24" color="white">mdi-magnify-plus-outline</v-icon>
                            <span class="ml-2 responsive-overlay-text">Click to zoom</span>
                          </div>
                        </div>

                        <p class="responsive-instruction">
                          {{ accountCreationImages[0].description }}
                        </p>
                        <div class="text-center mt-6">
                          <v-btn
                            :color="colorPalette.primary.main"
                            @click="nextAccountStep"
                            variant="flat"
                            size="large"
                            class="responsive-guide-btn"
                          >
                            <span class="responsive-btn-text">Next Step</span>
                            <v-icon right>mdi-arrow-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                      <div class="step-content">
                        <h4 class="responsive-step-title">
                          {{ accountCreationImages[1].title }}
                        </h4>

                        <!-- Clickable Image Container -->
                        <div
                          class="image-container mb-4"
                          @click="openImageViewer(accountCreationImages[1])"
                        >
                          <v-img
                            :src="accountCreationImages[1].src"
                            :alt="accountCreationImages[1].alt"
                            class="rounded-lg clickable-image"
                            contain
                            :style="{ 'max-height': '400px' }"
                          >
                            <template v-slot:placeholder>
                              <div class="image-placeholder">
                                <v-icon size="48" color="grey">mdi-image</v-icon>
                              </div>
                            </template>
                          </v-img>
                          <div class="image-overlay">
                            <v-icon size="24" color="white">mdi-magnify-plus-outline</v-icon>
                            <span class="ml-2 responsive-overlay-text">Click to zoom</span>
                          </div>
                        </div>

                        <p class="responsive-instruction">
                          {{ accountCreationImages[1].description }}
                        </p>
                        <div class="d-flex justify-space-between mt-6 responsive-guide-btns">
                          <v-btn variant="outlined" @click="prevAccountStep" size="large" class="responsive-guide-btn">
                            <v-icon left>mdi-arrow-left</v-icon>
                            <span class="responsive-btn-text">Previous</span>
                          </v-btn>
                          <v-btn
                            :color="colorPalette.primary.main"
                            @click="nextAccountStep"
                            variant="flat"
                            size="large"
                            class="responsive-guide-btn"
                          >
                            <span class="responsive-btn-text">Next Step</span>
                            <v-icon right>mdi-arrow-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                      <div class="step-content">
                        <h4 class="responsive-step-title">
                          {{ accountCreationImages[2].title }}
                        </h4>

                        <!-- Clickable Image Container -->
                        <div
                          class="image-container mb-4"
                          @click="openImageViewer(accountCreationImages[2])"
                        >
                          <v-img
                            :src="accountCreationImages[2].src"
                            :alt="accountCreationImages[2].alt"
                            class="rounded-lg clickable-image"
                            contain
                            :style="{ 'max-height': '400px' }"
                          >
                            <template v-slot:placeholder>
                              <div class="image-placeholder">
                                <v-icon size="48" color="grey">mdi-image</v-icon>
                              </div>
                            </template>
                          </v-img>
                          <div class="image-overlay">
                            <v-icon size="24" color="white">mdi-magnify-plus-outline</v-icon>
                            <span class="ml-2 responsive-overlay-text">Click to zoom</span>
                          </div>
                        </div>

                        <p class="responsive-instruction">
                          {{ accountCreationImages[2].description }}
                        </p>
                        <div class="d-flex justify-space-between mt-6 responsive-guide-btns">
                          <v-btn variant="outlined" @click="prevAccountStep" size="large" class="responsive-guide-btn">
                            <v-icon left>mdi-arrow-left</v-icon>
                            <span class="responsive-btn-text">Previous</span>
                          </v-btn>
                          <v-btn
                            :color="colorPalette.primary.main"
                            @click="restartAccountGuide"
                            variant="flat"
                            size="large"
                            class="responsive-guide-btn"
                          >
                            <v-icon left>mdi-restart</v-icon>
                            <span class="responsive-btn-text">Restart Guide</span>
                          </v-btn>
                        </div>
                      </div>
                    </v-stepper-content>
                  </v-stepper-items>
                </v-stepper>
              </v-card>
            </v-col>

            <!-- How to Create a Shop Guide -->
            <v-col cols="12" class="mb-16">
              <v-card class="pa-6 guide-card" elevation="2">
                <div class="d-flex align-center mb-6">
                  <v-icon size="48" :color="colorPalette.primary.main" class="mr-4"
                    >mdi-store-plus</v-icon
                  >
                  <h3 class="responsive-guide-title">How to Create a Shop</h3>
                </div>

                <v-stepper v-model="shopCreationStep" class="elevation-0">
                  <v-stepper-header class="stepper-header">
                    <v-stepper-step
                      :complete="shopCreationStep > 1"
                      step="1"
                      :color="colorPalette.primary.main"
                      class="responsive-stepper-step"
                    >
                      <span class="responsive-step-text">Access Create Shop</span>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step
                      :complete="shopCreationStep > 2"
                      step="2"
                      :color="colorPalette.primary.main"
                      class="responsive-stepper-step"
                    >
                      <span class="responsive-step-text">Fill Shop Details</span>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="3" :color="colorPalette.primary.main" class="responsive-stepper-step">
                      <span class="responsive-step-text">Wait for Approval</span>
                    </v-stepper-step>
                  </v-stepper-header>

                  <v-stepper-items>
                    <v-stepper-content step="1">
                      <div class="step-content">
                        <h4 class="responsive-step-title">
                          {{ shopGuideImages[0].title }}
                        </h4>

                        <!-- Clickable Image Container -->
                        <div
                          class="image-container mb-4"
                          @click="openImageViewer(shopGuideImages[0])"
                        >
                          <v-img
                            :src="shopGuideImages[0].src"
                            :alt="shopGuideImages[0].alt"
                            class="rounded-lg clickable-image"
                            contain
                            :style="{ 'max-height': '400px' }"
                          >
                            <template v-slot:placeholder>
                              <div class="image-placeholder">
                                <v-icon size="48" color="grey">mdi-image</v-icon>
                              </div>
                            </template>
                          </v-img>
                          <div class="image-overlay">
                            <v-icon size="24" color="white">mdi-magnify-plus-outline</v-icon>
                            <span class="ml-2 responsive-overlay-text">Click to zoom</span>
                          </div>
                        </div>

                        <p class="responsive-instruction">
                          {{ shopGuideImages[0].description }}
                        </p>
                        <div class="text-center mt-6">
                          <v-btn
                            :color="colorPalette.primary.main"
                            @click="nextShopStep"
                            variant="flat"
                            size="large"
                            class="responsive-guide-btn"
                          >
                            <span class="responsive-btn-text">Next Step</span>
                            <v-icon right>mdi-arrow-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                      <div class="step-content">
                        <h4 class="responsive-step-title">
                          {{ shopGuideImages[1].title }}
                        </h4>

                        <!-- Clickable Image Container -->
                        <div
                          class="image-container mb-4"
                          @click="openImageViewer(shopGuideImages[1])"
                        >
                          <v-img
                            :src="shopGuideImages[1].src"
                            :alt="shopGuideImages[1].alt"
                            class="rounded-lg clickable-image"
                            contain
                            :style="{ 'max-height': '400px' }"
                          >
                            <template v-slot:placeholder>
                              <div class="image-placeholder">
                                <v-icon size="48" color="grey">mdi-image</v-icon>
                              </div>
                            </template>
                          </v-img>
                          <div class="image-overlay">
                            <v-icon size="24" color="white">mdi-magnify-plus-outline</v-icon>
                            <span class="ml-2 responsive-overlay-text">Click to zoom</span>
                          </div>
                        </div>

                        <p class="responsive-instruction">
                          {{ shopGuideImages[1].description }}
                        </p>
                        <div class="d-flex justify-space-between mt-6 responsive-guide-btns">
                          <v-btn variant="outlined" @click="prevShopStep" size="large" class="responsive-guide-btn">
                            <v-icon left>mdi-arrow-left</v-icon>
                            <span class="responsive-btn-text">Previous</span>
                          </v-btn>
                          <v-btn
                            :color="colorPalette.primary.main"
                            @click="nextShopStep"
                            variant="flat"
                            size="large"
                            class="responsive-guide-btn"
                          >
                            <span class="responsive-btn-text">Next Step</span>
                            <v-icon right>mdi-arrow-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                      <div class="step-content">
                        <h4 class="responsive-step-title">
                          {{ shopGuideImages[2].title }}
                        </h4>

                        <!-- Clickable Image Container -->
                        <div
                          class="image-container mb-4"
                          @click="openImageViewer(shopGuideImages[2])"
                        >
                          <v-img
                            :src="shopGuideImages[2].src"
                            :alt="shopGuideImages[2].alt"
                            class="rounded-lg clickable-image"
                            contain
                            :style="{ 'max-height': '400px' }"
                          >
                            <template v-slot:placeholder>
                              <div class="image-placeholder">
                                <v-icon size="48" color="grey">mdi-image</v-icon>
                              </div>
                            </template>
                          </v-img>
                          <div class="image-overlay">
                            <v-icon size="24" color="white">mdi-magnify-plus-outline</v-icon>
                            <span class="ml-2 responsive-overlay-text">Click to zoom</span>
                          </div>
                        </div>

                        <p class="responsive-instruction">
                          {{ shopGuideImages[2].description }}
                        </p>
                        <div class="d-flex justify-space-between mt-6 responsive-guide-btns">
                          <v-btn variant="outlined" @click="prevShopStep" size="large" class="responsive-guide-btn">
                            <v-icon left>mdi-arrow-left</v-icon>
                            <span class="responsive-btn-text">Previous</span>
                          </v-btn>
                          <v-btn
                            :color="colorPalette.primary.main"
                            @click="restartShopGuide"
                            variant="flat"
                            size="large"
                            class="responsive-guide-btn"
                          >
                            <v-icon left>mdi-restart</v-icon>
                            <span class="responsive-btn-text">Restart Guide</span>
                          </v-btn>
                        </div>
                      </div>
                    </v-stepper-content>
                  </v-stepper-items>
                </v-stepper>
              </v-card>
            </v-col>

            <!-- Navigation Guide -->
            <v-col cols="12">
              <v-card class="pa-6 guide-card" elevation="2">
                <div class="d-flex align-center mb-6">
                  <v-icon size="48" :color="colorPalette.primary.main" class="mr-4"
                    >mdi-navigation</v-icon
                  >
                  <h3 class="responsive-guide-title">App Navigation Guide</h3>
                </div>

                <p class="responsive-guide-intro">
                  Explore the main sections of the Closeshop app. Click on any image to view it in
                  full screen.
                </p>

                <v-row>
                  <v-col
                    v-for="image in navigationImages"
                    :key="image.id"
                    cols="12"
                    sm="6"
                    class="mb-6"
                  >
                    <div class="navigation-card pa-4 h-100" @click="openImageViewer(image)">
                      <!-- Clickable Image -->
                      <div class="image-container mb-4">
                        <v-img
                          :src="image.src"
                          :alt="image.alt"
                          class="mb-4 rounded-lg clickable-image"
                          contain
                          :style="{ 'max-height': '250px' }"
                        >
                          <template v-slot:placeholder>
                            <div class="image-placeholder">
                              <v-icon size="48" color="grey">mdi-image</v-icon>
                            </div>
                          </template>
                        </v-img>
                        <div class="image-overlay small">
                          <v-icon size="20" color="white">mdi-magnify-plus-outline</v-icon>
                        </div>
                      </div>

                      <h4 class="responsive-nav-title">{{ image.title }}</h4>
                      <p class="responsive-nav-description">
                        {{ image.description }}
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Download Section -->
      <section id="download-section" class="py-16 download-section">
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12" md="10" lg="8" class="text-center">
              <v-card
                class="pa-8 pa-sm-12 download-card"
                :style="{ background: colorPalette.primary.gradient }"
                elevation="8"
              >
                <div class="android-icon mb-6">
                  <v-icon size="80" color="white">mdi-android</v-icon>
                </div>

                <h2 class="responsive-download-title text-white">Ready to Get Started?</h2>

                <p class="responsive-download-subtitle text-white">
                  Join thousands of satisfied users. Download Closeshop today and transform your
                  shopping experience.
                </p>

                <v-btn
                  color="white"
                  size="x-large"
                  @click="downloadAPK"
                  rounded
                  class="px-8 mb-4 download-action-btn responsive-download-action-btn"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  <template v-slot:loader>
                    <v-progress-circular
                      indeterminate
                      :color="colorPalette.primary.main"
                      size="24"
                    ></v-progress-circular>
                  </template>
                  <v-icon left>mdi-download</v-icon>
                  <span class="responsive-btn-label">
                    {{
                      isLoading
                        ? 'Downloading...'
                        : isMobileDevice
                          ? 'Download for Android'
                          : 'Download Free APK'
                    }}
                  </span>
                </v-btn>

                <div class="mt-8">
                  <p class="responsive-download-info text-white">Version 1.0.0 • 25 MB • Android 8.0+</p>
                  <div>
                    <v-chip
                      class="ma-1 responsive-chip"
                      color="white"
                      :text-color="colorPalette.primary.main"
                      size="small"
                    >
                      <v-icon left size="small">mdi-shield-check</v-icon>
                      <span class="responsive-chip-text">No Ads</span>
                    </v-chip>
                    <v-chip
                      class="ma-1 responsive-chip"
                      color="white"
                      :text-color="colorPalette.primary.main"
                      size="small"
                    >
                      <v-icon left size="small">mdi-update</v-icon>
                      <span class="responsive-chip-text">Regular Updates</span>
                    </v-chip>
                    <v-chip
                      class="ma-1 responsive-chip"
                      color="white"
                      :text-color="colorPalette.primary.main"
                      size="small"
                    >
                      <v-icon left size="small">mdi-headset</v-icon>
                      <span class="responsive-chip-text">Free Support</span>
                    </v-chip>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </v-main>

    <!-- Footer -->
    <v-footer :style="{ background: colorPalette.primary.gradient }" class="mt-auto">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="text-center text-md-left">
            <div class="d-flex align-center justify-center justify-md-start mb-4">
              <v-img
                :src="logoUrl"
                alt="Closeshop Logo"
                max-height="40"
                max-width="40"
                class="mr-3 responsive-footer-logo"
              ></v-img>
              <h3 class="responsive-footer-title text-white">Closeshop</h3>
            </div>
            <p class="responsive-footer-text text-white mb-0">
              © 2024 Closeshop Team, Caraga State University. All rights reserved.
            </p>
          </v-col>

          <v-col cols="12" md="6" class="text-center text-md-right">
            <div class="mb-4">
              <v-btn
                v-for="link in footerLinks"
                :key="link.text"
                :href="link.href"
                target="_blank"
                icon
                variant="text"
                size="small"
                class="mx-2 responsive-footer-icon"
                color="white"
                :title="link.text"
              >
                <v-icon>{{ link.icon }}</v-icon>
              </v-btn>
            </div>
            <p class="responsive-footer-contact text-white">closeshop@example.com • +63 123 456 7890</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Download Dialog -->
    <v-dialog v-model="downloadDialog" max-width="500">
      <v-card>
        <v-card-title class="responsive-dialog-title d-flex align-center">
          <v-icon :color="downloadSuccess ? colorPalette.success : colorPalette.primary.main" left>
            {{ downloadSuccess ? 'mdi-check-circle' : 'mdi-download' }}
          </v-icon>
          {{ downloadSuccess ? 'Download Started!' : 'Download Instructions' }}
        </v-card-title>

        <v-card-text>
          <div v-if="isMobileDevice && /Android/i.test(navigator.userAgent)" class="mb-4">
            <v-alert type="info" density="compact" class="mb-4 responsive-alert">
              <v-icon left>mdi-android</v-icon>
              <span class="responsive-alert-text">Android Device Detected</span>
            </v-alert>

            <p class="responsive-dialog-subtitle mb-2">
              <strong>For Android devices:</strong>
            </p>
            <ol class="responsive-dialog-list pl-4 mb-4">
              <li>Tap "OK" or "Download" in your browser</li>
              <li>The APK will download to your device</li>
              <li>Open your file manager and locate the APK</li>
              <li>Tap the APK file to install</li>
            </ol>
          </div>

          <div
            v-else-if="isMobileDevice && /iPhone|iPad|iPod/i.test(navigator.userAgent)"
            class="mb-4"
          >
            <v-alert type="warning" density="compact" class="mb-4 responsive-alert">
              <v-icon left>mdi-apple</v-icon>
              <span class="responsive-alert-text">iOS Device Detected</span>
            </v-alert>

            <p class="responsive-dialog-subtitle mb-2">
              <strong>Important:</strong>
            </p>
            <p class="responsive-dialog-text mb-4">
              APK files can only be installed on Android devices. Please use an Android device to
              download and install Closeshop.
            </p>
          </div>

          <p v-if="downloadSuccess" class="responsive-dialog-text">
            <v-icon :color="colorPalette.success" left>mdi-check</v-icon>
            {{ isMobileDevice ? 'Opening download...' : 'Download started successfully!' }}
          </p>
          <p v-else class="responsive-dialog-text">
            <v-icon :color="colorPalette.primary.main" left>mdi-download</v-icon>
            Your download should begin automatically.
          </p>

          <p class="responsive-dialog-subtitle mt-4">
            <strong>Installation Steps:</strong>
          </p>
          <ol class="responsive-dialog-list pl-4">
            <li v-if="!downloadSuccess">
              Allow installation from unknown sources in Android settings
            </li>
            <li>Open the downloaded APK file</li>
            <li>Follow the installation prompts</li>
            <li>Open Closeshop and create your account</li>
          </ol>

          <div v-if="downloadError" class="mt-4">
            <v-alert type="error" density="compact" class="responsive-alert">
              <v-icon left>mdi-alert-circle</v-icon>
              <span class="responsive-alert-text">{{ downloadError }}</span>
            </v-alert>
          </div>

          <!-- Direct download link as backup -->
          <div class="mt-6">
            <p class="responsive-dialog-text mb-2">If download doesn't start:</p>
            <v-btn
              :href="apkUrl"
              target="_blank"
              :color="colorPalette.primary.main"
              variant="outlined"
              block
              @click="downloadDialog = false"
              class="responsive-dialog-btn"
            >
              <v-icon left>mdi-link</v-icon>
              <span class="responsive-btn-text">Open Direct Link</span>
            </v-btn>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="colorPalette.primary.main" @click="downloadDialog = false" variant="flat" class="responsive-dialog-btn">
            <span class="responsive-btn-text">Got it</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Image Viewer Dialog (Full Screen) -->
    <v-dialog
      v-model="imageViewer.open"
      fullscreen
      transition="dialog-bottom-transition"
      scrim="black"
    >
      <v-card color="black" class="image-viewer-card">
        <v-toolbar color="transparent" density="compact" class="image-viewer-toolbar">
          <v-toolbar-title class="text-white responsive-image-viewer-title">{{ imageViewer.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeImageViewer" color="white" class="responsive-close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <div class="image-viewer-content">
          <!-- Navigation Buttons -->
          <v-btn
            icon
            @click="navigateImages('prev', accountCreationImages)"
            v-if="accountCreationImages.find(img => img.src === imageViewer.src)"
            class="nav-btn prev-btn responsive-nav-btn"
            color="white"
            size="x-large"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="navigateImages('prev', shopGuideImages)"
            v-else-if="shopGuideImages.find(img => img.src === imageViewer.src)"
            class="nav-btn prev-btn responsive-nav-btn"
            color="white"
            size="x-large"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="navigateImages('prev', navigationImages)"
            v-else
            class="nav-btn prev-btn responsive-nav-btn"
            color="white"
            size="x-large"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <!-- Main Image -->
          <div class="full-image-container">
            <v-img
              :src="imageViewer.src"
              :alt="imageViewer.alt"
              class="full-image"
              contain
              @click="closeImageViewer"
            >
              <template v-slot:placeholder>
                <div class="full-image-placeholder">
                  <v-progress-circular indeterminate color="white" size="64"></v-progress-circular>
                </div>
              </template>
            </v-img>
          </div>

          <!-- Navigation Buttons -->
          <v-btn
            icon
            @click="navigateImages('next', accountCreationImages)"
            v-if="accountCreationImages.find(img => img.src === imageViewer.src)"
            class="nav-btn next-btn responsive-nav-btn"
            color="white"
            size="x-large"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="navigateImages('next', shopGuideImages)"
            v-else-if="shopGuideImages.find(img => img.src === imageViewer.src)"
            class="nav-btn next-btn responsive-nav-btn"
            color="white"
            size="x-large"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="navigateImages('next', navigationImages)"
            v-else
            class="nav-btn next-btn responsive-nav-btn"
            color="white"
            size="x-large"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <!-- Instructions -->
        <div class="image-viewer-footer">
          <p class="responsive-image-viewer-hint text-center mb-2">
            Use arrow keys or buttons to navigate • Click image or press ESC to close
          </p>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style scoped>
/* Color Variables */
:root {
  --primary-main: #3f83c7;
  --primary-light: #6ba1d4;
  --primary-dark: #2c5c8d;
  --primary-gradient: linear-gradient(135deg, #3f83c7 0%, #5a95d1 100%);
  
  /* Fluid font size variables */
  --fluid-xs: clamp(0.75rem, 2vw, 0.875rem);
  --fluid-sm: clamp(0.875rem, 2.5vw, 1rem);
  --fluid-base: clamp(1rem, 3vw, 1.125rem);
  --fluid-lg: clamp(1.125rem, 3.5vw, 1.25rem);
  --fluid-xl: clamp(1.25rem, 4vw, 1.5rem);
  --fluid-2xl: clamp(1.5rem, 5vw, 2rem);
  --fluid-3xl: clamp(2rem, 6vw, 2.5rem);
  --fluid-4xl: clamp(2.5rem, 7vw, 3rem);
  
  /* Line heights */
  --lh-tight: 1.2;
  --lh-normal: 1.4;
  --lh-relaxed: 1.6;
  --lh-loose: 1.8;
}

/* ============ RESPONSIVE TYPOGRAPHY ============ */

/* App Bar */
.responsive-toolbar-title {
  font-size: clamp(1.25rem, 4vw, 1.5rem) !important;
  line-height: var(--lh-tight);
}

.responsive-nav-btn .responsive-btn-text {
  font-size: clamp(0.875rem, 2vw, 1rem) !important;
  line-height: var(--lh-tight);
}

.responsive-drawer-item .responsive-list-text {
  font-size: var(--fluid-base) !important;
  line-height: var(--lh-normal);
}

/* Hero Section */
.responsive-h1 {
  font-size: clamp(2rem, 8vw, 3.5rem) !important;
  line-height: var(--lh-tight);
  font-weight: 700;
  margin-bottom: 1rem !important;
}

.responsive-hero-subtitle {
  font-size: clamp(1rem, 4vw, 1.5rem) !important;
  line-height: var(--lh-normal);
  margin-bottom: 2rem !important;
}

.responsive-download-btn {
  font-size: clamp(1rem, 3vw, 1.125rem) !important;
  line-height: var(--lh-normal);
}

.responsive-btn-label {
  font-size: inherit !important;
  line-height: inherit !important;
}

.responsive-logo {
  max-height: clamp(80px, 20vw, 140px) !important;
  max-width: clamp(80px, 20vw, 140px) !important;
}

.responsive-chip .responsive-chip-text {
  font-size: clamp(0.75rem, 2vw, 0.875rem) !important;
  line-height: var(--lh-tight);
}

/* Section Titles */
.responsive-section-title {
  font-size: clamp(1.75rem, 6vw, 2.5rem) !important;
  line-height: var(--lh-tight);
  margin-bottom: 1rem !important;
}

.responsive-section-subtitle {
  font-size: clamp(1rem, 3vw, 1.25rem) !important;
  line-height: var(--lh-normal);
  max-width: 800px;
  margin: 0 auto;
}

/* Features */
.responsive-feature-title {
  font-size: clamp(1.25rem, 4vw, 1.75rem) !important;
  line-height: var(--lh-tight);
}

.responsive-feature-item {
  width: 100% !important;
  max-width: 100% !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.feature-icon {
  flex-shrink: 0 !important;
  margin-right: 12px !important;
  font-size: 24px !important;
}

.responsive-feature-text {
  font-size: clamp(0.875rem, 2.5vw, 1rem) !important;
  line-height: var(--lh-relaxed) !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  hyphens: auto !important;
  display: block !important;
  width: 100% !important;
  text-align: left !important;
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}

/* Table Text */
.responsive-table-header {
  font-size: clamp(0.75rem, 2vw, 0.875rem) !important;
  line-height: var(--lh-normal);
  min-width: 100px;
}

.responsive-table-data {
  font-size: clamp(0.75rem, 2vw, 0.875rem) !important;
  line-height: var(--lh-normal);
  max-width: 200px;
}

.app-info-text {
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  hyphens: auto !important;
  display: block !important;
  width: 100% !important;
  white-space: normal !important;
}

/* Guide Section */
.responsive-guide-title {
  font-size: clamp(1.5rem, 5vw, 2rem) !important;
  line-height: var(--lh-tight);
}

.responsive-step-title {
  font-size: clamp(1.125rem, 4vw, 1.5rem) !important;
  line-height: var(--lh-normal);
  font-weight: 600;
  margin-bottom: 1rem !important;
}

.responsive-step-text {
  font-size: clamp(0.75rem, 2.5vw, 0.875rem) !important;
  line-height: var(--lh-tight);
}

.responsive-instruction {
  font-size: var(--fluid-base) !important;
  line-height: var(--lh-relaxed);
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
}

.responsive-guide-intro {
  font-size: var(--fluid-base) !important;
  line-height: var(--lh-relaxed);
  margin-bottom: 1.5rem !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
}

.responsive-guide-btn .responsive-btn-text {
  font-size: clamp(0.875rem, 2.5vw, 1rem) !important;
  line-height: var(--lh-tight);
}

.responsive-stepper-step {
  padding: 12px !important;
}

/* Navigation Cards */
.responsive-nav-title {
  font-size: clamp(1.125rem, 4vw, 1.25rem) !important;
  line-height: var(--lh-tight);
  font-weight: 600;
  margin-bottom: 0.5rem !important;
}

.responsive-nav-description {
  font-size: var(--fluid-sm) !important;
  line-height: var(--lh-relaxed);
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
}

.responsive-overlay-text {
  font-size: var(--fluid-xs) !important;
  line-height: var(--lh-tight);
}

/* Download Section */
.responsive-download-title {
  font-size: clamp(1.75rem, 6vw, 2.5rem) !important;
  line-height: var(--lh-tight);
  margin-bottom: 1rem !important;
}

.responsive-download-subtitle {
  font-size: clamp(1rem, 3vw, 1.25rem) !important;
  line-height: var(--lh-normal);
  margin-bottom: 2rem !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
}

.responsive-download-action-btn {
  font-size: clamp(1rem, 3vw, 1.125rem) !important;
  line-height: var(--lh-normal);
}

.responsive-download-info {
  font-size: var(--fluid-sm) !important;
  line-height: var(--lh-tight);
  margin-bottom: 1rem !important;
}

/* Footer */
.responsive-footer-title {
  font-size: clamp(1.25rem, 4vw, 1.5rem) !important;
  line-height: var(--lh-tight);
}

.responsive-footer-text {
  font-size: var(--fluid-sm) !important;
  line-height: var(--lh-normal);
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
}

.responsive-footer-contact {
  font-size: var(--fluid-xs) !important;
  line-height: var(--lh-tight);
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
}

.responsive-footer-logo {
  max-height: clamp(30px, 8vw, 40px) !important;
  max-width: clamp(30px, 8vw, 40px) !important;
}

.responsive-footer-icon {
  width: clamp(36px, 10vw, 40px) !important;
  height: clamp(36px, 10vw, 40px) !important;
}

/* Dialog */
.responsive-dialog-title {
  font-size: clamp(1.25rem, 4vw, 1.5rem) !important;
  line-height: var(--lh-tight);
}

.responsive-dialog-subtitle {
  font-size: var(--fluid-base) !important;
  line-height: var(--lh-normal);
  font-weight: 600;
}

.responsive-dialog-text {
  font-size: var(--fluid-base) !important;
  line-height: var(--lh-relaxed);
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
}

.responsive-dialog-list {
  font-size: var(--fluid-sm) !important;
  line-height: var(--lh-relaxed);
}

.responsive-alert .responsive-alert-text {
  font-size: var(--fluid-sm) !important;
  line-height: var(--lh-normal);
  word-break: break-word !important;
  white-space: normal !important;
}

.responsive-dialog-btn .responsive-btn-text {
  font-size: var(--fluid-sm) !important;
  line-height: var(--lh-tight);
}

/* Image Viewer */
.responsive-image-viewer-title {
  font-size: clamp(1rem, 4vw, 1.25rem) !important;
  line-height: var(--lh-tight);
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.responsive-image-viewer-hint {
  font-size: var(--fluid-xs) !important;
  line-height: var(--lh-tight);
}

.responsive-close-btn {
  width: clamp(36px, 10vw, 48px) !important;
  height: clamp(36px, 10vw, 48px) !important;
}

.responsive-nav-btn {
  width: clamp(40px, 12vw, 56px) !important;
  height: clamp(40px, 12vw, 56px) !important;
}

/* ============ EXISTING STYLES WITH MOBILE ENHANCEMENTS ============ */

/* Hero Section */
.hero-section {
  min-height: 90vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e4edf7 100%);
  display: flex;
  align-items: center;
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
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(63, 131, 199, 0.05) 50%,
    transparent 70%
  );
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.hero-card {
  background: #3f83c7 !important;
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 
    0 20px 60px rgba(63, 131, 199, 0.25) !important,
    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
  position: relative;
  z-index: 1;
  color: white !important;
}

.hero-card .gradient-text {
  background: linear-gradient(to right, #ffffff, #e6f2ff) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.hero-card .text-grey-darken-2 {
  color: rgba(255, 255, 255, 0.9) !important;
}

.hero-card .v-chip {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

.logo-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Download Button */
.download-btn {
  min-width: 280px;
  padding: 20px 40px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 10px 30px rgba(63, 131, 199, 0.3) !important;
  transition: all 0.3s ease !important;
  color: white !important;
}

.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(63, 131, 199, 0.4) !important;
}

/* Sections */
.about-section {
  background-color: var(--background-light);
}

.guide-section {
  background-color: var(--background-lighter);
}

.download-section {
  background: linear-gradient(135deg, #e4edf7 0%, #f0f6ff 100%);
}

/* Section Titles */
.section-title {
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: var(--primary-gradient);
  border-radius: 2px;
}

.primary-divider {
  border-color: var(--primary-main) !important;
  opacity: 0.3;
}

/* Cards */
.info-card,
.guide-card,
.testimonial-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
  border-left: 4px solid var(--primary-main);
}

.info-card:hover,
.guide-card:hover,
.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(63, 131, 199, 0.2) !important;
}

.download-card {
  border-radius: 24px !important;
  overflow: hidden;
  position: relative;
}

.download-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  animation: shimmer 2s infinite;
}

.android-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.download-action-btn {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
}

.download-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3) !important;
}

/* Guide Section Specific */
.icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(63, 131, 199, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-item {
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateX(8px);
}

.info-row {
  transition: background-color 0.3s ease;
}

.info-row:hover {
  background-color: rgba(63, 131, 199, 0.05);
}

/* Stepper Styling */
.stepper-header {
  background-color: transparent !important;
  box-shadow: none !important;
}

.step-content {
  padding: 24px;
  background: rgba(63, 131, 199, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(63, 131, 199, 0.1);
}

/* Image Containers */
.image-container {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  min-height: 300px;
}

.image-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(63, 131, 199, 0.3) !important;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.clickable-image {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  display: block;
  margin: 0 auto;
}

.image-container:hover .clickable-image {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.image-overlay.small {
  padding: 8px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  min-height: 200px;
}

/* Navigation Cards */
.navigation-card {
  border: 1px solid rgba(63, 131, 199, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.navigation-card:hover {
  border-color: var(--primary-light);
  box-shadow: 0 8px 24px rgba(63, 131, 199, 0.15);
  transform: translateY(-4px);
}

.navigation-card .image-container {
  flex: 0 0 auto;
  height: 250px;
}

.navigation-card h4 {
  flex: 0 0 auto;
}

.navigation-card p {
  flex: 1 0 auto;
}

/* Image Viewer Dialog */
.image-viewer-card {
  background-color: rgba(0, 0, 0, 0.95) !important;
}

.image-viewer-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(10px);
}

.image-viewer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 80px 20px;
  position: relative;
}

.full-image-container {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90vw;
  max-height: 90vh;
  cursor: zoom-out;
}

.full-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  margin: auto;
}

.full-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}

.nav-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  z-index: 1001;
}

.nav-btn:hover {
  background: rgba(63, 131, 199, 0.8) !important;
  border-color: white;
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

.image-viewer-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 1000;
}

/* Utility Classes */
.max-width-800 {
  max-width: 800px;
}

/* Responsive Design - Enhanced for Mobile */
@media (max-width: 960px) {
  .download-btn {
    min-width: 240px;
    padding: 18px 36px !important;
  }

  .hero-section {
    min-height: 80vh;
  }

  .section-title::after {
    width: 40px;
  }

  .stepper-header {
    flex-direction: column;
  }

  .stepper-header .v-divider {
    width: 100%;
    height: 1px;
  }

  .image-viewer-content {
    padding: 60px 10px;
  }

  .nav-btn {
    position: absolute;
    bottom: 20px;
    top: auto;
    transform: none;
  }

  .prev-btn {
    left: 10px;
    bottom: 20px;
  }

  .next-btn {
    right: 10px;
    bottom: 20px;
  }

  .full-image-container {
    max-width: 95vw;
    max-height: 70vh;
  }

  .navigation-card .image-container {
    height: 200px;
  }

  .image-container {
    min-height: 250px;
  }
  
  /* Improved mobile text spacing */
  .responsive-section-title {
    margin-bottom: 0.75rem !important;
  }
  
  .responsive-hero-subtitle {
    margin-bottom: 1.5rem !important;
  }
  
  .responsive-guide-title {
    margin-bottom: 1rem !important;
  }
  
  .step-content {
    padding: 16px !important;
  }
  
  /* Feature list mobile optimization */
  .responsive-feature-item {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  
  .feature-icon {
    margin-right: 8px !important;
    font-size: 20px !important;
  }
}

@media (max-width: 600px) {
  .download-btn {
    min-width: 100%;
    padding: 16px 24px !important;
    font-size: 1rem !important;
  }

  .hero-card {
    padding: 1.5rem !important;
    margin: 0.75rem;
  }

  section {
    padding-top: 2.5rem !important;
    padding-bottom: 2.5rem !important;
  }

  .info-card,
  .guide-card {
    padding: 1.25rem !important;
  }

  .section-title::after {
    width: 30px;
    bottom: -8px;
  }

  .step-content {
    padding: 1rem !important;
  }

  .navigation-card {
    padding: 1rem !important;
  }

  .image-container {
    margin-bottom: 1rem;
    min-height: 200px;
  }

  .image-overlay span {
    display: none;
  }

  .image-overlay {
    opacity: 1;
    background: rgba(0, 0, 0, 0.5);
  }

  .image-overlay.small {
    opacity: 1;
  }

  .guide-section .v-col {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .nav-btn {
    width: 40px !important;
    height: 40px !important;
  }

  .navigation-card .image-container {
    height: 180px;
  }

  .image-container {
    max-height: 300px !important;
  }
  
  /* Extra small mobile optimizations */
  .responsive-h1 {
    margin-bottom: 0.75rem !important;
  }
  
  .responsive-hero-subtitle {
    margin-bottom: 1.25rem !important;
  }
  
  .responsive-download-title {
    margin-bottom: 0.75rem !important;
  }
  
  .responsive-download-subtitle {
    margin-bottom: 1.5rem !important;
  }
  
  .responsive-guide-btns {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .responsive-guide-btns .v-btn {
    width: 100%;
  }
  
  .step-content {
    padding: 0.75rem !important;
  }
  
  .image-container {
    min-height: 180px;
  }
  
  /* Features mobile optimization */
  .responsive-feature-text {
    font-size: clamp(0.875rem, 3vw, 1rem) !important;
    line-height: 1.5 !important;
  }
  
  .feature-icon {
    margin-right: 6px !important;
    font-size: 18px !important;
  }
  
  .app-info-table {
    font-size: 0.875rem !important;
  }
  
  .responsive-table-header,
  .responsive-table-data {
    padding: 8px 4px !important;
  }
}

/* Extra small screens (below 400px) */
@media (max-width: 400px) {
  .hero-card h1 {
    margin-bottom: 0.5rem !important;
  }

  .hero-card p {
    margin-bottom: 1rem !important;
  }

  .v-btn.size-x-large {
    padding: 14px 20px !important;
  }

  .navigation-card h4 {
    margin-bottom: 0.25rem !important;
  }

  .step-title {
    margin-bottom: 0.75rem !important;
  }

  .image-viewer-toolbar .v-toolbar-title {
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .navigation-card .image-container {
    height: 150px;
  }

  .image-container {
    min-height: 150px;
  }
  
  .responsive-feature-title,
  .responsive-guide-title {
    font-size: clamp(1.25rem, 5vw, 1.5rem) !important;
  }
  
  .responsive-section-title {
    font-size: clamp(1.5rem, 6vw, 2rem) !important;
  }
  
  .responsive-h1 {
    font-size: clamp(1.75rem, 8vw, 2.5rem) !important;
  }
  
  /* Features extra small screen optimization */
  .responsive-feature-text {
    font-size: clamp(0.75rem, 2.5vw, 0.875rem) !important;
    line-height: 1.4 !important;
  }
  
  .feature-icon {
    font-size: 16px !important;
    margin-right: 4px !important;
  }
  
  .app-info-table {
    font-size: 0.75rem !important;
  }
  
  .responsive-table-header,
  .responsive-table-data {
    padding: 6px 3px !important;
    font-size: 0.75rem !important;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

section {
  scroll-margin-top: 70px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-gradient);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-main);
}

/* Typography improvements */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  letter-spacing: -0.3px;
}

/* Loading animation */
.v-progress-circular {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Image styling */
.v-img {
  border-radius: 8px;
}

.rounded-lg {
  border-radius: 12px;
}

/* Chip styling */
.v-chip {
  transition: transform 0.3s ease;
}

.v-chip:hover {
  transform: scale(1.05);
}

/* Footer links hover */
.v-btn:hover {
  transform: translateY(-2px);
}

/* Button improvements */
.v-btn {
  text-transform: none !important;
  letter-spacing: 0.3px;
}

/* Mobile optimization for touch devices */
@media (hover: none) and (pointer: coarse) {
  .image-container:hover {
    transform: none;
  }

  .navigation-card:hover {
    transform: none;
  }

  .download-btn:hover {
    transform: none;
  }

  .v-btn:hover {
    transform: none;
  }

  /* Better touch targets for mobile */
  .v-btn {
    min-height: 44px;
    min-width: 44px;
  }

  .nav-btn {
    width: 50px !important;
    height: 50px !important;
  }

  .download-btn,
  .download-action-btn {
    padding: 16px 24px !important;
  }
  
  /* Increase touch target for chips */
  .responsive-chip {
    min-height: 32px;
    padding: 0 12px;
  }
  
  /* Better touch targets for feature items */
  .responsive-feature-item {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
    min-height: 56px;
  }
}

/* Print styles for better readability */
@media print {
  .hero-section {
    min-height: auto;
  }
  
  .download-btn,
  .responsive-guide-btns,
  .image-viewer-toolbar,
  .v-footer {
    display: none !important;
  }
  
  .responsive-h1,
  .responsive-section-title,
  .responsive-guide-title {
    color: #000 !important;
    background: none !important;
    -webkit-text-fill-color: #000 !important;
  }
  
  .responsive-feature-text,
  .responsive-instruction,
  .responsive-nav-description {
    font-size: 12pt !important;
    line-height: 1.6 !important;
  }
}
</style>