let dicContainer;

let variableHelpers = {
    apiUrl: 'https://api.dictionaryapi.dev/api/v1/entries/en/',
    getSelectedTerm: '',
    iframePos: {
        top: null,
        right: null,
    },
    subData: [],
};

let showDictionaryContainer = (valueToSearch) => {
    removeContainer();
    // getMousePos(e);
    // add loading layout
    wrapperLayoutUi();
    getMeaning(variableHelpers.getSelectedTerm);
};

// Get the term when user dbclicks on a text
document.addEventListener('dblclick', function (e) {
    variableHelpers.getSelectedTerm = window
        .getSelection()
        .toString()
        .trim()
        .toLowerCase();
    showDictionaryContainer(variableHelpers.getSelectedTerm);
});

const wrapperLayoutUi = function () {
    let html = `<div class="o_title">${variableHelpers.getSelectedTerm}</div>
            <div class="o_close_pop">X close</div>
            <div class="o_box">
                <p class="o_preloader">Searching...</p>
            </div>`;
    let parentdiv = document.createElement('div');
    parentdiv.classList.add('o_box_wrap');
    parentdiv.innerHTML = html;
    document.body.insertBefore(parentdiv, document.body.firstChild);
    dicContainer = document.querySelectorAll('.o_box_wrap');
    document
        .querySelector('.o_close_pop')
        .addEventListener('click', function () {
            removeContainer();
        });
};

const getMousePos = function (mouseEvent) {
    let mousePosTop = mouseEvent.clientX;
    let mousePosLeft = mouseEvent.clientY;
    console.log(mouseEvent);
    variableHelpers.iframePos = {
        top: mousePosTop,
        left: mousePosLeft,
    };
};

const generateFinalUIBody = function (layout) {
    document.querySelector('.o_preloader').remove();
    document.querySelector('.o_box').appendChild(layout);
};

const storeDefinationLayout = function (layout) {
    let cardBody = document.createElement('div');
    cardBody.classList.add('o_box_cont_wrap');
    for (let i = 0; i < layout.length; i++) {
        cardBody.appendChild(layout[i]);
    }
    generateFinalUIBody(cardBody);
};

const generateUIForSunKey = function (keyData, callBack) {
    const { iframePos } = variableHelpers;
    const { subKeyName, subKeyData } = keyData;
    let wordDefinationLayout = document.createElement('div');
    wordDefinationLayout.classList.add('sub-text');
    // create subkeyEL
    let h4El = document.createElement('h4');
    let ulEl = document.createElement('ul');
    h4El.textContent = subKeyName;
    wordDefinationLayout.appendChild(h4El);
    wordDefinationLayout.appendChild(ulEl);
    console.log(subKeyName);
    for (let i = 0; i < subKeyData.length; i++) {
        let createParaTag = document.createElement('li');
        createParaTag.textContent = subKeyData[i].definition;
        ulEl.appendChild(createParaTag);
    }
    console.log('/========================');
    variableHelpers.subData.push(wordDefinationLayout);
    // console.log(variableHelpers);
};

// Search for the term in retunr json file
const searchMeaning = function (dataObj, callBack) {
    const { searchTerm, jsonData } = dataObj;
    // My all word segregation logic comes here!!
    console.log(jsonData);
    Object.keys(jsonData).map((key) => {
        // "meaning" obj key has all my definations
        let jsonKey = jsonData[key];
        if (key == 'meaning') {
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
    console.log(variableHelpers.subData);
    storeDefinationLayout(variableHelpers.subData);
};

// search for word in dictionary
const getMeaning = function (word) {
    try {
        if (word) {
            fetch(`${variableHelpers.apiUrl}${word}`)
                .then(function (response) {
                    if (response.ok) {
                        console.log(response);
                        return response.json();
                    } else {
                        document.querySelector('.o_box').innerHTML = errorUi();
                    }
                })
                .then(function (data) {
                    console.log(data);
                    searchMeaning({ searchTerm: word, jsonData: data[0] });
                })
                .catch(function (err) {
                    document.querySelector('.o_box').innerHTML = errorUi();
                });
        } else {
            document.querySelector('.o_box').innerHTML = errorUi(
                'Please Double Click on text and not over empty spaces'
            );
        }
    } catch (err) {}
};

const removeContainer = function () {
    try {
        if (dicContainer.length > -1) {
            for (let i = 0; i < dicContainer.length; i++) {
                dicContainer[i].remove();
                console.log(dicContainer);
            }
            variableHelpers.subData = [];
            variableHelpers.searchTerm = '';
        }
    } catch (err) {
        console.log(err, 'cannot find container');
    }
};

const errorUi = function (errorText) {
    const errorMsg = errorText
        ? errorText
        : 'Something went wrong.. Please try again after some time';
    return `<p class="o_dum_text"> ${errorMsg} </p>`;
};

// Show default UI to front end
const searchBarUi = function () {
    let searchBarBody = `<form><input type="text" id="dic_serachbar_element" class="dic_serachbar_element" name="dic_serachbar_element" placeholder="Enter word and 'Hit Enter' "></form>
`;
    let searchElement = document.createElement('div');
    searchElement.classList.add('dic_searchbar_wrap');
    searchElement.innerHTML = searchBarBody;
    // Append element to body
    document.getElementsByTagName('body')[0].appendChild(searchElement);
    document
        .querySelector('.dic_searchbar_wrap form')
        .addEventListener('submit', (e) => {
            e.preventDefault();
            let searchInputValue = e.target[
                'dic_serachbar_element'
            ].value.trim();
            variableHelpers.getSelectedTerm = searchInputValue;
            // Load Ui layout cotainer
            showDictionaryContainer(variableHelpers.getSelectedTerm);
            // Empty layout input
            e.target['dic_serachbar_element'].value = '';
        });
};

searchBarUi();
