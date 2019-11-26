/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.0.0
 * @since : 2017.04.27
 *
 * history
 *
 * 1.0 (2017.04.27) : -
 *
 *
 ********************************************************************************************
 ************************************** WScrollStatus ***************************************
 ********************************************************************************************
 *
 * var instance = new WScrollStatus();
 *
 * scroll(function () {
 *     var status = instance.getStatus(scrollYpos); // 상태 반환
 * });
 *
 * trigger : $(window).tirggerHandler('scroll.scrollstatus' + namespace);
 *
 */
var WScrollStatus = (function($) {
  var wddoObj = function(options) {
    var status,
      distance,
      timerId,
      oldScrollYpos,
      scrollYpos,
      scrollMax,
      browserHeight,
      isScrolling, //터치를 때고 스크롤이 이동중이면 true
      opts,
      defaults = getDefaultOption(),
      init = function() {
        if (opts.firstCheck) oldScrollYpos = 0;

        initEvent();
      };

    function getDefaultOption() {
      return {
        namespace: "", //scroll 이벤트 중복 방지를 위한 네임스페이스
        top: 2, //ios 아래서 위로 올릴때 소프키 등장으로 처음 한계를 0 이 아닌 높이 지정
        frameRate: 36, //timer 속도
        firstCheck: false, //처음 window.load 시 체크 할지 유무
        exChange: undefined //변경시 발생될 함수
      };
    }

    function start() {
      stop();
      timerId = setInterval(timeFun, 1000 / opts.frameRate);
    }

    function stop() {
      if (timerId !== undefined) clearInterval(timerId);
    }

    function timeFun() {
      check();
    }

    function initEvent() {
      $(window)
        .on("scroll.scrollstatus" + opts.namespace, function(e) {
          scrollYpos =
            document.documentElement.scrollTop !== 0
              ? document.documentElement.scrollTop
              : document.body.scrollTop;
          browserHeight = window.innerHeight;
          scrollMax = $("html").get(0).scrollHeight - browserHeight;

          if (isScrolling) check();
        })
        .triggerHandler("scroll.scrollstatus" + opts.namespace);

      //터치 시작 : timer 를 이용한 fps check();
      $("html, body").on("touchstart", function(e) {
        isScrolling = false;

        start();
      });

      //터치 끝 : scroll 이벤트를 이용한 check(); (setInterval 부하를 줄이기 위함)
      $("html, body").on("touchend", function(e) {
        isScrolling = true;

        stop();
      });
    }

    function check() {
      if (scrollYpos <= opts.top) {
        //최상단 이하(ios)
        isScrolling = false;
        status = "up";
        distance = 0;
      } else if (scrollYpos >= scrollMax) {
        //최하단 이상(ios)
        isScrolling = false;
        status = "down";
        distance = 0;
      } else {
        distance = oldScrollYpos - scrollYpos;

        if (distance > 0) {
          status = "up";
        } else if (distance < 0) {
          status = "down";
        } else {
          status = undefined;
        }

        oldScrollYpos = scrollYpos;
      }

      if (opts.exChange !== undefined)
        opts.exChange({
          distance: distance,
          direct: status,
          scrolling: isScrolling
        });
    }

    return {
      init: function(options) {
        opts = $.extend({}, defaults, options);

        init();
      }
    };
  };

  return wddoObj;
})(jQuery);
