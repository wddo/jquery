/**
* Static variables for Mobile
*
* @author : Jo Yun Ki (wddoddo@gmail.com)
* @version : 1.1.3
* @since : 2015.12.01
*
* history
*   1.1   (2015.12.16) : docWidht, docHeight 속성 추가 
*   1.1.1 (2016.02.12) : enableTouchEvent, disableTouchEvent 을 setEnableEvent, setDisableEvent 로 변경
*   1.1.2 (2018.08.28) : setEnableEvent, setDisableEvent 내에 스크롤링 컨트롤 방식 변경
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

        setEnableEvent : function (bt) {
            var backgroundTarget = (bt === undefined) ? $('body') : bt;

            //스크롤링 활성화
            if (backgroundTarget.is('body')) { //add 1.1.2
                if (backgroundTarget.data('disabled-event') !== undefined) {
                    backgroundTarget.css({
                        position : '',
                        width : '',
                        height : ''
                    }).removeData('disabled-event');
                }
            } else {
                if (backgroundTarget.data('overflowY') !== undefined) {
                    backgroundTarget.css({
                        'overflow-y' : backgroundTarget.data('overflowY')
                    }).removeData('overflowY');
                }
            }

            //터치이벤트 한계체크 삭제
            backgroundTarget.off('touchstart.wddo touchmove.wddo');
        },

        setDisableEvent : function (st, bt) {
            var startY = 0;
            var scrollTarget;
            var backgroundTarget = (bt === undefined) ? $('body') : bt;

            //스크롤링 비활성화
            if (backgroundTarget.is('body')) { //add 1.1.2
                if (backgroundTarget.css('position') === 'fixed') return;

                backgroundTarget.data({
                    'disabled-event' : 'true'
                }).css({
                    position : 'fixed',
                    width : '100%',
                    height : '100%'
                });
            } else {
                if (backgroundTarget.css('overflow-y') === 'hidden') return;

                backgroundTarget.data({
                    'overflowY' : backgroundTarget.css('overflow-y')
                }).css({
                    'overflow-y' : 'hidden'
                });
            }

            //터치이벤트 한계체크
            backgroundTarget.on('touchstart.wddo', function (e) {
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                var target = $(e.target);
                var flag = (target.closest(st).length > 0);

                startY = touch.pageY;
                scrollTarget = (flag) ? $(st) : undefined;
            });

            backgroundTarget.on('touchmove.wddo', function (e) {
                if (scrollTarget !== undefined) {
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

                    var distance = touch.pageY - startY;    //이동거리
                    var max = maxScrollPos(scrollTarget);   //이동가능한 총 거리
                    var currentPos = getScrollTargetPos(scrollTarget); //현재 위치

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

            function getScrollTargetPos (target) {
                return target.scrollTop();
            }

            function maxScrollPos(target) {
                var target = typeof target == 'object' ? target : $(target);
                var max = getScrollMax(target);
                var pos = getScrollTargetPos(target);
                return max - pos;
            }
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
                if (callback !== undefined) callback();
            }});
        },

        isMoveScroll : function () {
            return target.filter(':animated').length > 0
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
        })
    })();

    scope.HNT = (scope.HNT !== undefined) ? Object.assign(HNT, scope.HNT) : HNT;
})(window);