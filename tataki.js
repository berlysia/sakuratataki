"use strict";

// 穴
Hole.prototype = new createjs.Container();
function Hole() {
  createjs.Container.call(this);

  this.width = 640;
  this.height = 832;
  this.holeH = 120;

  var hole = new createjs.Shape();
  this.addChild(hole);
  hole.graphics.beginFill('black').drawEllipse(0, -this.holeH/2, this.width, this.holeH);
}

// 穴にもぐらを入れる
Hole.prototype.addSayoko = function() {
  var sayoko = this.sayoko = new Sayoko();
  this.addChild(sayoko);
  sayoko.y = 0;

  // もぐら絵の下端を穴に沿って切り抜く
  sayoko.mask = new createjs.Shape();
  sayoko.mask.graphics
    .rect(0, -sayoko.height, sayoko.width, sayoko.height)
    .drawEllipse(0, -this.holeH/2, this.width, this.holeH);

  // もぐらを叩いた
  var hole = this;
  sayoko.on('click', function(e) {
    hole.poka(function() {
      setTimeout(function() {
        hole.removeSayoko();
        hole.nyoki();
      }, 1000);
    });
  });
}

// もぐらを取り除く
Hole.prototype.removeSayoko = function() {
  this.removeChild(this.sayoko);
  delete this.sayoko;
}

// ニョキ
Hole.prototype.nyoki = function() {
  if (this.sayoko) return; // すでにいたらやめる

  this.addSayoko();

  this.sayoko.y = this.sayoko.height;
  createjs.Tween.get(this.sayoko)
    .to({y: 200}, 1000, createjs.Ease.backOut);
}

// ポカ
Hole.prototype.poka = function(callback) {
  if (!callback) callback = function(){}
  var s = this.sayoko;
  createjs.Tween.removeTweens(s);
  createjs.Tween.get(s)
    .to({scaleX: 1.2, scaleY: 0.8}, 180, createjs.Ease.sineOut)
    .to({scaleX: 0.8, scaleY: 1.1, y: s.height*1.1}, 120, createjs.Ease.sineIn)
    .to({scaleX: 1, scaleY: 1})
    .call(callback);
}

// もぐら
function Sayoko() {
  var ids = IMAGE_IDS;
  var url = 'http://m.ip.bn765.com/'+
    ids[Math.floor(Math.random()*ids.length)];

  var bmp = new createjs.Bitmap(url);
  bmp.width = 640;
  bmp.height = 832;

  // ピクセルを取れないので適当な当たり判定
  bmp.hitArea = new createjs.Shape();
  bmp.hitArea.graphics.beginFill('black').rect(60, 80, 500, 420);

  // まんなか下端が中心
  bmp.x = bmp.width/2;
  bmp.regX = bmp.width/2;
  bmp.regY = bmp.height;

  return bmp;
}

function Game(canvas) {
  var stage = new createjs.Stage(canvas);
  createjs.Touch.enable(stage);

  var holes = this.holes = [];
  var positions = [
    {x: 30, y: 350},
    {x: 370, y: 350},
    {x: 200, y: 490},
    {x: 30, y: 610},
    {x: 370, y: 610},
  ];
  this.holes = positions.map(function(p) {
    var hole = new Hole();
    holes.push(hole);
    stage.addChild(hole);

    hole.x = p.x;
    hole.y = p.y;
    hole.scaleX = hole.scaleY = 0.5;

    hole.nyoki();
    return hole;
  });

  return stage;
}

function main() {
  var canvas = document.getElementById('canvas');
  canvas.addEventListener('selectstart', function(e) {e.preventDefault()}, false);
  var game = window.game = new Game(canvas);
  createjs.Ticker.addEventListener('tick', function() {
    game.update();
  });
}

main();
