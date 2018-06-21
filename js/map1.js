'use strict';

var AD_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var AD_TYPES = [
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
];

var AD_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var AD_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var AD_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var pinListElement = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapListElement = document.querySelector('.map');
var mapTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapFilters = document.querySelector('.map__filters-container');
var typeDictionary = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var sortElements = function (array) {
  return array.sort(function () {
    return 0.5 - Math.random();
  });
};

var getFeatures = function () {
  var count = Math.floor(Math.random() * AD_FEATURES.length);
  return sortElements(AD_FEATURES.slice()).splice(0, count);
};

var addLeadingZeros = function (value, needingLenght) {
  var stringValue = '' + value;
  while (stringValue.length < needingLenght) {
    stringValue = '0' + stringValue;
  }
  return stringValue;
};

var getAds = function () {
  var similarAds = [];
  for (var i = 0; i < 8; i++) {
    var locationX = 300 + Math.round(600 * Math.random());
    var locationY = 130 + Math.round(500 * Math.random());
    var currentPhotos = AD_PHOTOS.slice();
    var currentTypes = AD_TYPES.slice();
    similarAds[i] = {
      'author': {
        'avatar': 'img/avatars/user' + addLeadingZeros(i + 1, 2) + '.png'
      },
      'offer': {
        'title': AD_TITLES[i],
        'address': locationX + ', ' + locationY,
        'price': 1000 + Math.round(999000 * Math.random()),
        'type': sortElements(currentTypes)[0].type,
        'rooms': 1 + Math.round(99 * Math.random()),
        'guests': 1 + Math.round(2 * Math.random()),
        'checkin': sortElements(AD_TIMES)[0],
        'checkout': sortElements(AD_TIMES)[0],
        'features': getFeatures(),
        'description': '',
        'photos': sortElements(currentPhotos)
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };
  }
  return similarAds;
};

var addPins = function (similarAds) {
  for (var i = 0; i < similarAds.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style = 'left: ' + similarAds[i].location.x + 'px; top: ' + similarAds[i].location.y + 'px;';
    pinElement.querySelector('img').src = similarAds[i].author.avatar;
    pinElement.querySelector('img').alt = similarAds[i].offer.title;
    pinListElement.appendChild(pinElement);

    var openPopup = function (evt) {
      for (var j = 0; j < similarAds.length; j++) {
        if ((similarAds[j].offer.title === evt.target.alt) ||
          (evt.target.firstChild !== null && similarAds[j].offer.title === evt.target.firstChild.alt)) {
          addPopup(similarAds[j]);
        }
      }
    };

    var onPopupEnterPress = function (evt) {
      if (!evt.keyCode || evt.keyCode === ENTER_KEYCODE) {
        openPopup(evt);
      }
    };

    pinElement.addEventListener('click', onPopupEnterPress);
    pinElement.addEventListener('keydown', onPopupEnterPress);
  }
};

var mapPinMain = document.querySelector('.map__pin--main');

var pinMainDimensions = getComputedStyle(mapPinMain);

var locationPinMain = document.querySelector('#address');

var pinInactiveCoordinates = Math.round((parseInt(mapPinMain.style.left, 10) + parseInt(pinMainDimensions.width, 10) / 2)) + ', ' + Math.round((parseInt(mapPinMain.style.top, 10) + parseInt(pinMainDimensions.height, 10) / 2));

locationPinMain.setAttribute('value', pinInactiveCoordinates);

var addForm = document.querySelector('.ad-form');

var similarAds = getAds();

mapPinMain.addEventListener('mousedown', function (evt) {
  var fieldsets = addForm.querySelectorAll('fieldset');

  mapListElement.classList.remove('map--faded');
  addForm.classList.remove('ad-form--disabled');

  for (var f = 0; f < fieldsets.length; f++) {
    fieldsets[f].removeAttribute('disabled');
  }

  addPins(similarAds);

  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var mapBlock = document.querySelector('body');

  var mapDimensions = getComputedStyle(mapBlock);

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    if ((mapPinMain.offsetTop - shift.y) > (630 - parseInt(pinMainDimensions.height, 10))) {
      mapPinMain.style.top = (630 - parseInt(pinMainDimensions.height, 10)) + 'px';
    } else if ((mapPinMain.offsetTop - shift.y) < 130) {
      mapPinMain.style.top = 130 + 'px';
    } else {
      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
    }

    if ((mapPinMain.offsetLeft - shift.x) > (parseInt(mapDimensions.width, 10) - parseInt(pinMainDimensions.width, 10))) {
      mapPinMain.style.left = (parseInt(mapDimensions.width, 10) - parseInt(pinMainDimensions.width, 10)) + 'px';
    } else if ((mapPinMain.offsetLeft - shift.x) < 0) {
      mapPinMain.style.left = 0 + 'px';
    } else {
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
    }

    var pinСoordinates = Math.round((parseInt(mapPinMain.style.left, 10) + parseInt(pinMainDimensions.width, 10) / 2)) + ', ' + Math.round(parseInt(mapPinMain.style.top, 10) + parseInt(pinMainDimensions.height, 10));

    locationPinMain.setAttribute('value', pinСoordinates);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    var pinСoordinates = Math.round((parseInt(mapPinMain.style.left, 10) + parseInt(pinMainDimensions.width, 10) / 2)) + ', ' + Math.round(parseInt(mapPinMain.style.top, 10) + parseInt(pinMainDimensions.height, 10));

    locationPinMain.setAttribute('value', pinСoordinates);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

var addPopup = function (currentAd) {
  closePopup();

  var popupElement = mapTemplate.cloneNode(true);

  popupElement.querySelector('.popup__title').textContent = currentAd.offer.title;
  popupElement.querySelector('.popup__text--address').textContent = currentAd.offer.address;
  popupElement.querySelector('.popup__text--price').textContent = currentAd.offer.price + '₽/ночь';
  popupElement.querySelector('.popup__type').textContent = typeDictionary[currentAd.offer.type];
  popupElement.querySelector('.popup__text--capacity').textContent = currentAd.offer.rooms + ' комнат (-ы) для ' + currentAd.offer.guests + ' гостя (-ей)';
  popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + currentAd.offer.checkin + ', выезд до ' + currentAd.offer.checkout;
  popupElement.querySelector('.popup__description').textContent = currentAd.offer.description;
  popupElement.querySelector('.popup__avatar').src = currentAd.author.avatar;

  var insertedMapListElement = mapListElement.insertBefore(popupElement, mapFilters);
  var photoTemplate = insertedMapListElement.querySelector('.popup__photo');
  photoTemplate.src = currentAd.offer.photos[0];

  for (var j = 1; j < currentAd.offer.photos.length; j++) {
    var photoNext = photoTemplate.cloneNode(true);
    photoNext.src = currentAd.offer.photos[j];
    photoTemplate.parentNode.appendChild(photoNext);
  }

  var featuresList = insertedMapListElement.querySelector('.popup__features');

  for (var g = 0; g < AD_FEATURES.length; g++) {
    if (currentAd.offer.features.indexOf(AD_FEATURES[g]) === -1) {
      var deleteElement = featuresList.querySelector('.popup__feature--' + AD_FEATURES[g]);
      featuresList.removeChild(deleteElement);
    }
  }

  var popupClose = document.querySelector('.popup__close');

  popupClose.addEventListener('click', onPopupClosePress);
  popupClose.addEventListener('keydown', onPopupClosePress);
};

var onPopupClosePress = function (evt) {
  if (!evt.keyCode || (evt.keyCode === ENTER_KEYCODE && evt.target.tagName !== 'INPUT')) {
    closePopup();
  }
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

document.addEventListener('keydown', onPopupEscPress);

var closePopup = function () {
  var oldPopup = document.querySelector('.map__card');
  if (oldPopup) {
    oldPopup.parentNode.removeChild(oldPopup);
  }
};

var typeSelect = document.getElementById('type');
var priceInput = document.getElementById('price');

typeSelect.addEventListener('change', function () {
  var i = typeSelect.selectedIndex;
  priceInput.min = AD_TYPES[i].minprice;
  priceInput.placeholder = AD_TYPES[i].minprice;
});

var timeInSelect = document.getElementById('timein');
var timeOutSelect = document.getElementById('timeout');

timeInSelect.addEventListener('change', function () {
  timeOutSelect.value = timeInSelect.value;
});

timeOutSelect.addEventListener('change', function () {
  timeInSelect.value = timeOutSelect.value;
});

var roomNumber = document.getElementById('room_number');
var capacity = document.getElementById('capacity');

var checkRoomCapacity = function () {
  if ((roomNumber.value === '100' && capacity.value !== '0') || (roomNumber.value !== '100' && capacity.value === '0')) {
    roomNumber.setCustomValidity('не для гостей');
  } else if (capacity.value > roomNumber.value) {
    if (roomNumber.value === '2') {
      roomNumber.setCustomValidity('для 1-го или 2-х гостей');
    } else if (roomNumber.value === '1') {
      roomNumber.setCustomValidity('для 1-го гостя');
    }
  } else {
    roomNumber.setCustomValidity('');
  }
};

checkRoomCapacity();

roomNumber.addEventListener('change', checkRoomCapacity);
capacity.addEventListener('change', checkRoomCapacity);


