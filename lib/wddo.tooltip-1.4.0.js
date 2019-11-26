/*!
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.4.0
 * @since : 2016.03.03
 *
 * history
 *
 * 1.0   (2016.03.03) : -
 * 1.1   (2016.04.18) : 리스트형태의 컨텐츠의 경우 여러 인스턴트 생성하지 않고 한개로 여러개 컨트롤 하도록 함, 서버개발과 타이밍 문제 해결
 * 1.2   (2016.05.19) : target 과 content 의 빠른 마우스 이동시 fade 에 의한 opacity 트윈중 중간에서 멈춰 버리는 증상 수정
 * 1.3   (2016.08.23) : data('idx') 를 data('tooltip-idx') 로 변경, 스크롤(overlfow:hidden) 내부영역 영향 받지 않도록 opts.dynamic 추가, 관련 옵션(dynamicScrollClass, dynamicPopClass) 추가
 *                      툴팁 내부 닫기버튼 대응토록 opts.closeClass 추가
 *                      content 마우스 이벤트 받지 않도록 설정할 수 있는 opts.isContentEvent 추가
 * 1.3.1 (2017.07.25) : targetA.length 선행체크로 opts.selector 에 의미가 없어져 삭제함
 *                      .setInstance() 적용, targetA, content 변수 삭제하고 getTarget(), getContent() 로 대체
 * 1.4.0 (2017.09.04) : dynamic 아니더라도 닫기버튼 적용토록 수정, 모바일 대응 (hasTouch)
 *                      opts.tipClass 추가, opts.onOpen, opts.onClose 추가
 *
 ********************************************************************************************
 ***************************************** WTooltip ******************************************
 ********************************************************************************************
 *
 * 1. content 마우스 오버시 유지 되는 툴팁 형태 (opts.isContentEvent: false 으로 content(fade 효과 없어짐) 마우스 오버기능 삭제 가능하도록 1.3에 수정됨)
 * 2. 버튼타겟 안에 팝업컨테츠 가 있으면 안된다.
 * 
 * var instance = new WTooltip();
 * instance.init(options);                   //초기화
 *
 * @param options    ::: 설정 Object 값
 *
 * options
 *   target:Object = $('selector')           //텝 메뉴 버튼 jQuery Object
 *   selector:String = 'li > a'              //on() 두번째 인자의 셀렉터
 *   content:Object = $('selector')          //적용할 컨텐츠 jQuery Object
 *   contentSelector:String = ''             //content 에 대한 세부 셀렉터
 *   delay:Number = 300                      //마우스 반응 딜레이 0.3초
 *   speed:Number = 100                      //등장&퇴장 속도 0.1초
 *   dynamic: false                          //스크롤 속 툴팁 대응(overflow:hidden) 유무
 *   dynamicScrollClass = 'sc_laypop_tool'   //overflow:hidden 대상 div
 *   dynamicPopClass = 'sc_laypop_txt'       //dynamic:true 따른 생성되는 툴팁 클래스명
 *   closeClass = 'close'                    //툴팁 속 닫기 버튼 클래스명
 *   isContentEvent = true                   //툴팁 마우스 이벤트 유무(false 시 fade효과 자동 삭제됨)
 *   tipClass = 'tooltip'                    //툴팁 기본 클래스
 *   onOpen:Function = function (data) {}    //열기 콜백 함수
 *   onClose:Function = function (data) {}   //닫기 콜백 함수
 *
 * method
 */
var WTooltip = (function ($) {
    var wddoObj = function (options) {
        var scope,
            //targetA, //del 1.3.1
            //content, //del 1.3.1
            actIdx,
            timeid, //버튼에서 컨텐츠로 가는 딜레이용
            timeid2, //컨텐츠에서 버튼으로 가는 딜레이용
            hasTouch = typeof window.ontouchstart !== 'undefined', //모바일 구분 //add 1.4.0
            opts,
            defaults = getDefaultOption(),
            init = function (options) {
                opts = $.extend(defaults, options);

                //targetA = (opts.selector === '') ? opts.target : opts.target.find(opts.selector); //del 1.3.1
                //content = (opts.contentSelector === '') ? opts.content : opts.content.find(opts.contentSelector); //del 1.3.1

                //if (targetA.length > 0 && opts.target.data('scope') === undefined) { //del 1.3.1
                if (opts.target.searchInstance('tooltip') === undefined) { //add 1.3.1
                    opts.target.setInstance(scope); //add 1.3.1

                    if (!opts.isContentEvent) opts.delay = opts.speed = 0; //opts.isContentEvent : false 시 자동 모션삭제 //add 1.3

                    addIdx();
                    initLayout();
                    initEvent();
                }
            };
        
        function getDefaultOption() {
            return {
                target : $($.fn),
                selector : '',
                content : $($.fn),
                contentSelector : '',
                delay : 200,
                speed : 100,
                dynamic: false,
                dynamicScrollClass : 'sc_laypop_tool',
                dynamicPopClass : 'sc_laypop_txt',
                closeClass : 'close',
                isContentEvent : true,
                tipClass : 'tooltip',
                onOpen : undefined,
                onClose : undefined
            };
        }
         
        function initLayout() {
            
        }

        function initEvent() {
            if (opts.selector === '') {
                opts.target.on((!hasTouch ? 'mouseenter.tooltip' : 'click.tooltip'), btnEnterListener);
                opts.target.on('mouseleave.tooltip', btnLeaveListener);
            } else {
                opts.target.on((!hasTouch ? 'mouseenter.tooltip' : 'click.tooltip'), opts.selector, btnEnterListener); //화면스크롤에 의해 닫힐때 마우스가 머무르는 모바일을 위해 click 이벤트 추가 //add 1.4.0 'click.tooltip'
                opts.target.on('mouseleave.tooltip', opts.selector, btnLeaveListener); //모바일시 바닦터치시 발생하므로 PC와 같이 사용가능
            }

            function btnEnterListener(e) {
                stopTimer2();

                var target = $(e.currentTarget);

                //content = (opts.contentSelector === '') ? opts.content : opts.content.find(opts.contentSelector); //del 1.3.1
                var content = getContent();

                //data('tooltip-idx') 없으면 초기화 셋팅
                if (target.data('tooltip-idx') === undefined) reset();

                //컨텐츠에서 다시 버튼올 올라갔을 때 idx 비교하여 닫지 않기 위해 저장
                var oldIdx = actIdx;

                //버튼의 고유 idx 를 얻어 content 갯수가 많으면 해당 content.eq(actIdx) 로 찾기 위함
                actIdx = parseInt(target.data('tooltip-idx'));

                //버튼에 leave 이벤트에서 발생한 타이머 보다 버튼에 다시 오버되었을 때에 타이머를 삭제
                if (oldIdx === actIdx) stopTimer();

                var oldContentDIV = content.not(':hidden');
                if (oldContentDIV.data('hit') === undefined && oldIdx !== actIdx) { //'hit' 은 data 가 있은건 컨텐츠에 마우스가 올라가 있을 때 저장됨
                    //console.log('close : old', content.not(':hidden'));
                    close(content.not(':hidden')); //열린 컨텐츠 중 지금 올린 컨텐츠가 아닌것 초기화, msg-error
                }
                
                //활성화할 버튼 선택, 갯수가 1개 이상이면 actIdx 통해 하나만 eq() 로 초이스
                var chooseContentDIV = content.eq(actIdx); //1개이면 어차피 actIdx 는 0 이므로 간소화
                //chooseContentDIV = (content.length > 1) ? content.eq(actIdx) : content; //remove 1.4.0
                chooseContentDIV.addClass(opts.tipClass);  //add 1.4.0 //touchmove 에서 팝업영역인지 구분 클래스
                if (chooseContentDIV.data('toooltip-idx') === undefined) chooseContentDIV.data('toooltip-idx', actIdx); //add 1.4.0 //콜백함수에서 변화하는 actIdx를 대응하기위해 컨텐츠에도 1회 저장

                //add 1.3
                if (opts.dynamic) {
                    createDynamicTooltip(chooseContentDIV); //body 아래 툴팁 생성
                    chooseContentDIV = $('.' + opts.dynamicPopClass); //바꿔치기
                } else {
                    //dynamic이 아니더라도 닫기버튼 적용 //add 1.4.0
                    chooseContentDIV.on('click.tooltip', '.' + opts.closeClass, function (e) {
                        stopTimer();
                        //console.log('close : closebtn');
                        close(chooseContentDIV);
                        
                        e.preventDefault();
                    });
                }

                //모션중이면 바로 보여짐
                if (chooseContentDIV.is(':animated')) chooseContentDIV.clearQueue().stop().show(); //add 1.2

                open(chooseContentDIV);
            }

            function btnLeaveListener(e) {
                var target = $(e.currentTarget);

                //content = (opts.contentSelector === '') ? opts.content : opts.content.find(opts.contentSelector); //del 1.3.1
                var content = getContent();

                //data('tooltip-idx') 없으면 초기화 셋팅
                if (target.data('tooltip-idx') === undefined) reset();

                //버튼의 고유 idx 를 얻어 content 갯수가 많으면 해당 content.eq(actIdx) 로 찾기 위함
                actIdx = parseInt(target.data('tooltip-idx'));

                //비 활성화할 버튼 선택, 갯수가 1개 이상이면 actIdx 통해 하나만 eq() 로 초이스
                var chooseContentDIV = content.eq(actIdx);
                //chooseContentDIV = (content.length > 1) ? content.eq(actIdx) : content; //remove 1.4.0

                //add 1.3
                if (opts.dynamic) {
                    chooseContentDIV = $('.' + opts.dynamicPopClass); //바꿔치기
                }

                chooseContentDIV.removeClass(opts.tipClass); //add 1.4.0 //touchmove 에서 팝업영역인지 구분 클래스

                //남은 타이머 걸려 있으면 삭제
                stopTimer();

                //버튼에서 컨텐츠로 이동시 약간의 시간텀을 줘 아웃 시 닫힘 방지
                timeid = setTimeout(function () {
                    //add 1.4.0 !chooseContentDIV.is(':hidden') 조건 추가하여 btnEnterListener > oldContentDIV > close() 닫은 후 발생 방지
                    if (!chooseContentDIV.data('hit') && !chooseContentDIV.is(':hidden')) close(chooseContentDIV); //c.1 
                }, opts.delay);
            }
        }

        //버튼에서 컨텐츠로 가는 딜레이용 타이머 삭제
        function stopTimer() {
            if (timeid !== undefined) {
                clearTimeout(timeid);
                timeid = undefined;
            }
        }

        //컨텐츠에서 버튼으로 가는 딜레이용 타이머 삭제
        function stopTimer2() {
            if (timeid2 !== undefined) {
                clearTimeout(timeid2);
                timeid2 = undefined;
            }
        }        

        //어려 다른 형제 태그와 섞여 있어도 고유의 idx 지정
        function addIdx() {
            getTarget().each(function (idx) {
                $(this).data('tooltip-idx', idx);
            });
        }

        //data('tooltip-idx') 지정 안되어 있으면 재지정
        function reset() {
            //targetA = $(targetA.selector);
            //content = $(content.selector);

            addIdx();
        }

        //컨텐츠 열기
        function open(cont) {
            if (opts.speed === 0) {
                cont.clearQueue().stop().show();
            } else {
                //cont.clearQueue().stop().fadeIn(opts.speed);
                cont.clearQueue().stop().filter(function () {
                    return parseInt(cont.css('opacity')) !== 1 //add 1.2
                }).fadeOut(0); //닫히고 있는데 open 발생하면 바로 숨김고 다음 fadeIn()을 준비 

                cont.fadeIn(opts.speed);
            }

            //add 1.2 //opts.dynamic:false 시 등록된 닫기버튼 'click.tooltip' 은 필요하므로 따로 삭제
            cont.off('mouseenter.tooltip mouseleave.tooltip');

            if (opts.isContentEvent) {
                //컨텐츠 마우스 오버&아웃 이벤트 1회 등록
                cont.on('mouseenter.tooltip', function (e) { //modify 1.2 one > on
                    cont.off('mouseenter.tooltip'); //add 1.2
                    $(this).data('hit', true);
                });

                cont.on('mouseleave.tooltip', function (e) { //modify 1.2 one > on
                    cont.off('mouseleave.tooltip'); //add 1.2

                    //남은 타이머 걸려 있으면 삭제
                    stopTimer2();

                    cont.removeData('hit'); //timeid2가 버튼이 먼저 오버되어 삭제되었을 경우 'hit'이 삭제가 안될것을 방지 하기 위해 미리 삭제함. c.1 의 정상 작동을 위해

                    //버튼에서 컨텐츠로 이동시 약간의 시간텀을 줘 아웃 시 닫힘 방지
                    timeid2 = setTimeout(function () {
                        //console.log('close : setTimeout2');
                        close(cont); //mofify 1.2 $(this) > cont, this 를 window로 인식 하므로 수정
                    }, opts.delay);
                });
            }

            //모바일 대응 //add 1.4.0
            if (hasTouch) {
                $(document).on('touchmove.tooltip', function (e) {
                    if ($(e.target).closest('.' + opts.tipClass).length > 0) return;

                    stopTimer();
                    //console.log('close : touchmove');
                    close(cont);
                });
            }

            var idx = cont.data('toooltip-idx');
            if (opts.onOpen !== undefined) opts.onOpen({btn: getTarget().eq(idx), tooltip: cont, idx: idx});
        }

        //컨텐츠 닫기
        function close(cont) {
            //console.log('close');
            cont.off('.tooltip'); //닫기버튼 click과 open() 에서 추가된 mouseenter, mouseleave 이벤트 삭제 //add 1.4.0
            $(document).off('touchmove.tooltip'); //모바일 대응하는 터치 이벤트 삭제 //add 1.4.0

            if (opts.speed === 0) {
                cont.clearQueue().stop().show().hide().removeData('hit');
                if (opts.dynamic) removeDynamicTooltip(cont); //add 1.3
            } else {
                cont.clearQueue().stop().show().fadeOut(opts.speed, function () {
                     if (opts.dynamic) removeDynamicTooltip(cont); //fade 모션후 삭제 //add 1.3
                }).removeData('hit');    
            }

            var idx = cont.data('toooltip-idx');
            if (opts.onClose !== undefined) opts.onClose({btn: getTarget().eq(idx), tooltip: cont, idx: idx});
        }
        
        //다이나믹 tip div 생성
        function createDynamicTooltip(pop) {
            $('.' + opts.dynamicPopClass).remove();

            //offset() 받아오기 위해
            pop.css('display', 'block'); 

            var div = $('<div class="'+ opts.dynamicPopClass +'">');
            div.css({
                'position' : 'absolute',
                'top' : pop.offset().top,
                'left' : pop.offset().left,
                'width' : pop.outerWidth(),
                'height' : pop.outerHeight()
            });
            $('body').append(div);

            //복제 붙여 넣기
            div.append(pop.clone());

            if (opts.isContentEvent) {
                //dynamic 팝업에 대한 닫기
                div.on('click.tooltip', '.' + opts.closeClass, function (e) {
                    close(div);

                    e.preventDefault();
                });

                //스크롤되면 닫아 버림
                getTarget().closest('.' + opts.dynamicScrollClass).on('scroll.tooltip', function (e) {
                    $(this).off('scroll.tooltip');
                    ///console.log('close : dynamic scroll');
                    close(div);
                });
            }

            //원본 강제 숨김 
            pop.css('display', 'none');
        }

        //다이나믹 tip div 삭제
        function removeDynamicTooltip(data) {
            getTarget().closest('.' + opts.dynamicScrollClass).off('scroll.tooltip');

            $('.' + opts.dynamicPopClass).remove();
        }

        //버튼 타겟 반환
        function getTarget() {
            return (opts.selector === '') ? opts.target : opts.target.find(opts.selector);
        }

        //팝업 컨텐츠 반환
        function getContent() {
            return (opts.contentSelector === '') ? opts.content : opts.content.find(opts.contentSelector);
        }
        
        return {
            init: function (options) {
                scope = this;

                init(options);
            }
        };
    };

    return wddoObj;
}(jQuery));