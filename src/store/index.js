import { createStore } from 'vuex'
import category from './modules/category'
import theme from './modules/theme'
import getters from './getters'
import app from './modules/app'
import search from './modules/search'
import user from './modules/user'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  getters,
  modules: {
    category,
    theme,
    app,
    search,
    user
  },
  plugins: [
    createPersistedState({
      key: 'imooc-front',
      paths: ['category', 'theme', 'search', 'user'] // app 里的不需要缓存
    })
  ]
})

export default store
