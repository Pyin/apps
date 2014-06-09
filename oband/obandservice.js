document.addEventListener('deviceready',function(){

	cordova.define("org.bcsphere.obandservice", function(require, exports, module) {
		
		var BC = require("org.bcsphere.bcjs");
		
		var writeUUID = "fec7";
		var indicateUUID = "fec8";
		var getDeviceInfoCallback = null;
		var seqID = 0;
		
		function getNextSeq(){
			var seqstr = (seqID + 1).toString(16);
			if(seqstr.length < 2){
				seqstr = "0"+seqstr;
			}else if(seqstr.length > 2){
				seqID = -1;
				seqstr = "00";
			}
			seqID++;
			return seqstr;
		};
		
		function messageProccessor(data){
			var response = data.value.getHexString();
			if(response.substr(0,2) == "af"){
				if(parseInt(response.substr(6,2),16) == seqID){
					if(response.substr(4,2) == "13"){
						getDeviceInfoCallback(data.value);
					}
				}else{
					alert("please wait the response.");
				}
			}
		};
		
		var OBandService = BC.OBandService = BC.Service.extend({
			
			init : function(success,error){
				this.discoverCharacteristics(function(){
					var character = this.getCharacteristicByUUID(indicateUUID)[0];
					character.subscribe(messageProccessor);
					success();
				},function(){
					alert("discoverCharacteristics error.");
					error();
				});
			},
			
			getDeviceInfo : function(callback){
				this.discoverCharacteristics(function(){
					var character = this.getCharacteristicByUUID(writeUUID)[0];
					var command = "AF001413" + getNextSeq() + "000000000000000000000000000000";
					character.write("Hex",command,function(data){
						getDeviceInfoCallback = callback;
					},function(){
						alert("get_device_info error.");
					});
					success();
				},function(){
					alert("discoverCharacteristics error.");
					error();
				});		
			},
			
		});
		
		BC.bluetooth.UUIDMap["0000fee7-0000-1000-8000-00805f9b34fb"] = BC.OBandService;
		
		module.exports = BC;
	});
	
},false);