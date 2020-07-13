const iFrame = document.createElement("iframe");
iFrame.src = chrome.extension.getURL("dictionary-ui.html");

let variableHelpers = {
	// apiUrl: chrome.runtime.getURL("dictionary.json"),
	apiUrl: "https://api.dictionaryapi.dev/api/v1/entries/en/",
	getSelectedTerm: "",
	iframePos: {
		top: null,
		right: null,
	},
};

// Get the term when user dbclicks on a text
document.addEventListener("dblclick", function (e) {
	variableHelpers.getSelectedTerm = window
		.getSelection()
		.toString()
		.toLowerCase();
	getMousePos(e);
	getMeaning(variableHelpers.getSelectedTerm);
});

const getMousePos = function (mouseEvent) {
	let mousePosTop = mouseEvent.clientX;
	let mousePosLeft = mouseEvent.clientY;
	console.log(mouseEvent);
	variableHelpers.iframePos = {
		top: mousePosTop,
		left: mousePosLeft,
	};
};

const generateUIForSunKey = function (keyData) {
	const {iframePos} = variableHelpers;
	const {subKeyName, subKeyData} = keyData;

	console.log("/========================");
	console.log(subKeyName);
	for (let i = 0; i < subKeyData.length; i++) {
		console.log(subKeyData[i].definition);
	}
	console.log("/========================");

	iFrame.style.top = `${iframePos.top}px`;
	iFrame.style.left = `${iframePos.right}px`;
	document.body.insertBefore(iFrame, document.body.firstChild);
};

// Search for the term in retunr json file
const searchMeaning = function (dataObj) {
	const {searchTerm, jsonData} = dataObj;
	// My all word segregation logic comes here!!
	console.log(jsonData);
	Object.keys(jsonData).map((key) => {
		// "meaning" obj key has all my definations
		let jsonKey = jsonData[key];
		if (key == "meaning") {
			//check for array data-type
			Object.keys(jsonKey).map((subKey) => {
				if (Array.isArray(jsonKey[subKey])) {
					generateUIForSunKey({
						subKeyName: subKey,
						subKeyData: jsonKey[subKey],
					});
				}
			});
		}
	});
};

// search for word in dictionary
const getMeaning = function (word) {
	fetch(`${variableHelpers.apiUrl}${word}`)
		.then((response) => response.json())
		.then((data) => searchMeaning({searchTerm: word, jsonData: data[0]}));
};
