'use strict';

(function () {
  var type = document.getElementById('housing-type');
  var price = document.getElementById('housing-price');
  var rooms = document.getElementById('housing-rooms');
  var guests = document.getElementById('housing-guests');
  var wifi = document.getElementById('filter-wifi');
  var dishwasher = document.getElementById('filter-dishwasher');
  var parking = document.getElementById('filter-parking');
  var washer = document.getElementById('filter-washer');
  var elevator = document.getElementById('filter-elevator');
  var conditioner = document.getElementById('filter-conditioner');

  var deletePin = function (offerTitle) {
    var oldPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < oldPin.length; i++) {
      if (oldPin[i].querySelector('img').alt === offerTitle) {
        window.map.deleteElement(oldPin[i]);
      }
    }
  };

  var identifyPriceRange = function (index) {
    var priceRange;

    if (window.data.similarAds[index].offer.price <= 10000) {
      priceRange = 'low';
    } else if (window.data.similarAds[index].offer.price > 10000 && window.data.similarAds[index].offer.price <= 50000) {
      priceRange = 'middle';
    } else {
      priceRange = 'high';
    }

    return priceRange;
  };

  var toRemove = function (index) {
    var flag = false;

    if ((window.data.similarAds[index].offer.type !== type.value && type.value !== 'any') ||
        (identifyPriceRange(index) !== price.value && price.value !== 'any') ||
        (window.data.similarAds[index].offer.rooms + '' !== rooms.value && rooms.value !== 'any') ||
        (window.data.similarAds[index].offer.guests + '' !== guests.value && guests.value !== 'any') ||
        (wifi.checked && window.data.similarAds[index].offer.features.indexOf('wifi') === -1) ||
        (dishwasher.checked && window.data.similarAds[index].offer.features.indexOf('dishwasher') === -1) ||
        (parking.checked && window.data.similarAds[index].offer.features.indexOf('parking') === -1) ||
        (washer.checked && window.data.similarAds[index].offer.features.indexOf('washer') === -1) ||
        (elevator.checked && window.data.similarAds[index].offer.features.indexOf('elevator') === -1) ||
        (conditioner.checked && window.data.similarAds[index].offer.features.indexOf('conditioner') === -1)) {
      flag = true;
    }
    return flag;
  };

  var toAdd = function (index) {
    var flag = false;

    if ((window.data.similarAds[index].offer.type === type.value || type.value === 'any') &&
        (identifyPriceRange(index) === price.value || price.value === 'any') &&
        (window.data.similarAds[index].offer.rooms + '' === rooms.value || rooms.value === 'any') &&
        (window.data.similarAds[index].offer.guests + '' === guests.value || guests.value === 'any') &&
        ((wifi.checked && window.data.similarAds[index].offer.features.indexOf('wifi') !== -1) || (!wifi.checked)) &&
        ((dishwasher.checked && window.data.similarAds[index].offer.features.indexOf('dishwasher') !== -1) || (!dishwasher.checked)) &&
        ((parking.checked && window.data.similarAds[index].offer.features.indexOf('parking') !== -1) || (!parking.checked)) &&
        ((washer.checked && window.data.similarAds[index].offer.features.indexOf('washer') !== -1) || (!washer.checked)) &&
        ((elevator.checked && window.data.similarAds[index].offer.features.indexOf('elevator') !== -1) || (!elevator.checked)) &&
        ((conditioner.checked && window.data.similarAds[index].offer.features.indexOf('conditioner') !== -1) || (!conditioner.checked))) {
      flag = true;
    }

    return flag;
  };

  var onFilterPress = window.debounce(function () {
    var oldPopup = document.querySelector('.map__card');
    window.map.deleteElement(oldPopup);

    var notShownPins = [];

    for (var i = 0; i < window.data.similarAds.length; i++) {
      if (window.data.indexAds.indexOf(i) === -1) {
        notShownPins.push(i);
      }
    }

    for (var j = window.data.indexAds.length - 1; j >= 0; j--) {
      if (toRemove(window.data.indexAds[j])) {
        deletePin(window.data.similarAds[window.data.indexAds[j]].offer.title);
        window.data.indexAds.splice(j, 1);
      }
    }

    for (var k = 5; k < window.data.indexAds.length; k++) {
      deletePin(window.data.similarAds[window.data.indexAds[k]].offer.title);
    }

    window.data.indexAds.splice(5);

    for (var l = notShownPins.length - 1; l >= 0; l--) {
      if (window.data.indexAds.length < 5 && notShownPins.length > 0 && toAdd(notShownPins[l])) {
        window.data.indexAds.push(notShownPins[l]);
        window.pin.addPins(window.data.similarAds[notShownPins[l]]);
      }

      notShownPins.splice(l, 1);
    }
  });

  type.addEventListener('change', onFilterPress);
  price.addEventListener('change', onFilterPress);
  rooms.addEventListener('change', onFilterPress);
  guests.addEventListener('change', onFilterPress);
  wifi.addEventListener('click', onFilterPress);
  dishwasher.addEventListener('click', onFilterPress);
  parking.addEventListener('click', onFilterPress);
  washer.addEventListener('click', onFilterPress);
  elevator.addEventListener('click', onFilterPress);
  conditioner.addEventListener('click', onFilterPress);
})();

