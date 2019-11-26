/*!
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 3.1.0
 * @since : 2013.10.22
 * 
 * history
 * 
 * 3.0.0  (2016.01.08) : fit 미테스트, 'vertical' 미테스트, touch 미지원
 * 3.0.1  (2016.01.22) : dot() 에서 사용한 clearClone(), switchItem()을 prev(), next() 에서 사용 하도록 추가 (repeat:true 시 range에 비해 아이템 갯수가 2배 이상 되지 않으면 이동시 리스트 중복은 제거되는 문제)
 *                       initDotA() 에서 오버되는 dot 에 대하여 hide() 하던 것을 remove()로 완전 삭제하도록 수정, jump에 의한 숨김은 currentIdx와 매칭을 위해 유지, 1개의 dotA 만 남으면 숨김
 * 3.0.2  (2016.01.25) : fade in out 지원, exChange, exComplete 전달 인자 모두 {} 형태로 변환
 *                       dotA dynamicDot:true 일때 <tag> 형태 받도록 수정
 *                       exComplete, exChange 확장을 옵션 형태로 변경 {onChange: fun, onCompelte: fun}
 *                       opts.onInit, saveActivate(), changeDot() 추가, dot 활성화 자동 변경
 * 3.0.3  (2016.03.03) : opts.dotA 에 대한 초기값적용, dotA 무리 안에 다른 요소가 있을 경우를 dotList.children() 로직에 대한 불일치 수정
 * 3.0.4  (2016.03.15) : resetItem() 에서 itemTotal 재정의시 잠시 복제된 item 갯수 제외, setReset()에 scope.setChange(0, 0); 위치 초기화 추가
 * 3.0.5  (2016.04.25) : repeat:true 상황에서 jump 보다 range가 큰경우 prev() 시 posNum 가 맞지 않는 부분 수정
 *                       switchItem() 에서 opts.range 를 ((opts.range > opts.jump) ? opts.jump : opts.range) 로 수정
 * 3.0.6  (2016.04.27) : dynamicDot: true 에 <tag 형태로 $doA가 들어가면 dotContainer 생성 하는데 setReset() 발생 시 initDotA() 에 의해 중복 생성을 방지 하도록 함
 *                       ins.setRefresh() 추가하여 hidden div 내부에서 ins.init() 된 rolling 에 대하여 크기 재정의 용도로 사용할 수 있게 수정
 * 3.0.7  (2016.06.01) : opts.autoCSS 추가하여 overflow:hidden 과 item 개만큼 width 변경
 *                       opts.controller 를 추가하여 속성이 있으면 자동으로 range 보다 item 갯수가 작으면 숨김
 * 3.0.8  (2016.07.05) : fadeIn(), fadeOut()에 spd 인자 적용하여 .setChange의 두번째인자 0일때 fade 효과 없도록 수정
 * 3.0.9  (2016.07.06) : changeArrowBtn() 추가하여 repeat 가 false 인 경우 첫 페이지 마지막 페이지 에서 화살표 숨김 기능 적용
 * 3.1.0  (2016.09.05) : opts.mouseEvent, opts.touchEvent 추가
 * 
 * Jo Yun Ki에 의해 작성된 rolling(는) 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.
 * 이 라이선스의 범위 이외의 이용허락을 얻기 위해서는 wddoddo@gmail.com을 참조하십시오.
 * 
 ********************************************************************************************
 ****************************************** rolling *****************************************
 ********************************************************************************************
 *
 * 1. jQuery 라이브러리 로드후 실행
 * 2. 롤링할 대상과 옵션을 Object 형태로 넘김
 * 3. repeat 와 상관없이 jump 보다 range 크면 dotA 클릭 시 보여지는 아이템 자연스럽지 못하여 clone() 이용
 * 4. range 보다 jump 가 큰 경우는 없을 것이다.
 * 5. itemTotal % jump 가 0 이 아닌 경우 dotA 는 의미가 없어진다. 그러므로 모두 숨김
 * 6. 옵션의 item은 resetItem() 에서 jQuery 속성 .selector 을 사용하기 때문에 selector 문자열을 권장하며 $('') 형태의 값이라면 find() 만을 이용하여 셀렉트하여야 한다.
 *    each 반복문 안에서 생성시 $(this) 안되면 $('대상:eq(' + idx + ')') 로 사용
 * 
 * var rollingData = {
 *     container: '.ir_data > dl > dd',          //전체 영역 부모
 *     itemContainer: '.ir_data .con01 > ul',    //리스트를 감싸고 있는 부모
 *     item: '.ir_data .con01 > ul > li',        //리스트들
 *     controller : '.ir_data .btn',             //컨트로러
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
 *     effect: 'slide',                          //이동효과 [default: 'slide'], 'fade'
 *     play: false,                              //자동 롤링 유무
 *     repeat: false,                            //한 방향으로 무한 반복 유무
 *     fit: false,                               //가로 폭이 유동적인지 유무
 *     wait: false,                              //이동 중 이동 막을지 유무 
 *     btnDisabledClass: 'noData',               //버튼 진행을 막을 클래스
 *     dynamicDot: true,                         //도트 생성 할지 유무
 *     onClass: 'on',                            //도트 활성화 클래스
 *     autoCSS: false,                           //자동으로 itemContainer 의 width 와 container 의 overflow 조정
 *     mouseEvent: true,                         //마우스 오버&아웃 시 play 정지&재생 여부
 *     touchEvent: true,                         //터치 이벤트 유무
 *     onInit: function (data) {},               //초기화 콜백
 *     onChange: function (data) {},             //변경 콜백
 *     onComplete: function (data) {}            //변경 완료 콜백
 * }
 *    
 *   var rolling = new WRolling();
 *   rolling.init(rollingData);      //생성
 *
 *   rolling.dispose()               //파괴
 *   rolling.setReset()              //현재 추가&삭제 item 토대로 다시 재정의
 *   rolling.setRefresh(idx)         //아이템 추가 & 삭제 없이 재정의, idx 있으면 해당 idx로 초기화
 *   rolling.setChange(idx, spd);    //리스트 변경, spd: 속도
 *   rolling.setPlay();              //자동롤링 활성화
 *   rolling.setStop();              //자동롤링 비활성화
 *   rolling.setNext(idx, spd);      //다음 이동
 *   rolling.setprev(idx, spd);      //이전 이동 
 *   rolling.getCurrent();           //현재 idx 반환
 *   rolling.getTotal();             //총갯수 반환 
 */
var WRolling = (function ($) {
    var wddoObj = function () {
        var scope,
            $container,
            $itemContainer,
            $item,
            $defaultItem,
            $cloneItem,
            $fadeItem,
            $activateItem,
            $controller,
            $prevA,
            $nextA,
            $dotA,
            $dotHtml,
            opts,
            defaults = defaultOptions(),    //기본값;
            isPlay,
            distance,
            itemTotal,
            posNum = 0,
            currentIdx = 0,
            limit,
            direct = 'next',
            timerId;

        function defaultOptions() {
            return {
                range: 1,
                jump: 1,
                delay: 5000,
                speed: 800,
                ease: undefined,
                effect: 'slide',
                play: false,
                direction: 'horizontal',
                repeat: false,
                fit: false,
                wait: false,
                btnDisabledClass: undefined,
                dynamicDot: true,
                onClass: 'on',
                autoCSS : false,
                mouseEvent: true,
                touchEvent: true,
                onInit: undefined,
                onChange: undefined,
                onComplete: undefined
            }
        }

        //init
        function init() {
            if (opts.dotA === undefined) opts.dotA = $($.fn); //opts.dotA 에 대한 기본값 //add 3.0.3
            if (opts.controller === undefined) opts.controller = $($.fn); //add 3.0.7

            $container = (typeof opts.item === 'string') ? $(opts.container) : opts.container;
            $itemContainer = (typeof opts.itemContainer === 'string') ? $(opts.itemContainer) : opts.itemContainer;
            $item = (typeof opts.item === 'string') ? $(opts.item) : opts.item;
            $defaultItem = $item;
            $controller = (typeof opts.controller === 'string') ? $(opts.controller) : opts.controller;
            $prevA = (typeof opts.prevA === 'string') ? $(opts.prevA) : opts.prevA;
            $nextA = (typeof opts.nextA === 'string') ? $(opts.nextA) : opts.nextA;
            $dotA = (typeof opts.dotA === 'string' && (opts.dotA.indexOf('<') !== 0 && !opts.dynamicDot)) ? $(opts.dotA) : opts.dotA;
            isPlay = opts.play;
            distance = (opts.fit && opts.direction === 'horizontal') ? $item.outerWidth() : opts.distance / opts.jump;
            itemTotal = $item.length;
            limit = (!opts.repeat) ? 'first' : undefined;
            opts.jump = Math.min(opts.range, opts.jump); //jump는 range 보다 클 수 없다.

            //scope
            if ($container.data('scope') === undefined) $container.data('scope', scope);

            initDotA(); //dotA의 갯수 컨트롤(추가는 관여하지 않으나 jump 에 따라 숨김)
            initLayout(); //기본 레이아웃 add 3.0.7
            addEvent();
            
            //포커스에 의해 레이아웃 어그러짐 방지를 위해 A 태그 숨김
            hideAtag();

            //item에 고유넘버 'idx' 지정
            $item.each(function (idx) { $(this).data('idx', idx); });
            //dot에 고유넘버 'dix' 지정
            $dotA.each(function (idx) { $(this).data('idx', idx); });

            if (isPlay) startTimer();   //자동 플레이라면 타이머 시작

            saveActivate(); //활성화 저장

            changeDot(); //dot 변경
            changeArrowBtn(); //arrow 변경

            //외부 확장 함수 호출
            if (opts.onInit !== undefined) opts.onInit({opts: opts, idx: currentIdx, container: $container, activate: $activateItem, total: itemTotal, limit: limit, direct: direct});
        }

        //dotA 초기화
        function initDotA() {
            //태그형태로 넘어 왔을 경우 복제할 dotA 1개를 생성
            if (typeof opts.dotA === 'string' && opts.dotA.indexOf('<') === 0) {
                opts.dynamicDot = true;

                //<tag>형 opts.dotA 를 container 안에 마지막에 추가하고 $dotA 로 정의
                if ($dotHtml !== undefined && $dotHtml.length > 0) $dotHtml.remove(); //setReset() 시 다시 그리므로 이전 생성 삭제.. add 3.0.6
                $dotHtml = $(opts.dotA); //add add 3.0.6
                $container.append($dotHtml);
                $dotA = $container.children().last();

                //<tag>형 opts.dotA 가 자식에 가지고 있으면 최하단 자식을 $dotA 지정
                while ($dotA.children().length > 0) {
                    $dotA = $dotA.children();
                }

                //최종 $dotA 가 a 태그이고 li나 span으로 감싸여져 있는 것이 아니라면 <div>로 강제로 감쌈
                if ($dotA.is('a') && !$dotA.parent().is('li, span')) $dotA.wrapAll('<div>');
            }

            //dotList에 $dotA 대한 index 가질수 있는 부모 이거나(li, span) 자신의 형제 정의
            var dotList = ($dotA.is('a') && $dotA.parent().is('li, span')) ? $dotA.parent() : $dotA;

            if (dotList === undefined) return; //dotA에 대한 지정 없으면 아래 로직 사용안함

            //실제 dotA에 대한 부모
            var dotContainer = dotList.parent();

            //자동생성 dotA (위에서 1개 생성한것을 소스로 사용 & html 박혀있는 1개를 사용)
            if (opts.dynamicDot && $dotA.length > 0) {
                var cloneDot = dotList.eq(0).clone(); //존재하는 1개 복제
                
                dotContainer.empty(); //전부비움

                //복제를 붙여넣음
                $item.each(function (idx) {
                    dotContainer.append(cloneDot);
                    cloneDot = dotContainer.children().filter(':last').clone();
                });

                //dotList 초기화
                dotList = dotContainer.children();
            }

            //리스트 개수가 jump 와 맞지 않고 반복이면 dotA 모두 숨김, repeat: false 는 dotA 노출 되지만 1:1 대응 못할 수 있음
            if (itemTotal % opts.jump !== 0 && opts.repeat) {
                dotList.remove();
                return;
            }

            //jump에 따른 dot의 갯수 삭제
            dotList.each(function (idx) {
                if (0 !== idx % opts.jump) $(this).hide();
            });

            //오버되는 dot 정리
            if (opts.range > opts.jump) {
                dotList.filter(function (idx) {
                    return (idx > itemTotal - ((opts.repeat) ? 1 : opts.range))
                }).remove();
            }

            //재 초기화
            dotList = dotContainer.children();

            //최종적으로 보여지는 dot 가 1개이하면 숨김
            if (dotList.length <= 1) dotList.hide();

            //$dotA 초기화
            //$dotA가 a 태그이고 부모가 li, span 인 경우(정상적인)
            if ($dotA.is('a') && $dotA.parent().is('li, span')) {
                //정적인 dotA 아니라면
                if (!opts.dynamicDot) {
                    //일반적인 <tag> 형이 아닌 문자열 selector 이라면 $(opts.dotA), jQuery object 이면 opts.dotA  //add 3.0.3
                    $dotA = (typeof opts.dotA === 'string' && opts.dotA.indexOf('<') !== 0) ? $(opts.dotA) : opts.dotA;
                } else {
                    $dotA = dotList.children();
                }
            } else {
            // li, span 형태가 최종자식이면
                $dotA = dotList;
            }
        }

        //기본 레이아웃 조정 //add 3.0.7
        function initLayout() {
            if (opts.autoCSS && $item.length > 0) $container.css('overflow', 'hidden'); //add 3.0.7

            resetWidth(); //add 3.0.7

            //range 보다 item 작거나 같으면 컨트롤러 숨김
            if ($controller.length > 0) $controller.toggle(itemTotal > opts.range);
        }

        //clone() 아이템을 위한 가로 재정의 //add 3.0.7
        function resetWidth() {
            if (!opts.fit && opts.autoCSS) {
                //item 갯수 만큼 itemContainer width 늘림
                $itemContainer.css('width', $itemContainer.children().length * distance);    
            }
        }

        //이벤트
        function addEvent() {            
            //이전 화살표 클릭이벤트
            if ($prevA !== undefined) {
                $prevA.off('.rolling').on('click.rolling', function (e) {
                    e.preventDefault();

                    if (opts.btnDisabledClass !== undefined && $prevA.hasClass(opts.btnDisabledClass)) return; //play:true로 이동 시 repeat 하고 next, prev 버튼 시엔 이동을 막을 경우를 위해 prev() 함수에서 빼냄
                    if (limit === 'first') return; //이미 first 이면 더이상 진행 막음

                    prev();
                });
            }
          
            //다음 화살표 클릭이벤트
            if ($nextA !== undefined) {
                $nextA.off('.rolling').on('click.rolling', function (e) {
                    e.preventDefault();

                    if (opts.btnDisabledClass !== undefined && $nextA.hasClass(opts.btnDisabledClass)) return; //play:true로 이동 시 repeat 하고 next, prev 버튼 시엔 이동을 막을 경우를 위해 prev() 함수에서 빼냄
                    if (limit === 'last') return; //이미 last 이면 더이상 진행 막음

                    next();
                });
            }
                        
            //도트 버튼 버튼이벤트
            if ($dotA !== undefined) {
                $dotA.off('.rolling').on('click.rolling', function (e) {
                    var target = $(e.currentTarget),
                        id = target.data('idx');

                    dot(id);

                    e.preventDefault();
                });
            }

            $container.off('.rolling');

            if (opts.mouseEvent) { //add 3.1.0
                //컨테이너 마우스 이벤트
                $container.on('mouseenter.rolling focusin.rolling', function (e) {
                    if (isPlay) stopTimer();
                });
                
                $container.on('mouseleave.rolling focusout.rolling', function (e) {
                    if (isPlay) startTimer();
                });    
            }
            
            //리사이징
            $(window).off('.rolling').on('resize.rolling', function (e) {
                /*
                if (opts.fit && opts.direction === 'horizontal' && opts.range === 1 && opts.jump === 1) {
                    distance = $item.outerWidth() * opts.jump;
                    
                    fixPos(0);
                }
                */
            });
            
            //터치이벤트
            if (opts.touchEvent) {
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
                        prev();
                    } else if (touchPos < 0) {
                        next();
                    }

                    touchStartPos = undefined;
                    touchMovePos = undefined;
                });
            }
        }

        //이전
        function prev() {
            if (opts.wait && $itemContainer.filter(':animated').length > 0) return;
            if (opts.wait && opts.effect === 'fade' && $item.filter(':animated').length > 0) return;
            if (itemTotal <= opts.range) return;

            direct = 'prev';
            
            var idx = getIndex(); //idx 결정

            checkLimit(idx); //limit 설정

            fadeOut(); //위치 변경전 $item 으로 페이드 아웃 

            if (opts.repeat && itemTotal / opts.range < 2) {
                clearClone();
                switchItem(idx);
            }

            currentIdx = idx; //활성화 저장

            readyItem(posNum);  //오른쪽 끝 이동가능 갯수 만큼 앞으로 준비 (ppp더블클릭 대응)
            fixPos(-distance * posNum); //늘어난 갯수에 의해 오른쪽으로 밀린것을 왼쪽으로 밈
            
            motion(0); //margin 을 0 으로 모션이동

            fadeIn(); //위치 변경후 $item 으로 페이드 인
            
            saveActivate(); //활성화 저장

            changeDot(); //dot 변경
            changeArrowBtn(); //arrow 변경

            //외부 확장 함수 호출
            if (opts.onChange !== undefined) opts.onChange({opts: opts, idx: currentIdx, container: $container, activate: $activateItem, total: itemTotal, limit: limit, direct: direct});
        }

        //다음
        function next() {
            if (opts.wait && $itemContainer.filter(':animated').length > 0) return;
            if (opts.wait && opts.effect === 'fade' && $item.filter(':animated').length > 0) return;
            if (itemTotal <= opts.range) return;

            if ($itemContainer.filter(':animated').length > 0) motionComplete(); //ppp더블클릭 대응

            direct = 'next';
            
            var idx = getIndex(); //idx 결정

            checkLimit(idx); //limit 설정

            fadeOut(); //위치 변경전 $item 으로 페이드 아웃 

            if (opts.repeat && itemTotal / opts.range < 2) {
                clearClone();
                switchItem(idx);
            }

            currentIdx = idx; //활성화 저장

            fixPos(0); //모션 시작위치 강제 이동

            //모션 시작
            motion(-distance * posNum); //margin 을 distance 만큼 왼쪽으로 모션 이동

            fadeIn(); //위치 변경후 $item 으로 페이드 인

            saveActivate(); //활성화 저장

            changeDot(); //dot 변경
            changeArrowBtn(); //arrow 변경

            //외부 확장 함수 호출
            if (opts.onChange !== undefined) opts.onChange({opts: opts, idx: currentIdx, container: $container, activate: $activateItem, total: itemTotal, limit: limit, direct: direct});
        }

        //도트.. prev(), next() 토대로 작성
        function dot(idx, spd) {
            if (opts.wait && $itemContainer.filter(':animated').length > 0) return;
            if (opts.wait && opts.effect === 'fade' && $item.filter(':animated').length > 0) return;
            if (itemTotal <= opts.range) return;
            if (idx === currentIdx) return; // 활성화 클릭 방지

            direct = (currentIdx > idx) ? 'prev' : 'next'; //이동 방향 결정

            posNum = opts.jump; //이동 간격 결정

            checkLimit(idx); //limit 설정

            fadeOut(spd); //위치 변경전 $item 으로 페이드 아웃 

            clearClone(); //복제된 아이템 삭제

            switchItem(idx); //원하는 아이템을 맨뒤로 보냄 , 원하는 아이템을 현재 오른쪽에 삽입 (이전 currentIdx 필요하므로 currentIdx 결정전에 호출)

            currentIdx = idx;

            if (direct === 'prev') {
                readyItem(posNum);  //맨뒤로 보낸 것을 맨 앞으로 당김
                fixPos(-distance * posNum); //왼쪽으로 밀고

                motion(0, spd); //오른쪽으로 모션
            } else if (direct === 'next') {
                fixPos(0);  //0에 위치 시키고

                motion(-distance * posNum, spd); //왼쪽으로 모션
            }

            fadeIn(spd); //위치 변경후 $item 으로 페이드 인

            saveActivate(); //활성화 저장

            changeDot(); //dot 변경
            changeArrowBtn(); //arrow 변경

            //외부 확장 함수 호출
            if (opts.onChange !== undefined) opts.onChange({opts: opts, idx: currentIdx, container: $container, activate: $activateItem, total: itemTotal, limit: limit, direct: direct});
        }

        //prev(), next() 시 변화전인 currentIdx 가지고 상황에 맞게 idx, posNum 결정하여 반환하는 함수
        function getIndex() {
            var idx;

            if (direct === 'prev') {
                if (opts.repeat) {
                    idx = parseInt($item.eq(itemTotal - opts.jump).data('idx'));
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
                var max = (m !== undefined) ? m : opts.jump;
                for (; i < max; i += 1) {
                    $itemContainer.prepend($item.filter(':last'));

                    resetItem();
                }
            }
        }

        //아이템 리스트 리셋
        function resetItem() {
            //.children(), .eq() 같은 메소드 지원하지 않으니 selector 문자열이 아니라 면 find()만 지원함
            $item = (typeof defaults.item === 'string') ? $(defaults.item) : $(defaults.item.context).find(defaults.item.selector);

            itemTotal = $item.length - (($cloneItem !== undefined) ? $cloneItem.length : 0); //modify 3.0.4
        }
        
        //dot() 에서 아이템 복제 교환
        function switchItem(goIdx) {
            var chooseItem;
            var copyItem1, copyItem2;

            if (direct === 'prev') {
                //modify 3.0.5
                posNum = (opts.repeat) ? ((opts.range > opts.jump) ? opts.jump : opts.range) : Math.min(Math.abs(currentIdx - goIdx), opts.range); //현재위치에서 목적 아이템 위치를 빼면 이동 거리가 나오는데 range 를 넘어서면 range 까지만 이동
                chooseItem = $item.filter(':last'); //readyItem 에 의해 마지막을 앞으로 보낼 것이므로 기준은 마지막

                copyItem1 = $defaultItem.slice(goIdx, Math.min(goIdx + posNum, itemTotal)).clone();
                copyItem2 = $defaultItem.slice(0, posNum - copyItem1.length).clone(); //copyItem1 에서 모자란 갯수만큼 복제

                $cloneItem = (copyItem1.length === posNum) ? copyItem1 : $.merge(copyItem1, copyItem2); //모자라지 않으면 copyItem1 만

                chooseItem.after($cloneItem); //dot() prev 에선 switchItem() 다음에 readyItem() 에 의해 마지막을 앞으로 보낼 것이므로 무조건 마지막으로 보냄
            } else if (direct === 'next') {
                posNum = (opts.repeat) ? opts.range : opts.range; //기본 이동거리 maximum 으로
                chooseItem = $item.eq(posNum);
                
                $item.slice(0, posNum).each(function (idx) { //보여지는 범위안에
                    if ($(this).data('idx') === goIdx) { //목적 item 이 있다면
                        chooseItem = $(this); //목적 아이템 저장
                        posNum = idx; //목적 아이템 위치값을 이동거리로 저장
                        return false;
                    }
                });

                copyItem1 = $defaultItem.slice(goIdx, itemTotal).clone();
                copyItem2 = $defaultItem.slice(0, goIdx).clone();

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
            sp = (opts.effect === 'fade') ? 0 : sp;
            
            showAtag();
            resetWidth();
                   
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

        //페이드 아웃 (사라지는 아이템 복사해서 위치 영향안받게 absolute 적용 후 투명도 0 모션 
        function fadeOut(spd) {
            var sp = (spd !== undefined) ? spd : opts.speed;

            if (opts.effect === 'fade') {
                //fadeComplete 에서 실행하던 초기화
                fadeResetItem($item.filter(':animated'));
                fadeRemoveItem();

                $fadeItem = $item.slice(0, opts.range).clone();

                $fadeItem.filter(function (idx) {
                    fadeFloatItem($fadeItem, idx, 1); //정렬형태로 변경 

                    return true;
                }).animate({
                    'opacity' : 0
                }, {queue: false, duration: sp});
            }
        }

        //페이드 인 (등장 하는 아이템, 기존 slide 아이템에 투명도만 조정)
        function fadeIn(spd) {
            var sp = (spd !== undefined) ? spd : opts.speed;

            if (opts.effect === 'fade') {
                var target = $item.slice(0, opts.range);

                target.filter(function (idx) {
                    fadeFloatItem(target, idx, 0); //정렬형태로 변경 

                    return true;
                }).animate({
                    'opacity' : 1
                }, {queue: false, duration: sp, complete: function () {
                    if (target !== undefined) { //1회만
                        target = undefined;

                        fadeComplete();
                    }
                }});

                $itemContainer.append($fadeItem);
            }
        }

        //강제로 가로형태로
        function fadeFloatItem(target, idx, opacity) {
            target.clearQueue().stop().eq(idx).css({
                'position' : 'absolute',
                'left' : (idx * Math.abs(opts.distance / opts.jump)) + $item.position().left,
                'opacity' : opacity
            });
        }

        //페이드 초기로 css 돌려놓기
        function fadeResetItem(target) {
            target.clearQueue().stop().css({
                'position' : 'static',
                'left' : '',
                'opacity' : ''
            });
        }

        //페이드인 미리 삭제
        function fadeRemoveItem() {
            if ($fadeItem !== undefined) { //1회만
                $fadeItem.clearQueue().stop().remove();
                $fadeItem = undefined;
            }
        }
        
        function motionComplete() {            
            alignItem();
            hideAtag();
            resetWidth(); //add 3.0.7

            if (opts.effect !== 'fade') complete();
        }

        function fadeComplete() {
            fadeResetItem($item);    //아이템 초기화 (absolute -> static)
            fadeRemoveItem();           

            if (opts.effect === 'fade') complete();
        }

        function complete() {
            saveActivate();

            if (opts.onComplete !== undefined) opts.onComplete({opts: opts, idx: currentIdx, container: $container, activate: $activateItem, total: itemTotal, limit: limit, direct: direct});
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
        
        //활성화 아이템 저장
        function saveActivate() {
            if ($item !== undefined) $activateItem = $item.slice(0, opts.range);
        }

        //dot 변경
        function changeDot() {
            if ($dotA !== undefined) $dotA.removeClass(opts.onClass).eq(currentIdx).addClass(opts.onClass);
        }

        //arrow 변경, repeat 가 false 인 경우 첫 페이지 마지막 페이지 에서 화살표 숨김 //add 3.0.9
        function changeArrowBtn() {
            if (!opts.repeat && $prevA !== undefined && $nextA !== undefined) {
                if ($prevA.length > 0 && $nextA.length > 0) {
                    var currentPage = (Math.floor(currentIdx / opts.range) + 1);
                    var totalPage = (Math.floor((itemTotal - 1) / opts.range) + 1);

                    $prevA.show();
                    $nextA.show();

                    if (currentPage === 1) $prevA.hide();
                    if (currentPage === totalPage) $nextA.hide();
                }
            }
        }

        //포커스에 의해 레이아웃 어그러짐 방지를 위해 range 밖 영역의 item A 태그 숨김
        function hideAtag() {
            if ($item !== undefined) $item.slice(opts.range, itemTotal)/*.find('a')*/.css('visibility', 'hidden');
        }
        
        //모션이 시작하면 숨겼던 아이템 A 태그 모두 노출
        function showAtag() {
            if ($item !== undefined) $item/*.find('a')*/.css('visibility', 'visible');
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
            $controller = undefined;
            $prevA = undefined;
            $nextA = undefined;
            $dotA = undefined;
            $dotHtml = undefined;
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
        };
        
        this.setRefresh = function (idx) {
            var startIdx = (idx === undefined) ? currentIdx : idx;
            scope.setChange(0, 0);
            scope.setReset();
            scope.setChange(startIdx, 0);
        }

        this.setReset = function () {
            if (getDispose()) return;

            //위치 0으로 초기화 //add 3.0.4
            direct = (currentIdx > 0) ? 'prev' : 'next'; //이동 방향 결정

            posNum = opts.jump; //이동 간격 결정

            checkLimit(0); //limit 설정

            clearClone(); //복제된 아이템 삭제

            currentIdx = 0; //활성화 저장

            showAtag();

            resetItem();

            $defaultItem = $item;

            fixPos(0); //모션 시작위치 강제 이동
            //위치 0으로 초기화 //add 3.0.4

            /*
            //3.0.4의 0으로 초기화 추가전 있던 로직, 위쪽 로직에 흡수
            clearClone();
            resetItem();
            $defaultItem = $item;
            */

            isPlay = opts.play;
            distance = (opts.fit && opts.direction === 'horizontal') ? $item.outerWidth() : opts.distance / opts.jump;
            itemTotal = $item.length;
            limit = (!opts.repeat) ? 'first' : undefined;
            opts.jump = Math.min(opts.range, opts.jump);
            
            initDotA();
            changeDot(); //dot 변경
            changeArrowBtn(); //arrow 변경
            initLayout();
            addEvent();

            hideAtag();
            
            $item.each(function (idx) { $(this).data('idx', idx); });
            $dotA.each(function (idx) { $(this).data('idx', idx); });

            if (isPlay) startTimer();

            //연결된 함수 재호출 //add 3.0.4
            if (opts.onInit !== undefined) opts.onInit({opts: opts, idx: currentIdx, container: $container, activate: $activateItem, total: itemTotal, limit: limit, direct: direct});
            if (opts.onChange !== undefined) opts.onChange({opts: opts, idx: currentIdx, container: $container, activate: $activateItem, total: itemTotal, limit: limit, direct: direct});
            if (opts.onComplete !== undefined) opts.onComplete({opts: opts, idx: currentIdx, container: $container, activate: $activateItem, total: itemTotal, limit: limit, direct: direct});
        }
        
        this.setChange = function (idx, spd) {
            if (getDispose()) return;

            dot(idx, spd);
        };
        
        this.setPlay = function () {
            if (getDispose()) return;

            isPlay = true;
            startTimer();
        };
        
        this.setStop = function () {
            if (getDispose()) return;

            isPlay = false;
            stopTimer();
        };

        this.setNext = function (idx, spd) {
            if (getDispose()) return;

            var idx = currentIdx + 1;
            dot(Math.min(itemTotal - 1, idx), spd);
        };

        this.setPrev = function (idx, spd) {
            if (getDispose()) return;

            var idx = currentIdx - 1;
            dot(Math.min(0, idx), spd);
        };

        this.getCurrent = function () {
            if (getDispose()) return;

            return currentIdx;
        };

        this.getTotal = function () {
            if (getDispose()) return;
            
            return itemTotal;
        };

    };//end Obj

    return wddoObj;
}(jQuery));

//get instance
if (jQuery.fn.getInstance === undefined) jQuery.fn.getInstance = function () { return this.data('scope'); };