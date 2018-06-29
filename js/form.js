'use strict';

(function () {
  var typeSelect = document.getElementById('type');
  var priceInput = document.getElementById('price');

  typeSelect.addEventListener('change', function () {
    var i = typeSelect.selectedIndex;
    priceInput.min = window.data.AD_TYPES[i].minprice;
    priceInput.placeholder = window.data.AD_TYPES[i].minprice;
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

  var inactivatePage = function () {
    window.map.addForm.reset();

    var oldPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < oldPin.length; i++) {
      window.map.deleteElement(oldPin[i]);
    }

    var oldPopup = document.querySelector('.map__card');
    window.map.deleteElement(oldPopup);

    window.map.activatePage(1);

    window.map.mapPinMain.style.top = window.map.PIN_MAIN_TOP + 'px';
    window.map.mapPinMain.style.left = window.map.PIN_MAIN_LEFT + 'px';
    window.map.locationPinMain.setAttribute('value', window.map.getPinInactiveCoordinates());
  };

  var success = document.querySelector('.success');

  var onLoad = function () {
    success.classList.remove('hidden');

    inactivatePage();
  };

  window.map.addForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.upload(new FormData(window.map.addForm), onLoad, window.data.onError);
  });

  var onOverlayClosePress = function (evt) {
    if (!evt.keyCode || evt.keyCode === window.map.ESC_KEYCODE) {
      success.classList.add('hidden');
    }
  };

  success.addEventListener('click', onOverlayClosePress);
  document.addEventListener('keydown', onOverlayClosePress);

  var resetButton = document.querySelector('.ad-form__reset');
  resetButton.addEventListener('click', inactivatePage);
})();
