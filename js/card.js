'use strict';

(function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapFilters = document.querySelector('.map__filters-container');

  window.card = {
    delete: function () {
      var oldCard = document.querySelector('.map__card');

      if (oldCard) {
        oldCard.remove();
      }
    },

    add: function (currentAd) {
      window.card.delete();

      var popupClone = cardTemplate.cloneNode(true);

      popupClone.querySelector('.popup__title').textContent = currentAd.offer.title;
      popupClone.querySelector('.popup__text--address').textContent = currentAd.offer.address;
      popupClone.querySelector('.popup__text--price').textContent = currentAd.offer.price + '₽/ночь';
      popupClone.querySelector('.popup__type').textContent = window.utils.typeDictionary[currentAd.offer.type];
      popupClone.querySelector('.popup__text--capacity').textContent = currentAd.offer.rooms + ' комнат (-ы) для ' + currentAd.offer.guests + ' гостя (-ей)';
      popupClone.querySelector('.popup__text--time').textContent = 'Заезд после ' + currentAd.offer.checkin + ', выезд до ' + currentAd.offer.checkout;
      popupClone.querySelector('.popup__description').textContent = currentAd.offer.description;
      popupClone.querySelector('.popup__avatar').src = currentAd.author.avatar;

      var insertedElement = window.map.block.insertBefore(popupClone, mapFilters);
      var photoTemplate = insertedElement.querySelector('.popup__photo');

      if (currentAd.offer.photos.length > 0) {
        photoTemplate.src = currentAd.offer.photos[0];
      } else {
        var popup = document.querySelector('.popup');
        var photoList = document.querySelector('.popup__photos');
        popup.removeChild(photoList);
      }

      for (var j = 1; j < currentAd.offer.photos.length; j++) {
        var photoNext = photoTemplate.cloneNode(true);
        photoNext.src = currentAd.offer.photos[j];
        photoTemplate.parentNode.appendChild(photoNext);
      }

      var featuresList = insertedElement.querySelector('.popup__features');

      for (var i = 0; i < window.utils.FEATURES.length; i++) {
        if (currentAd.offer.features.indexOf(window.utils.FEATURES[i]) === -1) {
          var deletedElement = featuresList.querySelector('.popup__feature--' + window.utils.FEATURES[i]);
          featuresList.removeChild(deletedElement);
        }
      }

      var popupClose = document.querySelector('.popup__close');

      popupClose.addEventListener('click', window.map.onPopupClosePress);
      popupClose.addEventListener('keydown', window.map.onPopupClosePress);
    }
  };
})();

