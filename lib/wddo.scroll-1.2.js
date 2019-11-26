/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.2
 * @since : 2014.04.01
 *
 * history
 *
 * 1.0 (2014.04.01) : -
 * 1.1 (2014.07.21) : addTo 옵션 추가, 컨텐츠 mousewheel 이벤트 적용(http://brandonaaron.net :: jquery.mousewheel.js 필요)
 * 1.2 (2014.07.23) : scollTo 생성, $content 안에 a 태그 focusin 시 스크롤바 위치 변경(레이아웃 깨짐 방지)
 *
 * Jo Yun Ki에 의해 작성된 WScroll은(는) 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.
 * 이 라이선스의 범위 이외의 이용허락을 얻기 위해서는 wddoddo@gmail.com을 참조하십시오.
 *
 */

/**
 * wscroll
 *
 * css로 스크롤바의 총길이 외엔 모두 지정, 총길이는 container 높이에 맞게 생성되며 options 의 scrollMargin 으로 조절
 * 스크롤 바의 dom 구조 : <div id='wsCon'><div id='wsBar'></div></div>
 *
 * var instance = new WScroll();
 *
 * var scroll = instance.init($(window), $act, {scrollMargin: 50 + 70, contentMargin: 39}); // 초기화.. 스크롤 디자인 css 적용 용의 #wsCon 반환
 * instance.reset($(window), $act, options); //새로운 대상으로 적용.. 변화 없으면 인자 생략 가능
 * instance.change(); //휠 변화에 대하여 호출
 * instance.scrollTo(ypos); //외부에서 스크롤 위치 조정
 *
 * instance.exChange(function () {}); - 스크롤 이동시 발생
 *
 * scroll.css({
 *      'backgroundColor' : 'rgba(0, 0, 0, .20)',
 *      'width' : 8 + 'px',
 *      'top' : 70 + 'px',
 *      'right' : 8 + 'px',
 *      'border-radius' : 4 + 'px'
 * });
 *
 * scroll.children().css({
 *      'backgroundColor' : 'rgba(0, 0, 0, .30)',
 *      'top' : '0px',
 *      'border-radius' : 4 + 'px'
 * });
 *
 * @param container     ::: 스크롤링 element의 부모 element, 페이지 전체 적용시 $(window) 가 될 수도 있음
 * @param content       ::: 스클롤링 element
 * @param options       ::: 오브젝트 형태의 callback 을 받을 수 있는 함수 집합
 *
 * options object
 *  addTo          - 스크롤 바의 dom을 추가할 위치
 *  contentMargin  - 스크롤 대상의 추가 +- 여백값
 *  scrollMargin   - 스크롤의 추가 +- 여백값
 */
var WScroll = (function($) {
  var wddoObj = function() {
    var scope = this,
      opts,
      $contentContainer,
      $content,
      $barContainer,
      $bar,
      sh, //scroll 높이
      bh, //bar 높이
      ch, //content 높이
      cm, //content 남은 공간
      sm, //scroll 남은 공간
      ct, //content top 위치
      st, //scroll top 위치
      exChange, //스크롤 이동시 발생 함수
      init = function() {
        create();
        addEvent();
        resize();
      };

    function create() {
      if ($("#wsCon").length !== 0) return false;

      opts.addTo.append('<div id="wsCon"><div id="wsBar"></div></div>');

      $barContainer = $("#wsCon");
      $barContainer.css({
        position: "absolute",
        "z-index": 840212
      });

      $bar = $barContainer.children();
      $bar.css({
        top: "0px",
        cursor: "pointer"
      });
    }

    function addEvent() {
      var dPageY, dBarY;

      // 드래그
      $bar.on("mousedown.wscroll", function(e) {
        var target = $(e.currentTarget);

        $(document).on("mouseup.wscroll", mouseUpHandler);
        $(document).on("mousemove.wscroll", mouseMoveHandler);

        dPageY = e.pageY;
        dBarY = parseInt($bar.css("marginTop"));
      });

      function mouseUpHandler(e) {
        dPageY = undefined;
        dBarY = undefined;
        $(document).off(".wscroll");
      }

      function mouseMoveHandler(e) {
        var target = $(e.currentTarget);

        var moveDistance = dBarY + (e.pageY - dPageY); //끌어온 크기 0 ~
        scrollTo(moveDistance);

        e.preventDefault();
      }

      opts.addTo.on("mousewheel.wscroll", function(e, delta) {
        var target = $(e.currentTarget);

        dBarY = parseInt($bar.css("marginTop")); // 바 위치 재정의

        var moveDistance = dBarY + Math.round(ch * 0.1) * -delta; //한번에 스크롤에 크기
        scrollTo(moveDistance);

        e.preventDefault();
      });

      $content.on("focusin.wscroll", "a", function(e) {
        var target = $(e.currentTarget);

        var value = Math.floor(
          getLinearFunction(0, cm, 0, sm, target.position().top)
        );

        scrollTo(value);
      });
    }

    //스크롤 이동
    function scrollTo(ypos) {
      if (sh > bh) {
        if (ypos < 0) ypos = 0;
        if (ypos > sh - bh) ypos = sh - bh;

        var value = Math.floor(getLinearFunction(0, sm, 0, cm, ypos));

        $content.css("top", -value);

        scope.change();
      }
    }

    //레이아웃 변경시 실행해야하는 함수
    function resize() {
      //console.log('resize');

      //스크롤 전체 높이 정의.. 컨텐츠 높이 == 스크롤 전체높이
      sh = $contentContainer.height() + opts.scrollMargin;
      $barContainer.css("height", sh);

      //컨첸츠 높이 정의
      ch = $content.outerHeight() + opts.contentMargin;

      //바높이 정의
      bh = Math.floor(
        getLinearFunction(0, ch, 0, sh, $contentContainer.height())
      );
      $bar.css("height", bh);

      //숨김 유무
      toggle(sh > bh);
    }

    //스크롤바 위치 변경 함수
    function change() {
      //console.log('change');

      cm =
        $content.outerHeight() +
        opts.contentMargin -
        $contentContainer.height();
      sm = sh - bh;
      ct = Math.abs(Math.floor(parseInt($content.css("top"))));

      var value = Math.floor(getLinearFunction(0, cm, 0, sm, ct));
      $bar.css("marginTop", value);

      //바가 여유 영역을 넘어가면
      st = parseInt($bar.css("marginTop"));
      if (st > sh - bh) st = sh - bh;
      $bar.css("marginTop", st);

      if (exChange != undefined) exChange();
    }

    function toggle(is) {
      if ($contentContainer !== undefined)
        $barContainer.css("display", is ? "block" : "none");
    }

    function dispose() {
      $contentContainer.remove();

      if (opts.addTo !== undefined) opts.addTo.off(".wscroll");
      $content.off(".wscroll");
      $bar.on(".wscroll");

      opts = undefined;
      $contentContainer = undefined;
      $content = undefined;
      $bar = undefined;
      $barContainer = undefined;
    }

    this.init = function(container, content, options) {
      var defaults = {
        addTo: $("body"),
        contentMargin: 0, // 컨텐츠 높이 +- 값
        scrollMargin: 0 // 스크롤 높이 +- 값
      };

      $contentContainer = container;
      $content = content;
      $content.css("top", 0);

      opts = $.extend(defaults, options);

      if ($content !== undefined && $content.length > 0) init();

      return $barContainer;
    };

    this.reset = function(container, content, options) {
      if (container !== undefined) $contentContainer = container;
      if (content !== undefined) $content = content;
      if (options !== undefined) opts = $.extend(opts, options);

      scope.change();
    };

    this.change = function() {
      if ($barContainer !== undefined && $barContainer.length > 0) {
        resize();
        change();
      }
    };

    this.scrollTo = function(distance) {
      scrollTo(distance);
    };

    this.exChange = function(f) {
      exChange = f;
    };

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
      return ((d - c) / (b - a)) * (x - a) + c;
    }
  };

  return wddoObj;
})(jQuery);
