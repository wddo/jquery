/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.2
 * @since : 2012.04.12
 */

/**
 * enterframe
 * 
 * var instance = new EnterFarme(arr, options);
 * 
 * @param target    ::: 적용할 jQuery 데이터
 * @param options   ::: 옵션 오브젝트
 * options {
 *      loop : 루핑 할지 유무
 *      fps : 프레임
 *      delay : 초기 시작 딜레이 & loop 반복 딜레이
 * }
 * 
 * instance.setStart()          - 시작
 * instance.setStop()           - 정지
 * instance.setSeek(n)          - 이동
 * instance.getData():Object    - 적용중인 jQuery 데이터 반환
 * 
 * instance.exComplete(function () {}); - 모션 완료
 */
var EnterFarme = (function () {
    var wddoObj = function (_target, options) {
        var scope = this,
            defaults = {
                loop : false,
                fps : 36,
                delay : 0
            },
            opts = $.extend(defaults, options),
            target = _target || [],
            isLoop = opts.loop,
            frameRate = opts.fps,
            delay = opts.delay,
            max = target.length,
            count = 0,
            timerId,            
            type,
            exComplete;

        function start() {
            if (max > 0 && target.jquery !== undefined) {
                timerId = setInterval(timeFun, (1000 / frameRate));
            }
        }
        
        function stop() {
            if (timerId !== undefined) clearInterval(timerId);
            if (exComplete != undefined && !isLoop) exComplete();
        }

        function seek(n) {
            target.filter(':not(":hidden")').css('display', 'none').end().eq(n).css('display', 'block');
        }
        
        function timeFun() {
            seek(count);

            count += 1;
            
            if (count > max - 1) {
                stop();
                
                if (isLoop) {
                    setTimeout(scope.setStart, delay);
                }
            }
        }

        this.setStart = function () {
            count = 0;
            stop();
            start();
        };
        
        this.setStop = function () {
            stop();
        };
        
        this.setSeek = function (n) {
            seek(n);
        };

        this.getData = function () {
            return target;
        };
        
        this.exComplete = function (f) {
            exComplete = f;
        };

    };

    return wddoObj;
}());