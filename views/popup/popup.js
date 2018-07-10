window.onload = function() {
    var loginButton= document.getElementById('loginButton');
    if (localStorage.getItem('token') != null){
        loginButton.innerHTML= "Logout";
        loginButton.addEventListener('click', logout);
        document.getElementById('description').innerHTML= "Nessuna password per questo dominio";
    } else {
        loginButton.addEventListener('click', openLoginPage);
    }
  }

function openLoginPage(){
    chrome.tabs.create({url: chrome.extension.getURL("../views/login/login.html")});
}

function logout(){
    localStorage.removeItem('token');
    loginButton.innerHTML= "Login";
    loginButton.addEventListener('click', openLoginPage);
}