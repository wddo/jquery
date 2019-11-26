/**
* Static variables for Mobile
*
* @author : Jo Yun Ki (wddoddo@gmail.com)
* @version : 1.1.1
* @since : 2015.12.01
*
* history
*   1.1 (2015.12.16) : docWidht, docHeight 속성 추가 
*   1.1.1 (2016.02.12) : enableTouchEvent, disableTouchEvent 을 setEnableEvent, setDisableEvent 로 변경
*/

(function (scope) {
    if (scope.WDDO !== undefined) return;

    var WDDO = {
        browserWidth : 0,
        browserHeight : 0,
        docWidht : 0,
        docHeight : 0,
        scrollYpos : undefined,

        setEnableEvent : function (bt) {
            var backgroundTarget = (bt === undefined) ? $('body') : bt;

            //스크롤링 활성화
            if (backgroundTarget.data('overflowY') !== undefined) {
                backgroundTarget.css({
                    'overflow-y' : backgroundTarget.data('overflowY')
                }).removeData('overflowY');
            }

            //터치이벤트 한계체크 삭제
            backgroundTarget.off('touchstart.WDDO touchmove.WDDO');
        },

        setDisableEvent : function (st, bt) {
            var startY = 0;
            var scrollTarget;
            var backgroundTarget = (bt === undefined) ? $('body') : bt;

            //스크롤링 비활성화
            if (backgroundTarget.css('overflow-y') === 'hidden') return;

            backgroundTarget.data({
                'overflowY' : backgroundTarget.css('overflow-y')
            }).css({
                'overflow-y' : 'hidden'
            });

            //터치이벤트 한계체크
            backgroundTarget.on('touchstart.WDDO', function (e) {
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                var target = $(e.target);
                var flag = (target.closest(st).length > 0);

                startY = touch.pageY;
                scrollTarget = (flag) ? $(st) : undefined;
            });

            backgroundTarget.on('touchmove.WDDO', function (e) {
                if (scrollTarget !== undefined) {
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

                    var distance = touch.pageY - startY;    //이동거리
                    var max = maxScrollPos(scrollTarget);   //이동가능한 총 거리
                    var currentPos = getScrollPositions(scrollTarget); //현재 위치

                    //console.log(distance, currentPos, max);
                    if (distance > 0 && currentPos <= 0 ) {
                        //console.log('over up');

                        if (e.cancelable) e.preventDefault();
                    } else if (distance < 0 && max <= 0) {
                        //console.log('over down');

                        if (e.cancelable) e.preventDefault();
                    } else {

                    }
                } else {
                    if (e.cancelable) e.preventDefault();   
                }
            });

            function getScrollMax (target) {
                return target.prop('scrollHeight') - target.prop('clientHeight');
            }

            function getScrollPositions (target) {
                return target.scrollTop();
            }

            function maxScrollPos(target) {
                var target = typeof target == 'object' ? target : $(target);
                var max = getScrollMax(target);
                var pos = getScrollPositions(target);
                return max - pos;
            }
        }
    };

    scope.WDDO = WDDO;
})(window);