<script setup>
import { ref, onMounted } from 'vue'

const drawer = ref(false)
const activeTab = ref('home')
const downloadDialog = ref(false)
const isLoading = ref(false)
const downloadSuccess = ref(false)
const downloadError = ref('')

// Using placeholder images from Picsum
const logoUrl = ref('https://picsum.photos/120/120?random=1')
const heroImage = ref('https://picsum.photos/800/400?random=2&blur=1')
const guideImages = {
  account: 'https://picsum.photos/600/300?random=3',
  shop: 'https://picsum.photos/600/300?random=4',
  navigation1: 'https://picsum.photos/600/300?random=5',
  navigation2: 'https://picsum.photos/600/300?random=6'
}
const apkUrl = ref('/closeshop.apk') // Keep your local APK path

const navItems = [
  { title: 'Home', value: 'home', icon: 'mdi-home' },
  { title: 'About', value: 'about', icon: 'mdi-information' },
  { title: 'Guide', value: 'guide', icon: 'mdi-book-open' },
  { title: 'Download', value: 'download-section', icon: 'mdi-download' },
]

const features = ref([
  'Developed by Caraga State University students',
  'Helps business owners grow online visibility',
  'Improves shopping experience for consumers',
  'Easy-to-use interface for all users',
  'Secure transactions and user data protection'
])

const appInfo = ref({
  Developer: 'Closeshop Team',
  Version: '1.0.0',
  Size: '25 MB',
  Requires: 'Android 8.0 or higher',
  'Last Updated': 'December 2024',
  Category: 'Shopping',
  Price: 'Free'
})

const guideSteps = ref([
  {
    id: 'account',
    title: 'How to Create an Account',
    images: [
      { src: guideImages.account, alt: 'Account creation screen' }
    ],
    steps: [
      'Tap the "Sign Up" button on the welcome screen',
      'Enter your email address and create a password',
      'Verify your email through the confirmation link',
      'Complete your profile with personal details'
    ],
    tip: 'Use a valid email for account recovery purposes.'
  },
  {
    id: 'shop',
    title: 'How to Create a Shop',
    images: [
      { src: guideImages.shop, alt: 'Shop creation interface' }
    ],
    steps: [
      'Go to "My Profile" and select "Create Shop"',
      'Upload shop banner and logo (minimum 500x300px)',
      'Fill in shop details: name, description, category',
      'Set up payment methods and shipping options',
      'Add your first products with images and prices'
    ],
    tip: 'Complete all required fields for better shop visibility.'
  },
  {
    id: 'navigation',
    title: 'System Navigation Guide',
    images: [
      { src: guideImages.navigation1, alt: 'Home screen navigation' },
      { src: guideImages.navigation2, alt: 'Product browsing interface' }
    ],
    sections: [
      {
        title: 'Home Screen',
        description: 'Quick access to featured products, recent searches, and personalized recommendations'
      },
      {
        title: 'Search Function',
        description: 'Use keywords, categories, or filters to find specific products'
      },
      {
        title: 'Cart & Checkout',
        description: 'Review items, apply coupons, and complete purchases securely'
      },
      {
        title: 'Seller Dashboard',
        description: 'Track orders, manage inventory, and view sales analytics'
      }
    ]
  }
])

const testimonials = ref([
  {
    name: 'Maria Santos',
    role: 'Small Business Owner',
    text: 'Closeshop helped me reach 3x more customers in just 2 months!',
    avatar: 'https://picsum.photos/60/60?random=7'
  },
  {
    name: 'John Dela Cruz',
    role: 'Frequent Shopper',
    text: 'The interface is so intuitive. Finding products has never been easier.',
    avatar: 'https://picsum.photos/60/60?random=8'
  },
  {
    name: 'Sarah Lim',
    role: 'Online Seller',
    text: 'Inventory management tools saved me hours each week. Highly recommended!',
    avatar: 'https://picsum.photos/60/60?random=9'
  }
])

const footerLinks = ref([
  { text: 'GitHub', icon: 'mdi-github', href: 'https://github.com' },
  { text: 'Twitter', icon: 'mdi-twitter', href: 'https://twitter.com' },
  { text: 'Facebook', icon: 'mdi-facebook', href: 'https://facebook.com' },
  { text: 'Email Support', icon: 'mdi-email', href: 'mailto:support@closeshop.com' },
])

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

const downloadAPK = async () => {
  isLoading.value = true
  downloadSuccess.value = false
  downloadError.value = ''

  try {
    // Method 1: Try using fetch for better control
    const response = await fetch(apkUrl.value)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'closeshop.apk'
    document.body.appendChild(link)
    link.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)

    downloadSuccess.value = true
    downloadDialog.value = true

    // Auto-close dialog after 5 seconds
    setTimeout(() => {
      downloadDialog.value = false
    }, 5000)
  } catch (error) {
    console.error('Download error:', error)
    downloadError.value = 'Download failed. Please try again.'
    downloadDialog.value = true

    // Fallback to direct link method
    const link = document.createElement('a')
    link.href = apkUrl.value
    link.download = 'closeshop.apk'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    isLoading.value = false
  }
}

// Initialize on mount
onMounted(() => {
  console.log('Closeshop App mounted successfully')
})
</script>

<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-img
        :src="logoUrl"
        alt="Closeshop Logo"
        max-height="40"
        max-width="40"
        class="ml-2 mr-4"
        contain
      ></v-img>
      <v-toolbar-title class="font-weight-bold">Closeshop</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Desktop Navigation -->
      <v-tabs v-model="activeTab" color="white" hide-slider class="d-none d-sm-flex">
        <v-tab v-for="item in navItems" :key="item.value" :value="item.value" @click="scrollToSection(item.value)">
          {{ item.title }}
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav dense>
        <v-list-item
          v-for="item in navItems"
          :key="item.value"
          :value="item.value"
          @click="scrollToSection(item.value)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
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
                  max-height="120"
                  max-width="120"
                  class="mx-auto mb-6"
                  contain
                ></v-img>

                <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
                  Transform Your Shopping Experience
                </h1>

                <p class="text-h6 text-md-h5 mb-8 text-grey-darken-2">
                  Connecting businesses with customers seamlessly
                </p>

                <!-- Download Button -->
                <v-btn
                  color="primary"
                  size="x-large"
                  class="mb-4 download-btn"
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
                  {{ isLoading ? 'Downloading...' : 'Get Closeshop Now' }}
                </v-btn>

                <div class="mt-8">
                  <v-chip class="ma-1" color="primary" text-color="white" size="small">
                    <v-icon left size="small">mdi-shield-check</v-icon>
                    Secure
                  </v-chip>
                  <v-chip class="ma-1" color="primary" text-color="white" size="small">
                    <v-icon left size="small">mdi-account-group</v-icon>
                    10K+ Users
                  </v-chip>
                  <v-chip class="ma-1" color="primary" text-color="white" size="small">
                    <v-icon left size="small">mdi-star</v-icon>
                    4.8 Rating
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
              <h2 class="text-h3 font-weight-bold mb-4">About Closeshop</h2>
              <p class="text-h6 text-grey-darken-1 max-width-800 mx-auto">
                A revolutionary shopping platform developed by Caraga State University students
              </p>
              <v-divider width="100" class="mx-auto mt-6"></v-divider>
            </v-col>

            <!-- Features -->
            <v-col cols="12" md="7">
              <v-card class="pa-6 h-100" elevation="2">
                <div class="d-flex align-center mb-4">
                  <v-icon size="48" color="primary" class="mr-4">mdi-star-circle</v-icon>
                  <h3 class="text-h4 font-weight-bold">Key Features</h3>
                </div>
                <v-list lines="two" class="py-0">
                  <v-list-item
                    v-for="(feature, i) in features"
                    :key="i"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <v-icon color="green" class="mr-4">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title class="text-body-1 font-weight-medium">
                      {{ feature }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <!-- App Info -->
            <v-col cols="12" md="5">
              <v-card class="pa-6 h-100" elevation="2">
                <div class="d-flex align-center mb-4">
                  <v-icon size="48" color="primary" class="mr-4">mdi-information</v-icon>
                  <h3 class="text-h4 font-weight-bold">App Details</h3>
                </div>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr v-for="(info, key) in appInfo" :key="key">
                        <td class="font-weight-bold text-body-1 py-3">{{ key }}</td>
                        <td class="text-body-1 py-3">{{ info }}</td>
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
              <h2 class="text-h3 font-weight-bold mb-4">User Guide</h2>
              <p class="text-h6 text-grey-darken-1 max-width-800 mx-auto">
                Learn how to make the most of Closeshop with our step-by-step guides
              </p>
              <v-divider width="100" class="mx-auto mt-6"></v-divider>
            </v-col>

            <!-- Guide Steps -->
            <v-col cols="12" v-for="guide in guideSteps" :key="guide.id" class="mb-12">
              <v-card class="pa-6" elevation="2">
                <h3 class="text-h4 font-weight-bold mb-6">{{ guide.title }}</h3>
                
                <!-- Images Row -->
                <v-row class="mb-6">
                  <v-col
                    v-for="(image, idx) in guide.images"
                    :key="idx"
                    cols="12"
                    :md="12 / guide.images.length"
                  >
                    <v-card variant="outlined" class="pa-2">
                      <v-img
                        :src="image.src"
                        :alt="image.alt"
                        height="300"
                        class="rounded-lg"
                      ></v-img>
                      <p class="text-caption text-center mt-2 text-grey">
                        {{ image.alt }}
                      </p>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Steps or Sections -->
                <v-row>
                  <v-col v-if="guide.steps" cols="12" md="8">
                    <h4 class="text-h6 font-weight-bold mb-4">Step-by-Step Process:</h4>
                    <v-list lines="two" class="py-0">
                      <v-list-item
                        v-for="(step, index) in guide.steps"
                        :key="index"
                        class="px-0"
                      >
                        <template v-slot:prepend>
                          <v-avatar color="primary" size="24" class="mr-4">
                            <span class="text-white">{{ index + 1 }}</span>
                          </v-avatar>
                        </template>
                        <v-list-item-title class="text-body-1">
                          {{ step }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-col>

                  <v-col v-if="guide.sections" cols="12">
                    <h4 class="text-h6 font-weight-bold mb-4">Navigation Areas:</h4>
                    <v-row>
                      <v-col
                        v-for="(section, idx) in guide.sections"
                        :key="idx"
                        cols="12"
                        sm="6"
                        md="3"
                      >
                        <v-card variant="outlined" class="pa-4 h-100">
                          <h5 class="text-subtitle-1 font-weight-bold mb-2">
                            {{ section.title }}
                          </h5>
                          <p class="text-body-2 text-grey-darken-1">
                            {{ section.description }}
                          </p>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <!-- Tip -->
                <v-alert
                  v-if="guide.tip"
                  type="info"
                  variant="tonal"
                  class="mt-6"
                  density="compact"
                >
                  <v-icon left>mdi-lightbulb</v-icon>
                  <strong>Pro Tip:</strong> {{ guide.tip }}
                </v-alert>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Testimonials Section -->
      <section class="py-16 testimonials-section">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center mb-8">
              <h2 class="text-h3 font-weight-bold mb-4">What Our Users Say</h2>
              <v-divider width="100" class="mx-auto"></v-divider>
            </v-col>
            
            <v-col
              v-for="(testimonial, index) in testimonials"
              :key="index"
              cols="12"
              md="4"
            >
              <v-card class="pa-6 h-100" elevation="2">
                <div class="d-flex align-center mb-4">
                  <v-avatar size="60" class="mr-4">
                    <v-img :src="testimonial.avatar" alt="User avatar"></v-img>
                  </v-avatar>
                  <div>
                    <h4 class="text-h6 font-weight-bold">{{ testimonial.name }}</h4>
                    <p class="text-caption text-grey">{{ testimonial.role }}</p>
                  </div>
                </div>
                <p class="text-body-1 text-grey-darken-2">
                  "{{ testimonial.text }}"
                </p>
                <div class="d-flex mt-4">
                  <v-icon v-for="n in 5" :key="n" color="amber" size="small">
                    mdi-star
                  </v-icon>
                </div>
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
              <v-card class="pa-8 pa-sm-12" color="primary" dark elevation="8">
                <v-icon size="80" class="mb-4">mdi-android</v-icon>

                <h2 class="text-h3 font-weight-bold mb-4">Ready to Get Started?</h2>

                <p class="text-h6 mb-6">
                  Join thousands of satisfied users. Download Closeshop today and transform your shopping experience.
                </p>

                <v-btn
                  color="white"
                  size="x-large"
                  @click="downloadAPK"
                  rounded
                  class="px-8 mb-4"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  <template v-slot:loader>
                    <v-progress-circular
                      indeterminate
                      color="primary"
                      size="24"
                    ></v-progress-circular>
                  </template>
                  <v-icon left>mdi-download</v-icon>
                  {{ isLoading ? 'Downloading...' : 'Download Free APK' }}
                </v-btn>

                <div class="mt-8">
                  <p class="text-body-2 mb-2">Version 1.0.0 • 25 MB • Android 8.0+</p>
                  <div>
                    <v-chip class="ma-1" color="white" text-color="primary" size="small">
                      <v-icon left size="small">mdi-shield-check</v-icon>
                      No Ads
                    </v-chip>
                    <v-chip class="ma-1" color="white" text-color="primary" size="small">
                      <v-icon left size="small">mdi-update</v-icon>
                      Regular Updates
                    </v-chip>
                    <v-chip class="ma-1" color="white" text-color="primary" size="small">
                      <v-icon left size="small">mdi-headset</v-icon>
                      Free Support
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
    <v-footer color="primary" class="mt-auto">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="text-center text-md-left">
            <div class="d-flex align-center justify-center justify-md-start mb-4">
              <v-img
                :src="logoUrl"
                alt="Closeshop Logo"
                max-height="40"
                max-width="40"
                class="mr-3"
              ></v-img>
              <h3 class="text-h5 font-weight-bold text-white">Closeshop</h3>
            </div>
            <p class="text-white mb-0">
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
                class="mx-2"
                color="white"
                :title="link.text"
              >
                <v-icon>{{ link.icon }}</v-icon>
              </v-btn>
            </div>
            <p class="text-caption text-white">
              closeshop@example.com • +63 123 456 7890
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Download Dialog -->
    <v-dialog v-model="downloadDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5 d-flex align-center">
          <v-icon :color="downloadSuccess ? 'green' : 'primary'" left>
            {{ downloadSuccess ? 'mdi-check-circle' : 'mdi-download' }}
          </v-icon>
          {{ downloadSuccess ? 'Download Complete!' : 'Download Started' }}
        </v-card-title>
        
        <v-card-text>
          <p v-if="downloadSuccess" class="text-body-1">
            <v-icon color="green" left>mdi-check</v-icon>
            Closeshop APK has been downloaded successfully!
          </p>
          <p v-else class="text-body-1">
            <v-icon color="primary" left>mdi-download</v-icon>
            Your download should begin automatically.
          </p>
          
          <p class="text-body-2 mt-4">
            <strong>Next Steps:</strong>
          </p>
          <ol class="text-body-2 pl-4">
            <li>Locate the downloaded APK file</li>
            <li>Allow installation from unknown sources in Android settings</li>
            <li>Follow the installation prompts</li>
            <li>Open Closeshop and create your account</li>
          </ol>

          <div v-if="downloadError" class="mt-4">
            <v-alert type="error" density="compact">
              <v-icon left>mdi-alert-circle</v-icon>
              {{ downloadError }}
            </v-alert>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="downloadDialog = false">
            Got it
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style scoped>
/* Hero Section */
.hero-section {
  min-height: 90vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
}

.hero-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1) !important;
}

/* Sections */
.about-section {
  background-color: #f8fafc;
}

.guide-section {
  background-color: #ffffff;
}

.testimonials-section {
  background-color: #f1f5f9;
}

.download-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Download Button */
.download-btn {
  min-width: 280px;
  padding: 20px 40px !important;
  font-size: 1.1rem !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
}

.download-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3) !important;
}

/* Cards */
.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px !important;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

/* Utility Classes */
.max-width-800 {
  max-width: 800px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .download-btn {
    min-width: 240px;
    padding: 18px 36px !important;
  }
  
  .hero-section {
    min-height: 80vh;
  }
  
  .text-h3 {
    font-size: 2rem !important;
  }
}

@media (max-width: 600px) {
  .download-btn {
    min-width: 200px;
    padding: 16px 32px !important;
    font-size: 1rem !important;
  }
  
  .hero-card {
    padding: 2rem !important;
  }
  
  .text-h3 {
    font-size: 1.75rem !important;
  }
  
  section {
    padding-top: 3rem !important;
    padding-bottom: 3rem !important;
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
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #69418f 100%);
}

/* Typography improvements */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Roboto', sans-serif;
  letter-spacing: -0.3px;
}

.text-primary {
  color: #667eea !important;
}
</style>