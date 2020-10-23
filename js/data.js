"use strict";

(function () {
  const HOUSE_TYPE = [`palace`, `flat`, `house`, `bungalow`];
  const CHECK_IN_OUT_TIMINGS = [`12:00`, `13:00`, `14:00`];
  const FEAUTURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
  const ROOMS = [1, 2, 3, 100];
  const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
  const MIN_PRICE = 0;
  const MAX_PRICE = 1000000;
  const MIN_GUEST = 1;
  const MAX_GUEST = 3;
  const AD_LOCATION_MIN_X = 0;
  const AD_LOCATION_MIN_Y = 130;
  const AD_LOCATION_MAX_Y = 630;
  const ADS_AMOUNT = 8;
  const mapWidth = window.main.map.offsetWidth;

  const createAds = (amount) => {
    const newAds = [];

    for (let i = 0; i < amount; i++) {
      const AD_LOCATION_X = window.main.getRandomInt(AD_LOCATION_MIN_X, mapWidth);
      const AD_LOCATION_Y = window.main.getRandomInt(AD_LOCATION_MIN_Y, AD_LOCATION_MAX_Y);

      const dataTemplate = {
        author: {
          avatar: `img/avatars/user0` + (i + 1) + `.png`,
        },
        offer: {
          title: `Уютное жилье`,
          address: `${AD_LOCATION_X}, ${AD_LOCATION_Y}`,
          price: window.main.getRandomInt(MIN_PRICE, MAX_PRICE),
          type: window.main.getRandomArrayElement(HOUSE_TYPE),
          rooms: window.main.getRandomArrayElement(ROOMS),
          guests: window.main.getRandomInt(MIN_GUEST, MAX_GUEST),
          checkin: window.main.getRandomArrayElement(CHECK_IN_OUT_TIMINGS),
          checkout: window.main.getRandomArrayElement(CHECK_IN_OUT_TIMINGS),
          features: window.main.getRandomArrayLength(FEAUTURES),
          description: `Вы захотите сюда вернуться!`,
          photos: window.main.getRandomArrayLength(PHOTOS),
          popupNumber: i,
        },
        location: {
          x: AD_LOCATION_X,
          y: AD_LOCATION_Y,
        }
      };

      newAds.push(dataTemplate);
    }

    return newAds;
  };

  const dataArray = createAds(ADS_AMOUNT);


  window.data = {
    createAds,
    dataArray,
  };
})();
