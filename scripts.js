const text = document.querySelector("h1");
const button = document.querySelector(".button");
const customCursor = document.querySelector(".custom-cursor");
const mainPage = document.querySelector(".main-page"); // New letter button
const transitionBg = document.querySelector(".transition-bg");
const letterButton = document.querySelector(".letter-button");
const audioElements = {};
const MAX_SIMULTANEOUS_AUDIO = 9; // Set your desired limit for simultaneous audio plays
let activeAudioCount = 0;
let isPaused = true;
let isInitialized = false;
let hasBeenClicked = false; // New variable to track if the button has been clicked
let mainPageClicked = false; // New variable to track if the button has been clicked


const sounds = {
  N: ["/Final/piano-keys/key13.mp3?v=1"],
  O: ["/Final/piano-keys/key20.mp3?v=1"],
  o: ["/Final/piano-keys/key15.mp3?v=1"],
  E: ["/Final/piano-keys/key06.mp3?v=1"],
  R: ["/Final/piano-keys/key18.mp3?v=1"],
  r: ["/Final/piano-keys/key01.mp3?v=1"],
  S: ["/Final/piano-keys/key17.mp3?v=1"],
  '\u002E': ["/Final/piano-keys/key18.mp3?v=1"],
  '\u0C97': ['/Final/piano-keys/key03.mp3?v=1'],
  '\u00B0': ["/Final/piano-keys/key22.mp3?v=1"],
  '\u0028': ["/Final/piano-keys/key01.mp3?v=1"],
  '\u0434': ["/Final/piano-keys/key17.mp3?v=1"],
  '\u3002': ['/Final/piano-keys/key20.mp3?v=1'],
  '\u0029': ["/Final/piano-keys/key01.mp3?v=1"],
  '\u0E51': ["/Final/piano-keys/key06.mp3?v=1"],
  '\u0027': ['/Final/piano-keys/key20.mp3?v=1'],
  '\u2022': ["/Final/piano-keys/key22.mp3?v=1"],
  '\u0020': ["/Final/piano-keys/key19.mp3?v=1"],
  '\u032B': ["/Final/piano-keys/key13.mp3?v=1"],
  '\u0942': ["/Final/piano-keys/key03.mp3?v=1"],
  '\u00B4': ["/Final/piano-keys/key13.mp3?v=1"],
  '\u0060': ["/Final/piano-keys/key13.mp3?v=1"],
};


// Function to play audio with the limit
async function playAudioWithLimit(letter, mute) {
  if (activeAudioCount >= MAX_SIMULTANEOUS_AUDIO) {
    return; // Limit reached, do not play more audio
  }

  if (!isPaused && audioElements[letter]) {
    const audioUrls = audioElements[letter];
    const audio = audioUrls[Math.floor(Math.random() * audioUrls.length)];
    audio.currentTime = 0;
    audio.muted = mute;
    activeAudioCount++;

    try {
      await audio.play();
      console.log(`Playing sound for letter ${letter}: ${audio.src}`);
    } catch (error) {
      console.log(`Error playing sound for letter ${letter}: ${error.message}`);
    } finally {
      activeAudioCount--;
    }
  }
}


function updateCustomCursor(event) {
  const { clientX, clientY } = event;
  customCursor.style.left = `${clientX}px`;
  customCursor.style.top = `${clientY}px`;

  const computedStyle = window.getComputedStyle(button);
  const buttonColor = computedStyle.getPropertyValue('background-color');
  customCursor.style.backgroundColor = buttonColor;
}

document.addEventListener("mousemove", updateCustomCursor);

function showLetterButton(letter) {
  mainPage.textContent = letter;
  mainPage.style.visibility = "visible";
}

function followMouse(event) {
  const mouseX = event.pageX;
  const mouseY = event.pageY;
  const cursorX = mouseX - cursorSquare.clientWidth / 2;
  const cursorY = mouseY - cursorSquare.clientHeight / 1;
  cursorSquare.style.left = `${cursorX}px`;
  cursorSquare.style.top = `${cursorY}px`;

  const buttonRect = button.getBoundingClientRect();
  const isHoveringButton = mouseX >= buttonRect.left && mouseX <= buttonRect.right && mouseY >= buttonRect.top && mouseY <= buttonRect.bottom;
  cursorSquare.classList.toggle("hovering-button", isHoveringButton);
}

Object.entries(sounds).forEach(([letter, audioUrls]) => {
  const audios = audioUrls.map((audioUrl) => {
    const audio = new Audio(audioUrl + "?v=1");
    return audio;
  });
  audioElements[letter] = audios;
});

function playAudio(letter, mute) {
  if (!isPaused && audioElements[letter]) {
    const audioUrls = audioElements[letter];
    const audio = audioUrls[Math.floor(Math.random() * audioUrls.length)];
    audio.currentTime = 0;
    audio.muted = mute; // Set the audio to be muted or not based on the 'mute' parameter
    audio.play().then(() => {
      console.log(`Playing sound for letter ${letter}: ${audio.src}`);
    }).catch((error) => {
      console.log(`Error playing sound for letter ${letter}: ${error.message}`);
    });
  }
}

async function showLettersAndSymbols() {
  if (!isInitialized) {
    const letters = text.textContent.split("");
    text.textContent = "";
    letters.forEach((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.addEventListener("mouseover", () => {
        span.style.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        playAudio(letter);
      });
      text.appendChild(span);
    });
    isInitialized = true;
  }
}

function changeLetterColorRandomly() {
  if (!hasBeenClicked) {
    const letters = text.querySelectorAll("span");
    letters.forEach((letter) => {
      letter.style.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    });
    hasBeenClicked = true;
  }
}

function toggleButtonAnimation() {
  button.classList.toggle("spin");
  isPaused = !isPaused;
}

function handleButtonClick() {
  if (!hasBeenClicked) {
    showLettersAndSymbols();
    changeLetterColorRandomly();

    // Delay the appearance of the letter button by 5 seconds
    setTimeout(() => {
      if (!mainPageClicked) {
        showLetterButton('Enter');
      }
    }, 5000);
  }

  toggleButtonAnimation();

  // Play audio when the button is clicked
  const letters = text.textContent.split("");
  letters.forEach((letter) => {
    playAudio(letter, true); // Set the audio to be muted (true) for this specific function
  });
}

button.addEventListener("click", handleButtonClick);

function handleNewPage() {
  if (!mainPageClicked) {
    const expandedCursor = document.createElement("div");
    expandedCursor.classList.add("expanded-cursor");
    document.body.appendChild(expandedCursor);

    const transitionBg = document.createElement("div");
    transitionBg.classList.add("transition-bg");
    document.body.appendChild(transitionBg);

    transitionBg.addEventListener("transitionend", () => {
      window.location.href = "Final/Shop/Main.html";
    });

    setTimeout(() => {
      transitionBg.style.opacity = "1";
    }, 200);
  }
}


// Event Listeners
document.addEventListener("mousemove", updateCustomCursor);
button.addEventListener("click", handleButtonClick);
letterButton.addEventListener("click", handleNewPage);

// Initialization
createAudioElements();
