import { getCategory } from '@/api/category'
import { ALL_CATEGORY_ITEM, CATEGORY_NOMAR_DATA } from '@/constants'

export default {
  namespaced: true,
  state: () => ({
    categorys: CATEGORY_NOMAR_DATA
  }),
  mutations: {
    setCategorys(state, categorys) {
      state.categorys = [ALL_CATEGORY_ITEM, ...categorys]
    }
  },
  actions: {
    async useCategoryData(context) {
      const { categorys } = await getCategory()
      context.commit('setCategorys', categorys)
    }
  }
}
