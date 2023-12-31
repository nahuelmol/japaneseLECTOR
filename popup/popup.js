var IMG = ''

function askText(){
	var REQUEST = { type:'ask_text'}

	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(TextObject => {
		var idiom = ''
		document.getElementById('text_result').innerHTML = TextObject.content;

		console.log(TextObject.cleaned_text)

		if(TextObject.lang == 'eng'){
			idiom = 'English'
		} else if (TextObject.lang == 'jap'){
			idiom = 'Japanese'
		} else if (TextObject.lang == 'ger'){
			idiom ='German'
		}

		document.getElementById('text_desc').innerHTML = 'in ' + idiom;
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

function AskUri(){

	var REQUEST = { type: 'askURI'}
	
	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(resource => {
	   
	   	if(resource.uri !== undefined){

	   		IMG = new Image()
	   		IMG.src = resource.uri
	   		IMG.id = 'img_result'

	   		document.getElementById('img').appendChild(IMG)

	   	}else if(resource.uri == 'empty'){
			
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

	if(document.getElementById('img_result')){
		elemento = document.getElementById('img_result')
		elemento.parentNode.removeChild(elemento)
	}

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



if(window.location.pathname === '/popup/popup.html'){
	document.getElementById('capt').addEventListener("click",Capture)

	document.getElementById('ask').addEventListener("click", AskUri)
	document.getElementById('clean_screen').addEventListener("click", CleanScreen)
	document.getElementById('clean_capture').addEventListener("click", CleanCapture)

	document.getElementById('extractor').addEventListener("click", Extractor)
	document.getElementById('ask_text').addEventListener("click", askText)
}


