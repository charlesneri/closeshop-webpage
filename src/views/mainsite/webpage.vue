<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const drawer = ref(false)
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
const apkFilename = 'CloseShop.apk'
const apkUrl = ref('/NavigatePage/CloseShop.apk')
const isMobileDevice = ref(false)

// Account creation guide images
const accountCreationImages = ref([
  {
    id: 1,
    src: '/CreateAccGuide/step01.png',
    alt: 'Step 1 - Register page with form fields',
    title: 'Step 1: Go to Register Page',
    description:
      'Open the Closeshop app and navigate to the Register page. Fill in all the required details including your name, email, and password.',
  },
  {
    id: 2,
    src: '/CreateAccGuide/step002.png',
    alt: 'Step 2 - Email verification',
    title: 'Step 2: Verify Your Email',
    description:
      'Check your email inbox for a verification link from Closeshop. Click the link to verify your email address and activate your account.',
  },
  {
    id: 3,
    src: '/CreateAccGuide/step3.jpg',
    alt: 'Step 3 - Login page',
    title: 'Step 3: Login to Your Account',
    description:
      'Return to the Closeshop app and go to the Login page. Enter your verified email and password to access your new account.',
  },
])

// Shop creation guide images
const shopGuideImages = ref([
  {
    id: 1,
    src: '/CreateShopGuide/step1.jpg',
    alt: 'Step 1 - Profile Page with Create Shop button',
    title: 'Step 1: Access Create Shop',
    description:
      'Go to your profile page and click the "Create Shop" button. Note: If you already have a shop, this button will be replaced with "View Shop".',
  },
  {
    id: 2,
    src: '/CreateShopGuide/step2.jpg',
    alt: 'Step 2 - Shop Details Form',
    title: 'Step 2: Fill Shop Details',
    description:
      'Fill in all the details of your shop and click the "Save Shop" button. Note: For testing purposes, you can use sample images for the Valid ID upload.',
  },
  {
    id: 3,
    src: '/CreateShopGuide/step3.jpg',
    alt: 'Step 3 - Shop Status Page',
    title: 'Step 3: Wait for Approval',
    description:
      'Wait for the status of your shop creation. An admin will review your details and either approve or reject your shop application.',
  },
])

// Navigation guide images
const navigationImages = ref([
  {
    id: 'home',
    src: '/NavigatePage/homepage.jpg',
    alt: 'Home Page showing shops and products',
    title: 'Home Page',
    description:
      'Displays shops based on your current location (city-based) and all available products.',
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
    description:
      'Displays shops on the map with markers. Click markers to view routes between your location and shops, and directly access shop items.',
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
    description:
      'Your personal profile page. If you have created a shop, this page will include a button to access your shop dashboard.',
  },
])

const navItems = [
  { title: 'HOME', value: 'home', icon: 'mdi-home' },
  { title: 'ABOUT', value: 'about', icon: 'mdi-information' },
  { title: 'GUIDE', value: 'guide', icon: 'mdi-book-open' },
  { title: 'DOWNLOAD', value: 'download-section', icon: 'mdi-download' },
  { title: 'RIDER PORTAL', value: 'rider-application', icon: 'mdi-motorbike' },
  { title: 'CONTACT US', value: 'help', icon: 'mdi-headset' },
]


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
      if (accountCreationImages.value.find((img) => img.src === imageViewer.value.src)) {
        navigateImages('next', accountCreationImages.value)
      } else if (shopGuideImages.value.find((img) => img.src === imageViewer.value.src)) {
        navigateImages('next', shopGuideImages.value)
      } else {
        navigateImages('next', navigationImages.value)
      }
    } else if (event.key === 'ArrowLeft') {
      // Determine which array to navigate
      if (accountCreationImages.value.find((img) => img.src === imageViewer.value.src)) {
        navigateImages('prev', accountCreationImages.value)
      } else if (shopGuideImages.value.find((img) => img.src === imageViewer.value.src)) {
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
    link.download = apkFilename

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

// Add scroll effect to navbar
const handleScroll = () => {
  const navbar = document.querySelector('.modern-navbar')
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled')
    } else {
      navbar.classList.remove('navbar-scrolled')
    }
  }
}

// Update active nav item based on scroll position (optional)
const updateActiveNav = () => {
  const sections = ['home', 'about', 'guide', 'download-section', 'rider-application', 'help']
  const scrollPosition = window.scrollY + 100

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const offsetTop = element.offsetTop
      const offsetBottom = offsetTop + element.offsetHeight

      if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
        document.querySelectorAll('.desktop-nav-btn').forEach(btn => {
          btn.classList.remove('active')
          if (btn.getAttribute('data-section') === section) {
            btn.classList.add('active')
          }
        })
        break
      }
    }
  }
}

// Start live chat (you can integrate with a live chat service)
const startLiveChat = () => {
  // Example: Open a chat widget or show a message
  alert('Live chat feature coming soon! For now, please call or email us.')

  // You can integrate with services like:
  // - Crisp.chat
  // - Intercom
  // - Tawk.to
  // - Facebook Messenger
}

const applyRider = () => {
  // Navigate to rider portal route
  router.push('/rider-portal')
}

onMounted(() => {
  console.log('Closeshop App mounted successfully')
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', updateActiveNav)

  // Detect mobile device
  isMobileDevice.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )

  // Set data-section attributes on nav buttons
  const navButtons = document.querySelectorAll('.desktop-nav-btn')
  const sections = ['home', 'about', 'guide', 'download-section', 'rider-application', 'help']
  navButtons.forEach((btn, index) => {
    if (sections[index]) {
      btn.setAttribute('data-section', sections[index])
    }
  })
})
</script>

<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar :style="{ background: colorPalette.primary.gradient }" prominent elevated class="modern-navbar">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white" class="d-md-none nav-icon"></v-app-bar-nav-icon>
      <v-img
        :src="logoUrl"
        alt="Closeshop Logo"
        max-height="40"
        max-width="40"
        class="ml-2 mr-2 mr-sm-4 nav-logo"
        contain
      ></v-img>
      <v-toolbar-title class="font-weight-bold text-white responsive-toolbar-title app-title"
        >CloseShop</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <!-- Desktop Navigation - Compact -->
      <div class="desktop-nav">
        <v-btn
          v-for="item in navItems"
          :key="item.value"
          @click="scrollToSection(item.value)"
          variant="text"
          color="white"
          class="desktop-nav-btn"
          rounded
        >
          <span class="nav-text">{{ item.title }}</span>
          <span class="nav-indicator"></span>
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
      <!-- Hero Section-->
      <section id="home" class="hero-section">
        <div class="hero-background">
          <div class="hero-blob-1"></div>
          <div class="hero-blob-2"></div>
          <div class="hero-blob-3"></div>
          <div class="hero-grid"></div>
        </div>

        <v-container fluid class="fill-height pa-0">
          <v-row align="center" justify="center" class="fill-height">
            <v-col cols="12" md="10" lg="8" class="text-center">
              <div class="hero-content">
                <!-- Animated Badge -->
                <div class="hero-badge">
                  <span class="badge-pulse"></span>
                  <span class="badge-text">✨ Available on Android</span>
                </div>

                <!-- Logo with Animation -->
                <div class="logo-wrapper">
                  <v-img
                    :src="logoUrl"
                    alt="Closeshop Logo"
                    class="hero-logo"
                    contain
                  ></v-img>
                </div>

                <!-- Main Title -->
                <h1 class="hero-title">
                  <span class="title-gradient">Close</span>
                  <span class="title-gradient-light">Shop</span>
                </h1>

                <!-- Subtitle -->
                <p class="hero-subtitle">
                  Connecting businesses with customers seamlessly
                </p>

                <!-- Feature Highlights -->
                <div class="feature-highlights">
                  <div class="highlight-item">
                    <div class="highlight-icon">
                      <v-icon size="20">mdi-store</v-icon>
                    </div>
                    <span>Local Shops</span>
                  </div>
                  <div class="highlight-divider"></div>
                  <div class="highlight-item">
                    <div class="highlight-icon">
                      <v-icon size="20">mdi-map-marker-radius</v-icon>
                    </div>
                    <span>Location Based</span>
                  </div>
                  <div class="highlight-divider"></div>
                  <div class="highlight-item">
                    <div class="highlight-icon">
                      <v-icon size="20">mdi-currency-php</v-icon>
                    </div>
                    <span>Best Deals</span>
                  </div>
                </div>

                <!-- CTA Buttons -->
                <div class="cta-group">
                  <v-btn
                    class="download-btn-primary"
                    @click="downloadAPK"
                    :loading="isLoading"
                    :disabled="isLoading"
                    rounded="xl"
                    size="large"
                  >
                    <template v-slot:loader>
                      <v-progress-circular indeterminate color="#3f83c7" size="24"></v-progress-circular>
                    </template>
                    <v-icon left>mdi-download</v-icon>
                    <span>
                      {{ isLoading ? 'Downloading...' : 'Download App' }}
                    </span>
                    <v-icon right size="18">mdi-arrow-right</v-icon>
                  </v-btn>

                  <v-btn
                    class="learn-more-btn"
                    @click="scrollToSection('about')"
                    rounded="xl"
                    size="large"
                    variant="text"
                  >
                    <span>Learn More</span>
                    <v-icon right size="18">mdi-chevron-down</v-icon>
                  </v-btn>
                </div>

                <!-- Trust Indicators -->
                <div class="trust-indicators">
                  <div class="trust-item">
                    <div class="trust-number">10K+</div>
                    <div class="trust-label">Active Users</div>
                  </div>
                  <div class="trust-divider"></div>
                  <div class="trust-item">
                    <div class="trust-number">4.8</div>
                    <div class="trust-label">
                      <v-icon size="14" color="#FFB800">mdi-star</v-icon>
                      <v-icon size="14" color="#FFB800">mdi-star</v-icon>
                      <v-icon size="14" color="#FFB800">mdi-star</v-icon>
                      <v-icon size="14" color="#FFB800">mdi-star</v-icon>
                      <v-icon size="14" color="#FFB800">mdi-star-half</v-icon>
                    </div>
                  </div>
                  <div class="trust-divider"></div>
                  <div class="trust-item">
                    <div class="trust-number">500+</div>
                    <div class="trust-label">Local Shops</div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- About Section -->
      <section id="about" class="about-section">
        <div class="about-bg-effects">
          <div class="about-blob-1"></div>
          <div class="about-blob-2"></div>
        </div>

        <v-container>
          <v-row>
            <v-col cols="12" class="text-center mb-12">
              <h2 class="about-title">About Closeshop</h2>
              <p class="about-subtitle">
                A Capstone Development Project of Bachelor of Science in Information Systems
                students in Caraga State University
              </p>
              <div class="title-decoration">
                <div class="decoration-line"></div>
                <div class="decoration-dot"></div>
                <div class="decoration-line"></div>
              </div>
            </v-col>

            <!-- Features Card -->
            <v-col cols="12" md="7">
              <v-card class="feature-card" elevation="0">
                <div class="card-header-modern">
                  <div class="header-icon">
                    <v-icon size="32" color="#3f83c7">mdi-star-circle</v-icon>
                  </div>
                  <h3 class="card-title-modern">Key Features</h3>
                </div>

                <div class="features-grid">
                  <div class="feature-item-modern">
                    <div class="feature-icon-modern">
                      <v-icon size="22" color="#3f83c7">mdi-school</v-icon>
                    </div>
                    <span>Developed by Caraga State University students</span>
                  </div>

                  <div class="feature-item-modern">
                    <div class="feature-icon-modern">
                      <v-icon size="22" color="#3f83c7">mdi-chart-line</v-icon>
                    </div>
                    <span>Helps business owners grow online visibility</span>
                  </div>

                  <div class="feature-item-modern">
                    <div class="feature-icon-modern">
                      <v-icon size="22" color="#3f83c7">mdi-cart</v-icon>
                    </div>
                    <span>Improves shopping experience for consumers</span>
                  </div>

                  <div class="feature-item-modern">
                    <div class="feature-icon-modern">
                      <v-icon size="22" color="#3f83c7">mdi-account-group</v-icon>
                    </div>
                    <span>Easy-to-use interface for all users</span>
                  </div>

                  <div class="feature-item-modern">
                    <div class="feature-icon-modern">
                      <v-icon size="22" color="#3f83c7">mdi-map-marker</v-icon>
                    </div>
                    <span>Display shop on the map for better visibility and connectivity</span>
                  </div>

                  <div class="feature-item-modern">
                    <div class="feature-icon-modern">
                      <v-icon size="22" color="#3f83c7">mdi-handshake</v-icon>
                    </div>
                    <span>Location-based Platform to connect local businesses and customers</span>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- App Info Card -->
            <v-col cols="12" md="5">
              <v-card class="info-card-modern" elevation="0">
                <div class="card-header-modern">
                  <div class="header-icon">
                    <v-icon size="32" color="#3f83c7">mdi-information</v-icon>
                  </div>
                  <h3 class="card-title-modern">App Details</h3>
                </div>

                <div class="info-items">
                  <div class="info-row-modern">
                    <div class="info-label">
                      <v-icon size="18" color="#3f83c7">mdi-account</v-icon>
                      <span>Developer</span>
                    </div>
                    <div class="info-value">Charles Q. Neri, Queen Zayvy P. Israel, Nel O. Ochate</div>
                  </div>

                  <div class="info-row-modern">
                    <div class="info-label">
                      <v-icon size="18" color="#3f83c7">mdi-database</v-icon>
                      <span>Size</span>
                    </div>
                    <div class="info-value">12.7 MB</div>
                  </div>

                  <div class="info-row-modern">
                    <div class="info-label">
                      <v-icon size="18" color="#3f83c7">mdi-android</v-icon>
                      <span>Requires</span>
                    </div>
                    <div class="info-value">Android 8.0 or higher</div>
                  </div>

                  <div class="info-row-modern">
                    <div class="info-label">
                      <v-icon size="18" color="#3f83c7">mdi-calendar</v-icon>
                      <span>Last Updated</span>
                    </div>
                    <div class="info-value">December 2025</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Guide Section -->
      <section id="guide" class="guide-section">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center mb-12">
              <h2 class="guide-title">User Guide</h2>
              <p class="guide-subtitle">
                Learn how to make the most of Closeshop with our step-by-step guides
              </p>
            </v-col>
          </v-row>

          <!-- Three Guide Cards -->
          <v-row>
            <!-- Account Creation Guide -->
            <v-col cols="12" md="4">
              <v-card class="guide-card-modern" elevation="0">
                <div class="card-header">
                  <div class="card-icon">
                    <v-icon size="40" color="#3f83c7">mdi-account-plus</v-icon>
                  </div>
                  <h3 class="card-title">Create Account</h3>
                </div>

                <div class="steps-preview">
                  <div class="step-indicator">
                    <div class="step-dot" :class="{ active: accountCreationStep >= 1 }">1</div>
                    <div class="step-line" :class="{ active: accountCreationStep >= 2 }"></div>
                    <div class="step-dot" :class="{ active: accountCreationStep >= 2 }">2</div>
                    <div class="step-line" :class="{ active: accountCreationStep >= 3 }"></div>
                    <div class="step-dot" :class="{ active: accountCreationStep >= 3 }">3</div>
                  </div>

                  <div class="step-image" @click="openImageViewer(accountCreationImages[accountCreationStep - 1])">
                    <v-img
                      :src="accountCreationImages[accountCreationStep - 1].src"
                      :alt="accountCreationImages[accountCreationStep - 1].alt"
                      class="rounded-lg preview-image"
                      height="180"
                      cover
                    >
                      <template v-slot:placeholder>
                        <div class="image-placeholder">
                          <v-icon size="40" color="grey">mdi-image</v-icon>
                        </div>
                      </template>
                    </v-img>
                    <div class="image-zoom-icon">
                      <v-icon size="20" color="white">mdi-magnify-plus</v-icon>
                    </div>
                  </div>

                  <p class="step-description">{{ accountCreationImages[accountCreationStep - 1].description }}</p>
                </div>

                <div class="card-actions">
                  <v-btn
                    class="nav-btn-prev"
                    :disabled="accountCreationStep === 1"
                    @click="prevAccountStep"
                    variant="text"
                    size="small"
                  >
                    <v-icon left>mdi-chevron-left</v-icon>
                    Previous
                  </v-btn>
                  <v-btn
                    class="nav-btn-next"
                    :disabled="accountCreationStep === 3"
                    @click="nextAccountStep"
                    variant="text"
                    size="small"
                    color="primary"
                  >
                    Next
                    <v-icon right>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>

                <div class="card-footer">
                  <v-btn
                    class="restart-btn"
                    @click="restartAccountGuide"
                    variant="text"
                    size="small"
                    block
                  >
                    <v-icon left size="16">mdi-restart</v-icon>
                    Restart Guide
                  </v-btn>
                </div>
              </v-card>
            </v-col>

            <!-- Shop Creation Guide -->
            <v-col cols="12" md="4">
              <v-card class="guide-card-modern" elevation="0">
                <div class="card-header">
                  <div class="card-icon">
                    <v-icon size="40" color="#3f83c7">mdi-store-plus</v-icon>
                  </div>
                  <h3 class="card-title">Create Shop</h3>
                </div>

                <div class="steps-preview">
                  <div class="step-indicator">
                    <div class="step-dot" :class="{ active: shopCreationStep >= 1 }">1</div>
                    <div class="step-line" :class="{ active: shopCreationStep >= 2 }"></div>
                    <div class="step-dot" :class="{ active: shopCreationStep >= 2 }">2</div>
                    <div class="step-line" :class="{ active: shopCreationStep >= 3 }"></div>
                    <div class="step-dot" :class="{ active: shopCreationStep >= 3 }">3</div>
                  </div>

                  <div class="step-image" @click="openImageViewer(shopGuideImages[shopCreationStep - 1])">
                    <v-img
                      :src="shopGuideImages[shopCreationStep - 1].src"
                      :alt="shopGuideImages[shopCreationStep - 1].alt"
                      class="rounded-lg preview-image"
                      height="180"
                      cover
                    >
                      <template v-slot:placeholder>
                        <div class="image-placeholder">
                          <v-icon size="40" color="grey">mdi-image</v-icon>
                        </div>
                      </template>
                    </v-img>
                    <div class="image-zoom-icon">
                      <v-icon size="20" color="white">mdi-magnify-plus</v-icon>
                    </div>
                  </div>

                  <p class="step-description">{{ shopGuideImages[shopCreationStep - 1].description }}</p>
                </div>

                <div class="card-actions">
                  <v-btn
                    class="nav-btn-prev"
                    :disabled="shopCreationStep === 1"
                    @click="prevShopStep"
                    variant="text"
                    size="small"
                  >
                    <v-icon left>mdi-chevron-left</v-icon>
                    Previous
                  </v-btn>
                  <v-btn
                    class="nav-btn-next"
                    :disabled="shopCreationStep === 3"
                    @click="nextShopStep"
                    variant="text"
                    size="small"
                    color="primary"
                  >
                    Next
                    <v-icon right>mdi-chevron-right</v-icon>
                  </v-btn>
                </div>

                <div class="card-footer">
                  <v-btn
                    class="restart-btn"
                    @click="restartShopGuide"
                    variant="text"
                    size="small"
                    block
                  >
                    <v-icon left size="16">mdi-restart</v-icon>
                    Restart Guide
                  </v-btn>
                </div>
              </v-card>
            </v-col>

            <!-- Navigation Guide -->
            <v-col cols="12" md="4">
              <v-card class="guide-card-modern navigation-guide-card" elevation="0">
                <div class="card-header">
                  <div class="card-icon">
                    <v-icon size="40" color="#3f83c7">mdi-navigation</v-icon>
                  </div>
                  <h3 class="card-title">App Navigation</h3>
                </div>

                <div class="navigation-grid">
                  <div
                    v-for="image in navigationImages.slice(0, 4)"
                    :key="image.id"
                    class="nav-thumbnail"
                    @click="openImageViewer(image)"
                  >
                    <v-img
                      :src="image.src"
                      :alt="image.alt"
                      class="thumbnail-image"
                      height="60"
                      cover
                    >
                      <template v-slot:placeholder>
                        <div class="thumbnail-placeholder">
                          <v-icon size="20" color="grey">mdi-image</v-icon>
                        </div>
                      </template>
                    </v-img>
                    <span class="thumbnail-label">{{ image.title }}</span>
                  </div>
                </div>

                <div class="view-all-btn">
                  <v-btn
                    class="view-all-link"
                    variant="text"
                    color="primary"
                    block
                    @click="openImageViewer(navigationImages[0])"
                  >
                    View All Sections
                    <v-icon right size="16">mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Download Section -->
      <section id="download-section" class="download-section">
        <div class="download-bg-effects">
          <div class="download-particle-1"></div>
          <div class="download-particle-2"></div>
          <div class="download-particle-3"></div>
        </div>

        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12" md="10" lg="8" class="text-center">
              <v-card class="download-card" elevation="0">
                <div class="android-icon-wrapper">
                  <div class="android-pulse"></div>
                  <v-icon size="80" color="white" class="android-icon">mdi-android</v-icon>
                </div>

                <h2 class="download-title">Ready to Get Started?</h2>

                <p class="download-subtitle">
                  Join thousands of satisfied users. Download Closeshop today and transform your
                  shopping experience.
                </p>

                <v-btn
                  class="download-btn-modern"
                  size="x-large"
                  @click="downloadAPK"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  <template v-slot:loader>
                    <v-progress-circular indeterminate color="#3f83c7" size="24"></v-progress-circular>
                  </template>
                  <v-icon left>mdi-download</v-icon>
                  <span>
                    {{ isLoading ? 'Downloading...' : isMobileDevice ? 'Download for Android' : 'Download Free APK' }}
                  </span>
                  <v-icon right size="20" class="download-arrow">mdi-arrow-right</v-icon>
                </v-btn>

                <div class="download-info">
                  <p class="version-info">Version 1.0.0 • 25 MB • Android 8.0+</p>
                  <div class="feature-chips">
                    <div class="chip-modern">
                      <v-icon left size="16">mdi-shield-check</v-icon>
                      <span>No Ads</span>
                    </div>
                    <div class="chip-modern">
                      <v-icon left size="16">mdi-update</v-icon>
                      <span>Regular Updates</span>
                    </div>
                    <div class="chip-modern">
                      <v-icon left size="16">mdi-headset</v-icon>
                      <span>Free Support</span>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

            <!-- Rider Application Section -->
            <section id="rider-application" class="rider-section">
              <div class="rider-bg-effects">
                <div class="rider-glow-1"></div>
                <div class="rider-glow-2"></div>
              </div>

              <v-container>
                <v-row align="center" justify="center">
                  <v-col cols="12" md="10" lg="8" class="text-center">
                    <div class="rider-content">
                      <h2 class="rider-title">Become a <span class="title-gradient">Rider Partner</span></h2>
                      <p class="rider-subtitle">
                        Join our network of trusted riders and earn by delivering for local businesses. Sign
                        up today to start your journey with Closeshop!
                      </p>
                      <v-btn
                        class="rider-cta-btn"
                        size="large"
                        @click="applyRider"
                      >
                        <v-icon left>mdi-bike-fast</v-icon>
                        <span>Apply Now</span>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </section>

      <!-- Help Section-->
      <section id="help" class="help-section">
        <div class="help-background">
          <div class="help-blob-1"></div>
          <div class="help-blob-2"></div>
          <div class="help-blob-3"></div>
        </div>

        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12" md="10" lg="8" class="text-center">
              <div class="help-content">
                <!-- Section Badge -->
                <div class="section-badge">
                  <v-icon size="18" color="#3f83c7">mdi-headset</v-icon>
                  <span>Support 24/7</span>
                </div>

                <!-- Title -->
                <h2 class="help-title">
                  Need Assistance?
                </h2>

                <!-- Subtitle -->
                <p class="help-subtitle">
                  Our support team is here to help you with any questions or issues you may have.
                  Feel free to reach out to us through the following contact information,
                  and we'll get back to you as soon as possible.
                </p>

                <!-- Contact Cards Container -->
                <div class="contact-container">
                  <!-- Phone Card -->
                  <div class="contact-card-modern phone-card">
                    <div class="card-glow"></div>
                    <div class="card-icon-wrapper">
                      <v-icon size="32" color="#3f83c7">mdi-phone-in-talk</v-icon>
                    </div>
                    <h3 class="card-title">Call Us</h3>
                    <p class="card-description">Mon-Fri, 9AM - 6PM</p>
                    <div class="contact-info-wrapper">
                      <v-icon size="20" color="#3f83c7">mdi-phone</v-icon>
                      <a href="tel:09700314367" class="contact-link">0970 031 4367</a>
                    </div>
                    <div class="card-action">
                      <v-btn class="call-btn" href="tel:09700314367" small rounded>
                        <v-icon left size="18">mdi-phone</v-icon>
                        <span>Call Now</span>
                      </v-btn>
                    </div>
                  </div>

                  <!-- Email Card -->
                  <div class="contact-card-modern email-card">
                    <div class="card-glow"></div>
                    <div class="card-icon-wrapper">
                      <v-icon size="32" color="#3f83c7">mdi-email-open</v-icon>
                    </div>
                    <h3 class="card-title">Email Us</h3>
                    <p class="card-description">We'll respond within 24h</p>
                    <div class="contact-info-wrapper">
                      <v-icon size="20" color="#3f83c7">mdi-email</v-icon>
                      <a href="mailto:closeshop8600@gmail.com" class="contact-link">closeshop8600@gmail.com</a>
                    </div>
                    <div class="card-action">
                      <v-btn class="email-btn" href="mailto:closeshop8600@gmail.com" small rounded>
                        <v-icon left size="18">mdi-email</v-icon>
                        <span>Send Email</span>
                      </v-btn>
                    </div>
                  </div>

                  <!-- Live Chat Card (Optional) -->
                  <div class="contact-card-modern chat-card">
                    <div class="card-glow"></div>
                    <div class="card-icon-wrapper">
                      <v-icon size="32" color="#3f83c7">mdi-chat-processing</v-icon>
                    </div>
                    <h3 class="card-title">Live Chat</h3>
                    <p class="card-description">Instant support</p>
                    <div class="contact-info-wrapper">
                      <v-icon size="20" color="#3f83c7">mdi-clock-outline</v-icon>
                      <span class="availability">Available 24/7</span>
                    </div>
                    <div class="card-action">
                      <v-btn class="chat-btn" small rounded @click="startLiveChat">
                        <v-icon left size="18">mdi-chat</v-icon>
                        <span>Start Chat</span>
                      </v-btn>
                    </div>
                  </div>
                </div>

                <!-- Additional Support Info -->
                <div class="support-info">
                  <div class="info-item">
                    <v-icon size="20" color="#60a5fa">mdi-clock</v-icon>
                    <span>Response Time: &lt; 24 hours</span>
                  </div>
                  <div class="info-divider"></div>
                  <div class="info-item">
                    <v-icon size="20" color="#60a5fa">mdi-check-circle</v-icon>
                    <span>Free Support for all users</span>
                  </div>
                  <div class="info-divider"></div>
                  <div class="info-item">
                    <v-icon size="20" color="#60a5fa">mdi-message-text</v-icon>
                    <span>Emergency support available</span>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </v-main>

    <!-- Footer -->
    <v-footer class="modern-footer mt-auto">
      <v-container>
        <v-row class="footer-content">
          <v-col cols="12" md="6" class="text-center text-md-left">
            <div class="footer-brand">
              <div class="footer-logo-wrapper">
                <v-img
                  :src="logoUrl"
                  alt="Closeshop Logo"
                  max-height="35"
                  max-width="35"
                  class="footer-logo"
                  contain
                ></v-img>
                <span class="footer-brand-name">Close<span class="brand-accent">Shop</span></span>
              </div>
              <p class="footer-tagline">
                Connecting businesses with customers seamlessly
              </p>
            </div>
            <p class="responsive-footer-text copyright-text">
              © 2025 Closeshop Team, Caraga State University. All rights reserved.
            </p>
          </v-col>

          <v-col cols="12" md="6" class="text-center text-md-right">
            <div class="footer-social">
              <p class="social-label">Follow us</p>
              <div class="social-icons">
                <v-btn
                  v-for="link in footerLinks"
                  :key="link.text"
                  :href="link.href"
                  target="_blank"
                  icon
                  variant="text"
                  size="small"
                  class="social-icon-btn"
                  :title="link.text"
                >
                  <v-icon>{{ link.icon }}</v-icon>
                  <span class="social-tooltip">{{ link.text }}</span>
                </v-btn>
              </div>
            </div>
            <div class="footer-credit">
              <p class="credit-text">Made with <span class="heart">❤️</span> for local businesses</p>
            </div>
          </v-col>
        </v-row>

        <!-- Bottom Bar -->
        <div class="footer-bottom">
          <div class="bottom-links">
            <a href="#" @click.prevent="scrollToSection('home')" class="bottom-link">Home</a>
            <span class="link-divider">•</span>
            <a href="#" @click.prevent="scrollToSection('about')" class="bottom-link">About</a>
            <span class="link-divider">•</span>
            <a href="#" @click.prevent="scrollToSection('guide')" class="bottom-link">Guide</a>
            <span class="link-divider">•</span>
            <a href="#" @click.prevent="scrollToSection('download-section')" class="bottom-link">Download</a>
            <span class="link-divider">•</span>
            <a href="#" @click.prevent="scrollToSection('help')" class="bottom-link">Contact</a>
          </div>
        </div>
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
              :download="apkFilename"
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
          <v-btn
            :color="colorPalette.primary.main"
            @click="downloadDialog = false"
            variant="flat"
            class="responsive-dialog-btn"
          >
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
          <v-toolbar-title class="text-white responsive-image-viewer-title">{{
            imageViewer.title
          }}</v-toolbar-title>
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
            v-if="accountCreationImages.find((img) => img.src === imageViewer.src)"
            class="nav-btn prev-btn responsive-nav-btn"
            color="white"
            size="x-large"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="navigateImages('prev', shopGuideImages)"
            v-else-if="shopGuideImages.find((img) => img.src === imageViewer.src)"
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
            v-if="accountCreationImages.find((img) => img.src === imageViewer.src)"
            class="nav-btn next-btn responsive-nav-btn"
            color="white"
            size="x-large"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="navigateImages('next', shopGuideImages)"
            v-else-if="shopGuideImages.find((img) => img.src === imageViewer.src)"
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
.contact-card {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 16px;
  background: #f8fafc;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-text {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  letter-spacing: 0.3px;
}

@media (max-width: 600px) {
  .contact-text {
    font-size: 14px;
  }
}

/* ============ MODERN ABOUT SECTION STYLES ============ */

.about-section {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
  overflow: hidden;
}

/* Animated Background Effects */
.about-bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.about-blob-1 {
  position: absolute;
  top: -20%;
  right: -5%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, rgba(63, 131, 199, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: blobFloat 18s ease-in-out infinite;
}

.about-blob-2 {
  position: absolute;
  bottom: -20%;
  left: -5%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  animation: blobFloat 22s ease-in-out infinite reverse;
}

@keyframes blobFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(40px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 20px) scale(0.9);
  }
}

/* Section Header */
.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 18px;
  border-radius: 100px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(63, 131, 199, 0.15);
}

.section-badge span {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.about-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.title-gradient {
  background: linear-gradient(135deg, #3f83c7 0%, #2563eb 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.about-subtitle {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  color: #64748b;
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
  line-height: 1.6;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.decoration-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3f83c7, transparent);
}

.decoration-dot {
  width: 6px;
  height: 6px;
  background: #3f83c7;
  border-radius: 50%;
}

/* Feature Card */
.feature-card {
  background: white;
  border-radius: 28px !important;
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(63, 131, 199, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02) !important;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(63, 131, 199, 0.08) !important;
  border-color: rgba(63, 131, 199, 0.15);
}

/* Info Card */
.info-card-modern {
  background: white;
  border-radius: 28px !important;
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(63, 131, 199, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02) !important;
}

.info-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(63, 131, 199, 0.08) !important;
  border-color: rgba(63, 131, 199, 0.15);
}

/* Card Header */
.card-header-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.75rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(63, 131, 199, 0.1);
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(63, 131, 199, 0.1), rgba(96, 165, 250, 0.1));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title-modern {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Features Grid */
.features-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item-modern {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 0.75rem;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-item-modern:hover {
  background: rgba(63, 131, 199, 0.04);
  transform: translateX(4px);
}

.feature-icon-modern {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: rgba(63, 131, 199, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.feature-item-modern:hover .feature-icon-modern {
  background: rgba(63, 131, 199, 0.15);
  transform: scale(1.05);
}

.feature-item-modern span {
  font-size: 0.9375rem;
  color: #334155;
  line-height: 1.5;
  flex: 1;
}

/* Info Items */
.info-items {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-row-modern {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.info-row-modern:hover {
  background: rgba(63, 131, 199, 0.04);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #3f83c7;
}

.info-value {
  font-size: 0.9375rem;
  color: #334155;
  line-height: 1.5;
  padding-left: 26px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .about-section {
    padding: 3rem 0;
  }

  .feature-card,
  .info-card-modern {
    padding: 1.5rem;
  }

  .card-title-modern {
    font-size: 1.25rem;
  }

  .feature-item-modern span {
    font-size: 0.875rem;
  }

  .info-value {
    font-size: 0.875rem;
  }
}

@media (max-width: 600px) {
  .feature-card,
  .info-card-modern {
    padding: 1.25rem;
  }

  .card-header-modern {
    margin-bottom: 1.25rem;
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .header-icon .v-icon {
    font-size: 24px !important;
  }

  .card-title-modern {
    font-size: 1.125rem;
  }

  .feature-icon-modern {
    width: 32px;
    height: 32px;
  }

  .feature-icon-modern .v-icon {
    font-size: 18px !important;
  }

  .feature-item-modern span {
    font-size: 0.8125rem;
  }

  .info-label {
    font-size: 0.7rem;
  }

  .info-value {
    font-size: 0.8125rem;
    padding-left: 20px;
  }

  .decoration-line {
    width: 30px;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card,
.info-card-modern {
  animation: fadeInUp 0.5s ease-out;
}

.feature-card {
  animation-delay: 0.1s;
}

.info-card-modern {
  animation-delay: 0.2s;
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

/* ============ MODERN GUIDE SECTION ============ */

.guide-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Section Header */
.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-badge span {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.guide-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #0f172a;
}

.title-gradient {
  background: linear-gradient(135deg, #3f83c7 0%, #2563eb 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.guide-subtitle {
  font-size: 1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

/* Modern Guide Cards */
.guide-card-modern {
  background: white;
  border-radius: 24px !important;
  padding: 1.5rem;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(63, 131, 199, 0.1);
}

.guide-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(63, 131, 199, 0.1) !important;
  border-color: rgba(63, 131, 199, 0.2);
}

/* Card Header */
.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(63, 131, 199, 0.1), rgba(96, 165, 250, 0.1));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Step Indicator */
.steps-preview {
  margin-bottom: 1.5rem;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.step-dot {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  transition: all 0.3s ease;
}

.step-dot.active {
  background: linear-gradient(135deg, #3f83c7, #2563eb);
  color: white;
  box-shadow: 0 4px 12px rgba(63, 131, 199, 0.3);
}

.step-line {
  width: 40px;
  height: 2px;
  background: #e2e8f0;
  margin: 0 8px;
  transition: all 0.3s ease;
}

.step-line.active {
  background: linear-gradient(90deg, #3f83c7, #2563eb);
}

/* Step Image */
.step-image {
  position: relative;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.preview-image {
  transition: transform 0.3s ease;
}

.step-image:hover .preview-image {
  transform: scale(1.05);
}

.image-zoom-icon {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 6px;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.step-image:hover .image-zoom-icon {
  opacity: 1;
}

.step-description {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

/* Card Actions */
.card-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.nav-btn-prev,
.nav-btn-next {
  flex: 1;
  text-transform: none !important;
  font-weight: 500 !important;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.restart-btn {
  text-transform: none !important;
  color: #64748b !important;
  font-size: 0.75rem !important;
}

.restart-btn:hover {
  color: #3f83c7 !important;
  background: rgba(63, 131, 199, 0.05) !important;
}

/* Navigation Guide Card */
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.nav-thumbnail {
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 12px;
}

.nav-thumbnail:hover {
  background: rgba(63, 131, 199, 0.05);
  transform: translateY(-2px);
}

.thumbnail-image {
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.thumbnail-placeholder {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 12px;
}

.thumbnail-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: #475569;
}

.view-all-btn {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.view-all-link {
  text-transform: none !important;
  font-weight: 600 !important;
}

/* Responsive */
@media (max-width: 960px) {
  .guide-section {
    padding: 3rem 0;
  }

  .guide-card-modern {
    margin-bottom: 1.5rem;
  }

  .step-line {
    width: 30px;
  }
}

@media (max-width: 600px) {
  .step-line {
    width: 20px;
  }

  .step-dot {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .navigation-grid {
    gap: 0.75rem;
  }
}

/* ============ DOWNLOAD SECTION STYLES ============ */

.download-section {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%);
  overflow: hidden;
}

/* Animated Background Effects */
.download-bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.download-particle-1 {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(63, 131, 199, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat 18s ease-in-out infinite;
}

.download-particle-2 {
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat 22s ease-in-out infinite reverse;
}

.download-particle-3 {
  position: absolute;
  top: 40%;
  left: 30%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat 15s ease-in-out infinite 1s;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(40px, -40px) scale(1.2);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.8);
  }
}

/* Download Card */
.download-card {
  background: linear-gradient(135deg, #437db7 0%, #153783 50%, #3c55aa 100%) !important;
  border-radius: 40px !important;
  padding: 3rem 2rem !important;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(63, 131, 199, 0.3) !important;
  transition: all 0.3s ease;
}

.download-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: cardShine 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes cardShine {
  0%, 100% {
    transform: translate(-30%, -30%) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: translate(30%, 30%) rotate(180deg);
    opacity: 0.5;
  }
}

.download-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 50px rgba(63, 131, 199, 0.4) !important;
}

/* Android Icon */
.android-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.android-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
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

.android-icon {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Title */
.download-title {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.6s ease-out;
}

/* Subtitle */
.download-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: rgba(255, 255, 255, 0.9);
  max-width: 500px;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

/* Download Button */
.download-btn-modern {
  background: white !important;
  color: #3f83c7 !important;
  padding: 12px 32px !important;
  font-size: 1.125rem !important;
  font-weight: 700 !important;
  text-transform: none !important;
  border-radius: 60px !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;
  animation: fadeInUp 0.6s ease-out 0.2s both;
  position: relative;
  overflow: hidden;
}

.download-btn-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(63, 131, 199, 0.1), transparent);
  transition: left 0.5s ease;
}

.download-btn-modern:hover::before {
  left: 100%;
}

.download-btn-modern:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2) !important;
}

.download-btn-modern:active {
  transform: translateY(0);
}

.download-arrow {
  transition: transform 0.3s ease;
}

.download-btn-modern:hover .download-arrow {
  transform: translateX(5px);
}

/* Download Info */
.download-info {
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.version-info {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  letter-spacing: 0.3px;
}

.feature-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.chip-modern {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.chip-modern:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.chip-modern .v-icon {
  font-size: 16px;
}

/* Animations */
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

/* Responsive Design */
@media (max-width: 768px) {
  .download-section {
    padding: 3rem 0;
  }

  .download-card {
    padding: 2rem 1.5rem !important;
    margin: 0 1rem;
    border-radius: 30px !important;
  }

  .download-title {
    font-size: 1.5rem;
  }

  .download-subtitle {
    font-size: 0.875rem;
    padding: 0 0.5rem;
  }

  .download-btn-modern {
    padding: 10px 24px !important;
    font-size: 1rem !important;
    width: 100%;
    max-width: 280px;
  }

  .feature-chips {
    gap: 0.5rem;
  }

  .chip-modern {
    padding: 4px 12px;
    font-size: 0.7rem;
  }

  .chip-modern span {
    display: none;
  }

  .chip-modern .v-icon {
    margin: 0;
  }
}

@media (max-width: 480px) {
  .download-card {
    padding: 1.5rem 1rem !important;
  }

  .download-title {
    font-size: 1.25rem;
  }

  .version-info {
    font-size: 0.75rem;
  }

  .android-icon {
    font-size: 60px !important;
  }

  .android-pulse {
    width: 80px;
    height: 80px;
  }

  @keyframes pulseRing {
    0% {
      width: 50px;
      height: 50px;
      opacity: 0.8;
    }
    100% {
      width: 100px;
      height: 100px;
      opacity: 0;
    }
  }
}

/* Loading State */
.download-btn-modern:disabled {
  opacity: 0.7;
  transform: none;
}

/* ============ RIDER SECTION STYLES ============ */

.rider-section {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  overflow: hidden;
}

/* Animated Background Effects */
.rider-bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.rider-glow-1 {
  position: absolute;
  top: -30%;
  right: -20%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(63, 131, 199, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: riderFloat 20s ease-in-out infinite;
}

.rider-glow-2 {
  position: absolute;
  bottom: -30%;
  left: -20%;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: riderFloat 15s ease-in-out infinite reverse;
}

@keyframes riderFloat {
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

/* Rider Content */
.rider-content {
  position: relative;
  z-index: 2;
}

/* Title */
.rider-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: white;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.6s ease-out;
}

.title-gradient {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
}

.title-gradient::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #60a5fa, #3b82f6, transparent);
  border-radius: 3px;
  animation: titleLineGlow 2s ease-in-out infinite;
}

@keyframes titleLineGlow {
  0%, 100% {
    width: 40%;
    opacity: 0.5;
  }
  50% {
    width: 80%;
    opacity: 1;
  }
}

/* Subtitle */
.rider-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto 2.5rem auto;
  line-height: 1.6;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

/* CTA Button */
.rider-cta-btn {
  background: linear-gradient(135deg, #3f83c7 0%, #2563eb 100%) !important;
  color: white !important;
  padding: 12px 40px !important;
  font-size: 1.125rem !important;
  font-weight: 700 !important;
  text-transform: none !important;
  border-radius: 50px !important;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3) !important;
  transition: all 0.3s ease !important;
  animation: fadeInUp 0.6s ease-out 0.2s both;
  position: relative;
  overflow: hidden;
}

.rider-cta-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.rider-cta-btn:hover::before {
  width: 300px;
  height: 300px;
}

.rider-cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.4) !important;
}

.rider-cta-btn:active {
  transform: translateY(0);
}

.rider-cta-btn .v-icon {
  transition: transform 0.3s ease;
}

.rider-cta-btn:hover .v-icon {
  transform: translateX(3px);
}

/* Animations */
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

/* Responsive Design */
@media (max-width: 768px) {
  .rider-section {
    padding: 3rem 0;
  }

  .rider-title {
    margin-bottom: 1rem;
  }

  .rider-subtitle {
    margin-bottom: 2rem;
    padding: 0 1rem;
  }

  .rider-cta-btn {
    padding: 10px 32px !important;
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .rider-title {
    font-size: 1.75rem;
  }

  .rider-subtitle {
    font-size: 0.875rem;
  }

  .rider-cta-btn {
    padding: 8px 28px !important;
    font-size: 0.9375rem !important;
    width: 90%;
  }
}

/* Hover effect for the whole section */
.rider-section:hover .rider-glow-1 {
  animation-duration: 15s;
}

.rider-section:hover .rider-glow-2 {
  animation-duration: 10s;
}

/* ============ HELP SECTION STYLES ============ */

.help-section {
  position: relative;
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  overflow: hidden;
}

/* Animated Background */
.help-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.help-blob-1 {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(63, 131, 199, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: floatBlob 20s ease-in-out infinite;
}

.help-blob-2 {
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, rgba(107, 161, 212, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: floatBlob 15s ease-in-out infinite reverse;
}

.help-blob-3 {
  position: absolute;
  top: 40%;
  left: 30%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(63, 131, 199, 0.04) 0%, transparent 70%);
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

/* Help Content */
.help-content {
  position: relative;
  z-index: 2;
}

/* Section Badge */
.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(63, 131, 199, 0.2);
}

.section-badge span {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 0.5px;
}

/* Title */
.help-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.title-gradient {
  background: linear-gradient(135deg, #3f83c7 0%, #2563eb 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Subtitle */
.help-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: #475569;
  max-width: 600px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
}

/* Contact Cards Container */
.contact-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* Modern Contact Card */
.contact-card-modern {
  position: relative;
  flex: 1;
  min-width: 250px;
  max-width: 320px;
  background: white;
  border-radius: 24px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.contact-card-modern:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(63, 131, 199, 0.15);
}

/* Card Glow Effect */
.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3f83c7, #60a5fa, #3f83c7);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.contact-card-modern:hover .card-glow {
  transform: scaleX(1);
}

/* Card Icon */
.card-icon-wrapper {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(63, 131, 199, 0.1), rgba(96, 165, 250, 0.1));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  transition: all 0.3s ease;
}

.contact-card-modern:hover .card-icon-wrapper {
  transform: scale(1.05);
  background: linear-gradient(135deg, rgba(63, 131, 199, 0.2), rgba(96, 165, 250, 0.2));
}

/* Card Title */
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

/* Card Description */
.card-description {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 1rem;
}

/* Contact Info Wrapper */
.contact-info-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.contact-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #3f83c7;
}

.availability {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
}

/* Card Action Buttons */
.card-action {
  margin-top: 0.5rem;
}

.call-btn,
.email-btn,
.chat-btn {
  background: linear-gradient(135deg, #3f83c7 0%, #2563eb 100%) !important;
  color: white !important;
  text-transform: none !important;
  padding: 8px 20px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(63, 131, 199, 0.3);
}

.call-btn:hover,
.email-btn:hover,
.chat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(63, 131, 199, 0.4);
}

/* Specific card hover effects */
.phone-card:hover {
  border: 1px solid rgba(63, 131, 199, 0.3);
}

.email-card:hover {
  border: 1px solid rgba(63, 131, 199, 0.3);
}

.chat-card:hover {
  border: 1px solid rgba(63, 131, 199, 0.3);
}

/* Support Info */
.support-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(63, 131, 199, 0.1);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
}

.info-divider {
  width: 1px;
  height: 30px;
  background: rgba(63, 131, 199, 0.2);
}

/* Responsive Design */
@media (max-width: 960px) {
  .help-section {
    padding: 3rem 0;
  }

  .contact-container {
    gap: 1rem;
  }

  .contact-card-modern {
    min-width: 280px;
    padding: 1.5rem;
  }

  .support-info {
    flex-direction: column;
    gap: 0.75rem;
  }

  .info-divider {
    width: 50px;
    height: 1px;
  }
}

@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
    align-items: center;
  }

  .contact-card-modern {
    width: 100%;
    max-width: 400px;
  }

  .help-subtitle {
    padding: 0 1rem;
  }

  .info-item {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .section-badge {
    margin-bottom: 1rem;
  }

  .help-title {
    font-size: 1.75rem;
  }

  .contact-card-modern {
    padding: 1.25rem;
  }

  .card-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .contact-link {
    font-size: 0.75rem;
  }
}

/* Animations */
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

.help-content {
  animation: fadeInUp 0.6s ease-out;
}

.contact-card-modern {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.contact-card-modern:nth-child(1) {
  animation-delay: 0.1s;
}

.contact-card-modern:nth-child(2) {
  animation-delay: 0.2s;
}

.contact-card-modern:nth-child(3) {
  animation-delay: 0.3s;
}

/* Footer */
/* ============ MODERN FOOTER STYLES ============ */

.modern-footer {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%) !important;
  position: relative;
  overflow: hidden;
  padding: 3rem 0 1.5rem 0 !important;
  margin-top: auto;
}

/* Animated Background Effect */
.modern-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(63, 131, 199, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(107, 161, 212, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.modern-footer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(63, 131, 199, 0.5), rgba(107, 161, 212, 0.5), rgba(63, 131, 199, 0.5), transparent);
}

/* Footer Content */
.footer-content {
  position: relative;
  z-index: 1;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Brand Section */
.footer-brand {
  margin-bottom: 1rem;
}

.footer-logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
}

@media (min-width: 960px) {
  .footer-logo-wrapper {
    justify-content: flex-start;
  }
}

.footer-logo {
  transition: transform 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.footer-logo-wrapper:hover .footer-logo {
  transform: scale(1.05) rotate(5deg);
}

.footer-brand-name {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.brand-accent {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-tagline {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

.copyright-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 1rem;
}

/* Social Section */
.footer-social {
  margin-bottom: 1rem;
}

.social-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  font-weight: 600;
}

.social-icons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

@media (min-width: 960px) {
  .social-icons {
    justify-content: flex-end;
  }
}

.social-icon-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease !important;
  width: 40px !important;
  height: 40px !important;
}

.social-icon-btn:hover {
  transform: translateY(-3px);
  background: rgba(63, 131, 199, 0.3) !important;
  border-color: rgba(63, 131, 199, 0.5);
}

.social-icon-btn .v-icon {
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.social-icon-btn:hover .v-icon {
  transform: scale(1.1);
}

/* Social Tooltip */
.social-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 10;
}

.social-icon-btn:hover .social-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-12px);
}

/* Footer Credit */
.footer-credit {
  margin-top: 1rem;
}

.credit-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.heart {
  display: inline-block;
  animation: heartbeat 1.5s ease infinite;
  color: #ef4444;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Footer Bottom */
.footer-bottom {
  position: relative;
  z-index: 1;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  text-align: center;
}

.bottom-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
}

.bottom-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bottom-link:hover {
  color: #60a5fa;
  transform: translateY(-1px);
}

.link-divider {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.7rem;
}

/* Responsive Design */
@media (max-width: 960px) {
  .modern-footer {
    padding: 2rem 0 1rem 0 !important;
  }

  .footer-content {
    padding-bottom: 1.5rem;
  }

  .footer-brand {
    margin-bottom: 1.5rem;
  }

  .footer-social {
    margin-bottom: 1.5rem;
  }

  .copyright-text {
    text-align: center;
  }

  .credit-text {
    text-align: center;
  }
}

@media (max-width: 600px) {
  .footer-brand-name {
    font-size: 1.25rem;
  }

  .social-icons {
    gap: 0.5rem;
  }

  .social-icon-btn {
    width: 36px !important;
    height: 36px !important;
  }

  .bottom-links {
    gap: 0.3rem;
  }

  .bottom-link {
    font-size: 0.7rem;
  }

  .footer-tagline {
    font-size: 0.75rem;
  }
}

/* Animation for footer on load */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-footer {
  animation: fadeInUp 0.6s ease-out;
}

/* Hover effects for links */
.footer-brand-name,
.bottom-link,
.social-icon-btn {
  cursor: pointer;
}

/* Optional: Add wave decoration at top of footer */
.modern-footer .footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.modern-footer .footer-wave svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 40px;
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

/* ============ MODERN NAVIGATION BAR STYLES ============ */

/* Main Navbar Container */
.modern-navbar {
  background: linear-gradient(135deg, #2f507b 0%, #1b334a 25%, #101c29 50%, #0c1b2b 75%, #1e3a5f 100%) !important;
  background-size: 300% 300% !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease !important;
  animation: gradientShift 8s ease infinite;
}

/* Animated Gradient Shift */
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

/* Alternative: Static Gradient (if you don't want animation) */
.modern-navbar.static-gradient {
  background: linear-gradient(135deg, #1e3a5f 0%, #203a55 50%, rgb(22, 63, 100) 100%) !important;
  background-size: 100% 100% !important;
  animation: none;
}

/* Navbar Scroll Effect */
.modern-navbar.navbar-scrolled {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

/* Logo Styling */
.nav-logo {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.nav-logo:hover {
  transform: scale(1.05) rotate(5deg);
}

/* App Title */
.app-title {
  font-size: clamp(1.25rem, 4vw, 1.5rem) !important;
  font-weight: 800 !important;
  letter-spacing: -0.3px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Desktop Navigation Container */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-right: 0.5rem;
}

/* Desktop Navigation Buttons */
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

/* Hover Background Effect */
.desktop-nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

/* Navigation Text */
.desktop-nav-btn .nav-text {
  position: relative;
  z-index: 1;
  font-size: inherit;
  font-weight: 600;
}

/* Navigation Indicator Line */
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
  width: 60%;
}

/* Active State (add class 'active' to current section button) */
.desktop-nav-btn.active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15) !important;
}

.desktop-nav-btn.active .nav-indicator {
  width: 60%;
}

/* Mobile Navigation Icon */
.nav-icon {
  transition: all 0.3s ease !important;
  border-radius: 8px;
}

.nav-icon:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive Breakpoints */
@media (min-width: 960px) and (max-width: 1200px) {
  .desktop-nav {
    gap: 0.1rem;
    margin-right: 0.25rem;
  }

  .desktop-nav-btn {
    padding: 6px 12px !important;
    font-size: 0.8125rem !important;
  }

  .nav-indicator {
    bottom: 3px;
  }
}

@media (min-width: 1200px) and (max-width: 1400px) {
  .desktop-nav-btn {
    padding: 8px 16px !important;
    font-size: 0.875rem !important;
  }
}

@media (min-width: 1400px) {
  .desktop-nav {
    gap: 0.5rem;
  }

  .desktop-nav-btn {
    padding: 10px 22px !important;
    font-size: 0.9375rem !important;
  }
}

@media (max-width: 959px) {
  .desktop-nav {
    display: none;
  }
}

@media (min-width: 960px) {
  .desktop-nav-btn {
    position: relative;
  }
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}

/* Animated Background */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.hero-blob-1 {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, rgba(63, 131, 199, 0.15) 0%, rgba(63, 131, 199, 0) 70%);
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
}

.hero-blob-2 {
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(107, 161, 212, 0.1) 0%, rgba(107, 161, 212, 0) 70%);
  border-radius: 50%;
  animation: float 15s ease-in-out infinite reverse;
}

.hero-blob-3 {
  position: absolute;
  top: 40%;
  left: 20%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(63, 131, 199, 0.08) 0%, rgba(63, 131, 199, 0) 70%);
  border-radius: 50%;
  animation: float 25s ease-in-out infinite;
}

.hero-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-3deg);
  }
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
}

/* Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideDown 0.6s ease-out;
}

.badge-pulse {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  letter-spacing: 0.3px;
}

/* Logo */
.logo-wrapper {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.8s ease-out 0.1s both;
}

.hero-logo {
  max-width: 100px;
  margin: 0 auto;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
}

/* Title */
.hero-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.title-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-gradient-light {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Subtitle */
.hero-subtitle {
  font-size: clamp(1rem, 3vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
  font-weight: 400;
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

/* Feature Highlights - Force horizontal layout */
.feature-highlights {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 1.5rem !important;
  margin-bottom: 2.5rem !important;
  flex-wrap: nowrap !important;
  width: 100% !important;
}

.highlight-item {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 8px !important;
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.highlight-icon {
  width: 32px !important;
  height: 32px !important;
  background: rgba(63, 131, 199, 0.2) !important;
  border-radius: 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  backdrop-filter: blur(5px) !important;
  flex-shrink: 0 !important;
}

.highlight-icon .v-icon {
  color: #60a5fa !important;
  font-size: 20px !important;
}

.highlight-divider {
  width: 1px !important;
  height: 30px !important;
  background: rgba(255, 255, 255, 0.2) !important;
  flex-shrink: 0 !important;
}

/* Small screens - reduce gap and font size but keep horizontal */
@media (max-width: 768px) {
  .feature-highlights {
    gap: 0.75rem !important;
  }

  .highlight-item span {
    font-size: 0.7rem !important;
  }

  .highlight-icon {
    width: 28px !important;
    height: 28px !important;
  }

  .highlight-icon .v-icon {
    font-size: 16px !important;
  }

  .highlight-divider {
    height: 20px !important;
  }
}

/* Extra small screens - keep horizontal, just smaller */
@media (max-width: 480px) {
  .feature-highlights {
    gap: 0.5rem !important;
    justify-content: center !important;
  }

  .highlight-item span {
    font-size: 0.6rem !important;
  }

  .highlight-icon {
    width: 24px !important;
    height: 24px !important;
  }

  .highlight-icon .v-icon {
    font-size: 14px !important;
  }
}

/* Smallest screens - icons only but still horizontal */
@media (max-width: 380px) {
  .feature-highlights {
    gap: 0.75rem !important;
  }

  .highlight-item span {
    display: none !important;
  }

  .highlight-icon {
    width: 32px !important;
    height: 32px !important;
  }

  .highlight-icon .v-icon {
    font-size: 18px !important;
  }
}

/* CTA Buttons */
.cta-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.5s both;
}

.download-btn-primary {
  background: linear-gradient(135deg, #3f83c7 0%, #2563eb 100%) !important;
  color: white !important;
  padding: 12px 32px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  text-transform: none !important;
  border: none !important;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3) !important;
  transition: all 0.3s ease !important;
}

.download-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.4) !important;
}

.learn-more-btn {
  color: white !important;
  padding: 12px 24px !important;
  font-weight: 500 !important;
  font-size: 1rem !important;
  text-transform: none !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s ease !important;
}

.learn-more-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
}

/* Trust Indicators */
.trust-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.trust-item {
  text-align: center;
}

.trust-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.trust-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 2px;
}

.trust-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    padding: 1rem;
  }

  .hero-badge {
    margin-bottom: 1.5rem;
  }

  .feature-highlights {
    gap: 1rem;
  }

  .highlight-item span {
    display: none;
  }

  .highlight-icon {
    width: 40px;
    height: 40px;
  }

  .trust-indicators {
    gap: 1rem;
  }

  .trust-number {
    font-size: 1.25rem;
  }

  .cta-group {
    flex-direction: column;
    width: 100%;
  }

  .download-btn-primary,
  .learn-more-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: clamp(2rem, 10vw, 3rem);
  }

  .highlight-divider,
  .trust-divider {
    display: none;
  }

  .feature-highlights,
  .trust-indicators {
    flex-direction: column;
    gap: 0.75rem;
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

/* Desktop Navigation - Clean and Compact */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.desktop-nav-btn {
  min-width: auto !important;
  width: auto !important;
  padding: 6px 10px !important;
  font-size: 0.875rem !important;
  font-weight: 500;
  letter-spacing: 0.3px;
  white-space: nowrap;
  text-transform: none !important;
  opacity: 0.95;
  transition: all 0.2s ease;
}

.desktop-nav-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-1px);
}

.desktop-nav-btn .nav-text {
  font-size: inherit;
  font-weight: 500;
}

/* Medium desktops (960px - 1200px) */
@media (min-width: 960px) and (max-width: 1200px) {
  .desktop-nav {
    gap: 0.1rem;
  }

  .desktop-nav-btn {
    padding: 6px 6px !important;
    font-size: 0.75rem !important;
  }
}

/* Large desktops (1200px - 1400px) */
@media (min-width: 1200px) and (max-width: 1400px) {
  .desktop-nav-btn {
    padding: 6px 10px !important;
    font-size: 0.8125rem !important;
  }
}

/* Extra large desktops (1400px+) */
@media (min-width: 1400px) {
  .desktop-nav {
    gap: 0.5rem;
  }

  .desktop-nav-btn {
    padding: 8px 16px !important;
    font-size: 0.9375rem !important;
  }
}

/* Hide desktop nav on tablets and below */
@media (max-width: 959px) {
  .desktop-nav {
    display: none;
  }
}
</style>
