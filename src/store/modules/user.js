import md5 from 'md5'
import { loginUser, getProfile, registerUser } from '@/api/sys'
import { message } from '@/libs'

export default {
  namespaced: true,
  state: () => ({
    token: '',
    // 用户信息
    userInfo: {}
  }),
  mutations: {
    /**
     * 保存token
     */
    setToken(state, newToken) {
      state.token = newToken
    },
    /**
     * 保存用户信息
     */
    setUserInfo(state, newInfo) {
      state.userInfo = newInfo
    }
  },
  actions: {
    /**
     * 登录
     */
    async login(context, payload) {
      const { password } = payload
      const data = await loginUser({
        ...payload,
        password: password ? md5(password) : ''
      })
      // 保存 token
      context.commit('setToken', data.token)
      context.dispatch('profile')
    },
    /**
     * 获取用户信息
     */
    async profile(context) {
      const data = await getProfile()
      context.commit('setUserInfo', data)
      message(
        'success',
        `欢迎您 ${data.vipLevel ? '尊贵的 VIP' + data.vipLevel + '用户' + data.nickname : data.nickname}`,
        6000
      )
    },
    /**
     * 退出登录
     */
    logout(context) {
      context.commit('setToken', '')
      context.commit('setUserInfo', {})
      // 退出登录后，重新刷新页面，因为对于前台项目而言，用户是否登录（是否为vip）看到的数据可能不同
      location.reload()
    },
    /**
     * 注册
     */
    async register(context, payload) {
      const { password } = payload
      return await registerUser({
        ...payload,
        password: password ? md5(password) : ''
      })
    }
  }
}
