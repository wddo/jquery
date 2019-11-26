/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.1
 * @since : 2014.12.10
 *
 * history
 *
 * 1.0 (2014.12.10) : -
 * 1.1 (2015.02.02) : 이전 다음 일 표시여부 컨트롤 할 수 있게 수정, 기타 확장성 업그레이드
 *
 * Jo Yun Ki에 의해 작성된 WCalendar은(는) 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.
 * 이 라이선스의 범위 이외의 이용허락을 얻기 위해서는 wddoddo@gmail.com을 참조하십시오.
 *
 */

/**
 * calendar :: wddo
 *
 *  // 1번째 인자로 달력을 열때 클릭할 버튼을 넣음
 *  var calendar = new WCalendar($('.btnCal:eq(0)'), {});
 *  calendar.init();
 *
 *  instance.getDate();            //날짜반환, Date 객체 반환
 *  instance.setDate(2014, 2, 12); //날짜지정 2014년 2월 12일 적용
 *  instance.setHide();			   //숨김
 *  instance.setDisable(boolean);  //비활성화
 *
 * @param _btn          ::: 달력과 연결할 버튼 element
 * @param _options      ::: 옵션
 *
 * options object
 *  only    - 한 페이지에 한 달력이 열릴지 유무
 *  zindex  - 열릴 때 뎁스
 *  inputId - 일 클릭 이벤트에서 전달해줄 아이디
 *  isDisable - 비활성화 여부
 *  isHiddenDate - 이전 다음 일 표시여부
 *  todayClass - 오늘날짜 표시 클래스 "." 제외
 */
var WCalendar = (function($) {
  var wddoObj = function(_btn, _options) {
    var scope, //스코프
      $btn = _btn, //달력버튼
      $target, //컨테이너
      $month, //월 표시 태그
      $prev, //이전 버튼
      $next, //다음 버튼
      $close, //닫기 버튼
      $dayTR, //날짜 찍히는 TR (월이 변화할 때 마다 변경)
      lineNum = 6 /*const*/, //날짜가 출력될 라인수
      startTRNum, //시작 TR 줄수 (영문요일 표시가 thead 가 아닌 tbody에 있을 때를 위해.. 해당 조건이면 값 1)
      targetSelection, //컨테이너 셀렉션
      now, //현재 날짜
      current, //이동 날짜
      monthArr, //영문표기 달
      opts, //옵션
      defaults = defaultOptions(), //기본값;
      zindex; //현재 뎁스

    function defaultOptions() {
      return {
        only: true, //한 페이지에 한 달력이 열릴지 유무
        zindex: 840212, //열릴 때 뎁스
        inputId: undefined, //일 클릭 이벤트에서 전달해줄 아이디
        isDisable: false, //비활성화 여부
        isHiddenDate: true, //이전 다음 일 표시여부
        todayClass: "today" //오늘날짜 표시 클래스 "." 제외
      };
    }

    function init() {
      opts = $.extend(defaults, _options);

      current = new Date();
      now = new Date();
      monthArr = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      createLayout();
      createDate();
      changeMonth();
      changeToday();
      initEvent();

      hide();

      $target.data("scope", scope);
    }

    //레이아웃 생성
    function createLayout() {
      targetSelection = ".layer_calendar";

      $btn.after(
        '<div class="layer_calendar">' +
          '<div class="sel_month">' +
          '<button type="button" class="btn"><span class="cmm_spr calbtn_l">month of Previous</span></button>' +
          '<strong class="this">2014.12</strong>' +
          '<button type="button" class="btn"><span class="cmm_spr calbtn_r">month of Next</span></button></div>' +
          '<div class="sel_date"><table><caption>select of calendar</caption><thead><tr>' +
          '<th scope="col" class="sun">S</th><th scope="col">M</th><th scope="col">T</th><th scope="col">W</th><th scope="col">T</th><th scope="col">F</th><th scope="col" class="sat">S</th>' +
          '</tr></thead><tbody></tbody></table></div><a href="#" class="cmm_spr calbtn_x">Close</a></div>'
      );

      $target = $btn.siblings(targetSelection);
      $month = $target.find(".sel_month > strong");
      $prev = $target.find(".calbtn_l").parent();
      $next = $target.find(".calbtn_r").parent();
      $close = $target.find("a.calbtn_x");

      zindex = $target.css("z-index");
      startTRNum = $target.find("tbody > tr").length;
    }

    //이벤트 적용
    function initEvent() {
      $btn.on("click", function(e) {
        if (!opts.isDisable) {
          if ($target.filter(":hidden").length > 0) {
            show();
            window.tab.setTarget($(this)[0]);
          } else {
            hide();
          }
        }

        e.preventDefault();
      });

      $next.on("click", function(e) {
        var target = e.currentTarget;

        current.setMonth(current.getMonth() + 1);

        removeDate();
        createDate();
        changeMonth();
        changeToday();

        e.preventDefault();
      });

      $prev.on("click", function(e) {
        var target = e.currentTarget;

        current.setMonth(current.getMonth() - 1);

        removeDate();
        createDate();
        changeMonth();
        changeToday();

        e.preventDefault();
      });

      $close.on("click", function(e) {
        hide();

        e.preventDefault();
      });

      //일 클릭
      $target.find("tbody").on("click", "a", function(e) {
        selectDate(current.getFullYear(), current.getMonth(), $(this).text());
        changeToday();
        hide();
        //event binding
        //$target.trigger('select.calendar', [scope.getDate(), opts.inputId]);
        $target.trigger("select.calendar", [
          current.getFullYear(),
          force2Digits(current.getMonth() + 1),
          force2Digits(parseInt($(this).text())),
          opts.inputId,
          now
        ]);

        var tt = window.tab.getTarget();
        if (tt !== undefined) tt.focus();

        e.preventDefault();
      });
    }

    //달력 외 영역 이벤트
    function addDocumentEvent() {
      $(document).on(
        "mousedown.calendar focusin.calendar touchstart.calendar",
        function(e) {
          if (
            $(e.target).closest(targetSelection).length === 0 &&
            $(e.target).get(0) !== $btn.get(0)
          ) {
            //closeAll();
            hide();
          }
        }
      );
    }

    function removeDocumentEvent() {
      $(document).off(
        "mousedown.calendar focusin.calendar touchstart.calendar"
      );
    }

    //날짜 생성
    function createDate() {
      //이전달 변수
      var prevDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
      var prevMonth = prevDate.getMonth();
      var prevDayArr = [];

      //현재달 변수
      var date = new Date(current.getFullYear(), current.getMonth(), 1); //새로운 date 객체
      var tbody = $target.find("tbody");

      //일 빈공간 생성
      var i = 0;
      var max = lineNum * 7; //최대 줄수 만큼의 일 갯수 (6*7)
      for (; i < max; i += 1) {
        if (i % 7 === 0) tbody.append("<tr></tr>");

        tbody.find("tr:last").append("<td></td>");
      }

      //일 채워 넣기
      i = 1;
      max = max - 1; //for문이 1부터 시작이므로 -1

      date.setDate(1); //아래 비교를 위해 1일 셋팅
      var startTRIndex = date.getDay() === 0 && opts.isHiddenDate ? 1 : 0; //1일이 일요일 이고 전이후날 표시속성이 true면 한줄 여유두고 출력하기위해 1

      var targetTR = tbody.find("> tr:eq(" + (startTRIndex + startTRNum) + ")"); //몇번째 tr 부터 숫자 입력될지 지정
      var idx, td;
      for (; i <= max; i += 1) {
        date.setDate(i); //새로운 date 1씩 증가

        if (date.getMonth() === current.getMonth()) {
          //새로운 date와 비교하여 월이 같으면.. 즉, current 일수 만큼 반복
          idx = date.getDay(); //요일 0(일)~6

          if (date.getDay() === 0 && i !== 1) targetTR = targetTR.next(); //줄 내림

          td = targetTR
            .find("> td")
            .eq(idx)
            .append('<a href="#"></a>')
            .find("> a")
            .text(i)
            .end(); //날짜 입력

          if (date.getDay() === 0) td.addClass("sun"); //일
          if (date.getDay() === 6) td.addClass("sat"); //토
        }

        //이전달도 같이 셋팅하여 일수를 배열에 저장
        prevDate.setDate(i);
        if (prevDate.getMonth() === prevMonth) prevDayArr.push(i); //전달 일자 저장, prevDate.length : 전달총 일수
      }

      if (opts.isHiddenDate) {
        //입력을 위해 반전
        prevDayArr.reverse();

        //날짜 박힐 tr 갱신
        $dayTR = tbody.find("> tr").filter(function() {
          return $(this).index() >= startTRNum;
        });

        //이전달 비어있는 일(TD) 저장
        var prevTD = $dayTR
          .filter(":first")
          .find("td")
          .filter(function() {
            return $(this).text().length === 0;
          });

        //저장된 비어있는 TD에 이전달 출력
        $(prevTD.get().reverse()).each(function(i) {
          $(this).append("<span>" + prevDayArr[i] + "</span>");
        });

        //다음달 비어있는 일(TD) 저장
        var nextTD = tbody.find("tr > td").filter(function() {
          return $(this).text().length === 0;
        });

        //저장된 비어있는 TD에 다음달 출력 (이전달과는 달리 무조건 1부터 출력)
        nextTD.each(function(i) {
          $(this).append("<span>" + (i + 1) + "</span>");
        });
      } else {
        //일 채워 넣고 남은 빈tr 삭제
        tbody
          .find("tr")
          .filter(function() {
            return $(this).text().length === 0;
          })
          .remove();

        //날짜 박힐 tr 갱신
        $dayTR = tbody.find("> tr").filter(function() {
          return $(this).index() >= startTRNum;
        });
      }
    }

    //날짜 삭제
    function removeDate() {
      $dayTR.remove();
    }

    //날짜 선택 시
    function selectDate(_year, _month, _date) {
      now.setFullYear(_year);
      now.setMonth(_month);
      now.setDate(_date);
    }

    //오늘 변경
    function changeToday(_date) {
      var tbody = $target.find("tbody");

      if (
        now.getFullYear() === current.getFullYear() &&
        now.getMonth() === current.getMonth()
      ) {
        $dayTR
          .find("td")
          .removeClass(opts.todayClass)
          .find("> a")
          .eq(now.getDate() - 1)
          .parent()
          .addClass(opts.todayClass);
      }
    }

    //월 변경
    function changeMonth() {
      //$month.text( monthArr[current.getMonth()] );
      $month.text(
        current.getFullYear() + "." + force2Digits(current.getMonth() + 1)
      );
    }

    //보이기
    function show() {
      $target.show();

      $target.css("z-index", opts.zindex);

      if (opts.only) addDocumentEvent(); // 마우스 사용자를 위한
    }

    //숨기기
    function hide() {
      $target.hide();

      $target.css("z-index", zindex);

      if (opts.only) removeDocumentEvent();
    }

    function closeAll() {
      $(targetSelection).each(function() {
        $(this)
          .getInstance()
          .setHide();
      });
    }

    //숫자 1자릿수 앞에 0 붙이기
    function force2Digits(value) {
      return value < 10 ? "0" + value.toString() : value.toString();
    }

    //public
    this.init = function() {
      scope = this;

      if ($btn.length === 0) return;

      init();
    };

    this.getDate = function() {
      return now;
      //return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    };

    this.setDate = function(_year, _month, _date) {
      now.setFullYear(_year);
      now.setMonth(_month - 1);
      now.setDate(_date);

      current.setFullYear(_year);
      current.setMonth(_month - 1);
      current.setDate(_date);

      removeDate();
      createDate();
      changeMonth();
      changeToday();
    };

    this.setHide = function() {
      hide();
    };

    this.setDisable = function(value) {
      opts.isDisable = value;
    };

    if (jQuery.fn.getInstance === undefined)
      jQuery.fn.getInstance = function() {
        return this.data("scope");
      };
  }; //end Obj

  return wddoObj;
})(jQuery);
