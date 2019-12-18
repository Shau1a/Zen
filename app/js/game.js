(function() {
'use strict'


//=============================================//
// OVERLAYS
//=============================================//


let overlayReset = `<p>Вы уверены, что хотите прерваться и начать с начала?</p>
          <br><button class="acceptButton acceptReset">Да</button>
          <button class="cancelButton cancelReset">Нет, продолжаю играть</button>`;

let complexityChoise =  `<p>Выберите сложность игры:</p>
            <p class="complexity1 complexity_choice" data-coeff="0.65" data-delay="90"><a href="#">Медитативно</a></p>
            <p class="complexity2 complexity_choice" data-coeff="0.75" data-delay="70"><a href="#">Чуть быстрее</a></p>
            <p class="complexity3 complexity_choice" data-coeff="0.85" data-delay="60"><a href="#">Средняя сложность</a></p>
            <p class="complexity4 complexity_choice" data-coeff="0.95" data-delay="40"><a href="#">Высокая сложность</a></p>`;


let closeOverlayButton = document.getElementById('modal-close');
closeOverlayButton.addEventListener('click', function(e) {
  e.preventDefault();
  closeOverlay();
});

function openOverlay() {
  let field = document.querySelector('.modal-overlay');
  field.classList.remove('modal_closed'); 
}

function closeOverlay() {
  let field = document.querySelector('.modal-overlay');
  field.classList.add('modal_closed'); 
}

function setContent(content) {
  let field = document.querySelector('#modal-default .content');
  field.innerHTML = content;
};

function resetButtons() {
  let acceptButton = document.querySelector('#modal-default .acceptReset');
  let cancelButton = document.querySelector('#modal-default .cancelReset');
  
  acceptButton.addEventListener('click', function(e) {
    e.preventDefault();
    closeOverlay();
    game.reset();
  });

  cancelButton.addEventListener('click', function(e) {
    e.preventDefault();
    closeOverlay();
    view.start();
  });
};


function getComplexity() {
  let collection = document.querySelectorAll('#modal-default .complexity_choice');
  collection.forEach(function(elem) {
    elem.addEventListener('click', function(e){
      e.preventDefault();
      globalSettings.coeff = +this.getAttribute('data-coeff');
      globalSettings.delay = +this.getAttribute('data-delay');
      closeOverlay();
      view.start();
      game.newStart();
    });
  });
}



//=============================================//
// GAME
//=============================================//


let globalSettings = {
  width : 600,
  height : 600,
  centerX : 600/2,
  centerY : 600/2,
  speed : 1000,
  coeff : .7, // для установки и изменения скорости шаров
  delay : 90 // регулирует частоту появления шаров
};

//=============================================//
// GLOBAL FUNCTIONS
//=============================================//

// Вычисление угла для поворота игрока и стрелки, следующей за мышкой
// 
let countAngle = function(x, y) {
  let height = window.innerHeight,
      width  = window.innerWidth,
      deltaX = x - width / 2,
      deltaY = y - height / 2,
      angle = Math.asin(deltaX / Math.sqrt(deltaY * deltaY + deltaX * deltaX)) * 180 / Math.PI;
    
  if (y > height / 2) {
      angle = 180 - angle;
  }
  return angle;
};

// Создание буфера для отрисовки элементов
// 
let makeBuffer = function() {
  let buffer = document.createElement('canvas').getContext('2d');
  return buffer;
};
  
let clear = function() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255,255,255,.97)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
};

let getRandomColor = function() {
  let r = function () { 
    return Math.floor(Math.random()*256) 
  };
  let a = Math.random().toFixed(2);
  a >= 0.22 ? a = a : a = 0.22;
  return `rgba(${r()}, ${r()}, ${r()}, ${a})`;
};

let getData = function() {
  if (window.localStorage.getItem('ZenGameScores')) {
      let ZenGameScores = JSON.parse(window.localStorage.getItem('ZenGameScores'));
      let score = `${ZenGameScores['score']}`;
      return score || 0;
  }
  else {
      return 0;
  }
};

let saveData = function(score) {
  let ZenGameScores = {};
  ZenGameScores['score'] = score;
  window.localStorage.setItem('ZenGameScores', JSON.stringify(ZenGameScores));
};


//=============================================//
// CLASSES
//=============================================//


//==============//
// HERO
//==============//

class Hero {
  constructor(ctx, scale) {
    this.ctx = ctx;
    this.width = this.height = scale;
    this.x = globalSettings.centerX - scale/2;
    this.y = globalSettings.centerY - scale/2;
    this.convW = this.convH = -scale/2;
    this.alive = true;
  }

  draw (rotation) {
    let bufCtx = makeBuffer();
    let startX = rotation ? this.convW : this.x;
    let startY = rotation ? this.convH : this.y;
    
    bufCtx.clearRect(0, 0, this.width, this.height);
    
    bufCtx.beginPath();
    bufCtx.moveTo(50,0);
    bufCtx.lineTo(100,100);
    bufCtx.lineTo(0,100);
    
    let gradient = bufCtx.createLinearGradient(50, 0, 100, 100);
    gradient.addColorStop(0, "#FF9966");
    gradient.addColorStop(1, "#FF0000");
    bufCtx.fillStyle = gradient;
    bufCtx.fill();
    this.ctx.drawImage(bufCtx.canvas, 0, 0, 100, 100, startX, startY, this.width, this.height);
  }

  reset() {
    this.alive = true;
  }
  
  rotate (deg) {
    let rad = deg * Math.PI / 180; 
    this.ctx.translate(globalSettings.centerX, globalSettings.centerY);
    this.ctx.rotate(rad);
    this.draw(true);
    this.ctx.resetTransform();
  }
}


//==============//
// FOLOWED ARROW
//==============//

class Arrow {
  constructor(ctx, scale, x, y) {
    this.ctx = ctx;
    this.width = this.height = this.scale = scale;
    this.x = x;
    this.y = y;
    this.convW = this.convH = -scale/2;
  }

  draw (rotation) {
    let bufCtx = makeBuffer();
    let startX = rotation ? this.convW : this.x;
    let startY = rotation ? this.convH : this.y;
    
    bufCtx.clearRect(0, 0, this.width, this.height);
    
    bufCtx.beginPath();
    bufCtx.moveTo(50,0);
    bufCtx.lineTo(100,100);
    bufCtx.lineTo(50,70);
    bufCtx.lineTo(0,100);
    
    let gradient = bufCtx.createLinearGradient(50, 0, 100, 100);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'blue');
    bufCtx.fillStyle = gradient;
    bufCtx.fill();
    this.ctx.drawImage(bufCtx.canvas, 0, 0, 100, 100, startX, startY, this.width, this.height);
  }
  
  rotate (deg) {
    let rad = deg * Math.PI / 180; 
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(rad);
    this.draw(true);
    this.ctx.resetTransform();
  }
  
  update (x, y, deg) {
    this.x = x - canvas.offsetLeft;
    this.y = y - canvas.offsetTop;
    this.rotate(deg);
  }
}


//==============//
// ENEMY-BALLS
//==============//

class Enemy {
  constructor (x, y, ctx) {
    this.x = x;
    this.y = y;
    this.x_velocity = -(this.x - globalSettings.centerX) / (globalSettings.speed / globalSettings.coeff);
    this.y_velocity = -(this.y - globalSettings.centerY) / (globalSettings.speed / globalSettings.coeff); 

    this.ctx = ctx;
    this.alive = true;    
    this.checked = false;
    //
    this.color = getRandomColor();
    this.radius = Math.floor( 20 + Math.random() * 20 );
  }
    
  draw () {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.restore();
  }
  
  collisionPlayer (player) {
    let dx = this.x - player.x;
    let dy = this.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
   
    if (distance < this.radius + player.width/2) {
      this.radius++;
      if (this.radius >= 80) {
        player.alive = false;
      }
    }
  }

  collisionArrow (killer) {
    let dx = this.x - killer.x;
    let dy = this.y - killer.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
   
    if (distance < this.radius + killer.width/2) {
      this.checked = true;
      game.score+=1;
      killer.alive = false;
    }
  }
  
  reset (params) {
    this.x = params.x;
    this.y = params.y;
    this.x_velocity = -(this.x - globalSettings.centerX) / (globalSettings.speed / globalSettings.coeff);
    this.y_velocity = -(this.y - globalSettings.centerY) / (globalSettings.speed / globalSettings.coeff); 
    this.checked = false;
    this.alive = true;
    this.color = getRandomColor();
    this.radius = Math.floor( 20 + Math.random() * 20 );
  }
  
  update () {
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
}


//==============//
// KILLER-ARROWS
//==============//

class Killer { 
  constructor(x, y, ctx, scale, toX, toY, b) {
    this.x = globalSettings.centerX;
    this.y = globalSettings.centerY;
    this.ctx = ctx;
    this.width = this.height = this.scale = scale;
    this.convW = this.convH = -scale/2;
    this.checked = false;
    this.alive = true;
    this.directionX = toX;
    this.directionY = toY;
    this.x_velocity = -(globalSettings.centerX - this.directionX) / (globalSettings.speed/10);
    this.y_velocity = -(globalSettings.centerY - this.directionY) / (globalSettings.speed/10); 
    this.degree = b;
  }

  draw (rotation) {
    let bufCtx = makeBuffer();
    let startX = rotation ? this.convW : this.x;
    let startY = rotation ? this.convH : this.y;
    
    bufCtx.clearRect(0, 0, this.width, this.height);
    
    bufCtx.beginPath();
    bufCtx.moveTo(50,0);
    bufCtx.lineTo(90,100);
    bufCtx.lineTo(50,60);
    bufCtx.lineTo(0,90);
    
    let gradient = bufCtx.createLinearGradient(50, 0, 50, 100);
    gradient.addColorStop(0, 'yellow');
    gradient.addColorStop(1, 'green');
    bufCtx.fillStyle = gradient;
    bufCtx.fill();
    this.ctx.drawImage(bufCtx.canvas, 0, 0, 100, 100, startX, startY, this.width, this.height);
  }
  
  rotate (deg) {
    let rad = deg * Math.PI / 180; 
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(rad);
    this.draw(true);
    this.ctx.resetTransform();
  }
  
  reset (params) {
    this.x = globalSettings.centerX;
    this.y = globalSettings.centerY;
    this.directionX = params.toX;
    this.directionY = params.toY;
    this.degree = params.b;
    this.x_velocity = -(globalSettings.centerX - this.directionX) / (globalSettings.speed/10);
    this.y_velocity = -(globalSettings.centerY - this.directionY) / (globalSettings.speed/10); 
    this.checked = false;
    this.alive = true;
  }
  
  update () {
    if (this.directionX !== null && this.directionY !== null) {
      this.x += this.x_velocity;
      this.y += this.y_velocity;
      this.rotate(this.degree);
      if (this.checked == true || this.x > canvas.width || this.y > canvas.height) {
        this.alive = false;
      }
    }
  }
}


//==============//
// OBJECT-MANAGER
//==============//

class Pool {
  constructor(object) {
    this.object = object; 
    this.objects = [];
    this.pool = [];
  }
  
  // Если в хранилище неиспользуемых объектов есть нужный объект - берем его и используем снова
  get (params) {
    if (this.pool.length != 0) {
      let object = this.pool.pop();
      object.reset(params);
      this.objects.push(object);
      return object;
    } 
    else {
      this.objects.push(new this.object(params.x, params.y, params.ctx, params.scale, params.toX, params.toY, params.b));
      return this;
    }
  }

  // Если запрашиваемый объект есть в массиве используемыех объектов - перемещаем его в хранилище 
  store (object) {
    let index = this.objects.indexOf(object);
    if (index != -1) {
      this.pool.push(this.objects.splice(index, 1)[0]);
    }
  }

  // Перемещение всех объектов из массива используемых в хранилище
  storeAll () {
    for (let index = this.objects.length - 1; index > -1; --index) {
      this.pool.push(this.objects.pop());
    }
  }
}


//==============//
// GLOBAL VARIABELS
//==============//

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = globalSettings.width;
canvas.height = globalSettings.height;

let x, y, angle, ID;


//=============================================//
// GAME-MODEL
//=============================================//

let model = {
  hero : new Hero(ctx, 60),
  arrow : new Arrow (ctx, 20, 0, 0),
  enemies_pool : new Pool(Enemy),
  bullets_pool : new Pool(Killer),

  topBorder : canvas.offsetTop - 50,
  leftBorder : canvas.offsetLeft - 50,
  rightBorder : canvas.offsetLeft + canvas.width + 50,
  bottomBorder : canvas.offsetTop + canvas.height + 50,
  
  count : 0,
  delay : Math.floor(60 + Math.random() * globalSettings.delay),
   
  spawnEnemies : function() {
    this.count ++;
    
    if (this.count == this.delay) {
      this.count = 0;
      this.delay = Math.floor(60 + Math.random() * globalSettings.delay);
      
      let randomize = Math.floor(1 + Math.random() * 5); 

      if (randomize == 1) {
        this.enemies_pool.get( {x: this.leftBorder + Math.random() * this.rightBorder, y: -100, ctx : ctx} );
      } 
      if (randomize == 2) {
        this.enemies_pool.get( {x: this.leftBorder + Math.random() * this.rightBorder, y: 700, ctx : ctx} );
      }
      if (randomize == 3) {
        this.enemies_pool.get( {x: -100, y: this.topBorder + Math.random() * this.bottomBorder, ctx : ctx} );
      }      
      if (randomize == 4) {
        this.enemies_pool.get( {x: 700, y: this.topBorder + Math.random() * this.bottomBorder, ctx : ctx} );
      }
    }
  },
  
  spawnBullets : function (toX, toY, b) {
    this.bullets_pool.get( {ctx : ctx, scale : 24, toX : toX, toY : toY, b : b} );
  },
  
  update : function () {
    for (let index = this.enemies_pool.objects.length - 1; index > -1; --index) {
      let enemy = this.enemies_pool.objects[index];
      enemy.draw();
      enemy.update();
      enemy.collisionPlayer(model.hero);
      
      for (let index = this.bullets_pool.objects.length - 1; index > -1; --index) {
        let bullet = this.bullets_pool.objects[index];
        enemy.collisionArrow(bullet);
      }
      if (!enemy.alive) {
        this.enemies_pool.store(enemy);
      }
    }
    
    for (let index = this.bullets_pool.objects.length - 1; index > -1; --index) {
      let bullet = this.bullets_pool.objects[index];
      bullet.update();
      if (!bullet.alive) {
        this.bullets_pool.store(bullet);
      }
    }
  }
};


//=============================================//
// GAME-VIEW
//=============================================//

let view = {
  render: function() {
    clear();

    model.hero.rotate(angle);
    model.arrow.update(x, y, angle);

    model.spawnEnemies();
    model.update();
  },

  loop : function() {
    if (model.hero.alive) {
      ID = undefined;
      controller.events();
      view.render();
      view.start();
      game.control();
    }
    else view.stop();
  },

  start : function() {
    if (!ID) {
       ID = window.requestAnimationFrame(view.loop);
       game.state = true;
       if (controller.restartButton.classList.contains('restart')) {
        controller.restartButton.classList.remove('restart');
       }
    }
  },

  stop : function() {
    if (ID) {
       window.cancelAnimationFrame(ID);
       ID = undefined;
       game.state = false;
       controller.restartButton.classList.add('restart');
    }
  },

  updateRes : function() {
    let res = getData();
    controller.resultField.innerHTML = `Лучший результат:<br>${res}`;
  }
};



//=============================================//
// GAME-CONTROLLER
//=============================================//

let controller = {
  stopButton : document.querySelector('.menu .menu_stop'),
  startButton : document.querySelector('.menu .menu_start'),
  restartButton : document.querySelector('.menu .menu_restart'),
  resultField : document.querySelector('.menu .menu_results'),

  events : function() {

    controller.stopButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (game.state) {
        view.stop();
        controller.stopButton.classList.add('active');
      }
    });

    controller.startButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (!game.state) {
        view.start();
        controller.stopButton.classList.remove('active');
      }
    });

    canvas.onclick = function(e) {
      let toX = (e.pageX - canvas.offsetLeft);
      let toY = (e.pageY - canvas.offsetTop);
      let b = countAngle(e.clientX, e.clientY);
      model.spawnBullets(toX, toY, b);
      if (played) {
        jump.play();
      }
    };

    document.body.onmousemove = function(e) {
      x = e.clientX;
      y = e.clientY;
      angle = countAngle(x, y);
    };
  },

  restarting : function() {
    controller.restartButton.addEventListener('click', function(e) {
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
};


//=============================================//
// GAME-FLOW CONTROLL
//=============================================//

let game = {
  state : true,
  score : 0,
  counter : 0,
  level : 0,

  control : function() {
    game.check++;
    let scoreField = document.querySelector('.menu .menu_score');
    let levelField = document.querySelector('.menu .menu_level');
    scoreField.innerHTML = `Score / очки: ${Math.round(game.score)}`;
    levelField.innerHTML = `Level / уровень: ${game.level}`;
    
    if (game.score >= 10 && !(game.score % 10) && !(game.counter % 10)) {
      globalSettings.coeff += 0.05;
      game.level += 1;
      game.counter = 2;
    }      
    if (game.counter != 0 && game.score % 10) {
        game.counter = 0;
    }
  },

  newStart : function() {
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

  reset : function() {
    let res = getData();
    if (game.score > res) {
      saveData(game.score);
    }

    setTimeout(function() {
      setContent(complexityChoise);
      openOverlay();
      getComplexity();      
    }, 500);   
  },

  init : function() {
    view.updateRes();
    view.start();
    controller.restarting();
  }
};


game.init();

})();