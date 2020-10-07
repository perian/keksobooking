"use strict";

const HOUSE_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const CHECK_IN_OUT_TIMINGS = [`12:00`, `13:00`, `14:00`];
const FEAUTURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
const PIN_POINTER_X = PIN_WIDTH / 2;
const PIN_POINTER_Y = PIN_HEIGHT / 2;
const map = document.querySelector(`.map`);

const getRandomArrayElement = (array) => {
  let randomInt = Math.floor(Math.random() * array.length);
  return array[randomInt];
}; // не включает максимальное значение

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const setRandomArrayLength = (array) => {
  const newArrayLength = getRandomInt(0, array.length);
  let newArray = [];
  for (let i = -1; i < newArrayLength; i++) {
    newArray.push(array[i]);
  }
  return newArray;
};

const createAdds = () => {
  const newAdds = [];
  for (let i = 1; i <= 8; i++) {
    let dataTemplate = {
      author: {
        avatar: `img/avatars/user0` + i + `.png`
      },
      offer: {
        title: `Уютное жилье`,
        address: `600, 350`,
        price: 5000,
        type: getRandomArrayElement(HOUSE_TYPE),
        rooms: getRandomInt(1, 3),
        guests: getRandomInt(1, 3),
        checkin: getRandomArrayElement(CHECK_IN_OUT_TIMINGS),
        checkout: getRandomArrayElement(CHECK_IN_OUT_TIMINGS),
        features: setRandomArrayLength(FEAUTURES),
        description: `Вы захотите сюда вернуться!`,
        photos: setRandomArrayLength(PHOTOS),
      },
      location: {
        x: getRandomInt(0, map.offsetWidth),
        y: getRandomInt(130, 630),
      }
    };

    newAdds.push(dataTemplate);
  }

  return newAdds;
};

const dataArray = createAdds();

document.querySelector(`.map`).classList.remove(`map--faded`);

const createPin = (pin) => {
  const newPin = pinTemplate.cloneNode(true);
  newPin.style.left = pin.location.x - PIN_POINTER_X + `px`;
  newPin.style.top = pin.location.y - PIN_POINTER_Y + `px`;
  newPin.querySelector(`img`).src = pin.author.avatar;
  newPin.alt = pinTemplate.querySelector(`img`).alt;

  return newPin;
};

const fragment = document.createDocumentFragment();

for (let i = 0; i < dataArray.length; i++) {
  fragment.appendChild(createPin(dataArray[i]));
}

const mapPins = document.querySelector(`.map__pins`);
mapPins.appendChild(fragment);
