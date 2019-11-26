/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.0.1
 * @since : 2017.04.27
 *
 * history
 *
 * 1.0   (2017.04.27) : -
 * 1.0.1 (2017.06.02) : ins.update() 외부 함수 추가하여 수동 상태체크 가능 하도록 처리 (scroll 에 대한 trigger 사용안함)
 *                      opts.firstCheck 를 opts.initUpdate 로 변경
 *
 ********************************************************************************************
 ************************************** WScrollStatus ***************************************
 ********************************************************************************************
 *
 * var instance = new WScrollStatus();
 * instance.init(options);                  //초기화
 *
 * @param options    ::: 설정 Object 값
 *
 * options
 *   namespace:String = ''           //scroll 이벤트 중복 방지를 위한 네임스페이스 'scroll.scrollstatus' + namespace
 *   top:Number = 2                  //ios 아래서 위로 올릴때 소프키 등장으로 처음 한계를 0 이 아닌 높이 지정
 *   frameRate:Number = 'li'         //timer 속도
 *   initUpdate:Boolean = false      //처음 window.load 시 체크 할지 유무
 *   exChange:Function = fun(event)  //변경시 발생될 함수
 *
 * method
 *   .update()                       //모두 닫기
 *
 */
var WScrollStatus = (function($) {
  var wddoObj = function(options) {
    var scope,
      status,
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
        if (opts.initUpdate) {
          oldScrollYpos = 0;
          scope.update();
        }

        initEvent();
      };

    function getDefaultOption() {
      return {
        namespace: "",
        top: 2,
        frameRate: 36,
        initUpdate: false,
        exChange: undefined
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
        .on("resize.scrollstatus" + opts.namespace, function(e) {
          //check()에서 높이를 체크할 수 없는 이유 : ios 상(주소), 하(소프트키) 영역 늘었다 줄었다 하였을때 resize 이벤트 끝에 1번 발생한다
          //scroll 이벤트는 늘었다 줄었다 하는 과정에서 7~10회 발생하므로 'up'상태인데 브라우저 사이즈 때문에 'down' 발생하는 문제있어 높이를 여기서 변경시 1회 체크함
          browserHeight = window.innerHeight;
        })
        .triggerHandler("resize.scrollstatus");

      $(window)
        .on("scroll.scrollstatus" + opts.namespace, function(e) {
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
      scrollYpos =
        document.documentElement.scrollTop !== 0
          ? document.documentElement.scrollTop
          : document.body.scrollTop;
      /*browserHeight = window.innerHeight;  */
      scrollMax = $("html").get(0).scrollHeight - browserHeight;

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

        scope = this;

        init();
      },

      update: function() {
        isScrolling = true;
        check();
      }
    };
  };

  return wddoObj;
})(jQuery);
