"use strict";

(function () {
  const NOT_FOR_GUESTS = 0;
  const HUNDRED_ROOMS = 100;
  const notification = document.querySelector(`.ad-form`);
  const notificationFieldsets = notification.querySelectorAll(`fieldset`);

  const address = notification.querySelector(`#address`);
  const mainPinWidth = window.map.mainPin.offsetWidth;
  const mainPinHeight = window.map.mainPin.offsetHeight;
  const mainPinX = window.map.mainPin.style.left;
  const mainPinY = window.map.mainPin.style.top;
  const coneHeight = window.getComputedStyle(window.map.mainPin, `:after`).borderTopWidth;

  // При открытии страницы, поля формы не активны
  window.map.toggleFormElementState(notificationFieldsets, true);

  // Находит координаты острия пина и записывает их в поле адреса
  const setAddressValue = () => {
    const coneX = Math.round(window.utils.transformPropertyToInteger(mainPinX) + (mainPinWidth / 2));
    const coneY = Math.round(window.utils.transformPropertyToInteger(mainPinY) + mainPinHeight + window.utils.transformPropertyToInteger(coneHeight));

    address.value = `${coneX}, ` + `${coneY}`;
  };
  setAddressValue();


  const roomCapacity = notification.querySelector(`#capacity`);
  const roomNumbers = notification.querySelector(`#room_number`);

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

  roomNumbers.addEventListener(`change`, checkRoomsCapacity);
  roomCapacity.addEventListener(`change`, checkRoomsCapacity);
  checkRoomsCapacity();

  // Проверка валидности поля "Заголовок объявления"
  const adTitle = notification.querySelector(`#title`);
  adTitle.addEventListener(`change`, () => {
    adTitle.reportValidity();
  });

  // Валидация соответствия полей "Тип жилья" и "Цена за ночь"
  const houseType = notification.querySelector(`#type`);
  const housePrice = notification.querySelector(`#price`);

  const checkHousePriceValidity = () => {
    const houseTypeValue = houseType.value;
    housePrice.setAttribute(`min`, window.data.HouseParameters[houseTypeValue].minPrice);
    housePrice.setAttribute(`placeholder`, window.data.HouseParameters[houseTypeValue].minPrice);
    housePrice.reportValidity();
  };

  houseType.addEventListener(`change`, checkHousePriceValidity);
  housePrice.addEventListener(`change`, checkHousePriceValidity);

  // Валидация соответствия полей "Время заезда" и "Время выезда"
  const moveInTime = notification.querySelector(`#timein`);
  const moveOutTime = notification.querySelector(`#timeout`);

  moveInTime.addEventListener(`change`, () => {
    moveOutTime.value = moveInTime.value;
  });
  moveOutTime.addEventListener(`change`, () => {
    moveInTime.value = moveOutTime.value;
  });

  window.form = {
    notification,
    notificationFieldsets
  };
})();
