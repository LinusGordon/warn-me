var triggers = ["9 11", "9-11", "9/11", "ableism", "abusive", "ageism", "meth", "alcoholism", "amputation", "animal abuse", "animal death", "animal violence", "bestiality", "gore", "corpse", "bully", "cannibal", "car accident", "child abuse", "childbirth", "classism", "death", "decapitation", "abuse", "drug", "heroin", "cocaine", "molly", "ecstacy", "bath salts", "eating disorder", "anorexia", "binge eating", "bulimia", "fatphobia", "forced captivity", "holocaust", "hitler", "homophobia", "hostage", "incest", "kidnap", "murder", "nazi", "overdose", "pedophilia", "prostitution", "PTSD", "racism", "racist", "rape", "scarification", "self-harm", "self harm", "cutting", "sexism", "slavery", "slurs", "suicide", "suicidal", "swearing", "terminal illness", "terrorism", "torture", "transphobia", "violence", "warfare"];

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

// Adds all user-added words to list of words
chrome.storage.sync.get("data", function(items) {
		if (!chrome.runtime.error) {
			var storedTrigs = items["data"];
			console.log("stored trigs", storedTrigs);
			if(storedTrigs !== undefined) {
				for(var i = triggers.length; i < storedTrigs.length; i++) {
					triggers.push(storedTrigs[i]);
				}
			}
	 	}
	});

function findtrigs() {

	var found = 0;
	var message = "Warning: this page may contain words such as";
	var elements = document.getElementsByTagName('*');

	for(var i = 0; i < elements.length; i++) {
		var element = elements[i];
		for(var j = 0; j < element.childNodes.length; j++) {
			var node = element.childNodes[j];
			if(node.nodeType === 3) {
				var string = node.nodeValue;
				string = string.toLowerCase();
				for(var k = 0; k < triggers.length; k++) {
					//find trigger word in string
					var index = string.search(triggers[k]);
					if(index !== -1) {
						var end = index + triggers[k].length;//end of trigger word in string
						//if the next thing is a letter, then it is not a trigger word
						// i.e. "Method" will not find a match with "Meth"
						if(string[end] === undefined || !isLetter(string[index + triggers[k].length])) {
							// avoid duplicates
							if(message.search(triggers[k]) === -1) {
								found++;
								message += (" " + triggers[k] + ",");
								triggers.splice(k,1); // Prevent from warning user about same word twice
							}
						}
					}
				}
			}
		}
	}
	if(found > 0) {
		// Remove comma if only one word is found
		if(found === 1) {
			message = message.slice(0, -1);
		}
		message += " and other triggering words.";
		alert(message);
	}
}

// This waits for any changes in the html such as scrolling on 
// Facebook which loads more content and finds any trigger words
// that have not been mentioned yet, if any
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
    findtrigs();
});

observer.observe(document, {
  attributes: true,
  subtree: true,
});

// Load all trigger warnings into dropdown
window.onload = function () {
    var select = document.getElementById("dropdown");
    for(var i = triggers.length - 1; i > 0; i--) {
        var option = document.createElement('option');
        option.text = option.value = triggers[i];
        select.add(option, 0);
    }
    document.getElementById("dropdown").value = "";
};

document.addEventListener('DOMContentLoaded', function() {

	findtrigs();

	function addWord() {
		var newWord = document.getElementById("myText").value;
		console.log(newWord);
		// Remove any non-letter character and lower case new Word
	    newWord = newWord.replace(/[^a-zA-Z-]/g, '').toLowerCase();
	    if(triggers.indexOf(newWord) === -1 && newWord !== "") {
	    	triggers.push(newWord);
	    	// Add word to sync storage for later use
	    	chrome.storage.sync.set({ "data" : triggers }, function() {
	    		if (chrome.runtime.error) {
	      			console.log("Runtime error.");
	    		}
  			});
	    }
	    document.getElementById("myText").value = " "; // clear dropdown

  		
	}
	document.getElementById('add-Word').onclick = addWord;
});