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
const AD_LOCATION_MIN_X = 0;
const AD_LOCATION_MIN_Y = 130;
const AD_LOCATION_MAX_Y = 630;
const AD_PHOTO_WIDTH = 45;
const AD_PHOTO_HEIGHT = 40;
const NOT_FOR_GUESTS = 0;
const HUNDRED_ROOMS = 100;
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const mapFilterContainer = document.querySelector(`.map__filters-container`);
const map = document.querySelector(`.map`);
const mapWidth = map.offsetWidth;

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

const createAds = (amount) => {
  const newAds = [];

  for (let i = 0; i < amount; i++) {
    const AD_LOCATION_X = getRandomInt(AD_LOCATION_MIN_X, mapWidth);
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
        description: `Вы захотите сюда вернуться!`,
        photos: getRandomArrayLength(PHOTOS),
        popupNumber: i,
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

const createPin = (pin) => {
  const newPin = pinTemplate.cloneNode(true);
  const pinImage = newPin.querySelector(`img`);
  newPin.style.left = pin.location.x - PIN_POINTER_X + `px`;
  newPin.style.top = pin.location.y - PIN_POINTER_Y + `px`;
  pinImage.src = pin.author.avatar;
  pinImage.alt = pin.offer.title;
  pinImage.dataset.number = pin.offer.popupNumber;
  newPin.dataset.number = pin.offer.popupNumber;
  return newPin;
};

const fragment = document.createDocumentFragment();
const mapPins = document.querySelector(`.map__pins`);

const activateMap = () => {
  map.classList.remove(`map--faded`);

  for (let i = 0; i < dataArray.length; i++) {
    fragment.appendChild(createPin(dataArray[i]));
  }

  mapPins.appendChild(fragment);

  toggleFormElementState(notificationFieldsets, false);
  toggleFormElementState(mapFiltersFieldsets, false);
  toggleFormElementState(mapFiltersSelects, false);

  notificationForm.classList.remove(`ad-form--disabled`);
  showCard(0);
};


const createCard = (card) => {
  const newCard = cardTemplate.cloneNode(true);
  const popupFeatures = newCard.querySelector(`.popup__features`);
  const popupPhotos = newCard.querySelector(`.popup__photos`);
  const popupDescription = newCard.querySelector(`.popup__description`);
  const popupAvatar = newCard.querySelector(`.popup__avatar`);

  newCard.querySelector(`.popup__title`).textContent = card.offer.title;
  newCard.querySelector(`.popup__text--address`).textContent = card.offer.address;
  newCard.querySelector(`.popup__text--price`).textContent = `${card.offer.price}₽/ночь`;
  newCard.querySelector(`.popup__type`).textContent = HouseData[card.offer.type].name;
  newCard.querySelector(`.popup__text--capacity`).textContent = `${card.offer.rooms} комнаты для ${card.offer.guests} гостей`;
  newCard.querySelector(`.popup__text--time`).textContent = `Заезд после ` + card.offer.checkin + `, выезд до ` + card.offer.checkout;

  if (!card.author.avatar) {
    popupAvatar.remove();
  } else {
    popupAvatar.src = card.author.avatar;
  }

  if (!card.offer.description) {
    popupDescription.remove();
  } else {
    popupDescription.textContent = card.offer.description;
  }

  // Для доступных услуг, создаем и добавляем элементы в список попапа
  if (card.offer.features.length) {
    popupFeatures.innerHTML = ``; // Удаляем элементы, скопированые из шаблона.

    card.offer.features.forEach(function (item) {
      const featureElement = document.createElement(`li`);
      featureElement.classList.add(`popup__feature`, `popup__feature--${item}`);
      popupFeatures.appendChild(featureElement);
    });
  } else {
    popupFeatures.remove();
  }

  // Для доступных фото жилья, создаем и добавляем элементы в список попап
  if (card.offer.photos.length) {
    popupPhotos.innerHTML = ``; // Удаляем элементы, скопированые из шаблона.

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

const showCard = (cardNumber) => {
  map.insertBefore(fragment.appendChild(createCard(dataArray[cardNumber])), mapFilterContainer);
};


// Неактивное состояние страницы
const notificationForm = document.querySelector(`.ad-form`);
const notificationFieldsets = notificationForm.querySelectorAll(`fieldset`);
const mapFiltersFieldsets = mapFilterContainer.querySelectorAll(`fieldset`);
const mapFiltersSelects = mapFilterContainer.querySelectorAll(`select`);

const toggleFormElementState = (domElements, state) => {
  domElements.forEach((value) => {
    value.disabled = state;
  });
};

toggleFormElementState(notificationFieldsets, true);
toggleFormElementState(mapFiltersFieldsets, true);
toggleFormElementState(mapFiltersSelects, true);


// Первое взаимодействие с меткой переводит страницу в активное состояние
const mainPin = map.querySelector(`.map__pin--main`);
const onEnterMouseClickActivateMap = (evt) => {
  if (evt.button === 0 || evt.key === `Enter`) {
    activateMap();
  }

  setAddressValue();

  mainPin.removeEventListener(`mousedown`, onEnterMouseClickActivateMap);
  mainPin.removeEventListener(`keydown`, onEnterMouseClickActivateMap);
};

mainPin.addEventListener(`mousedown`, onEnterMouseClickActivateMap);
mainPin.addEventListener(`keydown`, onEnterMouseClickActivateMap);

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


// Создаем и отрисовываем карточку , по клику на обьявление
const openCard = (evt) => {
  if (document.querySelector(`.map__card`)) {
    document.querySelector(`.map__card`).remove();
  }
  const clickedPin = evt.target.dataset.number;
  showCard(clickedPin);
};

mapPins.addEventListener(`click`, (evt) => {
  if (evt.target.matches(`img`) && !(evt.target.parentNode.matches(`.map__pin--main`))) {
    openCard(evt);
  }
});

mapPins.addEventListener(`keydown`, (evt) => {
  if (evt.key === `Enter` && evt.target.matches(`.map__pin`) && !(evt.target.matches(`.map__pin--main`))) {
    openCard(evt);
  }
});

map.addEventListener(`click`, (evt) => {
  if (evt.target.matches(`.popup__close`)) {
    closeCard();
  }
});

map.addEventListener(`keydown`, (evt) => {
  if ((evt.key === `Escape`) || (evt.key === `Enter` && evt.target.matches(`.popup__close`))) {
    closeCard();
  }
});

const closeCard = () => {
  map.querySelector(`.map__card`, `popup`).remove();
};


// Валидация соответствия полей "Количество мест" и "Количество комнат"
const roomCapacity = notificationForm.querySelector(`#capacity`);
const roomNumbers = notificationForm.querySelector(`#room_number`);

const checkRoomsCapacity = () => {
  roomCapacity.invalid = true;
  roomCapacity.reportValidity();

  let roomNumbersAmount = parseInt(roomNumbers.value, 10);
  let roomCapacityAmount = parseInt(roomCapacity.value, 10);

  if ((roomNumbersAmount < HUNDRED_ROOMS) && (roomCapacityAmount === NOT_FOR_GUESTS)) {
    roomCapacity.setCustomValidity(`Заселите хоть кого-нибудь!`);
  } else if (((roomNumbersAmount === HUNDRED_ROOMS)) && (roomCapacityAmount > NOT_FOR_GUESTS)) {
    roomCapacity.setCustomValidity(`Не для гостей`);
  } else if (roomNumbersAmount < roomCapacityAmount) {
    roomCapacity.setCustomValidity(`Максимум гостей ${roomNumbersAmount}`);
  } else {
    roomCapacity.valid = true;
    roomCapacity.setCustomValidity(``);
  }
};

roomNumbers.addEventListener(`change`, () => {
  checkRoomsCapacity();
});

roomCapacity.addEventListener(`change`, () => {
  checkRoomsCapacity();
});

checkRoomsCapacity();


// Валидация соответствия полей "Тип жилья" и "Цена за ночь"
const houseType = notificationForm.querySelector(`#type`);
const housePrice = notificationForm.querySelector(`#price`);

houseType.addEventListener(`change`, () => {
  let houseTypeValue = houseType.value;
  housePrice.setAttribute(`min`, HouseData[houseTypeValue].minPrice);
  housePrice.setAttribute(`placeholder`, HouseData[houseTypeValue].minPrice);
  housePrice.reportValidity();
});


// Валидация соответствия полей "Время заезда" и "Время выезда"
const moveInTime = notificationForm.querySelector(`#timein`);
const moveOutTime = notificationForm.querySelector(`#timeout`);

moveInTime.addEventListener(`change`, () => {
  moveOutTime.value = moveInTime.value;
});
moveOutTime.addEventListener(`change`, () => {
  moveInTime.value = moveOutTime.value;
});
