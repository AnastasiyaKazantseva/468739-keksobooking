'use strict';

(function () {
  window.utils.FILTERS.forEach(function (item) {
    document.getElementById('housing-' + item).addEventListener('change', window.debounce(function (evt) {
      window.state.filters[item] = evt.target.value;
      window.pin.renderAll();
      window.card.delete();
    }));
  });

  window.utils.FEATURES.forEach(function (name) {
    document.getElementById('filter-' + name).addEventListener('click', window.debounce(function (evt) {
      window.state.filters[name] = evt.target.checked;
      window.pin.renderAll();
      window.card.delete();
    }));
  });
})();

