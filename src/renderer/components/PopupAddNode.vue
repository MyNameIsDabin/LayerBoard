<template>
  <div id="wrapper">
    <div class="title">
      <span>새 {{koreanTypeName}} 추가</span>
      <span class="iconClose" @click="SET_IS_VISIBLE(['PopupAddNode', false])">
        <icon name="times-circle"></icon>
      </span>
    </div>
    <div class="centerLayout">
      <div v-if="node.type==='Sprite'" class="inputText">
        <span> image </span>
        <span v-if="node.imgBase64 ==''" class="importImage" @click="importImage()">
          <icon name="file-image" scale="2.4"></icon>
        </span>
        <span v-else class="importImage" @click="importImage()">
          <img :src="'data:image/png;base64,'+node.imgBase64">
        </span>
      </div>
      <div v-else-if="node.type==='Label'" class="inputText">
        <span> text </span>
        <input type="text" placeholder="텍스트 입력" v-model="node.text"></input>
      </div>
      <div class="inputText">
        <span> type </span>
        <select v-model="node.type" @change="changeType(node.type)">
          <option v-for="(type, index) in getTypeList()" :key="index">
            {{type}}
          </option>
        </select>
      </div>
      <div class="inputText">
        <span> name </span>
        <input type="text" v-model="node.name"></input>
      </div>
      <div class="inputText">
        <span> width </span>
        <input type="text" v-model="node.width"></input>
      </div>
      <div class="inputText">
        <span> height </span>
        <input type="text" v-model="node.height"></input>
      </div>
      <button class="newButton" @click="addNode(node)">추가</button>
    </div>
  </div>
</template>

<script>
  const notifier = require("node-notifier");
  const electron = require('electron').remote;
  const fs = electron.require('fs');
  const path = require("path");
  const dialog = electron.dialog;

  import { mapState, mapMutations, mapGetters } from 'vuex';
  import Node from '../../object/Node';
  import Label from '../../object/Label';
  import Sprite from '../../object/Sprite';
  import config from '../../util/config';

  export default {
    name : 'popup-add-node',
    data() {
      return {
        node : new Node()
      }
    },
    computed: {
      ...mapState({
        root: state => state.TreeNavigator.root
      }),
      ...mapGetters(['IS_READY']),
      koreanTypeName() {
        switch(this.node.type) {
          case "Layer" : return '레이어';
          case "Sprite" : return '스프라이트';
          case "Label" : return '라벨';
        }
      }
    },
    methods: {
      ...mapMutations(['SET_IS_VISIBLE', 'PUSH_CHILD_NODE', 'SET_SELECTED_NODE', 'SET_BOARD_SIZE']),
      getTypeList() {
        return this.IS_READY ? ['Layer', 'Sprite', 'Label'] : ['Layer'];
      },
      resizeWindow(width, height) {
        const {ipcRenderer} = require('electron');
        const navWidth = document.querySelector('nav').getBoundingClientRect().width;
        const footerHeight = document.querySelector('footer').getBoundingClientRect().height;
        const artWidth = Number(width);
        const artHeight = Number(height);
        ipcRenderer.send('resize', artWidth + navWidth, artHeight + footerHeight);
      },
      addNode(node) {
        if (!this.IS_READY) {
          //최소 크기보다 무조건 커야함.
          if (this.isFallShort()) {
            notifier.notify({
              title: '잠깐!',
              message: `사이즈가 ${config.BOARD_MIN_SIZE.width}x${config.BOARD_MIN_SIZE.height} 보다 커야합니다.`,
              icon: path.join(__dirname, '../assets/beaver.png')
            });
            return;
          }
          this.SET_BOARD_SIZE([node.width, node.height]);
          this.resizeWindow(Number(node.width)+141, node.height);
        }
        this.PUSH_CHILD_NODE(node);
        this.SET_SELECTED_NODE(node);
        this.SET_IS_VISIBLE(['PopupAddNode', false]);
        this.resetInputNode();
      },
      resetInputNode() {
        this.node = new Node();
      },
      changeType(type) {
        if (type === "Label") {
          this.node = new Label();
        } else if (type === "Layer") {
          this.node = new Node();
        } else if (type === "Sprite") {
          this.node = new Sprite();
        }
      },
      importImage(){
        dialog.showOpenDialog({
          properties: ['openFile'], 
          filters:[{name: 'Images', extensions: ['jpg', 'png']}]}, (fileNames) => {
          if (fileNames && fileNames.length > 0) {
            if (this.node.type === 'Sprite') {
              this.node.path = fileNames[0];
              this.node.name = path.basename(this.node.path);
              this.node.imgBase64 = fs.readFileSync(this.node.path).toString('base64');

              var image = new Image();
              image.onload = ()=>{
                this.node.width = image.width;
                this.node.height = image.height;
              };
              image.src = "data:image/png;base64,"+this.node.imgBase64;
            }
          }
        });
      },
      isFallShort(){
        if (this.node.width < config.BOARD_MIN_SIZE.width 
        || this.node.height < config.BOARD_MIN_SIZE.height) {
          return true;
        }
      }
    }
  }
</script>

<style scoped>
  #wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .centerLayout {
    display:flex;
    align-items: center;
    flex-direction: column;
    background: #3AAFA9;
    color: #FEFFFF;
    padding: 10px;
    box-shadow: 0px 5px 0px 0px #2B7A78;
    transition: all 1.0s;
    z-index:100;
  }
  .centerLayout div {
    flex-grow: 1;
    margin-bottom: 5px;
  }
  .title {
    width: 190px;
    padding:3px;
    text-align: center;
    font-size: 0.9rem;
    background-color: #323a39;
    border-top: 6px solid #3AAFA9;
    color: white;
    z-index:100;
  }
  .inputText {
    width: 170px;
    display:flex;
    justify-content: space-between;
  }
  .inputText span {
    flex-basis: 70px;
  }
  .inputText input, select {
    flex-basis: 100px;
  }
  span.importImage{
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0px;
    background-color: #DEF2F1;
    color: #7cd3cf;
    flex-basis: 100px;
    height: 100px;
    transition: 0.2s all;
  }
  span.importImage:hover {
    background-color: #afe4e2;
    color: #DEF2F1;
  }
  select {
    border: 0;
  }
  input {
    text-align: left;
    background-color: white;
    color: #2B7A78;
    border: 0;
    height: 25px;
    padding-left: 4%;
    font-weight: bold;
    overflow-x: hidden;
    transition: all 1.0s;
  }
  input:hover {
    cursor: pointer;
    background-color: #DEF2F1;
  }
  .newButton {
    background-color: #323a39;
    color: white;
    border: 0;
    margin-top: 5px;
    padding: 3px;
    width: 55px;
    transition: all 0.1s ease-in-out;
  }
  .newButton:hover {
    cursor: pointer;
    background-color: #E25A68;
    color: #323a39;
    font-weight: bold;
    transform: scale(1.2);
  }
  .iconClose {
    display: block;
    position: absolute;
    margin-top: -16px;
    margin-left: 165px;
    cursor: pointer; 
    vertical-align: middle;
    transition: all 0.1s ease-in-out;
  }
  .iconClose:hover {
    color: #E25A68;
    transform: scale(1.2);
  }
  img {
    width: 90px;
    height: 90px;
  }
</style>