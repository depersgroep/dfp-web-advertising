function getValidOpts() {
	return validOpts = {
		'tag': {
			networkId: 7191,
			adUnit: 'target/target.site-%screenSize%/'
		},
		'breakpoints': [
			{
				'begin': 320,
				'end': 767,
				'name': 'small'
			}, {
				'begin': 768,
				'end': 983,
				'name': 'medium'
			}, {
				'begin': 984,
				'end': Infinity,
				'name': 'large'
			}
		],
		'callbacks': {
			'renderEnded': function(domId, isEmpty, size) {
				addClass(document.getElementById(domId), isEmpty ? 'js-is-empty' : 'js-is-not-empty');
			}
		}
	};
}

function getValidSlots(names) {
	var arrayOfSlots = new Array();
	if(Array.isArray(names)){
		for (var i = 0; i < names.length; i++) {
			 var appendSlot = {
				 'domId': names[i],
				 'sizes': {
					 'large': [[_getRandomNumber(10,1000), _getRandomNumber(10,1000)]]
				 },
				 'targeting': {
					 'pos': names[i]
				 }
			 };
			arrayOfSlots.push(appendSlot);
		}
	}else if(typeof names == 'string'){
		arrayOfSlots.push(
			{
				'domId': names,
				'sizes': {
					'large': [[_getRandomNumber(10,1000), _getRandomNumber(10,1000)]]
				},
				'targeting': {
					'pos': names
				}
			}
		);
	}

	return arrayOfSlots;
}

function getValidTargeting() {
	return validTargeting = {
		'foo': 'bar'
	};
}

function getSingleBreakpoint(name, begin, end){
	return {
		'name': name,
		'begin': begin,
		'end': end
	};
}

function _getRandomNumber(minValue, maxValue) {
	return Math.floor((Math.random() * maxValue) + minValue);
}

function getAdUnit(opts, breakpointName){
	return '/' + opts.tag.networkId + '/' + opts.tag.adUnit.replace('%screenSize%', breakpointName);
}

function getPpid(length, alphaNumeric){
	var text = "";
	var possible = "";

	if(alphaNumeric){
		possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	}else{
		possible = "%£¨*ùµ^$[]´`|@#^{}&é\"'(§è!çà)-_'";
	}

	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}



