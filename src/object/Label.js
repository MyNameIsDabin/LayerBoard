const Node = require('./Node.js');

function Label() {
  Node.apply(this, arguments);
  this.text = "";
  this.name = "라벨";
  this.type = "Label";
}

Label.prototype = Object.create(Node.prototype);
Label.prototype.constructor = Label;

export default Label;