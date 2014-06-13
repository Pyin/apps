windowWidth = window.screen.availWidth;
windowHeight = window.screen.availHeight;
$("body").css({"height":windowHeight});
$(".header").css({"height":windowHeight*0.10,'line-height':windowHeight*0.10+"px"});
$(".mobile").css({"margin-top":windowHeight*0.12});
$(".text_box").css({"margin-top":windowHeight*0.04})
$(".retry").css({"width":windowWidth*0.2,"height":windowHeight*0.07,
	'line-height':windowHeight*0.07+"px","margin-top":windowHeight*0.04})

document.addEventListener('deviceready',function(){
	var BCutilities = window.BCutilities = cordova.require("org.bcsphere.cordova.utilities");
	var retry = document.getElementById('retry');
	retry.onclick = function(){
		BCutilities.retry(function(){
			
		},function(){

		});
	}
},false);