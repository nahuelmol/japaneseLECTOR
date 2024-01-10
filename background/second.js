var ProgressObject = {
	progress:0
}

const WordInspectorNotFound = (text_array, wordToAnalize, language) => {

	var languages = ['English', 'Spanish' , 'Japanse', 'German']
	var apilanges = ['en']

	var LANGUAGE = ''

	if(languages.includes(language)){
		var index 	= languages.indexOf(language)
		LANGUAGE 	= apilanges[index]
	}else {
		LANGUAGE 	= 'en'
	}

	var apiROOT = 'https://api.dictionaryapi.dev/api/v2/entries/'
	var apiUrl = apiROOT + LANGUAGE + '/' + wordToAnalize;

	fetch(apiUrl)
  		.then(response => {
  			if (response.ok) {
            	return false;
        	} else if (response.status === 404) {

        		var index = text_array.indexOf(wordToAnalize)
				text_array.splice(index, 1);
            	return true;
        	} else {
            	return true;
        	}
  		})
  		.catch(error => {
        	console.error('Error:', error);
        	return true; 
    	});
	
}

const TakeCharactersOFF = async (text_array) => {

	const charactersToRemove = ["@",".",")","(","|","=","-","_","/","[","]"]

    text_array.forEach((single_text, index) => {
        charactersToRemove.forEach(character => {
            if (single_text.includes(character)) {

                var newText = single_text.split(character).join('');
                text_array[index] = newText;
            }
        });
    });
};

const TakeLettersOFF = async (text_array) => {

	letters1 = ['b','c','d','e','f','g','h','j','k', 'l','m','n']
	letters2 = ['o','p','q','r','s','t','u','v','w','x','y','z', '']
	letters3 = ['B', 'C', 'J', 'P']

	letters = letters1.concat(letters2).concat(letters3)

    text_array.forEach((single_text, index) => {
    	if(letters.includes(single_text)){
			var index = text_array.indexOf(single_text)
            text_array.splice(index, 1)
    	}
    });
}

const SplitingTheText = async (text_array) => {
	text_array.forEach(single_text => {

		if(single_text.includes('\n')){
			var index = text_array.indexOf(single_text)

			var firstHalf = single_text.slice(0, index);
			var aux = single_text.split('\n')
			var secondHalf = single_text.slice(index + 1);
		
			text_array = (firstHalf.concat(aux)).concat(secondHalf)
		}
	})

	console.log(text_array)

}

const LookIfWordsExists = async (text_array) => {
	for (const single_text of text_array){
		var res = await WordInspectorNotFound(text_array, single_text, TextObject.lang);

		if(res){
			var index = text_array.indexOf(single_text)
			text_array.splice(index, 1);
		}
	}
	
}

const ReplaceNumberText = async (text_array) => {

	numbers = [ '0','1','2','3','4','5','6','7','8','9']

	text_array.forEach(single_text => {
		if(numbers.includes(single_text)){
			var index = text_array.indexOf(single_text)
			text_array.splice(index, 1);
		}
	})
}

const CleanText = (TextObject) => {

	TextObject.cleaned_text = TextObject.content.split(" ");

	const ShowTextCleaned = (Obj) => {
		console.log(Obj.cleaned_text)
		Obj.content = Obj.cleaned_text.join()
	}

	const main = async () => {
		await SplitingTheText(TextObject.cleaned_text);
		await ShowTextCleaned(TextObject)

		await TakeCharactersOFF(TextObject.cleaned_text)
		await ReplaceNumberText(TextObject.cleaned_text)
		await TakeCharactersOFF(TextObject.cleaned_text)
		await ReplaceNumberText(TextObject.cleaned_text)
		await TakeLettersOFF(TextObject.cleaned_text)

		await LookIfWordsExists(TextObject.cleaned_text)

		await ShowTextCleaned(TextObject)
	}

	main();
}

const InfoLogger = (info, TextObject) => {

	if(info.status == 'recognizing text'){
		if(ProgressObject.progress == 0){
			console.log(info.status)
			ProgressObject.progress = 1;
		}
		var progress = info.progress.toFixed(3) 
		TextObject.progress = progress * 100
		console.log(info.progress)

	} else {
		console.log(info.status)
	}
}

const TextExtractor = (myURI, OBJ) =>  {

	const scriptTesseract = document.createElement('script')
	scriptTesseract.src = 'https://cdn.jsdelivr.net/npm/tesseract.js';
	document.head.appendChild(scriptTesseract);

	if(OBJ.lang == 'English'){
		OBJ.lang = 'eng'
	} else if (OBJ.lang == 'Japanese'){
		OBJ.lang = 'jpn'
	} else if (OBJ.lang == 'German'){
		OBJ.lang ='ger'
	}

	scriptTesseract.onload = function () {

		Tesseract.recognize(
			myURI, 
			OBJ.lang,
			{ 	
				logger: info => InfoLogger(info, OBJ),
				tessedit_char_blacklist: '@#$%^&*', 
			} 
		).then(({ data: { text } }) => {

			if(typeof text == 'string'){
				OBJ.content = text
			}

         });
	}
}


const ExecuteScript = () => {

  return browser.tabs.executeScript({file:'background/content.js'});
}


