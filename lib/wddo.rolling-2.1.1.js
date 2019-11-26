/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 2.1.1
 * @since : 2013.10.22
 * 
 * history
 * 
 * 1.0 (2013.10.30) : -
 * 2.0 (2013.11.20) : 탭 포커스 문제로 visibility 속성 제어하여 레이아웃 깨지지 않게 수정에 의해 showAtag(), hideAtag() 추가
 * 2.1 (2013.12.10) : dispose() 추가, init() 중복 실행시 자동 dispose() 실행
 * 2.1.1 (2013.12.17) : 외부함수에서 적용 타깃 찾기 용의하게 ex.. 함수들에 두번째 인자에 $container 반환
 *                      fit 속성이 생성되었다. 이는 item 가로 사이즈가 브라우저 크기에 영향을 받아 distance 를 변화시켜 주고 위치를 잡아주도록 한다. horizontal 만 해당된다.
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
* 5. dotA 는 repeat 가 false 일때 정상으로 작동된다.
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
*     fit: false                                //가로 폭이 유동적인지 유무         기본값 false
* }
*   
*   var rolling = new Rolling();
*   rolling.init(rollingData);      //생성
*
*   rolling.dispose()               //파괴
*   rolling.remove(idx);            //리스트 삭제
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
            direct = "down",
            isFirst,
            isRepeat,
            isFit,
            timerId,
            exUp,
            exDown,
            exDot,
            exComplete;
            
        //init
        function init(data) {
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
            isRepeat = (data.repeat !== undefined) ? data.repeat : false;
            isFirst = (data.first !== undefined && !isRepeat) ? data.first : false;
            isFit = (data.fit !== undefined) ? data.fit : false;
            distance = (isFit && direction === 'horizontal') ? $item.outerWidth() : data.distance;
            itemTotal = $item.length;

            //focus problem. hidden A tag
            $dotA.add($upA).add($downA).data('rolling', true);
            hideAtag();

            if (isPlay) startTimer();   //timer start
        }
        
        //btn handler
        function addEvent() {            
            //arrow up
            $upA.on('click.rolling', function (e) {
                up();
                
                e.preventDefault();
            });
          
            //arrow down
            $downA.on('click.rolling', function (e) {
                down();

                e.preventDefault();
            });
            
            //dot btn
            if (!isRepeat) {
                $dotA.each(function (idx) {
                    $dotA.eq(idx).data('idx', idx);
                });
                
                $dotA.on('click.rolling', function (e) {
                    var target = $(e.currentTarget),
                        id = target.data('idx');

                    dot(id);

                    e.preventDefault();
                });
            }
                        
            //container handler
            $container.on('mouseenter.rolling', function (e) {
                if (isPlay) stopTimer();
            });
            
            $container.on('mouseleave.rolling', function (e) {
                if (isPlay) startTimer();
            });
            
            //resize
            $(window).on('resize.rolling', function (e) {
                if (isFit && direction === 'horizontal') {
                    distance = $item.outerWidth();
                    
                    motion(-distance * count, 0);
                }
            });
        }

        function up() {
            if (itemTotal <= range) return;
            
            direct = "up";
            
            var max = itemTotal - range;
            var min = 0;
            
            if (isRepeat) {
                if (count > min) {
                    count = count - jump;
                } else {
                    var i;
                    for (i = 0; i < jump; i += 1) {
                        $item.filter(':first').before($item.filter(':last'));
                        resetItem();
                    }
                    
                    var dir = (direction === 'horizontal') ? 'marginLeft' : 'marginTop';
                    $itemContainer.css(dir, -distance * jump + 'px');
                }
            } else {
                count = (count > min) ? count - jump : (isFirst) ? max : min;
            }
            
            motion(-distance * count);

            if (exUp !== undefined) exUp(count, $container);
            if (!isRepeat && exDot !== undefined) exDot(count, $container);
        }

        function down() {
            if (itemTotal <= range) return;
            
            direct = "down";
            
            var max = itemTotal - range;
            var min = 0;
            
            if (isRepeat) {
                if (max > count) {
                    count = count + jump;
                } else {
                    
                    var i;
                    for (i = 0; i < jump; i += 1) {
                        $item.filter(':last').after($item.filter(':first'));
                        resetItem();
                    }
                    
                    var dir = (direction === 'horizontal') ? 'marginLeft' : 'marginTop';
                    $itemContainer.css(dir, -distance * (max - jump) + 'px');
                    
                }
            } else {
                count = (max > count) ? count + jump : (isFirst) ? min : max;
            }

            motion(-distance * count);
            
            //console.log(count, distance, -distance * count)

            if (exDown !== undefined) exDown(count, $container);
            if (!isRepeat && exDot !== undefined) exDot(count, $container);
        }
        
        //dot
        function dot(idx) {
            count = idx;
            motion(-distance * count);
            
            if (exDot !== undefined) exDot(idx, $container);
        }

        //list reset
        function resetItem() {
           $item = $itemContainer.find('> li');
           itemTotal = $item.length;
        }

        //motion function
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
            if (exComplete !== undefined) exComplete(count, $container);
        }

        //timer
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
        
        //hidden A tag in item
        function hideAtag() {
            $item.filter(function (idx) {
                return (idx < count + range && count <= idx) ? false : $(this); //view item
            }).find('a').filter(function (idx) {
                return !$(this).data('rolling');    //not rolling element
            }).css('visibility', 'hidden');
        }
        
        //show A tag in item
        function showAtag() {
            $item.find('a').filter(function (idx) {
                return !$(this).data('rolling');
            }).css('visibility', 'visible');
        }

        //public
        this.init = function (data) {
            scope = this;
            
            $(document).ready(function () {
                //avoid duplication
                if ($(data.container).length > 0 && $(data.container).data('scope') !== undefined) $(data.container).data('scope').dispose();
                
                init(data);
                addEvent();
                
                //scope
                $container.data('scope', scope);
            });
        };
        
        this.dispose = function () {
            if (direction === 'horizontal') {
                $itemContainer.stop().css({'marginLeft': 0 + "px"});
            } else {
                $itemContainer.stop().css({'marginTop': 0 + "px"});
            }
            
            $item.find('a').removeData('rolling').css('visibility', '');
            $upA.off('.rolling').removeData('rolling');
            $downA.off('.rolling').removeData('rolling');
            $dotA.off('.rolling').removeData('rolling');
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
            timerId = undefined;
            exUp = undefined;
            exDown = undefined;
            exDot = undefined;
            exComplete = undefined;
        };
        
        this.remove = function (idx) {            
            $item.eq(idx).remove();
            resetItem();
            
            //console.log(count + range, itemTotal, range , itemTotal);
            if (count + range > itemTotal && range <= itemTotal) {
                count -= 1;
                motion(-distance * count);
            }
        };
        
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
