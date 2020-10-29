"use strict";

(function () {
  const map = document.querySelector(`.map`);
  const mainPin = map.querySelector(`.map__pin--main`);
  const pins = document.querySelector(`.map__pins`);
  const fragment = document.createDocumentFragment();
  const filterContainer = document.querySelector(`.map__filters-container`);
  const filtersFieldsets = filterContainer.querySelectorAll(`fieldset`);
  const filtersSelects = filterContainer.querySelectorAll(`select`);

  const mainPinWidth = mainPin.offsetWidth;
  const mainPinHeight = mainPin.offsetHeight;
  const coneHeight = window.getComputedStyle(mainPin, `:after`).borderTopWidth;
  let mainPinX = window.utils.transformPropertyToInteger(mainPin.style.left);
  let mainPinY = window.utils.transformPropertyToInteger(mainPin.style.top);

  const updateAddressField = () => {
    const coneX = Math.round(mainPinX + (mainPinWidth / 2));
    const coneY = Math.round(mainPinY + mainPinHeight + window.utils.transformPropertyToInteger(coneHeight));
    window.form.setAddressValue(coneX, coneY);
  };

  pins.addEventListener(`click`, (evt) => {
    const target = evt.target.closest(`.map__pin:not(.map__pin--main)`);
    if (target) {
      const cardId = target.dataset.id;
      window.card.open(cardId, map, filterContainer);
    }
  });

  pins.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Enter` && evt.target.matches(`.map__pin`) && !(evt.target.matches(`.map__pin--main`))) {
      window.card.open(evt);
    }
  });

  window.utils.toggleFormElementState(filtersFieldsets, true);
  window.utils.toggleFormElementState(filtersSelects, true);

  const activate = () => {
    map.classList.remove(`map--faded`);

    for (let i = 0; i < window.data.ads.length; i++) {
      fragment.appendChild(window.createPin(window.data.ads[i]));
    }

    pins.appendChild(fragment);

    window.utils.toggleFormElementState(filtersFieldsets, false);
    window.utils.toggleFormElementState(filtersSelects, false);
  };


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

      window.form.setAddressValue(mainPinX, mainPinY);
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
    activate,
    domElement: map,
    pins,
    fragment,
    mainPin,
    mainPinX,
    mainPinY,
    filterContainer,
  };
})();
