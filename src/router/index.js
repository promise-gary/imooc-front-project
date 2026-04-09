import { createRouter, createWebHistory } from 'vue-router'
import { isMobileTerminal } from '@/utils/flexible'
import mobileTerminalRoutes from '@/router/modules/mobile-routes'
import pcTerminalRoutes from '@/router/modules/pc-routes'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(),
  routes: isMobileTerminal.value ? mobileTerminalRoutes : pcTerminalRoutes
})

const HOME_ROUTE_NAME = 'home'
const ROUTER_TYPE_NONE = 'none'
const ROUTER_TYPE_PUSH = 'push'
const ROUTER_TYPE_BACK = 'back'

const changeRouterType = (routerType) => {
  store.commit('app/changeRouterType', routerType)
}

const isHomeRoute = (to) => {
  const targetRoute = router.resolve(to)
  return (
    targetRoute.name === HOME_ROUTE_NAME ||
    targetRoute.path === '/'
  )
}

const rawPush = router.push
const rawBack = router.back
const rawGo = router.go

router.push = function (to) {
  changeRouterType(isHomeRoute(to) ? ROUTER_TYPE_NONE : ROUTER_TYPE_PUSH)
  return rawPush.call(router, to)
}

router.back = function () {
  changeRouterType(ROUTER_TYPE_BACK)
  return rawBack.call(router)
}

router.go = function (delta) {
  if (delta < 0) {
    changeRouterType(ROUTER_TYPE_BACK)
  }
  return rawGo.call(router, delta)
}

export default router
