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

                console.log('is empty')
                
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

    var REQUEST = { type: 'extract_text_FS',
        			lang: 'English' }

    browser.runtime.sendMessage(REQUEST);
    
    CheckText()
}

async function DeleteFloatWindow () { 

    if(document.getElementById('imagelector')){
        var element = document.getElementById('imagelector')
        element.parentNode.removeChild(element)
    }

    return true;
}
async function LanguagesAvailables() {
	var label1 = document.createElement('label');
	var label2 = document.createElement('label');
	var label3 = document.createElement('label');
	
	var input1 = document.createElement('input1');
	var input2 = document.createElement('input2');
	var input3 = document.createElement('input3');

	label1.id = 'l1';
	label1.setAttribute('for', 'english') ;	
	
	label2.id = 'l2';
	label2.setAttribute('for', 'japanese');

	label3.id = 'l3';
	label3.setAttribute('for', 'german');
	
	input1.setAttribute('type', 'checkbox');
	input1.id = "english";
	input1.setAttribute('name', 'FSCheckbox');
	input1.setAttribute('value', 'Japanese');

	input2.setAttribute('type', 'checkbox');
	input2.id = "japanese";
	input2.setAttribute('name', 'FSCheckbox');
	input2.setAttribute('value', 'Japanese');

	input3.setAttribute('type','checkbox');
	input3.id = "german";
	input3.setAttribute('name','FSCheckbox');
	input3.setAttribute('value', 'German');

	var languages = document.createElement('div');
	languages.id = 'langs';

	languages.style.display = "block";
    	languages.style.position = "fixed";
    	languages.style.bottom = "430px";
    	languages.style.right = "10px";
    	languages.style.background = "#fff";
    	languages.style.border = "1px solid #000";
    	languages.style.zIndex = "9999";

    	languages.style.width = '150px';
    	languages.style.height = '60px';

	languages.appendChild(label1);
	languages.appendChild(input1);

	languages.appendChild(label2);
	languages.appendChild(input2);

	languages.appendChild(label3);
	languages.appendChild(input3);

	document.body.appendChild(languages);
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

