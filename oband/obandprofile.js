document.addEventListener('deviceready',function(){

	cordova.define("org.bcsphere.obandprofile", function(require, exports, module) {
		
		var BC = require("org.bcsphere.obandservice");
		
		var obandServiceUUID = "fee7";
		
		var obandService = null;
		
		var OBandProfile = BC.OBandProfile = BC.Profile.extend({
			
			oBandInit : function(device,success,error){
				device.discoverServices(function(){
					obandService = device.getServiceByUUID(obandServiceUUID)[0];
					obandService.init(success,error);
				},function(){
					alert("OBand discoverServices error!");
					error();
				});
			},
			
			getDeviceInfo : function(device,callback){
				if(device.isConnected && obandService){
					obandService.getDeviceInfo(callback);
				}else{
					alert("please connect your OBand first!");
				}
			},
			
			getSportDailyRecoder : function(device,callback){
				if(device.isConnected && obandService){
					obandService.getSportDailyRecoder(callback);
				}else{
					alert("please connect your OBand first!");
				}
			},
				
			getSportData : function(device,callback){
				
				obandService.getDeviceInfo(function(data){
					var left = data.record_left
				});
				
				if(device.isConnected && obandService){
					obandService.getSportData(callback);
				}else{
					alert("please connect your OBand first!");
				}
			},
			
			setUserInfo : function(device,arg,callback){
				if(device.isConnected && obandService){
					obandService.setUserInfo(arg,callback);
				}else{
					alert("please connect your OBand first!");
				}
			},

			setParameter : function(device,arg,callback){	
				if(device.isConnected && obandService){
					obandService.setParameter(arg,callback);
				}else{
					alert("please connect your OBand first!");
				}
			},
						
			setTime : function(device,arg,callback){
				if(device.isConnected && obandService){
					obandService.setTime(arg,callback);
				}else{
					alert("please connect your OBand first!");
				}
			},
						
			formatDevice : function(device,callback){
				if(device.isConnected && obandService){
					obandService.formatDevice(callback);
				}else{
					alert("please connect your OBand first!");
				}
			},
				
		});
		
		module.exports = BC;	

	});
},false);