var obandtestApp = angular.module('obandtest',[
	'ngTouch',
	'ngRoute',
	'obandtestControllers',
	'onsen.directives'
]);

obandtestApp.config(['$routeProvider',
	function($routeProvider){
	  $routeProvider.
		when('/device_list',{
			templateUrl: 'device_list.html',
			controller: 'DeviceListCtrl'
		}).		
		when('/oband_operation/:deviceAddress',{
			templateUrl: 'oband_operation.html',
			controller: 'OBandOperationCtrl'
		}).
		otherwise({
			redirectTo: '/device_list'
		});
	}
]);