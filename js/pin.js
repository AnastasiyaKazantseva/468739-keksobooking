'use strict';

(function () {
  var pinListElement = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

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

  var filters = {
    type: function (value, ad) {
      return value === 'any' || value === ad.offer.type;
    },
    price: function (value, ad) {
      return value === 'any' || priceFilters[value](ad.offer.price);
    },
    rooms: function (value, ad) {
      return value === 'any' || value === ad.offer.rooms + '';
    },
    guests: function (value, ad) {
      return value === 'any' || value === ad.offer.guests + '';
    },
    wifi: function (value, ad) {
      return value === false || value === (ad.offer.features.indexOf('wifi') !== -1);
    },
    dishwasher: function (value, ad) {
      return value === false || value === (ad.offer.features.indexOf('dishwasher') !== -1);
    },
    parking: function (value, ad) {
      return value === false || value === (ad.offer.features.indexOf('parking') !== -1);
    },
    washer: function (value, ad) {
      return value === false || value === (ad.offer.features.indexOf('washer') !== -1);
    },
    elevator: function (value, ad) {
      return value === false || value === (ad.offer.features.indexOf('elevator') !== -1);
    },
    conditioner: function (value, ad) {
      return value === false || value === (ad.offer.features.indexOf('conditioner') !== -1);
    }
  };

  window.pin = {
    add: function (data) {
      var pinElement = pinTemplate.cloneNode(true);

      pinElement.style = 'left: ' + window.map.toMapCoordinates(data.location.x, 0) + 'px; top: ' + window.map.toMapCoordinates(0, data.location.y) + 'px;';
      pinElement.querySelector('img').src = data.author.avatar;
      pinElement.querySelector('img').alt = data.offer.title;
      pinListElement.appendChild(pinElement);

      var onPinEnterPress = function (evt) {
        if (!evt.keyCode || evt.keyCode === window.utils.ENTER_KEYCODE) {
          window.card.addPopup(data);
        }
      };

      pinElement.addEventListener('click', onPinEnterPress);

      pinElement.addEventListener('keydown', onPinEnterPress);
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
