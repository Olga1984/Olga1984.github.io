window.onload = init;

let map;
let ctxMap;

let pl;
let ctxPlayer;

let enemyCanvas;
let ctxEnemyCanvas;

let diamond;
let ctxDiamond;

let statistics;
let ctxStatistics;

let score;

let input;

let gameWidth = 1264;
let gameHeight = 632;

//game images
let background = new Image();
background.src = "images/bg2.jpg";

let background1 = new Image();
background1.src = "images/bg2.jpg";

let tiles = new Image();
tiles.src = "images/css_sprites.png";
//player variable
let player;

let isPlaying;

//creating enemies
let enemies = [];
let spawnEnemiesInterval;
let spawnEnemiesAmount = 10;

//common enemies and diamonds spawn time
let spawnTime = 8000;

//creating diamonds
let diamonds = [];
let diamondInterval;
let diamondsAmount = 5;
let daimColorarr;

//backgrounds var
let mapX = 0;
let map1X = gameWidth;
let bgmove = 6;

//mousecontrols for test
let mouseX;
let mouseY;

let requestAnimFrame = window.requestAnimationFrame;

//sounds
let theme_sound;
let diamond_sound;
let enemycrach_sound;
let gameover_sound;
let win_sound;

//initial
function init() {
    map = document.getElementById('map');
    ctxMap = map.getContext('2d');

    pl = document.getElementById('player');
    ctxPlayer = pl.getContext('2d');

    enemyCanvas = document.getElementById('enemy');
    ctxEnemyCanvas = enemyCanvas.getContext('2d');

    diamond = document.getElementById('diamond');
    ctxDiamond = enemyCanvas.getContext('2d');

    statistics = document.getElementById('statistics');
    ctxStatistics = statistics.getContext('2d');

    map.width = gameWidth;
    map.height = gameHeight;
    pl.width = gameWidth;
    pl.height = gameHeight;
    enemyCanvas.width = gameWidth;
    enemyCanvas.height = gameHeight;
    diamond.width = gameWidth;
    diamond.height = gameHeight;
    statistics.width = gameWidth;
    statistics.height = gameHeight;

    ctxStatistics.fillStyle = '#333eee';
    ctxStatistics.font = 'bold 15px Arial';

    player = new Player();

    //helper for keyCode
    input = new InputHandler();

    //game sounds
    theme_sound = document.getElementById('theme_sound');
    diamond_sound = document.getElementById('diamond_sound');
    enemycrach_sound = document.getElementById('enemy_sound');
    gameover_sound = document.getElementById('gameover_sound');
    win_sound = document.getElementById('win_sound');

    resetScore();
    startLoop();

    //test listener
    //document.addEventListener('mousemove', mouseMove, false);

    //play again listeners
    document.getElementById('play-again').addEventListener('click', playAgain);
    document.getElementById('play-again-winner').addEventListener('click', playAgain);
}


//if you lost or won
function playAgain() {
    resetScore();
    enemies = [];
    diamonds = [];
    startLoop();
}
//test function
/*function mouseMove(e) {
    mouseX =e.pageX-map.offsetLeft;
    mouseY =e.pageY -map.offsetTop;
    player.drawX = mouseX-player.width/2;
    player.drawY = mouseY-player.height/2;
}*/

function resetScore() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    document.getElementById('game-win').style.display = 'none';
    document.getElementById('winner-overlay').style.display = 'none';
    score = 6;
    theme_sound.play();
    theme_sound.volume = 0.3;
}


function spawnEnemy(count) {
    for (let i = 0; i < count; i++) {
        enemies[i] = new Enemy();
    }
}

function startCreatingEnemies() {
    stopCreatingEnemies();
    spawnEnemiesInterval = setInterval(function () {
        spawnEnemy(spawnEnemiesAmount)
    }, spawnTime);
}

function stopCreatingEnemies() {
    clearInterval(spawnEnemiesInterval);
}

//diamonds creating functions
function spawnDiamonds(count) {
    //different colors of diamonds
    daimColorarr = Colorarr();
    for (let i = 0; i < count; i++) {
        diamonds[i] = new Diamond();

    }
}

function startCreatingDiamonds() {
    stopCreatingDiamonds();
    diamondInterval = setInterval(function () {
        spawnDiamonds(diamondsAmount)
    }, spawnTime);
}

function stopCreatingDiamonds() {
    clearInterval(diamondInterval);
}
//loop functions
function loop() {
    if (isPlaying) {
        draw();
        update_game();
        requestAnimFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();
    startCreatingEnemies();
    startCreatingDiamonds();
}

function stopLoop() {
    isPlaying = false;
}

//draving objects
function draw() {

    player.draw();
    clearCtxEnemy();
    clearCtxDiamonds();
    for (let k = 0; k < enemies.length; k++) {
        enemies[k].draw();
    }
    for (let j = 0; j < diamonds.length; j++) {
        diamonds[j].draw();
    }
}

function update_game() {
    if (input.isDown(37)) { //left
        player.drawX -= player.speed;
    }
    if (input.isDown(39)) { //right
        player.drawX += player.speed;
    }
    if (input.isDown(38)) { //up
        player.drawY -= player.speed;
    }
    if (input.isDown(40)) { //down
        player.drawY += player.speed;
    }
    moveBg();
    drawBg();
    updateStatistic();


    player.update();

    for (let n = 0; n < enemies.length; n++) {
        enemies[n].update();
    }
    for (let j = 0; j < diamonds.length; j++) {
        diamonds[j].update();
    }
}

//Objects
import Player from './player.js';

function Enemy() {
    this.srcX = 100;
    this.srcY = 1008;
    this.drawX = Math.floor(Math.random() * gameWidth) + gameWidth;
    this.drawY = Math.floor(Math.random() * gameHeight);
    this.width = 105;
    this.height = 70;

    this.speed = 7;
    this.ticks = 0;
    this.spriteIndex = 0;
    this.sprites = [this.srcY, this.srcY + 60, this.srcY + 130];
}

function Diamond() {
    this.srcX = daimColorarr;
    this.srcY = 133;
    this.drawX = Math.floor(Math.random() * gameWidth) + gameWidth;
    this.drawY = Math.floor(Math.random() * gameHeight);
    this.width = 32;
    this.height = 37;

    this.speed = 9;
    this.ticks = 0;
    this.spriteIndex = 0;
    this.sprites = [this.srcX, this.srcX + 32, this.srcX + 64, this.srcX + 96, this.srcX + 128, this.srcX + 160, this.srcX + 192];
}
//player methods
Player.prototype.draw = function () {
    clearCtxPlayer();

    ctxPlayer.drawImage(tiles, this.sprites[this.spriteIndex], this.srcY, this.width, this.height,
        this.drawX, this.drawY, this.width, this.height);
}
Player.prototype.update = function () {
    //animation
    this.ticks++;
    if (this.ticks % 15 === 0) {
        this.spriteIndex = (this.spriteIndex + 1) % this.sprites.length;
    }
    if (score <= 5) {
        this.srcY = 530;
    }
    if (score >= 6) {
        this.srcY = 400;
    }
    if (score <= 0) {
        stopLoop();
        gameOver();
    }
    if (score >= 30) {
        stopLoop();
        gameWin();
    }
    if (this.drawX < 0) {
        this.drawX = 0;
    }
    if (this.drawX > gameWidth - this.width) {
        this.drawX = gameWidth - this.width;
    }
    if (this.drawY < 0) {
        this.drawY = 0;
    }
    if (this.drawY > gameHeight - this.height) {
        this.drawY = gameHeight - this.height;
    }
    for (let i = 0; i < enemies.length; i++) {
        if (this.drawX + 65 >= enemies[i].drawX && this.drawY + 60 >= enemies[i].drawY && this.drawX + 65 <= enemies[i].drawX + enemies[i].width && this.drawY + 60 <= enemies[i].drawY + enemies[i].height) {
            score -= 3;
            enemycrach_sound.play();
            enemies[i].destroyarr();

        }
    }
    for (let j = 0; j < diamonds.length; j++) {
        if (this.drawX + 130 >= diamonds[j].drawX && this.drawY + 58 >= diamonds[j].drawY && this.drawX + 130 <= diamonds[j].drawX + diamonds[j].width && this.drawY + 58 <= diamonds[j].drawY + diamonds[j].height) {
            score += 5;
            diamond_sound.play();
            diamonds[j].destroy();

        }
    }
}
//enemy methods
Enemy.prototype.draw = function () {
    ctxEnemyCanvas.drawImage(tiles, this.srcX, this.sprites[this.spriteIndex], this.width, this.height,
        this.drawX, this.drawY, this.width, this.height);
}
Enemy.prototype.update = function () {

    this.drawX -= this.speed;
    //animation
    this.ticks++;
    if (this.ticks % 15 === 0) {
        this.spriteIndex = (this.spriteIndex + 1) % this.sprites.length;
    }
    //disappering
    if (this.drawX + this.width < 0) {
        this.destroyarr();
    }
}
//delete obj from enemies array
Enemy.prototype.destroyarr = function () {
    enemies.splice(enemies.indexOf(this), 1);
}

//diamond methods
Diamond.prototype.draw = function () {
    ctxDiamond.drawImage(tiles, this.sprites[this.spriteIndex], this.srcY, this.width, this.height,
        this.drawX, this.drawY, this.width, this.height);
}
Diamond.prototype.update = function () {
    this.drawX -= this.speed;
    //animation
    this.ticks++;
    if (this.ticks % 5 === 0) {
        this.spriteIndex = (this.spriteIndex + 1) % this.sprites.length;
    }
    //disappering
    if (this.drawX + this.width < 0) {
        this.destroy();
    }
}
//delete obj from diamonds array
Diamond.prototype.destroy = function () {
    diamonds.splice(diamonds.indexOf(this), 1);
}
//helper for random diamonds generating
function Colorarr() {
    let c = Math.floor(Math.random() * 10);
    if (c <= 1) {
        return 20;
    } else if (c === 2) {
        return 300;
    } else if (c === 4) {
        return 576;
    } else if (c === 6 || c === 7) {
        return 852;
    } else if (c === 5 || c === 8) {
        return 1128;
    } else if (c === 3 || c >= 9) {
        return 1404;
    }
}

//helper keyCode
function InputHandler() {
    this.down = {};
    this.pressed = {};
    let _this = this;
    document.addEventListener('keydown', function (evt) {
        _this.down[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function (evt) {
        delete _this.down[evt.keyCode];
        delete _this.pressed[evt.keyCode];
    });

}
InputHandler.prototype.isDown = function (code) {
    return this.down[code];
};
InputHandler.prototype.isPressed = function (code) {
    if (this.pressed[code]) {
        return false;
    } else if (this.down[code]) {
        return this.pressed[code] = true;
    }
    return false;
};
//background moving function
function moveBg() {
    mapX -= bgmove;
    map1X -= bgmove;
    if (mapX + gameWidth < 0) {
        mapX = gameWidth - 5;
    }
    if (map1X + gameWidth < 0) {
        map1X = gameWidth - 5;
    }
}
//2 backgrounds
function drawBg() {
    ctxMap.clearRect(0, 0, gameWidth, gameHeight);
    ctxMap.drawImage(background, 0, 0, gameWidth, gameHeight,
        mapX, 0, gameWidth, gameHeight);
    ctxMap.drawImage(background1, 0, 0, gameWidth, gameHeight,
        map1X, 0, gameWidth, gameHeight);
}

//clear
function clearCtxPlayer() {
    ctxPlayer.clearRect(0, 0, gameWidth, gameHeight);
    // drawImage(tiles,0,0);
}

function clearCtxEnemy() {
    ctxEnemyCanvas.clearRect(0, 0, gameWidth, gameHeight);
}

function clearCtxDiamonds() {
    ctxDiamond.clearRect(0, 0, gameWidth, gameHeight);
}

function updateStatistic() {
    ctxStatistics.clearRect(0, 0, gameWidth, gameHeight);
    ctxStatistics.fillText("Score" + score, 10, 20);
}

//end of game
function gameOver() {
    player.srcY = 530;
    theme_sound.pause();
    gameover_sound.play();
    gameover_sound.volume = 0.1;
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
}

function gameWin() {
    player.srcY = 400;
    theme_sound.pause();
    win_sound.play();
    win_sound.play();
    win_sound.play();
    document.getElementById('game-win').style.display = 'block';
    document.getElementById('winner-overlay').style.display = 'block';
}
