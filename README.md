# AttackOfTheProfessors
Web game created for Web Development Course

Requires Node.js Server.

In order to run our game, the game server will first need to be started. This can be done by running the command 'node app.js', where app.js can be found in the root directory. 

The default setting inside app.js is set to have the server listen on port 10143. The desktop client can then be started by entering 'localhost:10143' into a browser, preferably chrome. The main page should then show up and the game can be started by hitting start game.

You will then need to connect atleast two mobile players for the game to begin. The site for the mobile client can be found by entering into a mobile browser 'ip-address:10143/src/mobile.html', or alternatively, on the same machine via 'localhost:10143/src/mobile.html'. Note however movement is done only through mobile gestures and so running the mobile site on a desktop machine will only allow for firing of projectiles. 


Movement on mobile is easiest when the mobile device is held horizontally. If you refer to the image attached in this assignment; pLayer movement is done though rotation about the y-axis, and aiming of projectiles is done through movement about the z-axis. A projectile can be fired by tapping on the screen. 

The game currently allows for only a single session. After a game is complete, the desktop page will first have to be restarted by clicking on the end game window, and the same process as above is repeated. Mobile players will have to refresh their client pages to reconnect to the game server.

app.js functions as both the socket.io server and the web server. app.js is the the junction point between game.js and the html files index and mobile. all communication between the game page and players is done through app.js. game.js contains all of the model code. game.js receives control input from mobile.html and index.html. There's a clear seperation between controller, view and model code in our program.

 






 

