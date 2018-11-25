var s;
var cursors=['default','move','pointer'];
var currentCursor=0;
  function init() {
    s = new CanvasState(document.getElementById('canvas1'));
    s.textboxes.push(new textbox("Hello",73,22,8,1));
    s.textboxes.push(new textbox("World",11,62,10,1));
    s.textboxes.push(new textbox("Click Me",11,104,80,2));
  }
