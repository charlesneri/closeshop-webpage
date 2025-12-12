import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// If you want custom icons, import them properly:
// import { mdiAccount } from '@mdi/js'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  // If you need custom icon aliases, uncomment and fix:
  // icons: {
  //   defaultSet: 'mdi',
  //   aliases: {
  //     // Define your custom aliases here
  //     account: mdiAccount, // Make sure mdiAccount is imported
  //   },
  //   sets: {
  //     mdi,
  //   },
  // },
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')