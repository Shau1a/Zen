"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  'use strict'; //=============================================//
  // OVERLAYS
  //=============================================//

  var overlayReset = "<p>\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u043F\u0440\u0435\u0440\u0432\u0430\u0442\u044C\u0441\u044F \u0438 \u043D\u0430\u0447\u0430\u0442\u044C \u0441 \u043D\u0430\u0447\u0430\u043B\u0430?</p>\n          <br><button class=\"acceptButton acceptReset\">\u0414\u0430</button>\n          <button class=\"cancelButton cancelReset\">\u041D\u0435\u0442, \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u044E \u0438\u0433\u0440\u0430\u0442\u044C</button>";
  var complexityChoise = "<p>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0438\u0433\u0440\u044B:</p>\n            <p class=\"complexity1 complexity_choice\" data-coeff=\"0.65\" data-delay=\"90\"><a href=\"#\">\u041C\u0435\u0434\u0438\u0442\u0430\u0442\u0438\u0432\u043D\u043E</a></p>\n            <p class=\"complexity2 complexity_choice\" data-coeff=\"0.75\" data-delay=\"70\"><a href=\"#\">\u0427\u0443\u0442\u044C \u0431\u044B\u0441\u0442\u0440\u0435\u0435</a></p>\n            <p class=\"complexity3 complexity_choice\" data-coeff=\"0.85\" data-delay=\"60\"><a href=\"#\">\u0421\u0440\u0435\u0434\u043D\u044F\u044F \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C</a></p>\n            <p class=\"complexity4 complexity_choice\" data-coeff=\"0.95\" data-delay=\"40\"><a href=\"#\">\u0412\u044B\u0441\u043E\u043A\u0430\u044F \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C</a></p>";
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
  } //=============================================//
  // GAME
  //=============================================//


  var globalSettings = {
    width: 600,
    height: 600,
    centerX: 600 / 2,
    centerY: 600 / 2,
    speed: 1000,
    coeff: .7,
    // для установки и изменения скорости шаров
    delay: 90 // регулирует частоту появления шаров

  }; //=============================================//
  // GLOBAL FUNCTIONS
  //=============================================//
  // Вычисление угла для поворота игрока и стрелки, следующей за мышкой
  // 

  var countAngle = function countAngle(x, y) {
    var height = window.innerHeight,
        width = window.innerWidth,
        deltaX = x - width / 2,
        deltaY = y - height / 2,
        angle = Math.asin(deltaX / Math.sqrt(deltaY * deltaY + deltaX * deltaX)) * 180 / Math.PI;

    if (y > height / 2) {
      angle = 180 - angle;
    }

    return angle;
  }; // Создание буфера для отрисовки элементов
  // 


  var makeBuffer = function makeBuffer() {
    var buffer = document.createElement('canvas').getContext('2d');
    return buffer;
  };

  var clear = function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,.97)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  var getRandomColor = function getRandomColor() {
    var r = function r() {
      return Math.floor(Math.random() * 256);
    };

    var a = Math.random().toFixed(2);
    a >= 0.22 ? a = a : a = 0.22;
    return "rgba(".concat(r(), ", ").concat(r(), ", ").concat(r(), ", ").concat(a, ")");
  };

  var getData = function getData() {
    if (window.localStorage.getItem('ZenGameScores')) {
      var ZenGameScores = JSON.parse(window.localStorage.getItem('ZenGameScores'));
      var score = "".concat(ZenGameScores['score']);
      return score || 0;
    } else {
      return 0;
    }
  };

  var saveData = function saveData(score) {
    var ZenGameScores = {};
    ZenGameScores['score'] = score;
    window.localStorage.setItem('ZenGameScores', JSON.stringify(ZenGameScores));
  }; //=============================================//
  // CLASSES
  //=============================================//
  //==============//
  // HERO
  //==============//


  var Hero =
  /*#__PURE__*/
  function () {
    function Hero(ctx, scale) {
      _classCallCheck(this, Hero);

      this.ctx = ctx;
      this.width = this.height = scale;
      this.x = globalSettings.centerX - scale / 2;
      this.y = globalSettings.centerY - scale / 2;
      this.convW = this.convH = -scale / 2;
      this.alive = true;
    }

    _createClass(Hero, [{
      key: "draw",
      value: function draw(rotation) {
        var bufCtx = makeBuffer();
        var startX = rotation ? this.convW : this.x;
        var startY = rotation ? this.convH : this.y;
        bufCtx.clearRect(0, 0, this.width, this.height);
        bufCtx.beginPath();
        bufCtx.moveTo(50, 0);
        bufCtx.lineTo(100, 100);
        bufCtx.lineTo(0, 100);
        var gradient = bufCtx.createLinearGradient(50, 0, 100, 100);
        gradient.addColorStop(0, "#FF9966");
        gradient.addColorStop(1, "#FF0000");
        bufCtx.fillStyle = gradient;
        bufCtx.fill();
        this.ctx.drawImage(bufCtx.canvas, 0, 0, 100, 100, startX, startY, this.width, this.height);
      }
    }, {
      key: "reset",
      value: function reset() {
        this.alive = true;
      }
    }, {
      key: "rotate",
      value: function rotate(deg) {
        var rad = deg * Math.PI / 180;
        this.ctx.translate(globalSettings.centerX, globalSettings.centerY);
        this.ctx.rotate(rad);
        this.draw(true);
        this.ctx.resetTransform();
      }
    }]);

    return Hero;
  }(); //==============//
  // FOLOWED ARROW
  //==============//


  var Arrow =
  /*#__PURE__*/
  function () {
    function Arrow(ctx, scale, x, y) {
      _classCallCheck(this, Arrow);

      this.ctx = ctx;
      this.width = this.height = this.scale = scale;
      this.x = x;
      this.y = y;
      this.convW = this.convH = -scale / 2;
    }

    _createClass(Arrow, [{
      key: "draw",
      value: function draw(rotation) {
        var bufCtx = makeBuffer();
        var startX = rotation ? this.convW : this.x;
        var startY = rotation ? this.convH : this.y;
        bufCtx.clearRect(0, 0, this.width, this.height);
        bufCtx.beginPath();
        bufCtx.moveTo(50, 0);
        bufCtx.lineTo(100, 100);
        bufCtx.lineTo(50, 70);
        bufCtx.lineTo(0, 100);
        var gradient = bufCtx.createLinearGradient(50, 0, 100, 100);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(1, 'blue');
        bufCtx.fillStyle = gradient;
        bufCtx.fill();
        this.ctx.drawImage(bufCtx.canvas, 0, 0, 100, 100, startX, startY, this.width, this.height);
      }
    }, {
      key: "rotate",
      value: function rotate(deg) {
        var rad = deg * Math.PI / 180;
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(rad);
        this.draw(true);
        this.ctx.resetTransform();
      }
    }, {
      key: "update",
      value: function update(x, y, deg) {
        this.x = x - canvas.offsetLeft;
        this.y = y - canvas.offsetTop;
        this.rotate(deg);
      }
    }]);

    return Arrow;
  }(); //==============//
  // ENEMY-BALLS
  //==============//


  var Enemy =
  /*#__PURE__*/
  function () {
    function Enemy(x, y, ctx) {
      _classCallCheck(this, Enemy);

      this.x = x;
      this.y = y;
      this.x_velocity = -(this.x - globalSettings.centerX) / (globalSettings.speed / globalSettings.coeff);
      this.y_velocity = -(this.y - globalSettings.centerY) / (globalSettings.speed / globalSettings.coeff);
      this.ctx = ctx;
      this.alive = true;
      this.checked = false; //

      this.color = getRandomColor();
      this.radius = Math.floor(20 + Math.random() * 20);
    }

    _createClass(Enemy, [{
      key: "draw",
      value: function draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.restore();
      }
    }, {
      key: "collisionPlayer",
      value: function collisionPlayer(player) {
        var dx = this.x - player.x;
        var dy = this.y - player.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + player.width / 2) {
          this.radius++;

          if (this.radius >= 80) {
            player.alive = false;
          }
        }
      }
    }, {
      key: "collisionArrow",
      value: function collisionArrow(killer) {
        var dx = this.x - killer.x;
        var dy = this.y - killer.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + killer.width / 2) {
          this.checked = true;
          game.score += 1;
          killer.alive = false;
        }
      }
    }, {
      key: "reset",
      value: function reset(params) {
        this.x = params.x;
        this.y = params.y;
        this.x_velocity = -(this.x - globalSettings.centerX) / (globalSettings.speed / globalSettings.coeff);
        this.y_velocity = -(this.y - globalSettings.centerY) / (globalSettings.speed / globalSettings.coeff);
        this.checked = false;
        this.alive = true;
        this.color = getRandomColor();
        this.radius = Math.floor(20 + Math.random() * 20);
      }
    }, {
      key: "update",
      value: function update() {
        if (!this.checked) {
          this.x += this.x_velocity;
          this.y += this.y_velocity;
        }

        if (this.checked) {
          this.radius--;

          if (this.radius <= 2) {
            this.alive = false;
          }
        }
      }
    }]);

    return Enemy;
  }(); //==============//
  // KILLER-ARROWS
  //==============//


  var Killer =
  /*#__PURE__*/
  function () {
    function Killer(x, y, ctx, scale, toX, toY, b) {
      _classCallCheck(this, Killer);

      this.x = globalSettings.centerX;
      this.y = globalSettings.centerY;
      this.ctx = ctx;
      this.width = this.height = this.scale = scale;
      this.convW = this.convH = -scale / 2;
      this.checked = false;
      this.alive = true;
      this.directionX = toX;
      this.directionY = toY;
      this.x_velocity = -(globalSettings.centerX - this.directionX) / (globalSettings.speed / 10);
      this.y_velocity = -(globalSettings.centerY - this.directionY) / (globalSettings.speed / 10);
      this.degree = b;
    }

    _createClass(Killer, [{
      key: "draw",
      value: function draw(rotation) {
        var bufCtx = makeBuffer();
        var startX = rotation ? this.convW : this.x;
        var startY = rotation ? this.convH : this.y;
        bufCtx.clearRect(0, 0, this.width, this.height);
        bufCtx.beginPath();
        bufCtx.moveTo(50, 0);
        bufCtx.lineTo(90, 100);
        bufCtx.lineTo(50, 60);
        bufCtx.lineTo(0, 90);
        var gradient = bufCtx.createLinearGradient(50, 0, 50, 100);
        gradient.addColorStop(0, 'yellow');
        gradient.addColorStop(1, 'green');
        bufCtx.fillStyle = gradient;
        bufCtx.fill();
        this.ctx.drawImage(bufCtx.canvas, 0, 0, 100, 100, startX, startY, this.width, this.height);
      }
    }, {
      key: "rotate",
      value: function rotate(deg) {
        var rad = deg * Math.PI / 180;
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(rad);
        this.draw(true);
        this.ctx.resetTransform();
      }
    }, {
      key: "reset",
      value: function reset(params) {
        this.x = globalSettings.centerX;
        this.y = globalSettings.centerY;
        this.directionX = params.toX;
        this.directionY = params.toY;
        this.degree = params.b;
        this.x_velocity = -(globalSettings.centerX - this.directionX) / (globalSettings.speed / 10);
        this.y_velocity = -(globalSettings.centerY - this.directionY) / (globalSettings.speed / 10);
        this.checked = false;
        this.alive = true;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.directionX !== null && this.directionY !== null) {
          this.x += this.x_velocity;
          this.y += this.y_velocity;
          this.rotate(this.degree);

          if (this.checked == true || this.x > canvas.width || this.y > canvas.height) {
            this.alive = false;
          }
        }
      }
    }]);

    return Killer;
  }(); //==============//
  // OBJECT-MANAGER
  //==============//


  var Pool =
  /*#__PURE__*/
  function () {
    function Pool(object) {
      _classCallCheck(this, Pool);

      this.object = object;
      this.objects = [];
      this.pool = [];
    } // Если в хранилище неиспользуемых объектов есть нужный объект - берем его и используем снова


    _createClass(Pool, [{
      key: "get",
      value: function get(params) {
        if (this.pool.length != 0) {
          var object = this.pool.pop();
          object.reset(params);
          this.objects.push(object);
          return object;
        } else {
          this.objects.push(new this.object(params.x, params.y, params.ctx, params.scale, params.toX, params.toY, params.b));
          return this;
        }
      } // Если запрашиваемый объект есть в массиве используемыех объектов - перемещаем его в хранилище 

    }, {
      key: "store",
      value: function store(object) {
        var index = this.objects.indexOf(object);

        if (index != -1) {
          this.pool.push(this.objects.splice(index, 1)[0]);
        }
      } // Перемещение всех объектов из массива используемых в хранилище

    }, {
      key: "storeAll",
      value: function storeAll() {
        for (var index = this.objects.length - 1; index > -1; --index) {
          this.pool.push(this.objects.pop());
        }
      }
    }]);

    return Pool;
  }(); //==============//
  // GLOBAL VARIABELS
  //==============//


  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = globalSettings.width;
  canvas.height = globalSettings.height;
  var x, y, angle, ID; //=============================================//
  // GAME-MODEL
  //=============================================//

  var model = {
    hero: new Hero(ctx, 60),
    arrow: new Arrow(ctx, 20, 0, 0),
    enemies_pool: new Pool(Enemy),
    bullets_pool: new Pool(Killer),
    topBorder: canvas.offsetTop - 50,
    leftBorder: canvas.offsetLeft - 50,
    rightBorder: canvas.offsetLeft + canvas.width + 50,
    bottomBorder: canvas.offsetTop + canvas.height + 50,
    count: 0,
    delay: Math.floor(60 + Math.random() * globalSettings.delay),
    spawnEnemies: function spawnEnemies() {
      this.count++;

      if (this.count == this.delay) {
        this.count = 0;
        this.delay = Math.floor(60 + Math.random() * globalSettings.delay);
        var randomize = Math.floor(1 + Math.random() * 5);

        if (randomize == 1) {
          this.enemies_pool.get({
            x: this.leftBorder + Math.random() * this.rightBorder,
            y: -100,
            ctx: ctx
          });
        }

        if (randomize == 2) {
          this.enemies_pool.get({
            x: this.leftBorder + Math.random() * this.rightBorder,
            y: 700,
            ctx: ctx
          });
        }

        if (randomize == 3) {
          this.enemies_pool.get({
            x: -100,
            y: this.topBorder + Math.random() * this.bottomBorder,
            ctx: ctx
          });
        }

        if (randomize == 4) {
          this.enemies_pool.get({
            x: 700,
            y: this.topBorder + Math.random() * this.bottomBorder,
            ctx: ctx
          });
        }
      }
    },
    spawnBullets: function spawnBullets(toX, toY, b) {
      this.bullets_pool.get({
        ctx: ctx,
        scale: 24,
        toX: toX,
        toY: toY,
        b: b
      });
    },
    update: function update() {
      for (var index = this.enemies_pool.objects.length - 1; index > -1; --index) {
        var enemy = this.enemies_pool.objects[index];
        enemy.draw();
        enemy.update();
        enemy.collisionPlayer(model.hero);

        for (var _index = this.bullets_pool.objects.length - 1; _index > -1; --_index) {
          var bullet = this.bullets_pool.objects[_index];
          enemy.collisionArrow(bullet);
        }

        if (!enemy.alive) {
          this.enemies_pool.store(enemy);
        }
      }

      for (var _index2 = this.bullets_pool.objects.length - 1; _index2 > -1; --_index2) {
        var _bullet = this.bullets_pool.objects[_index2];

        _bullet.update();

        if (!_bullet.alive) {
          this.bullets_pool.store(_bullet);
        }
      }
    }
  }; //=============================================//
  // GAME-VIEW
  //=============================================//

  var view = {
    render: function render() {
      clear();
      model.hero.rotate(angle);
      model.arrow.update(x, y, angle);
      model.spawnEnemies();
      model.update();
    },
    loop: function loop() {
      if (model.hero.alive) {
        ID = undefined;
        controller.events();
        view.render();
        view.start();
        game.control();
      } else view.stop();
    },
    start: function start() {
      if (!ID) {
        ID = window.requestAnimationFrame(view.loop);
        game.state = true;

        if (controller.restartButton.classList.contains('restart')) {
          controller.restartButton.classList.remove('restart');
        }
      }
    },
    stop: function stop() {
      if (ID) {
        window.cancelAnimationFrame(ID);
        ID = undefined;
        game.state = false;
        controller.restartButton.classList.add('restart');
      }
    },
    updateRes: function updateRes() {
      var res = getData();
      controller.resultField.innerHTML = "\u041B\u0443\u0447\u0448\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442:<br>".concat(res);
    }
  }; //=============================================//
  // GAME-CONTROLLER
  //=============================================//

  var controller = {
    stopButton: document.querySelector('.menu .menu_stop'),
    startButton: document.querySelector('.menu .menu_start'),
    restartButton: document.querySelector('.menu .menu_restart'),
    resultField: document.querySelector('.menu .menu_results'),
    events: function events() {
      controller.stopButton.addEventListener('click', function (e) {
        e.preventDefault();

        if (game.state) {
          view.stop();
          controller.stopButton.classList.add('active');
        }
      });
      controller.startButton.addEventListener('click', function (e) {
        e.preventDefault();

        if (!game.state) {
          view.start();
          controller.stopButton.classList.remove('active');
        }
      });

      canvas.onclick = function (e) {
        var toX = e.pageX - canvas.offsetLeft;
        var toY = e.pageY - canvas.offsetTop;
        var b = countAngle(e.clientX, e.clientY);
        model.spawnBullets(toX, toY, b);

        if (played) {
          jump.play();
        }
      };

      document.body.onmousemove = function (e) {
        x = e.clientX;
        y = e.clientY;
        angle = countAngle(x, y);
      };
    },
    restarting: function restarting() {
      controller.restartButton.addEventListener('click', function (e) {
        e.preventDefault();

        if (model.hero.alive) {
          view.stop();
          openOverlay();
          setContent(overlayReset);
          resetButtons();
        }

        if (!model.hero.alive) {
          game.reset();
        }

        controller.stopButton.classList.remove('active');
        controller.restartButton.classList.remove('restart');
      });
    }
  }; //=============================================//
  // GAME-FLOW CONTROLL
  //=============================================//

  var game = {
    state: true,
    score: 0,
    counter: 0,
    level: 0,
    control: function control() {
      game.check++;
      var scoreField = document.querySelector('.menu .menu_score');
      var levelField = document.querySelector('.menu .menu_level');
      scoreField.innerHTML = "Score / \u043E\u0447\u043A\u0438: ".concat(Math.round(game.score));
      levelField.innerHTML = "Level / \u0443\u0440\u043E\u0432\u0435\u043D\u044C: ".concat(game.level);

      if (game.score >= 10 && !(game.score % 10) && !(game.counter % 10)) {
        globalSettings.coeff += 0.05;
        game.level += 1;
        game.counter = 2;
      }

      if (game.counter != 0 && game.score % 10) {
        game.counter = 0;
      }
    },
    newStart: function newStart() {
      model.enemies_pool.storeAll();
      model.bullets_pool.storeAll();
      model.hero.reset();
      game.score = 0;
      game.level = 0;
      game.state = true;
      controller.stopButton.classList.remove('active');
      view.updateRes();
      view.start();
    },
    reset: function reset() {
      var res = getData();

      if (game.score > res) {
        saveData(game.score);
      }

      ;
      setTimeout(function () {
        setContent(complexityChoise);
        openOverlay();
        getComplexity();
      }, 500);
    },
    init: function init() {
      view.updateRes();
      view.start();
      controller.restarting();
    }
  };
  game.init();
})();