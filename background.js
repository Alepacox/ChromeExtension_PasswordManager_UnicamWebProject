function loadDomains() {
    if (localStorage.getItem('token') != null) {
    var url = new URL('http://localhost:8000/api/domain/getall');
    url.searchParams.append('token', localStorage.getItem('token'));
    fetch(url, {
        method: "GET",
    }).then(res => res.json()).then(val => {
        if(val.length >0)
        localStorage.setItem("domains", val);
    })
  }
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.getdomains == "true"){
            loadDomains();
        sendResponse({done: "true"});
        }
    }
);

loadDomains();