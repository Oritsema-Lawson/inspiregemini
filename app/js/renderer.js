const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const imgpreview = document.querySelector('#imgpreview');
const imgCanvas = document.querySelector('#imgCanvas');
const imgDiv = document.querySelector('#previewdiv');
const canvasDiv = document.querySelector('#canvasdiv');
const output = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const themeInput = document.querySelector('#theme');
const apiInput = document.querySelector('#apikey');

let image;
// Define accepted image file types
const acceptedImageTypes = ['image/png', 'image/jpeg'];

// Handle image file selection
function loadImage(e) {
  const file = e.target.files[0];

  // Validate file type
  if (!(file && acceptedImageTypes.includes(file['type']))) {
    alertMessage('Not an image', true);
    return;
  }

  // Create and load the image object
  image = new Image();
  image.src = URL.createObjectURL(file);
  imgpreview.src = image.src;

  // Display the form and file details
  form.style.display = 'block';
  filename.innerText = file.name;
  outputPath = path.join(os.homedir(), 'Documents', 'InspireGemini');
}

// Handle image saving (Add saving logic after creating canvas and such)
function saveImage(e) {
  e.preventDefault();

  const theme = themeInput.value;
  const imgPath = img.files[0].path;

  // Check if an image is uploaded
  if(!img.files[0]) {
    return;
  }
}

// Display a custom alert message using Toastify 
function alertMessage(message, error) {
  toastify.alert({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'white',
      color: error ? 'red' : 'green',
      textAlign: 'center'
    }
  })
}

// Handle text generation request
function generateText(e) {
  e.preventDefault();

  const theme = themeInput.value;
  const api = apiInput.value;
  // Send text generation request to the main process via IPC (exposed by preload)
  ipcRenderer.send('text:generate', { theme, api })
}

//Catch generated text and add to image
ipcRenderer.on('text:generatedtext', (options) => {
  console.log(options['resultText']);

  const text = options['resultText'];
  form.style.display = 'none';
  imgDiv.style.display = 'none';
  canvasDiv.style.display = 'block';

  const ctx = imgCanvas.getContext('2d');
  const maxWidth = 500;
  const maxHeight = 500;
  let width = image.width;
  let height = image.height;

  const aspect = width / height;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspect;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspect;
  }

  imgCanvas.width = width;
  imgCanvas.height = height;
  
  const scale = width / image.width;
  const x = width / 2;
  const y = height / 2;

  ctx.drawImage(image, 0, 0, width, height);
  ctx.font = `${width > height ? width / 25 : height / 25}px Arial`
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = 'black';
  ctx.fillText(text, x, y);
})

// Listen for file selection in the image input
img.addEventListener('change', loadImage);
// Listen for form submission (currently triggers generateText)
form.addEventListener('submit', generateText);