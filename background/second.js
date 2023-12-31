var ProgressObject = {
	progress:0
}

function InfoLogger (info){

	if(info.status == 'recognizing text'){
		if(ProgressObject.progress == 0){
			console.log(info.status)
			ProgressObject.progress = 1;
		}
		console.log(info.progress)

	} else {
		console.log(info.status)
	}
}

async function TextExtractor(myURI, TextObject) {

	const scriptTesseract = document.createElement('script')
	scriptTesseract.src = 'https://cdn.jsdelivr.net/npm/tesseract.js';
	document.head.appendChild(scriptTesseract);

	if(TextObject.lang == 'English'){
		TextObject.lang = 'eng'
	} else if (TextObject.lang == 'Japanese'){
		TextObject.lang = 'jap'
	} else if (TextObject.lang == 'German'){
		TextObject.lang ='ger'
	}

	scriptTesseract.onload = function () {

		Tesseract.recognize(
			myURI, 
			TextObject.lang,
			{ logger: info => InfoLogger(info) } 
		).then(({ data: { text } }) => {

			if( typeof text == 'string'){
				TextObject.content = text
			}

         });

	}
}

