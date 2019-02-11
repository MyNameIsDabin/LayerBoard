<template>
  <li @click.stop="clickTreeList(model)">
    <div class="titleWrapper" @click="toggle" @mouseover="isMouseOver=true" @mouseleave="isMouseOver=false">
      <span v-if="isFolder" class="iconFolder"> 
        <icon v-if="open" name="caret-down"></icon>
        <icon v-else name="caret-right"></icon>
      </span>
      <span class="name" :class="{bold: isFolder, selected: isSelected}" @dblclick="changeType">
        <icon v-if="model.type==='Layer'" name="layer-group" scale="0.8"></icon>
        <icon v-else-if="model.type==='Sprite'" name="image" scale="0.8"></icon>
        <icon v-else="model.type==='Label'" name="font" scale="0.8"></icon>
         <span>{{model.name}}</span>
      </span>
      <span class="plus" :class="{visible:isMouseOver}" @click.stop="openPopupAddNode">
        <icon name="plus-square" class="iconPlus" scale="1.2"></icon>
      </span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <tree-item class="item" v-for="model in model.children" :model="model" :key="model.id"></tree-item>
    </ul>
  </li>
</template>

<script>
  import Node from '../../object/Node';
  import { mapState, mapMutations } from 'vuex';

  export default {
    name : 'tree-item',
    props: {
      model: Object
    },
    data() {
      return {
        open: false,
        isMouseOver : false
      }
    },
    computed: {
      ...mapState({
        selectedNode: state=> state.TreeNavigator.selectedNode
      }),
      isFolder() {
        return this.model.children && this.model.children.length;
      },
      isSelected() {
        return this.model.id===this.selectedNode.id;
      }
    },
    methods: {
      ...mapMutations(['PUSH_CHILD_NODE', 'SET_CHILD_NODE', 'SET_IS_VISIBLE', 'SET_SELECTED_NODE', 'SET_SELECTED_COMPONENT']),
      toggle() {
        if (this.isFolder) {
          this.open = !this.open;
        }
      },
      changeType() {
        // if (!this.isFolder) {
        //   this.SET_CHILD_NODE([]);
        //   this.addChild();
        //   this.open = true;
        // }
      },
      clickTreeList(model) {
        this.SET_SELECTED_NODE(model);
        
        if (model.dom)
          this.SET_SELECTED_COMPONENT(model.dom);
      },
      addChild() {
        this.PUSH_CHILD_NODE(new Node());
      },
      openPopupAddNode() {
        this.SET_IS_VISIBLE(['PopupAddNode', true]);
      }
    }
  }
</script>

<style scoped>
  .titleWrapper {
    display: flex;
    align-items: center;
  }
  li {
    cursor: pointer;
    list-style: none;
    margin-left: 10px;
    color: #95a4a2;
    width: 100%;
  }
  .iconFolder {
    margin-left: 5px;
  }
  .iconPlus:hover {
    color: white;
  }
  .plus {
    opacity: 0;
    vertical-align: middle;
    transition: 0.2s all;
  }
  .visible {
    opacity: 1;
  }
  .plus.visible {
    margin-left: 5px;
  }
  .name {
    padding-left: 5px;
    padding-right: 5px;
    transition: 0.2s all;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .name svg {
    margin-right: 5px;
  }
  .selected {
    font-size: 1.0rem;
    background-color: #95a4a2;
    color: black;
  }
</style>