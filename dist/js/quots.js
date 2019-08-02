"use strict";

(function () {
  var getQute = function getQute() {
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        apiUrl = "https://api.forismatic.com/api/1.0/",
        apiQuery = proxyUrl + apiUrl + "?method=getQuote&format=json&lang=ru";
    fetch(apiQuery).then(function (response) {
      return response.json();
    }).then(function (data) {
      parseQuote(data);
    })["catch"](function (error) {
      return console.error("Ошибка получение цитаты. Причина: " + error);
    });
  };

  var parseQuote = function parseQuote(data) {
    var textBox = document.querySelector('.forismatic .quoteText');
    var textAuthor = document.querySelector('.forismatic .quoteAuthor');
    var quot = data.quoteText;
    var author = data.quoteAuthor;
    textBox.innerHTML = quot;
    textAuthor.innerHTML = author;
  };

  getQute();
  var changingQuote = document.querySelector('.forismatic .changeQuote');
  changingQuote.addEventListener('click', function (e) {
    e.preventDefault();
    getQute();
  });
})();