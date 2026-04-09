import { useIntersectionObserver } from '@vueuse/core'

export default {
  // 图片懒加载：在用户无法看到图片时，不加载图片，用户可以看到图片时再去加载图片
  mounted(el) {
    const imgSrc = el.src
    el.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

    const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        el.src = imgSrc
        stop()
      }
    })
  }
}
