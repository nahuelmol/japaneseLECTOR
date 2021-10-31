
function SendMessage(){

	var REQUEST = {
	      type: 'askURI',
	   }
	
	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(response => {
	   console.log('uri: ',response.uri)

	   document.getElementById('img').innerHTML = `<img src="`+ response.uri +`" width="230" height="150">`
	})
}

function Capture(){
	var REQUEST = {
	      type: 'capture',
	   }
	
	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(response => {
	   console.log('msg from back: ',response.msg)
	})
} 

document.getElementById('butt').addEventListener("click",SendMessage)
document.getElementById('capt').addEventListener("click",Capture)