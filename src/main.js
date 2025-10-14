import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { initSupabase } from './config/supabase.js'
import { usePoemStore } from './stores/poemStore.js'

import './assets/main.css'

// 初始化Supabase数据库连接
initSupabase()

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 初始化应用数据
const initializeApp = async () => {
  try {
    const poemStore = usePoemStore()
    await poemStore.initializeData()
    console.log('应用数据初始化完成')
  } catch (error) {
    console.warn('应用数据初始化失败，使用本地数据:', error)
  }
}

// 挂载应用
app.mount('#app')

// 初始化数据（非阻塞）
initializeApp()