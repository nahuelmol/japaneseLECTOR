var GLOBAL_URI = 'empty'

const onResponse = res => {
	console.log('res: ',res[0])
}

const UriAnalize = (uri,callback) => {
	var uri_divided = uri.split(',')
	callback(uri_divided)
}

const onCaptured = imageUri => {
	var img = decodeURIComponent(imageUri)

	GLOBAL_URI = imageUri

	if(img === imageUri){
		console.log('that is the same picture')

		UriAnalize(imageUri,onResponse)
	}else{
		console.log('the uri changes as a result of the conversion')
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

			var response = {
  				msg:'capturing'
  			}

			sendResponse(response)
  		}

  		if(data.type == 'askURI'){
  			var response = {
  				uri:GLOBAL_URI
  			}
  			sendResponse(response)
  		}
})

console.log('Hi from the background, working...')