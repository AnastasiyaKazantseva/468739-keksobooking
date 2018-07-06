'use strict';

(function () {
  var pin = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var toMapCoordinates = function (x, y) {
    var left = x - window.pin.WIDTH / 2;
    var top = y - window.pin.HEIGHT;

    return 'left: ' + left + 'px; top: ' + top + 'px';
  };

  var priceFilters = {
    low: function (value) {
      return value < 10000;
    },
    middle: function (value) {
      return value >= 10000 && value < 50000;
    },
    high: function (value) {
      return value >= 50000;
    }
  };

  var makeValueFilter = function (name) {
    return function (value, ad) {
      return value === 'any' || value === ad.offer[name] + '';
    };
  };

  var makeBoolFilter = function (name) {
    return function (value, ad) {
      return !value || ad.offer.features.includes(name);
    };
  };

  var filters = {
    type: makeValueFilter('type'),
    price: function (value, ad) {
      return value === 'any' || priceFilters[value](ad.offer.price);
    },
    rooms: makeValueFilter('rooms'),
    guests: makeValueFilter('guests'),
    wifi: makeBoolFilter('wifi'),
    dishwasher: makeBoolFilter('dishwasher'),
    parking: makeBoolFilter('parking'),
    washer: makeBoolFilter('washer'),
    elevator: makeBoolFilter('elevator'),
    conditioner: makeBoolFilter('conditioner')
  };

  window.pin = {
    WIDTH: 50,
    HEIGHT: 70,

    add: function (data) {
      var pinClone = pinTemplate.cloneNode(true);

      pinClone.style = toMapCoordinates(data.location.x, data.location.y);
      pinClone.querySelector('img').src = data.author.avatar;
      pinClone.querySelector('img').alt = data.offer.title;
      pin.appendChild(pinClone);

      var onPinEnterPress = function (evt) {
        if (!evt.keyCode || evt.keyCode === window.utils.ENTER_KEYCODE) {
          window.card.add(data);
        }
      };

      pinClone.addEventListener('click', onPinEnterPress);

      pinClone.addEventListener('keydown', onPinEnterPress);
    },

    clearAll: function () {
      var oldPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var i = 0; i < oldPins.length; i++) {
        oldPins[i].remove();
      }
    },

    renderAll: function () {
      var ads = window.state.ads.filter(function (ad) {
        return Object.keys(filters).every(function (name) {
          return filters[name](window.state.filters[name], ad);
        });
      }).slice(0, 5);

      window.pin.clearAll();
      ads.forEach(window.pin.add);
    }
  };
}());
