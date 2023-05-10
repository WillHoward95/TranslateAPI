//grabbing the html elements
const toTranslate = document.getElementById("translateFrom");
const translateButton = document.getElementById("translateButton");
const startingLang = document.getElementById("startingLang");
const endLang = document.getElementById("endLang");
const translation = document.getElementById("translateTo");
const switchButton = document.getElementById("switchButton");
const loadingSpinner = document.getElementById("loadingSpinner");
const copyLeft = document.getElementById("copyLeft");
const copyRight = document.getElementById("copyRight");
const speakLeft = document.getElementById("speakLeft");
const speakRight = document.getElementById("speakRight");

translation.innerText - "test";

//import language object from other js file
import { languages } from "./languages.js";

//add those lagiage values into the two drop-down menus
for (const key in languages) {
  startingLang.innerHTML += `<option>${languages[key]}</option>`;
  endLang.innerHTML += `<option>${languages[key]}</option>`;
}

//this is what's sent to the API
const options = {
  method: "GET",
  url: "https://g-translate1.p.rapidapi.com/translate",
  params: {
    text: "",
    tl: "",
    sl: "",
  },
  headers: {
    "X-RapidAPI-Key": "a1bda19388msh2d3158806fcc308p1cf85fjsnbc0f7fa780f8",
    "X-RapidAPI-Host": "g-translate1.p.rapidapi.com",
  },
};

//on the click of the translate button we:
translateButton.addEventListener("click", (e) => {
  //stop it refreshing the page
  e.preventDefault();
  if (startingLang.value) {
    //remove any text that's already in there
    translation.innerText = "";
    //add the loading animation
    loadingSpinner.style.visibility = "visible";
    //dim the translation box color while loading
    translation.style.backgroundColor = "#dddddd";
    //run the getlanguage function
    getLanguages(startingLang.value, endLang.value);
    //set the value that's in the translation box to the options object
    options.params.text = toTranslate.value;
    //run the getResponse function
    getResponse(options);
  }
});

//get the response from the API and set the innertext
const getResponse = async (options) => {
  try {
    const response = await axios.request(options);
    translation.innerText = response.data.data.translation;
    //remove the loading animation
    loadingSpinner.style.visibility = "hidden";
    translation.style.backgroundColor = "#ffffff";
  } catch (error) {
    console.error(error);
  }
};

//loop through the languages object and set the value of the starting and ending key
const getLanguages = (startingLang, endLang) => {
  let startingLangKey = "";
  let endLangKey = "";

  for (const key in languages) {
    if (languages[key] === startingLang) {
      startingLangKey = key;
    } else if (languages[key] === endLang) {
      endLangKey = key;
    }
  }

  //use these keys to set the options being sent to the API
  options.params.el = startingLangKey;
  options.params.tl = endLangKey;
};

//switch languages on the arrow click
switchButton.addEventListener("click", (e) => {
  //switch languages in dropdown menu
  let tempStartingLang = startingLang.value;
  startingLang.value = endLang.value;
  endLang.value = tempStartingLang;

  //switch translation box values
  let tempTranslationBox = toTranslate.value;
  toTranslate.value = translation.value;
  translation.value = tempTranslationBox;

  e.preventDefault();
});

//function to copy based on whcih box is sent to it
const copyToClipboard = (textBox) => {
  textBox.select();
  document.execCommand("Copy");
};

//event listener for each copy button
copyLeft.addEventListener("click", () => {
  copyToClipboard(toTranslate);
});

copyRight.addEventListener("click", () => {
  copyToClipboard(translation);
});

// text to speech
const speak = (textBox) => {
  const msg = new SpeechSynthesisUtterance();
  msg.text = textBox.value;

  window.speechSynthesis.speak(msg);
};

//add event listeners for speak buttons
speakLeft.addEventListener("click", () => {
  speak(toTranslate);
});

speakRight.addEventListener("click", () => {
  speak(translation);
});
