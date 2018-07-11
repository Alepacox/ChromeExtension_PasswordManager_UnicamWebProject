function logout(expired) {
    if (expired == undefined) {
        var url = new URL('http://localhost:8000/api/logout');
        url.searchParams.append('token', localStorage.getItem('token'));
        fetch(url, {
            method: "GET",
        }).catch((err) => {
            console.log(err);
        });
    }
    localStorage.clear();
}

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.logout == "true") {
            if (request.expired == "true"){
                logout(true);
            } else logout();
        }
    }
)