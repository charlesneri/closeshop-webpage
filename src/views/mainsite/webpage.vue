<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title>MyApp</v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Desktop Navigation -->
      <v-tabs v-model="activeTab" color="white" hide-slider class="d-none d-sm-flex">
        <v-tab value="home" @click="scrollToSection('home')">Home</v-tab>
        <v-tab value="about" @click="scrollToSection('about')">About</v-tab>
        <v-tab value="guide" @click="scrollToSection('guide')">Guide</v-tab>
        <v-tab value="download" @click="scrollToSection('download')">Download</v-tab>
      </v-tabs>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          v-for="item in navItems"
          :key="item.value"
          :value="item.value"
          @click="scrollToSection(item.value)"
        >
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
                <v-icon size="80" color="primary" class="mb-4">mdi-cellphone</v-icon>
                
                <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
                  Welcome to MyApp
                </h1>
                
                <p class="text-h6 text-md-h5 mb-8">
                  The ultimate solution for your needs
                </p>
                
                <!-- Download Button -->
                <v-btn
                  id="download"
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
                  {{ isLoading ? 'Downloading...' : 'Click Here to Download APK' }}
                </v-btn>
                
                <p class="text-caption">
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
                <h2 class="text-h3 font-weight-bold mb-4">About MyApp</h2>
                <v-divider width="100" class="mx-auto"></v-divider>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card class="pa-6" elevation="2">
                  <v-icon size="60" color="primary" class="mb-4">mdi-star-circle</v-icon>
                  <h3 class="text-h5 font-weight-bold mb-3">Features</h3>
                  <v-list>
                    <v-list-item v-for="(feature, i) in features" :key="i">
                      <v-list-item-icon>
                        <v-icon color="success">mdi-check-circle</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ feature }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-card class="pa-6" elevation="2">
                  <v-icon size="60" color="primary" class="mb-4">mdi-information</v-icon>
                  <h3 class="text-h5 font-weight-bold mb-3">App Information</h3>
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr v-for="(info, key) in appInfo" :key="key">
                          <td class="font-weight-bold">{{ key }}:</td>
                          <td>{{ info }}</td>
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
                <h2 class="text-h3 font-weight-bold mb-4">How to Use</h2>
                <v-divider width="100" class="mx-auto"></v-divider>
              </v-col>
              
              <v-col cols="12" md="8" offset-md="2">
                <v-timeline align-top>
                  <v-timeline-item
                    v-for="(step, i) in instructions"
                    :key="i"
                    :color="stepColors[i]"
                    size="small"
                  >
                    <template v-slot:opposite>
                      <span class="text-h6 font-weight-bold">Step {{ i + 1 }}</span>
                    </template>
                    <v-card class="pa-4" elevation="2">
                      <v-card-title class="text-h5">
                        <v-icon left :color="stepColors[i]">{{ step.icon }}</v-icon>
                        {{ step.title }}
                      </v-card-title>
                      <v-card-text class="text-body-1">
                        {{ step.description }}
                      </v-card-text>
                      <v-card-actions v-if="step.note">
                        <v-alert type="info" density="compact" class="mt-2">
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
              <v-col cols="12" md="8" class="text-center">
                <v-card class="pa-8" color="primary" dark elevation="8">
                  <v-icon size="80" class="mb-4">mdi-android</v-icon>
                  
                  <h2 class="text-h3 font-weight-bold mb-4">Ready to Download?</h2>
                  
                  <p class="text-h6 mb-6">
                    Get started with MyApp today. Download the APK file and experience all the features.
                  </p>
                  
                  <v-btn
                    color="white"
                    size="x-large"
                    @click="downloadAPK"
                    rounded
                    class="px-8"
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
                      <v-icon left>mdi-shield-check</v-icon>
                      Virus Free
                    </v-chip>
                    <v-chip class="ma-1" color="white" text-color="primary">
                      <v-icon left>mdi-update</v-icon>
                      Latest Version
                    </v-chip>
                    <v-chip class="ma-1" color="white" text-color="primary">
                      <v-icon left>mdi-headset</v-icon>
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
            <p class="text-h6 font-weight-bold mb-2">MyApp</p>
            <p class="mb-4">© 2024 MyApp. All rights reserved.</p>
            <div>
              <v-btn
                v-for="link in footerLinks"
                :key="link.text"
                :href="link.href"
                target="_blank"
                icon
                variant="text"
                class="mx-2"
                size="small"
              >
                <v-icon>{{ link.icon }}</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Download Dialog -->
    <v-dialog v-model="downloadDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
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

// Update this to your APK file name
const apkUrl = ref('/closeshop.apk')

const navItems = [
  { title: 'Home', value: 'home' },
  { title: 'About', value: 'about' },
  { title: 'Guide', value: 'guide' },
  { title: 'Download', value: 'download-section' }
]

const features = ref([
  'Easy to use interface',
  'Fast and reliable performance',
  'Secure data handling',
  'Regular updates',
  'Offline functionality',
  'Cross-platform compatibility'
])

const appInfo = ref({
  'Developer': 'MyApp Team',
  'Version': '1.0.0',
  'Size': '25 MB',
  'Requires': 'Android 8.0 or higher',
  'Last Updated': 'December 2024',
  'Category': 'Productivity'
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
    description: 'Open the app and sign up with your email or social media accounts.',
    note: 'You can also use the app as a guest initially.'
  },
  {
    icon: 'mdi-cog',
    title: 'Configure Settings',
    description: 'Customize the app settings according to your preferences.',
    note: 'Recommended to enable notifications for best experience.'
  },
  {
    icon: 'mdi-rocket-launch',
    title: 'Start Using',
    description: 'You\'re all set! Start exploring all the features of our app.',
    note: 'Check the help section within the app for detailed guides.'
  }
])

const stepColors = ['primary', 'secondary', 'success', 'warning', 'info']

const footerLinks = ref([
  { text: 'GitHub', icon: 'mdi-github', href: 'https://github.com' },
  { text: 'Twitter', icon: 'mdi-twitter', href: 'https://twitter.com' },
  { text: 'Documentation', icon: 'mdi-book-open', href: '#' },
  { text: 'Support', icon: 'mdi-help-circle', href: 'mailto:support@example.com' }
])

const scrollToSection = (sectionId) => {
  drawer.value = false
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
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
    link.download = 'closeshop.apk' // This will be the downloaded filename
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
    
    downloadSuccess.value = true
    downloadDialog.value = true
    
  } catch (error) {
    console.error('Download error:', error)
    
    // Method 2: Fallback to direct link method
    try {
      const link = document.createElement('a')
      link.href = apkUrl.value
      link.download = 'closeshop.apk'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      downloadSuccess.value = true
      downloadDialog.value = true
      
    } catch (fallbackError) {
      console.error('Fallback download error:', fallbackError)
      downloadError.value = 'Download failed. Please try again or contact support.'
      downloadDialog.value = true
    }
  } finally {
    isLoading.value = false
  }
}

// Optional: Initialize on mount
onMounted(() => {
  console.log('App mounted')
  
  // Test if APK file exists
  fetch(apkUrl.value)
    .then(response => {
      if (response.ok) {
        console.log('APK file found at:', apkUrl.value)
      } else {
        console.warn('APK file not found at:', apkUrl.value)
      }
    })
    .catch(error => {
      console.error('Error checking APK file:', error)
    })
})
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.transparent-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-radius: 20px;
}

.download-btn {
  min-width: 300px;
  padding: 20px 40px !important;
  font-size: 1.2rem !important;
}

.about-section {
  background-color: #f8f9fa;
}

.guide-section {
  background-color: #ffffff;
}

.download-section {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Smooth transitions */
.v-card {
  transition: transform 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .download-btn {
    min-width: 250px;
    padding: 16px 32px !important;
  }
  
  .text-h3 {
    font-size: 2rem !important;
  }
}

@media (max-width: 600px) {
  .download-btn {
    min-width: 200px;
    padding: 12px 24px !important;
    font-size: 1rem !important;
  }
  
  .text-h3 {
    font-size: 1.75rem !important;
  }
}

/* Loading animation */
.v-progress-circular {
  animation: none;
}
</style>