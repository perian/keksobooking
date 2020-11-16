"use strict";

(function () {
  window.load = (url, onSuccess, onError) => {
    const xhr = new XMLHttpRequest();

    xhr.responseType = `json`;

    xhr.open(`GET`, url);

    xhr.addEventListener(`load`, () => {
      let error;

      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;

        case 400:
          error = `Неверный запрос`;
          break;

        case 401:
          error = `Пользователь не авторизован`;
          break;

        case 403:
          error = `Доступ запрещен`;
          break;

        case 404:
          error = `Ничего не найдено`;
          break;

        default:
          error = `Cтатус ответа: ` + xhr.status + ` ` + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener(`error`, () => {
      onError(`Произошла ошибка соединения`);
    });

    xhr.timeout = 5000; // 5s

    xhr.addEventListener(`timeout`, () => {
      onError(`Произошла ошибка соединения`);
    });

    xhr.send();
  };
})();
