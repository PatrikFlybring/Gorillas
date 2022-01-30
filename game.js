var canvasGameSettings = document.getElementById('canvasGameSettings');
var ctxGameSettings = canvasGameSettings.getContext('2d');

var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');

var canvasCity = document.getElementById('canvasCity');
var ctxCity = canvasCity.getContext('2d');

var canvasInput = document.getElementById('canvasInput');
var ctxInput = canvasInput.getContext('2d');

var canvasGorilla = document.getElementById('canvasGorilla');
var ctxGorilla = canvasGorilla.getContext('2d');

var canvasBall = document.getElementById('canvasBall');
var ctxBall = canvasBall.getContext('2d');

var canvasSun = document.getElementById('canvasSun');
var ctxSun = canvasSun.getContext('2d');


var imageObj = new Image();
imageObj.src = 'Bilder/AllinOne.png';


var hitBuilding, hitGorilla1, hitGorilla2;
//Object
var gameSettings;
var city;
var banan;
var gorilla1;
var gorilla2;
var sunny;
//Size
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;

//gameState
var gameState;
var angle_Input = 0;
var velocity_Input = 1;
var banana_Thrown = 2;
var gorilla1_Hit = 3;
var gorilla2_Hit = 4;
var building_Hit = 5;
var sun_Hit = 6;
//Interval
var gameInterval;
var timeInterval;
var VictoryInterval;
var drawInterval;

//gameStates --- Player
var playerTurn;
var angle;
var velocity;
var User;

///////
var startX = 0;
var startY = 0;
var timeT = 0;
var elapsed = 0;
var time = 0;
var previous = 0;
var count = 0;

var posX = 0;
var startX;
var startY;


//Main start
function init() {
	drawBg();
	city = new city();
	gorilla1 = new gorilla();
	gorilla2 = new gorilla();
	banana = new banana();
	sunny = new sunny();
	playerTurn = 1;
	gameSettings.player1Score = 0;
	gameSettings.player2Score = 0;

	newGame();
}

function newGame(){
	clearCtxCity();
	clearCtxGorilla();
	clearInterval(gameInterval);
	clearInterval(timeInterval);


	city.placeBuildings();
	city.placeGorillas();
	gorilla1.draw();
	gorilla2.draw();
	sunny.reset();
	angle = "";
	velocity = "";
	gameState = angle_Input;
	document.addEventListener('keydown', playerInput, false);
	gameInterval = setInterval(drawPlayerInput, 30);
	timeInterval = setInterval(function timer(){time += 1; }, 1);
}

function startPage(username){
	User = username;
    gameSettings = new gameSettings();
    gameSettings.drawBg();
    document.addEventListener('keydown', checkInput, false);
    drawInterval1 = setInterval(drawGameSettings, 30); //Intervall med  millisekunder
}

function drawPlayerInput(){
	clearCtxInput();
	ctxInput.font = '12pt Calibri';
	ctxInput.textAlign = 'left';
    ctxInput.fillStyle = 'black';

    ctxInput.fillText(gameSettings.player1Name, 0, 12);
    ctxInput.fillText('Score: ', 0, 24);
    ctxInput.fillText(gameSettings.player1Score, 50, 24);
    
    ctxInput.fillText(gameSettings.player2Name, 650, 12);
    ctxInput.fillText('Score: ', 650, 24);
    ctxInput.fillText(gameSettings.player2Score, 700, 24);
    
    if(gameState == angle_Input || gameState == velocity_Input){ //Angle
    	if(playerTurn == 1){
    		ctxInput.fillText('Angle: ', 0, 36);
    		ctxInput.fillText(angle, 50, 36);
    	}else{
    		ctxInput.fillText('Angle: ', 650, 36);
    		ctxInput.fillText(angle, 700, 36);
    	}
    	
    	if(gameState == velocity_Input){ //Velocity
    		if(playerTurn == 1){
    			ctxInput.fillText('Velocity: ', 0, 48);
    			ctxInput.fillText(velocity, 70, 48);
    		}else{
    			ctxInput.fillText('Velocity: ', 650, 48);
    			ctxInput.fillText(velocity, 720, 48);
    		}
    	}
    }
    if(gameState == banana_Thrown){
    	banana.draw();
    }
    if(gameState == building_Hit || gameState == gorilla1_Hit || gameState == gorilla2_Hit ){
    	clearCtxBanana();
    	update();
    }
}

function update(){
	elapsed = time - previous;
	switch(gameState){
		case banana_Thrown:
			banana.update();
			banana.hit();
			
			if(sunny.hit){
				sunny.sad();
				sunny.hit = false;
			}
			if(city.hit){
				city.hit = false;
				gameState = building_Hit;
			}
			if(gorilla1.hit){
				gameSettings.player2Score++;
				gorilla1.hit = false;
				VictoryInterval = setInterval(gorillaDance, 500);
				gameState = gorilla1_Hit;
			}
			if(gorilla2.hit){
				gameSettings.player1Score++;
				gorilla2.hit = false;
				VictoryInterval = setInterval(gorillaDance, 500);
				gameState = gorilla2_Hit;
			}
			if(banana.dstX > gameWidth || banana.dstX < 0 || banana.dstY > gameHeight + 200){
				gameState = building_Hit;
			}
			break;

		case building_Hit:
			if(banana.dstX > gameWidth || banana.dstX < 0 || banana.dstY > gameHeight + 200){
				nextStep();
			}else{
				city.explosion(banana.dstX, banana.dstY);
				nextStep();
			}
			break;

		case gorilla1_Hit:
			if(gorilla2.done){
				gorilla2.done = false;
				nextStep();
				clearInterval(VictoryInterval);
			}
			break;

		case gorilla2_Hit:
			if(gorilla1.done){
				gorilla1.done = false;
				nextStep();
				clearInterval(VictoryInterval);
			}
			break;
	}
}

function nextStep(){
	switch(gameState){
		case angle_Input:
			gameState = velocity_Input;
			break;

		case velocity_Input:
			var x, y;

			if(playerTurn == 1){
				x = gorilla1.dstX + gorilla1.dstWidth;
				y = gorilla1.dstY;
			}else{
				angle = 180 - angle;
				x = gorilla2.dstX;
				y = gorilla2.dstY;
			}
			
			banana.launch(angle, velocity, gameSettings.gravity, x, y);
			gameState = banana_Thrown;
			break;

		case gorilla1_Hit:
		case gorilla2_Hit:
			playerTurn = 3 - playerTurn;
			if(gameSettings.player1Score + gameSettings.player2Score >= gameSettings.maxPoint){
				AJAXsend('json.php?Klarat_Spelet=true')
				if(gameSettings.player1Score > gameSettings.player2Score){
					alert("Game over. Winner is: " + gameSettings.player1Name );
				}else{
					alert("Game over. Winner is: " + gameSettings.player2Name );
				}
				setTimeout(function(){window.location = "Gorillas.php";} , 1000);
			}else{
				newGame();
			}
			break;

		case building_Hit:
			if(gameSettings.numberOfPlayers == 1 && playerTurn == 2){
				/////AI
			}

			playerTurn = 3 - playerTurn;
			angle = "";
			velocity = "";
			gameState = angle_Input;

			if(gameSettings.numberOfPlayers == 1 && playerTurn == 2){
				//AI
			}
			break;
	}
}

function drawBg() { //Sätter bakgrund
	ctxBg.beginPath();
    ctxBg.rect(0, 0, gameWidth, gameHeight); // x, y, width, height
    ctxBg.fillStyle = 'blue';
    ctxBg.fill();
}

//Main end

//Clear functions Start

function clearCtxInput(){
	ctxInput.clearRect(0, 0, gameWidth, gameHeight);
}

function clearCtxGameSettings() {
	ctxGameSettings.clearRect(0, 0, gameWidth, gameHeight);
}

function clearCtxGorilla() {
	ctxGorilla.clearRect(0, 0, gameWidth, gameHeight);
}

function clearCtxBanana() {
	ctxBall.clearRect(0, 0, gameWidth, gameHeight);
}

function clearCtxCity() {
	ctxCity.clearRect(0, 0, gameWidth, gameHeight);
}

function clearCtxSun() {
	ctxSun.clearRect(0, 0, gameWidth, gameHeight);
}

//Clear functions End

//GameSetting Start

function gameSettings(){
	//Default
	this.default_numberOfPlayers = 1;
	this.default_player1Name = "Player1";
	this.default_player2Name = "Player2";
	this.default_maxPoint = 3;
	this.default_gravity = 9.8;
	//Initialize
	this.numberOfPlayers = "";
	this.player1Name = "";
	this.player2Name = "";
	this.maxPoint = "";
	this.gravity = "";
	this.player1Score;
	this.player2Score;
	
	this.state = 0;
	this.currentInput = "";
}

function drawGameSettings(){
	gameSettings.drawInput();
}

gameSettings.prototype.drawBg = function(){
	ctxGameSettings.beginPath();
    ctxGameSettings.rect(0, 0, gameWidth, gameHeight); // x, y, width, height
    ctxGameSettings.fillStyle = 'black';
    ctxGameSettings.fill();
}

gameSettings.prototype.drawInput = function(){
	clearCtxGameSettings();
	gameSettings.drawBg();
	ctxGameSettings.font = '12pt Calibri';
	ctxGameSettings.textAlign = 'left';
    ctxGameSettings.fillStyle = 'white';
	if(!User == "" && this.state == 1){
		this.player1Name = User;
		this.state++;
	}

    if(this.state >= 0){ //NumberOfPlayers
    	ctxGameSettings.fillText('1 or 2 Players (Default = 1 ):', 350, 100);
    	ctxGameSettings.fillText(this.numberOfPlayers, 350 + 200, 100);
    }
    if(this.state >= 1){ //Player1Name
    	ctxGameSettings.fillText('Player1 Name ( Default = Player1 ): ', 350, 125);
    	ctxGameSettings.fillText(this.player1Name, 350 + 250, 125);
    }
    if(this.state >= 2){ //Player2Name
    	ctxGameSettings.fillText('Player2 Name ( Default = Player2 ): ', 350, 150);
    	ctxGameSettings.fillText(this.player2Name, 350 + 250, 150);
    }
    if(this.state >= 3){ //MaxPoint
    	ctxGameSettings.fillText('How many total points ( Default = 3 )? ', 350, 175);
    	ctxGameSettings.fillText(this.maxPoint, 350 + 250, 175);
    }
    if(this.state >= 4){ //Gravity
    	ctxGameSettings.fillText('Gravity in Meters/Sec ( Earth = 9.8 )? ', 350, 200);
    	ctxGameSettings.fillText(this.gravity, 350 + 250, 200);
    }
}

// GameSetting Ends

//Gorilla start

function gorilla() { //Sätter ut 2st gorillor
	this.srcX = 0;
	this.srcY = 0;
	this.srcWidth = 50;
	this.srcHeight = 50;
	this.dstX = 0;
	this.dstY = 0;
	this.dstWidth = 50;
	this.dstHeight = 50;
	this.hit = false;
	this.m = 0;
	this.done;
	this.counter = 0;

}

function gorillaDance(){ 
	if(playerTurn == 1){
		gorilla1.dance();
	}else{
		gorilla2.dance();
	}
}

gorilla.prototype.dance = function(){
	switch(this.m){
  		case 0:
   			if(playerTurn == 1){
   				gorilla1.srcY += 50;
   			}else{
   				gorilla2.srcY += 50;
   			}
   			clearCtxGorilla();
   			gorilla1.draw();
   			gorilla2.draw();
   			this.m++;
   			break;
  		
  		case 1:
   			if(playerTurn == 1){
    			gorilla1.srcY += 50;
   			}else{
    			gorilla2.srcY += 50;
    		}
    		clearCtxGorilla();
   			gorilla1.draw();
   			gorilla2.draw();
   			if(playerTurn == 1){
    			gorilla1.srcY -= 100;
   			}else{
    			gorilla2.srcY -= 100;
    		}
			this.counter += 2;
   			this.m=0;
   			if(this.counter >= 10){
    			clearCtxGorilla();
    			gorilla1.draw();
    			gorilla2.draw();
    			this.counter = 0;
    			this.done = true;
    			clearInterval(VictoryInterval);
   			}
   			break;
 	}
};

gorilla.prototype.draw = function() {
	ctxGorilla.drawImage(imageObj, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.dstX, this.dstY, this.dstWidth, this.dstHeight);
};

function castAway(upDown){
	if(upDown == 0){ //Arm up
    	if(playerTurn==1){
     		gorilla1.srcY += 100;
     		clearCtxGorilla();
     		gorilla1.draw();
     		gorilla2.draw();
    	}else{
     		gorilla2.srcY += 50;
     		clearCtxGorilla();
     		gorilla1.draw();
     		gorilla2.draw();
   		}
   	}

   	if(upDown == 1){ //Arm down
  		if(playerTurn==1){
   			gorilla1.srcY -= 100;
   			clearCtxGorilla();
   			gorilla1.draw();
   			gorilla2.draw();
  		}else{
   			gorilla2.srcY -= 50;
   			clearCtxGorilla();
   			gorilla1.draw();
   			gorilla2.draw();
  		}
 	}
}

//Gorilla end

// Banana Start 

function banana() {
	this.srcX = 50;
	this.srcY = 0;
	this.srcWidth = 5;
	this.srcHeight = 10;
	this.dstX = 0;
	this.dstY = 0;
	this.dstWidth = 5;
	this.dstHeight = 10;
	this.angle = 0;
	this.pow = 0;
	
	this.gravity;
	this.velocityX;
	this.velocityY;
	this.startX;
	this.startY;
	this.timeT = 0;
	this.n = 0;
	this.count;
	this.windSpeed = -3;
 
}

banana.prototype.draw = function() {
	clearCtxBanana();
	//elapsed = time - previous; //Temporärt och skulle kunna lägga in power här eller någon annanstans beroende om den ska gå snabbara eller inte
	ctxBall.drawImage(imageObj, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.dstX, this.dstY, this.dstWidth, this.dstHeight);
	this.rotate();
	update();
	previous = time;

};

banana.prototype.update = function() {
    this.count++;
    this.timeT += elapsed/100;
    this.dstX = (this.startX + (this.velocityX * this.timeT) + (0.5 * (this.windSpeed / 5)) * (Math.pow(this.timeT,2)));
    this.dstY = (this.startY + (-1 * (this.velocityY * this.timeT) + (0.5 * this.gravity * (Math.pow(this.timeT,2)))) * (gameHeight / 350));

    if(this.count == 10){
    	castAway(1);
    }
    //distance = velocity * time + 1/2 * acceleration * time ^2
};

banana.prototype.launch = function(angle, velocity, gravity ,x , y) {
	this.gravity = gravity;
	angle = angle / 180 * Math.PI;
	this.velocityX = Math.cos(angle) * velocity;
	this.velocityY = Math.sin(angle) * velocity;
	this.startX = x;
	this.startY = y;
	this.timeT = 0;
	this.count = 0;

	castAway(0);

};

banana.prototype.rotate = function(){
	switch(this.n){
  		case 0:
   			this.srcY += 10;
   			this.srcWidth = 10;
   			this.srcHeight = 5;
   			this.dstWidth = this.srcWidth;
   			this.dstHeight = this.srcHeight;
   			this.n++;
   			break;
		
		case 1:
		   	this.srcY -= 10;
		   	this.srcX += 5;
		   	this.srcWidth = 5;
		   	this.srcHeight = 10;
		   	this.dstWidth = this.srcWidth;
		   	this.dstHeight = this.srcHeight;
   			this.n++;
   			break;
  
		case 2:
		   	this.srcY += 15;
		   	this.srcX -= 5;
		   	this.srcWidth = 10;
		   	this.srcHeight = 5;
		   	this.dstWidth = this.srcWidth;
		   	this.dstHeight = this.srcHeight;
		   	this.n++;
		   	break;
  		
  		case 3:
			this.srcY -= 15;
			this.srcWidth = 5;
			this.srcHeight = 10;
			this.dstWidth = this.srcWidth;
			this.dstHeight = this.srcHeight;
   			this.n=0;
   			break;
 	}
}

banana.prototype.hit = function(){
	if(this.dstX < gameWidth || this.dstX > 0 || this.dstY < gameHeight + 200 || this.dstY > 0){
		for(var i = 0; i < city.buildingInfo.length/5; i++){ //Building hit
			var position = city.buildingInfo.indexOf(i);
			var x = city.buildingInfo[position + 1];
			var y = city.buildingInfo[position + 2];
			var width = city.buildingInfo[position + 3];
			var height = city.buildingInfo[position + 4];

			if(this.dstX >= x && this.dstX <= x + width && this.dstY >= y && this.dstY <= y + height){ //Building hit
				city.hit = true;
			}
		}

		if(playerTurn == 1) { //Gorilla2 hit
			if(this.dstX >= gorilla2.dstX && this.dstX <= gorilla2.dstX + gorilla2.dstWidth) {
				if(this.dstY >= gorilla2.dstY && this.dstY <= gorilla2.dstY + gorilla2.dstHeight) {
					gorilla2.hit = true;
				}
			}
		}
		else if(this.dstX >= sunny.dstX && this.dstX <= sunny.dstX + sunny.dstWidth){ //Sun hit
			if(this.dstY >= sunny.dstY && this.dstY <= sunny.dstY + sunny.dstHeight){
				sunny.hit = true;
			}
		}
		else{ //Gorilla1 hit
			if(this.dstX >= gorilla1.dstX && this.dstX <= gorilla1.dstX + gorilla1.dstWidth) {
				if(this.dstY >= gorilla1.dstY && this.dstY <= gorilla1.dstY + gorilla1.dstHeight) {
					gorilla1.hit = true;
					//return gorilla1.hit;
				}
			}
		}
	}
}

//Banana End

//City Start

function city() {
	this.buildingInfo; //Består av: index, x, y, width, height.
	this.hit = false;
	//Colors
	this.colorInfo = ["red","gray","green"];
	this.colorWindow = ["yellow", "black"];

	//Measurs
	this.widthWindow = 5;
	this.heightWindow = 8;
	this.betweenWindow = 10;
	this.widthMinBuilding = 70;
	this.widthMaxBuilding = 120;
	this.heightMinBuilding = 50;
	this.heightMaxBuilding = 200;
	
	//Start point	
	this.dstX = 0;
	this.dstY = 0;

}

city.prototype.placeBuildings = function() {	
	//Make
	var count = 0,i = 0, positionX = 0, randomWidth = 0, positionY = 0;

	this.buildingInfo = new Array();

	this.buildingInfo.length = 0;

	do{
		positionX += randomWidth;
		var randomHeight = Math.floor((Math.random() * (this.heightMaxBuilding - this.heightMinBuilding)) + this.heightMinBuilding);
		var randomWidth = Math.floor((Math.random() * (this.widthMaxBuilding - this.widthMinBuilding)) + this.widthMinBuilding);
		
		count += randomWidth;

		if(count > gameWidth){
			randomWidth = gameWidth - (count - randomWidth);
		}

		positionY = gameHeight - randomHeight;

		this.buildingInfo.push(i);
		this.buildingInfo.push(positionX);
		this.buildingInfo.push(positionY);
		this.buildingInfo.push(randomWidth);
		this.buildingInfo.push(randomHeight);
		i++;
	}while(count < gameWidth);

	//Draw building
	for(var i = 0; i < this.buildingInfo.length/5; i++){
		var position = this.buildingInfo.indexOf(i);
		var x = this.buildingInfo[position + 1];
		var y = this.buildingInfo[position + 2];
		var width = this.buildingInfo[position + 3];
		var height = this.buildingInfo[position + 4];
		var colorBuilding = this.colorInfo[Math.floor((Math.random() * 3))];
		this.dstY = gameHeight - height;


		//Draw building
		ctxCity.beginPath();
		ctxCity.rect(x, y, width, height); //x , y , width , height
		ctxCity.fillStyle = colorBuilding;
		ctxCity.fill();
		ctxCity.lineWidth = 2;
		ctxCity.strokeStyle = 'black';
		ctxCity.stroke();

		//Draw windows
		var row = Math.floor(height/(this.heightWindow * 2));
		var column = Math.floor(width/(this.widthWindow * 2));
		var tempX = x;
		x += 4; y += 4;

		for(var j = 0; j < row; j++){
			for(var k = 0; k < column ; k++){
				ctxCity.beginPath();
				ctxCity.rect( x, y, this.widthWindow, this.heightWindow);
				ctxCity.fillStyle = this.colorWindow[Math.floor((Math.random() * 2))];
				ctxCity.fill();

				x += this.widthWindow * 2;
			}
			x = tempX + 4;
			y += this.heightWindow * 2;
		}
	}

};

city.prototype.placeGorillas = function() {
	var pos1 = this.buildingInfo.indexOf(Math.floor((Math.random() * 2) + 1));
	var pos2 = this.buildingInfo.indexOf(this.buildingInfo.length/5 - Math.floor((Math.random() * 1) + 2));

	gorilla1.dstX = this.buildingInfo[pos1 + 1];
	gorilla1.dstY = this.buildingInfo[pos1 + 2] - gorilla1.dstHeight - ctxCity.lineWidth;

	gorilla2.dstX = this.buildingInfo[pos2 + 1] + this.buildingInfo[pos2 + 3] - gorilla2.dstWidth;
 	gorilla2.dstY = this.buildingInfo[pos2 + 2] - gorilla2.dstHeight - ctxCity.lineWidth;
};

city.prototype.explosion = function(x, y){
	var centerX = x;
    var centerY = y;
    var radius = 10;

    ctxCity.beginPath();
    ctxCity.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctxCity.fillStyle = 'blue';
    ctxCity.fill();
};

//City End

//Sun Start

function sunny() { //Sun
	this.srcX = 60;
	this.srcY = 0;
	this.srcWidth = 50;
	this.srcHeight = 50;
	this.dstX = 375;
	this.dstY = 20;
	this.dstWidth = 50;
	this.dstHeight = 50;
	this.hit = false;
}

sunny.prototype.draw = function() {
	ctxSun.drawImage(imageObj, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.dstX, this.dstY, this.dstWidth, this.dstHeight);
};

sunny.prototype.reset = function(){
	clearCtxSun();
	this.srcX = 60;
	this.srcY = 0;
	this.draw();
};

sunny.prototype.sad = function(){
	clearCtxSun();
	this.srcX = 60;
	this.srcY = 50;
	this.draw();
};

//Sun Ens

// Event Start


function playerInput(e){
	var keyId = e.keyCode || e.which; //Beroende på webbläsare
	/*if(gameState == banana_Thrown || gameSettings.numberOfPlayers == 1 && playerTurn == 2){
		return;
	}*/

	if(keyId == 13){ //Enter
		switch(gameState){
			case angle_Input: //Angle
				if(angle != ""){
					nextStep();
				}
				break;

			case velocity_Input: //Velocity	
				if(velocity != ""){
					previous = time;
					nextStep();
				}
				break;
		}
	}
	else if(keyId == 8){//Backspace
		e.preventDefault();
		switch(gameState){
			case angle_Input: //Angle
				angle = angle.slice(0,-1);
				break;
			case velocity_Input: //Velocity
				velocity = velocity.slice(0,-1);
				break;
		}
	}else{ //Input Key
		switch(gameState){
			case angle_Input: //Angle
				if( keyId >= 48 && keyId <= 57 ){
					angle += String.fromCharCode(keyId);
				}
				break;
			case velocity_Input: //Velocity
				if( keyId >= 48 && keyId <= 57 ){
					velocity += String.fromCharCode(keyId);
				}
				break;
		}
	}
}

function checkInput(e){
	var keyId = e.keyCode || e.which; //Beroende på webbläsare
	
	if(gameSettings.state == 5){
		init();
	}

	else if(keyId == 13){ //Enter
		switch(gameSettings.state){
			case 0: //NumberOfPlayers
				if( parseInt(gameSettings.numberOfPlayers) == 1 || parseInt(gameSettings.numberOfPlayers) == 2){
					gameSettings.state++;
				}else{
					gameSettings.numberOfPlayers = gameSettings.default_numberOfPlayers;
					gameSettings.state++;
				}
				break;

			case 1: //Player1Name	
				if( gameSettings.player1Name != "" ){
					gameSettings.state++;
				}else{
					gameSettings.player1Name = gameSettings.default_player1Name;
					gameSettings.state++;
				}
				break;

			case 2: //Player2Name	
				if( gameSettings.player2Name != "" ){
					gameSettings.state++;
				}else{
					gameSettings.player2Name = gameSettings.default_player2Name
					gameSettings.state++;
				}
				break;

			case 3: //MaxPoints
				if( parseInt(gameSettings.maxPoint) == 1 || parseInt(gameSettings.maxPoint) == 2){
					gameSettings.state++;
				}else{
					gameSettings.maxPoint = gameSettings.default_maxPoint;
					gameSettings.state++;
				}
				break;

			case 4: //Gravity
				if(parseInt(gameSettings.gravity) >= 0 ){
					gameSettings.state++;
				}else{
					gameSettings.gravity = gameSettings.default_gravity;
					gameSettings.state++;
				}
				break;
		}
	}
	else if(keyId == 8){//Backspace
		e.preventDefault();
		switch(gameSettings.state){
			case 0: //NumberOfPlayers
				gameSettings.numberOfPlayers = gameSettings.numberOfPlayers.slice(0,-1);
				break;
			case 1: //Player1 Name
				gameSettings.player1Name = gameSettings.player1Name.slice(0,-1);
				break;

			case 2: //Player2 Name
				gameSettings.player2Name = gameSettings.player2Name.slice(0,-1);
				break;

			case 3: //MaxPoints
				gameSettings.maxPoint = gameSettings.maxPoint.slice(0,-1);
				break;

			case 4: //Gravity
				gameSettings.gravity = gameSettings.gravity.slice(0,-1);
				break;
		}
	
	}else{ //Input Key
		switch(gameSettings.state){
			case 0: //NumberOfPlayers
				if( keyId >= 48 && keyId <= 57 ){
					gameSettings.numberOfPlayers += String.fromCharCode(keyId);
				}
				break;
			case 1: //Player1 Name
				gameSettings.player1Name += String.fromCharCode(keyId);
				break;

			case 2: //Player2 Name
				gameSettings.player2Name += String.fromCharCode(keyId);
				break;

			case 3: //MaxPoints
				if( keyId >= 48 && keyId <= 57 ){
					gameSettings.maxPoint += String.fromCharCode(keyId);
				}
				break;

			case 4: //Gravity
				if( keyId >= 48 && keyId <= 57 || keyId == 190 ){
					if(keyId == 190){
						gameSettings.gravity += "."
					}else{
						gameSettings.gravity += String.fromCharCode(keyId);
					}
				}
				break;
		}
	}
}

// Event End




///Kanske tas bort
function stopDrawa() {
	clearInterval(drawInterval1);
}

function stopDrawan() {
	clearInterval(gameInterval);
}


function stopDraw() {
	clearInterval(drawInterval);
}





//exempel på ajax som hämtar data i form av ett json objekt
var previ=-1;
function AJAXload(url, divOutput)
{
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  //en lyssnare, funktionen körs varige gång readystate ändras
xmlhttp.onreadystatechange=function()
	{
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
		//json parse är en html5 grej (kolla eval om bättre bakåt kompabilitet önskas)
		var jsondata=JSON.parse(xmlhttp.responseText);
		
		//nu vet vi att vi får tillbaka en lista(array) med namn så vi loopar igenom dem, Skapar divtaggar för var och en av dem och lägger till dem i vårat element
		for(i=0;i<jsondata.length;i++ )
			{
				if(i>previ)
				{
					var newDiv1 = document.createElement('div');
					newDiv1.innerHTML = "#"+jsondata[i].Id;
					newDiv1.id="div"+i;
					newDiv1.className="hsdiv";
					var newDiv2 = document.createElement('div');
					newDiv2.innerHTML = jsondata[i].Username;
					newDiv2.id="div"+i;
					newDiv2.className="hsdiv";
					var newDiv3 = document.createElement('div');
					newDiv3.id="div"+i;
					newDiv3.className="hsdiv";
					newDiv3.innerHTML = "Wins:"+jsondata[i].Vinster;
					var br = document.createElement('br');
					
					divOutput.appendChild(newDiv1);
					divOutput.appendChild(newDiv2);
					divOutput.appendChild(newDiv3);
					divOutput.appendChild(br);
					previ = i;
				}
			}
		}
	}

xmlhttp.open("GET",url,true);
xmlhttp.send();
}

function AJAXsend(url)
{
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  //en lyssnare, funktionen körs varige gång readystate ändras

xmlhttp.open("GET",url,true);
xmlhttp.send();
}

function getdata()
{
var myDiv = document.getElementById("mydiv");

/*while(myDiv.firstElementChild) 
{
	myDiv.removeChild(myDiv.firstElementChild);
}*/
AJAXload("json.php", myDiv);

}
function Loopdidoop()
{
	setInterval(getdata,2000);
}






