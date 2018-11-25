function textbox(text,x,y,length,lines)
{
  this.text=text;
  this.x=x;
  this.y=y;
  this.active=true;
  this.visible=true;
  this.length=length;
  this.lines=lines;
}

textbox.prototype.gettext = function() {
  return this.text;
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

function CanvasState(canvas) {
  var myState = this;
  var html = document.body.parentNode;
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');

  this.font= "20px Arial";
  this.fill =  '#AAAAAA';
  this.cursor=1;

  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }

  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;
  this.valid = false; // when set to false, the canvas will redraw everything
  this.blinkInterval=null;
  this.blink=false; // text input is blinking
  this.textinput=false;  // a text input is in action
  this.textbuffer="" //text input current buffer
  this.textx=12; //text input x position
  this.texty=12; //text input y position
  this.mea=0;
  this.textboxes=[];
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);

  canvas.addEventListener('mousemove', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    //Change cursor over texts
    var qttextx= myState.textboxes.length;
    var cur =false;
    for (var k=0; k<qttextx;k++)
    {
      var wi= myState.ctx.measureText(myState.textboxes[k].gettext()).width;
      var he=parseInt(myState.ctx.font.match(/\d+/), 10);
      if (
        myState.textboxes[k].active
        && myState.textboxes[k].x<mx
        && myState.textboxes[k].x  +wi>mx
        && myState.textboxes[k].y-he<my
        && myState.textboxes[k].y >my
      )
      {
        cur=true;
        break;
      }
    }
    if ( cur) {
      canvas.style.cursor=cursors[2];
    } else {
      canvas.style.cursor=cursors[0];
    }
  }, true);

  canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var qttextx= myState.textboxes.length;
    var cur =false;
    for (var k=0; k<qttextx;k++)
    {
      var wi= myState.ctx.measureText((myState.textboxes[k]).gettext(k)).width;
      var he=parseInt(myState.ctx.font.match(/\d+/), 10)-2;
      if (
        myState.textboxes[k].active
        && myState.textboxes[k].x < mx
        && myState.textboxes[k].x+wi > mx
        && myState.textboxes[k].y-he < my
        && myState.textboxes[k].y > my
      )
      {
        clearInterval(myState.blinkInterval);
        myState.textx=myState.textboxes[k].x-2;
        myState.texty=myState.textboxes[k].y-he;
        myState.textinput=true;
        myState.blink=true;
        myState.texteditingindex=k;
        myState.blinkInterval = setInterval(myState.intervalFunction, 500);
        myState.textbuffer=myState.textboxes[k].text;
        myState.mea=myState.ctx.measureText(myState.textbuffer).width;
        myState.valid=false;
        return;
      }
    }
  }, true);
  window.addEventListener('keydown',check,false);
}

function check(e) {
  e.preventDefault();
  if(s.textinput)
  {
    char = e.key
    if (char.length==1)
    {
      if (  (s.textbuffer+ char).length <= s.textboxes[s.texteditingindex].length)
      {
        s.textbuffer= s.textbuffer+ char;
        s.textboxes[s.texteditingindex].text=s.textbuffer;
      }
    }
    else {
      if (char=="Enter")
      {
        if (s.textbuffer.length>0)
        {
          s.textboxes[s.texteditingindex].text=s.textbuffer;
        }
        else {
          s.textboxes[s.texteditingindex].text="?";
        }
        s.textbuffer=""
        s.textinput=false;
        s.blink=false;
      }
      if (char=="Backspace")
      {
        s.textbuffer=s.textbuffer.substring(0, s.textbuffer.length - 1);
        s.textboxes[s.texteditingindex].text=s.textbuffer;
      }
    }
    s.mea=s.ctx.measureText(s.textbuffer).width;
    s.valid=false;
  }
}

CanvasState.prototype.drawtextcursor= function() {
  var er=this.ctx.strokeStyle;
  this.ctx.moveTo(this.textx,this.texty);
  if (this.blink)
  {
    this.ctx.strokeStyle= "black";
  }
  else
  {
    this.ctx.strokeStyle="white";
  }
  this.ctx.strokeRect(this.textx+this.mea+4,this.texty,0,20);
  this.ctx.fillStyle = "black";
  this.ctx.strokeStyle=er;
}

CanvasState.prototype.intervalFunction = function() {
  s.blink=!s.blink;
  s.valid = false;
}

CanvasState.prototype.draw = function() {
  if (!this.valid) {
    var ctx = this.ctx;
    this.clear();
    ctx.font =this.font;
    ctx.lineWidth = 1;
    ctx.strokeStyle= "black";

    ctx.fillStyle = "black";
    var tbl=  this.textboxes.length;
    for(i=0;i<tbl;i++)
    {
      if (this.textboxes[i].visible)
      {
        ctx.fillText(this.textboxes[i].text,this.textboxes[i].x,this.textboxes[i].y);
      }
    }
    if (this.textinput)
    {
      this.drawtextcursor();
    }
    this.valid = true;
  }
}

CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  return {x: mx, y: my};
}
