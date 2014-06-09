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
			alert("getdata!!");
			alert(data.getHexString());
		});
	}
	$scope.set_user_info = function(){
		oband.set_user_info();
	}
	$scope.set_parameter = function(){
		oband.set_parameter();
	}	
	$scope.get_sport_data = function(){
		oband.get_sport_data();
	}
	$scope.set_time = function(){
		oband.set_time();
	}
	$scope.format_device = function(){
		oband.format_device();
	}
	$scope.get_sport_daily_recoder = function(){
		oband.get_sport_daily_recoder();
	}
}]);