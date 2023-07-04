var encrypttext = "";
var decryptedtext = "";


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


function handleRequestError(xhr) {
    if (xhr.readyState == 4 && xhr.status != 200) {
        const errorMessage = xhr.responseText;

        var data = JSON.parse(errorMessage);
        var message = data['message'];


        console.log(errorMessage)
        document.getElementById('statuslabel').innerHTML = message;
        document.getElementById('statuslabel').style.color = 'red';
        document.getElementById('statuslabel').style.display = 'block';

        document.getElementById('statuslabel2').innerHTML = message;
        document.getElementById('statuslabel2').style.color = 'red';
        document.getElementById('statuslabel2').style.display = 'block';

        setTimeout(() => {
            document.getElementById('statuslabel').style.display = 'none';
            document.getElementById('statuslabel2').style.display = 'none';

        }, 2000);
    }
}


async function uploadFile(event) {
  event.preventDefault();

  var encrypttext = localStorage.getItem('key');
    

  var decryptedtext = decrypt(encrypttext, 'secret');
  console.log(decryptedtext);

  var data = JSON.parse(decryptedtext);
  var value = data['Bearer'];
  console.log(value);

  document.getElementById('statuslabel').innerHTML="";

  var fileInput = document.getElementById('fileInput');
  var files = fileInput.files;

  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    formData.append('upload', files[i]);
  }

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3030/file');
    xhr.setRequestHeader('Authorization', `Bearer ${value}`);

    await new Promise((resolve, reject) => {
      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log('File upload success:', xhr.responseText);
         
          document.getElementById('blog-posts').innerHTML="";
           getFilebyCurrentUser();
          resolve(xhr.responseText);

         
        } else {
          handleRequestError(xhr);

          
          reject(new Error(`File upload failed with status: ${xhr.status}`));
        }
      };

      xhr.onerror = function () {
        console.error('File upload error:', xhr.status);
        reject(new Error('File upload error'));
      };

      xhr.send(formData);

    });


  } catch (error) {

    handleRequestError(xhr);
  }
}

  
var user_id="";
var file_id="";
  
var fileId = '';
var userId = '';
var filename = '';
var filesize = 0;
var filetype = '';
var filepath = '';

function getUser() {
  try {
    var encrypttext = localStorage.getItem('key');
    var decryptedtext = decrypt(encrypttext, 'secret');
    console.log(decryptedtext);
    var data = JSON.parse(decryptedtext);
    var value = data['Bearer'];

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3030/user', true);
    xhr.setRequestHeader('Authorization', `Bearer ${value}`);

    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);


            var blogPostsElement = document.getElementById('username');
         
           
            blogPostsElement.innerHTML = `<a href="" style="background-color: white; color: black">${response.username}</a>`;

            resolve(response);
          } else {
            handleRequestError(xhr);
            reject(new Error(xhr.statusText));
          }
        }
      };

      xhr.onerror = function () {
        reject(new Error('Network error'));
      };

      xhr.send();
    });
  } catch (error) {

    console.error(error);
    return Promise.reject(error);
  }
}





function  getFilebyCurrentUser() {
  try {
    var encrypttext = localStorage.getItem('key');
      

    var decryptedtext = decrypt(encrypttext, 'secret');
    console.log(decryptedtext);

    var data = JSON.parse(decryptedtext);
    var value = data['Bearer'];
  

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:3030/file', true);
      xhr.setRequestHeader('Authorization', `Bearer ${value}`);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {

         
            getUsers();

            const response = JSON.parse(xhr.responseText);
            console.log(response);

            for (let index = 0; index < response.length; index++) {
              const r = response[index];
              
           

        
              var ftype = '';


       

              if (r.filetype.toLowerCase() === 'jpeg') {
                ftype = '../images/jpeg.png';
              } else if (r.filetype.toLowerCase() === 'jpg') {
                ftype = '../images/jpg.png';
              } else if (r.filetype.toLowerCase() === 'png') {
                ftype = '../images/png.png';
              } else if (r.filetype.toLowerCase() === 'gif') {
                ftype = '../images/gif.png';
              } else if (r.filetype.toLowerCase() === 'pdf') {
                ftype = '../images/pdf.png';
              } else if (r.filetype.toLowerCase() === 'mp3') {
                ftype = '../images/mp3.png';
              } else if (r.filetype.toLowerCase() === 'mp4') {
                ftype = '../images/mp4.png';
              } else if (r.filetype.toLowerCase() === 'zip') {
                ftype = '../images/zip.png';
              } else {
                ftype = ''; 
              }
              console.log(r);




              file_id=r.id;
              console.log(file_id);


               fileId = r.id;

 filename = r.filename;
 filesize = r.filesize;
 filetype = r.filetype;
 filepath = r.filepath;

              var blogPostsElement = document.getElementById('blog-posts');
              blogPostsElement.innerHTML += `
                <div id="${index}_post" class="post">
                  <div class="post-image">
                    <img src="${ftype}" alt="Post 1" style="width: 250px; height: 250px;">
                  </div>
                  <div class="post-content">
                    <h3>File name: ${r.filename}</h3>
                    <p>File size: ${(r.filesize / (1024 * 1024)).toFixed(2)} MB</p>
                    <p style="color: red">Owner: ${r.username}</p> 
                    <p style="color: red">Share with: ${r.users}</p> 
                    
                    <button type="button"  onclick="window.location.href='${r.filepath[0]}'" class="btn btn-warning" data-action="no-share">Download file </button>
                   
                    <form  method="post" onsubmit="event.preventDefault(); deleteFilebyId('${r.id}', '${value}')">
                      <br/> 
                      <button class="btn btn-danger" type="submit">Delete</button>
                    </form>
                      <br/> 
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"> Share </button>
                   <br/> 
                   <br/> 
                   <button type="button" onclick="goToDetailPage('${ftype}','${fileId}', '${filename}', ${filesize}, '${filetype}', '${filepath}')" class="btn btn-info" data-action="no-share">Details</button>
                    
                  </div>
                </div>

                <br/> 
                <br/>            
 
              
              <!-- Modal -->
              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Share</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div id="modalinside" class="modal-body">
                    <!-- Modal body content here -->
                    </div>
                    <div class="modal-footer">
                    <p id="statuslabel2"></p>
                    <!-- Modal footer content here -->
                  </div>
                </div>
              </div>
              </div>
            
              

                
              `;
       

          }

            resolve(response);
          } else {
            reject(new Error(xhr.statusText));
            handleRequestError(xhr);
          }
        }
      };

      xhr.onerror = function () {
        reject(new Error('Network error'));
      };

      xhr.send();

      
    });
  } catch (error) {
    handleRequestError(xhr);
  }
}



function updateSelectedFiles(event) {
  const fileInput = event.target;
  const selectedFiles = fileInput.files;
  const selectedFilesText = Array.from(selectedFiles).map(file => file.name).join(', ');

  const selectedFilesDisplay = document.querySelector('.selected-files');
  selectedFilesDisplay.textContent = selectedFilesText;
}

function deleteFilebyId(fileId,value) {
  return new Promise(function (resolve, reject) {

    console.log(value);

    try {
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:3030/file/${fileId}`);
    xhr.setRequestHeader('Authorization', `Bearer ${value}`);

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log('File delete success');
                 
        document.getElementById('blog-posts').innerHTML="";
         getFilebyCurrentUser();
        resolve(xhr.responseText);
      } else {
        handleRequestError(xhr);
        console.error('File delete failed:', xhr.status);
        reject(xhr.responseText);
      }
    };

    xhr.onerror = function () {
    
      console.error('File delete error:', xhr.statusText);
      reject(xhr.statusText);
    };

    xhr.send();
  } catch (error) {
  
  }
  });
}



function getUsers() {
  try {
    var encrypttext = localStorage.getItem('key');
      

    var decryptedtext = decrypt(encrypttext, 'secret');
    console.log(decryptedtext);

    var data = JSON.parse(decryptedtext);
    var value = data['Bearer'];
  

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:3030/users', true);
      xhr.setRequestHeader('Authorization', `Bearer ${value}`);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            

            response.forEach(function (r) {

              console.log(r);

              user_id=r._id;
              console.log(user_id);

              userId = r._id;

         
              console.log(userId);
              console.log(fileId);

              var modalinside = document.getElementById('modalinside');
              modalinside.innerHTML += 
              `  <form id="${r._id}" method="POST" onsubmit="event.preventDefault(); handleFormSubmit('${fileId}', '${userId}', '${filename}', ${filesize}, '${filetype}', '${filepath}')"
              enctype="multipart/form-data">
              <div class="input-group mb-3">
                <div class="input-group-text">
                  <div class="form-inline">
                    <p class="form-control mr-2" aria-label="Text input with checkbox">${r.username}</p>
                    <button type="submit" class="btn btn-primary" data-action="share">Share</button>
                    <button type="submit" class="btn btn-danger" data-action="no-share">No Share</button>
                  </div>
                </div>
              </div>
            </form>
            
            
          `
            

            });

            resolve(response);
          } else {
            handleRequestError(xhr);
            reject(new Error(xhr.statusText));
          }
        }
      };

      xhr.onerror = function () {
        reject(new Error('Network error'));
      };

      xhr.send();
    });
  } catch (error) {
    handleRequestError(xhr);
  }
}

function handleFormSubmit(fileId, userId, filename, filesize, filetype, filepath) {
  const form = event.target;
  const action = event.submitter.getAttribute("data-action");

  if (action === "share") {
    ShareFile(fileId, userId, filename, filesize, filetype, filepath);
  } else if (action === "no-share") {
    NoShareFile(fileId, userId);
  }

  form.reset();
}


async function ShareFile(fileId, userId, filename, filesize, filetype, filepath) {
  try {
    var encrypttext = localStorage.getItem('key');
    var decryptedtext = decrypt(encrypttext, 'secret');
    var data = JSON.parse(decryptedtext);
    var value = data['Bearer'];



 
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `http://localhost:3030/share/${fileId}/${userId}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${value}`);
  
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);

          setTimeout(() => {
            window.location.reload();
        }, 1000);
        } else {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.message));

          handleRequestError(xhr);
        }
      };
  
      xhr.onerror = function () {
        reject(new Error('An error occurred during the request.'));
      };
  
      xhr.send(JSON.stringify({ filename, filesize, filetype, filepath }));
    });
  } catch (error) {
    console.error(error);
  }
}


async function NoShareFile(fileId, userId) {
  try {

    var encrypttext = localStorage.getItem('key');
    var decryptedtext = decrypt(encrypttext, 'secret');
    var data = JSON.parse(decryptedtext);
    var value = data['Bearer'];


    return new Promise(function (resolve, reject) {

      console.log(value);
  
      try {
      var xhr = new XMLHttpRequest();
      xhr.open('DELETE', `http://localhost:3030/share/${fileId}/${userId}`);
      xhr.setRequestHeader('Authorization', `Bearer ${value}`);
  
      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log('File delete success');
                   
              setTimeout(() => {
            window.location.reload();
        }, 1000);
        } else {
          handleRequestError(xhr);
          console.error('File delete failed:', xhr.status);
          reject(xhr.responseText);
        }
      };
  
      xhr.onerror = function () {
        console.error('File delete error:', xhr.statusText);
        
        
        reject(xhr.statusText);

      };
  
      xhr.send();
    } catch (error) {
 
    }
    });
  } catch (error) {
    console.error(error);
  }
}


async function  goToDetailPage(ftype, fileId, filename, filesize, filetype, filepath)
{
  const filedata = {
    filetype: ftype,
    fileId: fileId,
    filename: filename,
    filesize: filesize/ (1024 * 1024).toFixed(2),
    filetype: filetype,
    filepath: filepath
  };

  

  localStorage.setItem("detail", JSON.stringify(filedata)); 

  window.location.href='http://localhost:3000/users/detail';

  
}


window.onload = function () {

  getUser();
  
   getFilebyCurrentUser();
  


   var interval = setInterval(() => {
    var itemValue = localStorage.getItem('key');
    if (itemValue === null) {
      window.location.href = "http://localhost:3000/";
    } 
  }, 100);
  

  clearInterval(interval);
  


};





