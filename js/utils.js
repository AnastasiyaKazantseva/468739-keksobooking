'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  window.utils = {
    ENTER_KEYCODE: 13,
    ESC_KEYCODE: 27,
    MIN_PRICES: [
      0,
      1000,
      5000,
      10000
    ],

    FEATURES: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],

    FILTERS: [
      'type',
      'price',
      'rooms',
      'guests'
    ],

    typeDictionary: {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    },

    clamp: function (min, max, value) {
      return Math.min(max, Math.max(min, value));
    },

    debounce: function (fun) {
      var lastTimeout = null;

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          fun.apply(null, args);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
