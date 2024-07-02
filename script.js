var imageLoader = document.getElementById('OpenImage');
var TextBox = document.getElementById('OutputBox');
var XBox = document.getElementById('X');
var YBox = document.getElementById('Y');
var Output = "";
if (imageLoader) {
  imageLoader.addEventListener('change', handleImage, false);
}
var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext('2d');
var maxX = 0;
var maxY = 0;
var filename;
var type = ".txt";

// Function to download data to a file
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function DownloadText() {
  download(TextBox.value, filename, type);
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
    throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

function handleImage(e) {
  var reader = new FileReader();

  reader.onload = function (event) {

    var img = new Image();
    img.onload = function () {
      Output = "";
      TextBox.value = "";
      canvas.width = img.width;
      maxX = img.width;
      maxY = img.height;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      var imgd = ctx.getImageData(0, 0, img.width, img.height);
      var pix = imgd.data;

      for (var i = 0, n = pix.length; i < n; i += 4) {
        var hex = ("000000" + rgbToHex(pix[i], pix[i + 1], pix[i + 2])).slice(-6);
        Output = Output + hex;
      }
      TextBox.value = Output;
      XBox.value = maxX.toString();
      YBox.value = maxY.toString();
    }
    img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
  filename = e.target.files[0].name;
  filename = filename.split('.')[0];
}