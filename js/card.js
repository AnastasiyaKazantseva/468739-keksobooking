'use strict';

(function () {
  var mapTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapFilters = document.querySelector('.map__filters-container');

  window.card = {
    addPopup: function (currentAd) {
      var oldPopup = document.querySelector('.map__card');
      window.map.deleteElement(oldPopup);

      var popupElement = mapTemplate.cloneNode(true);

      popupElement.querySelector('.popup__title').textContent = currentAd.offer.title;
      popupElement.querySelector('.popup__text--address').textContent = currentAd.offer.address;
      popupElement.querySelector('.popup__text--price').textContent = currentAd.offer.price + '₽/ночь';
      popupElement.querySelector('.popup__type').textContent = window.data.typeDictionary[currentAd.offer.type];
      popupElement.querySelector('.popup__text--capacity').textContent = currentAd.offer.rooms + ' комнат (-ы) для ' + currentAd.offer.guests + ' гостя (-ей)';
      popupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + currentAd.offer.checkin + ', выезд до ' + currentAd.offer.checkout;
      popupElement.querySelector('.popup__description').textContent = currentAd.offer.description;
      popupElement.querySelector('.popup__avatar').src = currentAd.author.avatar;

      var insertedMapListElement = window.map.mapListElement.insertBefore(popupElement, mapFilters);
      var photoTemplate = insertedMapListElement.querySelector('.popup__photo');

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

      var featuresList = insertedMapListElement.querySelector('.popup__features');

      for (var g = 0; g < window.data.AD_FEATURES.length; g++) {
        if (currentAd.offer.features.indexOf(window.data.AD_FEATURES[g]) === -1) {
          var deleteElement = featuresList.querySelector('.popup__feature--' + window.data.AD_FEATURES[g]);
          featuresList.removeChild(deleteElement);
        }
      }

      var popupClose = document.querySelector('.popup__close');

      popupClose.addEventListener('click', window.map.onPopupClosePress);
      popupClose.addEventListener('keydown', window.map.onPopupClosePress);
    }
  };
})();

