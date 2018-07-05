'use strict';

(function () {
  window.data = {
    ads: [],

    onLoad: function (ads) {
      window.state.ads = ads;
      window.pin.renderAll();
    },

    onError: function (errorMessage) {
      var node = document.createElement('div');
      node.classList.add('success');

      var message = document.createElement('p');
      message.classList.add('success__message');
      message.textContent = errorMessage;

      document.body.insertAdjacentElement('afterbegin', node);
      node.insertAdjacentElement('afterbegin', message);

      var onOverlayClosePress = function (evt) {
        if (!evt.keyCode || evt.keyCode === window.utils.ESC_KEYCODE) {
          node.classList.add('hidden');
        }
      };

      node.addEventListener('click', onOverlayClosePress);
      document.addEventListener('keydown', onOverlayClosePress);
    }
  };
})();
