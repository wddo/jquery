/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.4.4
 * @since : 2014.04.01
 *
 * history
 *
 * 1.0   (2014.04.01) : -
 * 1.1   (2014.07.21) : addTo 옵션 추가, 컨텐츠 mousewheel 이벤트 적용(http://brandonaaron.net :: jquery.mousewheel.js 필요)
 * 1.2   (2014.07.23) : scollTo 생성, $content 안에 a 태그 focusin 시 스크롤바 위치 변경(레이아웃 깨짐 방지)
 * 1.3   (2014.07.24) : 가로 스크롤 적용, isWheel, isVer, wheelDistance 옵션 추가
 * 1.4   (2014.12.09) : touch event 추가, isMargin와 isRelative 옵션 추가
 * 1.4.1 (2015.08.06) : 스크롤이 안생겼을 때는 기본 mousewheel 적용 되게 e.preventDefault() 해제
 *                      레이아웃 깨짐 방지로 넣어놓은 a태그의 focusin으로 인해서 a태그 클릭 시 스크롤 이동문제로 인하여 isFocus 추가하여 선택할수 있게 수정
 *                      getPosition() 이 a태그 dom 구조에 따라 모호성이 있어 수정이 필요.. 일단 parent()로 focusSelector태그 부모의 포지션을 잡게함
 * 1.4.2 (2015.09.22) : 외부 dispose() 추가, 내부 dispose() 수정
 *                      mousedown, mouseup 이벤트와 isMouseDown 변수 추가하여 마우스에 의한 focusin 발생을 방지
 *                      focusSelector 변수 추가
 *                      toggle(false) 나 dispose() 시 스크롤 컨텐츠 초기화
 * 1.4.3 (2017.09.25) : change() 전 scrollTo() 시 cm, sm 가 undefined 문제 해결, getContainerSize(), getContentSize(), calculationMargin() 함수 생성하고 cch 변수 삭제
 *                      isDrag 옵션 추가, ins.contentTo(), ins.setOptions() 추가, opts.isTransition 추가
 * 1.4.4 (2018.11.27) : opts.bgClassName, opts.barClassName, opts.position, opts.zindex, opts.autoSize, opts.onDrag 추가, ins.exChange 를 opts.onChange 로 대체
 *                      barContainer 클릭 이동 추가
 *
 * Jo Yun Ki에 의해 작성된 WScroll은(는) 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.
 * 이 라이선스의 범위 이외의 이용허락을 얻기 위해서는 wddoddo@gmail.com을 참조하십시오.
 *
 */

/**
 * wscroll
 *
 * css로 스크롤바의 총길이 외엔 모두 지정, 총길이는 container 높이에 맞게 생성되며 options 의 scrollMargin 으로 조절
 * 스크롤 바의 dom 구조 : <div class='wsCon'><div class='wsBar'></div></div>
 * 기본적인 변수명은 혼동읖 피하기위해 세로 스크롤 기반
 *
 * var instance = new WScroll();
 *
 * var scroll = instance.init($(window), $act, {scrollMargin: 50 + 70, contentMargin: 39}); // 초기화.. 스크롤 디자인 css 적용 용의 .wsCon 반환
 * instance.reset($(window), $act, options); //새로운 대상으로 적용.. 변화 없으면 인자 생략 가능
 * instance.change(); //휠 변화에 대하여 호출
 * instance.contentTo(value); //외부에서 컨텐츠 위치 조정
 * instance.scrollTo(ypos); //외부에서 스크롤 위치 조정
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
 *      'width' : 8 + 'px',
 *      'top' : '0px',
 *      'border-radius' : 4 + 'px'
 * });
 *
 * @param container     ::: 스크롤링 element의 부모 element, 페이지 전체 적용시 $(window) 가 될 수도 있음
 * @param content       ::: 스클롤링 element
 * @param options       ::: 오브젝트 형태의 callback 을 받을 수 있는 함수 집합
 *
 * options object
 *  addTo          - 스크롤 바의 dom을 추가할 위치 [default: $('body')]
 *  bgClassName    - bg 클래스명 [default: 'wsCon']
 *  barClassName   - bar 클래스명 [default: 'wsBar']
 *  position       - 컨테이너 포지션 값 [default: 'absolute']
 *  zindex         - 컨테이너 z-index 값 [default: 84212]
 *  isVer          - 세로 스크롤 인가 [default: true]
 *  isDrag         - 드래그 여부 [default: true]
 *  isWheel        - 휠 적용 여부 [default: true]
 *  isTouch        - 터치 적용 여부 [default: true]
 *  isMargin       - 스크롤링 element 포지션 조정 css를 top이 아닌 margin 으로 조정 [default: false]
 *  isRelative     - 스크롤링 element 포지션을 relative로 [default: false]
 *  isFocus        - a 태그 포커스에 따른 스크롤 조정 유무 [default: false]
 *  isTransition   - 디자인 트렌지션 유무 [default: false]
 *  autoSize       - 스크롤바 autoSize [default: true]
 *  wheelDistance  - 1회 스크롤당 이동거리 [default: 30]
 *  contentMargin  - 스크롤 대상의 추가 +- 여백값 [default: 0]
 *  scrollMargin   - 스크롤의 추가 +- 여백값 [defalut: 0]
 *  onChange       - change 콜백 함수,
 *  onDrag         - drag 콜백 함수
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
      focusSelector =
        "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]",
      isMouseDown = false, //mousedown에 의한 focusin 방지 변수
      init = function() {
        create();
        addEvent();
        resize();
      };

    function create() {
      if (opts.addTo.find("> ." + opts.bgClassName).length === 0)
        opts.addTo.append(
          '<div class="' +
            opts.bgClassName +
            '"><div class="' +
            opts.barClassName +
            '"></div></div>'
        );

      $barContainer = opts.addTo.find("> ." + opts.bgClassName);
      $barContainer.css({
        position: opts.position,
        "z-index": opts.zindex
      });

      $bar = $barContainer.find("> ." + opts.barClassName);

      ct = st = 0;
      $bar
        .css(getCSSBarPos(), 0)
        .add($barContainer)
        .filter(function() {
          return opts.isDrag;
        })
        .css("cursor", "pointer");

      $barContainer.addClass("init_wscroll");
    }

    function addEvent() {
      var dPagePos, dBarPos;

      //event dispose
      function removeHandler() {
        dPagePos = undefined;
        dBarPos = undefined;
        $(document).off(".wscroll");

        if (opts.onDrag !== undefined)
          opts.onDrag({
            state: "dragstop",
            contentPos: ct,
            scrollPos: st,
            options: opts
          });
      }

      // 드래그
      if (opts.isDrag) {
        $bar.on("mousedown.wscroll", function(e, mousedownEvent) {
          var target = $(e.currentTarget);

          $(document).on("mouseup.wscroll", removeHandler);
          $(document).on("mousemove.wscroll", mouseMoveHandler);

          dPagePos = getPagePos(mousedownEvent || e);
          dBarPos = parseInt($bar.css(getCSSBarPos()));

          if (opts.onDrag !== undefined)
            opts.onDrag({
              state: "dragstart",
              contentPos: ct,
              scrollPos: st,
              options: opts
            });
        });

        $barContainer.on("mousedown.wscroll", function(e) {
          var target = $(e.target);

          if (target.hasClass(opts.bgClassName)) {
            var over = getOffsetPos(e) > st ? 10 - bh : -10;

            scrollTo(getOffsetPos(e) + over);

            $bar.trigger("mousedown.wscroll", [e]);
          }
        });
      }

      function mouseMoveHandler(e) {
        var target = $(e.currentTarget);

        var moveDistance = dBarPos + (getPagePos(e) - dPagePos); //끌어온 크기 0 ~
        scrollTo(moveDistance);

        if (opts.onDrag !== undefined)
          opts.onDrag({
            state: "drag",
            contentPos: ct,
            scrollPos: st,
            options: opts
          });

        e.preventDefault();
      }

      //터치
      if (opts.isTouch) {
        opts.addTo.on("touchstart.wscroll", touchStartHandler);
        opts.addTo.on("touchmove.wscroll", touchMoveHandler);
      }

      function touchStartHandler(e) {
        var touch = event.touches[0];

        if (event.touches.length === 1) {
          dPagePos = getPagePos(touch);
          dBarPos = parseInt($bar.css(getCSSBarPos()));
        }
      }

      function touchMoveHandler(e) {
        var moveDistance = dBarPos - (getPagePos(event.touches[0]) - dPagePos); //끌어온 크기 0 ~
        scrollTo(moveDistance);

        e.preventDefault();
      }

      //휠
      if (opts.isWheel) {
        opts.addTo.on("mousewheel.wscroll", function(e, delta) {
          var target = $(e.currentTarget);

          dBarPos = parseInt($bar.css(getCSSBarPos())); // 바 위치 재정의

          var moveDistance =
            dBarPos +
            Math.round((getContainerSize() / ch) * opts.wheelDistance) * -delta; //한번에 스크롤에 크기
          scrollTo(moveDistance);

          if ($barContainer.css("display") === "block") e.preventDefault(); //add 1.4.1
        });
      }

      //a링크
      if (opts.isFocus) {
        $content.on("mousedown.wscroll", focusSelector, function(e) {
          isMouseDown = true;
        });

        $content.on("mouseup.wscroll", focusSelector, function(e) {
          isMouseDown = false;
        });

        $content.on("focusin.wscroll", focusSelector, function(e) {
          if (!isMouseDown) {
            //mousedown에 의한 focusin 방지
            var target = $(e.currentTarget);

            var value = Math.floor(
              getLinearFunction(0, cm, 0, sm, getPosition(target))
            );

            scrollTo(value);
          }
        });
      }
    }

    //컨텐츠 이동
    function contentTo(value) {
      var threshold =
        getContainerSize() + (getContentSize() + opts.contentMargin) * -1;

      if (value > 0) value = 0;
      if (value < threshold) value = threshold;

      $content.css(getCSSContentPos(), value);

      scope.change();
    }

    //스크롤 이동
    function scrollTo(ypos) {
      if (sh > bh) {
        if (ypos < 0) ypos = 0;
        if (ypos > sh - bh) ypos = sh - bh;

        if (sm === undefined || cm === undefined) calculationMargin();

        var value = Math.floor(getLinearFunction(0, sm, 0, cm, ypos));

        contentTo(-value);
      }
    }

    //레이아웃 변경시 실행해야하는 함수
    function resize() {
      //스크롤 전체 높이 정의.. 컨텐츠 높이 == 스크롤 전체높이
      sh = opts.autoSize
        ? getContainerSize() + opts.scrollMargin
        : parseInt($barContainer.css(getCSSSize())) + opts.scrollMargin;
      $barContainer.css(getCSSSize(), sh);

      //컨텐츠 높이 정의
      ch = getContentSize() + opts.contentMargin;

      //바높이 정의
      bh = opts.autoSize
        ? Math.floor(getLinearFunction(0, ch, 0, sh, getContainerSize()))
        : parseInt($bar.css(getCSSSize()));

      if (opts.isTransition) {
        var aniObj = {};
        aniObj[getCSSSize()] = bh;
        $bar.animate(aniObj, { queue: false, duration: 100, easing: "swing" });
      } else {
        $bar.css(getCSSSize(), bh);
      }

      //숨김 유무
      toggle(sh > bh);
    }

    //스크롤바 위치 변경 함수
    function change() {
      calculationMargin();

      ct = Math.abs(Math.floor(parseInt($content.css(getCSSContentPos()))));

      var value = Math.floor(getLinearFunction(0, cm, 0, sm, ct));
      $bar.css(getCSSBarPos(), value);

      //바가 여유 영역을 넘어가면
      st = parseInt($bar.css(getCSSBarPos()));
      if (st > sh - bh) st = sh - bh;
      $bar.css(getCSSBarPos(), st);

      if (opts.onChange != undefined)
        opts.onChange({ contentPos: ct, scrollPos: st, options: opts });
    }

    function toggle(is) {
      if ($contentContainer !== undefined) {
        if (!is) $content.css(getCSSContentPos(), 0); //스크롤 바가 숨겨지면 컨텐츠는 자동 위치는 초기화
        $barContainer.css("display", is ? "block" : "none");
      }
    }

    //컨테이너 크기 반환
    function getContainerSize() {
      return opts.isVer
        ? $contentContainer.height()
        : $contentContainer.width();
    }

    //컨텐츠 크기 반환
    function getContentSize() {
      return opts.isVer ? $content.outerHeight() : $content.outerWidth();
    }

    //마진 계산
    function calculationMargin() {
      cm = getContentSize() + opts.contentMargin - getContainerSize();
      sm = sh - bh;
    }

    function dispose() {
      opts.addTo.off(".wscroll");
      $content.off(".wscroll");
      $bar.on(".wscroll");

      $barContainer.remove();

      $content.css(getCSSContentPos(), 0);

      opts = undefined;
      $contentContainer = undefined;
      $content = undefined;
      $bar = undefined;
      $barContainer = undefined;
    }

    this.init = function(container, content, options) {
      var defaults = {
        addTo: $("body"),
        bgClassName: "wsCon",
        barClassName: "wsBar",
        position: "absolute",
        zindex: 84212,
        isVer: true,
        isDrag: true,
        isWheel: true,
        isTouch: true,
        isMargin: false,
        isRelative: false,
        isFocus: false,
        autoSize: true,
        wheelDistance: 30, // 1회 스크롤당 이동거리
        contentMargin: 0, // 컨텐츠 높이 +- 값
        scrollMargin: 0, // 스크롤 높이 +- 값
        onChange: undefined,
        onDrag: undefined
      };

      $contentContainer = container;
      $content = content;

      opts = $.extend(defaults, options);

      $content
        .css(getCSSContentPos(), 0)
        .css("position", opts.isRelative ? "relative" : "absolute"); //horizontal 형태에서 absolute 꼭 필요

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

    this.dispose = function() {
      dispose();
    };

    this.setOptions = function(options) {
      $.extend(opts, options);
    };

    this.contentTo = function(distance) {
      contentTo(distance);
    };

    this.scrollTo = function(distance) {
      scrollTo(distance);
    };

    function getCSSBarPos() {
      return opts.isVer ? "marginTop" : "marginLeft";
    }

    function getCSSSize() {
      return opts.isVer ? "height" : "width";
    }

    function getCSSContentPos() {
      var css;

      if (!opts.isMargin) {
        css = opts.isVer ? "top" : "left";
      } else {
        css = opts.isVer ? "marginTop" : "marginLeft";
      }

      return css;
    }

    function getPagePos(e) {
      return opts.isVer ? e.pageY : e.pageX;
    }

    function getOffsetPos(e) {
      return opts.isVer ? e.offsetY : e.offsetX;
    }

    function getPosition(target) {
      return opts.isVer
        ? target.parent().position().top
        : target.parent().position().left;
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
      return ((d - c) / (b - a)) * (x - a) + c;
    }
  };

  return wddoObj;
})(jQuery);
