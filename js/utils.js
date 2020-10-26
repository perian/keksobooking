"use strict";

(function () {
  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomArrayElement = (array) => {
    const randomInt = getRandomInt(0, array.length - 1);
    return array[randomInt];
  }; // не включает максимальное значение

  const getRandomArrayLength = (array) => {
    const newArrayLength = getRandomInt(0, array.length);
    return array.slice(0, newArrayLength);
  };

  const transformPropertyToInteger = (property) => {
    return parseInt(property.replace(`px`, ``), 10);
  };

  window.utils = {
    getRandomInt,
    getRandomArrayElement,
    getRandomArrayLength,
    transformPropertyToInteger,
  };
})();
