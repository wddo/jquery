/*!
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 2.1.3
 * @since : 2016.01.25
 * 
 * history
 * 
 * 1.0 	 (2016.01.25) : -
 * 1.0.1 (2016.03.08) : setOpen(), setClose() 에 인자 삭제, open() 시 생성시점과 display변경된 요소들이 있을 수 있기에 focusElement 재정의 
 *						setBtn() 에서 버튼 기반 조건 삭제 (n:1 의경우 버튼을 생성때 넣지 않을 수 있고 닫을때 지정할 경우가 있음)
 * 1.0.2 (2016.03.16) : getName : function () {return 'popup';} 삭제
 *						onOpen(), onClose() 발생 시점을 상단으로 올림.. 이유는 focus() 발생 시점에 팝업 상위가 display:none 인 경우 포커스가 가지 못하므로 onOpen()시 외부에서 팝업객체 준비상태로 만들고 focus() 할 수 있게..
 * 1.0.3 (2016.03.29) : $(document).on('mousedown' 을 'click' 으로 변경 (e.stopImmediatePropagation() 사용을 위해 같은 이벤트가 걸려 있어야함)
 * 1.0.4 (2016.03.31) : dims 가 있으면 무조건 close 버튼으로 닫도록 함, dims 있으면 body 스크롤 막음, 더불어 까딱 거림을 최대한 티안나게 dims.show(). 를 fadeIn() 으로 변경
 * 1.0.5 (2016.04.12) : 닫기버튼이 존재하지 않으면 포커스 opts.focus 가 true 여도 빠져 나가게 만듬
 *					 	팝업이 열릴 때 $(document).one('click.pupup' 이벤트를 통해 document click 의 팝업닫기 이벤트가 팝업이 열리면서 발생되는 것을 막음
 * 1.1	 (2016.04.20) : new 생성 1회에 들어오는 인자들 그룹핑 시키도록 소스 전반적으로 많이 수정, 사용법엔 큰 차이 없음
 * 2.0	 (2016.05.10) : btnSelector, popSelector, dimSelector 옵션 추가하여 유동적인 html 대응
 * 2.0.1 (2016.05.30) : Mouse 인자를 Scroll 로 변경하고 setDisableWheel(), setEnableWheel() 를 setHide(), setShow() 로 변경
 * 2.0.2 (2016.12.21) : opts.dim 미지정시 외부 팝업 오픈 시 open() > chooseDim.fadeIn(); 에서 오류 수정				
 * 2.0.3 (2016.12.23) : .setInstance() 시 opts.btnSelector 나 opts.popSelector 가 그 시점에 존재하지 않을 수 있으므로 getSelector() 사용않고 무조건 opts.btn, opts.pop 에 적용
 * 2.1.0 (2017.03.08) : 팝업을 body 아래 새로 복제하여 레이아웃에 영향을 안 받는 absolute 팝업 생성을 위해 createDynamicPop() removeDynamicPop() 추가, opts.dynamic 추가
 * 						클릭이 아니라 마우스 오버&아웃 으로 변경할 수 있는 opts.hover 추가
 * 2.1.1 (2017.09.01) : searchInstance() 적용
 * 2.1.2 (2017.11.24) : opts.skipAClass 추가하여 해당 클래스를 가진 element 가 존재하면 focusElement 선 지정
 * 2.1.3 (2018.05.15) : opts.speed 추가
 * 
 ********************************************************************************************
 ********************************** 포커스 루핑 팝업 ****************************************
 ********************************************************************************************
 * 
 * var instance = new WPopup(options);
 *
 * @param options    ::: 설정 Object 값
 * 
 * options
 *	 btn:Object = $('selector')			//포커스 돌아갈 버튼 & 팝업을 띄울 버튼
 *	 btnSelector:String = 'selector'	//버튼에 대한 세부 셀렉터
 *	 pop:Object = $('selector')			//팝업
 *	 popSelector:String = 'selector'	//팝업에 대한 세부 셀렉터
 *	 dim:Object = $('selector')			//딤
 *	 dimSelector:String = 'selector'	//딤에 대한 세부 셀렉터
 *	 popClass:String = 'wpop'			//팝업 클래스 (중복 활성화 체크 시 비교 기준)
 *	 closeClass:String ='close'			//이전 버튼 텍스트
 *	 buttonAction:Boolean = true		//btn 옵션에 설정된 버튼 클릭시 팝업 열지 유무
 *	 focus:Boolean = true				//포커스 이동 할지 유무
 *	 duplication:Boolean = true			//중복 활성화 유무
 *	 dynamic:Boolean = false			//다이나믹 팝업 유무 [default: false]
 *	 hover:Boolean = false				//마우스 오버&아웃 적용 유무 [default: false]
 *	 speed:Number = 400					//딤드 모션 속도
 *	 onOpen:Function = function (data) {}	//열기 콜백 함수
 *	 onClose:Function = function (data) {}	//닫기 콜백 함수
 *	 
 *
 * instance.setOpen(pop, btn);		//열기, 인자로 특정팝업 열고 btn은 돌아갈 포커스, btn 없으면 oldPop 마지막의 마지막 focusElement
 * instance.setClose(pop);			//닫기, 인자로 특정팝업 닫으며 인자없으면 해당 pops 전부 닫음
 * instance.setBtn(btn);			//다른 루트 팝업 열었을 때 & 생성시 버튼에 일일히 팝업 생성하지 않았을때(n:1) 일경우를 대비한 돌아갈 버튼 tab객체에 저장
 */
var WPopup = (function ($) {
    var wddoObj = function (options) {
        var scope,
        	popupTarget,	//scope 담는 대상, 팝업 이거나 버튼 이거나
            btns,
			pops,
			dims,
			actIdx = NaN,
			focusElement,
			focusSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]),' +
							'button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]',
			opts,
            defaults = getDefaultOption(),
            init = function () {
                opts = $.extend({}, defaults, options);

				btns = opts.btn; //btns.length 비교를 위한 
                pops = opts.pop; //pops.length 비교를 위한 
                dims = opts.dim; //move 2.0.2

	            if (pops.length > 0) {
	            	popupTarget = (btns.length !== 0) ? btns : pops;

	            	if (popupTarget.length > 0/* && popupTarget.searchInstance('popup') === undefined*/) { //add 2.1.1 //중복 적용 가능하므로 searchInstance 체크 안함
						if (popupTarget.data('scope') === undefined) popupTarget.data('scope', scope);
						
						focusSelector += ', a.' + opts.skipAClass; //add 2.1.2;
						
		            	//dims = opts.dim; //del 2.0.2
						focusElement = pops.find(focusSelector);

						initLayout();
						initEvent();
	            	}
				}
            };

        function getDefaultOption() {
            return {
            	btn : $($.fn),
            	btnSelector : '',
				pop : $($.fn),
				popSelector : '',
				dim : $($.fn),
				dimSelector : '',
				popClass : 'wpop',
				closeClass : 'close',
				skipAClass : 'skip_anchor',
				buttonAction : true,
				focus : true,
				duplication : true,
				dynamic : false,
				hover : false,
				speed : 400,
				onOpen : undefined,
				onClose : undefined			
            }
        }
        
        function initLayout() {
        	getSelector(pops, opts.popSelector).hide();
			getSelector(dims, opts.dimSelector).hide();
        }

        function initEvent() {
        	if (opts.buttonAction) {
        		if (!opts.hover) { //add 2.1.0
		        	btns.on('click.popup', opts.btnSelector, function (e) {
		        		addIdx();

		        		if (!opts.duplication) close();

		        		actIdx = ($(this).data('popup-idx') !== undefined) ? $(this).data('popup-idx') : NaN; 

		        		open(undefined, $(this));

		        		e.preventDefault();
		        	});

		        	//tagetBtn이 input 이면 focusin 시 열기
	        		btns.on('focusin.popup', opts.btnSelector, function (e) {
	        			if ($(this).is('input')) getSelector(btns, opts.btnSelector).trigger('click.popup');
	        		});
        		} else {
        			//마우스 오버아웃 add 2.1.0
		            btns.on('mouseenter.popup mouseleave.popup', opts.btnSelector, function (e) {
		            	switch (e.type) {
		            		case 'mouseenter' :
				        		addIdx();

				        		if (!opts.duplication) close();

				        		actIdx = ($(this).data('popup-idx') !== undefined) ? $(this).data('popup-idx') : NaN; 

				        		open(undefined, $(this));

		            			break;
		            		case 'mouseleave' :
		            			close();
		            			break;
		            		default :
		            	}

		        		e.preventDefault();
		            });
        		}
        	}
        }

        //버튼기반 에서만 필요하고 버튼과 팝업의 연결 idx 정의, btn 클릭할때마다 발생하여 다이나믹 html 대응
        function addIdx() {
			//고유의 넘버 저장
			getSelector(btns, opts.btnSelector).each(function (idx) {
                $(this).data('popup-idx', idx);
            });
        }

        //selector 가 없으면 target 그대로 반환 
        function getSelector(target, selector) {
        	return (selector !== '' && selector !== undefined) ? target.find(selector) : target;
        }

        //팝업 열기
		function open(pop, btn) {
			var choosePop = (!isNaN(actIdx) && pop === undefined) ? getSelector(pops, opts.popSelector).eq(actIdx) : ((pop !== undefined) ? pop : getSelector(pops, opts.popSelector)); //선택된 팝업
			//상황 1. 버튼 기반으로 버튼에 actIdx 를 토대로 선택
			//상황 2. 팝업 기반으로 pop 인자가 들어온 경우 pop 선택
			//상황 3. 팝업 기반인데 pop 인자가 없는 경우 pops 가 1개 라고 가정 하고 pops 선택
			var chooseDim = (!isNaN(actIdx) && dims.length > 1) ? getSelector(dims, opts.dimSelector).eq(actIdx) : getSelector(dims, opts.dimSelector); //선택된 딤
			//상황 . 딤이 여러개이면 actIdx 토대로 선택하고 아니면 1개라고 가정하고 선택 

			var clickBtn = btn; //클릭한 버튼

			var oldPop = getSelector(pops, opts.popSelector).not(':hidden'); //그룹중 열려 있는게 있으면 oldPop에 저장

			//돌아갈 포커스 저장
			if (clickBtn !== undefined && clickBtn.length > 0) {
				window.tab.setTarget(clickBtn);
			} else {//돌아갈 포커스 대상이 없고
				//2중 팝업 시 이전 팝업으로 포커스 돌아가게 추가
				if (oldPop.length > 0) window.tab.setTarget(oldPop.filter(":last").find(focusSelector).filter(":first"));
			}
			
			choosePop.show().addClass(opts.popClass);
			chooseDim.fadeIn(opts.speed); //modify 1.0.4

			//포커스 객체 재정의 css의 display 변경되었을 수 있기 때문에 //add 1.0.1
			focusElement = choosePop.find(focusSelector).not(':hidden'); //눈에보이는 focusElement만 적용하도록 수정 modify 1.0.5

			//마우스 누르고 있는 상태에서 addDocumentEvent() 이벤트 등록되어 마우스업하면 바로 닫혀버리는 것을 방지하기위해 document click 을 1차적으로 막음 ..
			$(document).one('click.pupup', function(e) { //add 1.0.5
				e.stopImmediatePropagation();
			});

			addContentEvent(choosePop);
			addKeyEvent(focusElement);

			if (opts.focus) focusElement.filter(":first").focus();

			if (!opts.duplication && chooseDim.length === 0) addDocumentEvent(); //복제유무를 떠나서 dim이 있으면 무조건 close 버튼으로만 닫도록 document 이벤트 등록안함 //add 1.0.4

			if (chooseDim.length > 0) Scroll.setHide(choosePop); //add 1.0.4 //modify 2.0.1

			if (opts.onOpen !== undefined) opts.onOpen({btn: clickBtn, pop: choosePop});
			if (opts.dynamic) createDynamicPop(choosePop); //add 2.1.0
		}

		//팝업 닫기
		function close(pop) {
			var choosePop = (pop !== undefined) ? pop : getSelector(pops, opts.popSelector);
			var chooseDim = (!isNaN(actIdx) && dims.length > 1) ? getSelector(dims, opts.dimSelector).eq(actIdx) : getSelector(dims, opts.dimSelector); //선택된 딤
			var clickBtn = window.tab.getTarget();

			choosePop.hide();
			chooseDim.clearQueue().stop().hide();

			if (clickBtn !== undefined && opts.focus) clickBtn.focus();
			
			//이벤트 삭제
			focusElement.off('keydown.popup');
			choosePop.off('.popup');
			$(document).off('click.popup');

			actIdx = NaN;

			if (chooseDim.length > 0) Scroll.setShow(); //add 1.0.4 //modify 2.0.1

			if (opts.onClose !== undefined) opts.onClose({btn: clickBtn, pop: choosePop});
			if (opts.dynamic) removeDynamicPop(choosePop);
		}

		//닫기 이벤트 적용 함수
		function addContentEvent(pop)
		{
			// 팝업 닫는 이벤트
			pop.off('.popup').on('click.popup', '.' + opts.closeClass, function (e)
			{
				var target = $(e.currentTarget);
				var currentPop = target.closest('.' + opts.popClass);

				close(currentPop);
				
				e.preventDefault();
			});
		}

		//팝업에 포커스 이동을 위한 키보드 이벤트 적용
		function addKeyEvent(focusElm)
		{
			focusElm.filter(':last').on('keydown.popup', function (e)
			{
				if (window.tab.getTab(e))
				{
					if (opts.focus && getSelector(pops, opts.popSelector).find('.' + opts.closeClass).length > 0) { //modify 1.0.5
						focusElm.filter(":first").focus();
						e.preventDefault();
					}
				}
			});
			
			focusElm.filter(':first').on('keydown.popup', function (e)
			{
				if (window.tab.getTab(e) === false)
				{
					if (opts.focus && getSelector(pops, opts.popSelector).find('.' + opts.closeClass).length > 0) { //modify 1.0.5
						focusElm.filter(':last').focus();
						e.preventDefault();
					}
				}
			});
		}

		//중복 체크
        function addDocumentEvent() {
			$(document).on('click.popup'/* focusin.popup touchstart.popup'*/, function (e) {
                if ($(e.target).closest('.' + opts.popClass).length === 0 && $(e.target).get(0) !== btns.get(0)) {
                	var choosePop = (opts.dynamic && !isNaN(actIdx)) ? getSelector(pops, opts.popSelector).eq(actIdx) : getSelector(pops, opts.popSelector).not(':hidden'); //modify 2.1.0

                    close(choosePop);
                }
            });
        }

	    //다이나믹 팝업 생성 //add 2.1.0
	    function createDynamicPop(originalPop) {
	        if (!opts.duplication) $('body').find('> .' + opts.popClass + '_container').remove();

	        var clonePop = $('<div class="' + opts.popClass + '_container">');
	        clonePop.css({
	            'position' : 'absolute',
	            'top' : originalPop.offset().top,
	            'left' : originalPop.offset().left,
	            'width' : originalPop.outerWidth(),
	            'height' : originalPop.outerHeight()
	        });
	        $('body').append(clonePop);

	        //복제하기전에 보이도록 수정
	        originalPop.css('display', 'block');

	        //기존 팝업 내용 복제 붙여 넣기
	        clonePop.append(originalPop.clone());

	        //다이나믹 팝업에 대한 닫기 이벤트 
	        clonePop.on('click', '.' + opts.closeClass, function (e) {
	            close();

	            e.preventDefault();
	        });

	        //스크롤되면 닫아 버림
	        originalPop.closest('div:scrollable').on('scroll.' + opts.popClass, function (e) {
	            close();
	        });

	        //원본 강제 숨김 
	        originalPop.css('display', 'none');
	    }

	    //다이나믹 팝업 삭제 //add 2.1.0
	    function removeDynamicPop(originalPop) {
	    	var clonePop = $('body').find('> .' + opts.popClass + '_container');

	    	if (clonePop.length > 0) {
		        originalPop.closest('div:scrollable').off('scroll.' + opts.popClass);

		        if (!opts.duplication) clonePop.remove();
	    	}
	    }

	    //init() 없어 내부 scope=this 못하므로
		scope = {
            setOpen: function (pop, btn) {
            	if (getSelector(pops, opts.popSelector).not(':hidden').length > 0) close();
            	open(pop, btn);
            },

            setClose: function (pop) {
            	close(pop);
            },

            setBtn: function (btn) {
            	//인자가 정상이고
            	if (btn !== undefined && btn.length !== 0) {
					if (window.tab.tabTarget !== undefined && window.tab.tabTarget > 0) window.tab.getTarget();
            		//btns = opts.btn = btn;
            		//window.tab.setTarget(btns);
            		//내부 변수를 모두 변경 하는 것 보다는 포커스 타깃만 변경 하기로.
            		window.tab.setTarget(btn);
            	}
            }
        };

        init(options);

        return scope;
    };

    //스크롤되는 element 찾기 https://jsperf.com/jquery-scrollable //add 2.1.0
	if ($.expr[':'].scrollable === undefined) {
		$.extend($.expr[":"], {
			scrollable: function(element) {
				var vertically_scrollable, horizontally_scrollable;
				if ($(element).css('overflow') == 'scroll' || $(element).css('overflowX') == 'scroll' || $(element).css('overflowY') == 'scroll') return true;

				vertically_scrollable = (element.clientHeight < element.scrollHeight) && (
				$.inArray($(element).css('overflowY'), ['scroll', 'auto']) != -1 || $.inArray($(element).css('overflow'), ['scroll', 'auto']) != -1);

				if (vertically_scrollable) return true;

				horizontally_scrollable = (element.clientWidth < element.scrollWidth) && (
				$.inArray($(element).css('overflowX'), ['scroll', 'auto']) != -1 || $.inArray($(element).css('overflow'), ['scroll', 'auto']) != -1);
				return horizontally_scrollable;
			}
		});
	}

	//가장 가까운 부모 스크롤 영역 반환
	//https://github.com/slindberg/jquery-scrollparent
	if ($.fn.getScrollParent === undefined) {
		$.fn.getScrollParent = function() {
			var overflowRegex = /(auto|scroll)/,
			position = this.css('position'),
			excludeStaticParent = position === 'absolute',
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css('position') === 'static') {
					return false;
				}
				return (overflowRegex).test( parent.css('overflow') + parent.css('overflow-y') + parent.css('overflow-x') );
			}).eq( 0 );

			return position === 'fixed' || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
		};
	}

	/*
	 * @author : Jo Yun Ki (wddoddo@gmail.com)
	 * @version : 1.3.1
	 * @since : 2015.12.01
	 *
	 * history
	 * 
	 * 1.1   (2015.12.16) : 
	 * 1.2   (2016.05.30) : Hanatour.ui.mouse 의 enableMouseWheel(), disableMouseWheel() 를 가져와 setShowScroll(), setHideScroll() 로 함수명 변경 추가
	 * 1.2.1 (2016.06.20) : setShowScroll(), setHideScroll() 을 setShow(), setHide() 로 변경
	 * 1.3   (2016.06.21) : moveScroll() 현재 스크롤 위치가 이동 위치와 같으면 이동 안하도록 막음
	 * 1.3.1 (2016.07.06) : setMove() 에 speed 인자 추가
	 * 1.3.2 (2017.04.05) : setCheck()의 checklastpage 인자 추가
	 * 
	 ********************************************************************************************
	 *********************************** 스크롤 Static 변수 *************************************
	 ********************************************************************************************
	 *
	 */
	var Scroll = {
		setHide : function (st, bt) {
			var scrollTarget = st;
			var backgroundTarget = (bt === undefined) ? $(window) : bt;

			var lastScrollElement = $(document).add(window).add(backgroundTarget); //기본 최상위 스크롤 객체와 지정한 최상위객체 
			
		    backgroundTarget.on('mousewheel.ht_ui_scroll', function (e) {
		    	var target = $(e.target);
				var parentScrollElement = (target.children().length > 0) ? target.children().eq(0).getScrollParent() : target.getScrollParent(); //target 자신이 스크롤 대상일수 있으니 children() 으로 걸러냄

				//target이 scrollTarget 자식이 아니거나 가까운 스크롤 부모가 document 인경우 -> 휠을 기능 막음
				if (scrollTarget !== undefined && (!$.contains(scrollTarget.get(0), target.get(0)) || parentScrollElement.is(document))) {
					e.preventDefault();	
				}
		    });

		    $('body').css('overflow', 'hidden');
		},

		setShow : function (bt) {
			var backgroundTarget = (bt === undefined) ? $(window) : bt;

		    backgroundTarget.off('mousewheel.ht_ui_scroll');

		    $('body').css('overflow', '');
		}
	};

	/*
	 * @author : Jo Yun Ki (wddoddo@gmail.com)
	 * @version : 1.0
	 * @since : 2015.12.01
	 *
	 * history
	 * 
	 * 1.0 (2015.12.01) : 
	 * 
	 ********************************************************************************************
	 *********************************** 마우스 Static 변수 *************************************
	 ********************************************************************************************
	 *
	 */
	var Mouse = {
		setDisableWheel : function () {
		    $(window).on('mousewheel.ht_ui_mouse',function (e) {
		        e.preventDefault();
		    });
		},

		setEnableWheel : function () {
		    $(window).off('mousewheel.ht_ui_mouse');
		}
	};

	/*
	 * @author : Jo Yun Ki (wddoddo@gmail.com)
	 * @version : 1.0
	 * @since : 2015.12.21
	 *
	 * history
	 * 
	 * 1.0 (2015.12.21) : -
	 * 
	 ********************************************************************************************
	 ***************************** 키보드 탭 컨트롤 & 포커스 저장 *******************************
	 ********************************************************************************************
	 *
	 */
	(function () {
		if (window.tab !== undefined) return;

		var tab = {tabTarget: []};

		tab.getTab = function (keydownEvent) {
		    var e = keydownEvent,
		        isDown;
		    
		    if (e.keyCode === 9)
			{
		        isDown = (e.shiftKey) ? false : true;
		    }
			else
			{
		        isDown = undefined;
		    }
		    
		    return isDown;
		};

		tab.setTarget = function(target) {
		    tab.tabTarget.push(target);
		};

		tab.getTarget = function() {
		    return tab.tabTarget.pop();
		};

		window.tab = tab;
	}());

    return wddoObj;
}(jQuery));