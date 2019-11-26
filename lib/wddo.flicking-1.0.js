/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.0
 * @since : 2014.08.01
 * 
 * Flicking
 * 
 * 1.0 (2014.08.01) : -
 * 
 * Jo Yun Ki에 의해 작성된 WFlicking 은(는) 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.
 * 이 라이선스의 범위 이외의 이용허락을 얻기 위해서는 wddoddo@gmail.com을 참조하십시오.
 * 
 */

/**
 * wflicking
 * 
 * dom 구조 : <div id="#flicking"><span></span></div>
 * 대상의 span 의 left 0~100%로 위치를 조정한다.
 * 
 * var instance = new WFlicking();
 * instance.init($('#flicking'), options);  //초기화
 * instance.reset();                        //리셋  
 * 
 * instance.exComplete(function () {});     //완료
 * 
 * @param target     ::: 적용할 <div><span> 구조의 대상
 * @param options    ::: 옵션
 * 
 * options object
 *  autoReset           //자동리셋 유무 [default: true]
 *  fastTime            //설정된 시간에 놓으면 빠른 터치 간주 [default: 150]
 *  areaSplit           //빠른 터치의 이동 거리를 위한 영역 등분 [default: 10]
 * 
 * css
 * 
 *  #flicking {
 *      background-color : grey;
 *      padding-right:50px;
 *  }
 * 
 *  #flicking span {
 *      background-color : red;
 *      position: relative;
 *      display: inline-block;
 *      width: 50px;
 *      height: 50px;
 *      left: 0%;
 *  }
 * 
 */
var WFlicking = (function ($) {
    var wddoObj = function () {
        var scope = this,
            opts,
            $target,
            $handler,
            defaultPos, touchPos, percent, touchDistance, areaDistance,
            time, timeId,
            isFast = false,
            exComplete, //완료 함수
            init = function () {
                addEvent();
            };

        function addEvent() {
            $handler.on('mousedown.flicking touchstart.flicking', function (e) {
                var evt = (e.type !== 'touchstart') ? e : event.touches[0]; 
                var margin = Math.floor($target.offset().left);
                
                areaDistance = $target.outerWidth() - $handler.outerWidth();
                defaultPos = Math.floor($handler.offset().left) - margin;
                touchPos = evt.pageX;
                isFast = true;

                $(document).on('mousemove.flicking touchmove.flicking', move);
                $(document).on('mouseup.flicking touchend.flicking', up);
                
                startTimeout();
                
                e.preventDefault();
            });
        }
        
        function timeFun() {
            isFast = false; 
        }
        
        function startTimeout() {
            stopTimeout();
            timeId = setTimeout(timeFun, opts.fastTime);
        }
        
        function stopTimeout() {
            if (timeId !== undefined) clearTimeout(timeId);
        }

        function up(e) {
            if ((areaDistance / opts.areaSplit) < touchDistance && isFast) percent = 100;
            
            $(document).off('.flicking');
            isFast = false;
            
            ani();
            
            e.preventDefault();
        }
        
        function move(e) {
            var evt = (e.type !== 'touchmove') ? e : event.touches[0]; 

            touchDistance = evt.pageX - touchPos;
            percent = Math.floor(getLinearFunction(0, areaDistance, 0, 100, defaultPos + touchDistance));
            
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            
            $handler.css('left', percent + '%');
            
            e.preventDefault();
        }
        
        function ani() {
            var pos = (percent > 50) ? 100 : 0;
            $handler.animate({
                'left' : pos + '%'
            }, {queue:false, duration:300, easing:'linear', complete:comp});
        }
        
        function comp() {
            if (percent > 50) {
                if (opts.autoReset) reset();
                if (exComplete !== undefined) exComplete();
            }; 
        }
        
        function reset() {
            $handler.css('left', 0 + '%');
        }
        
        /**
         * 1차함수
         * @param a ::: 값1의 최소값
         * @param b ::: 값1의 최대값
         * @param c ::: 값2의 최소값
         * @param d ::: 값2의 최대값
         * @param x ::: 값1의 현재값
         * @return   ::: 값2의 현재값 
         */
        function getLinearFunction(a, b, c, d, x) {
            return (d - c) / (b - a) * (x - a) + c;
        };

        this.init = function (target, options) {
            var defaults = {
                autoReset : false,  // 자동 리셋
                fastTime : 150,     //설정된 시간에 놓으면 빠른 터치 간주
                areaSplit : 10      //빠른 터치의 이동 거리를 위한 영역 등분
            };

            opts = $.extend(defaults, options);
            
            $target = target;
            $handler = $target.children();
            
            if ($target.length > 0 && $handler.length > 0) init();
        };
        
        this.reset = function () {
            reset();
        };
        
        this.exComplete = function (f) {
            exComplete = f;
        };
    };

    return wddoObj;
}(jQuery));