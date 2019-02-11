import Vue from 'vue';
import Node from '../../../object/Node';

const state = {
  root : new Node(),
  selectedNode : {},
  selectedComponent : {},
  count : 0
}

const mutations = {
  SET_SELECTED_NODE_POS(state, payload) {
    state.selectedNode.x = payload[0];
    state.selectedNode.y = payload[1];
  },
  SET_SELECTED_COMPONENT(state, payload) {
    state.selectedComponent = payload;
  },
  SET_SELECTED_NODE(state, payload) {
    state.selectedNode = payload;
  },
  SET_CHILD_NODE(state, payload) {
    Vue.set(state.selectedNode, 'children', payload);
  },
  PUSH_CHILD_NODE(state, payload) {
    state.selectedNode.children.push(payload);
  }
}

const actions = {
  // someAsyncTask ({ commit }) {
  //   // do something async
  //   commit('INCREMENT_MAIN_COUNTER')
  // }
}

const getters = {
  IS_READY(state) {
    return state.root.children.length !== 0;
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
