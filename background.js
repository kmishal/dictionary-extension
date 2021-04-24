// I will be the brain of your extensions
let enableExtension = false;

chrome.runtime.onInstalled.addListener(function () {
    console.log('Extension Installed');
});

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(
//         tabs[0].id,
//         { greeting: 'hello' },
//         function (response) {
//             console.log(response.farewell);
//         }
//     );
// });

// On click on extension icon trigger trigger event
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(null, { file: 'contentScript.js' });
});
