var ProgressObject = {
	progress:0
}

async function WordInspectorNotFound(wordToAnalize, language){

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
  			try {
  				if(response.ok){
  					return false
  				} else { return true }
  			} catch (err) { return true}
  		})
	
}

function CleanText (TextObject) {

	text = TextObject.content

	symbols = ["@", "=", ")","(","\\", "_", "-","|","/)"]
	numbers = [ '0','1','2','3','4','5','6','7','8','9']

	letters1 = ['b','c','d','e','f','g','h','j','k', 'l','m','n']
	letters2 = ['o','p','q','r','s','t','u','v','w','x','y','z']

	letters = letters1.concat(letters2)

	var wordsArray = text.split(" ");

	console.log(wordsArray)

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

		if(space.includes(".")){
			var nopoints = (space.match(/\./g) || []).length;
			var newspace  = space.replace(/\./g, '');

			console.log('oldword: ', space)
			console.log('newword: ', newspace)

			var index = wordsArray.indexOf(space)
			wordsArray[index] = newspace
		}

		if(space.includes('-')){

			var typo = '-'; 
			var nopoints = (space.match(/\+ typo +/g) || []).length;
			var newspace  = space.replace(/\ + typo +/g, '');

			var index = wordsArray.indexOf(space)
			wordsArray[index] = newspace

		} else if (space.includes('=')){
			var typo = '='; 
			var nopoints = (space.match(/\+ typo +/g) || []).length;
			var newspace  = space.replace(/\ + typo +/g, '');

			var index = wordsArray.indexOf(space)
			wordsArray[index] = newspace
		}

		
		if(space.includes(')')){

			var typo = ')'
			var nopoints = (space.match(/\./g) || []).length;
			var newspace  = space.replace(/\./g, '');

			var index = wordsArray.indexOf(space)
			wordsArray[index] = newspace

		} else if(space.includes('(')) {

			var typo = '('
			var nopoints = (space.match(/\ + typo + /g) || []).length;
			var newspace  = space.replace(/\ + typo + /g, '');

			var index = wordsArray.indexOf(space)
			wordsArray[index] = newspace

		}
	})

	wordsArray.forEach(space => {
		if(symbols.includes(space) || numbers.includes(space)){
			var index = wordsArray.indexOf(space)
			wordsArray.splice(index, 1);
		}
	})

	wordsArray.forEach(space => {
		if(letters.includes(space)){
			var index = wordsArray.indexOf(space)
			wordsArray.splice(index, 1);
		}
	})

	wordsArray.forEach(space => {
		var res = WordInspectorNotFound(space, TextObject.lang);

		if(res){
			var index = wordsArray.indexOf(space)
			wordsArray.splice(index, 1);
		}

	})

	var phrase = wordsArray.join()

	return phrase;
}

function InfoLogger (info, TextObject){

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
				logger: info => InfoLogger(info, TextObject),
				tessedit_char_blacklist: '@#$%^&*', 
			} 
		).then(({ data: { text } }) => {

			if( typeof text == 'string'){
				TextObject.content = text
			}

         });

	}
}



