
window.onload = function () {
    var loginButton = document.getElementById('loginButton');
    if (localStorage.getItem('token') != null) {
        loginButton.innerHTML = "Logout";
        loginButton.addEventListener('click', sendLogoutMessage);
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
        var url = new URL('http://localhost:8000/api/domain/search');
        var domain = getCurrentDomain(domainUrl);
        url.searchParams.append('domain', domain);
        url.searchParams.append('token', localStorage.getItem('token'));
        fetch(url, {
            method: "GET",
        }).then(res => res.json()).catch((err) => {
            console.error("No server connection");
        }).then(val => {
            if (Object.prototype.hasOwnProperty.call(val, 'authenticated')) {
                sendLogoutMessage(true);
            } else if (val.foundDomain == true) {
                document.getElementById('description').innerHTML = "Hai una password salvata per questo dominio";
            } else document.getElementById('description').innerHTML = "Nessuna password trovata per questo dominio";
        });
    });
}

function getCurrentDomain(tabUrl) {
    var hostname;
    if (tabUrl.indexOf("://") > -1)
        hostname = tabUrl.split('/')[2];
    else hostname = tabUrl.split('/')[0];
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function sendLogoutMessage(expired) {
    if (expired == true) {
        chrome.runtime.sendMessage({ logout: "true", expired: "true" }, {});
    } else chrome.runtime.sendMessage({ logout: "true" }, {});
    loginButton.innerHTML = "Login";
    loginButton.addEventListener('click', openLoginPage);
    document.getElementById('description').innerHTML = "Sessione scaduta, effettua nuovamente il login per utilizzare DominKey";
}


function openLoginPage() {
    chrome.tabs.create({ url: chrome.extension.getURL("../views/login/login.html") });
}



