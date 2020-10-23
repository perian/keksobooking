"use strict";

(function () {
  const PIN_WIDTH = 50;
  const PIN_HEIGHT = 70;
  const PIN_POINTER_X = PIN_WIDTH / 2;
  const PIN_POINTER_Y = PIN_HEIGHT / 2;
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

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

  window.pin = {
    createPin,
  };
})();
