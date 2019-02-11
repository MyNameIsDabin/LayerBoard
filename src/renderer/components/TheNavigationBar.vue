<template>
  <div class="wrapper scrollbar">
    <div class="head">
      <span>옵션</span>
    </div>
    <div class="optionWrapper">
      <span class="optionInput unchanged">
        <span>type</span>
        <span>{{selectedNode.type}}</span>
      </span>
      <span class="optionInput">
        <span>name</span>
        <input type="text" v-model="selectedNode.name"></input>
      </span>
      <span class="optionInput unchanged">
        <span>width</span>
        <span>{{selectedNode.width}}</span>
      </span>
      <span class="optionInput unchanged">
        <span>height</span>
        <span>{{selectedNode.height}}</span>
      </span>
      <span class="optionInput unchanged">
        <span>x</span>
        <input v-if="!isRootComponent()" type="text" v-model="selectedNode.x"></input>
        <span v-else>{{selectedNode.x}}</span>
      </span>
      <span class="optionInput unchanged">
        <span>y</span>
        <input v-if="!isRootComponent()" type="text" v-model="positionY" @change="setPositionY(positionY)"></input>
        <span v-else>{{selectedNode.y}}</span>
      </span>
    </div>
    <div class="head">
      <span>노드</span>
      <span class="iconNewNode" @click="SET_IS_VISIBLE(['PopupAddNode', true])"><icon name="plus-square"></icon></span>
    </div>
    <div class="treeWrapper">
      <ul class="tree" v-for="node in root.children" :key="node.id">
        <tree-item class="item" :model="node"></tree-item>
      </ul>
    </div>
  </div>
</template>

<script>
  import TreeItem from './treeItem';
  import { mapState, mapMutations, mapGetters } from 'vuex';
  import util from '../../util/common.js';

  export default {
    name : 'the-navigation-bar',
    components: {
      TreeItem
    },
    data() {
      return {
        positionY: 0
      }
    },
    computed: {
      ...mapGetters(['IS_READY']),
      ...mapState({
        root: state => state.TreeNavigator.root,
        selectedNode: state => state.TreeNavigator.selectedNode,
        selectedComponent: state => state.TreeNavigator.selectedComponent,
        boardSize: state => state.Common.boardSize,
        selectedPosY: state => state.TreeNavigator.selectedNode.y
      })
    },
    methods: {
      ...mapMutations(['SET_IS_VISIBLE', 'SET_SELECTED_NODE_POS']),
      getCocosPositionY() {
        return this.boardSize.height - this.selectedNode.y;
      },
      isRootComponent() {
        return this.root.children[0].id === this.selectedNode.id;
      },
      setPositionY(yPos) {
        this.positionY = yPos;
        this.selectedComponent.style.top = (this.boardSize.height - yPos) + "px";
        this.SET_SELECTED_NODE_POS([this.selectedNode.x, this.boardSize.height - yPos]);
      }
    },
    mounted() {
      util.activeHorizontalScroll(document.getElementsByClassName('optionWrapper')[0]);
      util.activeHorizontalScroll(document.getElementsByClassName('treeWrapper')[0]);
    },
    watch: {
      IS_READY(value) {
        this.positionY = this.getCocosPositionY();
      },
      selectedPosY(value) {
        if (this.selectedComponent.id !== this.selectedNode.id)
          return;

        this.positionY = this.boardSize.height - value;
        this.selectedComponent.style.top = this.selectedNode.y + "px";
      }
    }
  }
</script>

<style scoped>
  .tree {
    width: 200px;
  }
  .wrapper {
    height: 100%;
    background-color: #272e2d;
  }
  .treeWrapper {
    overflow-x: scroll;
    height: 100%;
  }
  .optionWrapper {
    height: 120px;
  }
  .head {
    font-size: 0.8rem;
    padding: 3px;
    padding-left: 5px;
    color: #95a4a2;
    background-color: #323a39;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .iconNewNode {
    vertical-align: middle;
    transition: 0.2s all;
    margin-bottom: -4px;
  }
  .iconNewNode:hover {
    color: white;
  }
  .optionWrapper {
    margin-left: 5px;
    margin-right: 5px;
  }
  .optionInput {
    color: #95a4a2;
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
  }
  .optionInput span:last-child, .optionInput input {
    margin-top: 3px;
    width: 75px;
    background-color: #323a39;
    border-radius: 3px;
    color: white;
    border: 0;
    font-size: 0.9rem;
  }
  .unchanged span:last-child {
    color: gray;
    cursor: not-allowed;
  }
</style>