console.log("connected");

const getAllBtn = document.querySelector("#all");
const charBtns = document.querySelectorAll(".char-btns");
const ageForm = document.querySelector("#age-form");
const ageInput = document.querySelector("#age-input");
const createForm = document.querySelector("#create-form");
const newFirstInput = document.querySelector("#first");
const newLastInput = document.querySelector("#last");
const newGenderDropDown = document.querySelector("select");
const newAgeInput = document.querySelector("#age");
const newLikesText = document.querySelector("textarea");
const charContainer = document.querySelector("section");

const baseURL = `http://localhost:4000`;

function createCharacterCard(char) {
  let charCard = document.createElement("div");
  charCard.innerHTML = `<h3>${char.firstName} ${char.lastName}</h3>
  <p>gender: ${char.gender} | age: ${char.age}</p>
  <h4>Likes</h4>
  <ul>
    <li>${char.likes[0]}</li>
    <li>${char.likes[1]}</li>
    <li>${char.likes[2]}</li>
  </ul>`;

  charContainer.appendChild(charCard);
}

function clearCharacters() {
  charContainer.innerHTML = ``;
}

function getAllCharacters() {
  clearCharacters();

  axios
    .get(`${baseURL}/characters`)
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        let currentCharacter = response.data[i];
        createCharacterCard(currentCharacter);
      }
    })
    .catch((error) => console.log(error));
}

/**
 * @function
 * @param {object} event - The event object. Think `event.target`
 * 
 * Write a function called `getOneCharacter` that accepts a parameter called
 * `event`. When invoked, this function will use the axios GET method to 
 * 1 - Get the correct character ID off the HTMLElement (think event.target)
 * 2 - Update the URL parameter passing the ID into a string literal like "https://localhost:4000/characters/{`ID`}"
 * 3 - Inside the .then() Invoke `createCharacterCard` with the response.data as the argument
 */

function getOneCharacter(event) {
  clearCharacters();
  let characterId = event.target.id;
  axios
    .get(`${baseURL}/character/${characterId}`)
    .then((response) => {
      createCharacterCard(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * @function
 * @param {object} event - The event object. Think `event.target`
 *
 * Write a function called `getOldCharacters` that accepts a parameter called
 * `event`. When invoked, this function will
 * 1 - Force browser NOT to refresh page
 * 2 - Write a Axios GET request
 * 3 - Based on the input in the age field, Axios URl parameter
 *     should mirror "https://localhost:4000/characters/?age={`age`}"
 *     so Look back at the query/parameters portion from todays lecture
 * 4 - Inside the .then() Invoke `createCharacterCard` with the response.data as the argument
 * 5 - Reset the age input field to be blank
 */

function getOldCharacters(event) {
  event.preventDefault();

  clearCharacters();

  axios.get(`${baseURL}/character/?age=${ageInput.value}`).then((response) => {
    for (let i = 0; i < response.data.length; i++) {
      createCharacterCard(response.data[i]);
    }
  });
  ageInput.value = "";
}

/**
 * @function
 * @param {object} event - The event object. Think `event.target`
 *
 * Write a function called `createNewCharacter` that accepts a parameter called
 * `event`. When invoked, this function will
 * 1 - Force the browser NOT to refresh
 * 2 - Invoke the clearCharacters method
 * 3 - Create variable `newLikes` by using the Array `spread` operator ex. [...someVariable]
 * 4 - Create object variable `body` which will capture
 *     input values from the first name, last name, gender, age fields.
 *
 * 5 - Write a Axios POST request with first argument being URl
 *     and second argument being the request body
 * 6 - Inside the `.then()` write a for-loop that will invoke createCharacterCard with
 *     one argument being the response.data[i]
 * 7 - Reset the input fields to blank after clicking submit
 */

function createNewCharacter(event) {
  event.preventDefault();

  clearCharacters();

  let newLikes = [...newLikesText.value.split(",")];

  let body = {
    firstName: newFirstInput.value,
    lastName: newLastInput.value,
    gender: newGenderDropDown.value,
    age: newAgeInput.value,
    likes: newLikes,
  };

  axios
    .post(`${baseURL}/character`, body)
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        createCharacterCard(response.data[i]);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  newFirstInput.value = "";
  newLastInput.value = "";
  newAgeInput.value = "";
  newGenderDropDown.value = "female";
  newLikesText.value = "";
}

// Add event listener to all characters buttons with the second
// argument being the callback function `getAllCharacters`
getAllBtn.addEventListener("click", getAllCharacters);

// Write for-loop that goes through character buttons and adds
// an event listener to every button. The second arguement
// should be the callback function `getOneCharacter`
for (let i = 0; i < charBtns.length; i++) {
  charBtns[i].addEventListener("click", getOneCharacter);
}

// Add event listener to age form so when submit button is clicked
// the first argument is 'submit' and
// the second argument being the callback function `getOldCharacters`

ageForm.addEventListener("submit", getOldCharacters);

// Add event listener to create new character button with the second
// argument being the callback function `creatNewCharacter`

createForm.addEventListener("submit", createNewCharacter);

getAllCharacters();