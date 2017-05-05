function startGame(){
			
		$(document).ready(function(){
		  $("#Canvas").css("display", "none");
		   $("body").css("background-image", "url(img/attackOfZombies.jpg)");
		   $("body").css("background-repeat", "no-repeat"); 
		  $("body").css("background-size", "100%"); 
		  // click button to start game
		  $("#StartButton").click(function () {
		   $("#startScreen").css("display", "none");
		    $("#Canvas").css("display", "block")
			 $("body").css("background-image", "none");
			load();
			});
		});	
}



