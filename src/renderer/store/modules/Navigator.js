const state = {
  projectPath : '',
  treeviewData: {}
}

const mutations = {
  SET_PROJECT_PATH (state, payload) {
    state.projectPath = payload;
  },
  SET_CLASSIFY_TREEVIEW_DATA (state, payload) {
    //Classes 폴더
  }
}

const actions = {
  // someAsyncTask ({ commit }) {
  //   // do something async
  //   commit('INCREMENT_MAIN_COUNTER')
  // }
}

export default {
  state,
  mutations,
  actions
}
