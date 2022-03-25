//setting variables 
var player, bomb, coin, path, FullPower, MediumPower, LowPower;
var battery = 0;
var score = 0;

var noseX = 0;
var noseY = 0;

rightWristScore = 0;
leftWristScore = 0;

randomNumber = 0;

function preload() {
  //loading images
  player = loadAnimation("assets/player1.png", "assets/player2.png", "assets/player3.png", "assets/player4.PNG", "assets/player5.png");
  bomb = loadImage("assets/bomb.png");
  coin = loadImage("assets/coin.png");
  path = loadImage("assets/path.png");

  FullPower = loadImage("assets/fullpower.png");
  MediumPower = loadImage("assets/mediumPower.png");
  LowPower = loadImage("assets/lowPower.png");
  music = loadSound("assets/Subway-Surfers-theme-song.mp3");
}

function setup() {
  canvas = createCanvas(300,700);

  setupNinjaGame();

  video = createCapture(VIDEO);
  video.size(600,400);
  video.parent('game_console');
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

}

function modelLoaded() {
  console.log('Model Loaded!');
  }

function gotPoses(results)
  {
  console.log(results);
  if(results.length > 0)
  {   
    noseX = results[0].pose.nose.x;
    noseY = results[0].pose.nose.y;
    
    rightWristScore=results[0].pose.keypoints[10].score;
    leftWristScore = results[0].pose.keypoints[9].score;
    
  }
}

function setupNinjaGame() {

  //setting path
  movingPath = createSprite(150, 200, 100, 10);
  movingPath.addImage("movingPath", path);
  movingPath.velocityY = 5;


  //setting player Sprite
  playerRunning = createSprite(110, 600, 10, 10);
  playerRunning.addAnimation("playerRunning", player);
  playerRunning.scale = 0.5;

  //setting bomb Sprite
  bombMoving = createSprite(110, 0, 10, 10);
  bombMoving.addImage("bomb", bomb);
  bombMoving.velocityY = 5;
  bombMoving.scale = 0.1;

  //setting coin Sprite
  coinMoving = createSprite(210, -300, 10, 10);
  coinMoving.addImage("coinMoving", coin);
  coinMoving.velocityY = 5;
  coinMoving.scale = 0.5;

  //setting FullPower Sprite
  playerFullPower = createSprite(250, 300, 10, 10);
  playerFullPower.addImage("playerFullPower", FullPower);
  playerFullPower.scale = 0.1;

  music.play();
}
 
function draw() {

  //movement
  movement();
  drawSprites();

  //infinte running loop
  if (movingPath.y > 400) {
    movingPath.y = 150
  }
  if (bombMoving.y > 700) {
    bombMoving.x = 150;
    bombMoving.y = -500;
    bombMoving.velocityY = 10;

  }

  if (coinMoving.y > 700) {
    coinMoving.x = 200;
    coinMoving.y = -800;
    coinMoving.velocityY = 5;
  }

  if(rightWristScore > 0.1)
  {
    document.getElementById("test").innerHTML = "Game is at high speed";
    document.getElementById("test").style.background = "red";
    movingPath.velocityY = 15;
    bombMoving.velocityY = 15;
    coinMoving.velocityY = 15;
  }
  if(leftWristScore > 0.1)
  {
    document.getElementById("test").innerHTML = "Game is at normal speed";
    document.getElementById("test").style.background = "#5cb85c";
    movingPath.velocityY = 5;
    bombMoving.velocityY = 10;
    coinMoving.velocityY = 5;
  }

  //player hits bomb, then
  if (playerRunning.isTouching(bombMoving)) {
    bombMoving.y = -800;
    battery = battery + 1;

    if (battery == 1) {
      playerFullPower.visible = false;
  
      playerMediumPower = createSprite(250, 300, 10, 10);
      playerMediumPower.addImage("playerMediumPower", MediumPower);
      playerMediumPower.scale = 0.13;
    }
     if (battery == 2) {
      playerMediumPower.visible = false;
      playerLowPower = createSprite(250, 300, 10, 10);
      playerLowPower.addImage("playerLowPower", LowPower);
      playerLowPower.scale = 0.13;
    }

  }

  //player hits coin, then
  if (playerRunning.isTouching(coinMoving)) {
    coinMoving.y = -800;
    score = score + 10;
    document.getElementById("score").innerHTML = "Score = " + score;
  }
}

function movement() {
  if (playerRunning.x > 100||playerRunning.x < 300 ) {
    playerRunning.x = noseX/2;
  }
}

