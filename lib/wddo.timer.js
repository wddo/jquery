/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.0
 * @since : 2016.10.20
 */

/*!
 * timer
 *
 * var instance = new Timer(options);
 *
 * @param options   ::: 설정 Object 값
 * options {
 *     loop : 반복 여부
 *     interval : 반복 간격
 *     callback : 반복 함수
 * }
 *
 * instance.setStart()                  - 시작
 * instance.setStop()                   - 정지
 */
var Timer = (function($) {
  var wddoObj = function(options) {
    var scope = this,
      defaults = {
        loop: true,
        interval: 5000,
        callback: undefined,
        params: undefined
      },
      opts = $.extend({}, defaults, options),
      timerId;

    function start() {
      timerId = setInterval(timeFun, opts.interval);
    }

    function stop() {
      if (timerId !== undefined) clearInterval(timerId);
    }

    function timeFun() {
      if (!opts.loop) stop();
      if (opts.callback !== undefined) opts.callback(opts.params);
    }

    this.setStart = function() {
      stop();
      start();
    };

    this.setStop = function() {
      stop();
    };
  };

  return wddoObj;
})(jQuery);
