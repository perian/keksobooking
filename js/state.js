"use strict";

(function () {
  const activateMap = () => {
    window.main.map.classList.remove(`map--faded`);

    for (let i = 0; i < window.main.dataArray.length; i++) {
      window.main.fragment.appendChild(window.pin.createPin(window.main.dataArray[i]));
    }

    window.main.mapPins.appendChild(window.main.fragment);

    toggleFormElementState(notificationFieldsets, false);
    toggleFormElementState(mapFiltersFieldsets, false);
    toggleFormElementState(mapFiltersSelects, false);

    window.main.notificationForm.classList.remove(`ad-form--disabled`);
    window.card.showCard(0);
  };

  const notificationFieldsets = window.main.notificationForm.querySelectorAll(`fieldset`);
  const mapFiltersFieldsets = window.main.mapFilterContainer.querySelectorAll(`fieldset`);
  const mapFiltersSelects = window.main.mapFilterContainer.querySelectorAll(`select`);

  const toggleFormElementState = (domElements, state) => {
    domElements.forEach((value) => {
      value.disabled = state;
    });
  };

  toggleFormElementState(notificationFieldsets, true);
  toggleFormElementState(mapFiltersFieldsets, true);
  toggleFormElementState(mapFiltersSelects, true);

  const onEnterMouseClickActivateMap = (evt) => {
    if (evt.button === 0 || evt.key === `Enter`) {
      activateMap();
    }

    window.main.mainPin.removeEventListener(`mousedown`, onEnterMouseClickActivateMap);
    window.main.mainPin.removeEventListener(`keydown`, onEnterMouseClickActivateMap);
  };

  window.main.mainPin.addEventListener(`mousedown`, onEnterMouseClickActivateMap);
  window.main.mainPin.addEventListener(`keydown`, onEnterMouseClickActivateMap);
})();
