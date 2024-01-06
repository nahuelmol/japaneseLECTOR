
var TextObject = {
	content:'',
	cleaned_text:[],
	lang:'English'
}

TextObject.content = "7 WN FirsT i J ) A I'LL BRING 0 DOWN YOu TWO /) FOOLS... \ ANC = - =P = LN — \ =7/ CHE L) SINCE IT APPEARS | STILL NEED TO PROVE My SUPERIORITY = OVER [a KAKAROT"

TextObject.cleaned_text = TextObject.content.split(" ")

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


	console.log(apiUrl)
	/*fetch(apiUrl)
  		.then(response => {
  			if (response.status === 403) {
            	return true;
        	} else {
        		return false;
        	}
  		})
  		.catch(error => {
        	console.error('Error:', error);
        	return true; 
    	});*/
	
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
}

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

const ShowText = async (Obj) => {
	console.log(Obj.cleaned_text)
}

const TakeCharactersOFF = async (text_array) => {

	const charactersToRemove = [".", ")", "(", "|", "=","-","_","/","["]

    text_array.forEach((single_text, index) => {
        charactersToRemove.forEach(character => {
            if (single_text.includes(character)) {

                var newText = single_text.split(character).join('');
                text_array[index] = newText;
            }
        });
    });
};


const LookIfWordsExists = async (text_array) => {
	for (const single_text of text_array){
		var res = await WordInspectorNotFound(single_text, TextObject.lang);

		if(res){
			var index = text_array.indexOf(single_text)
			text_array.splice(index, 1);
		}
	}
	
}

const TestCleaningArray = async () => {


	await SplitingTheText(TextObject.cleaned_text);

	await TakeCharactersOFF(TextObject.cleaned_text)
	await ReplaceNumberText(TextObject.cleaned_text)
	await TakeCharactersOFF(TextObject.cleaned_text)
	await ReplaceNumberText(TextObject.cleaned_text)
	await TakeLettersOFF(TextObject.cleaned_text)

	await LookIfWordsExists(TextObject.cleaned_text)

	await ShowText(TextObject);
}


