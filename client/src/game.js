		var essaysToMark = 30;
		// How many profs have passed without dying
		var profsPassed = 0;
		// The current wave value
		var waveNumber = 1;
		
		// How many zombies killed in total during the game
		var totalKills = 0;

		// How many total zombies to kill in a wave
		var waveZombies = 0;
		// Did the game end
		var gameEnd = false;
		
		//student type ; initially 0
		var studentType = 0;
		
		// Is it a new wave
		var newWave = false;

	//	var lastShotTime = Date.now();

		var intervalGo = true;
		var socket;
		
		var emitGameOver = 0;
	
		numPositionx = ["175", "355", "535", "715"];
		numPositiony = ["32", "64", "32", "64"];
	
		/**
		Constructor for Student Object, takes in an initial x and y parameter
		**/
		Student = function(x,y, studType, id, alive, playerNum){
			var self = {
			x:x,
			y:y,
			profsShot:0,
			studType:studType,
			id:id,
			bulletCount: 150,
			fireRate: 500,
			speedShots: 0,
			eraserBullets:0,
			extensionBullets:0,
			alive:alive,
			lastShotTime:Date.now(),
			walkCount:0,
			playerNum: playerNum,
			};
			
			self.mvDownButton = false;
			self.mvUpButton = false;
			self.walkCount = 0;
			
			//Update function which will redraw
			//the object(after possible position update)per time it is called.
			self.redraw = function(){
				//self.updatePos();
				self.draw();
			}
			
			//Method to update position, based on keyboard at the moment
			self.updatePos = function(){
				if(self.mvUpButton){
					if(self.y > 250){
						self.y -= 10;
						self.walkCount = (self.walkCount + 1) % 3;
				}}
				else if(self.mvDownButton){
					if(self.y < 600){
						self.y += 10;
						self.walkCount = (self.walkCount + 1) % 3;
					}
				}
				else if(!self.mvDownButton && !self.mvDownButton){
						self.walkCount = 0;
				}		
		
			}
			var charWidth;
			var charHeight;
		
			if(studType == 2){
				charWidth = 100;
				charHeight = 200;
			}
			else{
				charWidth = 80;
				charHeight = 100;
			}
			
		
			//Method to draw the character
			self.draw = function(){
				var studentImg = new Image();
				//console.log("walk count is ", self.walkCount);
				if (self.walkCount == 0){
				studentImg.src = 'img/student'+studType+'/static.png';
				}
				else if (self.walkCount == 1){
				studentImg.src = 'img/student'+studType+'/walk1.png';
				}
				else if (self.walkCount == 2){
				studentImg.src = 'img/student'+studType+'/walk2.png';
				}
				
				
				studentImg.onload = function(){
					ctx.font="30px Arial";
					ctx.fillText("Bullets left P" + self.playerNum + ":  " + self.bulletCount, numPositionx[self.playerNum - 1], numPositiony[self.playerNum - 1]);
					ctx.fillText("Wave: " + waveNumber, 32, 32);
					ctx.drawImage(studentImg, self.x,self.y, charWidth, charHeight);
				}
			}
		
		//Returns a student object
		return self;
		
		}
		
		
		/**
		Constructor for Professor Object, takes in an initial x and y parameter
		**/
		Prof = function(x,y, profWidth, profHeight, profHp, profSpeed, type){
			var self = {
			x:x,
			y:y,
			width:profWidth,
			height:profHeight,
			hp:profHp,
			speed: profSpeed,
			type:type,
			sub:1,
			};
			
			self.isDead = 0; //set to 1 when prof is dead 
			
			self.readyToRemove = 0;
			self.animationTimer = 0;  // this timer will be used to display dying and dead states over multipe frames
			
			
			if(type == 0){
			self.imgsrc = "img/prof1.png"; //Type 1 prof
			}
			else if(type == 1){
			self.imgsrc= "img/prof2.png"; // Type 2 prof
			}
			else if(type == 2){
			self.imgsrc= "img/prof_Dan.png"; // Type 2 prof
			}
			
		
				
			self.CropSprite_X = 7;   //initial crop_x = 7 aka rightmost picture top row
			self.CropSprite_Y = 0;
					
					
			
					
			//Update function which will redraw
			//the object per time it is called, via set Interval.
			self.redraw = function(){
				self.updatePos();
				self.draw();
			}
			
			//Method to update position, based on keyboard at the moment
			//frameNum used to animate walk
			self.updatePos = function(){

				if(self.isDead == 0){// only update postion of prof is he's not dead i.e. isDead = 0
					this.x -= this.speed;
				}
			}
			 
		
			//Method to draw the character
			self.draw = function(){
				var profImg = new Image();
				profImg.src = self.imgsrc;
				
				//Variables below are used to animate the sprite
				//imgWidth and height get the dimensions of each frameElement
				//frameNum cycles through them
				imgWidth = profImg.width/8;
				imgHeight = profImg.height/2;
				
				
				
					profImg.onload = function(){

					if(self.isDead == 0 && self.CropSprite_Y  == 0){ //not dying or dead
						
						if ( self.CropSprite_X <= 1){
							self.sub = 0; // Add frames
						}
						else if ( self.CropSprite_X == 7){
							self.sub = 1; // Subtract frames
						}
						
						
						//draw
						ctx.drawImage(profImg, self.CropSprite_X * imgWidth, self.CropSprite_Y * imgHeight, imgWidth, 
						imgHeight, self.x,self.y, self.width, self.height);
						//update coordinates
						//self.CropSprite_X -=1
					//	if(self.CropSprite_X < 1){
					//		self.CropSprite_X =7;
					//	}
						if(self.sub == 1){
							self.CropSprite_X -= 1;
						}
						else{
						 self.CropSprite_X += 1;							
						}
						
					}
					
					else if(self.isDead == 1 && self.readyToRemove == 0){// just died
						
						self.animationTimer += 1;
						//update crop coordiantes to  draw solid skeleton 
						self.CropSprite_X = 4;
						self.CropSprite_Y = 1;
						//
						//console.log("just died - coordinates: "+self.CropSprite_X+" ,"+self.CropSprite_Y);
						//draw solid skeleton over 5 frames
						ctx.drawImage(profImg, self.CropSprite_X * imgWidth, self.CropSprite_Y * imgHeight, imgWidth, 
						imgHeight, self.x,self.y, self.width, self.height);
						
						if(self.animationTimer == 5){
							self.CropSprite_X = 2; // update crop x coordinate after drawing to 2 = shattering skeleton x coordinate 
							self.readyToRemove = 1;

						}
						
					}
					else if ( self.isDead == 1 && self.readyToRemove == 1)   { // dead state - draw shattering skeleton
						self.animationTimer -=1;
						
						
						//draw shattering  skeleton 5 over 5 frames
						ctx.drawImage(profImg, self.CropSprite_X * imgWidth, self.CropSprite_Y * imgHeight, imgWidth, 
						imgHeight, self.x,self.y, self.width, self.height);
						
						
						if(self.animationTimer == 0){ //now this prof can be removed  - after 5 drawging of shattering skeleton
								self.readyToRemove = 2;
						}
						
					}
					
					
					ctx.font="30px Arial";
					ctx.fillText("Essays left to mark: " + essaysToMark, 32, 64);

				}
			}
		
		//Returns a student object
		return self;
		
			
		}
		
		

		
		
		/**
		Constructor for Projectile Object, takes in an initial x and y parameter
		**/
		Projectile = function(x,y, shooter, bulletType, angle, damage){
			var self = {
			x:x,
			y:y,
			width:20,
			height:20,
			damage:damage,
			shotBy:shooter,
			type:bulletType,
			angle:angle,
			};
					
			//Update function which will redraw
			//the object per time it is called, via set Interval.
			self.redraw = function(){
				self.updatePos();
				self.draw();
			}
			
			//Method to update position, based on keyboard at the moment
			self.updatePos = function(){
				self.x += 20;
				self.y += (self.angle*-1);
			}
			//Random colour between 1 and 27. There are 27 pencil colours.
			colour_rand = Math.floor((Math.random() * 27) + 1);
			//Method to draw the object
			self.draw = function(){
				var pencilImg = new Image();
				
				if (self.type == "basic"){
					pencilImg.src = 'img/pencils/pencil ('+colour_rand+').png';

				}
				else if (self.type == "eraser"){
					pencilImg.src = 'img/pencils/eraser.png';
				}
				else if (self.type == "extension"){
					pencilImg.src = 'img/pencils/extension.png';
				}
				pencilImg.onload = function(){
					ctx.drawImage(pencilImg, self.x,self.y, self.width, self.height);
				}
			}
		
		//Returns a student object
		return self;
		
		}
		
		
		/**
		Function to Load background Image	
		**/		
		function drawBackground(level){
			if(level < 10){
				levelSrc = 'img/hallway_1.jpg';
			}
			else{
				levelSrc = 'img/hallway_2.jpg';
			}
			
			var bgImg = new Image();
			bgImg.src = levelSrc;
			
			bgImg.onload = function(){
				ctx.drawImage(bgImg,0,0, width, height);
			}
		}
		
		
		
	
		
		
		/**
		Handlers for a keyboard key is pressed
		**/
		document.onkeydown = function(keypress){
			for(i = 0; i < Students.length; i++){
			if(keypress.keyCode === 38){
				Students[i].mvUpButton = true;
			}
			if(keypress.keyCode === 40){
				Students[i].mvDownButton = true;
			}
			//Space bar to fire
			if(keypress.keyCode === 32){
				//Create new projectile, from the students position
				var timeStamp = Date.now();
				var sinceLastShot = timeStamp - lastShotTime;
				for(i = 0; i < Students.length; i++){

					// So I check if its an upgraded shots or not
					if (Students[i].eraserBullets > 0){
						if( sinceLastShot > Students[i].fireRate){
								lastShotTime = timeStamp;
								proj1 = Projectile(Students[i].x+50,Students[i].y+50, Students[i], "eraser", 0, 90);
								proj1.draw();
								projectiles.push(proj1);
								proj1.shotBy.eraserBullets --;
								proj1.shotBy.speedShots --;
								
							}
							

					}
					else if (Students[i].extensionBullets > 0){
						if( sinceLastShot > Students[i].fireRate){
								lastShotTime = timeStamp;
								proj1 = Projectile(Students[i].x+50,Students[i].y+50, Students[i], "extension", 0, 70);
								proj1.draw();
								projectiles.push(proj1);
								proj1.shotBy.extensionBullets --;
								proj1.shotBy.speedShots --;
								
							}
							

					}
					else if(Students[i].bulletCount > 0){
							if( sinceLastShot > Students[i].fireRate){
								lastShotTime = timeStamp;
								proj1 = Projectile(Students[i].x+50,Students[i].y+50, Students[i], "basic",0, 50);
								proj1.draw();
								projectiles.push(proj1);
								proj1.shotBy.bulletCount --;
								proj1.shotBy.speedShots --;
								
						
							}
					}
				}

				
				}
			}
		}
		/**
		Handlers for a keyboard key is released
		**/
		
		document.onkeyup = function(keyrelease){
			for(i = 0; i < Students.length; i++){
			if(keyrelease.keyCode === 38){
				Students[i].mvUpButton = false;
			}
			if(keyrelease.keyCode === 40){
				Students[i].mvDownButton = false;
			}
			}
		}
		
		
			/**
		Generate professor Function, creates a list of professor objects
		**/
		generateProf = function(){
			var i;

			var genNumber = waveNumber * 1;
			waveZombies = genNumber;

			var health = 0;
			

			
				if((genNumber +1)% 10 == 0){
					
					profs.push(Prof(x_pos,y_pos, 200, 200, 750, 20, 2));
					waveZombies =1;
				}
				else{
					for(i = 0; i < genNumber; i++){
						
						//y position between 200 and 500. The area allowed to be walked on
						//x position starts at 1500 and increases as more professors are added
						x_pos = 1500+(i*100);
						y_pos = Math.floor((Math.random() * 300)+200);
						type = i % 2;
						//Set speeds for prof types
						if(type == 0){
							health = 100;
							speed = 15;
						}
						else if(type == 1){
							health = 150;
							speed = 20;
						}
						else if(type == 2){
							health = 750;
							speed = 30;
						}
						profs.push(Prof(x_pos,y_pos, 200, 200, health, speed, type));
					}		
				}

				if ((waveNumber%5) == 0){
					waveZombies ++;
					profs.push(Prof(x_pos,y_pos, 200, 200, health, speed, type));
					for(i = 0; i < Students.length; i++){
						Students[i].bulletCount += 150;
					}

			}


		}
		
		

		/*
		I check if a prof has been hit by a projectile
		*/
		checkCollision = function (){
			
			for(var j = 0; j < projectiles.length; j++){
				for(var k = 0; k < profs.length; k++){
					
					//if projectiles[j]  and profs[k] collide
					if ((projectiles[j].x <= (profs[k].x + profs[k].width)) 
						&&
						((projectiles[j].x + projectiles[j].width)  >= profs[k].x) 
						&&
						(projectiles[j].y <= (profs[k].y + profs[k].height))
						&& 
						((projectiles[j].y + projectiles[j].height) >= profs[k].y)) {
						
						
						
						if (profs[k].isDead == 0){   //only if the shot professor is not DEAD
						
						profs[k].hp = profs[k].hp - projectiles[j].damage; //compute profs hp after being shot
						//console.log(profs[k].hp);
								if(profs[k].hp <= 0 ){ // if the shot killed the prof
									profs[k].isDead = 1;
									projectiles[j].shotBy.profsShot ++;
									
									totalKills++;
									profsPassed ++;
								
									
								} 
							
								
								//remove projectile that hit the prof
								projectiles.splice(j, 1);
								
								// if the number of kills in the wave equals the total amount of zombies in that wave
								if(profsPassed == waveZombies){
									// We set everything to 0 since its a new wave
									waveZombies = 0;
									profsPassed = 0;
									newWave = true;
								}
							
								break;
							
						}

						
					}
				}
			}
		}



		
		/**
		Update function, which redraws object position		
		**/
		
		update = function(){
					
			drawBackground(waveNumber);	

			
			//Redraw Students
			for(i = 0; i < Students.length; i++){
				if ((Students[i].profsShot % 20)== 0){
					Students[i].fireRate = 250;
					Students[i].speedShots = 250;
					//console.log("speedShots");
				}
				else if ((Students[i].profsShot % 45) == 0){
					Students[i].eraserBullets = 50;
				}
				else if ((Students[i].profsShot % 15) == 0){
					console.log("the extension bullets" + Students[i].extensionBullets);
					Students[i].extensionBullets = 2;
				}
				else if (Students[i].speedShots == 0){
					Students[i].fireRate = 500;
				}

				if (Students[i].alive){
					Students[i].redraw();
				}
			}
				
			//Redraw Profs
			for(i = 0; i < profs.length; i++){
				
				//remove prof is redyToRemove flag of pro is set to 2
				if(profs[i].readyToRemove == 2){
					profs.splice(i, 1);
				}

				// If the prof passes by the student, and is not dead
				if(profs[i].x < 1){
					profsPassed ++;
					essaysToMark = essaysToMark - 1;
					
					// If all the current profs passed by the  student, it will be a new wave
					if (profsPassed == waveZombies){
						//console.log("bottom" + profsPassed);
						waveZombies = 0;
						profsPassed = 0;
						newWave = true;
					}

					
					profs[i].gone = 1;
					profs.splice(i, 1);
					if (essaysToMark == 0){
						gameEnd = true;
						emitGameOver = 1;
					}
				}
				
				// So the prof has not passed the student yet, and is not dead
				else if (profs[i].x >=1){ //} && profs[i].hp != 0){ // We don't really need to check the hp here I think
					profs[i].redraw();
				}
			}
			
			//Redraw Projectiles
			for(i = 0; i < projectiles.length ; i++){
					if (projectiles[i].x > 1299){
						projectiles.splice(i, 1);
					}
					else{
						projectiles[i].redraw();
					}
				
			}

			checkCollision();

			// Runs if the game did not end, and it is a new wave
			if (!gameEnd && newWave){
				newWave = false;
				waveNumber++;
				
				generateProf();
			}

			else if (gameEnd){
				
				if(emitGameOver == 1){
					socket.emit('gameOver');
				}
				emitGameOver = 0;
				
				var bgImg = new Image();
				bgImg.src = 'img/endGame.jpg';
				bgImg.onload = function(){
					ctx.drawImage(bgImg,0,0, width, height);
					$("body").click(function(){
						window.location.reload();
					});
					
					
					/* setTimeout(
					  function() 
					  {
						location.reload();
					  }, 5000); */
					
				}
			}

			

		}
		
		/**
		Fire projectile callback function which is called below when the server
		sends a fire projectile event
		*/
		
		function fireprojectile(angle, id){
			//console.log("FP Called from" + id);
			var timeStamp = Date.now();
			//var sinceLastShot = timeStamp - lastShotTime;
			//console.log("Fire triggered");
			for(i = 0; i < Students.length; i++){
					
					//If the student Id is the one that issued the command
					if(Students[i].id == id){
					var sinceLastShot = timeStamp - Students[i].lastShotTime;
					// So I check if its an upgraded shots or not
					if (Students[i].eraserBullets > 0){
						if( sinceLastShot > Students[i].fireRate){
								Students[i].lastShotTime = timeStamp;
								proj1 = Projectile(Students[i].x+50,Students[i].y+50, Students[i], "eraser", angle, 90);
								proj1.draw();
								projectiles.push(proj1);
								proj1.shotBy.eraserBullets --;
								proj1.shotBy.speedShots --;
								console.log("FP upgraded Called from" + id);
								
							}
							

					}
					else if (Students[i].extensionBullets > 0){
						if( sinceLastShot > Students[i].fireRate){
								Students[i].lastShotTime = timeStamp;
								proj1 = Projectile(Students[i].x+50,Students[i].y+50, Students[i], "extension", angle, 70);
								proj1.draw();
								projectiles.push(proj1);
								proj1.shotBy.extensionBullets --;
								proj1.shotBy.speedShots --;
								console.log("extension Bullets" + proj1.shotBy.extensionBullets);
								
							}
							

					}
					else if(Students[i].bulletCount > 0){
							if( sinceLastShot > Students[i].fireRate){
								console.log("FP Called from" + id);
								Students[i].lastShotTime = timeStamp;
								proj1 = Projectile(Students[i].x+50,Students[i].y+50, Students[i], "basic", angle, 50);
								proj1.draw();
								projectiles.push(proj1);
								proj1.shotBy.bulletCount --;
								proj1.shotBy.speedShots --;
								
						
							}
						}
					}
				}		
			}
			
		
		/**
		Handler for phone tilt
		*/
		function tilt(speed, id){
			//console.log("Getting tilt for" + id + " "+ speed);
			for(i = 0; i < Students.length; i++){
				//Only move the student with the given ID.
				if(Students[i].id == id){
					weightedSpeed = Math.abs(speed)/90;
					
					if(speed > 20 && Students[i].y > 250){
						Students[i].mvDownButton = true;	
						Students[i].mvUpButton = false;
						Students[i].y -= 10;
						Students[i].mvDownButton = false;	
						Students[i].mvUpButton = false;
						Students[i].walkCount = (Students[i].walkCount + 1) % 3;
					}
					else if(speed < -20 && Students[i].y < 600){
						Students[i].mvDownButton = false;	
						Students[i].mvUpButton = true;
						Students[i].y += 10;
						Students[i].mvDownButton = false;	
						Students[i].mvUpButton = false;
						Students[i].walkCount = (Students[i].walkCount + 1) % 3;
					}	
					else{
						Students[i].mvDownButton = false;	
						Students[i].mvUpButton = false;
						Students[i].y += 0;
						Students[i].walkCount = 0;
					}
			
				}
			}	
		}
		
		
		
		/**
		Main Page Load and Update	
		**/
		
		function load(){
			var Canvas=document.getElementById("Canvas");
			ctx=Canvas.getContext("2d");

			width=ctx.canvas.width;
			height=ctx.canvas.height;
			
			drawBackground(waveNumber);	
			
			//Arrays for game objects.
			
			Students = [];
			profs = [];
			projectiles = [];
				
			//Update interval
			
			setInterval(update,50);
			
			
			//Socket Variables and listeneres.
			socket = io();
			socket.on('newPlayer', function(data){
							
				newStudent = Student(0,350, data.type, data.id, data.alive, data.playerNum);
				studentType = (studentType)%4;
				newStudent.draw();
				Students.push(newStudent);
				//Start generating professors after atleast 2 Students present
				if(Students.length == 2){
					generateProf();
				}
			});

			socket.on('playerDisconnected', function(data){
				for(i = 0; i < Students.length; i++){
					if (Students[i].id == data.id){
						console.log("disconnected");
						Students[i].alive = data.alive;
						//delete students[i];
						Students.splice(i,1);
					}
				}

			});
		
			//socket.emit('firedesktop', { fire: 'data' });
			
			socket.on('fire', function(data){
			//console.log("getting fire from server, at angle" + data.angle + "player is" + data.id);
			fireprojectile(data.angle, data.id);		
			});
			
		
		//Gamma listener
		socket.on('phoneTilt', function(data){
			
			tilt(data.gamma, data.id);			
			});		
		
		
				
		}
		

		
	
		
			
	
		
		function startMenu(){
			alert();

			$( "body" ).keypress(function() {
  				console.log( "Handler for .keypress() called." );
  				load();
			});
		}
