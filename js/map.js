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
  'palace',
  'flat',
  'house',
  'bungalo'
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

var mapToggle = document.querySelector('.map');
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
    similarAds[i] = {
      'author': {
        'avatar': 'img/avatars/user' + addLeadingZeros(i + 1, 2) + '.png'
      },
      'offer': {
        'title': AD_TITLES[i],
        'address': locationX + ', ' + locationY,
        'price': 1000 + Math.round(999000 * Math.random()),
        'type': sortElements(AD_TYPES)[0],
        'rooms': 1 + Math.round(4 * Math.random()),
        'guests': 1 + Math.round(99 * Math.random()),
        'checkin': sortElements(AD_TIMES)[0],
        'checkout': sortElements(AD_TIMES)[0],
        'features': getFeatures(),
        'description': '',
        'photos': sortElements(AD_PHOTOS)
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };
  }
  return similarAds;
};

var similarAds = getAds();

mapToggle.classList.remove('map--faded');

for (var i = 0; i < similarAds.length; i++) {
  var pinElement = pinTemplate.cloneNode(true);

  var mapElement = mapTemplate.cloneNode(true);

  pinElement.style = 'left: ' + similarAds[i].location.x + 'px; top: ' + similarAds[i].location.y + 'px;';
  pinElement.querySelector('img').src = similarAds[i].author.avatar;
  pinElement.querySelector('img').alt = similarAds[i].offer.title;
  pinListElement.appendChild(pinElement);

  mapElement.querySelector('.popup__title').textContent = similarAds[i].offer.title;
  mapElement.querySelector('.popup__text--address').textContent = similarAds[i].offer.address;
  mapElement.querySelector('.popup__text--price').textContent = similarAds[i].offer.price + '₽/ночь';
  mapElement.querySelector('.popup__type').textContent = typeDictionary[similarAds[i].offer.type];
  mapElement.querySelector('.popup__text--capacity').textContent = similarAds[i].offer.rooms + ' комнат (-ы) для ' + similarAds[i].offer.guests + ' гостя (-ей)';
  mapElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + similarAds[i].offer.checkin + ', выезд до ' + similarAds[i].offer.checkout;
  mapElement.querySelector('.popup__description').textContent = similarAds[i].offer.description;
  mapElement.querySelector('.popup__avatar').src = similarAds[i].author.avatar;

  var insertedMapListElement = mapListElement.insertBefore(mapElement, mapFilters);
  var photoTemplate = insertedMapListElement.querySelector('.popup__photo');
  photoTemplate.src = similarAds[i].offer.photos[0];

  for (var j = 1; j < similarAds[i].offer.photos.length; j++) {
    var photoNext = photoTemplate.cloneNode(true);
    photoNext.src = similarAds[i].offer.photos[j];
    photoTemplate.parentNode.appendChild(photoNext);
  }

  var featuresList = insertedMapListElement.querySelector('.popup__features');

  for (var g = 0; g < AD_FEATURES.length; g++) {
    if (similarAds[i].offer.features.indexOf(AD_FEATURES[g]) === -1) {
      var deleteElement = featuresList.querySelector('.popup__feature--' + AD_FEATURES[g]);
      featuresList.removeChild(deleteElement);
    }
  }
}
