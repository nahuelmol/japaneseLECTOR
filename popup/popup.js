var IMG = ''

function updateProgress() {
	var REQUEST = { type:'check_progress'}
	var arrayData = browser.runtime.sendMessage(REQUEST);

	arrayData.then(response => {
		var numprogress = response.progress.toFixed(2); 
		document.getElementById('progress').innerHTML = numprogress;
	})

}

setInterval(updateProgress, 500)

function askText(){
	var REQUEST = { type:'ask_text'}

	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(TextObject => {
		var idiom = ''

		if(document.getElementById('text_result')){
			document.getElementById('text_result').innerHTML = TextObject.content;
		} else {
			paragraph = document.createElement('p')
			paragraph.textContent = TextObject.content;
			paragraph.classList.add("bg-secondary")
			paragraph.id = 'text_result';
			document.getElementById('texto_container').appendChild(paragraph);
		}

		console.log(TextObject.cleaned_text)

		if(TextObject.lang == 'eng'){
			idiom = 'English'
		} else if (TextObject.lang == 'jap'){
			idiom = 'Japanese'
		} else if (TextObject.lang == 'ger'){
			idiom ='German'
		}
	})
}

function LanguageSelected () {
	var boxes = document.getElementsByName('myCheckbox');
	var checkedboxes = Array.from(boxes).filter(checkbox => checkbox.checked);

	if (checkedboxes.length > 0) {
		if (checkedboxes.length == 1){
			return checkedboxes[0].value;

		} else {
			console.log('just one language should be selected')
		}
	}else {
		console.log('please, select a language')
	}
}

async function Extractor(){
    
    var REQUEST = { 
    	type: 'extract_text',
    	lang: await LanguageSelected()
		}

	function sendMessageAsync() {
        return new Promise(resolve => {
            browser.runtime.sendMessage(REQUEST, response => {
                resolve(response);
            });
        });
    }

    await sendMessageAsync();
}

function AskCapture(){

	var REQUEST = { type: 'askURI'}
	
	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(resource => {
	   
	   	if(resource.uri !== undefined){

	   		IMG = new Image()
	   		IMG.src = resource.uri
	   		IMG.id = 'img_result'
	   		IMG.style.width = '100%';
			IMG.style.height = 'auto';

	   		document.getElementById('img').appendChild(IMG)

	   	}else if(resource.uri == 'empty'){
			
			var res = document.getElementById("result")
			
			var emp_state	= document.createElement("p")
			emp_state.id 	= "emp";
			
			res.aṕpendChild(emp_state);
			
			emp_state.innerHTML = "the uri is empty, literally";

		}else if (resource.uri == undefined){
			var img = new Image()
			img.src = 'small.jpg'
			img.style.width = '100%';
			img.style.height = 'auto';
			img.id = 'error_capture'


			para = document.createElement('p')
			para.textContent = 'please, capture is needed';
			para.classList.add("text-danger")
			para.id = 'danger-capture'
			document.getElementById('img').appendChild(para)

			document.getElementById('img').appendChild(img)
			console.log('theres not URI')
		}
	})
}

function CleanScreen () {

	if(document.getElementById('img_result')){
		var elemento = document.getElementById('img_result')
		elemento.parentNode.removeChild(elemento)
	}

	if(document.getElementById('error_capture')){
		var elemento = document.getElementById('error_capture')
		elemento.parentNode.removeChild(elemento)
	}

}

function Capture(){
	var REQUEST = { type: 'capture' }
	
	if(document.getElementById('danger-capture')){
		var elemento = document.getElementById('danger-capture')
		elemento.parentNode.removeChild(elemento)
	}

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

function HideText (){

	if(document.getElementById('text_result')){
		elemento = document.getElementById('text_result')
		elemento.parentNode.removeChild(elemento)
	}
}

function ResetText (){

	var REQUEST = {
		type:'reset_text',
	}

	var arrayData = browser.runtime.sendMessage(REQUEST);

	arrayData.then(response => {
		console.log('reseted: ', response.msg)
	})

}


if(window.location.pathname === '/popup/popup.html'){
	document.getElementById('capt').addEventListener("click",Capture)

	document.getElementById('ask').addEventListener("click", AskCapture)
	document.getElementById('clean_screen').addEventListener("click", CleanScreen)
	document.getElementById('clean_capture').addEventListener("click", CleanCapture)

	document.getElementById('extractor').addEventListener("click", Extractor)
	document.getElementById('ask_text').addEventListener("click", askText)
	document.getElementById('reset_text').addEventListener("click", ResetText)
	document.getElementById('hide_text').addEventListener("click", HideText)
}


