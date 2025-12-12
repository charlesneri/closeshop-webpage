<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-img
        :src="logoUrl"
        alt="App Logo"
        max-height="40"
        max-width="40"
        class="ml-2 mr-4"
        contain
      ></v-img>
      <v-toolbar-title class="font-weight-bold">Closeshop</v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Desktop Navigation -->
      <v-tabs v-model="activeTab" color="white" hide-slider class="d-none d-sm-flex">
        <v-tab value="home" @click="scrollToSection('home')">Home</v-tab>
        <v-tab value="about" @click="scrollToSection('about')">About</v-tab>
        <v-tab value="guide" @click="scrollToSection('guide')">Guide</v-tab>
        <v-tab value="download" @click="scrollToSection('download-section')">Download</v-tab>
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
      <!-- Home Section -->
      <v-container fluid class="pa-0">
        <section id="home" class="hero-section">
          <v-row align="center" justify="center" class="fill-height">
            <v-col cols="12" md="8" lg="6" class="text-center">
              <v-card class="pa-8 transparent-card" elevation="0">
                <v-img
                  :src="logoUrl"
                  alt="App Logo"
                  max-height="120"
                  max-width="120"
                  class="mx-auto mb-6"
                  contain
                ></v-img>
                
                <h1 class="text-h3 text-md-h2 font-weight-bold mb-4 text-white">
                  Welcome to Closeshop
                </h1>
                
                <p class="text-h6 text-md-h5 mb-8 text-white">
                  Your ultimate shopping companion
                </p>
                
                <!-- Download Button -->
                <v-btn
                  color="white"
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
                      color="primary"
                      size="24"
                    ></v-progress-circular>
                  </template>
                  <v-icon left>mdi-download</v-icon>
                  {{ isLoading ? 'Downloading...' : 'Download APK Now' }}
                </v-btn>
                
                <p class="text-caption text-white">
                  Version 1.0.0 • 25 MB • Android 8.0+
                </p>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <!-- About Section -->
        <section id="about" class="py-16 about-section">
          <v-container>
            <v-row>
              <v-col cols="12" class="text-center mb-8">
                <h2 class="text-h3 font-weight-bold mb-4">About Closeshop</h2>
                <v-divider width="100" class="mx-auto mb-8"></v-divider>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card class="pa-6 h-100" elevation="2">
                  <v-icon size="60" color="primary" class="mb-4">mdi-star-circle</v-icon>
                  <h3 class="text-h5 font-weight-bold mb-4">Features</h3>
                  <v-list dense>
                    <v-list-item v-for="(feature, i) in features" :key="i">
                      <v-list-item-icon>
                        <v-icon color="success">mdi-check-circle</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="text-body-1">{{ feature }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card class="pa-6 h-100" elevation="2">
                  <v-icon size="60" color="primary" class="mb-4">mdi-information</v-icon>
                  <h3 class="text-h5 font-weight-bold mb-4">App Information</h3>
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr v-for="(info, key) in appInfo" :key="key">
                          <td class="font-weight-bold text-body-1">{{ key }}</td>
                          <td class="text-body-1">{{ info }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </section>

        <!-- Guide/Instructions Section -->
        <section id="guide" class="py-16 guide-section">
          <v-container>
            <v-row>
              <v-col cols="12" class="text-center mb-8">
                <h2 class="text-h3 font-weight-bold mb-4">How to Navigate this app</h2>
                <v-divider width="100" class="mx-auto mb-8"></v-divider>
              </v-col>
              
              <v-col cols="12" md="10" lg="8" class="mx-auto">
                <v-timeline align-top dense>
                  <v-timeline-item
                    v-for="(step, i) in instructions"
                    :key="i"
                    :color="stepColors[i]"
                    size="small"
                    fill-dot
                  >
                    <template v-slot:opposite>
                      <span class="text-h6 font-weight-bold">Step {{ i + 1 }}</span>
                    </template>
                    <v-card class="pa-4" elevation="2">
                      <v-card-title class="text-h5 d-flex align-center">
                        <v-icon left :color="stepColors[i]" class="mr-2">{{ step.icon }}</v-icon>
                        {{ step.title }}
                      </v-card-title>
                      <v-card-text class="text-body-1">
                        {{ step.description }}
                      </v-card-text>
                      <v-card-actions v-if="step.note">
                        <v-alert type="info" density="compact" class="mt-2 w-100">
                          <v-icon small left>mdi-information</v-icon>
                          {{ step.note }}
                        </v-alert>
                      </v-card-actions>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-col>
            </v-row>
          </v-container>
        </section>

        <!-- Download Section -->
        <section id="download-section" class="py-16 download-section">
          <v-container>
            <v-row align="center" justify="center">
              <v-col cols="12" md="8" lg="6" class="text-center">
                <v-card class="pa-8" color="primary" dark elevation="8">
                  <v-icon size="80" class="mb-4">mdi-android</v-icon>
                  
                  <h2 class="text-h3 font-weight-bold mb-4">Ready to Download?</h2>
                  
                  <p class="text-h6 mb-6">
                    Get started with Closeshop today. Download the APK file and experience seamless shopping.
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
                    {{ isLoading ? 'Downloading...' : 'Download APK (v1.0.0)' }}
                  </v-btn>
                  
                  <div class="mt-6">
                    <v-chip class="ma-1" color="white" text-color="primary">
                      <v-icon left size="small">mdi-shield-check</v-icon>
                      Virus Free
                    </v-chip>
                    <v-chip class="ma-1" color="white" text-color="primary">
                      <v-icon left size="small">mdi-update</v-icon>
                      Latest Version
                    </v-chip>
                    <v-chip class="ma-1" color="white" text-color="primary">
                      <v-icon left size="small">mdi-headset</v-icon>
                      24/7 Support
                    </v-chip>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </section>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer color="primary" class="mt-auto">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <p class="text-h6 font-weight-bold mb-2">Closeshop</p>
            <p class="mb-4">© 2024 Closeshop. All rights reserved.</p>
            <div class="mb-2">
              <v-btn
                v-for="link in footerLinks"
                :key="link.text"
                :href="link.href"
                target="_blank"
                icon
                variant="text"
                class="mx-2"
                size="small"
                :title="link.text"
              >
                <v-icon>{{ link.icon }}</v-icon>
              </v-btn>
            </div>
            <p class="text-caption">closeshop.apk • Version 1.0.0</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Download Dialog -->
    <v-dialog v-model="downloadDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 d-flex align-center">
          <v-icon color="primary" left>mdi-download</v-icon>
          {{ downloadSuccess ? 'Download Complete!' : 'Download Started' }}
        </v-card-title>
        <v-card-text>
          <p v-if="downloadSuccess" class="text-body-1">
            Your download has completed successfully!
          </p>
          <p v-else class="text-body-1">
            Your download should start automatically.
          </p>
          <p class="text-body-2 mt-2">
            If it doesn't start,
            <a :href="apkUrl" download="closeshop.apk" @click="downloadDialog = false">
              click here to download manually
            </a>
          </p>
          <div v-if="downloadError" class="mt-3">
            <v-alert type="error" density="compact">
              <v-icon small left>mdi-alert</v-icon>
              {{ downloadError }}
            </v-alert>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="downloadDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const drawer = ref(false)
const activeTab = ref('home')
const downloadDialog = ref(false)
const isLoading = ref(false)
const downloadSuccess = ref(false)
const downloadError = ref('')

// Update these URLs to your actual files
const logoUrl = ref('/logo.png')
const apkUrl = ref('/closeshop.apk')

const navItems = [
  { title: 'Home', value: 'home', icon: 'mdi-home' },
  { title: 'About', value: 'about', icon: 'mdi-information' },
  { title: 'Guide', value: 'guide', icon: 'mdi-book-open' },
  { title: 'Download', value: 'download-section', icon: 'mdi-download' }
]

const features = ref([
  'Easy to use shopping interface',
  'Fast and reliable performance',
  'Secure payment processing',
  'Regular product updates',
  'Offline shopping cart',
  'Cross-store compatibility'
])

const appInfo = ref({
  'Developer': 'Closeshop Team',
  'Version': '1.0.0',
  'Size': '25 MB',
  'Requires': 'Android 8.0 or higher',
  'Last Updated': 'December 2024',
  'Category': 'Shopping'
})

const instructions = ref([
  {
    icon: 'mdi-download',
    title: 'Download the APK',
    description: 'Click the download button above to get the APK file. Make sure you have enough storage space.',
    note: 'Allow installation from unknown sources in your Android settings.'
  },
  {
    icon: 'mdi-install',
    title: 'Install the Application',
    description: 'Open the downloaded APK file and follow the installation prompts.',
    note: 'The installation may take a few minutes depending on your device.'
  },
  {
    icon: 'mdi-account',
    title: 'Create Your Account',
    description: 'Open the app and sign up with your email or create a new account.',
    note: 'You can also browse products as a guest initially.'
  },
  {
    icon: 'mdi-cog',
    title: 'Configure Preferences',
    description: 'Set up your shopping preferences, payment methods, and delivery addresses.',
    note: 'Recommended to enable notifications for order updates.'
  },
  {
    icon: 'mdi-shopping',
    title: 'Start Shopping',
    description: 'You\'re all set! Start exploring products and enjoy seamless shopping.',
    note: 'Check the help section within the app for shopping tips.'
  }
])

const stepColors = ['blue', 'green', 'orange', 'purple', 'red']

const footerLinks = ref([
  { text: 'GitHub', icon: 'mdi-github', href: 'https://github.com' },
  { text: 'Twitter', icon: 'mdi-twitter', href: 'https://twitter.com' },
  { text: 'Facebook', icon: 'mdi-facebook', href: 'https://facebook.com' },
  { text: 'Email Support', icon: 'mdi-email', href: 'mailto:support@closeshop.com' }
])

const scrollToSection = (sectionId) => {
  drawer.value = false
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
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

// Optional: Initialize on mount
onMounted(() => {
  console.log('App mounted')
  
  // Test if files exist
  const filesToCheck = [logoUrl.value, apkUrl.value]
  filesToCheck.forEach(url => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          console.log(`File found: ${url}`)
        } else {
          console.warn(`File not found: ${url}`)
        }
      })
      .catch(error => {
        console.error(`Error checking file ${url}:`, error)
      })
  })
})
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.transparent-card {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.download-btn {
  min-width: 280px;
  padding: 18px 36px !important;
  font-size: 1.1rem !important;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.about-section {
  background-color: #f8f9fa;
}

.guide-section {
  background-color: #ffffff;
}

.download-section {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}

/* Smooth transitions */
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.2) !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .download-btn {
    min-width: 240px;
    padding: 16px 32px !important;
  }
  
  .text-h3 {
    font-size: 2rem !important;
  }
  
  .transparent-card {
    padding: 2rem !important;
  }
}

@media (max-width: 600px) {
  .download-btn {
    min-width: 220px;
    padding: 14px 28px !important;
    font-size: 1rem !important;
  }
  
  .text-h3 {
    font-size: 1.75rem !important;
  }
  
  .transparent-card {
    padding: 1.5rem !important;
  }
  
  section {
    padding-top: 3rem !important;
    padding-bottom: 3rem !important;
  }
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

/* Smooth section transitions */
section {
  scroll-margin-top: 70px;
}

/* Typography improvements */
h1, h2, h3 {
  font-family: 'Roboto', sans-serif;
  letter-spacing: -0.5px;
}

.text-white {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>