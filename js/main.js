"use strict";

const HOUSE_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const CHECK_IN_OUT_TIMINGS = [`12:00`, `13:00`, `14:00`];
const FEAUTURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const ROOMS = [1, 2, 3, 100];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
const PIN_POINTER_X = PIN_WIDTH / 2;
const PIN_POINTER_Y = PIN_HEIGHT / 2;
const ADS_AMOUNT = 8;
const MIN_PRICE = 0;
const MAX_PRICE = 1000000;
const MIN_GUEST = 1;
const MAX_GUEST = 3;
const map = document.querySelector(`.map`);
const AD_LOCATION_MIN_X = 0;
const AD_LOCATION_MAX_X = map.offsetWidth;
const AD_LOCATION_MIN_Y = 130;
const AD_LOCATION_MAX_Y = 630;
const AD_PHOTO_WIDTH = 45;
const AD_PHOTO_HEIGHT = 40;
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const mapFilterContainer = document.querySelector(`.map__filters-container`);

const HouseType = {
  palace: `Дворец`,
  flat: `Квартира`,
  house: `Дом`,
  bungalow: `Бунгало`,
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

const createAds = (amount) => {
  const newAds = [];

  for (let i = 0; i < amount; i++) {
    const AD_LOCATION_X = getRandomInt(AD_LOCATION_MIN_X, AD_LOCATION_MAX_X);
    const AD_LOCATION_Y = getRandomInt(AD_LOCATION_MIN_Y, AD_LOCATION_MAX_Y);

    const dataTemplate = {
      author: {
        avatar: `img/avatars/user0` + (i + 1) + `.png`,
      },
      offer: {
        title: `Уютное жилье`,
        address: `${AD_LOCATION_X}, ${AD_LOCATION_Y}`,
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
        type: getRandomArrayElement(HOUSE_TYPE),
        rooms: getRandomArrayElement(ROOMS),
        guests: getRandomInt(MIN_GUEST, MAX_GUEST),
        checkin: getRandomArrayElement(CHECK_IN_OUT_TIMINGS),
        checkout: getRandomArrayElement(CHECK_IN_OUT_TIMINGS),
        features: getRandomArrayLength(FEAUTURES),
        description: ``,
        photos: getRandomArrayLength(PHOTOS),
      },
      location: {
        x: AD_LOCATION_X,
        y: AD_LOCATION_Y,
      }
    };

    newAds.push(dataTemplate);
  }

  return newAds;
};

const dataArray = createAds(ADS_AMOUNT);

map.classList.remove(`map--faded`);

const createPin = (pin) => {
  const newPin = pinTemplate.cloneNode(true);
  const image = newPin.querySelector(`img`);
  newPin.style.left = pin.location.x - PIN_POINTER_X + `px`;
  newPin.style.top = pin.location.y - PIN_POINTER_Y + `px`;
  image.src = pin.author.avatar;
  image.alt = pin.offer.title;

  return newPin;
};

const fragment = document.createDocumentFragment();

for (let i = 0; i < dataArray.length; i++) {
  fragment.appendChild(createPin(dataArray[i]));
}

const mapPins = document.querySelector(`.map__pins`);
mapPins.appendChild(fragment);

const createCard = (card) => {
  const newCard = cardTemplate.cloneNode(true);
  const popupFeatures = newCard.querySelector(`.popup__features`);
  const popupFeaturesList = popupFeatures.querySelectorAll(`.popup__feature`);
  const popupPhotos = newCard.querySelector(`.popup__photos`);
  const popupDescription = newCard.querySelector(`.popup__description`);
  const popupAvatar = newCard.querySelector(`.popup__avatar`);

  newCard.querySelector(`.popup__title`).textContent = card.offer.title;
  newCard.querySelector(`.popup__text--address`).textContent = card.offer.address;
  newCard.querySelector(`.popup__text--price`).textContent = `${card.offer.price}₽/ночь`;
  newCard.querySelector(`.popup__type`).textContent = HouseType[card.offer.type];
  newCard.querySelector(`.popup__text--capacity`).textContent = `${card.offer.rooms} комнаты для ${card.offer.guests} гостей`;
  newCard.querySelector(`.popup__text--time`).textContent = `Заезд после ` + card.offer.checkin + `, выезд до ` + card.offer.checkout;

  popupAvatar.src = card.author.avatar;
  if (card.author.avatar === (undefined || ``)) {
    popupAvatar.remove();
  }

  popupDescription.textContent = card.offer.description;
  if (card.offer.description === (undefined || ``)) {
    popupDescription.remove();
  }

  // Удаляем элементы, скопированые из шаблона.
  for (let i = 0; i < popupFeaturesList.length; i++) {
    popupFeatures.querySelector(`.popup__feature`).remove();
  }
  // Для доступных услуг, создаем и добавляем элементы в список попапа
  if (card.offer.features.length > 0) {
    card.offer.features.forEach(function (item) {
      const featureElement = document.createElement(`li`);
      featureElement.classList.add(`popup__feature`);
      featureElement.classList.add(`popup__feature--${item}`);
      popupFeatures.appendChild(featureElement);
    });
  } else {
    popupFeatures.remove();
  }

  // Удаляем элементы, скопированые из шаблона.
  popupPhotos.querySelector(`.popup__photo`).remove();
  // Для доступных фото жилья, создаем и добавляем элементы в список попап
  if (card.offer.photos.length > 0) {
    card.offer.photos.forEach(function (item) {
      const photoElement = document.createElement(`img`);
      photoElement.classList.add(`popup__photo`);
      photoElement.width = AD_PHOTO_WIDTH;
      photoElement.height = AD_PHOTO_HEIGHT;
      photoElement.alt = `Фотография жилья`;
      photoElement.src = item;
      popupPhotos.appendChild(photoElement);
    });
  } else {
    popupPhotos.remove();
  }

  return newCard;
};

// Создаем и добавляем карточку обьявления на основе первого элемента из массива обьявлений
map.insertBefore(fragment.appendChild(createCard(dataArray[0])), mapFilterContainer);
