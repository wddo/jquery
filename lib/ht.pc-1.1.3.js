/**
* Static variables for PC
*
* @author : Jo Yun Ki (wddoddo@gmail.com)
* @version : 1.1.3
* @since : 2015.12.01
*
* history
*   1.1.1 (2016.06.21) : moveScroll() 현재 스크롤 위치가 이동 위치와 같으면 이동 안하도록 막음 
*   1.1.2 (2018.06.08) : browserWidth, browserHeight, docWidht, docHeight 추가
*   1.1.3 (2020.01.10) : moveScroll(), isMoveScroll(), checkScroll(), iframeSupport(), isIFrame, parentOffsetTop 추가, moveScroll()에 callback 인자 추가
*/

(function (scope) {
	var WDDO = {
		isIFrame: (function () { return parent !== window })(),
		parentOffsetTop: 0,
		browserWidth : 0,
		browserHeight : 0,
		docWidht : 0,
		docHeight : 0,
		scrollTop : undefined,
		
		changeScrollTop() {
			WDDO.scrollTop = (document.documentElement.scrollTop !== 0) ? document.documentElement.scrollTop : document.body.scrollTop;

			if (typeof WDDO.parentScrollTop !== 'undefined') WDDO.scrollTop = WDDO.parentScrollTop;

			return WDDO.scrollTop
		},

		disableMouseWheel : function () {
			$(window).on('mousewheel.wddo',function (e) {
				e.preventDefault();
			});
		},

		enableMouseWheel : function () {
			$(window).off('mousewheel.wddo');
		},

		moveScroll : function (targetY, speed, callback) {
			var spd = (speed !== undefined) ? speed : 1000;

			if (WDDO.isIFrame && WDDO.parent) {
				WDDO.parent.postMessage({scrollTop: targetY}, "*")
				return;
			}

			if (WDDO.scrollTop === targetY) return; //add 1.1.1

			$('html, body').stop().animate({
				scrollTop : targetY
			}, {queue: false, duration: spd, easing: 'easeInOutQuart', complete: function () {
				WDDO.enableMouseWheel();

				if (callback !== undefined) callback();
			}});

			WDDO.disableMouseWheel();
		},

		isMoveScroll : function () {
			return $('html, body').filter(':animated').length > 0
		},

		checkScroll : function (visualDIV, exceptionHeight, callbackFunction, options) {
			if ($('html, body').filter(':animated').length === 0) {
				var defaults = {
					yArr : undefined,
					heightArr : undefined
				};

				var opts = $.extend(defaults, options);

				var topHeight = exceptionHeight;
				var onIdx = undefined;
		
				//각각
				var visualYPos, visualDIVHeight;
				visualDIV.each(function (idx) {
					visualYPos = (opts.yArr === undefined) ? $(this).offset().top : opts.yArr[idx];  //각각의 비주얼 Y 위치
					visualDIVHeight = (opts.heightArr === undefined) ? $(this).outerHeight() : opts.heightArr[idx]; //각각의 비주얼 높이

					if (WDDO.scrollTop < visualDIV.eq(0).offset().top + topHeight) {
					//최초 visual 보다 작은 경우
						onIdx = undefined;
						return false;
					} else if (visualYPos + visualDIVHeight + topHeight > WDDO.scrollTop) {
						onIdx = idx;
						return false;
					}
				});

				//마지막
				if (WDDO.scrollTop !== 0 && WDDO.scrollTop === $(document).height() - window.innerHeight) {
					onIdx = visualDIV.length - 1;
				}
				
				callbackFunction(onIdx);
			}
		}
	};

	//iframe 대응
	(function iframeSupport() {
		scope.addEventListener('message', function (e) {
			if (WDDO.parent === undefined) WDDO.parent = e.source;
			
			if (typeof e.data.offsetTop !== 'undefined') WDDO.parentOffsetTop = e.data.offsetTop
			if (typeof e.data.scrollTop !== 'undefined') WDDO.parentScrollTop = e.data.scrollTop

			$(scope).triggerHandler('scroll');
			$(scope).triggerHandler('scroll.viewport');
		})
	})();

	scope.WDDO = (scope.WDDO !== undefined) ? Object.assign(WDDO, scope.WDDO) : WDDO;
})(window);