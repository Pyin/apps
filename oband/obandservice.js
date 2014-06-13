document.addEventListener('deviceready',function(){

	cordova.define("org.bcsphere.obandservice", function(require, exports, module) {
		
		var BC = require("org.bcsphere.bcjs");
		
		var writeUUID = "fec7";
		var indicateUUID = "fec8";
		var getDeviceInfoCallback = null;
		var getSportDailyRecoderCallback = null;
		var getSportDataCallback = null;
		var setUserInfoCallback = null;
		var setParameterCallback = null;
		var setTimeCallback = null;
		var formatDeviceCallback = null;
		var seqID = 0;
		var dataBuffer = null;
		var buffertime = 0;
		var buffertype = "";
		
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
		
		function repeat0(num){
			var result = "";
			for(var i = 0;i < num;i++){
				result += "0";
			}
			return result;
		};
		
		function append0(str,length){
			var result = str;
			if(length){
				result = repeat0(length - str.length) + str;
			}else if(str.length % 2 == 1){
				result = "0" + str;
			}
			return result;
		};
		
		function parseAlarm(time,day){
			var alarm_time = parseInt(time/30).toString(16);
			alarm_time = append0(alarm_time);
			var alarm_day = 0;
			for(var i = 0;i < day.length;i++){
				if(day[i] == 7){
					alarm_day++;
				}else{
					alarm_day = alarm_day + Math.pow(2,day[i]);
				}
			}
			alert(alarm_day.toString(2));
			return append0(alarm_time,4) + append0(alarm_day.toString(16));
		};
		
		function parseAlarmDay(str){
			var alarm_day = append0(parseInt(str,16).toString(2),7);
			var result = [];

			for(var i = 6; i > -1 ;i--){
				if(alarm_day.substr(i,1) == "1"){
					if(i == 6){
						result.push(7);
					}else{
						result.push(7 - i -1);
					}
				}
			}
			return result;
		};
		
		function parseDeviceInfo(data){
			var result = {};
			var response = data.getHexString();
			result.seq = parseInt(response.substr(6,2),16);
			result.states = response.substr(8,2);
			result.hardware_version = data.getASCIIString().substr(5,7);
			result.battery = parseInt(response.substr(24,2),16);
			result.battery100 = parseInt(response.substr(26,2),16);
			result.battery5 = parseInt(response.substr(28,2),16);
			result.gender = parseInt(response.substr(30,2),16);
			result.age = parseInt(response.substr(32,2),16);
			result.height = parseInt(response.substr(34,2),16);
			result.weight = parseInt(response.substr(36,2),16);
			result.userID = response.substr(38,8);
			var isActive = response.substr(46,2);
			if(isActive == "a0"){
				result.isActive = true;
			}else{
				result.isActive = false;
			}
			result.ref_time = parseInt(response.substr(48,8),16);
			result.day_count = parseInt(response.substr(56,2),16);
			result.week = parseInt(response.substr(58,2),16);
			result.relative_time = parseInt(response.substr(60,4),16)*30;
			result.walk_target = parseInt(response.substr(64,6),16);
		
			result.walk_count = parseInt(response.substr(70,6),16);
			result.walk_distance = parseInt(response.substr(76,6),16);
			result.walk_time = parseInt(response.substr(82,4),16);
			result.run_count = parseInt(response.substr(86,6),16);
			result.run_distance = parseInt(response.substr(92,6),16);
			result.run_time = parseInt(response.substr(98,4),16);
			result.long_sit_start = parseInt(response.substr(102,4),16)*30;
			result.long_sit_end = parseInt(response.substr(106,4),16)*30;
			result.long_sit_interval = parseInt(response.substr(110,2),16)*30;
			result.long_sit_step = parseInt(response.substr(112,4),16);
			result.alarm1_time = parseInt(response.substr(116,4),16)*30;
			result.alarm1_day = parseAlarmDay(response.substr(120,2));
			result.alarm2_time = parseInt(response.substr(122,4),16)*30;
			result.alarm2_day = parseAlarmDay(response.substr(126,2));
			result.alarm3_time = parseInt(response.substr(128,4),16)*30;
			result.alarm3_day = parseAlarmDay(response.substr(132,2));
			result.record_left = parseInt(response.substr(134,4),16);

			return result;
		};
		
		function triggerCallBack(){
			if(buffertype == "13"){
				if(getDeviceInfoCallback){
					getDeviceInfoCallback(parseDeviceInfo(dataBuffer));
					getDeviceInfoCallback = null;
				}else if(formatDeviceCallback){
					formatDeviceCallback(parseDeviceInfo(dataBuffer));
					formatDeviceCallback = null;
				}else if(setUserInfoCallback){
					setUserInfoCallback(parseDeviceInfo(dataBuffer));
					setUserInfoCallback = null;
				}
			}else if(buffertype == "14"){
				getSportDailyRecoderCallback(dataBuffer);
				getSportDailyRecoderCallback = null;
			}else if(buffertype == "02"){
				getSportDataCallback(dataBuffer);
				getSportDataCallback = null;
			}else if(buffertype == "16"){
				setParameterCallback(dataBuffer);
				setParameterCallback = null;
			}else if(buffertype == "03"){
				setTimeCallback(dataBuffer);
				setTimeCallback = null;
			}
				
			buffertype = null;
			dataBuffer = null;			
		};
		
		function messageProccessor(data){
			var response = data.value.getHexString();
			
			if(response.substr(0,2) == "af" && buffertime == 0){
				if(parseInt(response.substr(6,2),16) == seqID){
					//TODO  if buffertime = 0
					var length = parseInt(response.substr(2,2),16);
					buffertime = parseInt(length/20) + 1;
					buffertype = response.substr(4,2);
					if(buffertime == 1){
						dataBuffer = data.value;
						triggerCallBack(buffertype,dataBuffer);
						return;
					}
				}else{
					alert("please wait the response.");
				}
			}

			if(buffertime > 0){
				if(dataBuffer == null){
					dataBuffer = data.value;
				}else{
					dataBuffer.append(data.value);
				}
				if(--buffertime == 0){
					triggerCallBack(buffertype,dataBuffer);
				}
			}
		};
		
		var OBandService = BC.OBandService = BC.Service.extend({
			
			writeCommand : function(command,success,error){
				this.discoverCharacteristics(function(){
					var character = this.getCharacteristicByUUID(writeUUID)[0];
					character.write("Hex",command,function(data){
						success();
					},function(){
						//alert("get_device_info error.");
						error();
					});
				},function(){
					//alert("discoverCharacteristics error.");
					error();
				});	
			},
			
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
				var command = "AF001413" + getNextSeq() + repeat0(30);
				this.writeCommand(command,function(){
					getDeviceInfoCallback = callback;
				},function(){
					alert("getDeviceInfo error.");
				});
			},
			
			getSportData : function(callback){
				var command = "AF001402" + getNextSeq() + repeat0(30);
				this.writeCommand(command,function(){
					getSportDataCallback = callback;
				},function(){
					alert("getSportData error.");
				});
			},
			
			getSportDailyRecoder : function(callback){
				var command = "AF001414" + getNextSeq() + repeat0(30);
				this.writeCommand(command,function(){
					getSportDailyRecoderCallback = callback;
				},function(){
					alert("getSportDailyRecoder error.");
				});
			},
			
			setUserInfo : function(arg,callback){
				var gender = arg.gender.toString(16);
				gender = "0" + gender;
				var age = arg.age.toString(16);
				var height = arg.height.toString(16);
				var weight = arg.weight.toString(16);
				var userid = arg.user_id;
				var command = "AF001407" + getNextSeq() + gender + age + height + weight + userid + repeat0(14);
				this.writeCommand(command,function(){
					setUserInfoCallback = callback;
				},function(){
					alert("setUserInfo error.");
				});
			},

			setParameter : function(arg,callback){
				var sport_target = (arg.sport_target/2).toString(16);
				sport_target = append0(sport_target,4);
				
				var long_sit_start_time = parseInt(arg.long_sit_start_time/30).toString(2);
				long_sit_start_time = append0(long_sit_start_time,4);
				var long_sit_alert_interval = parseInt(arg.long_sit_alert_interval/8).toString(2);
				long_sit_alert_interval = append0(long_sit_alert_interval,12);
				var long_sit_alert = (parseInt(long_sit_start_time + long_sit_alert_interval,2)).toString(16);
				long_sit_alert = append0(long_sit_alert,4);

				var sport_alert_start_time = parseInt(arg.sport_alert_start_time/30).toString(2);
				sport_alert_start_time = append0(sport_alert_start_time,4);
				var sport_alert_target = parseInt(arg.sport_alert_target/16).toString(2);
				sport_alert_target = append0(sport_alert_target,12);
				var sport_alert = (parseInt(sport_alert_start_time + sport_alert_target,2)).toString(16);
				sport_alert = append0(sport_alert,4);
				
				var alarm1 = parseAlarm(arg.alarm1_time,arg.alarm1_day);
				var alarm2 = parseAlarm(arg.alarm2_time,arg.alarm2_day);
				var alarm3 = parseAlarm(arg.alarm3_time,arg.alarm3_day);
				
				var command = "AF001416" + getNextSeq() + sport_target + long_sit_alert + sport_alert + alarm1 + alarm2 +alarm3;

				this.writeCommand(command,function(){
					setParameterCallback = callback;
				},function(){
					alert("setParameter error.");
				});
			},
						
			setTime : function(arg,callback){
				var timeStr = arg.ref_time.toString(16);
				var week = "0" + arg.week.toString(16);
				var current_time = (parseInt((Date.parse(new Date())/1000/30))%86400).toString(16);
				append0(current_time);
				var command = "AF001403" + getNextSeq() + timeStr + week + current_time + repeat0(14);
				this.writeCommand(command,function(){
					setTimeCallback = callback;
				},function(){
					alert("setUserInfo error.");
				});
			},
						
			formatDevice : function(callback){
				var command = "AF00145E" + getNextSeq() + repeat0(30);
				this.writeCommand(command,function(){
					formatDeviceCallback = callback;
				},function(){
					alert("formatDevice error.");
				});
			},
			
		});
		
		BC.bluetooth.UUIDMap["0000fee7-0000-1000-8000-00805f9b34fb"] = BC.OBandService;
		
		module.exports = BC;
	});
	
},false);