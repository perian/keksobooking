"use strict";

(function () {
  const MAIN_CLICK = 0;
  const map = document.querySelector(`.map`);
  const mainPin = map.querySelector(`.map__pin--main`);
  const pins = document.querySelector(`.map__pins`);
  const fragment = document.createDocumentFragment();
  const filterContainer = document.querySelector(`.map__filters-container`);
  const filtersFieldsets = filterContainer.querySelectorAll(`fieldset`);
  const filtersSelects = filterContainer.querySelectorAll(`select`);

  const toggleFormElementState = (domElements, state) => {
    domElements.forEach((value) => {
      value.disabled = state;
    });
  };

  toggleFormElementState(filtersFieldsets, true);
  toggleFormElementState(filtersSelects, true);

  const activatePage = () => {
    map.classList.remove(`map--faded`);

    for (let i = 0; i < window.data.dataArray.length; i++) {
      fragment.appendChild(window.createPin(window.data.dataArray[i]));
    }

    pins.appendChild(fragment);

    toggleFormElementState(window.form.notificationFieldsets, false);
    toggleFormElementState(filtersFieldsets, false);
    toggleFormElementState(filtersSelects, false);

    window.form.notification.classList.remove(`ad-form--disabled`);
  };

  const onPinPush = (evt) => {
    if (evt.button === MAIN_CLICK || evt.key === `Enter`) {
      activatePage();
    }

    mainPin.removeEventListener(`mousedown`, onPinPush);
    mainPin.removeEventListener(`keydown`, onPinPush);
  };

  mainPin.addEventListener(`mousedown`, onPinPush);
  mainPin.addEventListener(`keydown`, onPinPush);

let mainPinX;
let mainPinY;
  mainPin.addEventListener(`mousedown`, (evt) => {
    evt.preventDefault();

    let startCoordinates = {
      x: evt.clientX,
      y: evt.clientY,
    };

    const onMouseMove = (moveEvt) => {
      moveEvt.preventDefault();

      let shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY,
      };

      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      mainPinX = (mainPin.offsetLeft - shift.x) + `px`;
      mainPinY = (mainPin.offsetTop - shift.y) + `px`;

      mainPin.style.left = mainPinX;
      mainPin.style.top = mainPinY;
    };

    const onMouseUp = (upEvt) => {
      upEvt.preventDefault();

      mainPin.removeEventListener(`mouseup`, onMouseUp);
      mainPin.removeEventListener(`mousemove`, onMouseMove);
    };

    mainPin.addEventListener(`mouseup`, onMouseUp);
    mainPin.addEventListener(`mousemove`, onMouseMove);
  });

  window.map = {
    domElement: map,
    pins,
    fragment,
    mainPin,
    mainPinX,
    mainPinY,
    filterContainer,
    toggleFormElementState,
  };
})();
