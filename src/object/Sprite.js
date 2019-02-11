const Node = require('./Node.js');

function Sprite() {
  Node.apply(this, arguments);
  this.path = "";
  this.imgBase64 = "";
  this.name = "스프라이트";
  this.type = "Sprite";
}

Sprite.prototype = Object.create(Node.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;