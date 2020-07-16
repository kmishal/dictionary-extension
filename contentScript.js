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

// Get the term when user dbclicks on a text
document.addEventListener('dblclick', function (e) {
    console.log(e.target);
    removeContainer();
    variableHelpers.getSelectedTerm = window
        .getSelection()
        .toString()
        .trim()
        .toLowerCase();
    getMousePos(e);
    // add loading layout
    wrapperLayoutUi();
    getMeaning(variableHelpers.getSelectedTerm);
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
    console.log(variableHelpers);
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
                .then((response) => response.json())
                .then((data) =>
                    searchMeaning({ searchTerm: word, jsonData: data[0] })
                );
        } else {
            alert('Invalid text');
        }
    } catch (err) {
        alert('Cannot find word');
    }
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
