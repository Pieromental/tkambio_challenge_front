import './assets/styles/main.sass'
import './assets/styles/fonts.sass'
import loaderPlugin from './plugin/loaderPlugin'
import alertPlugin from './plugin/alertPlugin'
import './plugin/echoPlugin'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(alertPlugin)
app.use(loaderPlugin)
app.mount('#app')
