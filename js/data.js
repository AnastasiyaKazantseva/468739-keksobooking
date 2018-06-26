'use strict';

(function () {
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

  var AD_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var AD_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

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

    getAds: function () {
      var similarAds = [];

      for (var i = 0; i < 8; i++) {
        var locationX = 300 + Math.round(600 * Math.random());
        var locationY = 130 + Math.round(500 * Math.random());
        var currentPhotos = AD_PHOTOS.slice();

        similarAds[i] = {
          'author': {
            'avatar': 'img/avatars/user' + addLeadingZeros(i + 1, 2) + '.png'
          },
          'offer': {
            'title': AD_TITLES[i],
            'address': locationX + ', ' + locationY,
            'price': 1000 + Math.round(999000 * Math.random()),
            'type': getRandomElement(window.data.AD_TYPES).type,
            'rooms': 1 + Math.round(99 * Math.random()),
            'guests': 1 + Math.round(2 * Math.random()),
            'checkin': getRandomElement(AD_TIMES),
            'checkout': getRandomElement(AD_TIMES),
            'features': getFeatures(),
            'description': '',
            'photos': mixElements(currentPhotos)
          },
          'location': {
            'x': locationX,
            'y': locationY
          }
        };
      }

      return similarAds;
    },

    typeDictionary: {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    }
  };

  var mixElements = function (array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  var getRandomElement = function (array) {
    var randomElement = array[Math.floor(Math.random() * array.length)];
    return randomElement;
  };

  var getFeatures = function () {
    var count = Math.floor(Math.random() * window.data.AD_FEATURES.length);
    return mixElements(window.data.AD_FEATURES.slice()).splice(0, count);
  };

  var addLeadingZeros = function (value, needingLenght) {
    var stringValue = '' + value;

    while (stringValue.length < needingLenght) {
      stringValue = '0' + stringValue;
    }

    return stringValue;
  };
})();
