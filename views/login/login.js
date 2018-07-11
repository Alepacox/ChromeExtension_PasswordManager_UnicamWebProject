document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#loginButton').addEventListener('click', login);
});

function login() {
  var email = document.getElementById('inputMail').value;
  console.log(email);
  var masterkey = document.getElementById('inputMasterkey').value;
  console.log(masterkey);
  if (emailValidation(email) || masterkey == undefined) {
    var body = { email: email, masterkey: masterkey };
    fetch('http://localhost:8000/api/login', {
      method: "POST",
      body: JSON.stringify(body)
    }).then(res => res.json()).then(val => {
      if (val.logged == true) {
        console.log(val.token);
        localStorage.setItem("token", val.token);
        chrome.runtime.sendMessage({getdomains: "true"}, function(response) {
          console.log(response.done);
        });
        chrome.tabs.getCurrent(function (tab) {
          chrome.tabs.remove(tab.id, function () { });
        });
      }
      else {
        alert("Email o password errati");
        email = null;
        masterkey = null;
      }
    })
  } else alert("Inserisci tutti i parametri correttamente");
}

function emailValidation(email) {
  var regMail = /^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,3})$/;
  return regMail.test(email);
}