const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const output = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const themeInput = document.querySelector('#theme');

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
  const image = new Image();
  image.src = URL.createObjectURL(file);

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

  const text = themeInput.value;
  // Send text generation request to the main process via IPC (exposed by preload)
  ipcRenderer.send('text:generate', { text })
}

//Catch generated text and add to image (yet to add logic)
ipcRenderer.on('text:generatedtext', (options) => {
  console.log(options['resultText']);
})

// Listen for file selection in the image input
img.addEventListener('change', loadImage);
// Listen for form submission (currently triggers generateText)
form.addEventListener('submit', generateText);