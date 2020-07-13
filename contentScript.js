let variableHelpers = {
	// apiUrl: chrome.runtime.getURL("dictionary.json"),
	apiUrl: "https://api.dictionaryapi.dev/api/v1/entries/en/",
	getSelectedTerm: "",
};

// Get the term when user dbclicks on a text
document.addEventListener("dblclick", function (e) {
	variableHelpers.getSelectedTerm = window
		.getSelection()
		.toString()
		.toLowerCase();
	getMeaning(variableHelpers.getSelectedTerm);
});

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
				console.log(subKey);
				if (Array.isArray(jsonKey[subKey])) {
					for (let i = 0; i < jsonKey[subKey].length; i++) {
						console.log(jsonKey[subKey][i].definition);
					}
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
