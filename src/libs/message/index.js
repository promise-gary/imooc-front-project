import { h, render } from 'vue'
import messageComponent from './index.vue'

export const message = (type, content, duration = 3000) => {
  const onDestroy = () => {
    render(null, document.body)
  }

  const vnode = h(messageComponent, {
    type,
    content,
    duration,
    destroy: onDestroy
  })
  render(vnode, document.body)
}
