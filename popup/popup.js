function work(img){
	console.log('in work')

	var worker = Tesseract.createWorker()

	worker.recognize(img).then(res => {
		console.log('res: ',res.data)
	})
}

function SendMessage(){

	var REQUEST = {
	      type: 'askURI',
	   }
	
	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(response => {
	   
	   	if(response.uri !== undefined){

	   		var IMG = new Image()
	   		IMG.src = response.uri

	   		document.getElementById('img').appendChild(IMG)
	   	}
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