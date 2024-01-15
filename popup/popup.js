var IMG = ''

var MODE = {
	on:'normal',
	TextResult:'text_result',
	TextContainer:'texto_container'
}

var DRAWING = {
	on:false
}

function updateProgress() {
	var REQUEST = { type:'check_progress', mode: MODE.on}
	var arrayData = browser.runtime.sendMessage(REQUEST);

	arrayData.then(response => {
		var numprogress = response.progress.toFixed(2); 
		if(MODE.on == 'normal'){
			document.getElementById('progress').innerHTML = numprogress;
		} else if(MODE.on == 'FS'){
			document.getElementById('FSprogress').innerHTML = numprogress;
		}
	})

}

setInterval(updateProgress, 500)

const SetTextFromBackground = (imageid, objeto) => {
	
}

function askText(){
	var REQUEST = { type:'ask_text'};

	if(MODE.on == 'FS'){
		REQUEST.type ='ask_FStext';
		MODE.TextResult = 'FS_text_result';
		MODE.TextContainer = 'FS_texto_container';
	}

	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(objeto => {
		var idiom = ''

		if(document.getElementById(MODE.TextResult)){
			document.getElementById(MODE.TextResult).innerHTML = objeto.content;
		} else {
			paragraph = document.createElement('p')
			paragraph.textContent = objeto.content;
			paragraph.classList.add("bg-secondary")
			paragraph.id = MODE.TextResult;
			document.getElementById(MODE.TextContainer).appendChild(paragraph);
		}

		if(objeto.lang == 'eng'){
			idiom = 'English'
		} else if (objeto.lang == 'jap'){
			idiom = 'Japanese'
		} else if (objeto.lang == 'ger'){
			idiom ='German'
		}
	})
}

function LanguageSelected () {
	var boxes = document.getElementsByName('FSCheckbox');
	var checkedboxes = Array.from(boxes).filter(checkbox => checkbox.checked);

	if (checkedboxes.length > 0) {
		if (checkedboxes.length == 1){
			var language = checkedboxes[0].value;
			console.log('the language is: '+language)
			return language;

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

const ImageDeleter = (imageid) => {

	if(document.getElementById(imageid)){
		var elemento = document.getElementById(imageid);
		elemento.parentNode.removeChild(elemento)
	}

}


const ImageCreator = (imageid, parentid, uri) => {

	IMG = new Image()
	IMG.src = (uri == undefined)? 'small.jpg' : uri;
	IMG.id = imageid
	IMG.style.width = '100%';
	IMG.style.height = 'auto';

	document.getElementById(parentid).appendChild(IMG)
}



function AskCapture(){

	var REQUEST = { type: 'askURI'}
	
	var arrayData = browser.runtime.sendMessage(REQUEST);
	arrayData.then(resource => {
	   
	   	if(resource.uri !== undefined){

	   		ImageCreator('img_result', 'img', resource.uri)

	   	}else if(resource.uri == 'empty'){
			
			var res = document.getElementById("result")
			
			var emp_state	= document.createElement("p")
			emp_state.id 	= "emp";
			
			res.appendChild(emp_state);
			
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

	ImageDeleter('img_result')
	ImageDeleter('error_capture')

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


const Switcher = async () => {
	var div1 = document.getElementById("normal");
	var div2 = document.getElementById("specialized");

	if (div1.classList.contains("hidden")) {
        // show div1 and hide div2
		div1.classList.remove("hidden");
        div2.classList.add("hidden");
	} else {
        // show div2 and hide div1
        div1.classList.add("hidden");
        div2.classList.remove("hidden");
	}

	if(MODE.on == 'normal'){
		MODE.on = 'FS';
		document.getElementById('titlemode').innerHTML = 'Specialized';
	} else if(MODE.on == 'FS'){
		MODE.on = 'normal';
		document.getElementById('titlemode').innerHTML = 'Normal';
	}
}

const StartDrawing = async () => {

	var REQUEST = { type:'activate_draw'}
	var arrayData = browser.runtime.sendMessage(REQUEST);

	arrayData.then(response => {
		console.log(response.msg)
	})
}


const ResetFreeSelection = () => {
	var REQUEST = { type: 'reset_free_selection'}

	browser.runtime.sendMessage(REQUEST)
		.then(response => {

			console.log(response.msg)

		})

}

const CleanScreenFS = () => {
	ImageDeleter('img_squared2');
	ImageDeleter('error_capture_FS');
}

const TextExtractorFS = async () => {

	var REQUEST = { 
    	type: 'extract_text_FS',
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

if(window.location.pathname === '/popup/popup.html'){
	document.getElementById('capt').addEventListener("click",Capture)

	document.getElementById('ask').addEventListener("click", AskCapture)
	document.getElementById('clean_screen').addEventListener("click", CleanScreen)
	document.getElementById('clean_capture').addEventListener("click", CleanCapture)

	document.getElementById('extractor').addEventListener("click", Extractor)
	document.getElementById('ask_text').addEventListener("click", askText)
	document.getElementById('reset_text').addEventListener("click", ResetText)
	document.getElementById('hide_text').addEventListener("click", HideText)


	document.getElementById('switcher').addEventListener("click", Switcher);

	//free selection mode

	document.getElementById('start_drawing').addEventListener("click", StartDrawing);

	document.getElementById('reset_free_selection').addEventListener("click", ResetFreeSelection);
	document.getElementById('clean_screen_FS').addEventListener("click", CleanScreenFS);
	document.getElementById('extract_text_FS').addEventListener("click", TextExtractorFS);
	document.getElementById('ask_FS_text').addEventListener("click", askText);
}

/////////////////////////////////////////////////////////////////////////////////////////////
