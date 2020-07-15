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

const generateFinalUIBody = function (layout) {
    let html = `<div class="o_box">
            <div class="close_pop">X Close</div>
            <div class="o_title"></div>
            <div class="co_cont"></div>
		</div>`;

    let parentdiv = document.createElement('div');
    let closeBtn = document.createElement('div');
    let title = document.createElement('p');
    title.classList.add('o_title');
    closeBtn.classList.add('close_pop');
    title.textContent = variableHelpers.getSelectedTerm;
    closeBtn.textContent = 'X Close';
    parentdiv.classList.add('o_box_wrap');
    parentdiv.appendChild(title);
    parentdiv.appendChild(closeBtn);
    parentdiv.appendChild(layout);
    document.body.insertBefore(parentdiv, document.body.firstChild);
    document.querySelector('.close_pop').addEventListener('click', function () {
        dicContainer = document.querySelectorAll('.o_box_wrap');
        console.log(dicContainer);
        removeContainer();
    });
};

const storeDefinationLayout = function (layout) {
    let cardBody = document.createElement('div');
    cardBody.classList.add('o_box');
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
    fetch(`${variableHelpers.apiUrl}${word}`)
        .then((response) => response.json())
        .then((data) => searchMeaning({ searchTerm: word, jsonData: data[0] }));
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
