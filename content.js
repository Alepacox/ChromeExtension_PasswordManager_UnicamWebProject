var form= new Array(0);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
    if (request.checkForForm == true) {
        var found= false;
        var elements = document.getElementsByTagName('input');
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute('type') === 'password') {
                found=true;
                form[i]= elements[i];
                elements[i].addEventListener("focus", function()
                    {this.value= request.password});
            }
        }
        if (!found) sendResponse({foundPswForm: false});
        else sendResponse({foundPswForm: true});
    }
})