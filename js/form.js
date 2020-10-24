"use strict";

(function () {
  const NOT_FOR_GUESTS = 0;
  const HUNDRED_ROOMS = 100;

  const roomCapacity = window.main.notificationForm.querySelector(`#capacity`);
  const roomNumbers = window.main.notificationForm.querySelector(`#room_number`);

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

  const adTitle = window.main.notificationForm.querySelector(`#title`);
  adTitle.addEventListener(`change`, () => {
    adTitle.reportValidity();
  });

  // Валидация соответствия полей "Тип жилья" и "Цена за ночь"
  const houseType = window.main.notificationForm.querySelector(`#type`);
  const housePrice = window.main.notificationForm.querySelector(`#price`);

  const checkHousePriceValidity = () => {
    const houseTypeValue = houseType.value;
    housePrice.setAttribute(`min`, window.main.HouseData[houseTypeValue].minPrice);
    housePrice.setAttribute(`placeholder`, window.main.HouseData[houseTypeValue].minPrice);
    housePrice.reportValidity();
  };

  houseType.addEventListener(`change`, checkHousePriceValidity);
  housePrice.addEventListener(`change`, checkHousePriceValidity);


  // Валидация соответствия полей "Время заезда" и "Время выезда"
  const moveInTime = window.main.notificationForm.querySelector(`#timein`);
  const moveOutTime = window.main.notificationForm.querySelector(`#timeout`);

  moveInTime.addEventListener(`change`, () => {
    moveOutTime.value = moveInTime.value;
  });
  moveOutTime.addEventListener(`change`, () => {
    moveInTime.value = moveOutTime.value;
  });
})();
