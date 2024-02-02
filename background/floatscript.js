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


function ImageCreator (imageid, parentid, uri) {

    IMG = new Image()
    IMG.src = (uri == undefined)? 'small.jpg' : uri;
    IMG.id = imageid

    IMG.style.width = 'auto';
    IMG.style.height = '100%';

    document.getElementById(parentid).appendChild(IMG)
}

function ElementDeleter (imageid) {

    if(document.getElementById(imageid)){
        var elemento = document.getElementById(imageid);
        elemento.parentNode.removeChild(elemento)
    } 

}

const RefreshImage = async () => {

    var REQUEST = { type: 'ask_squared_image'}

    browser.runtime.sendMessage(REQUEST)
        .then(response => {
            if((response.resource.uriEdited !== 'empty') && (response.resource.uriEdited !== undefined)){                

                ElementDeleter('imageid');
                ImageCreator('imageid', 'image_displayer', response.resource.uriEdited);

            }else if(response.resource.uriEdited == 'empty'){

                ElementDeleter('imageid');
                ElementDeleter('error_capture');

                ImageCreator('error_capture', 'image_displayer', 'small.jpg');
            }
        })
        .then(() => {
        	if(document.getElementById('progress_translation')){
        		document.getElementById('progress_translation').innerHTML = '0.00%';
        	}
        })
        .catch(err => console.log(err))
}

async function ExtractText() {

    var REQUEST = { 	type: 'extract_text_FS',
        		lang: await LanguageSelected() }

    browser.runtime.sendMessage(REQUEST);
    
    CheckText()
}

async function DeleteFloatWindow () { 

    if(document.getElementById('imagelector')){
        var element = document.getElementById('imagelector')
        element.parentNode.removeChild(element)
    }

	if(document.getElementById('topwindowid')){
		var ele = document.getElementById('topwindowid');
		ele.parentNode.removeChild(ele);
	}

	if(document.getElementById('textandbuttonsid')){
		var ele = document.getElementById('textandbuttonsid');
		ele.parentNode.removeChild(ele);
	}
    return true;
}
async function LanguagesAvailables() {
	var label1 = document.createElement('label');
	var label2 = document.createElement('label');
	var label3 = document.createElement('label');

	var labels = document.createElement('div');
	labels.id = 'labelsid';

	var input1 = document.createElement('input');
	var input2 = document.createElement('input');
	var input3 = document.createElement('input');
	
	var inputdiv1 = document.createElement('div');
	var inputdiv2 = document.createElement('div');
	var inputdiv3 = document.createElement('div');
	
	inputdiv1.classList.add('indiv')
	inputdiv2.classList.add('indiv')
	inputdiv3.classList.add('indiv')

	var inputs = document.createElement('div');
	inputs.id = 'inputsid';
	var br1 = document.createElement('br');
	var br2 = document.createElement('br');
	var br3 = document.createElement('br');

	label1.id = 'l1';
	label1.setAttribute('for', 'english') ;	
	label1.textContent = 'English';
	label1.classList.add('langlabels');

	label2.id = 'l2';
	label2.setAttribute('for', 'japanese');
	label2.textContent = 'Japanese';
	label2.classList.add('langlabels');

	label3.id = 'l3';
	label3.setAttribute('for', 'german');
	label3.textContent = 'German';
	label3.classList.add('langlabels');
	
	input1.setAttribute('type', 'checkbox');
	input1.id = "english";
	input1.setAttribute('name', 'FSCheckbox');
	input1.setAttribute('value', 'English');
	input1.classList.add('floatbox');	

	input2.setAttribute('type', 'checkbox');
	input2.id = "japanese";
	input2.setAttribute('name', 'FSCheckbox');
	input2.setAttribute('value', 'Japanese');
	input2.classList.add('floatbox');

	input3.setAttribute('type','checkbox');
	input3.id = "german";
	input3.setAttribute('name','FSCheckbox');
	input3.setAttribute('value', 'German');
	input3.classList.add('floatbox');

	//var languages = document.createElement('div');
	//languages.id = 'langs';
	
	var Topwindow = document.createElement('div');
	Topwindow.id = 'topwindowid';

	Topwindow.style.width = window.innerWidth / 6 + 'px';
	Topwindow.style.height = window.innerHeight / 7 + 'px';
	Topwindow.style.top = window.innerHeight / 100 + 'px';
	Topwindow.style.right = window.innerWidth / 90 + 'px';
	
	labels.appendChild(label1);
	labels.appendChild(label2);
	labels.appendChild(label3);

	inputdiv1.appendChild(input1);
	inputdiv2.appendChild(input2);
	inputdiv3.appendChild(input3);

	inputs.appendChild(inputdiv1);
	inputs.appendChild(inputdiv2);
	inputs.appendChild(inputdiv3);

	//languages.appendChild(br1);

	Topwindow.appendChild(labels);
	Topwindow.appendChild(inputs);
	document.body.appendChild(Topwindow);
}

async function CreateFloatButtonsPlace () {

    var TextAndButtons = document.createElement('div');
    var buttonsplace = document.createElement('div');
    var textplace = document.createElement('div');

    var refresh_button = document.createElement('button');
    var extract_text_button = document.createElement('button');

    var progress = document.createElement('p');
    var textid = document.createElement('p');

    TextAndButtons.id = 'textandbuttonsid'
    progress.id = 'progress_translation';
    textid.id = 'textid';

    textplace.id = 'text_extracted';
    buttonsplace.id = 'butonsplaceid';

	TextAndButtons.style.right = window.innerWidth / 90 + 'px';
	TextAndButtons.style.top = window.innerHeight / 6 + 'px';
	TextAndButtons.style.width = window.innerWidth / 6 + 'px';
	TextAndButtons.style.height = window.innerHeight / 5 + 'px';
	
    	refresh_button.innerHTML = "Refresh Image"; 
	refresh_button.id = 'refreshid';
	refresh_button.classList.add('buttons');

    	extract_text_button.innerHTML = 'Extract Text';
	extract_text_button.classList.add('buttons');
	extract_text_button.id = 'extractid';

    refresh_button.addEventListener("click", RefreshImage);
    extract_text_button.addEventListener("click", ExtractText);

    buttonsplace.appendChild(refresh_button);
    buttonsplace.appendChild(extract_text_button);

    textplace.appendChild(progress);
    textplace.appendChild(textid);

    TextAndButtons.appendChild(buttonsplace);
    TextAndButtons.appendChild(textplace);

    document.body.appendChild(TextAndButtons);

}

async function CreateFloatWindow () {

    	var hiddenDiv = document.createElement('div');
	
	hiddenDiv.style.bottom = window.innerWidth / 90 + 'px';
	hiddenDiv.style.right = window.innerWidth / 90 + 'px';
	hiddenDiv.style.height = window.innerHeight / 2 + 'px';
	hiddenDiv.style.width = window.innerWidth / 6 + 'px';
	
    	hiddenDiv.id = 'image_displayer';
	
    	document.body.appendChild(hiddenDiv);

}

DeleteFloatWindow()
    	.then(result => {
        	if(result){
            		CreateFloatWindow();
        	}
    	})
    	.then(() => {
        	CreateFloatButtonsPlace()
    	})
	.then(() => {
		try{
			LanguagesAvailables()
		}catch(err) {
			console.log(err)
		}
	})
    	.catch(err => {
        	console.log(err)
   	})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function CheckText (){

    var REQUEST = { type: 'ask_FStext' }

    var RESET = { type:'reset_free_selection' }

    var response = await browser.runtime.sendMessage(REQUEST);

    if (response.content == 'empty'){
        if(document.getElementById('progress_translation')){
            const ele = document.getElementById('progress_translation');
            ele.innerHTML = response.progress.toFixed(2) + '%';
        }

        await sleep(500)
        return CheckText();

    } else {

        var texto = document.getElementById('textid')
        texto.innerHTML = response.content;

        const ele = document.getElementById('progress_translation');
        ele.innerHTML =  '100%';

        await browser.runtime.sendMessage(RESET);
    } 

}

function UpdateFloats(){
	const zoom_factor = window.innerWidth / window.outerWidth;
	const fixed_container = document.getElementById('image_displayer');
	
	fixed_container.style.bottom = window.innerWidth / 90 + 'px';
	fixed_container.style.right = window.innerWidth / 90 + 'px';
	fixed_container.style.height = window.innerHeight / 2 + 'px';
	fixed_container.style.width = window.innerWidth / 6 + 'px';
	
	const textandbuttons = document.getElementById('textandbuttonsid');
	textandbuttons.style.right = window.innerWidth / 90 + 'px';
	textandbuttons.style.top = window.innerHeight / 6 + 'px';
	textandbuttons.style.width = window.innerWidth / 6 + 'px';
	textandbuttons.style.height = window.innerHeight / 5 + 'px';
	
	const topwindow = document.getElementById('topwindowid');
	topwindow.style.width = window.innerWidth / 6 + 'px';
	topwindow.style.height = window.innerHeight / 7 + 'px';
	topwindow.style.top = window.innerHeight / 100 + 'px';
	topwindow.style.right = window.innerWidth / 90 + 'px';

	const thewidth = document.getElementById('topwindowid').offsetWidth;
	const theheight = document.getElementById('topwindowid').offsetHeight;

	const buttonr = document.getElementById('refreshid');
	const buttone = document.getElementById('extractid');

	buttone.style.width = (thewidth * 48 / 100) + 'px';
	buttonr.style.width = (thewidth * 48 / 100) + 'px';
	
	const inputse = document.getElementById('inputsid');
	const labelse = document.getElementById('labelsid');
	
	inputse.style.width = (thewidth * 48 / 100) + 'px';
	inputse.style.height = (theheight)+'px';

	labelse.style.width = (thewidth * 48 / 100) + 'px';
	labelse.style.height = (theheight)+'px';

	const ele = document.getElementById('l1').offsetHeight;
	const ele1 = document.getElementById('english').offsetHeight;
}

window.addEventListener('resize', UpdateFloats);

UpdateFloats();
