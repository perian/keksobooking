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

  window.map = {
    domElement: map,
    pins,
    fragment,
    mainPin,
    filterContainer,
    toggleFormElementState,
  };
})();
