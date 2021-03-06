'use script';

var url_front = "http://testnaijia.herokuapp.com/";
//var url_front = "http://localhost:3000/";


var userAccount = "";
var isWorking = "";
var categoryParameter = "";
var wordDisplay = "";
var wordsReplaced = "";
var pageDictionary = {};
var vocabularyListDisplayed;
var displayID = "";
var appendContentDictionary = {};
var websiteSetting = "";

function talkToHeroku(url, params, index){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //console.log("here");
    
    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == 4 && xhr.status == 200) {
            //console.log("here?");

            var response = xhr.responseText.replace(/&quot;/g,'"');
            var obj=JSON.parse(response);
            console.log(obj);
            
            var sourceWords = [];
            var targetWords = [];
            var isTest = [];
            var pronunciation = [];
            var choices1 = [];
            var choices2 = [];
            var choices3 = [];
            var wordID = [];
            var count = 0;
            for (var x in obj) {
            	if(count >= wordsReplaced){
            		count++;
            		continue;
				}
				count++;
				sourceWords.push(x);
				targetWords.push(obj[x].chinese);
				isTest.push(obj[x].isTest);
				pageDictionary[x] = obj[x].chinese;

				if(obj[x].pronunciation !== undefined){
					pronunciation.push(obj[x].pronunciation);
				}
				else{
					pronunciation.push("/pronunciation/");
				}

				if(obj[x].wordID !== undefined){
					wordID.push(obj[x]["wordID"]);
				}
				else{
				}

				if(obj[x].isTest == 1 || obj[x].isTest == 2){
					choices1.push(obj[x]["choices"]["0"]);
					choices2.push(obj[x]["choices"]["1"]);
					choices3.push(obj[x]["choices"]["2"]);
					//console.log("other english is : "+obj[x]["choices"]["2"]);
				}
				else{
					choices1.push(" ");
					choices2.push(" ");
					choices3.push(" ");
				}
				//console.log(x+" "+obj[x]+" "+obj[x].isTest);
			}
			replaceWords(sourceWords, targetWords, isTest, pronunciation, wordID, choices1, choices2 , choices3, index);
            //document.getElementById('article').innerHTML  = obj["chinese"];
        }
        else {// Show what went wrong
            //document.getElementById('article').innerHTML  = "Something Went Wrong";
        }
    }
    xhr.send(params);
}


function replaceWords(sourceWords, targetWords, isTest, pronunciation, wordID, choices1, choices2 , choices3, i){

	//var paragraphs = document.getElementsByClassName('zn-body__paragraph');
	var paragraphs = document.getElementsByTagName('p');


	for(var j = 0;j < sourceWords.length; j++){

		var sourceWord = sourceWords[j];
		var targetWord = targetWords[j];

    	var paragraph = paragraphs[i];
    	var text = paragraph.innerHTML;

		//var id = "myID_"+sourceWord+"_"+targetWord+"_"+i.toString();
		var id = "myID_"+sourceWord+"_"+wordID[j]+"_"+i.toString()+"_"+isTest[j];

		//console.log(id);

		var popoverContent = "";
		var joinString = "";
		pronunciation[j] = pronunciation[j].replace("5","");
		if(isTest[j] == 0){

			var splitedPinyin = pronunciation[j].split(" ");
			var chineseCharactors = targetWord.replace("(","").replace(")","").split("");


    		joinString += '  <span ';
    		joinString += "id = '"+id+"'";
			joinString += 'class = "fypSpecialClass" ';
			joinString += 'style="text-decoration:underline; font-weight: bold; "';
			joinString += 'data-placement="above" ';

			joinString += 'id = "' + id + '" >';
			if(wordDisplay == 1)
				joinString += sourceWord;
			else
				joinString += targetWord;
			joinString += '</span>  ';


			var append = '<div id=\"'+ id + '_popup\" class="jfk-bubble gtx-bubble" style="visibility: visible;  opacity: 1;">';
			append += '<div class="jfk-bubble-content-id"><div id="gtx-host" style="min-width: 200px; max-width: 400px;">';
			append += '<div id="bubble-content" style="min-width: 200px; max-width: 400px;" class="gtx-content">';
			append += '<div class="content" style="border: 0px; margin: 0">';
			append += '<div id="translation" style="min-width: 200px; max-width: 400px; display: inline;">';
			append += '<div class="gtx-language">ENGLISH</div>';
			//append += '<div class="gtx-source-audio jfk-button jfk-button-flat gtx-audio-button" role="button" tabindex="0" style="-webkit-user-select: none;">';
			//append += '<div class="jfk-button-img"></div></div>';
			append += '<div class="gtx-body" style="padding-left:21px;">'+sourceWord+'</div><br>';
			append += '<div class="gtx-language">CHINESE (SIMPLIFIED)</div>';
			//append += '<div class="gtx-target-audio jfk-button jfk-button-flat gtx-audio-button" role="button" tabindex="0" style="-webkit-user-select: none;">';
			
			//append += '<div class="jfk-button jfk-button-flat gtx-audio-button" role="button" tabindex="0" style="-webkit-user-select: none; display: inline;">';
			append += '<p style = "margin: 0px;padding-left:10px;">';
			for(var k = 0; k < splitedPinyin.length; k++){
				append += '<img style="height:21px;width:21px;display:inline-block;opacity:0.55;vertical-align:middle;background-size:91%;-webkit-user-select: none;-webkit-font-smoothing: antialiased;" class="audioButton"  id="'+splitedPinyin[k]+'" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAACjSURBVDjLY2AYYmA1QwADI3FKy8HkfyA8zqBOjPL/YLqO4SWQ9YXBmbDy/1C2EMMGsBZNQsr/w/lMDCuAvKOElP+HeloQSPIxPAPynVAV/seAENHtYLoKyJpDnIb/DOZA2gBI3yRWQx6Q5gZ7nFYaQE4yJN5JW8B0PaanYaADRcMaBh5wsD7HDFZMLURGHEIL0UkDpoWExAfRQlLyJiMDDSAAALgghxq3YsGLAAAAAElFTkSuQmCC" >'
				append += chineseCharactors[k];
			}
			for(var k = 0; k < splitedPinyin.length; k++){
				append += '<audio id="myAudio_'+splitedPinyin[k]+'" style = "display: none;">'
				append += '<source src="http://www.chinese-tools.com/jdd/public/ct/pinyinaudio/'+splitedPinyin[k]+'.mp3" type="audio/mp3">';
				append += '</audio>';
			}
			append += '</p>';
			//append += '</div>';
			//append += '<a id="off" class="gtx-a" target="_blank" href="chrome-extension://aapbdbdomjkkjkaonfhkkikfgjllcleb/options.html">EXTENSION OPTIONS</a>';
			//  onclick="return myFYPOnclickFunction();"
			append += '<a id="myID_more" target="_blank" href="http://dict.youdao.com/search?q='+sourceWord+'&keyfrom=dict.index"  style="color: #A2A2A2; float: right; padding-top: 16px;">MORE »</a>';
			append += '</div></div></div></div></div>';
			//append += '<div class="jfk-bubble-closebtn-id jfk-bubble-closebtn" aria-label="Close" role="button" tabindex="0"></div>';
			append += '<div class="jfk-bubble-arrow-id jfk-bubble-arrow jfk-bubble-arrowup" style="left: 117px;">';
			append += '<div class="jfk-bubble-arrowimplbefore"></div>';
			append += '<div class="jfk-bubble-arrowimplafter"></div></div></div>';
			append += '';
			append += '';
			append += '';
			append += '';

			appendContentDictionary[id+"_popup"] = append;

    	}
    	else
    	{

    		popoverContent += "<div class = \"row\">";

			var myArrayShuffle = [1,2,3,4];
			myArrayShuffle = shuffle(myArrayShuffle);

/*			for(var k=0;k<myArrayShuffle.length;k++)
			{
				switch(myArrayShuffle[k])
				{
					case 1:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio1\" value=\""+wordID[j]+"\">";
			    		popoverContent += choices1[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 2:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio2\" value=\""+wordID[j]+"\">";
			    		popoverContent += choices2[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 3:
						popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadio3\" value=\""+wordID[j]+"\">";
			    		popoverContent += choices3[j];
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					case 4:
					    popoverContent += "<div class = \"col-xs-6\">"
			    		popoverContent += "<lable class = \"radio-inline\">";
			    		popoverContent += "<input type=\"radio\" name =\"inlineRadioOptions\" id=\"inlineRadioCorrect\" value=\""+wordID[j]+"\">";
			    		if(isTest[j] == 1)
			    			popoverContent += sourceWord;
			    		else if(isTest[j] == 2)
			    			popoverContent += targetWord;
			    		popoverContent += "</lable>";
			    		popoverContent += "</div>"
						break;
					default:
						break;
				}
				if(k==1)
				{
    				popoverContent += "</div>";
		    		popoverContent += "<div class = \"row\">";
				}
			}

    		popoverContent += "</div>";*/

			//popoverContent += "<button style = \"margin-top:10px;\" id=\""+ id + "_btn3\" class=\"btn btn-success\">Submit</button>";
			
/*	    	popoverContent += "<div id=\"alertSuccess\" class=\"alert alert-success\" role=\"alert\" style=\"display:none;margin-top:20px;\">Well done! You got the correct answer!</div>";
	    	if(isTest[j] == 2)
	    		popoverContent += "<div id=\"alertDanger\" class=\"alert alert-danger\" role=\"alert\" style=\"display:none;margin-top:20px;\">Oh snap! The answer should be \""+targetWord+"\"!</div>";
	    	else
	    		popoverContent += "<div id=\"alertDanger\" class=\"alert alert-danger\" role=\"alert\" style=\"display:none;margin-top:20px;\">Oh snap! The answer should be \""+sourceWord+"\"!</div>";
			*/
			joinString += "  <span ";
			joinString += "class = 'fypSpecialClass' ";
			joinString += "style='text-decoration:underline; font-weight: bold; ' ";
			joinString += "data-placement='above' ";
    		if(isTest[j] == 1)
				joinString += "title='Which of the following is the corresponding English word?' ";
			else
				joinString += "title='Which of the following is the corresponding Chinese word?' ";
			joinString += "href='#' ";
			//joinString += "data-content = '" + popoverContent + "'";
			joinString += "id = '" + id + "' >";
			if(isTest[j] != 2)
				joinString += targetWord;
			else
				joinString += sourceWord;
			joinString += "</span>  ";



			var append = '<div id=\"'+ id + '_popup\" class="jfk-bubble gtx-bubble" style="visibility: visible;  opacity: 1; padding-bottom: 40px; ">';
			append += '<div class="jfk-bubble-content-id"><div id="gtx-host" style="min-width: 200px; max-width: 400px;">';
			append += '<div id="bubble-content" style="min-width: 200px; max-width: 400px;" class="gtx-content">';
			//append += '<div class="content" style="border: 0px; margin: 0; padding-bottom: 0px;">';
			append += '<div id="translation" style="min-width: 200px; max-width: 400px; display: inline;">';
			append += '<div style="font-size: 80%;" class="gtx-language">Choose the most appropriate translation:</div>';
			//append += '<div class="gtx-source-audio jfk-button jfk-button-flat gtx-audio-button" role="button" tabindex="0" style="-webkit-user-select: none;">';
			//append += '<div class="jfk-button-img"></div></div>';
			//append += '<div class="gtx-body" style="padding-left:21px;">'+sourceWord+'</div><br>';

			for(var k=0;k<myArrayShuffle.length;k++)
			{
				if(k==0||k==2)
					append += '<div style="width: 100%;">';
				switch(myArrayShuffle[k])
				{
					case 1:
					append += '<div id="'+wordID[j]+'_w" align="center" class="fyp_choice_class" onMouseOver="this.style.color=\'#FF9900\'" onMouseOut="this.style.color=\'#626262\'" style="font-weight: bold; cursor:pointer; color: #626262; width: 50%; float: left; padding-top: 16px;">'+choices1[j]+'</div>';
					break;
					case 2:
					append += '<div id="'+wordID[j]+'_w" align="center" class="fyp_choice_class" onMouseOver="this.style.color=\'#FF9900\'" onMouseOut="this.style.color=\'#626262\'" style="font-weight: bold; cursor:pointer; color: #626262; width: 50%; float: left; padding-top: 16px;">'+choices2[j]+'</div>';
					break;
					case 3:
					append += '<div id="'+wordID[j]+'_w" align="center" class="fyp_choice_class" onMouseOver="this.style.color=\'#FF9900\'" onMouseOut="this.style.color=\'#626262\'" style="font-weight: bold; cursor:pointer; color: #626262; width: 50%; float: left; padding-top: 16px;">'+choices3[j]+'</div>';
					break;
					case 4:
					if(isTest[j]==1)
						append += '<div id="'+wordID[j]+'_c" align="center" class="fyp_choice_class" onMouseOver="this.style.color=\'#FF9900\'" onMouseOut="this.style.color=\'#626262\'" style="font-weight: bold; cursor:pointer; color: #626262; float: left; width: 50%; padding-top: 16px;">'+sourceWord+'</div>';
					else if(isTest[j]==2)
						append += '<div id="'+wordID[j]+'_c" align="center" class="fyp_choice_class" onMouseOver="this.style.color=\'#FF9900\'" onMouseOut="this.style.color=\'#626262\'" style="font-weight: bold; cursor:pointer; color: #626262; float: left; width: 50%; padding-top: 16px;">'+targetWord+'</div>';
					break;
					default:
					break;
				}
				if(k==1 || k==3)
    				append += "</div>";
			}


			//append += '<div class="gtx-language">CHINESE (SIMPLIFIED)</div>';
			//append += '<a id="myID_more" target="_blank" href="http://dict.youdao.com/search?q='+sourceWord+'&keyfrom=dict.index"  style="color: #A2A2A2; float: right; padding-top: 16px;">MORE »</a>';
			append += '</div></div></div></div>';
			//append += '</div>';
			//append += '<div class="jfk-bubble-closebtn-id jfk-bubble-closebtn" aria-label="Close" role="button" tabindex="0"></div>';
			append += '<div class="jfk-bubble-arrow-id jfk-bubble-arrow jfk-bubble-arrowup" style="left: 117px;">';
			append += '<div class="jfk-bubble-arrowimplbefore"></div>';
			append += '<div class="jfk-bubble-arrowimplafter"></div></div></div>';
			append += '';
			append += '';
			append += '';
			append += '';

			appendContentDictionary[id+"_popup"] = append;



    	}

/*		$(document).on("click", "#"+id+"_btn1", function() {
			var id = $(this).attr('id');
		    var englishWord = id.split('_')[1];
		    var tempWordID = id.split('_')[2];
		    console.log(tempWordID);
	    	var remembered = new HttpClient();
			remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=1'+"&url="+document.URL, function(answer) {
			    console.log("this is answer: "+answer);
			});
			$('.fypSpecialClass').popover('hide');
		});*/


		//this is the end of the test

/*		$(document).on("click", "#"+id+"_btn2", function() {
			var id = $(this).attr('id');
		    var englishWord = id.split('_')[1];
		    var tempWordID = id.split('_')[2];
		    //console.log(tempWordID);
	    	var remembered = new HttpClient();
	    	$('.fypSpecialClass').popover('hide');
			remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=0'+"&url="+document.URL, function(answer) {
			    console.log("this is answer: "+answer);
			});
			window.open("http://dict.youdao.com/search?q="+englishWord+"&keyfrom=dict.index");
		});*/

/*		$(document).on("click","#"+id+"_btn3",function(){
			var id = $(this).attr('id');
		    var englishWord = id.split('_')[1];
		    var tempWordID = id.split('_')[2];
		    //console.log(tempWordID);
			var remembered = new HttpClient();
		    remembered.get(url_front+'getExampleSentences?name='+userAccount+'&wordID='+tempWordID, function(answer) {
				var obj=JSON.parse(answer);
				console.log(obj);
				var exampleSentences = "";

				if(obj.englishSentence !== undefined && obj.chineseSentence !== undefined){
					var tempEnglishSentence = [];
					for(var key in obj.englishSentence){
						exampleSentences += "<div>"+obj.englishSentence[key]+"</div>";
						exampleSentences += "<div>"+obj.chineseSentence[key]+"</div>";
						console.log("from server: "+exampleSentences);
					}
				}
				else{
					console.log("englishSentence or chineseSentence is not defined!!!");
				}
				if(exampleSentences == ""){
					exampleSentences += "<div>Sorry. No example sentence available for this word.</div>";
					exampleSentences += "<div>You can click \"show me\" for more info.</div>";
				}
				document.getElementById('exampleSentences').innerHTML = exampleSentences;
				document.getElementById("exampleSentences").style.display="table";

			});
			//document.getElementById('exampleSentences').innerHTML = "This is a book. 是一本...";
		});*/

		//$(document).on("click", "#"+id+"_btn3", function() {
		$(document).on("click", "input[name*='inlineRadioOptions']", function() {
		//$('input:radio').change(function() {
			//alert("radio changed");
			var id = $(this).attr('id');
		    var tempWordID = $(this).attr('value').split("_")[0];
			//console.log("word = "+word+" id = "+id);
	    	var remembered = new HttpClient();
			document.getElementById("inlineRadio1").disabled = true;
			document.getElementById("inlineRadio2").disabled = true;
			document.getElementById("inlineRadio3").disabled = true;
			document.getElementById("inlineRadioCorrect").disabled = true;
	    	if(document.getElementById("inlineRadioCorrect").checked == true)
	    	{
				remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=1'+"&url="+document.URL, function(answer) {
				    console.log("select the correct answer");
				});
				document.getElementById("alertSuccess").style.display="inline-flex";
				setTimeout(function() {$('.fypSpecialClass').popover('hide')},1000);
			}
			else
			{
				remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=0'+"&url="+document.URL, function(answer) {
				    console.log("select the wrong answer");
				});
				document.getElementById("alertDanger").style.display="inline-flex";
				setTimeout(function() {$('.fypSpecialClass').popover('hide')},2500);
			}

		});
		var parts = text.split(" " + sourceWord + " ");
/*		var t = 1;

		for(var k=0; k< parts.length; k++){
			var n = occurrences(parts[k],"\"");
			if(n%2==1){
				if(t == 1){
					parts[k] = parts[k] + "\"";
					t = 2;
				}
				else{
					parts[k] = "\"" + parts[k];
					t = 1;
				}
			}
		}*/

    	//var result = parts.join(joinString);
    	var result = "";
    	if(parts.length > 1)
    	{
    		var n = occurrences(parts[0],"\"");
    		if(n%2 == 1)
    			result += parts[0] + '"' + joinString + '"';
    		else
    			result += parts[0] + joinString;
    		parts.splice(0, 1);
    	}

    	result += parts.join(" " + sourceWord + " ");

    	paragraph.innerHTML = result;
/*    	console.log("paragraph.length is: "+paragraphs.length+" and i is:"+i);
    	if(i == paragraphs.length-1 && vocabularyListDisplayed == 0){
    		vocabularyListDisplayed = 1;
    		console.log("wowowowowowowowowowowow");
    		var oneMoreParagraph = "<p></p><p></p>";
			oneMoreParagraph+="<p style='font-weight: bold;'>Words translated in this page:</p>";
			//console.log("size of the dictionary is: "+ Object.keys(pageDictionary).length);
			var key;
			for(key in pageDictionary){
				oneMoreParagraph+="<p>"+key+" : "+pageDictionary[key]+"</p>";
			}
			$(oneMoreParagraph).insertAfter(".cnn_storypgraph"+(i+2));
		}*/
	}

	//this is test on 2015/3/6
	var cumulativeOffset = function(element) {
	    var top = 0, left = 0;
	    do {
	        top += element.offsetTop  || 0;
	        left += element.offsetLeft || 0;
	        element = element.offsetParent;
	    } while(element);

	    return {
	        top: top,
	        left: left
	    };
	};

/*	$('html').click(function() {
		var myElem = document.getElementById(displayID);
		if(myElem!=null)
			document.body.removeChild(myElem);
		displayID = '';
	});*/

/*	$(document).mouseup(function (e)
	{
	    var container = $(".jfk-bubble")
	    //console.log(container[0]);
		//console.log("000   "+container[0]);
	    if(container[0] !== undefined)
	    {
	    	console.log("111   "+container[0]);
	    	if ( !container.is(e.target) && container.has(e.target).length === 0) // if the target of the click isn't the container... // ... nor a descendant of the container
		    {
		    	//console.log("222   "+container[0]);
		    	var id = container.attr('id');

		    	console.log(id);
			    var englishWord = id.split('_')[1];
			    var tempWordID = id.split('_')[2];
		    	var remembered = new HttpClient();
				remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=1'+"&url="+document.URL, function(answer) {
				    console.log("this is answer: "+answer);
				});

				document.body.removeChild(container[0]);
		    }
	    }
	});*/
	$(document).unbind().mousedown(function (e)
	{
		e = e || window.event;
  		var id = (e.target || e.srcElement).id;
  		var thisClass = (e.target || e.srcElement).className;
	    var container = $(".jfk-bubble")
	    //console.log(container[0]);
		console.log("000   "+container[0]);
		console.log("class is "+thisClass);		
	    if(container[0] !== undefined)
	    {	    	
	    	console.log("111   "+container[0]);
	    	if ( !container.is(e.target) && container.has(e.target).length === 0) // if the target of the click isn't the container... // ... nor a descendant of the container
		    {
		    	console.log("222   "+container[0]);
		    	var id = container.attr('id');
		    	console.log(id);
			    var englishWord = id.split('_')[1];
			    var tempWordID = id.split('_')[2];
			    var mainOrTest = id.split('_')[4];
		    	var remembered = new HttpClient();
		    	console.log(mainOrTest);
		    	if(mainOrTest == 0)
		    	{
		    		remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=1'+"&url="+document.URL, function(answer) {
				    	console.log("this is answer: "+answer);
					});
		    	}
				document.body.removeChild(container[0]);
		    }
	    	if(id == 'myID_more')
	    	{
	    		console.log("222   "+container[0]);

				id = container.attr('id');

				console.log(id);
				var englishWord = id.split('_')[1];
				var tempWordID = id.split('_')[2];
				var remembered = new HttpClient();
				remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=0'+"&url="+document.URL, function(answer) {
				    console.log("this is answer: "+answer);
				});
	    	}
	    	if(thisClass == 'audioButton')
	    	{
				console.log("clicked id is "+id);
				var myAudio = document.getElementById("myAudio_"+id);
				if (myAudio.paused) {
					//console.log("find this element and it is paused");
					myAudio.play();
				} else {
					myAudio.pause();
				}
	    	}
	    	if(thisClass == 'fyp_choice_class')
	    	{
	    		console.log("clicked id isis "+id);
	    		var tempWordID = id.split("_")[0];
	    		var isCorrect = id.split("_")[1];
	    		var remembered = new HttpClient();
	    		if(isCorrect == 'c')
	    		{
					remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=1'+"&url="+document.URL, function(answer) {
					    console.log("select the correct answer");
					});
					$('.jfk-bubble').css("background-image", "url('https://lh4.googleusercontent.com/-RrJfb16vV84/VSvvkrrgAjI/AAAAAAAACCw/K3FWeamIb8U/w725-h525-no/fyp-correct.jpg')");				
					$('.jfk-bubble').css("background-size", "cover");

					$('.content').css("background-color", "#cafffb");
	    		}
	    		else
	    		{
	    			remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=0'+"&url="+document.URL, function(answer) {
					    console.log("select the wrong answer");
					});
					$('.jfk-bubble').css("background-image", "url('https://lh6.googleusercontent.com/--PJRQ0mlPes/VSv52jGjlUI/AAAAAAAACDU/dU3ehfK8Dq8/w725-h525-no/fyp-wrong.jpg')");				
					$('.jfk-bubble').css("background-size", "cover");
	    		}

	    	}
	    }
	});


/*	$(".gtx-a").click(function(event){
		var container = $(".jfk-bubble")
		console.log("000   "+container[0]);
	    if(container[0] !== undefined)
	    {
	    	console.log("111   "+container[0]);
			var id = container.attr('id');

			console.log(id);
			var englishWord = id.split('_')[1];
			var tempWordID = id.split('_')[2];
			var remembered = new HttpClient();
			remembered.get(url_front+'remember?name='+userAccount+'&wordID='+tempWordID+'&isRemembered=0'+"&url="+document.URL, function(answer) {
			    console.log("this is answer: "+answer);
			});

			document.body.removeChild(container[0]);
	    }
	});*/

	$(".fypSpecialClass").unbind().click(function(event) {
		
		//event.stopPropagation();

		var id = $(this).attr('id');

		var element = document.getElementById(id);
		var rect = cumulativeOffset(element);
		console.log(event.pageX+' '+event.pageY+' '+rect.left+' '+rect.top);
		displayID = id+"_popup";
		var myElem = document.getElementById(displayID);
		if(myElem!=null)
			document.body.removeChild(myElem);
		
		//document.body.innerHTML += appendContentDictionary[id+"_popup"];
		//console.log(appendContentDictionary);
		//console.log(id);
		//console.log(appendContentDictionary[id+"_popup"]);
		
		$("body").append(appendContentDictionary[id+"_popup"]);
		document.getElementById(id+"_popup").style.left = (rect.left-100)+'px';
		document.getElementById(id+"_popup").style.top = (rect.top+30)+'px';
		//left: '+(rect.left-100)+'px; top: '+(rect.top+30)+'px;
	});

	//$('.fypSpecialClass').popover({ html : true, placement : 'bottom', trigger: 'click hover', delay: {show: 300, hide: 300}});

	$('.fypSpecialClass').mouseover(function(){
		$(this).css("color","#FF9900");
		$(this).css("cursor","pointer");
	});
	$('.fypSpecialClass').mouseout(function(){
		$(this).css("color","black");
	});
}




window.addEventListener("load", function(){
	vocabularyListDisplayed = 0;
    chrome.storage.sync.get(null, function(result){

    	var allKeys = Object.keys(result);
    	console.log(allKeys);

    	userAccount = result.userAccount;
    	isWorking = result.isWorking;
    	wordDisplay = result.wordDisplay;
    	wordsReplaced = result.wordsReplaced;
    	websiteSetting = result.websiteSetting;

    	console.log("user acc: "+ result.userAccount);
    	console.log("user isWorking: "+ result.isWorking);
    	console.log("user wordDisplay: "+ result.wordDisplay);
    	console.log("user wordsReplaced: "+ result.wordsReplaced);
    	console.log("user websiteSetting: "+ result.websiteSetting);

		if (userAccount == undefined){
			var d = new Date();
			userAccount = "id"+d.getTime()+"_1";
			chrome.storage.sync.set({'userAccount': userAccount});
		}
		
		if(isWorking == undefined)
		{
			isWorking = 0;
			chrome.storage.sync.set({'isWorking': isWorking});
		}

		if(wordDisplay == undefined){
			wordDisplay = 0;
			chrome.storage.sync.set({'wordDisplay': wordDisplay});
		}

		if(wordsReplaced == undefined){
			wordsReplaced = 0;
			chrome.storage.sync.set({'wordsReplaced': wordsReplaced});
		}

		if(websiteSetting == undefined){
			websiteSetting = "";
			chrome.storage.sync.set({'websiteSetting': websiteSetting});
		}

		var remembered = new HttpClient();
		//http://testnaijia.herokuapp.com/getIfTranslate?name='+userAccoun
/*		remembered.get(url_front+'getIfTranslate?name='+userAccount, function(answer) {

            var obj=JSON.parse(answer);

            if(obj.if_translate!==undefined){
            	if(obj.if_translate=='1')
            		isWorking = 1;
            	else
           			isWorking = 0;
            }*/

        var websiteCheck = 0;
		var splitedWebsite = websiteSetting.split("_");

		for(var k = 0; k < splitedWebsite.length; k++){
			if(document.URL.indexOf(splitedWebsite[k]) !== -1 && websiteSetting !== "")
				websiteCheck = 1;
		} 9

		if(websiteSetting.indexOf('all')!==-1)
			websiteCheck = 1;
		console.log("isWorking "+isWorking + " websiteCheck "+websiteCheck);
        if(isWorking == 1 && websiteCheck == 1)
        {
			//var paragraphs = document.getElementsByClassName('zn-body__paragraph');	
			var paragraphs = document.getElementsByTagName('p');

			for (var i = 0; i < paragraphs.length; i++) {
				//console.log("length of the paragraphs is : "+paragraphs.length);
				var sourceWords = [];
				var targetWords = [];

				var stringToServer = paragraphs[i];
				stringToServer = stringToServer.innerHTML;

			    var url = url_front+'show';
			    var params = "text="+stringToServer+"&url="+document.URL+"&name="+userAccount;
			    //console.log(params);
			    talkToHeroku(url, params, i);
			}
			
/*			$(document).on("click", ".audioButton", function() {
				var id = $(this).attr('id');
				console.log("clicked id is "+id);
				var myAudio = document.getElementById("myAudio_"+id);
				if (myAudio.paused) {
					//console.log("find this element and it is paused");
					myAudio.play();
				} else {
					myAudio.pause();
				}
	  		});*/

		}

		//});
	});
});


var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }	
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function occurrences(string, substring) {
	var n = 0;
	var pos = 0;
	var l = substring.length;

	while (true) {
		pos = string.indexOf(substring, pos);
		if (pos > -1) {
			n++;
			pos += l;
		} else {
			break;
		}
	}
	return (n);
}
