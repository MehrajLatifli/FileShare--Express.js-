window.onload = function () {
  const value = localStorage.getItem('detail');
  const file = JSON.parse(value);

  console.log(file);

  var ftype = '';

  if (file.filetype === 'jpeg') {
    ftype = '../images/jpeg.png';
  } else if (file.filetype.toLowerCase() === 'jpg') {
    ftype = '../images/jpg.png';
  } else if (file.filetype.toLowerCase() === 'png') {
    ftype = '../images/png.png';
  } else if (file.filetype.toLowerCase() === 'gif') {
    ftype = '../images/gif.png';
  } else if (file.filetype.toLowerCase() === 'pdf') {
    ftype = '../images/pdf.png';
  } else if (file.filetype.toLowerCase() === 'mp3') {
    ftype = '../images/mp3.png';
  } else if (file.filetype.toLowerCase() === 'mp4') {
    ftype = '../images/mp4.png';
  } else if (file.filetype.toLowerCase() === 'zip') {
    ftype = '../images/zip.png';
  } else {
    ftype = '';
  }

  document.getElementById("container").innerHTML = `
   <div class="product-image">
   <img src="${ftype}" alt="Product Image">
 </div>
 <div class="product-info">
 <p><strong>File name: </strong> ${file.filename} mb</p>
   <p><strong>File size: </strong> ${file.filesize.toFixed(2)} mb</p>
   <p><strong>File type: </strong> ${file.filetype} </p>
   <button type="button" onclick="window.location.href='${file.filepath}'">Download file</button>
   <button type="button" onclick="window.history.back()">Back</button>
 </div>
   `;

  var interval = setInterval(() => {
    var itemValue = localStorage.getItem('key');
    if (itemValue === null) {
      window.location.href = "http://localhost:3000/";
      clearInterval(interval);
    }

    var itemValue2 = localStorage.getItem('detail');
    if (itemValue2 === null) {
      window.location.href = "http://localhost:3000/";
      clearInterval(interval);
    }
  }, 100);
};
