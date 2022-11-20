import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    article_id: 0,
    isAddTag:0,
    cover:{}
  },
  mutations: {
    getArticleId(state, payload) {
      state.article_id = payload
    },
    addTag(state,payload) {
      state.isAddTag++
    },
    getCover(state,payload) {
      state.cover=payload
    }
  },
  actions: {},
  modules: {}
})