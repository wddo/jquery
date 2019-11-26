/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.1
 * @since : 2012.04.12
 */

/*
 * 롤링 배너
 *
 * - 인자값
 * target : div element
 * speed : 변경 속도 1000 = 1초
 * data : 속성
 * - margin : 방향 top, bottom, left, right, none
 * - width : 배너 넓이
 * - height : 배너 높이
 * - delay : 딜레이 1000 = 1초
 * - ease : 제이쿼리 easing plugin 문자열, 기본값: easeOutQuart
 *
 * - 설명
 * target div 는 overflow: hidden 으로 하고 width 와 height 는 fix 시키는 것이 좋다.
 *
 * ex)
 * 	var banner = new WBanner($('#eventContentDiv')[0], 300, {margin:"none", width:400, height:500, delay:2500});
 *	banner.add("event1.html");
 *	banner.add("../img/event2.jpg", "http://www.naver.com");
 *	banner.start();
 *
 * 	- 버튼이 추가시 속성들
 *	banner.change(n); - 배너를 n번째로 변경 가능
 *	banner.startTimer(); - 딜레이 타이머 시작
 *	banner.stopTimer(); - 딜레이 타이머 정지
 *	banner.getActivate() - 현제 활성화 반환
 *
 *	$('#eventContentDiv').bind('slide', function(){'배너 변경될때 실행될 명령'});
 */
WBanner = function(target, speed, data) {
  dataArr = [];

  var _dataArr = dataArr;
  var $target = $(target);
  var speed = speed;

  margin = data.margin; //none, left, right, top, bottom
  var width = data.width;
  var height = data.height;
  var delay = data.delay;
  var ease = data.ease;

  delete data;

  if (margin == undefined) margin = "none";
  if (width == undefined) width = parseInt($target.css("width"));
  if (height == undefined) height = parseInt($target.css("height"));
  if (delay == undefined) delay = 5000;
  if (ease == undefined) ease = "easeOutQuart";

  var $itemDiv;
  activate = 0;
  var timerId;

  //시작
  init = function() {
    initUI();
    addEvent();
    startTimer();
  };

  //UI 초기화
  function initUI() {
    $target.empty(); //내부 비우기

    //타깃에 추가
    for (var i = 0; i < _dataArr.length; i++) {
      var url = _dataArr[i].url;
      var link = _dataArr[i].link;
      var ext = url.substr(url.lastIndexOf(".") + 1);

      if (ext == "jpg" || ext == "gif" || ext == "png") {
        //이미지 이면
        var div = $(
          "<div><a href=" +
            link +
            "><img src=" +
            url +
            " width=" +
            width +
            " height=" +
            height +
            " alt=Image" +
            i +
            " /></div>"
        ).appendTo($target);
      } else {
        //문서 이면
        div = $(
          '<div><iframe frameborder=0 scrolling="no"></iframe></div>'
        ).appendTo($target);
        div
          .children()
          .attr({
            width: width,
            height: height,
            allowtransparency: "true",
            src: url
          });
      }

      div.css({
        position: "absolute",
        width: width,
        height: height,
        display: "none",
        opacity: "0"
      });
    } //end for

    $itemDiv = $target.children();

    //초기 1번 활성화
    if ($itemDiv.length != 0)
      $itemDiv.eq(0).css({ display: "block", opacity: "1" });
  }

  //이벤트
  function addEvent() {
    $target.bind("mouseenter", function() {
      stopTimer();
    });

    $target.bind("mouseleave", function() {
      startTimer();
    });
  }

  //타이머 시작
  startTimer = function() {
    stopTimer();
    //trace('start');
    if ($itemDiv.length > 1) timerId = setInterval(timer, delay);
  };

  //타이머 종료
  stopTimer = function() {
    //trace('stop');
    clearInterval(timerId);
  };

  //타이머 내용
  function timer() {
    var act = activate + 1;
    motion(act);

    //외부로 변경될때 호출
    $target.trigger("slide");
  }

  //모션
  function motion(act) {
    if (margin != "none") {
      var param = isTweenCSSParam(margin).param; //넓이 & 높이
      var position = isTweenCSSParam(margin).position; //조정할 속성
      var direct = isTweenCSSParam(margin).direct; //방향

      var value = parseInt($itemDiv.css(param)); //결정된 속성

      //아웃
      var outObj = {};
      outObj[position] = value * direct;

      $itemDiv.eq(activate).stop(true, true);
      $itemDiv
        .eq(activate)
        .css({ display: "block", opacity: "1" })
        .animate(outObj, { queue: false, duration: speed, ease: ease });
    }

    activate = act;
    if (activate >= $itemDiv.length) activate = 0;

    var toObj = {};
    toObj["display"] = "block";

    if (margin != "none") {
      toObj["opacity"] = "1";
      toObj[position] = value * (direct * -1);
    }

    //인
    $itemDiv.eq(activate).stop(true, true);
    $itemDiv
      .eq(activate)
      .css(toObj)
      .animate(
        { opacity: "1", left: "0px", top: "0px" },
        { queue: false, duration: speed, ease: ease, complete: comp }
      )
      .appendTo($target); //맨위로

    //현제 뺀 나머지 모두 숨김
    function comp() {
      $itemDiv.each(function(idx) {
        if (idx != activate) {
          $itemDiv
            .eq(idx)
            .css({ display: "none", opacity: "0", left: "0", top: "0" });
        }
      });
    }

    delete fromObj;
    delete toObj;
    //trace(activate + "모션");
  }

  //방향에 따른 조정 파라미터를 반환
  function isTweenCSSParam(value) {
    var css = {};

    if (value == "left" || value == "right") css.param = "width";
    if (value == "top" || value == "bottom") css.param = "height";
    if (value == "left" || value == "right") css.position = "left";
    if (value == "top" || value == "bottom") css.position = "top";
    if (value == "left" || value == "top") css.direct = -1;
    if (value == "right" || value == "bottom") css.direct = 1;

    return css;
  }

  //
  trace = function(msg) {
    $("#trace").append(msg + ", ");
  };

  //외부 클릭
  setChange = function(num) {
    if (activate != num && num < _dataArr.length) {
      if (isTweenCSSParam(margin).position == "left") {
        if (activate < num) margin = "left";
        if (activate > num) margin = "right";
      } else if (isTweenCSSParam(margin).position == "top") {
        if (activate < num) margin = "top";
        if (activate > num) margin = "bottom";
      }

      motion(num);
    }
  };
};

//외부 추가
WddoBanner.prototype.add = function(url, link) {
  dataArr.push({ url: url, link: link == undefined ? "#" : link });
};

//외부 시작
WddoBanner.prototype.start = function() {
  init();
};

//외부 변경
WddoBanner.prototype.change = function(num) {
  setChange(num);
};

//외부 타이머 시작
WddoBanner.prototype.startTimer = function() {
  startTimer();
};

//외부 타이머 정지
WddoBanner.prototype.stopTimer = function() {
  stopTimer();
};

//활성화 반환
WddoBanner.prototype.getActivate = function() {
  return activate;
};
