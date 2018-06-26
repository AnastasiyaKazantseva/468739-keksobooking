'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  window.map = {
    toMapCoordinates: function (x, y) {
      var returnValue;

      if (y === 0) {
        returnValue = x - PIN_WIDTH / 2;
      } else if (x === 0) {
        returnValue = y - PIN_HEIGHT;
      }

      return returnValue;
    },

    closePopup: function () {
      var oldPopup = document.querySelector('.map__card');

      if (oldPopup) {
        oldPopup.parentNode.removeChild(oldPopup);
      }
    },

    mapListElement: document.querySelector('.map'),

    onPopupClosePress: function (evt) {
      if (!evt.keyCode || (evt.keyCode === window.map.ENTER_KEYCODE && evt.target.tagName !== 'INPUT')) {
        window.map.closePopup();
      }
    },

    ENTER_KEYCODE: 13
  };

  var locationPinMain = document.querySelector('#address');

  var addForm = document.querySelector('.ad-form');
  var mapPinMain = document.querySelector('.map__pin--main');
  var pinMainDimensions = getComputedStyle(mapPinMain);

  var getPinCoordinateX = function () {
    var left = parseInt(mapPinMain.style.left, 10);
    var width = parseInt(pinMainDimensions.width, 10) / 2;

    return Math.round(left + width);
  };

  var getPinCoordinateY = function () {
    var top = parseInt(mapPinMain.style.top, 10);
    var height = parseInt(pinMainDimensions.height, 10) / 2;

    return Math.round(top + height);
  };

  var pinMainHeight = function () {
    var height = Math.round(parseInt(pinMainDimensions.height, 10));
    var pinPointHeight = PIN_HEIGHT - PIN_WIDTH;

    return height + pinPointHeight;
  };

  var getPinActiveCoordinateY = function () {
    var top = Math.round(parseInt(mapPinMain.style.top, 10));

    return top + pinMainHeight();
  };

  var pinInactiveCoordinates = getPinCoordinateX() + ', ' + getPinCoordinateY();

  locationPinMain.setAttribute('value', pinInactiveCoordinates);

  var similarAds = window.data.getAds();

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var fieldsets = addForm.querySelectorAll('fieldset');

    window.map.mapListElement.classList.remove('map--faded');
    addForm.classList.remove('ad-form--disabled');

    for (var f = 0; f < fieldsets.length; f++) {
      fieldsets[f].removeAttribute('disabled');
    }

    window.pin.addPins(similarAds);

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var clamp = function (min, max, value) {
      return Math.min(max, Math.max(min, value));
    };

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

      var pinActiveCoordinates = getPinCoordinateX() + ', ' + getPinActiveCoordinateY();
      locationPinMain.setAttribute('value', pinActiveCoordinates);

      var minTop = 130 - pinMainHeight();
      var maxTop = 630 - pinMainHeight();
      var nextTop = clamp(minTop, maxTop, mapPinMain.offsetTop - shift.y);
      mapPinMain.style.top = nextTop + 'px';

      var mapBlock = document.querySelector('body');
      var mapDimensions = getComputedStyle(mapBlock);
      var maxLeft = parseInt(mapDimensions.width, 10) - parseInt(pinMainDimensions.width, 10);

      var nextLeft = clamp(0, maxLeft, mapPinMain.offsetLeft - shift.x);
      mapPinMain.style.left = nextLeft + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      var pinActiveCoordinates = getPinCoordinateX() + ', ' + getPinActiveCoordinateY();
      locationPinMain.setAttribute('value', pinActiveCoordinates);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.map.closePopup();
    }
  };

  document.addEventListener('keydown', onPopupEscPress);
})();
