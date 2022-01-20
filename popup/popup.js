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

	var res = document.getElementById("result")

	var percent = document.createElement("p")
	var state   = document.createElement("p")

	percent.id = "percent"
	state.id = "state"
	res.appendChild(percent)
	res.appendChild(state)

	worker.recognize(IMG)
	.progress(function(packet){

		var state_ele = document.getElementById("state")

		if(packet.status == "loading tesseract core"){
			var msg = "loading core"

			console.log(msg)
			state_ele.innerHTML = msg
		}

		if(packet.status == "initializing tesseract"){
			var msg = "initializing"

			console.log(msg)
			state_ele.innerHTML = msg
		}

		if(packet.status == "recognizing text"){
			var msg = "recognizing text.. in progress"
			
			console.log(msg)
			state_ele.innerHTML = msg

			var num_percent = packet.progress/100

			document.getElementById("percent").innerHTML = num_percent
		}

		if(packet.status == "loading language traineddata"){
			var msg = "loading data"
			console.log(msg)

			state_ele.innerHTML = msg
		}
	})
	.then(function(data){
		console.log('text: ',data.text)

		var text = document.createElement("p")

		text.innerHTML = data.text

		res.appendChild(text)
	})

}

if(window.location.pathname === '/popup/popup.html'){
	document.getElementById('capt').addEventListener("click",Capture)
	document.getElementById('front').addEventListener("click",FrontStarter)

}else if(window.location.pathname === '/popup/front.html'){
	document.getElementById('analysis').addEventListener("click",GetMyTexts)
}

document.getElementById('butt').addEventListener("click",SendMessage)
