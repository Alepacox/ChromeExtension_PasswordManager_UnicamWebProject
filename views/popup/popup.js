
window.onload = function () {
    var loginButton = document.getElementById('loginButton');
    if (localStorage.getItem('token') != null) {
        loginButton.innerHTML = "Logout";
        loginButton.addEventListener('click', function () { chrome.runtime.sendMessage({ logout: true, expired: false }, {}); });
        document.getElementById('description').innerHTML = "Sto scaricando il caricando il contenuto dalla pagina";
        checkForSavedDomains();
    } else {
        loginButton.addEventListener('click', openLoginPage);
    }
}

function checkForSavedDomains() {
    chrome.tabs.query({
        "active": true,
    }, function (tabs) {
        var domainUrl = tabs[0].url;
        chrome.runtime.sendMessage({ checkDomain: true, urlDomain: domainUrl }, {});
    });
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.updateDescription == true)
            document.getElementById('description').innerHTML = request.text;
        if (request.updateButtonLogin == true) {
            loginButton.innerHTML = "Login";
            loginButton.addEventListener('click', openLoginPage);
        }
    });


function openLoginPage() {
    chrome.tabs.create({ url: chrome.extension.getURL("../views/login/login.html") });
}



