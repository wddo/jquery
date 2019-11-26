/**
* Static variables for PC
*
* @author : Jo Yun Ki (wddoddo@gmail.com)
* @version : 1.1.2
* @since : 2015.12.01
*
* history
*   1.1.1 (2016.06.21) : moveScroll() 현재 스크롤 위치가 이동 위치와 같으면 이동 안하도록 막음 
*	1.1.2 (2018.06.08) : browserWidth, browserHeight, docWidht, docHeight 추가
*/

(function (scope) {
    if (scope.WDDO !== undefined) return;

	var WDDO = {
        browserWidth : 0,
        browserHeight : 0,
        docWidht : 0,
        docHeight : 0,
		scrollYpos : undefined,

		disableMouseWheel : function () {
			$(window).on('mousewheel.wddo',function (e) {
				e.preventDefault();
			});
		},

		enableMouseWheel : function () {
			$(window).off('mousewheel.wddo');
		},

		moveScroll : function (targetY) {
			if (WDDO.scrollYpos === targetY) return; //add 1.1.1

			$('html, body').stop().animate({
				scrollTop : targetY
			}, {queue: false, duration: 1000, easing: 'easeInOutQuart', complete: function () {
				WDDO.enableMouseWheel();
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
					visualDIVHeight = (opts.heightArr === undefined) ? $(this).outerHeight() : opts.heightArr[idx]; //각가의 비주얼 높이

					if (WDDO.scrollYpos < visualDIV.eq(0).offset().top + topHeight) {
					//최초 visual 보다 작은 경우
						onIdx = undefined;
						return false;
					} else if (visualYPos + visualDIVHeight + topHeight > WDDO.scrollYpos) {
						onIdx = idx;
						return false;
					}
				});

				//마지막
				if (WDDO.scrollYpos === $(document).height() - $(window).height()) {
					onIdx = visualDIV.length - 1;
				}
				
				callbackFunction(onIdx);
			}
		}
	};

    scope.WDDO = WDDO;
})(window);