<template>
  <div class="nodeWrapper" :class="{selected: isSelected, nullImage:model.imgBase64 ==''}" @mousedown.stop="dragMouseDown" :style="{width:model.width+'px', height:model.height+'px'}">
    <div v-if="model.type==='Sprite'" class="sprite">
      <span v-if="model.imgBase64 ==''">
      </span>
      <span v-else>
        <img :src="'data:image/png;base64,'+model.imgBase64">
      </span>
    </div>
    <div v-else-if="model.type==='Label'" class="label">
      <span>{{model.text}}</span>
    </div>
    <div v-else class="layer">
    </div>
    <tree-node class="item" v-for="model in model.children" :model="model" :key="model.id"></tree-node>
  </div>
</template>

<script>
  import Node from '../../object/Node';
  import { mapState, mapMutations } from 'vuex';
  import util from '../../util/common';

  export default {
    name : 'tree-node',
    props: {
      model: Object
    },
    data() {
      return {
        pos: [0, 0, 0, 0],

      }
    },
    computed: {
      ...mapState({
        root: state=> state.TreeNavigator.root,
        selectedNode: state=> state.TreeNavigator.selectedNode,
        selectedComponent: state=> state.TreeNavigator.selectedComponent,
      }),
      isSelected() {
        return this.model.id===this.selectedNode.id;
      }
    },
    methods: {
      ...mapMutations(['SET_SELECTED_NODE_POS', 'PUSH_CHILD_NODE', 'SET_CHILD_NODE', 'SET_IS_VISIBLE', 'SET_SELECTED_NODE', 'SET_SELECTED_COMPONENT']),
      dragMouseDown(e) {
        e.preventDefault();

        if (this.selectedComponent !== this.$el) {
          this.SET_SELECTED_NODE(this.model);
          this.SET_SELECTED_COMPONENT(this.$el);
          return;
        }

        if (this.model.id !== this.root.children[0].id) {
          this.pos[2] = e.clientX;
          this.pos[3] = e.clientY;

          document.onmouseup = (e)=>{
            document.onmouseup = null;
            document.onmousemove = null;
          };

          document.onmousemove = (e)=>{
            this.pos[0] = this.pos[2] - e.clientX;
            this.pos[1] = this.pos[3] - e.clientY;
            this.pos[2] = e.clientX;
            this.pos[3] = e.clientY;
            
            const top = Number(String(this.$el.style.top).replace("px", ""));
            const left = Number(String(this.$el.style.left).replace("px", ""));

            this.SET_SELECTED_NODE_POS([left - this.pos[0], top - this.pos[1]]);
            this.movePosition(this.selectedNode.x, this.selectedNode.y);
          }
        }
      },
      movePosition(x, y) {
        this.$el.style.left = x + "px";
        this.$el.style.top = y + "px";
      }
    },
    mounted() {
      this.SET_SELECTED_COMPONENT(this.$el);
      this.model.dom = this.$el;
    }
  }
</script>

<style scoped>
  .nodeWrapper div {
    position: absolute;
    display: inline-block;
  }
  .selected {
    outline-color: rgba(255, 255, 255, 0.3);
    outline-style: dotted;
    outline-width: 1px;
  }
  .nullImage {
    background-color: rgba(255, 90, 255, 0.2);
  }
</style>