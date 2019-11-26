/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 3.0.1
 * @since : 2013.10.22
 * 
 * history
 * 
 * 3.0.0 (2016.01.08) : fadein out 모션 추가 필요
 *                      fit 미지원, 'vertical' 미테스트, touch 미지원
 * 3.0.1 (2016.01.22) : dot() 에서 사용한 복제를 prev(), next() 에서 사용 하도록 추가
 *                      
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
* 3. repeat 와 상관없이 jump 보다 range 크면 dotA 클릭 시 보여지는 아이템 자연스럽지 못하여 clone() 이용
* 4. range 보다 jump 가 큰 경우는 없을 것이다.
* 5. itemTotal % jump 가 0 이 아닌 경우 dotA 는 의미가 없어진다. 그러므로 모두 숨김
* 
* var rollingData = {
*     container: '.ir_data > dl > dd',          //전체 영역 부모
*     itemContainer: '.ir_data .con01 > ul',    //리스트를 감싸고 있는 부모
*     item: '.ir_data .con01 > ul > li',        //리스트들
*     prevA: '.ir_data .btn > a:eq(1)',         //화살표 이전
*     nextA: '.ir_data .btn > a:eq(0)',         //화살표 다음
*     dotA: '.ir_data .dot > a',                //도트버튼
*     distance: 18,                             //클릭시 이동할 거리
*     range: 1,                                 //노출될 리스트 갯수
*     jump: 1,                                  //한번에 이동 할 갯수
*     delay: 5000,                              //자동롤링 시간
*     speed: 800,                               //모션 속도
*     direction: 'horizontal',                  //방향 [default: 'horizontal'], 'vertical'
*     ease: undefined,                          //모션 이징값, ex) 'easeOutQuart'
*     play: false,                              //자동 롤링 유무
*     repeat: false,                            //한 방향으로 무한 반복 유무
*     fit: false,                               //가로 폭이 유동적인지 유무
*     wait: false,                              //이동 중 이동 막을지 유무 
*     btnDisabledClass: 'noData',               //버튼 진행을 막을 클래스
*     dynamicDot: true,                         //인디케이터 생성 할지 유무
*     onClass: 'on'                             //인디케이터 활성화 클래스
* }
*   
*   var rolling = new Rolling();
*   rolling.init(rollingData);      //생성
*
*   rolling.dispose()               //파괴
*   rolling.reset()                 //리셋
*   rolling.change(idx, spd);       //리스트 변경, spd: 속도
*   rolling.play();                 //자동롤링 활성화
*   rolling.stop();                 //자동롤링 비활성화
*   rolling.exChange(function () {});  //확장 변경 콜백
*   rolling.exComplete(function () {}); //모션이 완료된 시점
*/
var Rolling = (function ($) {
    var wddoObj = function () {
        var scope,
            $container,
            $itemContainer,
            $item,
            $defaultItem,
            $cloneItem,
            $prevA,
            $nextA,
            $dotA,
            opts,
            defaults = defaultOptions(),    //기본값;
            isPlay,
            distance,
            itemTotal,
            posNum = 0,
            currentIdx = 0,
            limit,
            direct = 'next',
            timerId,
            exChange,
            exComplete;

        function defaultOptions() {
            return {
                range: 1,
                jump: 1,
                delay: 5000,
                speed: 800,
                ease: undefined,
                play: false,
                direction: 'horizontal',
                repeat: false,
                fit: false,
                wait: false,
                btnDisabledClass: undefined,
                dynamicDot: true,
                onClass: 'on'
            }
        }

        //init
        function init() {
            $container = (typeof opts.item === 'string') ? $(opts.container) : opts.container;
            $itemContainer = (typeof opts.itemContainer === 'string') ? $(opts.itemContainer) : opts.itemContainer;
            $item = (typeof opts.item === 'string') ? $(opts.item) : opts.item;
            $defaultItem = $item;
            $prevA = (typeof opts.prevA === 'string') ? $(opts.prevA) : opts.prevA;
            $nextA = (typeof opts.nextA === 'string') ? $(opts.nextA) : opts.nextA;
            $dotA = (typeof opts.dotA === 'string') ? $(opts.dotA) : opts.dotA;
            isPlay = opts.play;
            distance = (opts.fit && opts.direction === 'horizontal') ? $item.outerWidth() : opts.distance / opts.jump;
            itemTotal = $item.length;
            limit = (!opts.repeat) ? 'first' : undefined;
            opts.jump = Math.min(opts.range, opts.jump); //jump는 range 보다 클 수 없다.

            //scope
            $container.data('scope', scope);

            initDotA(); //dotA의 갯수 컨트롤(추가는 관여하지 않으나 jump 에 따라 숨김)
            addEvent();
            
            //포커스에 의해 레이아웃 어그러짐 방지를 위해 A 태그 숨김
            hideAtag();

            //item에 고유넘버 'idx' 지정
            $item.each(function (idx) { $(this).data('idx', idx); });
            //dot에 고유넘버 'dix' 지정
            $dotA.each(function (idx) { $(this).data('idx', idx); });

            if (isPlay) startTimer();   //자동 플레이라면 타이머 시작
        }

        //dotA 초기화
        function initDotA() {
            var dotList = ($dotA.is('a')) ? $dotA.parent() : $dotA;

            //자동생성 dotA (조건: 모체가될 1개는 존재해야함)
            if (opts.dynamicDot && $dotA.length > 0) {
                var cloneDot = dotList.eq(0).clone(); //존재하는 1개 복제
                var dotContainer = dotList.parent();

                dotContainer.empty(); //전부비움

                //복제를 붙여넣음
                $item.each(function (idx) {
                    dotContainer.append(cloneDot);
                    cloneDot = dotContainer.children().filter(':last').clone();
                });

                //dotList 초기화
                dotList = dotContainer.children();

                //첫번째 활성화 클래스 추가
                dotList.removeClass(opts.onClass).eq(0).addClass(opts.onClass);
                
                //$dotA 초기화
                $dotA = ($dotA.is('a')) ? dotList.children() : dotList;
            }

            //리스트 개수가 jump 와 맞지 않으면 dotA 모두 숨김
            if (itemTotal % opts.jump !== 0) {
                dotList.hide();
                return;
            }

            //dot의 갯수 숨김
            dotList.each(function (idx) {
                if (0 !== idx % opts.jump) $(this).hide();
            });

            //오버되는 dot 정리
            if (opts.range > opts.jump) {
                dotList.filter(function (idx) {
                    return (idx > itemTotal - ((opts.repeat) ? 1 : opts.range))
                }).hide();
            }
        }

        //이벤트
        function addEvent() {            
            //이전 화살표 클릭이벤트
            $prevA.off('.rolling').on('click.rolling', function (e) {
                if (opts.btnDisabledClass !== undefined && $prevA.hasClass(opts.btnDisabledClass)) return; //play:true로 이동 시 repeat 하고 next, prev 버튼 시엔 이동을 막을 경우를 위해 prev() 함수에서 빼냄
                if (limit === 'first') return; //이미 first 이면 더이상 진행 막음

                prev();
                
                e.preventDefault();
            });
          
            //다음 화살표 클릭이벤트
            $nextA.off('.rolling').on('click.rolling', function (e) {
                if (opts.btnDisabledClass !== undefined && $nextA.hasClass(opts.btnDisabledClass)) return; //play:true로 이동 시 repeat 하고 next, prev 버튼 시엔 이동을 막을 경우를 위해 prev() 함수에서 빼냄
                if (limit === 'last') return; //이미 last 이면 더이상 진행 막음

                next();

                e.preventDefault();
            });
                        
            //도트 버튼 버튼이벤트
            $dotA.off('.rolling').on('click.rolling', function (e) {
                var target = $(e.currentTarget),
                    id = target.data('idx');

                dot(id);

                e.preventDefault();
            });

            //컨테이너 마우스 이벤트
            $container.off('.rolling').on('mouseenter.rolling focusin.rolling', function (e) {
                if (isPlay) stopTimer();
            });
            
            $container.off('.rolling').on('mouseleave.rolling focusout.rolling', function (e) {
                if (isPlay) startTimer();
            });
            
            //리사이징
            $(window).off('.rolling').on('resize.rolling', function (e) {
                /*
                if (opts.fit && opts.direction === 'horizontal') {
                    distance = $item.outerWidth();
                    
                    motion(-distance * posNum, 0);
                }
                */
            });
            
            //터치이벤트
            var touchPos, touchStartPos, touchMovePos;
            $itemContainer.off('.rolling').on('touchstart.rolling', function (e) {
                if (event.touches.length === 1) touchStartPos = event.touches[0].screenX;
            });
            
            $itemContainer.off('.rolling').on('touchmove.rolling', function (e) {
                if (event.touches.length === 1) touchMovePos = event.touches[0].screenX;
            });
            
            $itemContainer.off('.rolling').on('touchend.rolling', function (e) {
                touchPos = touchMovePos - touchStartPos;
                
                if (isNaN(touchPos)) return;
                
                if (touchPos > 0) {
                    prev();
                } else if (touchPos < 0) {
                    next();
                }

                touchStartPos = undefined;
                touchMovePos = undefined;
            });
        }

        //이전
        function prev() {
            if (opts.wait && $itemContainer.filter(':animated').length > 0) return;
            if (itemTotal <= opts.range) return;

            direct = 'prev';
            
            var idx = getIndex(); //idx 결정

            checkLimit(idx); //limit 설정

            currentIdx = idx; //활성화 저장

            readyItem(posNum);  //오른쪽 끝 이동가능 갯수 만큼 앞으로 준비 (ppp더블클릭 대응)
            fixPos(-distance * posNum); //늘어난 갯수에 의해 오른쪽으로 밀린것을 왼쪽으로 밈
            
            motion(0); //margin 을 0 으로 모션이동

            if (exChange !== undefined) exChange(currentIdx, $container, {limit: limit, direct: direct});
        }

        //다음
        function next() {
            if (opts.wait && $itemContainer.filter(':animated').length > 0) return;
            if (itemTotal <= opts.range) return;

            if ($itemContainer.filter(':animated').length > 0) motionComplete(); //ppp더블클릭 대응

            direct = 'next';
            
            var idx = getIndex(); //idx 결정

            checkLimit(idx); //limit 설정

            currentIdx = idx; //활성화 저장

            fixPos(0); //모션 시작위치 강제 이동

            //모션 시작
            motion(-distance * posNum); //margin 을 distance 만큼 왼쪽으로 모션 이동

            //외부 확장 함수 호출
            if (exChange !== undefined) exChange(currentIdx, $container, {limit: limit, direct: direct});
        }

        //도트.. prev(), next() 토대로 작성
        function dot(idx, spd) {
            if (opts.wait && $itemContainer.filter(':animated').length > 0) return;
            if (itemTotal <= opts.range) return;
            if (idx === currentIdx) return; // 활성화 클릭 방지

            direct = (currentIdx > idx) ? 'prev' : 'next'; //이동 방향 결정

            posNum = opts.jump; //이동 간격 결정

            checkLimit(idx); //limit 설정

            clearClone(); //복제된 아이템 삭제

            switchItem(idx); //원하는 아이템을 맨뒤로 보냄 , 원하는 아이템을 현재 오른쪽에 삽입 (이전 currentIdx 필요하므로 currentIdx 결정전에 호출)

            currentIdx = idx;

            if (direct === 'prev') {
                readyItem(posNum);  //맨뒤로 보낸 것을 맨 앞으로 당김
                fixPos(-distance * posNum); //왼쪽으로 밀고

                motion(0); //오른쪽으로 모션
            } else if (direct === 'next') {
                fixPos(0);  //0에 위치 시키고

                motion(-distance * posNum); //왼쪽으로 모션
            }

            if (exChange !== undefined) exChange(currentIdx, $container, {limit: limit, direct: direct});
        }

        //prev(), next() 시 변화전인 currentIdx 가지고 상황에 맞게 idx, posNum 결정하여 반환하는 함수
        function getIndex() {
            var idx;

            if (direct === 'prev') {
                if (opts.repeat) {
                    idx = (opts.repeat) ? parseInt($item.eq(itemTotal - opts.jump).data('idx')) : currentIdx - opts.jump;
                    posNum = opts.jump; //이동 칸수
                } else {
                    var go = currentIdx - opts.jump; //목표치
                    var min = 0; //이동 가능한 마지막 인덱스

                    idx = (go < min) ? min : go;
                    posNum = (go < min) ? Math.min(currentIdx, itemTotal % opts.jump) : opts.jump; //true 면(한계를 넘기면) 넘는 갯수 만큼만 제외한 만큼만 이동, false 면 지정한 이동 거리만 큼 
                    //Math.min(currentIdx, 체크 한 이유는 의도치 않게 jump 가 2 인데 2의 배수가 아닌 위치에 있을 경우를 대비
                }
            } else if (direct === 'next') {
                if (opts.repeat) {
                    idx = parseInt($item.eq(opts.jump).data('idx'));
                    posNum = opts.jump; //이동 칸수
                } else {
                    var go = currentIdx + opts.jump; //목표치
                    var max = itemTotal - opts.range; //이동 가능한 마지막 인덱스

                    idx = (go > max) ? max : go;
                    posNum = (go > max) ? Math.min(itemTotal - go, itemTotal % opts.jump) : opts.jump; //true 면(한계를 넘기면) 넘는 갯수 만큼만 제외한 만큼만 이동, false 면 지정한 이동 거리만 큼 
                    //Math.min(itemTotal - go, 체크 한 이유는 의도치 않게 jump 가 2 인데 2의 배수가 아닌 위치에 있을 경우를 대비
                }
            }

            return idx;
        }

        //모션없이 한번에 이동
        function fixPos(pos) {
            var dir = getCSSDirection();

            $itemContainer.css(dir, pos + 'px');
        }

        //레이아웃 준비, 인자 m : 미리 준비 할 갯수 지정 가능, 기본 opts.jump
        function readyItem(m) {
            if (itemTotal > opts.range) {

                // 반복을 위한 여유, opts.jump 갯수 만큼 미리 준비
                var i = 0;
                var max = m || opts.jump;
                for (; i < max; i += 1) {
                    $itemContainer.prepend($item.filter(':last'));

                    resetItem();
                }
            }
        }

        //아이템 리스트 리셋
        function resetItem() {
            $item = (typeof defaults.item === 'string') ? $(defaults.item) : $(defaults.item.context).find(defaults.item.selector);

            itemTotal = $item.length;
        }
        
        //dot() 에서 아이템 위치 교환
        function switchItem(goIdx) {
            var chooseItem;
            var copyItem1, copyItem2;

            if (direct === 'prev') {
                posNum = Math.min(currentIdx - goIdx, opts.range); //현재위치에서 목적 아이템 위치를 빼면 이동 거리가 나오는데 range 를 넘어서면 range 까지만 이동
                chooseItem = $item.filter(':last'); //readyItem 에 의해 마지막을 앞으로 보낼 것이므로 기준은 마지막

                $cloneItem = $defaultItem.slice(goIdx, goIdx + posNum).clone();

                chooseItem.after($cloneItem); //dot() prev 에선 switchItem() 다음에 readyItem() 에 의해 마지막을 앞으로 보낼 것이므로 무조건 마지막으로 보냄
            } else if (direct === 'next') {
                posNum = opts.range; //기본 이동거리 maximum 으로
                chooseItem = $item.eq(posNum);
                
                $item.slice(0, opts.range).each(function (idx) { //보여지는 범위안에
                    if ($(this).data('idx') === goIdx) { //목적 item 이 있다면
                        chooseItem = $(this); //목적 아이템 저장
                        posNum = idx; //목적 아이템 위치값을 이동거리로 저장
                        return false;
                    }
                });

                var copyItem1 = $defaultItem.slice(goIdx, itemTotal).clone();
                var copyItem2 = $defaultItem.slice(0, goIdx).clone();
                $cloneItem = $.merge(copyItem1, copyItem2);

                chooseItem.before($cloneItem); //원하는 아이템으로 현재 아이템 다음에 위치시킴
            }

            //복사 확인 테스트
            //if ($cloneItem !== undefined) $cloneItem.css('background-color', 'red');

            resetItem();
        }

        //모션이 일어난 후 아이템 순서대로 재정렬 (9,10,1,2,3,4,5,6,7,8)
        function alignItem() {
            //dot 에서 clone() 에 의해 추가된 아이템 삭제
            clearClone();

            $itemContainer.append($defaultItem.slice(currentIdx, itemTotal));
            $itemContainer.append($defaultItem.slice(0, currentIdx));
            fixPos(0);
            resetItem();
        }

        function clearClone() {
            if ($cloneItem !== undefined) {
                $cloneItem.remove();
                $cloneItem = undefined;
            }
        }

        //한계 체크(repeat 이 true 인 경우만 적용)
        function checkLimit(idx) {
            if (!opts.repeat) {
                if (idx >= itemTotal - opts.range && direct === 'next') {
                    //다음 버튼으로 이동 시
                    limit = 'last';
                } else if (idx === 0 && direct === 'prev') {
                    //이전 버튼으로 이동 시 
                    limit = 'first';
                } else {
                    limit = undefined;
                }
            }
        }

        //모션
        function motion(pos, spd) {
            var sp = (spd !== undefined) ? spd : opts.speed;
            
            showAtag();
                   
            if (opts.direction === 'horizontal') {
                $itemContainer.stop().animate( {'marginLeft': pos + "px"},
                                        {queue:false, duration:sp, easing: opts.ease, complete:motionComplete}
                );  
            } else {
                $itemContainer.stop().animate( {'marginTop': pos + "px"},
                                        {queue:false, duration:sp, easing: opts.ease, complete:motionComplete}
                );
            }
        }
        
        function motionComplete () {            
            alignItem();
            hideAtag();
            if (exComplete !== undefined) exComplete(currentIdx, $container, {limit: limit, direct: direct});
        }

        //방향에 따른 컨트롤할 CSS 반환            
        function getCSSDirection() {
            return (opts.direction === 'horizontal') ? 'marginLeft' : 'marginTop';
        }

        //타이머
        function startTimer() {
            stopTimer();
            timerId = setInterval(timerFun, opts.delay);
        }

        function stopTimer() {
            if (timerId !== undefined) {
                clearInterval(timerId);
                timerId = undefined;
            }
        }

        function timerFun() {
            if (direct === 'prev') {
                prev();
            } else if (direct === 'next') {
                next();
            }
        }
        
        //포커스에 의해 레이아웃 어그러짐 방지를 위해 range 밖 영역의 item A 태그 숨김
        function hideAtag() {
            if ($item !== undefined) $item.slice(opts.range, itemTotal).find('a').css('visibility', 'hidden');
        }
        
        //모션이 시작하면 숨겼던 아이템 A 태그 모두 노출
        function showAtag() {
            if ($item !== undefined) $item.find('a').css('visibility', 'visible');
        }

        //삭제 여부 반환
        function getDispose() {
            return ($container === undefined);
        }

        //public
        this.init = function (options) {
            opts = $.extend(defaults, options);

            //$(document).ready(function () {
                //중복 방지
                if ($(opts.container).length > 0 && $(opts.container).data('scope') !== undefined) $(opts.container).data('scope').dispose();

                scope = this;

                init();
            //});
        };
        
        this.dispose = function () {
            if (getDispose()) return;

            if (opts.direction === 'horizontal') {
                $itemContainer.stop().css({'marginLeft': 0 + "px"});
            } else {
                $itemContainer.stop().css({'marginTop': 0 + "px"});
            }
            
            stopTimer();
            clearClone();

            $item.find('a').removeData('idx').css('visibility', '');
            $prevA.off('.rolling');
            $nextA.off('.rolling');
            $dotA.off('.rolling').removeData('idx');
            $container.off('.rolling').removeData('scope');
            $(window).off('.rolling');
            
            $container = undefined;
            $itemContainer = undefined;
            $item = undefined;
            $defaultItem = undefined;
            $prevA = undefined;
            $nextA = undefined;
            $dotA = undefined;
            opts = undefined;
            defaults = defaultOptions();
            isPlay = undefined;
            distance = undefined;
            itemTotal = undefined;
            posNum = 0;
            currentIdx = 0;
            limit = undefined;
            direct = 'next';
            timerId = undefined;
            exChange = undefined;
            exComplete = undefined;
        };
        
        this.reset = function () {
            if (getDispose()) return;

            clearClone();

            resetItem();

            $defaultItem = $item;

            isPlay = opts.play;
            distance = (opts.fit && opts.direction === 'horizontal') ? $item.outerWidth() : opts.distance / opts.jump;
            itemTotal = $item.length;
            limit = (!opts.repeat) ? 'first' : undefined;
            opts.jump = Math.min(opts.range, opts.jump);
            
            initDotA();
            addEvent();

            hideAtag();

            $item.each(function (idx) { $(this).data('idx', idx); });
            $dotA.each(function (idx) { $(this).data('idx', idx); });

            if (isPlay) startTimer();
        }
        
        this.change = function (idx, spd) {
            if (getDispose()) return;

            dot(idx, spd);
        };
        
        this.play = function () {
            if (getDispose()) return;

            isPlay = true;
            startTimer();
        };
        
        this.stop = function () {
            if (getDispose()) return;

            isPlay = false;
            stopTimer();
        };
        
        this.exChange = function (f) {
            if (getDispose()) return;

            exChange = f;
        };
        
        this.exComplete = function (f) {
            if (getDispose()) return;

            exComplete = f;
        };

    };//end Obj

    return wddoObj;
}(jQuery));

//get instance
if (jQuery.fn.getInstance === undefined) jQuery.fn.getInstance = function () { return this.data('scope'); };