
let isMouseDown = false;
let startPosition = { x:0, y:0 };
let endPosition = { x:0, y:0 };

var DrawingObject = {
  is:false
}

var x1, y1;
var rectangle;

const DrawRectangle = (e) => {
  if(!DrawingObject.is) return;

  var x2 = e.clientX;
  var y2 = e.clientY;

  var x1 = startPosition.x;
  var y1 = startPosition.y;

  var ancho   = x2 - x1;
  var altura  = y2 - y1;

  rectangle.style.width =  Math.abs(ancho) + 'px';
  rectangle.style.height =  Math.abs(altura) + 'px';

  rectangle.style.left = (ancho > 0) ? startPosition.x + 'px' : x2 + 'px';
  rectangle.style.top = (altura > 0) ? startPosition.y + 'px' : y2 + 'px';
}

const MouseDownHandler = (event) => {

  isMouseDown = true;
  DrawingObject.is = true;

  startPosition = { x:event.clientX, y:event.clientY };

  var messageINFO = browser.runtime.sendMessage({
    type: 'mouseDown',
    position: startPosition
  });

  messageINFO.then(res => console.log(res))

  CreateRectangle();

}

const MouseUpHandler = (event) => {

  isMouseDown = false;

  if(DrawingObject.is){
    DrawingObject.is = false;
  }

  document.getElementById('overlay').removeChild(rectangle)

  position = { x:event.clientX, y:event.clientY }


  var messageINFO = browser.runtime.sendMessage({
    type: 'mouseUp',
    position,
  });

  messageINFO.then(res => console.log(res))
}

const CreateOverlay = () => {

  var overlay = document.createElement('div');
  overlay.id = 'overlay';

  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  overlay.style.zIndex = '999';

  document.body.appendChild(overlay);
}

const CreateRectangle = () => {

  rectangle = document.createElement('div');

  rectangle.style.position = 'absolute';
  rectangle.style.left = startPosition.x + 'px';
  rectangle.style.top = startPosition.y + 'px';
  rectangle.style.border = '2px solid red';
  rectangle.style.pointerEvents = 'none';

  if(document.getElementById('overlay')){
    document.getElementById('overlay').appendChild(rectangle);
    console.log('rectangle append')
  }

}

document.addEventListener('mousedown', MouseDownHandler);
document.addEventListener('mouseup', MouseUpHandler);
document.addEventListener('mousemove', DrawRectangle);

CreateOverlay();
