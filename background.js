chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.logout == true) {
            if (request.expired == true) {
                logout(true);
            } else logout();
        }
        if (request.checkDomain == true) {
            checkDomain(request.urlDomain);
        }
    });


function logout(expired) {
    if (expired == undefined) {
        chrome.runtime.sendMessage({ updateDescription: true, text: "Effettua il login per iniziare ad usare DominKey" }, {});
        var url = new URL('http://localhost:8000/api/logout');
        url.searchParams.append('token', localStorage.getItem('token'));
        fetch(url, {
            method: "GET",
        }).catch((err) => {
            console.log(err);
        });
    } else chrome.runtime.sendMessage({ updateDescription: true, text: "Sessione scaduta, effettua nuovamente il login per utilizzare DominKey" }, {});
    chrome.runtime.sendMessage({ updateButtonLogin: true }, {});
    localStorage.clear();
}

function checkDomain(urlDomain) {
    var url = new URL('http://localhost:8000/api/domain/search');
    var domain = getCurrentDomain(urlDomain);
    url.searchParams.append('domain', domain);
    url.searchParams.append('token', localStorage.getItem('token'));
    fetch(url, {
        method: "GET",
    }).then(res => res.json()).catch((err) => {
        console.error("No server connection");
    }).then(val => {
        if (Object.prototype.hasOwnProperty.call(val, 'authenticated')) {
            logout(true);
        } else if (val.foundDomain == true) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                return getPasswordForDomain(val.domain[0].id).then((psw) => {
                    chrome.tabs.sendMessage(tabs[0].id, { checkForForm: true, password: psw }, function (response) {
                        if (response != undefined) {
                            if (response.foundPswForm == true) {
                                chrome.runtime.sendMessage({ updateDescription: true, text: "Clicca sul campo per inserire direttamente la password salvata" }, {});
                            } else chrome.runtime.sendMessage({ updateDescription: true, text: "Non ci sono campi dove inserire la password salvata" }, {});
                        } else chrome.runtime.sendMessage({ updateDescription: true, text: "Ricarica la pagina per continuare" }, {});
                    })
                });
            });
        } else chrome.runtime.sendMessage({ updateDescription: true, text: "Nessuna password trovata per questo dominio" }, {});
    });
}

function getPasswordForDomain(domainId) {
    return new Promise((resolve, reject) => {
        var url = new URL('http://localhost:8000/api/domain/get');
        url.searchParams.append('domainID', domainId);
        url.searchParams.append('token', localStorage.getItem('token'));
        fetch(url, {
            method: "GET",
        }).then(res => res.json()).catch((err) => {
            console.error("No server connection");
        }).then(val => {
            resolve(val[0].PASSWORD);
        });
    }).then((psw) => {
        return psw;
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

