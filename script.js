var app = angular.module('bubbleApp', []);

app.controller("bubbleCtrl", function($timeout, $document, $timeout) {

  this.rowsCount = 8;
  this.bubbleCount = 0;
  this.bubbles = [];
  this.stepCount = 0;
  this.level = 1;
  this.score = 0;
  this.isStarted = false;
  this.mistakeCount = 0;
  this.mistakeBound = 5;
  this.gOver = false;
  this.engStart = 97;
  this.engLength = 26;
  this.engCaps = 32;
  this.rusStart = 1072;
  this.rusLength = 32;
  this.rusCaps = 32;
  this.langStart = 97;
  this.langLength = 26;
  this.langCaps = 32;
  this.language = 'English';
  this.aChild = 0;
  this.gStarted = false;

  this.gameStep = function(){
    this.moveBubbles();
    this.stepCount++;
    if(this.stepCount === 60){
      this.stepCount = 0;
      this.createBubble();
      this.bubbleCount++;
      this.checkLevel();
    }
    $timeout(this.gameStep, Math.max(50 - this.level*4,1+50*this.aChild));
  }.bind(this);

  this.languageSet = function(){
    if(this.language === 'Русский'){
      this.langStart = this.rusStart;
      this.langCaps = this.rusCaps;
      this.langLength = this.rusLength;      
    } else {
      this.langStart = this.engStart;
      this.langCaps = this.engCaps;
      this.langLength = this.engLength;
    }
  }.bind(this);

  this.moveBubbles = function() {
    for(var i = 0; i < this.bubbles.length; i++) {
        if(this.bubbles[i].top<500){
          this.bubbles[i].top++;
        } else {
          this.removeBubble(i);
          this.mistake();
        }
    }
  }.bind(this);

  this.imaChild = function(){
    this.aChild = 1;
  }.bind(this);

  this.mistake = function(){
    this.mistakeCount++;
    if(this.mistakeCount === this.mistakeBound){
      this.gOver = true;  
      
    }
  }.bind(this);

  this.toggleGOver = function(){
    this.gOver = !this.gOver;
  }.bind(this);

  this.toggleGStarted = function(){
    this.gStarted = !this.gStarted;
  }.bind(this);

  this.gameOver = function(){
    console.log('GAME OVER!!!');
      
    //alert('GAME OVER! Your score is ' + this.score + '.');
    this.score = 0;
    this.level = 1;
    this.mistakeCount = 0;
    this.bubbleCount = 0;
    var blen = this.bubbles.length;
    for (var i=0; i<blen; i++){
      this.removeBubble(0);
    }
    this.toggleGStarted()
  }.bind(this);

  this.checkLevel = function(){
    if(this.bubbleCount === 3 * this.level){
      this.bubbleCount = 0;
      this.level++;
      this.mistakeCount = 0;
      console.log('LEVEL: ', this.level);
    }
  }.bind(this);

  this.startGame = function(){
    this.gStarted = true;
    this.removeAllBubbles();
    this.level = 1;
    this.score = 0;
    this.stepCount = 0;
    this.mistakeCount = 0;
    this.languageSet();
    if(!this.isStarted){
      $timeout(this.gameStep, 50);
      this.isStarted = true;
    };
  }.bind(this);

  this.removeAllBubbles = function(){
    while(this.bubbles.length>0){
      this.removeBubble(0);
    }
  }.bind(this);

  this.onKeyPress = function (e) {
    if (!this.gOver){
      console.log(e.keyCode);
      var keyChar = String.fromCharCode(e.keyCode - this.langCaps);
      var gotOne = 0;
      for (var i = 0; i < this.bubbles.length; i++) {
        if (keyChar === this.bubbles[i].char) {
          this.removeBubble(i);
          this.goal();
          gotOne = 1;
          break;
        }
      }
      if (gotOne === 0){
        this.score-= this.level;        
      }
    }
  }.bind(this);

  this.removeBubble = function (index) {
    this.bubbles.splice(index,1);
    console.log('bubble'+index+'deleted');
  }.bind(this);

  this.goal = function(){
    this.score+= this.level;
    console.log(this.score);
  }.bind(this);

  this.createBubble = function() {
    var newCode = Math.floor(Math.random() * this.langLength) + this.langStart;
    var newChar = String.fromCharCode(newCode - this.langCaps);
    var newLeft = Math.floor(Math.random() * this.rowsCount);
    this.bubbles.push({left: newLeft*100, top: -60, char: newChar});
    console.log(newChar+' '+newCode);
  }.bind(this);

  $document.bind('keypress', this.onKeyPress);
  
});

app.directive('gameSettings', function() {
  return {
    restrict: 'A',
    templateUrl: 'gamesettings.html'
  };
});