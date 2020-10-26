"use strict";

(function () {
  const AD_PHOTO_WIDTH = 45;
  const AD_PHOTO_HEIGHT = 40;
  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

  const createCard = (card) => {
    const newCard = cardTemplate.cloneNode(true);
    const popupFeatures = newCard.querySelector(`.popup__features`);
    const popupPhotos = newCard.querySelector(`.popup__photos`);
    const popupDescription = newCard.querySelector(`.popup__description`);
    const popupAvatar = newCard.querySelector(`.popup__avatar`);

    newCard.querySelector(`.popup__title`).textContent = card.offer.title;
    newCard.querySelector(`.popup__text--address`).textContent = card.offer.address;
    newCard.querySelector(`.popup__text--price`).textContent = `${card.offer.price}₽/ночь`;
    newCard.querySelector(`.popup__type`).textContent = window.data.HouseParameters[card.offer.type].name;
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

  // Открытие/закрытие карточки обьявления, после нажатия на пин
  const showCard = (id) => {
    window.map.domElement.insertBefore(window.map.fragment.appendChild(createCard(window.data.dataArray[id])), window.map.filterContainer);
  };

  const openCard = (evt) => {
    if (document.querySelector(`.map__card`)) {
      document.querySelector(`.map__card`).remove();
    }
    const clickedPin = evt.target.dataset.id;
    showCard(clickedPin);
  };

  window.map.pins.addEventListener(`click`, (evt) => {
    if (evt.target.matches(`img`) && !(evt.target.parentNode.matches(`.map__pin--main`))) {
      openCard(evt);
    }
  });

  window.map.pins.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Enter` && evt.target.matches(`.map__pin`) && !(evt.target.matches(`.map__pin--main`))) {
      openCard(evt);
    }
  });

  window.map.domElement.addEventListener(`click`, (evt) => {
    if (evt.target.matches(`.popup__close`)) {
      closeCard();
    }
  });

  window.map.domElement.addEventListener(`keydown`, (evt) => {
    if ((evt.key === `Escape`) || (evt.key === `Enter` && evt.target.matches(`.popup__close`))) {
      closeCard();
    }
  });

  const closeCard = () => {
    window.map.domElement.querySelector(`.map__card`).remove();
  };
})();
