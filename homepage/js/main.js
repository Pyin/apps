windowWidth = window.screen.availWidth;
windowHeight = window.screen.availHeight;
var n = 0;
var moveInterval = null;

$(function(){
    var slide_wrapper = document.getElementById('slide_wrapper');
    var navi_wrapper = document.getElementById('navi_wrapper');
    var startx = null;
    slide_wrapper.addEventListener('touchstart',function(event){
    	var myDate = new Date();
    	secs = myDate.getMilliseconds();
    	// mils = myDate.getMilliseconds();
    	clearInterval(moveInterval);
    	startx = 0
        startx = event.touches[0].pageX;
    });
    document.getElementById('slide_wrapper').addEventListener('touchmove',function(event){
     movex = event.touches[0].pageX;
     slide_wrapper.style.left = (-((windowWidth*0.65)*n) + windowWidth*0.1 + (movex-startx)) + "px";
     $("#text_wrapper").css({'opacity':0.2})
    });
    var sw_li = document.getElementById('slide_wrapper').getElementsByTagName('li');
    slide_wrapper.addEventListener('touchend',function(event){
    	var myDate = new Date();
    	sece = myDate.getMilliseconds();
    	// mile = myDate.getMilliseconds();

        endx = event.changedTouches[0].pageX;
    
        var deltax = endx - startx;
        if(sece<=secs){
        	sece = sece + 1000
        }

    	var v = deltax / (sece - secs)

    	if((-2.5<=v)&&(v<=2.5)){
	    	if((Math.abs( deltax ) < 0.20*windowWidth) && (Math.abs( deltax ) > -0.20*windowWidth)) {
	        	$("#text_wrapper").animate({opacity:1});
	            $("#slide_wrapper").animate({
	        	 	left: (-((windowWidth*0.65)*n) + windowWidth*0.1)
	        	 },20);
	        }
	        else if(((-(windowWidth*0.65*n) + deltax) >= windowWidth*0.1 )&&(n==0)){
	        	$("#text_wrapper").animate({opacity:1});
	        	 $("#slide_wrapper").animate({
	        	 	left: (-((windowWidth*0.65)*n) + windowWidth*0.1)
	        	 },300);
	        }
	        else if((-windowWidth*0.65*n + deltax)<(-windowWidth*0.65*(sw_li.length-1))&&(n==(sw_li.length-1))){
	        	$("#text_wrapper").animate({opacity:1});
	        	$("#slide_wrapper").animate({
	        	 	left: (-((windowWidth*0.65)*n) + windowWidth*0.1)
	        	 },300);
	        }
	        else{
	            if ( deltax > 0 ) {
	                //move right
	                slide.moveRight();
	                
	            }else{
	                //move left
	                slide.moveLeft();
	            }
	        }
    	}
        else{
        	if(v<0){
        		v = Math.round(v) + 2
        		$("#slide_wrapper").children("li:eq("+n+")").removeClass("active")
				$("#text_wrapper").children("li:eq("+n+")").removeClass("active")
				$("#navi_wrapper").children("li:eq("+n+")").removeClass("active")
				if((n-v)>=(sw_li.length-1)){
					v = n - (sw_li.length-1)
				}
				$("#slide_wrapper").animate({
					left: -((windowWidth*0.65)*(n-v))+windowWidth*0.1
				},-300*v);
				$("#text_wrapper").css({
					'left': -windowWidth*(n-v)
				}).animate({
					opacity:1
				},-300*v);
				$("#navi_wrapper").animate({
					left: -windowWidth*5/36*(n-v) + windowWidth*(5/12)
				},-300*v);
				n = n - v;
				$("#slide_wrapper").children("li:eq("+n+")").addClass("active")
				$("#text_wrapper").children("li:eq("+n+")").addClass("active")
				$("#navi_wrapper").children("li:eq("+n+")").addClass("active")
        	}
        	else{
        		v = Math.round(v) - 2
        		$("#slide_wrapper").children("li:eq("+n+")").removeClass("active")
				$("#text_wrapper").children("li:eq("+n+")").removeClass("active")
				$("#navi_wrapper").children("li:eq("+n+")").removeClass("active")
				if((n-v)<=0){
					v = n;
				}
				$("#slide_wrapper").animate({
					left: -((windowWidth*0.65)*(n-v))+windowWidth*0.1
				},300*v);
				$("#text_wrapper").css({
					'left': -windowWidth*(n-v)
				}).animate({
					opacity:1
				},300*v);
				$("#navi_wrapper").animate({
					left: -windowWidth*5/36*(n-v) + windowWidth*(5/12)
				},300*v);
				n = n - v;
				$("#slide_wrapper").children("li:eq("+n+")").addClass("active")
				$("#text_wrapper").children("li:eq("+n+")").addClass("active")
				$("#navi_wrapper").children("li:eq("+n+")").addClass("active")
        	}
        }
    });
    
    navi_wrapper.addEventListener('touchstart',function(event){
    	clearInterval(moveInterval);
        startx = 0
        startx = event.touches[0].pageX;
    });
    navi_wrapper.addEventListener('touchmove',function(event){
     movex = event.touches[0].pageX;
     $("#text_wrapper").css({'opacity':0.2})
     navi_wrapper.style.left = (-windowWidth*5/36*n + windowWidth*(5/12) + (movex-startx)) + "px";
     slide_wrapper.style.left = ((windowWidth*0.65)*(-n+((movex-startx)/(windowWidth*5/36))) - windowWidth*0.1) + "px";
    });
    var nw_li = document.getElementById('navi_wrapper').getElementsByTagName('li');
    navi_wrapper.addEventListener('touchend',function(event){
        endx = event.changedTouches[0].pageX;
    
        var deltax = endx - startx;
        $("#slide_wrapper").children("li:eq("+n+")").removeClass("active")
        $("#text_wrapper").children("li:eq("+n+")").removeClass("active")
		$("#navi_wrapper").children("li:eq("+n+")").removeClass("active")
		n = n - Math.round(deltax/(windowWidth*5/36))
        if((-windowWidth*5/36*n + deltax)>0){
	    	n = 0
	    	$("#slide_wrapper").animate({
				left: -((windowWidth*0.65)*n)+windowWidth*0.1
			},300);
			$("#text_wrapper").css({
				'left': -windowWidth*n,'opacity':1
			});
			$("#navi_wrapper").animate({
				left: -windowWidth*5/36*n + windowWidth*(5/12)
			},300);
	    }
	    if((-windowWidth*5/36*n + deltax)<(-windowWidth*5/36*nw_li.length)){
	    	n=nw_li.length-1
	    	$("#slide_wrapper").animate({
				left: -((windowWidth*0.65)*n)+windowWidth*0.1
			},300);
			$("#text_wrapper").css({
				'left': -windowWidth*n,'opacity':1
			});
			$("#navi_wrapper").animate({
				left: -windowWidth*5/36*n + windowWidth*(5/12)
			},300);
	    }
	    else{

			$("#slide_wrapper").animate({
					left: -((windowWidth*0.65)*n)+windowWidth*0.1
				},300);
			$("#text_wrapper").css({
				'left': -windowWidth*n,'opacity':1
			});
			$("#navi_wrapper").animate({
				left: -windowWidth*5/36*n + windowWidth*(5/12)
			},300);
	    }
    	
		$("#slide_wrapper").children("li:eq("+n+")").addClass("active")
        $("#text_wrapper").children("li:eq("+n+")").addClass("active")
		$("#navi_wrapper").children("li:eq("+n+")").addClass("active")
    });
    
    
    
	slide.init();
});

// change current state
var slide = {
	
	init: function(){
		slide.setGrid();
	},
	
	moveLeft: function(){
		slide.getCurrentIndex( "left" );
	},
	
	moveRight: function(){
		slide.getCurrentIndex( "right" );
	},
	
	getCurrentIndex: function( type ){
		var currentImg = $("#slide_wrapper").children(".active").index();
		var currentText = $("#text_wrapper").children(".active").index();
		var currentNavi = $("#navi_wrapper").children(".active").index();

		if( type == "left" ){
			slide.moveAnimation(currentImg, currentText, currentNavi, "left");
		}else{
			slide.moveAnimation(currentImg, currentText, currentNavi, "right");
		}
	},
	
	moveAnimation: function(currentImg, currentText, currentNavi, type){
		mainImgLength = $("#slide_wrapper").children("li").size();
		textLength = $("#text_wrapper").children("li").size();
		navImgLength = $("#navi_wrapper").children("li").size();
		if( type == "left" ){
			if(currentImg != mainImgLength-1){
			n++;
				$("#slide_wrapper").children("li:eq("+currentImg+")").removeClass("active")
								.next("li").addClass("active");
				$("#text_wrapper").children("li:eq("+currentImg+")").removeClass("active")
								.next("li").addClass("active");
				$("#navi_wrapper").children("li:eq("+currentNavi+")").removeClass("active")
								.next("li").addClass("active");
				$("#slide_wrapper").animate({
					left: -((windowWidth*0.65)*(currentImg+1))+windowWidth*0.1,
					
				},300);
				$("#text_wrapper").css({
					'left': (-windowWidth*(currentImg+1))
				}).animate({
					opacity:1
				},300);
				$("#navi_wrapper").animate({
					left: (-windowWidth*5/36*(currentImg+1) + windowWidth*(5/12)) + "px"
				},300);
			}
		}else{
			if( currentImg != 0 ){
			n--;
				$("#slide_wrapper").children("li:eq("+currentImg+")").removeClass("active")
								.prev("li").addClass("active");
				$("#text_wrapper").children("li:eq("+currentImg+")").removeClass("active")
								.prev("li").addClass("active");
				$("#navi_wrapper").children("li:eq("+currentNavi+")").removeClass("active")
								.prev("li").addClass("active");
				$("#slide_wrapper").animate({
					left: -((windowWidth*0.65)*(currentImg-1))+windowWidth*0.1,
					
				},300);
				$("#text_wrapper").css({
					'left': -windowWidth*(currentImg-1)
				}).animate({
					opacity:1
				},300);
				$("#navi_wrapper").animate({
					left: -windowWidth*5/36*(currentImg-1) + windowWidth*(5/12)
				},300);
			}
		}
	},
	
	setGrid: function(){
		$("body").css("height",windowHeight);

		$(".header").css({"height":windowHeight*0.10,'line-height':windowHeight*0.10+"px"});
		$(".search_icon").css({"width":windowWidth*(1/7)});
		$(".title").css({"width":windowWidth*(5/7)});
		$(".settings").css({"width":windowWidth*(1/7)});
		
		$(".content").css("height",windowHeight*0.90);
		$(".slide_box").css({"height":windowWidth*0.5,"margin-top":(windowHeight-windowWidth)*0.4+"px"});
		$("#slide_wrapper").css({"left":windowWidth*0.10} );
		$("#slide_wrapper li").css({"width":windowWidth*0.5,"margin-left":windowWidth*0.15});

		$("#text_wrapper li").css({"width":windowWidth,"height":windowHeight*0.13});
		$("#text_wrapper").css({"margin-top":windowHeight*0.05});
		$(".text_box").css({"height":windowHeight*0.18});

		$(".navi_box").css({"height":windowHeight*0.18})
		$("#navi_wrapper").css({"left":windowWidth*(5/12),"height":windowWidth*(5/36),"margin-top":windowHeight*0.02});
		$("#navi_wrapper li").css({"width":windowWidth*(1/9),"height":windowWidth*(1/9),
									"margin-left":windowWidth*(1/36),
								});
	},
	
};
