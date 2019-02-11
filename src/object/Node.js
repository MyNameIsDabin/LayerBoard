function Node() {
  this.id = Node.prototype.__id__++;
  this.name = "레이어";
  this.type = "Layer"; //Layer or Sprite or Label
  this.width = 480;
  this.height = 600;
  this.x = 0;
  this.y = 0;
  this.dom = null;
  this.anchorX = 0.5;
  this.anchorY = 0.5;
  this.children = [];
};

Node.prototype.__id__ = 0;

module.exports = Node;