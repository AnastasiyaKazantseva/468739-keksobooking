'use strict';

(function () {
  var pinListElement = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  window.pin = {
    addPins: function (similarAds) {
      for (var i = 0; i < similarAds.length; i++) {
        (function () {
          var pinElement = pinTemplate.cloneNode(true);
          var data = similarAds[i];

          pinElement.style = 'left: ' + window.map.toMapCoordinates(data.location.x, 0) + 'px; top: ' + window.map.toMapCoordinates(0, data.location.y) + 'px;';
          pinElement.querySelector('img').src = data.author.avatar;
          pinElement.querySelector('img').alt = data.offer.title;
          pinListElement.appendChild(pinElement);

          var onPinEnterPress = function (evt) {
            if (!evt.keyCode || evt.keyCode === window.map.ENTER_KEYCODE) {
              window.card.addPopup(data);
            }
          };

          pinElement.addEventListener('click', onPinEnterPress);

          pinElement.addEventListener('keydown', onPinEnterPress);
        }());
      }
    }
  };
})();
