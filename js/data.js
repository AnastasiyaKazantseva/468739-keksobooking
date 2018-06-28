'use strict';

(function () {
  window.data = {
    AD_TYPES: [
      {
        'type': 'bungalo',
        'minprice': 0
      },
      {
        'type': 'flat',
        'minprice': 1000
      },
      {
        'type': 'house',
        'minprice': 5000
      },
      {
        'type': 'palace',
        'minprice': 10000
      }
    ],

    AD_FEATURES: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],

    typeDictionary: {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    },

    onLoad: function (similarAds) {
      for (var i = 0; i < similarAds.length; i++) {
        window.pin.addPins(similarAds[i]);
      }
    },

    onError: function (errorMessage) {
      var node = document.createElement('div');
      node.classList.add('success');

      var message = document.createElement('p');
      message.classList.add('success__message');
      message.textContent = errorMessage;

      document.body.insertAdjacentElement('afterbegin', node);
      node.insertAdjacentElement('afterbegin', message);

      var onOverlayClosePress = function (evt) {
        if (!evt.keyCode || evt.keyCode === window.map.ESC_KEYCODE) {
          node.classList.add('hidden');
        }
      };

      node.addEventListener('click', onOverlayClosePress);
      document.addEventListener('keydown', onOverlayClosePress);
    }
  };
})();
