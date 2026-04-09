import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { useREM } from '@/utils/flexible.js'
import mLibs from './libs'
import mDirectives from './directives/index'
import 'virtual:svg-icons-register'
import store from './store'
import useTheme from '@/utils/theme'
import './permission'

useREM()
useTheme()

createApp(App).use(store).use(mLibs).use(router).use(mDirectives).mount('#app')
