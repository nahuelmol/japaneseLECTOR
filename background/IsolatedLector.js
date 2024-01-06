
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

    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const width   = SquareDimension.posXend - SquareDimension.posXstart;
        const height  = SquareDimension.posYend - SquareDimension.posYstart;

        canvas.width  = width;
        canvas.height = height;

        const startX = SquareDimension.posXstart; 
        const startY = SquareDimension.posYstart;

        console.log(SquareDimension);

        ctx.drawImage(img, startX, startY, width, height, 0, 0, width, height);

        const editedImageUri = canvas.toDataURL('image/png');

        if(ResourceStractedObject.uri == editedImageUri){

        	console.log('nothing changed')

        } else {

        	console.log('they are not the same')

        	ResourceStractedObject.uriEdited = editedImageUri;
        }
        
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
                      console.log('Captured visible tab:', dataUrl);
                    })
                    .catch((error) => {
                      console.error('Error capturing visible tab:', error);
                    });

  	//capturing.then(StractCaptured, StractErrorHandler);
  
  	await CutTheImage()
  }
}


