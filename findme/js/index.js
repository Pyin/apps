/*
	Copyright 2013-2014, JUMA Technology

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/


var app = {
    
    state : "waiting_to_find",
    interval_connect : null,
    reconnect_interval : null,
    device : {},
    isAlert : false,

    initialize: function() {
	    app.bindCordovaEvents();
    },
    
    bindCordovaEvents: function() {
		document.addEventListener('deviceready',app.onDeviceReady,false);
        document.addEventListener('bcready', app.onBCReady, false);
    },
    
	onDeviceReady: function(){
		var BC = window.BC = cordova.require("org.bluetooth.profile.proximity");
		var BC = window.BC = cordova.require("org.bluetooth.profile.find_me");
		app.proximityProfile = new BC.ProximityProfile();
		app.findmeProfile = new BC.FindMeProfile();
		navigator.notification = cordova.require('org.apache.cordova.dialogs.notification');
	},
	
    onBCReady: function() {
        BC.bluetooth.addEventListener("bluetoothstatechange",app.onBluetoothStateChange);
        BC.bluetooth.addEventListener("newdevice",app.addNewDevice);
		if(!BC.bluetooth.isopen){
			if(API !== "ios"){
				BC.Bluetooth.OpenBluetooth(function(){
				});
			}else{					
				//alert("Please open your bluetooth first.");
			}
		}

		app.device = new BC.Device({deviceAddress:DEVICEADDRESS,deviceName:"O-Click",isConnected:false,type:DEVICETYPE});
		app.device.addEventListener("deviceconnected",app.onDeviceConnected);
		app.device.addEventListener("devicedisconnected",app.onDeviceDisconnected);
    },
    
   	onBluetoothStateChange : function(){
		if(BC.bluetooth.isopen){

		}else{
			if(API !== "ios"){
                BC.Bluetooth.OpenBluetooth(function(){
                });
            }else{                  
                //alert("Please open your bluetooth first.");
            }
		}
	},
	
	onBluetoothDisconnect: function(arg){
        app.proximityProfile.clearPathLoss();
        navigator.notification.stopBeep();
        app.state = "finding";
		$('#doevent').attr('src','img/stop.png');
        app.canvas();
		app.reconnect_interval = setInterval(function(){
		   if(app.device.isConnected){
		      window.clearInterval(app.reconnect_interval);
		   }else{
		      app.device.connect(app.connectSuccess,function(){});
		   }
		},2000);
	},
    
    onDeviceConnected : function(arg){
		var deviceAddress = arg.deviceAddress;
		
	},
    
	onDeviceDisconnected : function(){
	   app.proximityProfile.clearPathLoss();
	   navigator.notification.stopBeep();
	   $.mobile.changePage("index.html","slideup");
	},
    
    findMe : function(){
    	var img = $('#doevent').attr('src');
		if(app.state == "waiting_to_find"){
			app.state = "finding";
			app.interval_connect = window.setInterval(function(){
                var addr = sessionStorage.getItem("deviceAddress");
                app.device.connect(app.connectSuccess,function(){});
            }, 2000);
			$('#doevent').attr('src','img/stop.png');
			app.canvas();
		}else if(app.state == "finding"){
		    if(app.reconnect_interval){
                window.clearInterval(app.reconnect_interval);
            }
			app.state = "waiting_to_find";
			window.clearInterval(app.interval_connect);
			$('#doevent').attr('src','img/find.png');
			$('canvas').remove();
		}else if(app.state == "standing_by"){
			app.state = "find_me";
            app.findmeProfile.high_alert(app.device);
			$('#doevent').attr('src','img/refresh2.png');
		}else if(app.state == "find_me"){
			app.state = "standing_by";
			navigator.notification.stopBeep();
			app.findmeProfile.no_alert(app.device);
			$('#doevent').attr('src','img/refresh1.png');
		}
    },

    connectSuccess : function(){
    	window.clearInterval(app.interval_connect);
    	app.state = "standing_by";
    	$('#doevent').attr('src','img/refresh1.png');
		$('canvas').remove();
    	app.device.discoverServices(function(){            
            app.device.getServiceByUUID("ffe0")[0].discoverCharacteristics(function(){
                app.device.getServiceByUUID("ffe0")[0].characteristics[0].subscribe(app.onNotify);
            },function(){});
            app.proximityProfile.onLinkLoss(app.device);
            app.proximityProfile.onPathLoss(app.device,-60,-80,app.farAwayFunc,app.safetyZone_func,app.closeToFunc);
        });
        
    },

    farAwayFunc : function(){
    	app.isAlert = true;
    	navigator.notification.beep();
    	app.proximityProfile.alert(app.device,app.proximityProfile.ImmediateAlertUUID,'2');
    },

    safetyZone_func : function(){
    	if(app.isAlert){
    	    navigator.notification.stopBeep();
    	    app.proximityProfile.alert(app.device,app.proximityProfile.ImmediateAlertUUID,'0');
    	    app.isAlert = false;
    	}
    },

    closeToFunc : function(){
    	if(app.isAlert){
            navigator.notification.stopBeep();
            app.proximityProfile.alert(app.device,app.proximityProfile.ImmediateAlertUUID,'0');
            app.isAlert = false;
        }
    },

    onNotify:function(data){
		var value = data.value.getHexString();
		if( value == "20"){
			if (app.state == "standing_by") {
				app.state = "find_me";
				$('#doevent').attr('src','img/refresh2.png');	
		    };				
			navigator.notification.beep();
		}else if (value == "01"){
			if (app.state == "find_me") {
				app.state = "standing_by";
				$('#doevent').attr('src','img/refresh1.png');
			};
			navigator.notification.beep();
		}
    },

	canvas : function (){
		var winHeight = sessionStorage.getItem("winHeight")-60;
		var winWidth = sessionStorage.getItem("winWidth");
		var canvas=$("<canvas id='cartoon' width='"+winWidth+"' height='"+winHeight+"'>");
		
		$('.content').append(canvas);
		
		var centerx = sessionStorage.getItem("centerx");
		var centery = sessionStorage.getItem("centery");
		
		var canvas=$('#cartoon');
		var context=canvas.get(0).getContext("2d");
		var Shape=function(x,y,z){
		  this.x=x;
		  this.y=y;
		  this.z=z;
		}

		var shapes=new Array();
		shapes.push(new Shape('rgb(119,79,35)',0.5,112));
		shapes.push(new Shape('rgb(119,79,35)',0.5,182));
		shapes.push(new Shape('rgb(119,79,35)',0.5,262));
		length1=shapes.length;
		var tmp;
		var i=0;


	    function change(){
			tmp=shapes[i];
			context.strokeStyle=tmp.x;
			context.lineWidth=tmp.y;
			context.beginPath();
			context.arc(centerx,centery,tmp.z,0,Math.PI*2,false);
			context.closePath();
			context.stroke();
			if(i<length1){
				i++;
				setTimeout(change,400);
			}
		}
	    setTimeout(change,400);
	
		function change1(){
			context.clearRect(0,0,winWidth,winHeight);
			for(j=0;j<length1;j++){
				tmp=shapes[j];
				context.strokeStyle=tmp.x;
				context.lineWidth=tmp.y;
				context.beginPath();
				context.arc(centerx,centery,tmp.z,0,Math.PI*2,false);
				context.closePath();
				context.stroke();
			}
		
		    context.strokeStyle="rgb(119,79,35,50)";
			context.lineWidth='1';
			context.beginPath();
			context.arc(centerx,centery,i,0,Math.PI*2,false);
			context.closePath();
			context.stroke();
			if(i<centerx){
				i+=20;
			}else{
				i=0;
			}
			setTimeout(change1,40);
		}
	    setTimeout(change1, 10);
	},
	
};
