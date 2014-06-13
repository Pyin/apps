var windowHeight = window.screen.availHeight;
var box = document.getElementById('box');
var tag = document.getElementById('tag');
box.style.height = windowHeight + "px";
document.addEventListener('deviceready',function(){
	var BCLog = window.BCLog = cordova.require("org.bcsphere.bclog");
	BCLog.trace(function(data){
		tag.innerHTML = tag.innerHTML+"</br>"+JSON.stringify(data).replace('"','').replace('"','');
		if((box.scrollTop + box.clientHeight)<tag.offsetHeight){
			box.scrollTop += 18;
		}
	});
},false);