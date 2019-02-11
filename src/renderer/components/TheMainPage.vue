<template>
  <div class="pageWrapper">
    {{hello}}
    <main>
      <transition name="slide-fade">
      <nav v-show="IS_READY" :style="{height:boardSize.height+'px'}">
        <the-navigation-bar class="scroll"></the-navigation-bar>
      </nav>
      </transition>
      <article :style="{width:boardSize.width+'px', height:boardSize.height+'px'}">
        <tree-node class="treeNode" v-for="node in root.children" :model="node" :key="node.id"></tree-node>
        <transition name="slide-fade">
          <popup-add-node v-if="isVisible['PopupAddNode']"></popup-add-node>
        </transition>
      </article>
    </main>
    <footer>
      <div>
        <span class="selectedPos">
        [{{this.selectedNode.x}}, {{getCocosPositionY}}]
        </span>
        {{boardSize.width}} x {{boardSize.height}}
      </div>
    </footer>
  </div>
</template>

<script>
  const notifier = require("node-notifier");
  const electron = require('electron').remote;
  const fs = electron.require('fs');
  const path = require("path");
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
  import PopupAddNode from './PopupAddNode';
  import TheNavigationBar from './TheNavigationBar';
  import TreeNode from './TreeNode';
  import Sprite from '../../object/Sprite';

  export default {
    name: 'the-main-page',
    data() {
      return { 
      }
    },
    components: { PopupAddNode, TheNavigationBar, TreeNode },
    computed: {
      ...mapState({
        root: state => state.TreeNavigator.root,
        selectedNode: state=> state.TreeNavigator.selectedNode,
        selectedComponent: state=> state.TreeNavigator.selectedComponent,
        isVisible: state => state.Common.isVisible,
        boardSize: state => state.Common.boardSize
      }),
      ...mapGetters(['IS_READY']),
      getCocosPositionY() {
        return this.boardSize.height - this.selectedNode.y;
      }
    },
    methods: {
      ...mapMutations(['SET_IS_VISIBLE', 'SET_SELECTED_NODE', 'SET_BOARD_SIZE', 'SET_SELECTED_NODE_POS', 'PUSH_CHILD_NODE']),
      resizeWindow(width, height) {
        const {ipcRenderer} = require('electron');
        const navWidth = document.querySelector('nav').getBoundingClientRect().width;
        const footerHeight = document.querySelector('footer').getBoundingClientRect().height;
        const artWidth = Number(width);
        const artHeight = Number(height);
        ipcRenderer.send('resize', artWidth + navWidth, artHeight + footerHeight);
      }
    },
    mounted() {
      document.ondragover = (e) => {
        e.preventDefault();
        return false;
      };
      document.ondragleave = () => {
        return false;
      };
      document.ondragend = () => {
        return false;
      };
      document.ondrop = (e) => {
        e.preventDefault();
          
        if  (e.dataTransfer.files || e.dataTransfer.files.length > 0) {
          const file = e.dataTransfer.files[0];

          if (!file.path.endsWith('jpg') && !file.path.endsWith('png')) {
            return false;
          }

          let sprite = new Sprite();
          sprite.path = file.path;
          sprite.name = path.basename(sprite.path);
          sprite.imgBase64 = fs.readFileSync(sprite.path).toString('base64');
          
          var image = new Image();
          image.onload = ()=>{
            sprite.width = image.width;
            sprite.height = image.height;

            this.PUSH_CHILD_NODE(sprite);
            this.SET_SELECTED_NODE(sprite);
          };
          image.src = "data:image/png;base64,"+ sprite.imgBase64;
        }

        return false;
      };

      if (!this.IS_READY) {
        this.SET_SELECTED_NODE(this.root);
        this.SET_IS_VISIBLE(['PopupAddNode', true]);
        this.SET_BOARD_SIZE([this.root.width, this.root.height]);
        this.resizeWindow(this.root.width, this.root.height);
      }

      //키보드 이벤트
      document.addEventListener('keydown', (event)=>{
        if (!this.selectedNode || !this.selectedComponent || !this.root.children[0])
          return;

          //this.selectedNode.id === this.root.children[0].id

        const selectedNodePos = [this.selectedNode.x, this.selectedNode.y];
        switch(event.key){
          case "ArrowLeft" : 
            this.SET_SELECTED_NODE_POS([selectedNodePos[0]-1, selectedNodePos[1]]);
          break;
          case "ArrowUp" : 
            this.SET_SELECTED_NODE_POS([selectedNodePos[0], selectedNodePos[1]-1]);
          break;
          case "ArrowDown" : 
            this.SET_SELECTED_NODE_POS([selectedNodePos[0], selectedNodePos[1]+1]);
          break;
          case "ArrowRight" : 
            this.SET_SELECTED_NODE_POS([selectedNodePos[0]+1, selectedNodePos[1]]);
          break;
        }
         
        this.selectedComponent.style.left = (this.selectedNode.x) + "px";
        this.selectedComponent.style.top = (this.selectedNode.y) + "px"; 
      }, false);
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Nanum+Gothic');
  * {
    font-family: 'Nanum Gothic', sans-serif; 
    font-weight: bold;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html {
    overflow: hidden;
  }
  html, body, .pageWrapper {
    height: 100%;
  }
  .pageWrapper {
    display: flex;
    flex-direction: column;
  }
  html {
    background-color: #17252A;
  }
  main {
    display: flex;
    flex-grow: 1;
    height: 100%;
  }
  nav {
    flex-basis: 140px;
    flex-shrink: 0;
    max-width: 140px;
  }
  article {
    flex-grow: 1;
  }
  footer {
    flex-grow: 0;
    flex-basis : 20px;
    color: white;
    background-color : #2B7A78;
    border-bottom: 2px solid #323a39;
    text-align: right;
  }
  .treeNode {
    position: absolute;
  }
  /*=======================================
    공용 트랜지션
  ----------------------------------------*/
  .slide-fade-enter-active {
    transition: all .2s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
  .fade-enter-active {
    transition: all .2s ease;
  }
  .fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter, .slide-fade-leave-to {
    opacity: 0;
  }
  /*--------------------------------------*/
</style>
