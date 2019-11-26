/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 2.2.2
 * @since : 2013.10.22
 * 
 * history
 * 
 * 1.0 (2013.10.30) : -
 * 2.0 (2013.11.20) : 탭 포커스 문제로 visibility 속성 제어하여 레이아웃 깨지지 않게 수정에 의해 showAtag(), hideAtag() 추가
 * 2.1 (2013.12.10) : dispose() 추가, init() 중복 실행시 자동 dispose() 실행
 * 2.1.1 (2013.12.17) : 외부함수에서 적용 타깃 찾기 용의하게 ex.. 함수들에 두번째 인자에 $container 반환
 *                      fit 속성이 생성되었다. 이는 item 가로 사이즈가 브라우저 크기에 영향을 받아 distance 를 변화시켜 주고 위치를 잡아주도록 한다. horizontal 만 해당된다.
 * 2.2 (2015.01.23) : dotA가 존재하여도 무한 반복할 수 있는 repeat: true 가능, 단 range 에 의해 1개 이상 노출시 구조상 dotA 정상작동 어려움
 *                    instance.reset() 추가
 *                    touch 이벤트 적용
 * 2.2.1 (2015.05.06) : 자체 $(document).ready() 삭제, 자동 재생에 대한 마우스 이벤트의 반응을 할 대상이 항상 container 라는 것을 배제
 *                      내부 이벤트(container 의 mouseleave, mouseenter 등의 것)를 원치 않아 삭제시 외부에서 off() 하면 타이밍이 맞지 않아 rolling.init() 이전에 먼저 off() 실행됨을 해결 하기 위해
 * 2.2.2 (2015.07.15) : 옵션에 btnDisabledClass 추가, 버튼에 해당 클래스가 있으면 롤링되지 않음
 * 						rolling.change(idx, spd) 추가
 * 						distance 옵션을 jump로 나눔
 * 						dotA가 a 태그가 아닌 경우 리스트격이라 생각하고 parent() 안하도록 initDotA() 수정
 * 
 * 
 * Jo Yun Ki에 의해 작성된 Rolling(는) 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.
 * 이 라이선스의 범위 이외의 이용허락을 얻기 위해서는 wddoddo@gmail.com을 참조하십시오.
 * 
 */

/********************************************************************************************/
/****************************************** Rolling *****************************************/
/********************************************************************************************/

/** 
* 롤링
* 
* 1. jQuery 라이브러리 로드후 실행
* 2. 롤링할 대상과 옵션을 Object 형태로 넘김
* 3. 인자로 넘기는 데이터의 대상값은 DOM 구조는 jQuery 형태로 문자열로 넘긴다.
* 4. first 와 repeat 옵션이 동시에 true 가 되면 first 는 자동 false 가 된다.
* 
* var rollingData = {
*     container: '.ir_data > dl > dd',          //전체 영역 부모
*     itemContainer: '.ir_data .con01 > ul',    //리스트를 감싸고 있는 부모
*     item: '.ir_data .con01 > ul > li',        //리스트들
*     upA: '.ir_data .btn > a:eq(1)',           //화살표 위
*     downA: '.ir_data .btn > a:eq(0)',         //화살표 아래
*     dotA: '.ir_data .dot > a',                //도트버튼
*     distance: 18,                             //클릭시 리스트 하나당 이동할 거리
*     range: 1,                                 //노출될 리스트 갯수                기본값 1
*     jump: 1,                                  //한번에 이동 할 갯수               기본값 1
*     delay: 5000,                              //자동롤링 시간                     기본값 5000
*     speed: 800,                               //모션 속도                         기본값 800
*     direction: 'vertical' & 'horizontal',     //방향                              기본값 horizontal (수평)
*     ease: 'easeOutQuart',                     //모션 이징값                       기본값 undefined
*     play: false,                              //자동 롤링 유무                    기본값 false
*     first: false,                             //슬라이딩 처음으로 돌아가기 유무   기본값 false
*     repeat: false,                            //한 방향으로 무한 반복 유무        기본값 false
*     fit: false,                               //가로 폭이 유동적인지 유무         기본값 false
* 	  btnDisabledClass: 'noData'				//버튼 진행을 막을 클래스		    기본값 undefined
* }
*   
*   var rolling = new Rolling();
*   rolling.init(rollingData);      //생성
*
*   rolling.dispose()               //파괴
*   rolling.reset()					//리셋
*   rolling.remove(idx);            //리스트 삭제
* 	rolling.change(idx, spd);		//리스트 변경, spd: 속도
*   rolling.play();                 //자동롤링 활성화
*   rolling.stop();                 //자동롤링 비활성화
*   rolling.exUp(function () {});   //확장 화살표 위
*   rolling.exDown(function () {}); //확장 화살표 아래
*   rolling.exDot(function () {});  //확장 도트버튼
*   rolling.exComplete(function () {}); //모션이 완료된 시점
*/
var Rolling = (function ($) {
    var wddoObj = function () {
        var scope,
            dataDefault,
            $container,
            $itemContainer,
            $item,
            $upA,
            $downA,
            $dotA,
            distance,
            range,
            jump,
            delay,
            speed,
            ease,
            isPlay,
            direction,
            itemTotal,
            count = 0,
            currentIdx,
            direct = "down",
            isFirst,
            isRepeat,
            isFit,
            btnDisabledCls,
            timerId,
            exUp,
            exDown,
            exDot,
            exComplete;
            
        //init
        function init(data) {
            dataDefault = data;
            $container = $(data.container);
            $itemContainer = $(data.itemContainer);
            $item = $(data.item);
            $upA = $(data.upA);
            $downA = $(data.downA);
            $dotA = $(data.dotA);
            range = data.range || 1;
            jump = data.jump || 1;
            delay = (data.delay !== undefined) ? data.delay : 5000;
            speed = (data.speed !== undefined) ? data.speed : 800;
            ease = data.ease || undefined;
            isPlay = (data.play !== undefined) ? data.play : false;
            direction = data.direction || 'horizontal';
            isFirst = (data.first !== undefined && !isRepeat) ? data.first : false;
            isRepeat = (data.repeat !== undefined) ? data.repeat : false;
            isFit = (data.fit !== undefined) ? data.fit : false;
            btnDisabledCls = data.btnDisabledClass || undefined;
            distance = (isFit && direction === 'horizontal') ? $item.outerWidth() : data.distance / jump; //modify 2.2.2
            itemTotal = $item.length;

            //포커스에 의해 레이아웃 어그러짐 방지를 위해 A 태그 숨김
            hideAtag();

            //item에 고유넘버 'idx' 지정
            $item.each(function (idx) { $(this).data('idx', idx); });
            //dot에 고유넘버 'dix' 지정
            $dotA.each(function (idx) { $(this).data('idx', idx); });

            //dotA의 갯수 컨트롤(추가는 관여하지 않으나 jump 에 따라 숨김)
            initDotA();

            if (isPlay) startTimer();   //자동 플레이라면 타이머 시작
        }
        
        //dotA의 갯수 숨김
        function initDotA() {
        	var dotList = ($dotA.is('a')) ? $dotA.parent() : $dotA; //add 2.2.2
        	
            dotList.each(function (idx) {
                if (0 !== idx % jump) $(this).hide();
            });
        }
        
        //이벤트
        function addEvent() {            
            //업(왼) 화살표 클릭이벤트
            $upA.on('click.rolling', function (e) {
                if (!$upA.hasClass(btnDisabledCls)) up();
                
                e.preventDefault();
            });
          
            //다운(오른) 화살표 클릭이벤트
            $downA.on('click.rolling', function (e) {
                if (!$downA.hasClass(btnDisabledCls)) down();

                e.preventDefault();
            });
                        
            //도트 버튼 버튼이벤트
            //if (!isRepeat) {
                $dotA.on('click.rolling', function (e) {
                    var target = $(e.currentTarget),
                        id = target.data('idx');

                    dot(id);

                    e.preventDefault();
                });
            //}
                        
            //컨테이너 마우스 이벤트
            $container.on('mouseenter.rolling focusin.rolling', function (e) {
                if (isPlay) stopTimer();
            });
            
            $container.on('mouseleave.rolling focusout.rolling', function (e) {
                if (isPlay) startTimer();
            });
            
            //리사이징
            $(window).on('resize.rolling', function (e) {
                if (isFit && direction === 'horizontal') {
                    distance = $item.outerWidth();
                    
                    motion(-distance * count, 0);
                }
            });
            
            //터치이벤트
            var touchPos, touchStartPos, touchMovePos;
            $itemContainer.on('touchstart.rolling', function (e) {
                if (event.touches.length === 1) touchStartPos = event.touches[0].screenX;
            });
            
            $itemContainer.on('touchmove.rolling', function (e) {
                if (event.touches.length === 1) touchMovePos = event.touches[0].screenX;
            });
            
            $itemContainer.on('touchend.rolling', function (e) {
                touchPos = touchMovePos - touchStartPos;
                
                if (isNaN(touchPos)) return;
                
                if (touchPos > 0) {
                    up();
                } else if (touchPos < 0) {
                    down();
                }

                touchStartPos = undefined;
                touchMovePos = undefined;
            });
        }

        function up() {
            if (itemTotal <= range) return;
            
            direct = "up";
            
            var max = itemTotal - range;
            var min = 0;
            var repeatCurrentItem;
            
            if (isRepeat) {
                var dir = getCSSDirection();
                
                if (count > min) {
                    count = count - jump;
                    
                    repeatCurrentItem = $item.eq(count);
                    currentIdx = parseInt(repeatCurrentItem.data('idx'));
                } else {
                	currentIdx = undefined;
                	
                    var i;
                    for (i = 0; i < jump; i += 1) {
                        repeatCurrentItem = $item.filter(':last');
                        $item.filter(':first').before($item.filter(':last'));
                        resetItem();
                        
                        currentIdx = parseInt(repeatCurrentItem.data('idx')); //오른쪽 하나만 지정하기위해 반목문 안에서 마지막까지 실행
                    }

                    $itemContainer.css(dir, -distance * jump + 'px');
                    
                    sortItem = sort;
                }
            } else {
                currentIdx = count = (count > min) ? count - jump : (isFirst) ? max : min;
            }
            
            motion(-distance * count);
            
            //console.log('left : ' + currentIdx, count, -distance * count);

            if (exUp !== undefined) exUp(currentIdx, $container);
            if (exDot !== undefined) exDot(currentIdx, $container);
        }

        function down() {
            if (itemTotal <= range) return;
            
            direct = "down";
            
            var max = itemTotal - range;
            var min = 0;
            var repeatCurrentItem; //currentIdx는 모션에 관여하지 않으며 dotA 활성화에만 관여한다.
            
            //무한 반복
            if (isRepeat) {
                var dir = getCSSDirection();

                if (max > count) {
                //일반형
                    currentIdx = count = count + jump;
                    
                    repeatCurrentItem = $item.eq(count);
                    currentIdx = parseInt(repeatCurrentItem.data('idx'));
                } else {
                //위치이동형
                	currentIdx = undefined;
                	
                    var i;
                    for (i = 0; i < jump; i += 1) {
                        repeatCurrentItem = $item.filter(':first');
                        $item.filter(':last').after($item.filter(':first'));
                        resetItem();
                        
                        if (currentIdx === undefined) currentIdx = parseInt(repeatCurrentItem.data('idx')); //왼쪽 하나만 지정하기위해 반목문 안에서 한번만 실행
                    }
                    
                    $itemContainer.css(dir, -distance * (max - jump) + 'px'); //모션 시작위치 강제 이동
                    
                    sortItem = sort; //아이템 idx 순서로 재정렬하여 일반형으로 변경
                }
            } else {
                //일반형, 양끝에선 정지
                currentIdx = count = (max > count) ? count + jump : (isFirst) ? min : max;
            }

            //모션 시작
            motion(-distance * count);

            //console.log('right : ' + currentIdx, count, -distance * count);
            
            //외부 확장 함수 호출
            if (exDown !== undefined) exDown(currentIdx, $container);
            if (exDot !== undefined) exDot(currentIdx, $container);
        }
        
        //도트
        function dot(idx, spd) {
            count = idx;
            
            motion(-distance * count, spd);
            
            if (exDot !== undefined) exDot(idx, $container);
        }

        //아이템 리스트 리셋
        function resetItem() {
           $item = $(dataDefault.item);
           itemTotal = $item.length;
        }

        //모션
        function motion(pos, spd) {
            var sp = (spd !== undefined) ? spd : speed;
            
            showAtag();
                   
            if (direction === 'horizontal') {
                $itemContainer.stop().animate( {'marginLeft': pos + "px"},
                                        {queue:false, duration:sp, easing: ease, complete:motionComplete}
                );  
            } else {
                $itemContainer.stop().animate( {'marginTop': pos + "px"},
                                        {queue:false, duration:sp, easing: ease, complete:motionComplete}
                );
            }
        }
        
        function motionComplete () {
            hideAtag();
            if ($dotA.length > 0) sortItem(); //도트 버튼이 없다면 range 에 의해 1개이상 아이템이 보일 때도 repeat 가능하므로 sort 시키지 않음
            if (exComplete !== undefined) exComplete(count, $container);
        }
        
        //위치 이동형 모션이 일어난 후 일반형으로 전환
        var sortItem = none;
        function none() {}
        function sort() {
            //idx 순서대로 정렬
            $item.each(function () {
                if ($(this).data('idx') === 0) return false;
                $itemContainer.append($(this));
            });
            
            resetItem();
            
            var dir = getCSSDirection();
            
            count = currentIdx;
            $itemContainer.css(dir, -distance * count);
            
            sortItem = none;
        }

        //방향에 따른 컨트롤할 CSS 반환            
        function getCSSDirection() {
            return (direction === 'horizontal') ? 'marginLeft' : 'marginTop';
        }

        //타이머
        function startTimer() {
            stopTimer();
            timerId = setInterval(timerFun, delay);
        }

        function stopTimer() {
            if (timerId !== undefined) {
                clearInterval(timerId);
                timerId = undefined;
            }
        }

        function timerFun() {
            if (direct === "down") {
                down();
            } else {
                up();
            }
        }
        
        //포커스에 의해 레이아웃 어그러짐 방지를 위해 range 밖 영역의 item A 태그 숨김
        function hideAtag() {
            var item = $item.filter(function (idx) {
                return (idx < count + range && count <= idx) ? false : $(this); //range 안에 속해있는 item 추출
            }).find('a').css('visibility', 'hidden');
        }
        
        //모션이 시작하면 숨겼던 아이템 A 태그 모두 노출
        function showAtag() {
            if ($item !== undefined) $item.find('a').css('visibility', 'visible');
        }

        //public
        this.init = function (data) {
            scope = this;
            
            //$(document).ready(function () { //2.2.1 삭제
                //중복 방지
                if ($(data.container).length > 0 && $(data.container).data('scope') !== undefined) $(data.container).data('scope').dispose();
                
                init(data);
                addEvent();
                
                //scope
                $container.data('scope', scope);
            //});
        };
        
        this.dispose = function () {
            if (direction === 'horizontal') {
                $itemContainer.stop().css({'marginLeft': 0 + "px"});
            } else {
                $itemContainer.stop().css({'marginTop': 0 + "px"});
            }
            
            stopTimer();
            
            $item.find('a').removeData('idx').css('visibility', '');
            $upA.off('.rolling');
            $downA.off('.rolling');
            $dotA.off('.rolling').removeData('idx');
            $container.off('.rolling').removeData('scope');
            $(window).off('.rolling');
            
            $container = undefined;
            $itemContainer = undefined;
            $item = undefined;
            $upA = undefined;
            $downA = undefined;
            $dotA = undefined;
            distance = undefined;
            range = undefined;
            jump = undefined;
            delay = undefined;
            speed = undefined;
            ease = undefined;
            isPlay = undefined;
            direction = undefined;
            itemTotal = undefined;
            count = 0;
            direct = 'down';
            isFirst = undefined;
            isRepeat = undefined;
            isFit = undefined;
            btnDisabledCls = undefined;
            timerId = undefined;
            exUp = undefined;
            exDown = undefined;
            exDot = undefined;
            exComplete = undefined;
        };
        
        this.reset = function () {            
            resetItem();
            
            //item에 고유넘버 'idx' 지정
            $item.each(function (idx) { $(this).data('idx', idx); });
            //dot에 고유넘버 'dix' 지정
            $dotA.each(function (idx) { $(this).data('idx', idx); });
            
            hideAtag();
            
            scope.change(0, 0);
        }
        
        this.remove = function (idx) {            
            $item.eq(idx).remove();
            resetItem();
            
            //console.log(count + range, itemTotal, range , itemTotal);
            if (count + range > itemTotal && range <= itemTotal) {
                count -= 1;
                motion(-distance * count);
            }
        };
        
        this.change = function (idx, spd) {
        	dot(idx, spd);
        	if (exDot !== undefined) exDot(idx, $container);
        }
        
        this.play = function () {
            isPlay = true;
            startTimer();
        };
        
        this.stop = function () {
            isPlay = false;
            stopTimer();
        };
        
        this.exUp = function (f) {
            exUp = f;
        };
        
        this.exDown = function (f) {
            exDown = f;
        };
        
        this.exDot = function (f) {
            exDot = f;
        };
        
        this.exComplete = function (f) {
            exComplete = f;
        };

    };//end Obj

    return wddoObj;
}(jQuery));

//get instance
if (jQuery.fn.getInstance === undefined) jQuery.fn.getInstance = function () { return this.data('scope'); };