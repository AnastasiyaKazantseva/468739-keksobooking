'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MIN_TOP = 130;
  var MAX_TOP = 630;

  window.map = {
    ENTER_KEYCODE: 13,
    ESC_KEYCODE: 27,
    PIN_MAIN_LEFT: 570,
    PIN_MAIN_TOP: 375,
    mapListElement: document.querySelector('.map'),
    addForm: document.querySelector('.ad-form'),
    locationPinMain: document.querySelector('#address'),
    mapPinMain: document.querySelector('.map__pin--main'),

    getPinInactiveCoordinates: function () {
      return getPinCoordinateX() + ', ' + getPinCoordinateY();
    },

    toMapCoordinates: function (x, y) {
      var returnValue;

      if (y === 0) {
        returnValue = x - PIN_WIDTH / 2;
      } else if (x === 0) {
        returnValue = y - PIN_HEIGHT;
      }

      return returnValue;
    },

    deleteElement: function (oldElement) {
      if (oldElement) {
        oldElement.parentNode.removeChild(oldElement);
      }
    },

    onPopupClosePress: function (evt) {
      if (!evt.keyCode || (evt.keyCode === window.map.ENTER_KEYCODE && evt.target.tagName !== 'INPUT')) {
        window.map.closePopup();
      }
    },

    activatePage: function (mode) {
      var fieldsets = window.map.addForm.querySelectorAll('fieldset');

      if (mode === 0) {
        for (var i = 0; i < fieldsets.length; i++) {
          fieldsets[i].removeAttribute('disabled');
        }
        window.map.mapListElement.classList.remove('map--faded');
        window.map.addForm.classList.remove('ad-form--disabled');
      } else if (mode === 1) {
        for (var j = 0; j < fieldsets.length; j++) {
          fieldsets[j].setAttribute('disabled', 'disabled');
        }
        window.map.mapListElement.classList.add('map--faded');
        window.map.addForm.classList.add('ad-form--disabled');
      }
    }
  };

  var pinMainDimensions = getComputedStyle(window.map.mapPinMain);

  var getPinMainHeight = function () {
    var height = Math.round(parseInt(pinMainDimensions.height, 10));
    var pinPointHeight = PIN_HEIGHT - PIN_WIDTH;

    return height + pinPointHeight;
  };

  var getPinCoordinateX = function () {
    var left = parseInt(window.map.mapPinMain.style.left, 10);
    var width = parseInt(pinMainDimensions.width, 10) / 2;

    return Math.round(left + width);
  };

  var getPinCoordinateY = function () {
    var top = parseInt(window.map.mapPinMain.style.top, 10);
    var height = parseInt(pinMainDimensions.height, 10) / 2;

    return Math.round(top + height);
  };

  var getPinActiveCoordinateY = function () {
    var top = Math.round(parseInt(window.map.mapPinMain.style.top, 10));

    return top + getPinMainHeight();
  };

  window.map.locationPinMain.setAttribute('value', window.map.getPinInactiveCoordinates());

  var getPinActiveCoordinates = function () {
    return getPinCoordinateX() + ', ' + getPinActiveCoordinateY();
  };

  window.map.mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    window.map.activatePage(0);

    window.backend.load(window.data.onLoad, window.data.onError);

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

      window.map.locationPinMain.setAttribute('value', getPinActiveCoordinates());

      var minTop = MIN_TOP - getPinMainHeight();
      var maxTop = MAX_TOP - getPinMainHeight();
      var nextTop = clamp(minTop, maxTop, window.map.mapPinMain.offsetTop - shift.y);
      window.map.mapPinMain.style.top = nextTop + 'px';

      var mapBlock = document.querySelector('body');
      var mapDimensions = getComputedStyle(mapBlock);
      var maxLeft = parseInt(mapDimensions.width, 10) - parseInt(pinMainDimensions.width, 10);

      var nextLeft = clamp(0, maxLeft, window.map.mapPinMain.offsetLeft - shift.x);
      window.map.mapPinMain.style.left = nextLeft + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      window.map.locationPinMain.setAttribute('value', getPinActiveCoordinates());

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === window.map.ESC_KEYCODE) {
      var oldPopup = document.querySelector('.map__card');
      window.map.deleteElement(oldPopup);
    }
  };

  document.addEventListener('keydown', onPopupEscPress);
})();
