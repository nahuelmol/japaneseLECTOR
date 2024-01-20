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
			if(document.getElementById('progress')){
				document.getElementById('progress').innerHTML = numprogress;
			}
		} else if(MODE.on == 'FS'){
			if(document.getElementById('FSprogress')){
				document.getElementById('FSprogress').innerHTML = numprogress;
			}
		}
	})
}

setInterval(updateProgress, 500)

async function CreatePragraph(id, parentid, content){
	if(document.getElementById(id)){
		var paragraph = document.getElementById(id);
		paragraph.innerHTML = content;
	} else {
		var paragraph = document.createElement(id);
		paragraph.textContent = content;
		paragraph.classList.add('br-secondary');
		paragraph.id = id;
		document.getElementById(parentid).appendChild(paragraph)
		
	}
}

async function AskText(){
	var REQUEST = { type:'ask_text'};

	browser.runtime.sendMessage(REQUEST)
		.then(TextObject => {

			if(TextObject.content == 'empty'){
				console.log('askin text');
				return AskText();
			} else {
				CreatePragraph(MODE.TextResult,MODE.TextContainer,TextObject.content);
			}
		})

}

function LanguageSelected (cbox_groupname) {
	var boxes = document.getElementsByName(cbox_groupname);
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
    		lang: await LanguageSelected('normal_cbox')
		}

	function sendMessageAsync() {
	        return new Promise(resolve => {
        	    browser.runtime.sendMessage(REQUEST, response => {
                	resolve(response);
            		});
        	});
    	}

	await sendMessageAsync();

	AskText();	
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


async function AskCapture(){
	var REQUEST = { type: 'askURI'}
	
	browser.runtime.sendMessage(REQUEST)
		.then(resource => {
	   
	   	if(resource.uri == 'empty') {
		
			if(document.getElementById('imageresult')){
				var texto = document.getElementById('imageresult');
				texto.innerHTML = ' is empty' ;
			} else {
				var res = document.getElementById("result")
				var text_result	= document.createElement("p")
				text_result.id 	= "imageresult";
			
				res.appendChild(text_result);
				text_result.innerHTM = "empty";
			}
			console.log('askin');
			return AskCapture();
		}else if (resource.uri == undefined){
			ImageDeleter('error_capture');	
			ImageCreator('error_capture', 'img', undefined);
			
			if(document.getElementById('danger-capture')){
				var warn = document.getElementById('danger-capture')
				warn.innerHTML = 'please, capture is needed' ;
			} else {
				para = document.createElement('p')
				para.textContent = 'please, capture is needed';
				para.classList.add("text-danger")
				para.id = 'danger-capture'
				document.getElementById('img').appendChild(para)
				return AskCapture();
			
			}
		} else {
					
			ImageDeleter('error_capture');
			ImageDeleter('img_result');
			ImageCreator('img_result', 'img', resource.uri);

			if(document.getElementById('imageresult')){
				var result = document.getElementById('imageresult');
				result.parentNode.removeChild(result);
			} 

	
		}
	})
}

function CleanScreen () {
	ImageDeleter('img_result')
	ImageDeleter('error_capture')
}

function Capture(){
	document.getElementById('extractor').disabled = false;
	var REQUEST = { type: 'capture' }
	
	if(document.getElementById('danger-capture')){
		var elemento = document.getElementById('danger-capture')
		elemento.parentNode.removeChild(elemento)
	}

	browser.runtime.sendMessage(REQUEST)
		.then(response => {
	   		console.log('msg from back: ', response.msg)
		})
		.then(() => {
			AskCapture()
		})
		.catch(err => console.log(err));
} 

function CleanCapture(){
	var REQUEST = {
		type:'clean_capture',
	}

	browser.runtime.sendMessage(REQUEST)
		.then(response => {
			console.log('cleaning the capture', response.msg)
		})
		.catch(err => console.log(err))
	
	CleanScreen();
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
	var div2 = document.getElementById("freestyle");

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

	var REQUEST = { type: 'extract_text_FS', lang: await LanguageSelected() }

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
	document.getElementById('capt').addEventListener("click", Capture)
	document.getElementById('extractor').addEventListener("click", Extractor)


	document.getElementById('clean_capture').addEventListener("click", CleanCapture)

	document.getElementById('reset_text').addEventListener("click", ResetText)
	document.getElementById('switcher').addEventListener("click", Switcher);

	//free selection mode

	document.getElementById('start_drawing').addEventListener("click", StartDrawing);
	document.getElementById('reset_free_selection').addEventListener("click", ResetFreeSelection);
	document.getElementById('extractor').disabled = true;
}
/////////////////////////////////////////////////////////////////////////////////////////////
