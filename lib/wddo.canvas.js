/**
 *	var graph = new wArcGraph(data);
 *	var shadow = new wArcGraphShadow();
 *	var stage = new wArcGraphStage();
 *	
 *	var canvas = new WCanvas('canvasId', [
 *		{frame: 70, delay: 20, fun: shadow},
 *		{frame: 70, delay: 20, fun: graph},
 *		{frame: 30, delay: 0, fun: stage}
 *	]);
 *
 *	canvas.setRender();
 */

var WCanvas = (function () {
	var wddoObj = function (id, data) {
		var orgID = id,             //모체가될 canvas 아이디
			dataArr = data,         //외부에서 받은 [{frame:n, delay:n}, ..] 세트
			canvasArr,              //canvas 배열
			isBraek,                //올바르지 않은 대상
			currentFrame,           //현재 프레임 수
			maxFrame,               //총 루핑할 프레임수
			init = function () {
			   createCanvas();
			   initData();
			}();
		
		//데이터 초기화
		function initData() {
			var i, frame, delay;
			var max= 0;
			maxFrame = 0;
			currentFrame = 0;
			var data;
			
			for (i in dataArr) {
				data = dataArr[i];
				max = data.frame + data.delay
				
				//frame 와 delay 합쳐 총 루핑수 계산
				maxFrame = Math.max(maxFrame, max);
				
				//넘어온 객체들 초기화
				if (data.fun !== undefined && typeof data.fun.init === 'function') data.fun.init({canvas: canvasArr[i], frame: data.frame, delay: data.delay});
			}
		}
		
		//canvas 생성
		function createCanvas() {
			var target = $('#' + id);
			var container = target.closest('div');
			var w = target.attr('width');
			var h = target.attr('height');
			
			isBreak = !(container.length > 0 && target.parent().is('div') && dataArr !== undefined && dataArr.length !== 0);
			
			if (!isBreak) {
				//container.empty();
				if (target.filter(':hidden').length > 0) target.siblings('canvas').remove();
				target.css('display', 'none');
				canvasArr = [];
				
				var i;
				for (i in dataArr) {
					container.append('<canvas width='+w+' height='+h+'>'+target.html()+'</canvas>');
					
					canvasArr.push(container.find('canvas:last').get(0));
				}

				container.children().css({
					'position' : 'absolute',
					'left' : 0,
					'top' : 0 
				});
			} else {
				return;
			}
		}
		
		//루핑
		function enter() {            
			currentFrame += 1;
			
			//console.log(currentFrame);
			
			router();

			if (maxFrame > currentFrame) {
				requestAnimFrame(enter);    
			}
		}
		
		function router() {
			var i = 0;
			var data, frame, delay, fun;
			for (i in dataArr) {
				data = dataArr[i];
				
				frame = data.frame;
				delay = data.delay;
				fun = data.fun;
				
				if (currentFrame > delay && delay + frame >= currentFrame) {
					fun.render();
				}
			}
		}
		
		//공개 메소드
		this.setRender = function () {
			if (isBreak) return;
			
			requestAnimFrame(enter)
		};
		
		//canvas enterframe
		window.requestAnimFrame = (function(callback) {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		})();
	};
		
	return wddoObj;
}());