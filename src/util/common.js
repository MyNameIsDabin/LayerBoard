function activeHorizontalScroll(dom) {
  function scrollHorizontally(e) {
      e = window.event || e;
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      dom.scrollLeft -= (delta*40); // Multiplied by 40
      e.preventDefault();
  }
  if (dom.addEventListener) {
      // IE9, Chrome, Safari, Opera
      dom.addEventListener("mousewheel", scrollHorizontally, false);
      // Firefox
      dom.addEventListener("DOMMouseScroll", scrollHorizontally, false);
  } else {
      // IE 6/7/8
      dom.attachEvent("onmousewheel", scrollHorizontally);
  }
}

function activeDragElement(dom) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  dom.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    dom.style.top = (dom.offsetTop - pos2) + "px";
    dom.style.left = (dom.offsetLeft - pos1) + "px";
  }

  function closeDragElement(e) {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export default {
    activeDragElement,
    activeHorizontalScroll
};