'use strict';

var bcsphereControllers = angular.module('bcsphereControllers',[]);

var WebApp = function(device,mapurl,data,bigImageUrl,smallImageUrl,isBackground){
	this.device = device;
	this.mapurl = mapurl;
	this.data = data;
	this.bigImageUrl = bigImageUrl;
	this.smallImageUrl = smallImageUrl;
	this.isBackground = isBackground;
};

document.addEventListener('deviceready',function(){
	var BC = window.BC = cordova.require("org.bcsphere.bcjs");
	var BCLog = window.BCLog = cordova.require("org.bcsphere.bclog");
	var BCutilities = window.BCutilities = cordova.require("org.bcsphere.cordova.utilities");
},false);

bcsphereControllers.controller('DeviceListCtrl',["$scope",'$location','$http',function($scope,$location,$http){

	$scope.webApps = [];
	$scope.connectedApps = {};
	$scope.n = n;
	$scope.imgClick = false;
	$scope.firstTime = true;
	$scope.searchInterval = null;
	$scope.degrees = 0;

	document.addEventListener("bcready",function(){
		if(!BC.bluetooth.isopen){
			if(API !== "ios"){
				BC.Bluetooth.OpenBluetooth(function(){
				});
			}else{					
				alert("Please open your bluetooth first.");
			}
		}

		BC.bluetooth.addEventListener("bluetoothstatechange",function(){
			if(BC.bluetooth.isopen){
			
			}else{
				alert("Your bluetooth closed!");
				if(API !== "ios"){
					BC.Bluetooth.OpenBluetooth(function(){
					});
				}
			}
		});
		angular.element('#interference span').text('0');
		$scope.addConnectedDevice();
		$scope.startScan();
		BC.bluetooth.addEventListener("newdevice",$scope.addNewDevice);
		$scope.moveLeft();
	},false);

	document.addEventListener("deviceAdd",function(s){
		var newWebApp = s.arg;
		$http.get(newWebApp.mapurl).success(function(data){
            if(data.url !== ""){
                newWebApp.bigImageUrl = data.url.substring(0,data.url.lastIndexOf('/')+1)+'icon/icon372x372.png';
                newWebApp.smallImageUrl= data.url.substring(0,data. url.lastIndexOf('/')+1)+'icon/icon72x72.png';
            }
            newWebApp.data = data;
        }).error(function(){
            var strConnectedApps = localStorage.getItem('connectedApps');
	        if(strConnectedApps){
	            newWebApp = (JSON.parse(strConnectedApps))[newWebApp.mapurl];
	        }
        });
	},false);

	$scope.addNewDevice = function(s){
		var newDevice = s.target;
		var mapurl ="";
		var bigImageUrl = "img/unknown372x372.png";
        var smallImageUrl = "img/unknown72x72.png";
        var newWebApp = null;
        
		if(newDevice.type == "BLE"){
            mapurl = "http://115.29.149.19:3000/redirectToApp?localname=" + newDevice.advertisementData.localName;
        }else{
            mapurl = "http://115.29.149.19:3000/redirectToApp?localname=" + newDevice.deviceName;
        }
     	
     	if(!$scope.connectedApps[mapurl]){
     		newWebApp = new WebApp(newDevice,mapurl,{"url":""},bigImageUrl,smallImageUrl,'true');
	        $scope.webApps.push(newWebApp);
	        BC.Tools.FireDocumentEvent("deviceAdd",newWebApp);
     	}   
	}

    $scope.stopScan = function(){
   		clearInterval($scope.searchInterval);
		BC.Bluetooth.StopScan();
		$scope.scaning = false;
    }

    $scope.startScan = function(){
    	$scope.searchInterval = setInterval($scope.run,1);
    	if($scope.webApps.length<=0){
    		$scope.addConnectedDevice();
    	}
		BC.Bluetooth.StartScan();
		$scope.scaning = true;
    }

	$scope.switchScan = function(){
		if(!$scope.scaning){
		    $scope.startScan();
		}else{
		    $scope.stopScan();
		}
	};

	$scope.showDebug = function(){
		var data = {};
		data.url = 'bclog';
		data.deviceName = 'log';
		data.isBackground = 'true';
		data.deviceAddress = "1000";
		data.deviceType = "bclog";
		BCutilities.redirectToApp(function(){
        },function(message){
            alert("Redirect App error!");
        },data);
	};

	$scope.run = function(){
		$scope.degrees++;
		if($scope.degrees==360){
			$scope.degrees=0
		}
		angular.element('#search').css({"-webkit-transform":"rotateZ("+($scope.degrees)+"deg)"});
	};

	setInterval(function(){
		var webAppCount = $scope.webApps.length;
		if(webAppCount==0){
			angular.element('#content0').removeClass('hide').addClass('show');
			angular.element('#content').removeClass('show').addClass('hide');
		}else{
			angular.element('#content0').removeClass('show').addClass('hide');
			angular.element('#content').removeClass('hide').addClass('show');
		}

		var currentIndex = angular.element('#slide_wrapper').children('active').index();
		if(deviceIndex == -1){
			deviceIndex = 0; 
		}
		if(webAppCount == -1){
			webAppCount = 0;
		}
		var newDeviceNumber = webAppCount - deviceIndex;
		if(currentIndex<(webAppCount-1) && moveInterval == null && newDeviceNumber!==0){
			angular.element('#interference').removeClass('hide').addClass('show');
			angular.element('#interference span').text(newDeviceNumber);
		}else{
			angular.element('#interference').removeClass('show').addClass('hide');
		}
		$scope.$apply();

	},100);

	$scope.addConnectedDevice = function(){
		if(localStorage.getItem('connectedApps')!= undefined && localStorage.getItem('connectedApps')!=null){
			$scope.connectedApps = JSON.parse(localStorage.getItem('connectedApps'));
			for(var key in $scope.connectedApps){
				$scope.webApps.push($scope.connectedApps[key]);
				BC.Tools.FireDocumentEvent("deviceAdd",$scope.connectedApps[key]);
			}
		}
	} 

	angular.element('#interference').bind('click',function(){
		var webAppCount = $scope.webApps.length;
		deviceIndex = webAppCount;
		angular.element(this).removeClass('show').addClass('hide');
		for(var i =0 ;i<=webAppCount-n;i++){
			slide.moveLeft();
		}
	});

	$scope.moveLeft = function(){
		moveInterval=setInterval(function(){
			var lastNavi = angular.element("#slide_wrapper").children().length-1;
			var currentNavi = angular.element("#slide_wrapper").children(".active").index();

			if(currentNavi < lastNavi){
				slide.moveLeft();  
			}
		},100);
	}
}]);