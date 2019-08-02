"use strict";

var overlayReset = "<p>\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u043F\u0440\u0435\u0440\u0432\u0430\u0442\u044C\u0441\u044F \u0438 \u043D\u0430\u0447\u0430\u0442\u044C \u0441 \u043D\u0430\u0447\u0430\u043B\u0430?</p>\n\t\t\t\t\t<br><button class=\"acceptButton acceptReset\">\u0414\u0430</button>\n\t\t\t\t\t<button class=\"cancelButton cancelReset\">\u041D\u0435\u0442, \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u044E \u0438\u0433\u0440\u0430\u0442\u044C</button>";
var complexityChoise = "<p>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0438\u0433\u0440\u044B:</p>\n\t\t\t\t\t\t<p class=\"complexity1 complexity_choice\" data-coeff=\"0.65\" data-delay=\"90\"><a href=\"#\">\u041C\u0435\u0434\u0438\u0442\u0430\u0442\u0438\u0432\u043D\u043E</a></p>\n\t\t\t\t\t\t<p class=\"complexity2 complexity_choice\" data-coeff=\"0.75\" data-delay=\"70\"><a href=\"#\">\u0427\u0443\u0442\u044C \u0431\u044B\u0441\u0442\u0440\u0435\u0435</a></p>\n\t\t\t\t\t\t<p class=\"complexity3 complexity_choice\" data-coeff=\"0.85\" data-delay=\"60\"><a href=\"#\">\u0421\u0440\u0435\u0434\u043D\u044F\u044F \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C</a></p>\n\t\t\t\t\t\t<p class=\"complexity4 complexity_choice\" data-coeff=\"0.95\" data-delay=\"40\"><a href=\"#\">\u0412\u044B\u0441\u043E\u043A\u0430\u044F \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C</a></p>";
var closeOverlayButton = document.getElementById('modal-close');
closeOverlayButton.addEventListener('click', function (e) {
  e.preventDefault();
  closeOverlay();
});

function openOverlay() {
  var field = document.querySelector('.modal-overlay');
  field.classList.remove('modal_closed');
}

function closeOverlay() {
  var field = document.querySelector('.modal-overlay');
  field.classList.add('modal_closed');
}

function setContent(content) {
  var field = document.querySelector('#modal-default .content');
  field.innerHTML = content;
}

;

function resetButtons() {
  var acceptButton = document.querySelector('#modal-default .acceptReset');
  var cancelButton = document.querySelector('#modal-default .cancelReset');
  acceptButton.addEventListener('click', function (e) {
    e.preventDefault();
    closeOverlay();
    game.reset();
  });
  cancelButton.addEventListener('click', function (e) {
    e.preventDefault();
    closeOverlay();
    view.start();
  });
}

;

function getComplexity() {
  var collection = document.querySelectorAll('#modal-default .complexity_choice');
  collection.forEach(function (elem) {
    elem.addEventListener('click', function (e) {
      e.preventDefault();
      globalSettings.coeff = +this.getAttribute('data-coeff');
      globalSettings.delay = +this.getAttribute('data-delay');
      closeOverlay();
      view.start();
      game.newStart();
    });
  });
}