'use strict';

(function () {
  var MIN_TOP = 130;
  var MAX_TOP = 630;

  window.map = {
    block: document.querySelector('.map'),
    addForm: document.querySelector('.ad-form'),
    locationPinMain: document.getElementById('address'),
    pinMain: document.querySelector('.map__pin--main'),

    getPinInactiveCoordinates: function () {
      return getPinCoordinateX() + ', ' + getPinCoordinateY();
    },

    onPopupClosePress: function (evt) {
      if (!evt.keyCode || (evt.keyCode === window.utils.ENTER_KEYCODE && evt.target.tagName !== 'INPUT')) {
        window.card.remove();
      }
    },

    activateForm: function () {
      var fieldsets = window.map.addForm.querySelectorAll('fieldset');

      for (var i = 0; i < fieldsets.length; i++) {
        fieldsets[i].removeAttribute('disabled');
      }

      window.map.block.classList.remove('map--faded');
      window.map.addForm.classList.remove('ad-form--disabled');
    },

    disactivateForm: function () {
      var fieldsets = window.map.addForm.querySelectorAll('fieldset');

      for (var i = 0; i < fieldsets.length; i++) {
        fieldsets[i].setAttribute('disabled', 'disabled');
      }

      window.map.block.classList.add('map--faded');
      window.map.addForm.classList.add('ad-form--disabled');
    }
  };

  var pinMainDimensions = getComputedStyle(window.map.pinMain);

  var getPinMainHeight = function () {
    var height = Math.round(parseInt(pinMainDimensions.height, 10));
    var pinPointHeight = window.pin.HEIGHT - window.pin.WIDTH;

    return height + pinPointHeight;
  };

  var getPinCoordinateX = function () {
    var left = parseInt(window.map.pinMain.style.left, 10);
    var width = parseInt(pinMainDimensions.width, 10) / 2;

    return Math.round(left + width);
  };

  var getPinCoordinateY = function () {
    var top = parseInt(window.map.pinMain.style.top, 10);
    var height = parseInt(pinMainDimensions.height, 10) / 2;

    return Math.round(top + height);
  };

  var getPinActiveCoordinateY = function () {
    var top = Math.round(parseInt(window.map.pinMain.style.top, 10));

    return top + getPinMainHeight();
  };

  window.map.locationPinMain.setAttribute('value', window.map.getPinInactiveCoordinates());

  var getPinActiveCoordinates = function () {
    return getPinCoordinateX() + ', ' + getPinActiveCoordinateY();
  };

  window.map.pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    window.map.activateForm();

    window.backend.load(window.data.onLoad, window.data.onError);

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
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
      var nextTop = window.utils.clamp(minTop, maxTop, window.map.pinMain.offsetTop - shift.y);
      window.map.pinMain.style.top = nextTop + 'px';

      var mapBlock = document.querySelector('body');
      var mapDimensions = getComputedStyle(mapBlock);
      var maxLeft = parseInt(mapDimensions.width, 10) - parseInt(pinMainDimensions.width, 10);

      var nextLeft = window.utils.clamp(0, maxLeft, window.map.pinMain.offsetLeft - shift.x);
      window.map.pinMain.style.left = nextLeft + 'px';
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
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      window.card.remove();
    }
  };

  document.addEventListener('keydown', onPopupEscPress);
})();
