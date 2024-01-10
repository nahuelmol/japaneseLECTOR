
var TextObject = {
  content:'empty',
  lang:'default',
  cleaned_text:[],
  progress:0
}

var TextObjectFS = {
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

        if(data.mode == 'normal'){
          sendResponse(TextObject)
        } else if(data.mode == 'FS'){
          sendResponse(TextObjectFS)
        }

      } else if(data.type == 'reset_text'){

        TextObject.content = 'empty'
        TextObject.lang = 'default'
        TextObject.cleaned_text = []
        TextObject.progress = 0

        ResourceObject.uri = undefined

        sendResponse({msg:'TextObject cleaned'})

      } else if(data.type == 'mouseDown'){

        ProcessMouseMovement(data.position, 'start')
        var response = { msg:'tracking started' }
        sendResponse(response)

      } else if(data.type == 'mouseUp'){

        ProcessMouseMovement(data.position, 'end')
        var response = { msg:'tracking ended' }
        sendResponse(response)

      } else if(data.type == 'ask_squared_image'){
        
        sendResponse(ResourceStractedObject);

      } else if(data.type == 'activate_draw'){

        var resp = ExecuteScript()
          .then(() => {
            console.log('content.js injected successfully');
            return { msg: 'loading content' };
          })
          .catch((error) => {
            console.error('Error injecting content script:', error);
            return { msg: 'error loading content' };
          });

        sendResponse(resp);
          
      } else if(data.type == 'reset_free_selection'){

        ResourceStractedObject.uri = 'empty';
        ResourceStractedObject.uriEdited = 'empty';

        sendResponse({ msg:'reseting the free selection'})

      } else if(data.type == 'extract_text_FS'){

        TextObjectFS.lang = data.lang;
        TextExtractor(ResourceStractedObject.uriEdited, TextObjectFS);

      } else if(data.type == 'ask_FStext'){
        sendResponse(TextObjectFS)
      } else {
        sendResponse('there is not a message to process')
      }
});

console.log('Hi from the background, working...')