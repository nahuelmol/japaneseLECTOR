


var TextObject = {
  content:'empty',
  lang:'default',
  cleaned_text:[],
  progress:0
}

var ResourceObject = {
  uri:'empty'
}

const onCaptured = imageUri => {
	var img = decodeURIComponent(imageUri)

  ResourceObject.uri = imageUri

	if(img === imageUri){
		console.log('the URI has any changes')
	}else{
		console.log('the URI changed as a result of the conversion')
	}
}

const onError = err => {
	console.log('err: ', err)
}

browser.runtime.onMessage.addListener(
  	(data, sender, sendResponse) => {

  		if(data.type == 'capture'){

  			 var capturing = browser.tabs.captureVisibleTab()
			   capturing.then(onCaptured, onError);
			   var response = { msg:'capturing' }
			   sendResponse(response)

  		} else if(data.type == 'askURI'){

  			sendResponse(ResourceObject)

  		} else if(data.type == 'clean_capture'){

  			ResourceObject.uri = undefined
  			var response = { msg:'cleaning capture'}
  			sendResponse(response)

  		} else if(data.type == 'clean_screen'){

        var response = { msg: 'clean screen'}
        sendResponse(response)

      } else if(data.type == 'extract_text'){

        TextObject.lang = data.lang
        TextExtractor(ResourceObject.uri, TextObject)

      } else if(data.type == 'ask_text'){
        
        CleanText(TextObject)
        sendResponse(TextObject)


      } else if(data.type == 'check_progress'){

        sendResponse(TextObject)

      } else if(data.type == 'reset_text'){

        TextObject.content = 'empty'
        TextObject.lang = 'default'
        TextObject.cleaned_text = []
        TextObject.progress = 0

        ResourceObject.uri = undefined

        sendResponse({msg:'TextObject cleaned'})

      } else if(data.action == 'mouseDown'){

        ProcessMouseMovement(data.startPosition, 'start')
        var response = { msg:'tracking started' }
        sendResponse(response)

      } else if(data.action == 'mouseUp'){

        ProcessMouseMovement(data.endPosition, 'end')
        var response = { msg:'tracking ended' }
        sendResponse(response)

      } else if(data.type == 'ask_squared_image'){
        
        console.log(ResourceStractedObject)
        sendResponse(ResourceStractedObject);

      } else if(data.type == 'activate_draw'){

        var resp = ExecuteScript()
          .then(() => {
            console.log('Script injected successfully');
            return { msg: 'loading content' };
          })
          .catch((error) => {
            console.error('Error injecting content script:', error);
            return { msg: 'error loading content' };
          });

        sendResponse(resp);
          
      } else {
        sendResponse('there is not a message to process')
      }
});

console.log('Hi from the background, working...')