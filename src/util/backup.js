const CocosFile = require('./CocosFile');
const fs = require('fs');
const path = require('path');
const lineReader = require('line-reader');

function TreeViewCreator() {
  this.files = [];
  this.treeData = {};
  this.classes = {
    headerFile : new CocosFile(),
    sourceFile : new CocosFile()
  }
}

TreeViewCreator.prototype.updateTreeView = function () {
  this.treeData.name = "Scene";
  this.treeData.children = [];
  
  this.classes.headerFile.scenes.forEach(scene=>{
    this.treeData.children.push({
      'className' : path.basename(scene.path)
    })
  })

  console.log(this.treeData);
}

TreeViewCreator.prototype.readDirectory = function (direPath) {
  const _this = this;
  this.classes.headerFile.init();
  this.classes.sourceFile.init();

  console.log(this.classes.headerFile.scenes.length)

  this.files = fs.readdirSync(direPath, 'utf8');
  this.files.forEach(file=>{
    //프로젝트의 'Classes' 폴더에 (.cpp)와 (.h)파일이 모두 존재해야 한다.
    if (file === 'Classes') {
      const pathClasses = path.join(direPath, file); //'Classes' 폴더 경로
      const classes = fs.readdirSync(pathClasses, 'utf8');

      classes.forEach(classFile=>{
        const pathFile = path.join(pathClasses, classFile); //'.h' or '.cpp' 파일 경로
        if (isHeaderFile(classFile)) {
          lineReader.eachLine(pathFile, function(line) {
            const className = getInheritedClassName(line);
            if (className) {
              _this.classes.headerFile.push(className, pathFile);

              const cppFilePath = getChangedExtFileName(pathFile, "cpp");
              if (fs.existsSync(cppFilePath)) {
                _this.classes.sourceFile.push(className, cppFilePath);
              }

              //'Node', 'Layer', 'Scene' 을 상속하고 있는 클래스를 찾으면 더이상 라인을 읽지 않는다.
              return false;
            }
          });
        } 
      });
    }
  });

  console.log(_this.classes.headerFile)
  //this.updateTreeView();
}

function getChangedExtFileName(fileName, newExt){
  const pos = fileName.lastIndexOf(".");
  return fileName.substr(0, pos < 0 ? fileName.length : pos) + "." + newExt;
}

function isHeaderFile(fileName) {
  return fileName.endsWith('h');
}

function getInheritedClassName(line) {
  let className = null;
  if (line.startsWith('class')) {
    const pattern = /:\s+(public|private|protected)\s+/;
    const search = pattern.exec(line);

    if (search) {
      className = line.substr(search.index+search[0].length, line.length);

      //다중 상속된 클래스는 고려하지 않는다. 그러게 누가 다중 삭속하래
      if (className.indexOf(',') !== -1) {
        className = className.substr(0, className.indexOf(','));
      }
    }
  }
  return className;
}

function isSourceFile(fileName) {
  return fileName.endsWith('cpp');
}

module.exports = TreeViewCreator;