// I will be the brain of your extensions
let enableExtension = false;

chrome.runtime.onInstalled.addListener(function() {
	console.log("Extension Installed");
});

// On click on extension icon trigger trigger event
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(null, {file: "contentScript.js"});
});
