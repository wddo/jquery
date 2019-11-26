/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.4.2
 * @since : 2013.11.12
 * 
 * history
 * 
 * 1.4 (2013.12.08) : -
 * 1.4.1 (2013.12.16) : $hiddenSelect.val(selectValue) 로 변경을 알리기 때문에 option 태그에 value 값이 동일하면 정상적으로 변경되지 않는 부분 수정
 * 1.4.2 (2014.01.22) : 리스트 a 태그 title 속성 추가
 * 
 * Jo Yun Ki에 의해 작성된 SelectBox은(는) 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.
 * 이 라이선스의 범위 이외의 이용허락을 얻기 위해서는 wddoddo@gmail.com을 참조하십시오.
 * 
 */


/********************************************************************************************/
/***************************************** selectbox ****************************************/
/********************************************************************************************/

/** 
* 디자인 셀렉트 박스 (div >> a, div >> ul 구조), (select 태그 기반)
* 
* 1. jQuery 라이브러리 로드후 실행
* 2. 모든 메소드는 document ready 후 실행 하여야 한다.
* 3. $.SelectBoxSet 를 실행하면 내부적으로 document ready 후 실행한다.
* 4. select 태그에 onchange 이벤트가 발생하면 디자인 셀렉트 박스에 전달된다. select 의 속성 변화(disabled, selected)는 select 태그에 적용후 .resetSB() 를 실행
* 5. select 태그가 없는 디자인 셀렉트 박스는 $('target').on('change.selectbox', function (e, param) {} 로 반환값을 전달 받는다.
* 6. select 태그 기반으로 작성시 반드시 option 태그에 value 속성 존재하여야 한다. 디자인 셀렉트 에선 li 에 data-value 로 저장된다.
* 7. 지정 높이가 리스트보다 작으면 자동 스크롤바 생성(http://jscrollpane.kelvinluck.com/)
* 8. 1.4 버전에서 IE6 지원하지 않음 
* 
* ex)
* 
*   1. 한꺼 번에 적용
* 
*       $.SelectBoxSet('target', {height: 200});
* 
*       - target (jQuery Selectors)
*               경우1. select 태그
*               경우2. div >> a, div >> ul 구조의 상위 DIV (UL > LI 에 data-value 속성 없으면 자동 pulldown menu 형태)
*   
*   2. 하나씩 적용
* 
*       var options = {
*           height: 200
*       };
*   
*       var selectBox = new SelectBox('.select', options);
* 
*       $(function () {
*           selectBox.initSB();  
*       });
* 
*   3. 옵션 (: 기본값)
* 
*       var option = {
*           width: undeinfed        //샐렉트 가로 크기 a tag
*           height: undefined,      //스크롤바 한계높이
*           direction: 'down',      //열리는 방향 'up'|'down'
*           speed: 250,             //기본 속도. 닫힐땐 이보다 절반의 속도로 닫힘
*           aClass: 'on',           //LI의 A 태그 오버효과를 담당할 클래스 명
*           divClass: 'select',     //컨테이너 DIV 태그 클래스 명
*           btnClass: 'tit',        //클릭할 A 태그의 클래스명
*           conClass: 'overcon',    //UL 감싸고 있는 DIV 클래스명
*           ulClass: 'con',         //UL 클래스명
*           autoClose: false        //pulldown 인 경우 리스트에서 포커스가 빠지면 자동으로 닫힐지 유무
*       };
* 
*   4. 메서드
* 
*       instance.getTarget();       //jQueryObject 형태로 컨테이너 DIV 반환
* 
*       .getInfoSB();               //정보반환, change 이벤트의 param 와 같음
*       .setIndexSB(idx);           //index로 선택
*       .getIndexSB();              //index 반환
*       .setValueSB(value);         //value로 선택
*       .getValueSB()               //value 반환
*       .setTextSB(value);          //text로 선택
*       .getTextSB();               //text 반환
*       .disabledSB(boolean);       //disabled
*       .removeSB();                //디자인 셀렉트 삭제
*       .resetSB();                 //select 태그를 토대로 재적용
* 
*   5. 이벤트
* 
*       //디자인 기반의 셀렉트 박스
*       $('.select').on('change.selectbox', function (e, param) {
*           console.log('change index: ' + param.index);
*           console.log('change value: ' + param.value);
*           console.log('change text: ' + param.text);
*       });
* 
*   6. HTML
* 
*    <div class="select">
*       <a href="#" class="tit"><span>선택해주세요</span></a>
*       <div class="overcon">
*           <ul class="con">
*               <li><a href="#" data-value="list1_0">선택하세요</a></li>
*               <li><a href="#" data-value="list1_1">리스트1</a></li>
*               <li><a href="#" data-value="list1_2">리스트2</a></li>
*               <li><a href="#" data-value="list1_3">리스트3</a></li>
*           </ul>
*           <div class="selectL"></div>
*           <div class="selectR"></div>
*       </div>
*   </div>
* 
*   7. CSS(기본 템플릿)
* 
*		.select {float:left;position:relative;}
*		.select .tit {display:block;height:33px;background:url(img/common/bg_selectL.png) no-repeat left top;}
*		.select .tit > span {display:inline-block;margin-left:15px;padding:10px 40px 10px 0;height:13px;background:url(img/common/bg_selectR.png) no-repeat right top;white-space: nowrap}
*		.select .tit.on {background:url(img/common/bg_selectLon.png) no-repeat left top;}
*		.select .tit.on > span {background:url(img/common/bg_selectRon.png) no-repeat right top;}
*		.select .overcon .con {padding:5px 0 15px;border-left:1px solid #ccc;border-right:1px solid #ccc;border-bottom:1px solid #ccc;background:#fff;}
*		.select .overcon .con a {display:block;padding:5px 15px 5px 15px; white-space: nowrap}
*		.select .overcon .con a.on {background:#f1f1f1;}
*		.select .overcon .selectL {width:16px;height:16px;background:url(img/common/bg_selectconL.gif) no-repeat;}
*		.select .overcon .selectR {width:16px;height:16px;background:url(img/common/bg_selectconR.gif) no-repeat;}
*
*       .jspContainer{overflow:hidden;position:relative;}
*       .jspPane{position:absolute;}
*       .jspVerticalBar{position:absolute;top:0;right:0;width:8px;height:100%;background:red;}
*       .jspTrack{background:#ccc;position:relative;}
*       .jspDrag{background:#999;position:relative;top:0;left:0;cursor:pointer;}
*       .jspCapTop{height:0px;}
*       .jspCapBottom{height:0px;}
*
*/

var SelectBox = (function ($) {
    var wddoObj = function (_target, _options) {
        var scope,                      //현 함수의 인스턴트
            $target,                    //div >> a, ul 형태를 가지고 있는 DIV
            $btnA,                      //열고 닫기를 할 버튼 a
            $listCon,                   //리스트 ul 감싸고 있는 DIV
            $listUL,                    //리스트 ul
            $listA,                     //li 속 a
            $roundDIV,                  //ul 하단 라운드 레이아웃 담당하는 DIV x2
            $maskDIV,                   //트윈 DIV 를 감싸고 영역밖으로 overflow:hidden; 인 마스크 DIV
            $tweenDIV,                  //트윈이 일어나는 DIV
            $hiddenSelect,              //숨겨진 <select> 태그
            listWidth,                  //리스트 최종적 넓이(border 포함)
            listHeight,                 //리스트의 최종적 높이
            btnWidth,                   //열고 닫기를 할 버튼의 넓이
            btnHeight,                  //열고 닫기를 할 버튼의 높이
            isValue,                    //<select> 형태일지 pulldown 형태일지 결정할 변수
            isScroll = false,           //jScroll 적용시 높이보다 리스트가 작으면 스크롤이 생기지 않는것 감안하여 스크롤바가 있는지 없는지 유무
            isDisabled = false,         //<select> tag 에 disabled 되었는지 유무
            isEvent = false,            //이벤트가 적용되었는지 유무
            opts,                   
            defaults = defaultOptions(),//기본값
            selectIndex,                //selectbox 의 인덱스 넘버
            selectText,                 //selectbox 의 레이블명
            selectValue,                //selectbox 의 숨은 값 <li data-value:
            jscroll;                    //jScroll 인스턴트
        
        function defaultOptions() {
            return {
                height: undefined,
                width: undefined,
                direction: 'down',
                speed: 250,
                aClass: 'on',
                divClass: 'select',
                btnClass: 'tit',
                conClass: 'overcon',
                ulClass: 'con',
                autoClose: false
            }
        }
        
        //init
        function init() {
            opts = $.extend(defaults, _options);
            
            createLayout();
            
            $btnA = $target.find('a:eq(0)');
            $listCon = $target.find('div:eq(0)');
            $listUL = $listCon.find('ul');
            $listA = $listUL.find('li > a');
            $roundDIV = $listCon.find('> div');

            isValue = ($listA.data('value') !== undefined) ? true : false;
        }
        
        //<select> tag choose
        function createLayout() {
            if ($target.is('select')) {
                $hiddenSelect = $target;
                $hiddenSelect.data('select', true);
                var con, ul, li, a;
                var title = ($target.attr("title") !== undefined) ? $target.attr("title") : '';

                $target = $hiddenSelect.before('<div class="' + opts.divClass + '"><a href="#" class="' + opts.btnClass + '" title="' + title + '"><span></span></a></div>').prev();

                con = $target.append('<div class="' + opts.conClass + '"></div>').find('div');
                ul = con.append('<ul class="' + opts.ulClass + '"></ul>').find('ul');
                con.append('<div class="selectL"></div><div class="selectR"></div>').find('> div'); //round layout

                $hiddenSelect.find('option').each(function () {
                    li = ul.append('<li><a href="#"></a></li>').find('li:last');
                    a = li.find('> a');
                    a.text($(this).text()).data('value', $(this).attr('value'));
                });
                
                $hiddenSelect.css('display', 'none');
            }
        }

        //init layout
        function initLayout() {
            var li = $listUL.find('> li:first');
            var borderWidth = parseInt($listUL.css('border-left-width')) + parseInt($listUL.css('border-right-width'));
            
            $tweenDIV = $listCon.wrap('<div class="maskDiv_wddo" style="*position: relative;"><div class="tweenDiv_wddo">').parent();
            $maskDIV = $tweenDIV.parent();
    
            //btn
            btnWidth = (opts.width !== undefined) ? opts.width : li.find('> a').width(); //list.outerWidth() influence
            btnHeight = $btnA.outerHeight();
            
            $btnA.find('> span').css('width', btnWidth);
            
            //list
            listWidth = li.outerWidth() + borderWidth;
            listHeight = $listUL.outerHeight();
            
            $roundDIV.css({
                'position' : 'relative',
                'marginTop' : -$roundDIV.outerHeight()
            }).filter(':eq(1)').css({'marginLeft' : listWidth - $roundDIV.outerWidth()});

            $maskDIV.css({
                'position' : 'absolute',
                'overflow' : 'hidden',
                'left': '0',
                'top' : btnHeight,
                'width' : listWidth,
                'height' : listHeight
            });

            //IE7-
            IE7Fix();
            
            //scroll apply
            addScroll();
            
            //li.outerWidth() change : layout reset
            if (isScroll) {
                listWidth = li.outerWidth() + borderWidth;
                $roundDIV.filter(':eq(1)').css({'marginLeft' : listWidth - $roundDIV.outerWidth()});
                $maskDIV.css('height', opts.height);
            }

            //direction
            modifyDirection();
        }
        
        //IE7 fixed
        function IE7Fix() {
            var agt= navigator.userAgent.toLowerCase();
            
            if (agt.indexOf("msie 7" ) != -1) {
                $btnA.css('cursor', 'pointer');
            }
        }
        
        //add scroll-pane
        function addScroll() {
            if (opts.height !== undefined) {
                var pane = $listCon.show().wrap('<div class="scroll-pane"></div>').parent();
                
                pane.css({
                    'overflow' : 'auto',
                    'height' : opts.height
                });
                
                jscroll = pane.jScrollPane({verticalGutter: 0});
 
                pane.attr('tabIndex', -1);
                
                isScroll = (pane.find('.jspContainer').children().length > 1);
            }
        }
        
        //add direction
        function modifyDirection() {
            if (opts.direction !== 'down') {
               $maskDIV.css({
                    'marginTop': -$maskDIV.outerHeight() - btnHeight
               });
            }
        }
        
        function open(_isOpen, _speed) {
            var speed = (_speed !== undefined) ? _speed : ((_isOpen) ? opts.speed : opts.speed / 2);
            var direction = (opts.direction === 'down') ? -1 : 1;
            
            if ($tweenDIV.length !== 0) {
                var top = (_isOpen) ? 0 : listHeight * direction; //open 0
                
                if (speed > 1) {
                    $maskDIV.add($listCon).show();
                }//else default close

                $tweenDIV.stop().animate({
                    'marginTop': top
                },{queue:false, duration:speed, complete:comp});
            }
            
            //complete
            function comp () {
                if (!_isOpen) {
                    $maskDIV.hide();
                    removeDocumentEvent();
                    $btnA.removeClass(opts.aClass);
                } else {
                    addDocumentEvent();
                }
            }
        }
        
        //document event
        function addDocumentEvent() {
            $(document).on('click.selectbox', function (e) {
                var currentTarget = $(e.currentTarget);
                var target = $(e.target);
                var isOpen = ($target.data('state') === 'open');

                if (!target.hasClass('jspDrag') && isOpen) {
                    changeBtnState(false);
                }
            });
        }
        
        function removeDocumentEvent() {
            $(document).off('click.selectbox');
        }
        
        //event
        function initEvent() {
            isEvent = true;
            
            //btn a handler
            $btnA.on('click.selectbox', function (e) {
                var target = $(e.currentTarget);
                var toggle = ($target.data('state') !== 'open'); //true : open

                changeBtnState(toggle); //open & close
                if (selectIndex !== undefined && toggle) selectList($listA.eq(selectIndex)); //if open, list on
                if ((!isValue && jscroll !== undefined) && toggle) changeScroll(0); //if pulldown menu & jscroll

                e.preventDefault();
            });
            
            //<select> version
            if (isValue) {
                $btnA.add($listA).on('keydown.selectbox', function (e) {
                    var target = $(e.currentTarget);
                    var keyCode = e.keyCode;
                    var idx = scope.getIndexSB() || 0;
                    var altOpen = (e.altKey && (keyCode == 40 || keyCode == 38));
                    var isOpen = ($target.data('state') === 'open');
    
                    //alt open
                    if (altOpen && !isOpen) {
                        changeBtnState(true, 400);
                        selectList($listA.eq(idx));
                        
                        e.preventDefault();
                        
                        return false;
                    }
    
                    //enter, btn focus
                    if (keyCode === 13 && target.is($btnA)) {
                        e.preventDefault();
                        if (isOpen) changeBtnState(false);
                        
                        e.preventDefault();
                    }
    
                    //tab, is open
                    if (keyCode === 9 && isOpen) {
                        e.preventDefault();
                        changeBtnState(false);
                        
                        e.preventDefault();
                    }
    
                    //end, pagedown
                    if (keyCode === 35 || keyCode === 34) {
                        idx = $listA.length - 1;
                        
                        selectList($listA.eq(idx));
                        
                        e.preventDefault();
                    }
                    
                    //down, right
                    if (keyCode === 40 || keyCode === 39) {
                        if (idx < $listA.length - 1 && scope.getIndexSB() !== undefined) idx += 1; //not label
                        
                        selectList($listA.eq(idx));
                        
                        e.preventDefault();
                    }
                    
                    //home, pageup
                    if (keyCode === 36 || keyCode === 33) {
                        idx = 0;
                        
                        selectList($listA.eq(idx));
                        
                        e.preventDefault();
                    }
                    
                    //up, left
                    if (keyCode === 38 || keyCode === 37) {
                        if (idx > 0) idx -= 1;
                        
                        selectList($listA.eq(idx));
                        
                        e.preventDefault();
                    }
                });
                
                if ($hiddenSelect !== undefined) {
                    //<select> tag change -> selecbox change 
                    $hiddenSelect.on('change.selectbox', function (e) {
                        //selectList() copy
                        var target = $listA.eq($hiddenSelect[0].selectedIndex);
                        var text = target.text();
                        var value = target.data('value');
                        var idx = target.closest('li').index();
            
                        if (isDisabled) return false;

                        selectIndex = idx;
                        
                        $listA.eq(selectIndex).triggerHandler('mouseover.selectbox');
                        
                        changeText(text);
                        changeValue(value);
                        changeScroll();
                    });
                }
                
            } else {
            //pulldown menu version
                if (opts.autoClose) {
                   $listA.on('focusin.selectbox', function (e) {
                        changeBtnState(true);
                   });
                   
                   $listA.on('focusout.selectbox', function (e) {
                        changeBtnState(false);
                   });
                }
            }

            //list a handler
            $listA.on('click.selectbox', function (e) {
                var target = $(e.currentTarget);
                
                if (isValue) {
                    e.preventDefault();
                    
                    selectList(target);
                    changeBtnState(false);
                    $btnA.focus();
                }
            });
            
            $listA.on('mouseover.selectbox focusin.selectbox', function (e) {
                var target = $(e.currentTarget);
                var idx = target.closest('li').index();
                
                //all remove class form list <A> & add class
                $listA.removeClass(opts.aClass).eq(idx).addClass(opts.aClass);
            });
        }
        
        function removeEvent() {
            isEvent = false;
            
            $listA.off('.selectbox');
            $btnA.off('.selectbox');
            $(document).off('.selectbox');
            if ($hiddenSelect !== undefined) $hiddenSelect.off('.selectbox');
        }
        
        //init attribute from <select>
        function initAttribute () {
            //select fisrt 
            if ($hiddenSelect !== undefined) {
                var selectedIdx = ($hiddenSelect.find('> option:selected').length > 0) ? $hiddenSelect.find('> option:selected').index() : 0;

                scope.setIndexSB(selectedIdx);
                
                isDisabled = $hiddenSelect.prop('disabled');

                scope.disabledSB(isDisabled);
            } else {
                scope.disabledSB(false);
            }
        }
        
        //select list & close
        function selectList(_target) {
            var target = _target;
            var text = target.text();
            var value = target.data('value');
            var idx = target.closest('li').index();

            if (isDisabled) return false;

            if (isValue) {
                //idx save
                selectIndex = idx;
                
                $listA.eq(selectIndex).triggerHandler('mouseover.selectbox');
                
                changeText(text);
                changeValue(value);
                changeScroll();
                changeHiddenSelect();
            } else {
                changeScroll(0); //init scroll ypos           
            }
            
            //event binding
            $target.trigger('change.selectbox', scope.getInfoSB());     
        }
        
        //change btn state
        function changeBtnState(_value, _speed) {
            var speed = _speed;
            
            if (isDisabled) return false;
            
            $listA.removeClass(opts.aClass);
            
            if (_value) { //open
                $target.data('state', 'open');
                open(true, speed);
                $btnA.addClass(opts.aClass);
            } else { //close
                $target.removeData('state');
                open(false, speed);
                //$btnA.removeClass(opts.aClass); //code move: motion complete 
            }
        }
        
        //text change
        function changeText(_txt) {
            $btnA.children().text(_txt);
            
            selectText = _txt;
        }
        
        //value change
        function changeValue(_value) {
            selectValue = _value;
        }
        
        //scroll move
        function changeScroll(_ypos) {
            if ($target.find('.jspDrag').length > 0) {
                var ypos = (_ypos !== undefined) ? _ypos : $listA.eq(selectIndex).closest('li').position().top;
                
                jscroll.data('jsp').scrollToY(ypos);
            }
        }
        
        //<select> tag change
        //selecbox change -> <select>
        function changeHiddenSelect() {
            if ($hiddenSelect !== undefined) {
                $hiddenSelect.find('option').removeAttr('selected').eq(selectIndex).prop('selected', true).end().trigger('change');
                //$hiddenSelect.val(selectValue).trigger('change'); // error : <option> attribute "value" same
            }
        }
        
        //tab
        var getTab = function (keydownEvent) {
            var e = keydownEvent,
                isDown;
            
            if (e.keyCode === 9) {
                isDown = (e.shiftKey) ? false : true;
            } else {
                isDown = undefined;
            }
            
            return isDown;
        };
        
        //public
        //init
        this.initSB = function () {
            $target = (_target.jquery === undefined) ? $(_target) : _target;
      
            if ($target.length > 0) {
                if ($target.is('select') && $target.data('select')) return false;  //avoid duplication
                
                scope = this;
                
                init();
                initLayout();
                
                //scope
                $target.data('scope', scope);
                
                initAttribute();
            }
        };
        
        //reset
        this.resetSB = function () {
            scope.removeSB();
            scope.initSB();
        }
        
        //dispose
        this.removeSB = function () {
            //remove animate infomation
            $listCon.parent('div').stop().css('marginTop', '');
            
            //remove scroll source
            if (jscroll !== undefined) {
                jscroll.data('jsp').destroy();
                $listCon.unwrap('<div>');
            }
            
            //remove mask source
            $listCon.unwrap('<div>').unwrap('<div>');
            
            //remove event
            removeEvent();
            
            //init
            selectIndex = undefined;
            selectText = undefined;
            selectValue = undefined;
            jscroll = undefined;
            
            $target.removeData('scope');
            $target.removeData('state');
            $listA.removeClass(opts.aClass);
            $btnA.removeClass(opts.aClass);
            $listCon.hide();
            
            if ($hiddenSelect !== undefined) {
                $hiddenSelect.css('display', '');
                $hiddenSelect.siblings('div.' + opts.divClass).remove();
                $hiddenSelect.removeData('select');
            }
            
            //scope = undefined;
            $target = undefined;
            $btnA = undefined;
            $listCon = undefined;
            $listUL = undefined;
            $listA = undefined;
            $roundDIV = undefined;
            $maskDIV = undefined;
            $tweenDIV = undefined;
            $hiddenSelect = undefined;
            listWidth = undefined;
            listHeight = undefined;
            btnWidth = undefined;
            btnHeight = undefined;
            isValue = undefined;
            isScroll = false;
            isDisabled = false;
            isEvent = false;
            opts = undefined;
            defaults = defaultOptions();
        };
        
        //return target
        this.getTarget = function () {
            return $target;  
        };
        
        //return infomation
        this.getInfoSB = function () {
            return {
                index: selectIndex,
                value: selectValue,
                text: selectText
            };
        };
        
        //set get index
        this.setIndexSB = function (_idx) {
            changeBtnState(true, 0);
            selectList($listA.eq(_idx));
            changeBtnState(false, 0);
        };
        
        this.getIndexSB = function () {
            return selectIndex;  
        };
        
        //set get value
        this.setValueSB = function (_value) {
            var idx;
            $listA.each(function () {
                if ($(this).data('value') === _value) {
                    idx = $(this).closest('li').index();
                    return false;
                } 
            });
            
            this.setIndexSB(idx);
        };
        
        this.getValueSB = function () {
            return selectValue;
        };
        
        //set get text
        this.setTextSB = function (_value) {
            var idx;
            $listA.each(function () {
                if ($(this).text() === _value) {
                    idx = $(this).closest('li').index();
                    return false;
                } 
            });
            
            this.setIndexSB(idx);
        };
        
        this.getTextSB = function () {
            return selectText;
        };
        
        //set disabled
        this.disabledSB = function (_value) {
            var target = $target.children().eq(0); //btnA
            var txt = target.text();
            var cls = target.attr('class');

            //first
            changeBtnState(false, 0);    //default close

            if (_value) {
                $target.css('opacity', 0.5);
                
                if ($hiddenSelect !== undefined) $hiddenSelect.prop('disabled', true);
                
                if (!isDisabled) target.css('display', 'none').after('<span class="' + opts.btnClass + '"><span style="width:' + target.find('> span').width() + 'px">'+target.text()+'</span></span>');
                
                if (isEvent) removeEvent();
            } else {
                $target.css('opacity', 1);
                
                if ($hiddenSelect !== undefined) $hiddenSelect.removeAttr('disabled');
                
                if (isDisabled) target.css('display', '').siblings('span').remove();                    
                
                if (!isEvent) initEvent();
            }
            
            isDisabled = _value;
        }
    };//end Obj

    return wddoObj;
}(jQuery));

//extends
jQuery.fn.extend({
    getInfoSB : function () {
        return $(this).data('scope').getInfoSB();
    },
    setIndexSB : function (_idx) {
        $(this).data('scope').setIndexSB(_idx);
    },
    getIndexSB : function (_idx) {
        return $(this).data('scope').getIndexSB();
    },
    setValueSB : function (_value) {
        return $(this).data('scope').setValueSB(_value);  
    },
    getValueSB : function () {
        return $(this).data('scope').getValueSB();
    },
    setTextSB : function (_value) {
        return $(this).data('scope').setTextSB(_value);  
    },
    getTextSB : function () {
        return $(this).data('scope').getTextSB();
    },
    disabledSB : function (_value) {
        $(this).data('scope').disabledSB(_value);
    },
    removeSB : function () {
        $(this).data('scope').removeSB();
    },
    resetSB : function () {
        $(this).data('scope').resetSB();
    } 
});

//multiple init
jQuery.SelectBoxSet = function (_target, _options) {
    //document ready
    $(document).ready(function () {
        $(_target).each(function (idx) {
            var selectBox = new SelectBox($(this), _options);
            selectBox.initSB();
        });
    });
};
