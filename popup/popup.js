var IMG = ''

const work = _ =>{

	var img = document.getElementById('img_result')

	console.log('in work')

}

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
	   		work()
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




function StartAnalysis(){

	const worker = new Tesseract.TesseractWorker()

	worker.recognize(IMG)
	.progress(function(packet){
	    console.log('progress')
	})
	.then(function(data){
	    console.log('text: ', data.text)
	    console.log('lines')
	    console.log(data.lines)
	})

}



if(window.location.pathname === '/popup/popup.html'){
	document.getElementById('capt').addEventListener("click",Capture)
	document.getElementById('front').addEventListener("click",FrontStarter)

}else if(window.location.pathname === '/popup/front.html'){
	document.getElementById('analysis').addEventListener("click",StartAnalysis)
}

document.getElementById('butt').addEventListener("click",SendMessage)