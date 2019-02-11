import Vue from 'vue';

const state = {
  boardSize : {
    width : 480,
    height : 600
  },
  importCompleted : false,
  isVisible: {
    'PopupAddNode' : false
  }
}

const mutations = {
  SET_BOARD_SIZE (state, payload) {
    Vue.set(state.boardSize, 'width', payload[0]);
    Vue.set(state.boardSize, 'height', payload[1]);
  },  
  SET_IMPORT_COMPLETED (state, payload) {
    state.importCompleted = payload;
  },
  SET_IS_VISIBLE(state, payload) {
    Vue.set(state.isVisible, payload[0], payload[1]);
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
