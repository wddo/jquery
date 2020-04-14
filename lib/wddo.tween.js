/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.2
 * @since : 2012.04.05
 *
 * WTween.slide($obj[0], 1000, {margin:"left", delay:100});
 * WTween.to($obj[0], 600, {y:20, alpha:1, delay:900});
 * WTween.from($obj[0], 600, {y:-20, alpha:0, delay:900});
 */

var WTween = (function ($) {
	return {
		/*
		* 슬라이드 모션
		* 
		* - 인자값
		* obj : div element
		* speed : 속도 1000 = 1초
		* data : 속성
		* - margin : 방향 top, bottom, left, right
		* - alpha : 투명도
		* - delay : 딜레이 1000 = 1초
		* - ease : 제이쿼리 easing plugin 문자열, 기본값: easeOutQuart
		* - complete : 완료후 실행할 함수
		* 
		* - 설명
		* 구조는 div(마스크용) - div(모션용) - img 형태이며 최하위 img 크기에 맞게 상위 두div 크기가 픽스되며 마스크용 div는 overflow 가 hidden 된다.
		* * 주의 할점은 img를 조정할시에 ie 7 과 8이 alpha 조정하는 png가 문제가 된다.
		* ex) WTween.slide($obj[0], 1000, {margin: "left", delay: 100});
		*/
		slide: function (elm, speed, data) {
			var $obj = $(elm),			//오브젝트
				speed = speed,			//속도
				margin = data.margin,	//시작 방향
				alpha = data.alpha,		//투명도
				delay = data.delay,		//딜레이
				ease = data.ease,		//이징
				onComp = data.complete; //완료
	
			if (ease == undefined) ease = 'easeOutQuart';
	
			if ($obj.is('div') || $obj.is('span') || $obj.is('p')) {
				var $img = $obj.children().eq(0),	//img 일수도 있고 div 일수도 있다.
					defaultValue,					//디폴트 값
					dx = parseInt($img.css('marginLeft')),
					dy = parseInt($img.css('marginTop')),
					da = $img.css('opacity');
					
				if (isNaN(dx)) dx = 0;
				if (isNaN(dy)) dy = 0;
	
				//init
				$obj.css('overflow', 'hidden');		//마스크용
				
				if (margin != undefined) {
					var param = this.isTweenCSSParam(margin).param,			//넓이 & 높이
						position = this.isTweenCSSParam(margin).position,	//조정할 속성
						direct = this.isTweenCSSParam(margin).direct;		//방향
					
					defaultValue = parseInt($obj.css(position));
					
					//div fit
					var value;
					if ($obj.find('img').length != 0) {
						value = parseInt($obj.find('img').css(param));
					} else {
						value = parseInt($obj.find('div').css(param));
					}
					
					$obj.css(param, value).find('div').css(param, value);	//div 전부 크기 img와 동일하게
				
					//from
					$img.css(position, value * direct);
				}
	
				//from
				if(alpha != undefined)$img.css('opacity', alpha);
	
				//delay
				var timeId = setTimeout(function () {fun();}, delay);

				//animate
				function fun(){
					switch(position){
						case 'marginLeft' :
							$img.stop().animate({'marginLeft': defaultValue, 'opacity': da}, {queue: false, duration: speed, easing: ease, complete: comp});
							break;
						case 'marginTop' :
							$img.stop().animate({'marginTop': defaultValue, 'opacity': da}, {queue: false, duration: speed, easing: ease, complete: comp});
							break;
						default :
					}
					
					function comp(){
						if (onComp != undefined) onComp();
					}
				}//end fun
			}//end if
		},
	
		//방향에 따른 조정 파라미터를 반환
		isTweenCSSParam: function (value) {
			var css = {};
			
			if (value == 'left' || value == 'right') css.param = 'width';
			if (value == 'top' || value == 'bottom') css.param = 'height';
			if (value == 'left' || value == 'right') css.position = 'marginLeft';
			if (value == 'top' || value == 'bottom') css.position = 'marginTop';
			if (value == 'left' || value == 'top') css.direct = -1;
			if (value == 'right' || value == 'bottom') css.direct = 1;
	
			if (value == 'x') css.position = 'marginLeft';
			if (value == 'y') css.position = 'marginTop';
	
			return css;
		},
	
		/*
		* 이동 모션(~ 까지)
		* 
		* - 인자값
		* obj : div element
		* speed : 속도 1000 = 1초
		* data : 속성
		* - x : 시작 x 거리
		* - y : 시작 y 거리
		* - alpha : 투명도
		* - delay : 딜레이 1000 = 1초
		* - ease : 제이쿼리 easing plugin 문자열, 기본값: easeOutQuart
		* - complete : 완료후 실행할 함수
		* 
		* - 설명
		* 구조는 div(모션용) - img 형태이다.
		* 주의 할점은 img를 조정할시에 ie 7 과 8이 alpha 조정하는 png가 문제가 된다.
		* ex) wddoTween.from($obj[0], 600, {y: -20, alpha: 0, delay: 900});
		*/
		to: function (elm, speed, data) {
			var $obj = $(elm),			//오브젝트
				speed = speed,			//속도
				data = data,			//데이터
				x = data.x,				//x
				y = data.y,				//y
				alpha = data.alpha,		//투명도
				delay = data.delay,		//딜레이
				ease = data.ease,		//이징
				onComp = data.complete;	//완료
	
			if (ease == undefined) ease = 'easeOutQuart';
	
			if ($obj.is('div') || $obj.is('img')) {
				var dx = parseInt($obj.css('marginLeft')),
					dy = parseInt($obj.css('marginTop')),
					da = $obj.css('opacity');
					
				if (isNaN(dx)) dx = 0;
				if (isNaN(dy)) dy = 0;
	
				//delay
				var timeId = setTimeout(function (){fun();}, delay);

				//animate
				function fun(){
					$obj.animate({'marginLeft': x , 'marginTop': y , 'opacity': alpha}, {queue: false, duration: speed, easing: ease, complete: comp});
					
					function comp(){
						if (onComp != undefined) onComp();
					}
				}//end fun
			}//end if
		},
	
		/*
		* 이동 모션(~ 부터)
		* 
		* - 인자값
		* obj : div element
		* speed : 속도 1000 = 1초
		* data : 속성
		* - x : 시작 x 거리
		* - y : 시작 y 거리
		* - alpha : 투명도
		* - delay : 딜레이 1000 = 1초
		* - ease : 제이쿼리 easing plugin 문자열, 기본값: easeOutQuart
		* - complete : 완료후 실행할 함수
		* 
		* - 설명
		* 구조는 div(모션용) - img 형태이다.
		* 주의 할점은 img를 조정할시에 ie 7 과 8이 alpha 조정하는 png가 문제가 된다.
		* ex) wddoTween.from($obj[0], 600, {y: -20, alpha: 0, delay: 900});
		*/
		from: function (elm, speed, data) {
			var $obj = $(elm),			//오브젝트
				speed = speed,			//속도
				data = data,			//데이터
				x = data.x,				//x
				y = data.y,				//y
				alpha = data.alpha,		//투명도
				delay = data.delay,		//딜레이
				ease = data.ease,		//이징
				onComp = data.complete;	//완료
	
			if (ease == undefined) ease = 'easeOutQuart';
	
			if ($obj.is('div') || $obj.is('img')) {
				var dx = parseInt($obj.css('marginLeft')),
					dy = parseInt($obj.css('marginTop')),
					da = $obj.css('opacity');
					
				if (isNaN(dx)) dx = 0;
				if (isNaN(dy)) dy = 0;
	
				//from
				if (x != undefined) $obj.css('marginLeft', dx + x);
				if (y != undefined) $obj.css('marginTop', dy + y);
				if (alpha != undefined) $obj.css('opacity', alpha);
	
				//delay
				var timeId = setTimeout(function () {fun();}, delay);
	
				//animate
				function fun(){
					$obj.animate({'marginLeft': dx, 'marginTop': dy, 'opacity': da}, {queue: false, duration: speed, easing: ease, complete: comp});
					
					function comp(){
						if (onComp !== undefined) onComp();
					}
				}//end fun
			}//end if
		}
	};//end return
}(jQuery));
