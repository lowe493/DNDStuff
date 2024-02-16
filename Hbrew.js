// ==UserScript==
// @name         Homebrew additional features
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds additional features to DND Beyond
// @author       You
// @match        https://www.dndbeyond.com/characters/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @grant        none
// ==/UserScript==

(function() {
    // Define server address
    const serverAddress = 'https://lowe493.pythonanywhere.com';

    // Function to append HTML after an element
    function appendHtmlAfterElement(html, targetSelector) {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            const div = document.createElement('div');
            div.innerHTML = html.trim();
            targetElement.parentNode.insertBefore(div.firstChild, targetElement.nextSibling);
        }
    }

    // Function to append CSS style to the head of the document
    function appendStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // HTML content to be appended
    const htmlContent = `
    <div class="groupinsp">
        <div id ="grouptext">Group Inspiration - 0</div>
        <div class="groupinsp_button_holder">
            <span class="groupinsp_button" onclick=Add()>+</span>
            <span class="groupinsp_button" onclick=Use()>-</span>
        </div>
    </div>
    `;

    // CSS styles to be applied
    const cssStyles = `
    .groupinsp {
        align-items: center;
        border: 1px solid yellow;
        border-radius: 3px;
        display: flex;
        font-family: Roboto Condensed,Roboto,Helvetica,sans-serif;
        font-weight: 700;
        margin-right: 20px;
        padding: 5px 5px 4px;
        text-transform: uppercase;
        white-space: nowrap;
    }

    .groupinsp_button_holder {
        display: flex;
        padding-left: 10px;
    }

    .groupinsp_button {
        align-items: center;
        border: 1px solid yellow;
        border-radius: 3px;
        cursor: pointer;
        font-family: Roboto Condensed,Roboto,Helvetica,sans-serif;
        font-weight: 700;
        font-size: 14px;
        padding: 0px 10px 0px;
        margin-left: 5px;
        text-transform: uppercase;
        white-space: nowrap;
        flex-direction: column-reverse;
        flex-wrap: nowrap;
    }
    `;

// JavaScript code to be appended
const jsCode = `
const groupInspDiv = document.getElementById('grouptext');

function getGroupInspData() {
    $.get("${serverAddress}/groupinsp", function(data, status) {
        // console.log("Getting current Group Inspiration");
        // console.log("Data:", data); // Print the response data to the console
        // console.log("Status:", status); // Print the status of the request to the console

        // Update the value of 'insp' after receiving data
        insp = data;
        groupInspDiv.textContent = \`Group Inspiration - \${insp}\`;
    });
}

function Add(){
    insp++;
    updateGroupInsp(insp);
}

function Use(){
    if (insp > 0) {
        insp -= 1;
        updateGroupInsp(insp);
    }
}

function updateGroupInsp(value) {
    $.get("${serverAddress}/groupinsp", { number: value }, function(data, status) {
        // console.log("Updating Group Inspiration to", value);
        // console.log("Data:", data); // Print the response data to the console
        // console.log("Status:", status); // Print the status of the request to the console

        // Update the UI with the new value
        groupInspDiv.textContent = \`Group Inspiration - \${value}\`;
    });
}

// Call the function to fetch group inspiration data
getGroupInspData();

// Update group inspiration every 10 seconds
setInterval(getGroupInspData, 10000);
`;





    // Dynamically create and append jQuery script tag
    const jQueryScript = document.createElement('script');
    jQueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.2/jquery.min.js';
    jQueryScript.integrity = 'sha512-tWHlutFnuG0C6nQRlpvrEhE4QpkG1nn2MOUMWmUeRePl4e3Aki0VB6W1v3oLjFtd0hVOtRQ9PHpSfN6u6/QXkQ==';
    jQueryScript.crossOrigin = 'anonymous';
    jQueryScript.referrerPolicy = 'no-referrer';
    document.head.appendChild(jQueryScript);

    // Wait for jQuery to load, then execute main script
    jQueryScript.onload = function() {
        // Main script code
        window.addEventListener('load', function() {
            console.log("Page Loaded");
            setTimeout(function(){
                console.log("Attempting to Apply Group Inspiration");
                appendHtmlAfterElement(htmlContent, '.ct-character-header-desktop__group.ct-character-header-desktop__group--gap');
                appendStyle(cssStyles);
                // Append the JavaScript code
                const script = document.createElement('script');
                script.textContent = jsCode;
                document.head.appendChild(script);
            }, 2000);
        }, false);
    };
})();
