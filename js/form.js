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
})();
