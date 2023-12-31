
var TextObject = {
  content:'empty',
  lang:'default',
  cleaned_text:[]
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

  			ResourceObject.uri == 'empty'
  			var response = { msg:'cleaning capture'}
  			sendResponse(response)

  		} else if(data.type == 'clean_screen'){

        var response = { msg: 'clean screen'}
        sendResponse(response)

      } else if(data.type == 'extract_text'){

        TextObject.lang = data.lang
        TextExtractor(ResourceObject.uri, TextObject)

      } else if(data.type == 'ask_text'){
        
        TextObject.cleaned_text = CleanText(TextObject.content)
        sendResponse(TextObject)


      }else {

        console.log('it seems like the message was not programmed')

      }

})

console.log('Hi from the background, working...')