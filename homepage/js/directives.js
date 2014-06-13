'use strict';

var bcsphereDirectives = angular.module('bcsphereDirectives',[]);

bcsphereDirectives.directive('ngdelete', function() {
  return {
      restrict: 'ACE',
      link: function(scope, element, attrs) {

        if(scope.webApps.length == 0){
          if(!angular.element('#noDevice')){
            scope.addElement();
          }
        }

        var slide_wrapper_li = element[0];
 
        var hammer = Hammer(slide_wrapper_li, {
          drag: true,
          prevent_default:true
        });
        
        hammer.on("hold", function(event) {
          element.css({'opacity':0.5})
          var starty = event.gesture.center.pageY;
          var movey = 0;
          slide_wrapper_li.ontouchmove = function(event){
            if(event.stopPropagation) {
                event.stopPropagation();  
            }
            movey = event.touches[0].pageY;
            if(movey>=starty){
              movey=starty;
            }
              slide_wrapper_li.style.marginTop = (movey-starty)+'px';
          }
          slide_wrapper_li.ontouchend = function(event){
            slide_wrapper_li.ontouchmove = null;
            if((-(movey-starty))<=(windowHeight*0.33) || (movey==0)){
               element.css({'opacity':1});
               slide_wrapper_li.style.marginTop = 0+'px';
            }else{
              var index = element.index();
              if(element.index()==(element.parent().children().length-1)){
                slide.moveRight();
              }else{
              element.next().addClass('active');
              angular.element("#text_wrapper").children("li:eq("+index+")").next().addClass('active');
              angular.element("#navi_wrapper").children("li:eq("+index+")").next().addClass('active');
              }
              delete BC.bluetooth.devices[(scope.webApps[element.index()]).device.deviceAddress];
              if(localStorage.getItem('connectedApps')!= undefined && localStorage.getItem('connectedApps')!=null){
                scope.connectedApps = JSON.parse(localStorage.getItem('connectedApps'));
                for(var key in scope.connectedApps){
                  if(scope.connectedApps[key].deviceAddress == scope.webApps[element.index()].deviceAddress){
                    delete scope.connectedApps[key];
                  }
                }
              }
              scope.webApps.splice(element.index(),1);
              deviceIndex--;
              scope.$apply();
            }
          }
        });

        hammer.on("tap",function(event){
          scope.stopScan();
          navigator.bcutilities = cordova.require('org.bcsphere.cordova.utilities');
          if(!scope.imgClick){
              scope.imgClick = true;
              scope.webApp.data.deviceAddress = scope.webApp.device.deviceAddress;
              scope.webApp.data.deviceType = scope.webApp.device.type;
              scope.webApp.data.deviceName = scope.webApp.device.deviceName;
              scope.webApp.data.isBackground = scope.webApp.device.isBackground;
              
              navigator.bcutilities.redirectToApp(function(){
                  scope.imgClick = false;
                  scope.connectedApps[scope.webApp.mapurl] = scope.webApp;
                  localStorage.setItem('connectedApps',JSON.stringify(scope.connectedApps));
              },function(message){
                  scope.imgClick = false;
                  alert("Redirect App error!");
              },scope.webApp.data);
            }
        });
        
      }
  };
});
