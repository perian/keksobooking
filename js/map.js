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
  let mainPinX = mainPin.style.left;
  let mainPinY = mainPin.style.top;
  const mainPinLimits = {
    top: 630,
    bottom: 130,
    right: map.offsetWidth - mainPinWidth / 2,
    left: 0 - mainPinWidth / 2,
  };

  const updateAddressField = (x, y) => {
    mainPinX = Math.round(window.utils.transformPropertyToInteger(x) + (mainPinWidth / 2));
    mainPinY = Math.round(window.utils.transformPropertyToInteger(y) + (mainPinHeight / 2));

    if (!map.classList.contains(`map--faded`)) {
      mainPinY += Math.round(window.utils.transformPropertyToInteger(coneHeight) + (mainPinHeight / 2));
    }
    window.form.setAddressValue(mainPinX, mainPinY);
  };
  updateAddressField(mainPinX, mainPinY);

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
    updateAddressField(mainPin.style.left, mainPin.style.top);

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

      mainPinX = (mainPin.offsetLeft - shift.x);
      mainPinY = (mainPin.offsetTop - shift.y);

      const relocate = (x, y) => {
        mainPin.style.left = x + `px`;
        mainPin.style.top = y + `px`;

        mainPinX = mainPin.style.left;
        mainPinY = mainPin.style.top;

        return (mainPinX, mainPinY);
      };

      const checkMainPinLimits = () => {
        if (mainPinX > mainPinLimits.right) {
          mainPinX = mainPinLimits.right;
        } else if (mainPinX < mainPinLimits.left) {
          mainPinX = mainPinLimits.left;
        }
        if (mainPinY > mainPinLimits.top) {
          mainPinY = mainPinLimits.top;
        } else if (mainPinY < mainPinLimits.bottom) {
          mainPinY = mainPinLimits.bottom;
        }
        relocate(mainPinX, mainPinY);
      };
      checkMainPinLimits();

      updateAddressField(mainPinX, mainPinY);
    };

    const onMouseUp = (upEvt) => {

      upEvt.preventDefault();

      document.removeEventListener(`mouseup`, onMouseUp);
      document.removeEventListener(`mousemove`, onMouseMove);
    };

    document.addEventListener(`mouseup`, onMouseUp);
    document.addEventListener(`mousemove`, onMouseMove);
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
    updateAddressField,
  };
})();
