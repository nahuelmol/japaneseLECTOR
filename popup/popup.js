var IMG = ''

function AskUri(){

	var REQUEST = { type: 'askURI'}
	
	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(response => {
	   
	   	if(response.uri !== undefined){

	   		IMG = new Image()
	   		IMG.src = response.uri
	   		IMG.id = 'img_result'

	   		document.getElementById('img').appendChild(IMG)

	   	}else if(respose.uri == 'empty'){
			
			var res = document.getElementById("result")
			
			var emp_state	= document.createElement("p")
			emp_state.id 	= "emp";
			
			res.aṕpendChild(emp_state);
			
			emp_state.innerHTML = "the uri is empty, literally";

		}else{
			console.log('theres not URI')
		}
	})
}

function CleanScreen () {
	var REQUEST = { type:'clean_screen'}

	elemento = document.getElementById('img_result')
	elemento.parentNode.removeChild(elemento)


}

function Capture(){
	var REQUEST = { type: 'capture' }
	
	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(response => {
	   console.log('msg from back: ', response.msg)
	})

} 

function CleanCapture(){
	var REQUEST = {
		type:'clean_capture',
	}

	var arrayData = browser.runtime.sendMessage(REQUEST);

	arrayData.then(response => {
		console.log('cleaning the capture', response.msg)
	})

}

function FrontStarter(){
	window.open('front.html')
}

function GettingTextFetch(){


    // Utilizando fetch para cargar el script wasm de Tesseract.js dinámicamente
    fetch('https://unpkg.com/tesseract.js-core@2.0.0-beta.10/tesseract-core.wasm.js')
      .then(response => response.text())
      .then(scriptText => {
        const blob = new Blob([scriptText], { type: 'application/javascript' });
        const scriptURL = URL.createObjectURL(blob);

        const script = document.createElement('script');
        script.src = scriptURL;
        script.onload = initializeTesseractWorker; // Llamar a la función después de cargar el script
        document.body.appendChild(script);
      })
      .catch(error => {
        console.error('Error al cargar el script wasm:', error);
      });

    function initializeTesseractWorker() {
    	console.log('initializeTesseractWorker called');

    }


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
	document.getElementById('capt').addEventListener("click",	Capture)
	//document.getElementById('clean_cap').addEventListener("click", CleanCapture)
	document.getElementById('front').addEventListener("click",FrontStarter)

}else if(window.location.pathname === '/popup/front.html'){
	document.getElementById('analysis').addEventListener("click",GettingTextFetch)
}

document.getElementById('ask').addEventListener("click", AskUri)
document.getElementById('clean_screen').addEventListener("click", CleanScreen)
