function loadDomains() {
    if (localStorage.getItem('token') != null) {
        var url = new URL('http://localhost:8000/api/domain/getall');
        url.searchParams.append('token', localStorage.getItem('token'));
        fetch(url, {
            method: "GET",
        }).then(res => res.json()).catch((err) => {
            console.error("No server connection");
        }).then(val => {
            if (!Object.prototype.hasOwnProperty(val, 'authenticated')) {
                if (val.length > 0)
                    localStorage.setItem("domains", val);
            } else {
                logout(true);
            }
        })
    }
}

function logout(expired) {
    if (expired == undefined) {
        var url = new URL('http://localhost:8000/api/logout');
        url.searchParams.append('token', localStorage.getItem('token'));
        fetch(url, {
            method: "GET",
        }).catch((err) => {
            console.log(err);
        });
        console.log("done");
    }
    localStorage.removeItem('domains');
    localStorage.removeItem('token');
}

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.getdomains == "true") {
            loadDomains();
        }
        if (request.logout == "true") {
            logout();
        }
    }
);

loadDomains();