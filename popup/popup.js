var IMG = ''

function SendMessage(){

	var REQUEST = {
	      type: 'askURI',
	   }
	
	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(response => {
	   
	   	if(response.uri !== undefined){

	   		IMG = new Image()
	   		IMG.src = response.uri
	   		IMG.id = 'img_result'

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

function FrontStarter(){
	window.open('front.html')
}

function GetMyTexts(){

	const worker = new Tesseract.TesseractWorker()

	worker.recognize(IMG)
	.progress(function(packet){

		if(packet.status == "loading tesseract core"){
			console.log("loading core")
		}

		if(packet.status == "initializing tesseract"){
			console.log("initializing")
		}

		if(packet.status == "recognizing text"){
			console.log("recognizing text.. in progress")
		}

		if(packet.status == "loading language traineddata"){
			console.log("loading data")
		}
	})
	.then(function(data){
		console.log('text: ',data.text)
	})

}

if(window.location.pathname === '/popup/popup.html'){
	document.getElementById('capt').addEventListener("click",Capture)
	document.getElementById('front').addEventListener("click",FrontStarter)

}else if(window.location.pathname === '/popup/front.html'){
	document.getElementById('analysis').addEventListener("click",GetMyTexts)
}

document.getElementById('butt').addEventListener("click",SendMessage)
