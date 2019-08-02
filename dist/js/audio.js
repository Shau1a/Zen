"use strict";

var played = undefined;
var muz, jump;

(function () {
  function loadAudio(arr, vol, loop) {
    var audio = document.createElement('audio');

    for (var i = 0; i < arr.length; i++) {
      var source = document.createElement('source');
      source.src = arr[i];
      audio.appendChild(source);
    }

    ;
    audio.volume = vol || 1;
    audio.loop = loop || undefined;
    var o = {
      dom: false,
      state: 'stop',
      play: function play() {
        this.dom.play();
        this.state = 'play';
      },
      pause: function pause() {
        this.dom.pause();
        this.state = 'pause';
      },
      stop: function stop() {
        this.dom.pause();
        this.dom.currentTime = 0;
        this.state = 'stop';
      }
    };
    o.dom = audio;
    return o;
  }

  ;
  muz = loadAudio(['audio/muz.mp3'], 0.2, true);
  jump = loadAudio(['audio/jump.mp3'], 0.15);
  var soundButton = document.querySelector('.menu .menu_sound');
  soundButton.addEventListener('click', function (e) {
    e.preventDefault();

    if (!played) {
      muz.play();
      soundButton.classList.remove('crossed');
      played = true;
    } else {
      muz.pause();
      soundButton.classList.add('crossed');
      played = undefined;
    }
  });
})();