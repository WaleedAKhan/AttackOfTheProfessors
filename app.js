
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req,res){
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/', express.static(__dirname + '/client'));



//an array of mobile connected socket id that we know of
var mobileConnectedSocketIDs = [];

var numMobiles = 0;
server.listen(10143);

id = 0;

var io = require('socket.io')(server,{});


function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] == obj) {
           return true;
       }
    }
    return false;
}

io.sockets.on('connection', function(socket){
	console.log('connection from ' + socket.id);	

	
	//A mobile player connects.
	socket.on('MobileConnected', function(data){
		
		
		// Runs if numMobiles is less than 4, i.e will allow upto 4 players to connect
		if (numMobiles < 4){
			
			//add the new Mobile socket id to our socketIDs list
			mobileConnectedSocketIDs.push(socket.id);
			
			console.log('Mobile connected ' + socket.id);
			
			id++;
			numMobiles++;
			console.log("numMobiles after a new connection: "+numMobiles);
			//Sending Player ID to mobile user
				//console.log('Mobile connected ' + id);
			socket.emit('setID', {id:socket.id});
			//Draw player in game
			socket.broadcast.emit('newPlayer', {id:socket.id, type:data.type, alive:true, playerNum:id});

		}
		
		else{
			//disconnect the socket
			socket.disconnect(true);	
		}
	});

	socket.on('disconnect',function(){
		
		socket.broadcast.emit('playerDisconnected', {id:socket.id, alive:false});
		console.log("deleting socket with id: "+socket.id);
	
		var index = -1;
		
		//Check the socketid is in the connected lists
		for(i = 0; i < mobileConnectedSocketIDs.length; i ++){
				if(mobileConnectedSocketIDs[i] == socket.id){
					index = socket.id;
				}
		}
		
		if(index != -1 ){
			//Only dealing with mobile Disconnects here
			var index = mobileConnectedSocketIDs.indexOf[socket.id];
			console.log(index);
			if(index != -1){
			//Send Data to Client Desktop
			socket.broadcast.emit('playerDisconnected', {id:socket.id, alive:false});
			console.log("deleting socket with id: "+socket.id);
			
			id--;
			numMobiles--;
			console.log("numMobiles after disconnect: "+numMobiles);
			
			delete mobileConnectedSocketIDs[index];
			
			}
		}
	});
	
	
	
	
	socket.on('fire', function(data){
			//Send device beta angle and player id that issued command
			socket.broadcast.emit('fire', {angle:data.beta, id:data.id});
			
		});
		
	
	//Listener for Mobile gestures
	socket.on('mobileMotion', function(data){
			//Moved Socket listener for fire is inside to get
			//Fire updates while movement is happening
				
			
			//Gamma used for movement
			gamma = data.g;
			
			//Beta used for aiming projectile
			//beta = data.b;		
			
			socket.broadcast.emit('phoneTilt', {gamma:gamma, id:data.id});
		
		});
	
	//On a gameover Disconnect all mobile clients.
	socket.on('gameOver', function(){
		//Send signal to mobile clients informing of the game being over.
		socket.broadcast.emit('gameOverMobile');	
		
	});
			
});

