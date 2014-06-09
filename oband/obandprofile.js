document.addEventListener('deviceready',function(){

	cordova.define("org.bcsphere.obandprofile", function(require, exports, module) {
		
		var BC = require("org.bcsphere.obandservice");
		
		var obandServiceUUID = "fee7";
		
		var OBandProfile = BC.OBandProfile = BC.Profile.extend({

			oBandInit : function(device,success,error){
				device.discoverServices(function(){
					var service = device.getServiceByUUID(obandServiceUUID)[0];
					service.init(success,error);
				},function(){
					alert("OBand discoverServices error!");
					error();
				});
			},
			
			getDeviceInfo : function(device,callback){
				if(device.isConnected){
					device.discoverServices(function(){
						var service = device.getServiceByUUID(obandServiceUUID)[0];
						service.getDeviceInfo(callback);
					},function(){
						alert("OBand discoverServices error!");
						error();
					});
				}else{
					alert("please connect your OBand first!");
				}
			},
				
			setUserInfo : function(device,callback){
				alert("set_user_info");
			},
				
			setParameter : function(device,callback){
				alert("set_parameter");
			},
						
			getSportData : function(device,callback){
				alert("get_sport_data");
			},
						
			setTime : function(device,callback){
				alert("set_time");
			},
						
			formatDevice : function(device,callback){
				alert("format_device");
			},
						
			getSportDailyRecoder : function(device,callback){
				alert("get_sport_daily_recoder");
			},
				
		});
		
		module.exports = BC;	

	});
},false);