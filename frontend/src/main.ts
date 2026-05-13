import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import CSS entry directly so foundation styles are never tree-shaken out of app builds.
import './ui-system/foundations/index.css'

// App-specific styles (backward-compat aliases, utility classes, animations)
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
