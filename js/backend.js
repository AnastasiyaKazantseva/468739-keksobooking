'use strict';

(function () {
  var request = function (data, onLoad, onError, type, URL) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    xhr.timeout = 10000;
    xhr.open(type, URL);
    xhr.send(data);
  };

  window.backend = {
    upload: function (data, onLoad, onError) {
      request(data, onLoad, onError, 'POST', 'https://js.dump.academy/keksobooking');
    },

    load: function (onLoad, onError) {
      request(null, onLoad, onError, 'GET', 'https://js.dump.academy/keksobooking/data');
    }
  };
})();
