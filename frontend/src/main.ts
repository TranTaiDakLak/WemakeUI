import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// WX UI System foundations (tokens, dark mode, layout, surfaces, typography, etc.)
import './ui-system/foundations'

// App-specific styles (backward-compat aliases, utility classes, animations)
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
