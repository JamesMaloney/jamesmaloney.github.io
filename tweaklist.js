//aptPackage object constructor, used for repo listing
function aptPackage() {
	this.Package;
	this.Name;
}

function parsePackagesFile(packagesFile) {
	var packagesList = {};
	//Remove all carriage returns, which should not be there, anyways.
	while(packagesFile.indexOf('\r') >= 0)
		packagesFile = packagesFile.replace('\r', '');
	var packages = packagesFile.split('\n\n');
	for(var c = 0; c < packages.length; ++c) {
		var singlePackage = parsePackage(packages[c]);
		if(singlePackage == undefined)
			continue;
		packagesList[singlePackage.Package] = singlePackage;
	}
    return packagesList;
}

function parsePackage(packageString) {
	var singlePackage = new aptPackage();
	var lines = packageString.split('\n');
	for(var c = 0; c < lines.length; ++c) {
		if(lines[c].search(':') == -1)
			continue;
		//Quick and dirty.
		var components = lines[c].split(':');
		var key = components.shift();
		var value = components.join(':').trim();
		switch(key) {
			case 'Package':
				singlePackage.Package = value;
				break;
			case 'Name':
				singlePackage.Name = value;
				break;
			default:
				break;
		}
	}
	if(singlePackage.Package == undefined)
		return undefined;
	return singlePackage;
}

//Starts here
var xhr;
if(window.XMLHttpRequest)
	xhr = new XMLHttpRequest();
else if (window.ActiveXObject)
	xhr = new ActiveXObject('Microsoft.XMLHTTP');

xhr.onreadystatechange = function() {
	if (!(xhr.readyState == 4)) return;
	var packagesList = parsePackagesFile(xhr.responseText);
	if (!packagesList)
		return;
	for(key in packagesList) {
		var pack = packagesList[key];
		document.getElementById('tweaks').innerHTML += '<a href="package?id=' + pack.Package + '">'
		+ '<img class="icon" src="icons/' + pack.Package + '.png" onerror="this.src=\'icons/default.png\';" width="58" height="58">'
		+ '<div><label>' + pack.Name + '</label></div></a>';
	}
};

//iOS Device Checker
is_ios = (navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null);
if(is_ios)
	document.getElementById('idevice').innerHTML = 'Add this repo to Cydia';
else {
	document.getElementById('idevice').style.color = "red";
	document.getElementById('idevice').innerHTML = 'Only available through iDevice!';
}

xhr.open("GET","Packages");
xhr.send();