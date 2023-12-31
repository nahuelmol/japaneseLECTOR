var ProgressObject = {
	progress:0
}

async function WordInspectorNotFound(wordToAnalize){

	var apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + wordToAnalize;

	fetch(apiUrl)
  		.then(response => {
    		if (!response.ok) {
      			return true;
    		} else {
    			return false;
    		}
  		})
	
}

function CleanText (text) {

	symbols = ["@", "=", ")","(","\\", "_", "-","|","/)"]
	numbers = [ '0','1','2','3','4','5','6','7','8','9']

	var wordsArray = text.split(" ");

	wordsArray.forEach(space => {

		if(space.includes('.') || space.includes('..') || space.includes('...')){
			//dont know what to do
		}
	})

	wordsArray.forEach(space => {

		if(space.includes('\n')){
			var index = wordsArray.indexOf(space)

			var firstHalf = wordsArray.slice(0, index);
			var aux = space.split('\n')
			var secondHalf = wordsArray.slice(index + 1);
		
			wordsArray = (firstHalf.concat(aux)).concat(secondHalf)
		}
	})

	wordsArray.forEach(space => {
		if(symbols.includes(space) || numbers.includes(space)){
			var index = wordsArray.indexOf(space)
			wordsArray.splice(index, 1);
		}
	})

	wordsArray.forEach(space => {
		var res = WordInspectorNotFound(space);

		if(res){
			var index = wordsArray.indexOf(space)
			wordsArray.splice(index, 1);
		}

	})


	return wordsArray;
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
			{ 	
				logger: info => InfoLogger(info),
				tessedit_char_blacklist: '@#$%^&*', 
			} 
		).then(({ data: { text } }) => {

			if( typeof text == 'string'){
				TextObject.content = text
			}

         });

	}
}



