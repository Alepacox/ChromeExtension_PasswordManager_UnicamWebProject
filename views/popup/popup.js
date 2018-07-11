
window.onload = function () {
    var loginButton = document.getElementById('loginButton');
    if (localStorage.getItem('token') != null) {
        loginButton.innerHTML = "Logout";
        loginButton.addEventListener('click', logout);
        var description = document.getElementById('description');
        readDomains(description);
    } else {
        loginButton.addEventListener('click', openLoginPage);
    }
}


function readDomains(description) {
    chrome.tabs.query({ //This method output active URL 
        "active": true,
    }, function (tabs) {
        description.innerHTML = extractHostname(tabs[0].url);
    });
}

function extractHostname(url) {
    var hostname;
    if (url.indexOf("://") > -1)
        hostname = url.split('/')[2];
    else hostname = url.split('/')[0];
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
}

function openLoginPage() {
    chrome.tabs.create({ url: chrome.extension.getURL("../views/login/login.html") });
}

function logout() {
    var url = new URL('http://localhost:8000/api/logout');
    url.searchParams.append('token', localStorage.getItem('token'));
    fetch(url, {
        method: "GET",
    }).then(res => res.json()).then(val => {
        localStorage.removeItem('token');
        loginButton.innerHTML = "Login";
        loginButton.addEventListener('click', openLoginPage);
        document.getElementById('description').innerHTML="Effettua il login per iniziare ad usare DominKey";
        })

}