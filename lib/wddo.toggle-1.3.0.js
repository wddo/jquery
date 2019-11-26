/*!
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.3
 * @since : 2015.11.09
 *
 * history
 *
 * 1.2   (2015.12.10) : setNext(), setPrev(), opts.onClass 추가 
 * 1.2.1 (2015.12.11) : getOptions() 추가
 * 1.3   (2015.04.18) : opts.onlyOpen = true 기본값 고정, otps.contentSelector 추가
 *
 ********************************************************************************************
 ***************************************** WToggle ******************************************
 ********************************************************************************************
 *
 * var instance = new WToggle();
 * instance.init(options);                   //초기화
 *
 * @param options    ::: 설정 Object 값
 *
 * options
 *   target:Object = $('selector')           //텝 메뉴 버튼 jQuery Object
 *   selector:String = 'li > a'              //on() 두번째 인자의 셀렉터
 *   onTag:String = 'li'                     //on 클래스를 적용 할 태그 셀렉션 String
 *   onClass:String = 'on'                   //on 클래스 명
 *   onlyOpen:Boolean = true                 //비 중복 활성화 유무
 *   content:Object = $('selector')          //적용할 컨텐츠 jQuery Object
 *   contentSelector:String = ''             //content 에 대한 세부 셀렉터
 *   onChange:Function = fun(event)          //텝 변경 콜백함수
 *   onChangeParams:Array = []               //텝 변경 콜백함수 인자
 *   behavior:Boolean = false                //기본 비헤이비어 삭제 유무, 기본은 막음
 *
 * method
 *   .setCloseAll()                          //모두 닫기
 *   .setOpen(idx)                           //열기
 *   .setCallback(change, param)             //콜백 설정
 *   .setNext()                              //다음
 *   .setPrev()                              //이전
 *   .getOptions()                           //옵션객체 반환
 */
var WToggle = (function ($) {
    var wddoObj = function (options) {
        var scope,
            targetA,
            content,
            opts,
            defaults = getDefaultOption(),
            init = function (options) {
                opts = $.extend(defaults, options);

                targetA = (opts.selector === '') ? opts.target : opts.target.find(opts.selector);
                content = (opts.contentSelector === '') ? opts.content : opts.content.find(opts.contentSelector); //add 1.3
 
                if (targetA.length > 0 && opts.target.data('scope') === undefined) {
                    if (opts.target.data('scope') === undefined) opts.target.data('scope', scope);

                    addIdx();
                    initLayout();
                    initEvent();
                }
            };

        function getDefaultOption() {
            return {
                target : $($.fn),
                selector : '',
                onTag : 'li',
                onClass : 'on',
                onlyOpen : true,
                behavior : false,
                content : $($.fn),
                contentSelector : '',
                onChange : undefined,
                onChangeParams : []
            };
        }
         
        function initLayout() {

        }

        function initEvent() {
            if (opts.selector === '') {
                opts.target.on('click.WToggle', btnListener);    
            } else {
                opts.target.on('click.WToggle', opts.selector, btnListener);
            }
            
            function btnListener(e) {
                var target = $(e.currentTarget);

                content = (opts.contentSelector === '') ? opts.content : opts.content.find(opts.contentSelector); //add 1.3

                //data('idx') 없으면 초기화 셋팅
                if (target.data('idx') === undefined) reset();

                //버튼의 고유 idx 를 얻어 content 갯수가 많으면 해당 content.eq(idx) 로 찾기 위함
                var idx = parseInt(target.data('idx'));

                //opts.onTag 가 'a' 이면 target 이 활성화 태그이고 아니면 부모중 지정한 opts.onTag 찾아 교체
                var onTag = (opts.onTag === 'a') ? target : target.closest(opts.onTag);

                //console.log("onTag.hasClass('on')" , onTag.hasClass('on'));
                //console.log("opts.onlyOpen" , opts.onlyOpen);
                if (onTag.hasClass(opts.onClass)) {
                    //열려있는 것 클릭 시 
                    if (opts.onlyOpen) {
                        //하나만 활성화, 닫지 않음

                    } else {
                        //동시 활성화, 닫음 
                        btnOff(idx);
                        close(idx);
                    }
                } else {
                    //닫혀있는 것 클릭 시 
                    if (opts.onlyOpen) {
                        //하나만 활성화, 열려있는 것 모두 닫고 열기
                        btnOff();
                        close();
                        btnOn(idx);
                        open(idx);
                    } else {
                        //동시 활성화, 열려있는 것 유지
                        btnOn(idx);
                        open(idx)
                    }
                }

                if (opts.onChange !== undefined) opts.onChange.apply(this, [{target: target, idx: idx, content: content.eq(idx), params: opts.onChangeParams}]);
                opts.target.trigger('change.WToggle', [{target: target, idx: idx, content: content.eq(idx), params: opts.onChangeParams}]);

                if (!opts.behavior) {
                    e.preventDefault();
                    e.stopPropagation();    
                }
            }
        }

        //어려 다른 형제 태그와 섞여 있어도 고유의 idx 지정
        function addIdx() {
            targetA.each(function (idx) {
                $(this).data('idx', idx);
            });
        }

        //data('idx') 지정 안되어 있으면 재지정
        function reset() {
            targetA = $(targetA.selector);
            content = $(content.selector);

            addIdx();
        }

        //버튼 활성화
        function btnOn(idx) {
            var target = (idx === undefined) ? targetA : targetA.eq(idx);
            var onTag = (opts.onTag === 'a') ? target : target.closest(opts.onTag);

            onTag.addClass(opts.onClass);
        }

        //버튼 비활성화
        function btnOff(idx) {
            var target = (idx === undefined) ? targetA : targetA.eq(idx);
            var onTag = (opts.onTag === 'a') ? target : target.closest(opts.onTag);

            onTag.removeClass(opts.onClass);
        }
        
        //컨텐츠 열기
        function open(idx) {
            var target = (idx === undefined) ? content : content.eq(idx);

            target.show();
        }

        //컨텐츠 닫기
        function close(idx) {
            var target = (idx === undefined) ? content : content.eq(idx);
            
            target.hide();
        }

        function checkIdx(idx) {
            return Math.max(Math.min(idx, targetA.length - 1), 0);
        }
        
        return {
            init: function (options) {
                scope = this;

                init(options);
            },

            setCloseAll: function () {
                btnOff();
                close();
            },

            setOpen: function (idx) {
                btnOn(idx);
                open(idx);
            },

            setCallback: function (change, param) {
                opts.onChange = change;
                if (param !== undefined) opts.onChangeParams = param;
            },

            setNext: function () {
                var currentIdx = parseInt(targetA.closest('.' + opts.onClass).data('idx'));
                var nextIdx = checkIdx(currentIdx + 1);

                if (!isNaN(currentIdx)) targetA.eq(nextIdx).trigger('click.WToggle');
            },

            setPrev: function () {
                var currentIdx = parseInt(targetA.closest('.' + opts.onClass).data('idx'));
                var prevIdx = checkIdx(currentIdx - 1);

                if (!isNaN(currentIdx)) targetA.eq(prevIdx).trigger('click.WToggle');
            },

            getOptions: function () {
                return opts;
            }
        };
    };

    return wddoObj;
}(jQuery));