"use strict";
const notificationForm = document.querySelector(`.ad-form`);
const map = document.querySelector(`.map`);
const mainPin = map.querySelector(`.map__pin--main`);
const mapPins = document.querySelector(`.map__pins`);
const fragment = document.createDocumentFragment();
const mapFilterContainer = document.querySelector(`.map__filters-container`);

const HouseData = {
  palace: {
    name: `Дворец`,
    minPrice: 10000,
  },
  flat: {
    name: `Квартира`,
    minPrice: 1000,
  },
  house: {
    name: `Дом`,
    minPrice: 5000,
  },
  bungalow: {
    name: `Бунгало`,
    minPrice: 0,
  },
};

const getRandomArrayElement = (array) => {
  const randomInt = getRandomInt(0, array.length - 1);
  return array[randomInt];
}; // не включает максимальное значение

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayLength = (array) => {
  const newArrayLength = getRandomInt(0, array.length);
  return array.slice(0, newArrayLength);
};

window.main = {
  getRandomArrayElement,
  getRandomInt,
  getRandomArrayLength,
  map,
  HouseData,
  notificationForm,
  mainPin,
  mapPins,
  fragment,
  mapFilterContainer,
};

const address = notificationForm.querySelector(`#address`);
const mainPinWidth = mainPin.offsetWidth;
const mainPinHeight = mainPin.offsetHeight;
const mainPinX = mainPin.style.left;
const mainPinY = mainPin.style.top;
const coneHeight = window.getComputedStyle(mainPin, `:after`).borderTopWidth;

const transformPropertyToInteger = (property) => {
  return parseInt(property.replace(`px`, ``), 10);
};

const setAddressValue = () => {
  const coneX = Math.round(transformPropertyToInteger(mainPinX) + (mainPinWidth / 2));
  const coneY = Math.round(transformPropertyToInteger(mainPinY) + mainPinHeight + transformPropertyToInteger(coneHeight));

  address.value = `${coneX}, ` + `${coneY}`;
};
setAddressValue();

