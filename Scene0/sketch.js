let img;
let asciiChars = ' .:-=+*#%@';
let charSize = 5;
let animationSpeed = 0.05;
let brightnessAdjust = 30;

// Text animation variables
let textLines = [
  "One day I was flying over the Sahara Desert, \nmy plane crashed.",
  "I was not hurt. But I could not start the plane again. \nI was alone in the desert and I did not have much water.",
  "I had to work on the plane quickly. \nThat night, I slept on the sand."
];
let currentTextIndex = 0;
let textAlpha = 0;
let textState = 'fadeIn';
let textFrameCounter = 0;
let fadeSpeed = 30; // ~0.5s fade-in/out at 30 fps
let holdFrames = 30; // ~4s hold at 30 fps

function preload() {
  img = loadImage('pic0.jpeg', 
    () => console.log('Loaded pic1.jpeg'),
    () => console.error('Failed to load pic1.jpeg')
  );
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  if (document.getElementById('canvas-container')) {
    canvas.parent('canvas-container');
  } else {
    console.error('canvas-container not found; appending canvas to body');
  }
  pixelDensity(2);
  textFont('Courier New');
  textSize(charSize);
  textAlign(CENTER, CENTER);
  background('#222222');
  noStroke();
  frameRate(30);
  
  // Set up text styling for animated text
  textSize(35);
  textAlign(CENTER, TOP);
  textLeading(40); // Adjust line spacing for \n
}

function draw() {
  background('#222222');
  
  if (img && img.width > 0 && img.height > 0) {
    let imgAspect = img.width / img.height;
    let canvasAspect = width / height;
    
    let scaledWidth, scaledHeight;
    
    if (imgAspect > canvasAspect) {
      scaledWidth = width;
      scaledHeight = width / imgAspect;
    } else {
      scaledHeight = height;
      scaledWidth = height * imgAspect;
    }
    
    let w = floor(scaledWidth / charSize);
    let h = floor(scaledHeight / charSize);
    
    let offsetX = (width - w * charSize) / 2;
    let offsetY = (height - h * charSize) / 2;
    
    img.loadPixels();
    
    textSize(charSize);
    textAlign(CENTER, CENTER);
    noStroke();
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let imgX = floor(map(x, 0, w, 0, img.width));
        let imgY = floor(map(y, 0, h, 0, img.height));
        
        let pixelIndex = (imgX + imgY * img.width) * 4;
        let r = img.pixels[pixelIndex];
        let g = img.pixels[pixelIndex + 1];
        let b = img.pixels[pixelIndex + 2];
        
        let brightness = (r + g + b) / 3;
        brightness = brightness + brightnessAdjust;
        
        let wave = sin(frameCount * animationSpeed + x * -0.001 + y * -0.001) * 50;
        brightness = constrain(brightness + wave, 0, 255);
        
        let charIndex = floor(map(brightness, 0, 255, 0, asciiChars.length));
        charIndex = constrain(charIndex, 0, asciiChars.length - 1);
        
        let char = asciiChars.charAt(charIndex);
        
        fill(r, g, b);
        text(char, offsetX + x * charSize + charSize/2, offsetY + y * charSize + charSize/2);
      }
    }
  } else {
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Loading image...", width / 2, height / 2);
  }

  // Text animation
  console.log(`textState: ${textState}, textAlpha: ${textAlpha}, textFrameCounter: ${textFrameCounter}, currentTextIndex: ${currentTextIndex}`);
  if (textState === 'fadeIn') {
    textAlpha += fadeSpeed;
    if (textAlpha >= 255) {
      textAlpha = 255;
      textState = 'hold';
      textFrameCounter = 0;
    }
  } else if (textState === 'hold') {
    textFrameCounter++;
    if (textFrameCounter >= holdFrames) {
      textState = 'fadeOut';
    }
  } else if (textState === 'fadeOut') {
    textAlpha -= fadeSpeed;
    if (textAlpha <= 0) {
      textAlpha = 0;
      textState = 'fadeIn';
      currentTextIndex = (currentTextIndex + 1) % textLines.length;
    }
  }
  textAlpha = constrain(textAlpha, 0, 255); // Prevent overshooting

  // Draw text over ASCII art
  textSize(25);
  textAlign(CENTER, TOP);
  textLeading(40); // Adjust line spacing for \n
  // Shadow effect
  fill(0, 0, 0, textAlpha * 0.7);
  text(textLines[currentTextIndex], width / 2 + 2, 50 + 2);
  text(textLines[currentTextIndex], width / 2 - 2, 50 - 2);
  // Main text
  fill(255, 255, 0, textAlpha); // Yellow for contrast
  stroke(255);
  strokeWeight(2);
  text(textLines[currentTextIndex], width / 2, 50);
  noStroke();
}

function fileDropped(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, 
      () => console.log('Loaded dropped image'),
      () => console.error('Failed to load dropped image')
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}