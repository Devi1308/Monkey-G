var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkey_running, monkey_collided;
var ground, invisibleGround, groundImage;

var bananaGroup, bananaImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

function preload(){
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");

  monkey_collided = loadAnimation("sprite_0.png");
  
  groundImage = loadImage("ground1.png");
  
  bananaImage = loadImage("banana.png");
  
  obstacle1 = loadImage("obstacle.png");
  obstacle2 = loadImage("rock2.png");
  obstacle3 = loadImage("rock3_.png");
  obstacle4 = loadImage("rock4.png");
  obstacle5 = loadImage("rock5.png");
  obstacle6 = loadImage("rock6.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.wav");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.wav");
}

function setup() {
  createCanvas(600, 200);

  
  
  monkey = createSprite(50,160,20,50);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collided", monkey_collided);
  monkey.scale = 0.2;
  
  ground = createSprite(600,50,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale=2.8;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.3;
  
  restart = createSprite(300,170);
  restart.addImage(restartImg);
  restart.scale=0.1;
    
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Banana Groups
  obstaclesGroup = createGroup();
  bananaGroup = createGroup();

  
  monkey.setCollider("rectangle",0,0,monkey.width,monkey.height);
  monkey.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  
   
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
   
    if(monkey.isTouching(bananaGroup)){
       for(var k=0;k<bananaGroup.length;k=k+1){
         if(bananaGroup.contains(bananaGroup.get(k))){
           if(monkey.isTouching(bananaGroup.get(k))){
             bananaGroup.get(k).destroy();
             score=score+1;
           }
         }
       }
      
   }
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& monkey.y >= 100) {
        monkey.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8
  
    //spawn the bananas
    spawnBanana();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(monkey)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the monkey animation
      monkey.changeAnimation("collided", monkey_collided);
    
     if(mousePressedOver(restart)) {
      reset();
    }

     
      ground.velocityX = 0;
      monkey.velocityY = 0;
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     bananaGroup.setVelocityXEach(0);    
   }
  
 
  //stop monkey from falling down
monkey.collide(invisibleGround);
  
  

  drawSprites();
  text("Score: "+ score, 500,50);
  
}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  bananaGroup.destroyEach();
  monkey.changeAnimation("running", monkey_running);
  score=0;
}

function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   obstacle.setCollider("rectangle",0,0,obstacle.width,obstacle.height);
  monkey.debug = true
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale=0.1;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale=0.1;
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale=0.1;  
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.scale=0.01;
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.scale=0.000001;
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.scale=0.1;
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;

   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnBanana() {
  //write code here to spawn the bananas
  if (frameCount % 60 === 0) {
    var banana = createSprite(600,120,40,10);
    banana.y = Math.round(random(40,80));
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -3;
    
     //assign lifetime to the variable
    banana.lifetime = 200;
    
    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    //add each banana to the group
    bananaGroup.add(banana);
  }
}





