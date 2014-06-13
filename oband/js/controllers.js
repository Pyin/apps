'use strict';

var obandtestControllers = angular.module('obandtestControllers',[]);

document.addEventListener('deviceready',function(){
	var BC = window.BC = cordova.require("org.bcsphere.bcjs");
	var _ = window._ = cordova.require("org.underscorejs.underscore");
});

obandtestControllers.controller('DeviceListCtrl',["$scope",'$location',function($scope,$location){
	
	$scope.switchOBandScanItem = false;
	
	if(typeof(BC) != 'undefined' && BC.bluetooth){
		$scope.devices = BC.bluetooth.devices;
	}else{
		document.addEventListener("bcready",function(){
			$scope.devices = BC.bluetooth.devices;
		},false);
	}
	setInterval(function(){$scope.$apply();},500);

	$scope.switchOBandScan = function(){
		if($scope.switchOBandScanItem){
			BC.Bluetooth.StartScan("LE");
		}else{
			BC.Bluetooth.StopScan();
		}
	};

	$scope.changePage = function(deviceAddress){
		$location.path("\/oband_operation\/"+deviceAddress);
	};
	
}]);

obandtestControllers.controller('OBandOperationCtrl',['$scope','$location','$routeParams',function($scope,$location,$routeParams){
	
	var BC = cordova.require("org.bcsphere.obandprofile");
	$scope.subscribe_button_show = true;
	$scope.listen_button_show = true;
	var oband = BC.bluetooth.devices[$routeParams.deviceAddress];
	var oBandProfile = new BC.OBandProfile();

	oband.addEventListener("devicedisconnected",function(){
		alert("OBand connection is lost.");
		$scope.connect_button_show = true;
		$scope.disconnect_button_show = false;
	});
	
	if(oband.isConnected == true){
		$scope.disconnect_button_show = true;
	}else{
		$scope.connect_button_show = true;
	}
		
	$scope.connect = function(){
		oband.connect(function(){
			oBandProfile.oBandInit(oband,function(){
				$scope.connect_button_show = false;
				$scope.disconnect_button_show = true;
			},function(){
				alert("OBand init error.");
			});
		},function(){
			alert("OBand connect error.");
		});
	}
	$scope.disconnect = function(){
		oband.disconnect(function(){
			$scope.connect_button_show = true;
			$scope.disconnect_button_show = false;
		});
	}
	$scope.get_device_info = function(){
		oBandProfile.getDeviceInfo(oband,function(data){
			alert(JSON.stringify(data));
		});
	}
	$scope.set_user_info = function(){
		oBandProfile.setUserInfo(oband,
		{
			"gender":0,
			"age":25,
			"height":177,
			"weight":60,
			"user_id":"12345678"
		},function(data){
			alert(JSON.stringify(data));
		});
	}
	$scope.set_parameter = function(){
		oBandProfile.setParameter(oband,
		{
			"sport_target":5432, //step
			"long_sit_alert_interval":64, // minute
			"long_sit_start_time":60, // second
			"sport_alert_target":64, // minute
			"sport_alert_start_time":60, //second
			"alarm1_time":30, //second
			"alarm1_day":[2,4],//1-7
			"alarm2_time":30, //second
			"alarm2_day":[2,4,6],//1-7
			"alarm3_time":30, //second
			"alarm3_day":[7],//1-7
		},function(data){
			alert(data.getHexString());
		});
	}	
	$scope.get_sport_data = function(){
		oBandProfile.getSportData(oband,function(data){
			alert(data.getHexString());
		});
	}
	$scope.set_time = function(){
		var time = parseInt(Date.parse(new Date())/1000);
		oBandProfile.setTime(oband,
		{
			"ref_time":time,
			"week":2,//1-7
		},function(data){
			alert(data.getHexString());
		});
	}
	$scope.format_device = function(){
		oBandProfile.formatDevice(oband,function(data){
			alert(JSON.stringify(data));
		});
	}
	$scope.get_sport_daily_recoder = function(){
		oBandProfile.getSportDailyRecoder(oband,function(data){
			alert(data.getHexString());
		});
	}
}]);