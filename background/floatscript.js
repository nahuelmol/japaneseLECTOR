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
	
	var input1 = document.createElement('input');
	var input2 = document.createElement('input');
	var input3 = document.createElement('input');
	
	var br1 = document.createElement('br');
	var br2 = document.createElement('br');
	var br3 = document.createElement('br');

	label1.id = 'l1';
	label1.setAttribute('for', 'english') ;	
	label1.textContent = 'English';

	label2.id = 'l2';
	label2.setAttribute('for', 'japanese');
	label2.textContent = 'Japanese';

	label3.id = 'l3';
	label3.setAttribute('for', 'german');
	label3.textContent = 'German';
	
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

	var languages = document.createElement('div');
	languages.id = 'langs';
	
	var Topwindow = document.createElement('div');
	Topwindow.id = 'topwindowid';

	Topwindow.style.display = "block";
    	Topwindow.style.position = "fixed";
    	Topwindow.style.bottom = "430px";
    	Topwindow.style.right = "10px";
    	Topwindow.style.background = "#fff";
    	Topwindow.style.border = "1px solid #000";
    	Topwindow.style.zIndex = "9999";

    	Topwindow.style.width = '150px';
    	Topwindow.style.height = '60px';

	languages.appendChild(label1);
	languages.appendChild(input1);
	languages.appendChild(br1);

	languages.appendChild(label2);
	languages.appendChild(input2);
	languages.appendChild(br2);

	languages.appendChild(label3);
	languages.appendChild(input3);
	languages.appendChild(br3);

	Topwindow.appendChild(languages);
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

    TextAndButtons.style.display = "block";
    TextAndButtons.style.position = "fixed";
    TextAndButtons.style.bottom = "265px";
    TextAndButtons.style.right = "10px";
    TextAndButtons.style.background = "#fff";
    TextAndButtons.style.border = "1px solid #000";
    TextAndButtons.style.zIndex = "9999";

    TextAndButtons.style.width = '150px';
    TextAndButtons.style.height = '150px';

    refresh_button.innerHTML = "Refresh Image"; 
    refresh_button.id = "refresh_button_id"; 

    extract_text_button.innerHTML = 'Extract Text';
    extract_text_button.id = 'extract_text_button_id';


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

    hiddenDiv.id = 'image_displayer';

    hiddenDiv.style.display = "block";
    hiddenDiv.style.position = "fixed";
    hiddenDiv.style.bottom = "25px";
    hiddenDiv.style.right = "10px";
    hiddenDiv.style.background = "#fff";
    hiddenDiv.style.border = "1px solid #000";
    hiddenDiv.style.zIndex = "9999";

    hiddenDiv.style.width = '150px';
    hiddenDiv.style.height = '225px';

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

