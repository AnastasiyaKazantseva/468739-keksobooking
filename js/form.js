'use strict';

(function () {
  var PIN_MAIN_LEFT = 570;
  var PIN_MAIN_TOP = 375;
  var typeSelect = document.getElementById('type');
  var priceInput = document.getElementById('price');
  var filters = document.querySelector('.map__filters');

  typeSelect.addEventListener('change', function () {
    var i = typeSelect.selectedIndex;
    priceInput.min = window.utils.MIN_PRICES[i];
    priceInput.placeholder = window.utils.MIN_PRICES[i];
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
    filters.reset();

    window.pin.clearAll();
    window.card.remove();
    window.map.disactivateForm();

    window.map.pinMain.style.top = PIN_MAIN_TOP + 'px';
    window.map.pinMain.style.left = PIN_MAIN_LEFT + 'px';
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
    if (!evt.keyCode || evt.keyCode === window.utils.ESC_KEYCODE) {
      success.classList.add('hidden');
    }
  };

  success.addEventListener('click', onOverlayClosePress);
  document.addEventListener('keydown', onOverlayClosePress);

  var resetButton = document.querySelector('.ad-form__reset');
  resetButton.addEventListener('click', inactivatePage);
})();
