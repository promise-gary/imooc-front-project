import axios from 'axios'
import store from '@/store'

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    config.headers.icode = 'helloqianduanxunlianying'
    if (store.getters.token) {
      // 如果token存在，注入token
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    if (error.response?.data?.code === 401) {
      // token 超时
      store.dispatch('user/logout')
    }
    return Promise.reject(error)
  }
)

export default service
