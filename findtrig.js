var elements = document.getElementsByTagName('*');

var triggers = ["9 11", "9-11", "9/11", "ableism", "abusive", "ageism", "meth", "alcoholism", "amputation", "animal abuse", "animal death", "animal violence", "bestiality", "gore", "blood", "corpse", "bully", "cannibal", "car accident", "child abuse", "childbirth", "classism", "death", "dying", "decapitation", "abuse", "drug", "heroin", "cocaine", "molly", "ecstacy", "bath salts", "eating disorder", "anorexia", "binge eating", "bulimia", "fatphobia", "forced captivity", "guns", "holocaust", "hitler", "homophobia", "hostage", "incest", "kidnap", "murder", "nazi", "needle", "overdose", "pedophilia", "prostitution", "PTSD", "racism", "racist", "rape", "rape ", "scarification", "self-harm", "self harm", "cutting", "sexism", "skeleton", "skull", "slavery", "slurs", "suicide", "suicidal", "swearing", "terminal illness", "terrorism", "torture", "transphobia", "violence", "warfare", "weapon"];

var message = "Warning: this page may contain words such as"
var found = 0;

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

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
					//end of trigger word in string
					var end = index + triggers[k].length;
					//if the next thing is a letter, then it is not a trigger word
					// i.e. "Method" will not add "Meth" to trigger words
					if(string[end] !== undefined && !isLetter(string[index + triggers[k].length])) {
						// avoid duplicates
						if(message.search(triggers[k]) === -1) {
							found++;
							message += (" " + triggers[k] + ",");
						}
					}
				}
			}
		}
	}
}

if(found > 0) {
	if(found === 1) {
		message = message.slice(0, -1);
	}
	message += " and other triggering words."
	alert(message);
}