
var ResourceStractedObject = {
	uri:'empty',
	uriEdited:'empty'
}

var SquareDimension = {
  posXstart:0,
  posYstart:0,

  posXend:0,
  posYend:0
}

const CutTheImage = () => {
	  const img = new Image();

    console.log('cutting');

    img.onload = function () {

        console.log('loaded')

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if((SquareDimension.posYend == SquareDimension.posXstart) || (SquareDimension.posXend == SquareDimension.posXstart)){
          return;
        }

        if(SquareDimension.posXend < SquareDimension.posXstart){

          var aux = SquareDimension.posXstart;
          SquareDimension.posXstart = SquareDimension.posXend;
          SquareDimension.posXend = aux;

        } else if(SquareDimension.posYend < SquareDimension.posYstart){

          var aux = SquareDimension.posYstart;
          SquareDimension.posYstart = SquareDimension.posYend;
          SquareDimension.posYend = aux;

        }

        console.log(SquareDimension);


        const width   = SquareDimension.posXend - SquareDimension.posXstart;
        const height  = SquareDimension.posYend - SquareDimension.posYstart;

        canvas.width  = width;
        canvas.height = height;

        const startX = SquareDimension.posXstart; 
        const startY = SquareDimension.posYstart;

        const cropX = 0
        const cropY = 0


        ctx.drawImage(img, startX, startY, width, height, 0, 0, width, height);

        const editedImageUri = canvas.toDataURL('image/png');

        ResourceStractedObject.uriEdited = editedImageUri;
    };

    img.onerror = function () {
      console.error('Error loading image');
    };

    img.src = ResourceStractedObject.uri;
}


const StractCaptured = (imageUri) => {
	var img = decodeURIComponent(imageUri)
  ResourceStractedObject.uri = imageUri

}

const StractErrorHandler = () => {
	console.log('err: ', err)
}

const ProcessMouseMovement = async (position, when) => {

  //Here, the dimension of the Square are defined
  //I take the start and the end points coordinates

  if(when == 'start'){

  	SquareDimension.posXstart = position.x 
  	SquareDimension.posYstart = position.y

  } else if(when == 'end'){
	
	  SquareDimension.posXend = position.x 
  	SquareDimension.posYend = position.y
  	
  	browser.tabs.captureVisibleTab()
          .then((dataUrl) => {
              console.log('Captured visible tab');
              ResourceStractedObject.uri = dataUrl;
              CutTheImage()
          })
          .catch((error) => {
              console.error('Error capturing visible tab');
          });
    
  }
}


