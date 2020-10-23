"use strict";

(function () {
  const openCard = (evt) => {
    if (document.querySelector(`.map__card`)) {
      document.querySelector(`.map__card`).remove();
    }
    const clickedPin = evt.target.dataset.number;
    window.card.showCard(clickedPin);
  };

  window.main.mapPins.addEventListener(`click`, (evt) => {
    if (evt.target.matches(`img`) && !(evt.target.parentNode.matches(`.map__pin--main`))) {
      openCard(evt);
    }
  });

  window.main.mapPins.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Enter` && evt.target.matches(`.map__pin`) && !(evt.target.matches(`.map__pin--main`))) {
      openCard(evt);
    }
  });

  window.main.map.addEventListener(`click`, (evt) => {
    if (evt.target.matches(`.popup__close`)) {
      closeCard();
    }
  });

  window.main.map.addEventListener(`keydown`, (evt) => {
    if ((evt.key === `Escape`) || (evt.key === `Enter` && evt.target.matches(`.popup__close`))) {
      closeCard();
    }
  });

  const closeCard = () => {
    window.main.map.querySelector(`.map__card`, `popup`).remove();
  };
})();
