var encrypttext="";
var decryptedtext ="";
const encryptionKey = "secret";

function encrypt(str, key) {
  let encryptedStr = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    encryptedStr += String.fromCharCode(charCode);
  }
  return encryptedStr;
}

function decrypt(encryptedStr, key) {
  let decryptedStr = '';
  for (let i = 0; i < encryptedStr.length; i++) {
    const charCode = encryptedStr.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    decryptedStr += String.fromCharCode(charCode);
  }
  return decryptedStr;
}



function handleRequestError(request) {
    if (request.readyState == 4 && request.status != 200) {
        const errorMessage = request.responseText;
        console.log(errorMessage)
        document.getElementById('statuslabel').innerHTML = errorMessage;
        document.getElementById('statuslabel').style.display = 'block';

        setTimeout(() => {
            document.getElementById('statuslabel').style.display = 'none';
        }, 2000);
    }
}



async function signIn(event) {
    event.preventDefault();
  
    const obj = {
      username: document.getElementById('username1').value,
      password: document.getElementById('password1').value
    };
  
    const p = JSON.stringify(obj);
    console.log(p);
    document.getElementById('pValue').textContent = p;
  
    try {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById('statuslabel').style.display = 'none';
  
          console.log(request.responseText);
  
          encrypttext= encrypt(request.responseText, encryptionKey);

          localStorage.setItem("key",encrypttext);
  
          setTimeout(() => {
            var itemValue = localStorage.getItem('key');
            if (itemValue === null) {
              window.location.href = "http://localhost:3000/";
            } else {
       
              window.history.replaceState({}, '', "/users");
              window.location.href = "http://localhost:3000/users";
            }
          }, 1000);
        } else {
          handleRequestError(request);
        }
      };
  
      request.open('POST', 'http://localhost:3030/login', true);
      request.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  
      await new Promise((resolve, reject) => {
        request.onload = resolve;
        request.onerror = reject;
        request.send(p);
      });
    } catch (error) {
      console.log(error);
    }
  }
  

async function signUp(event) {
    event.preventDefault();

    const obj = {
        username: document.getElementById('username2').value,
        password: document.getElementById('password2').value,
        email: document.getElementById('email2').value
    };

    const p = JSON.stringify(obj);
    console.log(p);
    document.getElementById('pValue').textContent = p;

    try {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById('statuslabel').style.display = 'none';
                console.log(request.responseText);

                encrypttext= encrypt(request.responseText, encryptionKey);
                localStorage.setItem("key", encrypttext);
        
                setTimeout(() => {
                  var itemValue = localStorage.getItem('key');
                  if (itemValue === null) {
                    window.location.href = "http://localhost:3000/";
                  } else {
             
                    window.history.replaceState({}, '', "/users");
                    window.location.href = "http://localhost:3000/users";
                  }
                }, 1000);;
            } else {
                handleRequestError(request);
            }
        };

        request.open('POST', 'http://localhost:3030/signup', true);
        request.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

        await new Promise((resolve, reject) => {
            request.onload = resolve;
            request.onerror = reject;
            request.send(p);
        });
    } catch (error) {
        console.log(error);
    }
}



async function Logout(event) {
  event.preventDefault();

  encrypttext = localStorage.getItem('key');
  console.log(encrypttext);
  decryptedtext = decrypt(encrypttext, encryptionKey);
  console.log(decryptedtext);

  var data = JSON.parse(decryptedtext);
  var value = data["Bearer"];
  console.log(value);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3030/logout', true);
  xhr.setRequestHeader('Authorization', `Bearer ${value}`);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {

        localStorage.removeItem('key');
      } else {
    
        console.error('Logout failed:', xhr.status, xhr.statusText);
      }
    }
  };

  xhr.onerror = function () {

    console.error('Error:', xhr.statusText);
  };

  xhr.send();



  

    
  try {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:3030/logout', true);
    request.setRequestHeader('Authorization', `Bearer ${value}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
     
          localStorage.removeItem('key');
 
      } else {
        handleRequestError(request);
      }
    };

    request.open('POST', 'http://localhost:3030/login', true);
    request.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

    await new Promise((resolve, reject) => {
      request.onload = resolve;
      request.onerror = reject;
      request.send(p);
    });
  } catch (error) {
    console.log(error);
  }


}

window.onload = function () {



  var interval = setInterval(() => {
   var itemValue = localStorage.getItem('key');
   if (itemValue !== null) {
    window.history.replaceState({}, '', "/users");
    window.location.href = "http://localhost:3000/users";
   } 
 }, 100);
 

 clearInterval(interval);
 


};