
let isMouseDown = false;
let startPosition = { x:0, y:0 };
let endPosition = { x:0, y:0 };

var DrawingObject = {
  is:false
}

const MouseDownHandler = (event) => {
  isMouseDown = true;
  startPosition = { x:event.clientX, y:event.clientY };

  var messageINFO = browser.runtime.sendMessage({
    action: 'mouseDown',
    startPosition: startPosition
  });

  messageINFO.then(res => console.log(res))
}

const MouseUpHandler = (event) => {

  isMouseDown = false;
  endPosition = { x:event.clientX, y:event.clientY }


  var messageINFO = browser.runtime.sendMessage({
    action: 'mouseUp',
    endPosition: endPosition
  });

  messageINFO.then(res => console.log(res))

}

document.addEventListener('mousedown', MouseDownHandler);
document.addEventListener('mouseup', MouseUpHandler);



