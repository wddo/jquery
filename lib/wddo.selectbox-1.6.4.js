/*!
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.6.4
 * @since : 2013.11.12
 * 
 * history
 * 
 * 1.4   (2013.12.08) : -
 * 1.4.1 (2013.12.16) : $hiddenSelect.val(selectValue) 로 변경을 알리기 때문에 option 태그에 value 값이 동일하면 정상적으로 변경되지 않는 부분 수정
 * 1.4.2 (2014.01.22) : 리스트 a 태그 title 속성 추가
 * 1.4.3 (2014.07.16) : multiText 옵션 생성하여 리스트의 텍스트의 구분자를 지정하면 span 태그로 분할 래핑
 *                      changeText() 의 html 인자 추가
 *                      disabledClass 옵션 추가 컨테이너 DIV에 class 적용됩니다.
 *                      zindex 옵션 존재 시 z-index 리스트 열고 닫을 때 변경
 *                      option 태그에 class 속성이 존재 할 경우 위에서 multiText에 의해 나누어진 span 에 차례대로 클래스가 이전된다. 단, span 당 하나의 클래스
 * 1.4.4 (2014.08.14) : 리스트 전체 가로 크기보다 텍스트가 긴 리스트를 선택시 btn 에 영역을 넘어가 버린다 그래서
 * 						css 에서 btnA>span 에 overflow:hidden 을 처리하면 오른쪽이 여유가 없어 btnA>span width 에 5px 를 빼주었다.
 * 						버튼 클릭 시 selectList() 함수 비 실행으로 수정하여 select 태그 change event 발생하지 않게 수정
 * 1.4.5 (2014.08.18) : opts.width 가 btnA에 width 였는데 따로 옵션으로 설정해줄 필요가 없어보여 container의 width 로 변경 하였다.
 * 1.4.6 (2014.09.01) : 완료 시점에 hidden select tag 를 통하여 complete.selectbox 이벤트 발생
 * 1.4.7 (2014.09.11) : 외부에서 메소드로 리스트 변경 시 maskDIV의 display:none으로 인하여 position().top 을 0으로 반환 직접 index로 계산으로 인한 itemHeight 변수 추가
 * 1.4.8 (2014.09.12) : getBorderWidth() 메소드 추가하여 ul 뿐만 아니라 tweenDIV 의 좌우 border로 list의 width 값에 영향을 주게 변경
 * 						btnA의 글자라인이 늘어나면 btnHeight 재정의하여 maskDIV top 위치 조정
 * 						1.4.4 에 삭제된 버튼클릭 시 selectList() 호출 삭제로 인하여 버튼 클릭시 리스트 활성화 안되던것 복구
 * 1.4.9 (2014.09.19) : getBorderHeight() 메소드 추가하여 tweenDIV, maskDIV 에 대한 높이 재정리
 * 1.5   (2014.10.14) : ul 에 paddingTop, paddingBottom 을 적용하여 상하 여백을 만드는 상황을 대비하여 $maskDIV 의 height 값에 더해주었다.
 * 1.5.1 (2015.04.23) : opts.complete 와 $.SelectBoxSet() 의 3번째 인자 전체 complete 추가
 * 1.5.2 (2015.06.18) : 최초 생성시 hidden select onchange 발생 않게 수정
 * 1.5.3 (2015.07.02) :	$hiddenSelect의 부모 div중 display: none 이면 높이 0 처리 되므로 보여줬다 .unhide_wddo를 이용하여 다시 숨김
 * 1.5.4 (2015.08.10) :	mousewheel 작동 시 이동 거리 itemHeight 1개 크기로 jScrollPane에 지정
 * 1.5.5 (2016.01.29) : $hiddenSelect 에 대하여 trigger 시 'change.selectbox' 에서 'change' 로 변경으로 사용성 높임
 * 1.5.6 (2016.02.12) : <option> 태그에 대한 disabled 속성 대응, opts.chooseClass 추가, 'keydown.selectbox' 이벤트에서 disabled(li display:none) 대응하도록 수정
 * 1.5.7 (2016.04.04) : data-zindex 존재시 열릴 때 opts.zindex 대신 사용, isDisabled 미리 설정 되지 않고 setDisabled() 함수 안에서만 설정되도록 수정 
 * 1.5.8 (2016.04.04) : css에서 리스트 ul 에 대하여 height 지정 시 스크롤바 생성 상황에서 높이를 css 크기 만큼만 받아와 스크롤 레이아웃 깨지므로 height: 100% 지정
 *                      $.SelectBoxSet 에 isHidden 추가하여 보이는 것만 적용 할지 유무를 정하도록 수정
 * 1.5.9 (2016.07.20) : opts.autoListWidth 추가, 적용 시 10. 번 설명 에서의 .maskDiv_wddo를 padding-right 나 margin-right로 조절 불가
 *                      리스트 선택 시 changeText, changeValue, changeScroll, changeChoose 두번씩 호출되는 문제 해결
 *                      setIndex() 에서 li.disabled 체크하여 선택 안되도록 수정, 아이템 숨기는 'disabled' 클래스명 옵션 조절 가능하도록 opts.disabledItemClass 추가
 * 1.6   (2016.07.27) : 키워드 검색 기능 추가 (jquery ui selectmenu 참조함)
 * 1.6.1 (2016.07.28) : ... 줄임에 대한 툴팁 기능 추가
 * 1.6.2 (2017.03.09) : setReset()시 인자로 $hiddenSelect 에대하여 change 이벤트 발생 유무를 지정할 수 있도록 함
 * 1.6.3 (2017.06.12) : dispose() 시 option 태그에 대한 prop('selected') 삭제, setReset() 시 기존 seleced 유지 안되도록
 *                      selectbox 가로크기 자동조정 기능 추가로 opts.width : 'auto' 를 대응하기 위해 changeBtnWidth() 함수 생성하고 기존 btnA > span 크기 조정 로직 포함시킴
 * 1.6.4 (2017.06.15) : 첫번째 리스트를 제외한 disabled 리스트는 숨기지 않고 비활성화 시킴, 키보드 pageup, pagedown 기능 확장(미오픈시 3칸, 스크롤시 보이는갯수 만큼 이동)
 *                      검색 시 String.fromCharCode() 에서 키패드 숫자가 a~j 로 반환 되는 문제해결을 위해 keyCode -48, alt키 이용한 오픈방식 toggle 형태로 변경 
 *
 * Jo Yun Ki에 의해 작성된 SelectBox은(는) 크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스에 따라 이용할 수 있습니다.
 * 이 라이선스의 범위 이외의 이용허락을 얻기 위해서는 wddoddo@gmail.com을 참조하십시오.
 * 
 **********************************************************************************************
 ****************************************** selectbox *****************************************
 **********************************************************************************************
 *
 * 디자인 셀렉트 박스 (div >> a, div >> ul 구조), (select 태그 기반)
 * 
 * 1.  jQuery 라이브러리 로드후 실행
 * 2.  모든 메소드는 document ready 후 실행 하여야 한다.
 * 3.  $.SelectBoxSet 를 실행하면 내부적으로 document ready 후 실행한다.
 * 4.  select 태그에 onchange 이벤트가 발생하면 디자인 셀렉트 박스에 전달된다. $hiddenSelect.bind('change.selectbox', function (e) {}); 의해 전달
 *     단 select 태그의 selectIndex나 value 변경 시 onchange 발생 안하므로 select.change() 이벤트 발생시켜 줘야 함
 * 5.  select 의 속성 변화(disabled, selected)는 select 태그에 적용후 .setReset() 를 실행
 * 6.  select 태그가 없는 디자인 셀렉트 박스는 $('target').on('change.selectbox', function (e, param) {} 로 반환값을 전달 받는다.
 * 7.  select 태그 기반으로 작성시 반드시 option 태그에 value 속성 존재하여야 한다. 디자인 셀렉트 에선 li 에 data-value 로 저장된다.
 * 8.  지정 높이가 리스트보다 작으면 자동 스크롤바 생성(http://jscrollpane.kelvinluck.com/)
 * 9.  1.4 버전 이후 IE6 지원하지 않음 
 * 10. 리스트의 가로 사이즈를 변경하고자 한다면 css .maskDiv_wddo 의 padding-right 나 margin-right 로 조절한다.
 * 11. 스크롤의 여백 조절은 좌.우 는 css .jspVerticalBar 의 left:0;padding-left, right:0;padding-right 를 조절하며 상단 하단 여백 높이는 css .jspCapTop .jspCapBottom 의 height 로 조절
 * 12. 리스트를 2줄이상으로 보이게 하려면 css white-space: nowrap; 삭제
 * 13. 리스트의 상하 여백은 padding-top, padding-bottom 으로 조절한다.
 * 14. 완료 이벤트 받는 방법은 3가지 존재한다.
 *         $('select').on('complete.selectbox', function () {}); select 태그의 이벤트를 이용
 *         opts.complete 옵션을 이용
 *         $.SelectBoxSet = function (_target, _options, _complete, _hidden) _compelte 인자를 이용(전체 완료 시), _hidden 인자로 보여지는 것만 적용할지 선택 가능
 *         사용하지 않는 getTab() 함수 삭제
 * 15. selectbox 가로크기 결정 요소는 opts.width, 미지정 시 select 태그 부모 가로크기이며 opts.width : 'auto' 시 값에 따라 유동적으로 변함, 아마것도 없으면 가장 긴 리스트 크기($container.width())
 * 
 * ex)
 * 
 *   1. Initialize
 *
 *       //일괄 적용
 *       $.SelectBoxSet('select', {height: 200}, onComplete, isHidden);
 * 
 *       //특정 셀렉트박스 적용
 *       var selectBox = new Hanatour.components.selectbox('select', {height: 200}); 
 *       selectBox.init();
 *       
 *       //적용대상
 *       - select 태그
 *       - div 태그 (div >> a, div >> ul 구조의 상위 DIV (UL > LI 에 data-value 속성 없으면 자동 pulldown menu 형태))
 *               
 *   2. Optional parameters
 *
 *      |Parameters        |Type       |Default        |Descripton
 *      ----------------------------------------------------------
 *       width              number      undeinfed       셀렉트 가로 크기
 *       height             number      undefined       스크롤바 한계높이
 *       direction          string      'down'          열리는 방향 ['up'|'down']
 *       speed              number      250             기본 속도. 닫힐 때는 이보다 절반의 속도로 닫힘
 *       aClass             string      'on'            리스트 LI의 A 태그의 오버,아웃,활성화와 div.select > a 활성화를 담당할 클래스 명
 *       divClass           string      'select'        컨테이너 DIV 태그 클래스 명
 *       btnClass           string      'tit'           클릭할 A 태그의 클래스명
 *       conClass           string      'overcon'       UL 감싸고 있는 DIV 클래스명
 *       ulClass            string      'con'           UL 클래스명
 *       chooseClass        string      undefined       선택과 미선택 구분 클래스
 *       disabledClass      string      undefined       셀렉트 박스 비활성화 클래스
 *       disabledItemClass  string      'disabled'      리스트 아이템 비활성화 클래스
 *       autoClose          boolean     false           pulldown 인 경우 리스트에서 포커스가 빠지면 자동으로 닫힐지 유무
 *       multiText          string      undefined       텍스트에 구분자를 지정하여 <span 태그로 래핑
 *       zindex             number      84212           열릴 때 z-index 값
 *       autoListWidth      boolean     false           리스트 크기가 가장 긴 텍스트에 맞게 자동 설정
 *       complete           function    undefined       생성완료 콜백 함수
 * 
 *   3. Methods
 * 
 *       //태그 참조하여 인스턴트 반환 & 호출
 *       var selectbox = $('#select').prev('div.select').getInstance();
 * 
 *       selectbox.getTarget();             //div 타깃 반환 (div.select)
 *       selectbox.getInfo();               //정보반환, change 이벤트의 param 와 같음
 *       selectbox.setIndex(idx);           //index로 선택
 *       selectbox.getIndex();              //index 반환
 *       selectbox.setValue(value);         //value로 선택
 *       selectbox.getValue()               //value 반환
 *       selectbox.setText(value);          //text로 선택
 *       selectbox.getText();               //text 반환
 *       selectbox.setDisabled(isDisabled); //셀렉트 박스 disabled
 *                                              - isDisabled    - boolean   - true 시 비활성화
 *       selectbox.setReset(isTrigger);     //select 태그를 토대로 재적용
 *                                              - isTrigger     - boolean   - false(default: true) 시 $hiddenSelect 에 대하여 change 이벤트발생 안함
 *       selectbox.init();                  //디자인 셀렉트 생성
 *       selectbox.dispose();               //디자인 셀렉트 삭제
 *       
 *   4. Event
 *       
 *       //<select> 태그 기반
 *       $('select').change(function (e) {
 *           console.log(e.target.value);
 *       });
 * 
 *       //<div class="select"> 기반
 *       $('.select').on('change.selectbox', function (e, param) {
 *           console.log('change index: ' + param.index);
 *           console.log('change value: ' + param.value);
 *           console.log('change text: ' + param.text);
 *       });
 *       
 *       //div.select 디자인 완료 시점 컨트롤 방법
 *       $('select').on('complete.selectbox', function () {
 *          var instance = $(this).prev('div.select').getInstance();
 *          if (instance !== undefined) instance.메소드();
 *       });
 *
 *       //변경 방법
 *       $('select').val('value2');             //document.getElementById('#select').value = "value2";
 *       or 
 *       $('select').prop('selectedIndex', 3);  //document.getElementById('#select').selectedIndex = 3;
 *       
 *       $('select').change();
 * 
 *   5. HTML
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
 *           <div class="selectL"></div> <!--리스트 하단 라운드 왼쪽-->
 *           <div class="selectR"></div> <!--리스트 하단 라운드 오른쪽-->
 *       </div>
 *   </div>
 * 
 *   6. CSS(default)
 * 
 *       .select {position:relative;}
 *       .select .tit {display:block;height:33px;background:url(img/common/bg_selectL.png) no-repeat left top;}
 *       .select .tit > span {display:inline-block;overflow:hidden;text-overflow:ellipsis;margin-left:15px;padding:10px 40px 10px 0;height:13px;background:url(img/common/bg_selectR.png) no-repeat right top;white-space: nowrap;}
 *       .select .tit.on {background:url(img/common/bg_selectLon.png) no-repeat left top;}
 *       .select .tit.on > span {background:url(img/common/bg_selectRon.png) no-repeat right top;}
 *       .select .overcon .con {padding:5px 0 15px;border-left:1px solid #ccc;border-right:1px solid #ccc;border-bottom:1px solid #ccc;background:#fff;}
 *       .select .overcon .con a {display:block;padding:5px 15px 5px 15px;white-space: nowrap;}
 *       .select .overcon .con a.on {background:#f1f1f1;}
 *       .select .overcon .selectL {width:16px;height:16px;background:url(img/common/bg_selectconL.gif) no-repeat;}
 *       .select .overcon .selectR {width:16px;height:16px;background:url(img/common/bg_selectconR.gif) no-repeat;}
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
        	$container,					//디자인 selectBox와 히든 input 을 담고 있는 컨테이너
            $target,                    //div >> a, ul 형태를 가지고 있는 DIV
            $btnA,                      //열고 닫기를 할 버튼 a
            $listCon,                   //리스트 ul 감싸고 있는 DIV
            $listUL,                    //리스트 ul
            $listA,                     //li 속 a
            $roundDIV,                  //ul 하단 라운드 레이아웃 담당하는 DIV x2
            $maskDIV,                   //트윈 DIV 를 감싸고 영역밖으로 overflow:hidden; 인 마스크 DIV
            $tweenDIV,                  //트윈이 일어나는 DIV
            $hiddenSelect,              //숨겨진 <select> 태그
            itemWidth,					//리스트안에 li 아이템 넓이
            itemHeight,					//리스트안에 li 아이템 높이
            listWidth,                  //리스트 최종적 넓이(ul tweenDiv border 포함)
            listHeight,                 //리스트의 스크롤링 되지 않은 최종적 높이
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
            jscroll,                    //jScroll 인스턴트
            zindex,                     //$target 부모의 zindex 값(일반상태), opts.zindex 는 open 시
            previousFilter, filterTimer;//키워드 검색에 필요한 변수 //add toggleTooltip 
        
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
                chooseClass: undefined,
                disabledClass: 'selDisabled',
                disabledItemClass: 'disabled',
                autoClose: false,
                multiText: undefined,
                zindex: 84212,
                autoListWidth: false,
                complete: undefined
            };
        }
        
        //init
        function init() {
            opts = $.extend(defaults, _options);
            
            createLayout();
            
            $container = $target.parent();
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
                var text, cls, htmlText, textArr, classArr, optDisabled;

                //$target : <select> tag -> <div> tag
                $target = $hiddenSelect.before('<div class="' + opts.divClass + '"><a href="#" class="' + opts.btnClass + '" title="' + title + '"><span></span></a></div>').prev();

                con = $target.append('<div class="' + opts.conClass + '"></div>').find('> div');
                ul = con.append('<ul class="' + opts.ulClass + '"></ul>').find('ul');
                con.append('<div class="selectL"></div><div class="selectR"></div>').find('> div'); //round layout

                $hiddenSelect.find('option').each(function () {
                    li = ul.append('<li><a href="#"></a></li>').find('li:last');
                    a = li.find('> a');
                    text = $(this).text();
                    optDisabled = ($(this).attr('disabled') === 'disabled'); //add 1.5.6
                    textArr = (opts.multiText === undefined) ? [text] : text.split(opts.multiText);
                    classArr = ($(this).attr('class') === undefined) ? [] : $(this).attr('class').split(' ');
                    htmlText = '';

                    //optinos disabled //add 1.5.6
                    li.filter(function () {
                    	return optDisabled
                    //}).hide().addClass(opts.disabledItemClass); //modify 1.5.9 //del 1.6.4
                    }).addClass(opts.disabledItemClass)./*css('opacity', 0.5).*/filter(function () {return $(this).index() === 0}).hide(); //add 1.6.4

                    //multi text
                    $(textArr).each(function (idx){
                        cls = (classArr[idx] !== undefined) ? classArr[idx] : '';
                        htmlText += '<span' + ( (classArr.length !== 0) ? ' class="' + cls + '"' : '' ) + '>' + textArr[idx] + '</span>';
                    });
                    
                    a.html(htmlText).data('value', $(this).attr('value'));
                });
                
                $hiddenSelect.css('display', 'none');
            }
        }

        //init layout
        function initLayout() {
        	//width - width();
        	//height - outerHeight();
        	//roundDIV exception
        	
   			zindex = $container.css('z-index');
            
            //add 1.5.3
            $hiddenSelect.parents().filter(function () {
            	return $(this).css('display') === 'none'
            }).show().addClass('unhide_wddo');
            
            $listCon.css('display', 'block');
            $tweenDIV = $listCon.wrap('<div class="maskDiv_wddo" style="*position: relative;"><div class="tweenDiv_wddo">').parent();
            $maskDIV = $tweenDIV.parent();

	    	var li = $listUL.find('> li').not(':hidden').filter(':first'); //modify 1.5.6, add ".not(':hidden')"
            var bwListUL = getBorderWidth($listUL);
            var bwTweenDIV = getBorderWidth($tweenDIV);
            var bhListUL = getBorderHeight($listUL);
            var bhTweenDIV = getBorderHeight($tweenDIV);

            //auto list width //add 1.5.9
            var maxItemWidth = 0;
            if (opts.autoListWidth) maxItemWidth = getMaxItemWidth($listA);

			//container //add 1.4.5
			if (opts.width === undefined) opts.width = $container.width();
			if (!isNaN(opts.width)) $container.css('width', opts.width); //fix selectbox width //add 1.6.3 !isNaN(opts.width)

            //btn
            btnWidth = $btnA.width();
            btnHeight = $btnA.outerHeight();

			changeBtnWidth(); //modify 1.6.3
            
            //item //add 1.4.7
            itemWidth = (maxItemWidth) ? Math.max(maxItemWidth, li.width()) : li.width(); //modify 1.5.9, add maxItemWidth
            itemHeight = li.outerHeight();

            //list
            listWidth = itemWidth + bwListUL + bwTweenDIV;
            listHeight = ($listUL.children()/*.not('.disabled')*/.filter(function() { //del 1.6.4 .not()
                return !($(this).hasClass(opts.disabledItemClass) && $(this).index() === 0) //add 1.6.4
            }).length * itemHeight) + bhListUL; //$listUL.outerHeight(); crossbrowser error
            
            $roundDIV.css({
                'position' : 'relative',
                'marginTop' : -$roundDIV.outerHeight()
            }).filter(':eq(1)').css({'marginLeft' : listWidth - $roundDIV.outerWidth()});

            $tweenDIV.css({
            	'height' : listHeight
            });
            
            $maskDIV.css({
                'position' : 'absolute',
                'overflow' : 'hidden',
                'left': '0',
                'top' : btnHeight,
                'width' : listWidth,
                'height' : listHeight + parseInt($listUL.css('paddingTop')) + parseInt($listUL.css('paddingBottom')) //list top&bottom space //add 1.5
            });

            //IE7-
            IE7Fix();
            
            //scroll apply
            addScroll();

            //add scroll : layout reset
            if (isScroll) {
            	itemWidth = li.width();

                listWidth = itemWidth + bwListUL + bwTweenDIV;
                $roundDIV.filter(':eq(1)').css({'marginLeft' : listWidth - $roundDIV.outerWidth()});
                $maskDIV.css('height', opts.height);
                $tweenDIV.css('height', opts.height);
            }

            //direction
            modifyDirection();
        }

        //change btn width
        function changeBtnWidth() {
            if (opts.width === 'auto') {
                var chooseItemA = $listA.eq(selectIndex);

                var chooseItemWidth = getMaxItemWidth(chooseItemA);
                var scrollDistance = parseInt(chooseItemA.css('marginRight'));
                var bwListUL = getBorderWidth($listUL);
                var bwTweenDIV = getBorderWidth($tweenDIV);
                var maskRightDistance = parseInt($maskDIV.css('paddingRight')) + parseInt($maskDIV.css('marginRight'));
 
                btnWidth = chooseItemWidth + bwListUL + bwTweenDIV + maskRightDistance - scrollDistance;

                $container.css('width', btnWidth);
            }

            //btn A > span blank // - 5 add 1.4.4
            var btnAMultiLine = $btnA.find('> span').css('white-space') !== 'nowrap';
            var btnABlank = (opts.width !== undefined && !isNaN(opts.width)) ? 5 : 0; //add 1.6.3 !isNaN(opts.width)
            $btnA.find('> span').css(((!btnAMultiLine) ? 'width' : 'paddingRight'), ((!btnAMultiLine) ? (btnWidth - btnABlank) : btnABlank));
        }
        
        //get max item width //1.5.9
        function getMaxItemWidth(_target) {
            var targetAs = _target;
            var maxItemWidth = getMaxTextWidth(targetAs);

            var paddingL = parseInt($listA.css('paddingLeft'));
            var marginR = parseInt($listA.css('marginRight'));

            if (!isNaN(paddingL) && !isNaN(marginR)) maxItemWidth += (paddingL * 2) + marginR;

            return maxItemWidth;
        }

        //get max text width //1.5.9
        function getMaxTextWidth(_target) {
            var targetAs = _target;
            var max = 0;
            var targetA, wid;

            targetAs.each(function () {
                targetA = $(this);
                wid = getTextWidth(targetA);

                targetA.data('inner-text-width', wid); //save

                if (max < wid) max = wid;
            });

            return max;
        }

        //get text width //1.5.9
        function getTextWidth(_target) {
            var targetA = _target;
            var itemWidth = 0;

            if (targetA.length === 1) {
                var targetSPAN = targetA.find('> span:first');
                var siblingsSPAN = targetSPAN.siblings('span');

                itemWidth = targetSPAN.outerWidth();

                if (siblingsSPAN.length > 0) { //multi <span>
                    siblingsSPAN.each(function () {
                         itemWidth += $(this).outerWidth();
                    });
                }
            }

            return itemWidth;
        }

        //get border left, right //add 1.4.8
        function getBorderWidth(_target) {
        	//ie8- css 'border-left-width' 'border-right-width' default value 'medium'
            var borderLeftWidth = parseInt(_target.css('border-left-width')) | 0;
            var borderRightWidth = parseInt(_target.css('border-right-width')) | 0;

            return borderLeftWidth + borderRightWidth;
        }
        
        //get border top, bottom //add 1.4.9
        function getBorderHeight(_target) {
        	//ie8- css 'border-top-width' 'border-bottom-width' default value 'medium'
            var borderTopHeight = parseInt(_target.css('border-top-width')) | 0;
            var borderBottomHeight = parseInt(_target.css('border-bottom-width')) | 0;

            return borderTopHeight + borderBottomHeight;
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
            if (opts.height !== undefined && opts.height < listHeight) {
                $listUL.css('height', '100%'); //add 1.5.8

                var pane = $listCon.show().wrap('<div class="scroll-pane"></div>').parent();

                pane.css({
                    'overflow' : 'auto',
                    'height' : opts.height
                });
                
                pane.on('jsp-initialised', function (e, _isScroll) {
                	isScroll = _isScroll;
                	
                	if (isScroll) {
						//non .jspPane scroll padding
						var jspPane = pane.find('.jspPane');
						var bwTweenDIV = getBorderWidth($tweenDIV);
						
	                	jspPane.css('width', listWidth - bwTweenDIV);
                	}
                });
                
                //create jscroll
                jscroll = pane.jScrollPane({
                    showArrows: true,
                    verticalDragMinHeight: 30, 	//min height with vertical scroll bar
                    mouseWheelSpeed: itemHeight	//mousewheel distance //add 1.5.4
                });
 
                pane.attr('tabIndex', -1);
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

            if (_isOpen) $container.css('z-index', ($target.data('zindex') === undefined) ? opts.zindex : parseInt($target.data('zindex'))); //modify 1.5.7
            
            if ($tweenDIV.length !== 0) {
                var top = (_isOpen) ? 0 : $maskDIV.outerHeight() * direction; //open 0
                
                if (speed > 1) {
                    $maskDIV.add($listCon).show();
                }//else default close

                $tweenDIV.stop().animate({
                    'marginTop': top
                },{queue:false, duration:speed, complete:comp});
            }
            
            //transition complete function
            function comp () {
                //close complete
                if (!_isOpen) {
                    $maskDIV.hide();
                    removeDocumentEvent();
                    $btnA.removeClass(opts.aClass);
                    $container.css('z-index', zindex);
                } else {
                //open complete
                    addDocumentEvent();
                    removeTooltip(); //add 1.6.1 important remove tooltip
                }
            }
        }
        
        //document event
        function addDocumentEvent() {
            $(document).on('click.selectbox', function (e) {
                //var currentTarget = $(e.currentTarget);
                var target = $(e.target);
                var isOpen = ($target.data('state') === 'open');

                if (target.closest('.jspContainer').length === 0 && isOpen) {
                    changeBtnState(false);
                }
            });
        }
        
        function removeDocumentEvent() {
            $(document).off('click.selectbox');
        }
        
        //check tooltip //add 1.6.1
        function toggleTooltip() {
            if (opts.autoListWidth) {
                var isOver = $listA.eq(selectIndex).data('inner-text-width') > $btnA.width();
                var isOpen = ($target.data('state') === 'open');

                if (isOver && !isOpen) {
                    addTooltip();
                } else {
                    removeTooltip();
                }
            }
        }

        //add tooltip
        function addTooltip() {
            if (opts.autoListWidth) {
                if ($container.next('.tooltipDiv_wddo').length === 0) $container.after('<div class="tooltipDiv_wddo">'); //create tooltip

                var tooltip = $container.next('.tooltipDiv_wddo');
                tooltip.empty();

                tooltip.css({
                    /*'left' : $container.offset().left,*/
                    /*'top' : $container.offset().top,*/
                    'z-index' : zindex + 1
                }).html('<span>' + $btnA.text() + '</span>');

                tooltip.css('marginTop', -tooltip.outerHeight() - $container.outerHeight());
            }
        }

        //important remove tooltip
        function removeTooltip() {
            if (opts.autoListWidth) {
                var tooltip = $container.next('.tooltipDiv_wddo');

                if (tooltip.length > 0) tooltip.remove();
            }
        }

        //event
        function initEvent() {
            isEvent = true;
            
            //btn a handler
            $btnA.on('click.selectbox', function (e) {
                var target = $(e.currentTarget);
                var toggle = ($target.data('state') !== 'open'); //true : open

                changeBtnState(toggle); //open & close
                //if (selectIndex !== undefined && toggle) selectList($listA.eq(selectIndex)); //list on, if open // delete 1.4.4
                if (selectIndex !== undefined && toggle) $listA.eq(selectIndex).triggerHandler('mouseover.selectbox'); // add 1.4.8
                if ((!isValue && jscroll !== undefined) && toggle) changeScroll(0); //if pulldown menu & jscroll

                e.preventDefault();
            });

            $btnA.on('focusin.selectbox mouseover.selectbox', function (e) {
                toggleTooltip();
            });

            $btnA.on('focusout.selectbox mouseout.selectbox', function (e) {
                var target = $(e.currentTarget);
                if (target.filter(':focus').length === 0) removeTooltip();
            });
            
            //<select> version
            if (isValue) {
                $btnA.add($listA).on('keydown.selectbox', function (e) {
                    var target = $(e.currentTarget);
                    var keyCode = (e.keyCode >= 96 && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode; //modify 1.6.4
                    var idx = scope.getIndex() || 0;
                    var altOpen = (e.altKey && (keyCode == 40 || keyCode == 38)); //down, up key
                    var isOpen = ($target.data('state') === 'open');
                    var li = $listUL.find('li');

                    if (altOpen) previousFilter = undefined;

                    //toggle alt + 'up' 'down' and 'spacebar' key (not search)
                    if (altOpen /*&& !isOpen*/ || keyCode === 32 && previousFilter === undefined) { //modify 1.6.4.. delete '&& !isOpen'
                        changeBtnState(!isOpen, 2); //modify 1.6.4.. true -> !isOpen
                        if (!isOpen) selectList($listA.eq(idx)); //modify 1.6.4.. add 'if (!isOpen)'
                        
                        e.preventDefault();
                    } else {
                        switch (keyCode) {
                            case 13 : //enter, choose list and btn focus
                                if (target.is($btnA)) {
                                    e.preventDefault();
                                    if (isOpen) changeBtnState(false);
                                    toggleTooltip();
                                    
                                    e.preventDefault();    
                                }
                                break;
                            case 9 : //tab, is open
                                if (isOpen) {
                                    e.preventDefault();
                                    changeBtnState(false);
                                
                                    e.preventDefault();
                                }
                                break;
                            case 34 : //pagedown //add 1.6.4
                                //If it's not open, Move 3
                                //If it's open and scrolling, Move as much as the visible list
                                var nextAllLI = li.eq(idx).nextAll(':not(".' + opts.disabledItemClass + '")');
                                var viewNum = Math.round(opts.height / itemHeight);
                                var jumpNum = Math.min(((isOpen) ? viewNum : 3), nextAllLI.length);
                                var nextLI = nextAllLI.slice(0, jumpNum).last();

                                if (nextLI.index() > -1) selectList(nextLI.find('a'));
                                
                                e.preventDefault();
                                break;
                            case 35 : //end
                                selectList(li.not('.' + opts.disabledItemClass).filter(':last').find('a'));

                                e.preventDefault();
                                break;
                            case 40 : //down, right
                            case 39 :
                                //if (scope.getIndex() !== undefined) {//not label //del 1.6.4
                                    var nextLI = li.eq(idx).nextAll().not('.' + opts.disabledItemClass).filter(':first');

                                    if (nextLI.index() > -1) selectList(nextLI.find('a'));
                                /*} else {
                                    selectList($listA.eq(idx));
                                }*/
                                
                                e.preventDefault();
                                break;
                            case 33 : //pageup //add 1.6.4
                                var prevAllLI = li.eq(idx).prevAll(':not(".' + opts.disabledItemClass + '")');
                                var viewNum = Math.round(opts.height / itemHeight);
                                var jumpNum = Math.min(((isOpen) ? viewNum : 3), prevAllLI.length);
                                var prevLI = prevAllLI.slice(0, jumpNum).last();

                                if (prevLI.index() > -1) selectList(prevLI.find('a'));

                                e.preventDefault();
                                break;
                            case 36 : //home
                                selectList(li.not('.' + opts.disabledItemClass).filter(':first').find('a'));

                                e.preventDefault();
                                break;
                            case 38 : //up, left
                            case 37 :
                                var prevLI = li.eq(idx).prevAll().not('.' + opts.disabledItemClass).filter(':first');

                                if (prevLI.index() > -1) selectList(prevLI.find('a'));
                            
                                e.preventDefault();
                                break;
                            default :
                                //add 1.6
                                var preventDefault = false;
                                var prev = previousFilter || "";
                                var character = String.fromCharCode(keyCode);
                                var skip = false;
                                var active = $listA.eq(selectIndex).parent(); //li
                                var match; //li

                                clearTimeout(filterTimer);

                                if (character === prev) {
                                    skip = true;
                                } else {
                                    character = prev + character;
                                }

                                match = filterMenuItems(character).parent(); //search
                                match = skip && match.index( active.next() ) !== -1 ?
                                    active.not('.' + opts.disabledItemClass) :
                                    match;

                                //not match, research
                                if (!match.length) {
                                    character = String.fromCharCode(keyCode);
                                    match = filterMenuItems(character);
                                }

                                if (match.length) {
                                    selectList(match.filter(':first').find(' > a')); //this.focus( event, match );
                                    previousFilter = character;
                                    filterTimer = delay(function() {
                                        previousFilter = undefined;
                                    }, 1000 );
                                }else{
                                    previousFilter = undefined;
                                }

                                e.preventDefault();
                        };//end switch
                    }
                });
                
                if ($hiddenSelect !== undefined) {
                    //<select> tag change -> selecbox change 
                    $hiddenSelect.bind('change.selectbox', function (e) {
                        //selectList() copy
                        var target = $listA.eq($hiddenSelect[0].selectedIndex);
                        var text = target.text();
                        var html = target.html();
                        var value = target.data('value');
                        var idx = target.closest('li').index();
            
                        if (isDisabled) return false;

                        selectIndex = idx;
                        
                        $listA.eq(selectIndex).triggerHandler('mouseover.selectbox');
                        
                        changeText(text, html);
                        changeValue(value);
                        changeScroll();
                        changeChoose();

                        $target.trigger('change.selectbox', scope.getInfo());  // add 1.5.5
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
                var li = target.closest('li');

                if (li.hasClass(opts.disabledItemClass)) {e.preventDefault(); return;} //add 1.6.4

                if (isValue) {
                    e.preventDefault();

                    selectList(target);
                    changeBtnState(false);
                    if ($btnA !== undefined) $btnA.focus();
                }
            });
            
            $listA.on('mouseover.selectbox focusin.selectbox', function (e) {
                var target = $(e.currentTarget);
                var li = target.closest('li');
                var idx = li.index();
                
                if (li.hasClass(opts.disabledItemClass)) return; //add 1.6.4

                //all remove class form list <A> & add class
                $listA.removeClass(opts.aClass).eq(idx).addClass(opts.aClass);
            });
        }
        
        //search keyword to item //add 1.6 
        function filterMenuItems(character) {
            var escapedCharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
                regex = new RegExp( "^" + escapedCharacter, "i" );

            return $listA.filter(function () {
                return !$(this).parent().hasClass(opts.disabledItemClass);
            }).filter(function() {
                return regex.test($.trim($( this ).text()));
            });
        }

        //extend timeout //add 1.6 
        function delay(handler, delay) {
            function handlerProxy() {
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                    .apply( instance, arguments );
            }
            var instance = this;
            return setTimeout( handlerProxy, delay || 0 );
        }

        function removeEvent() {
            isEvent = false;
            
            $listA.off('.selectbox');
            $btnA.off('.selectbox');
            $(document).off('.selectbox');
            if ($hiddenSelect !== undefined) $hiddenSelect.off('.selectbox');
        }
        
        //init attribute from <select>
        function initAttribute() {
            //select first 
            if ($hiddenSelect !== undefined) {
                var selectedIdx = ($hiddenSelect.find('> option:selected').length > 0) ? $hiddenSelect.find('> option:selected').index() : 0;

                //scope.setIndex(selectedIdx); // remove 1.5.2
                changeBtnState(true, 0);
            	selectList($listA.eq(selectedIdx), true);
            	changeBtnState(false, 0);
                
                scope.setDisabled($hiddenSelect.prop('disabled')); // modify 1.5.7
                
                $hiddenSelect.trigger('complete.selectbox'); // add 1.4.6
            } else {
                scope.setDisabled(false);
            }
        }
        
        //select list & close
        function selectList(_target, _first) {
            var target = _target; //li tag
            var text = target.text();
            var html = target.html();
            var value = target.data('value');
            var idx = target.closest('li').index();
            var isFirst = (_first !== undefined) ? _first : false; // add 1.5.2

            if (isDisabled) return false;

            if (isValue) {
                //idx save
                selectIndex = idx;
                
                $listA.eq(selectIndex).triggerHandler('mouseover.selectbox');
                
                //add 1.5.9
                if (isFirst) {
                    changeText(text, html);
                    changeValue(value);
                    changeScroll();
                    changeChoose();
                } else {
                    changeHiddenSelect();
                }

                /*
                //remove 1.5.9
                changeText(text, html);
                changeValue(value);
                changeScroll();
                changeChoose();
                if (!isFirst) changeHiddenSelect();
                */

                toggleTooltip(); //add 1.6.1
            } else {
                changeScroll(0); //init scroll ypos
                $target.trigger('change.selectbox', scope.getInfo()); //add 1.5.5     
            }
            
            //event binding
            //$target.trigger('change.selectbox', scope.getInfo());   //del 1.5.5 //changeHiddenSelect() -> $hiddenSelect.bind('change.selectbox') -> $target.trigger('change.selectbox')
        }
        
        //change btn state
        function changeBtnState(_value, _speed) {
            var speed = _speed;
            
            if (isDisabled || $target === undefined || $btnA === undefined || $listA === undefined) return false;

            if ($listA !== undefined) $listA.removeClass(opts.aClass);
            
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
        function changeText(_txt, _html) {
            $btnA.children().html(_html);
            
            //btnA multiline //add 1.4.8
            btnHeight = $btnA.outerHeight();
			if (opts.direction === 'down') $maskDIV.css('top', btnHeight);
			
            //auto fit container width //add 1.6.3 
            if (opts.width === 'auto') changeBtnWidth();

            selectText = _txt;
        }
        
        //value change
        function changeValue(_value) {
            selectValue = _value;
        }
        
        //scroll move
        function changeScroll(_ypos) {
            if ($target.find('.jspDrag').length > 0) {
            	var idx = selectIndex - $hiddenSelect.find('option:disabled').length; //add 1.5.6
                var ypos = (_ypos !== undefined) ? _ypos : itemHeight * idx;
                
                jscroll.data('jsp').scrollToY(ypos);
            }
        }

        //toggle choose class for div.select //add 1.5.6
        function changeChoose() {
        	if ($hiddenSelect !== undefined && opts.chooseClass !== undefined) {
                if ($hiddenSelect.find('option').eq(selectIndex).is(':disabled')) {
                	$target.removeClass(opts.chooseClass);
                } else {
                	$target.addClass(opts.chooseClass);
                }
            }
        }
        
        //<select> tag change
        //selecbox change -> <select>
        function changeHiddenSelect() {
            if ($hiddenSelect !== undefined) {
                $hiddenSelect.find('option').removeAttr('selected').eq(selectIndex).prop('selected', true).end().end().trigger('change'); // modify 1.5.5, 'change.selectbox' -> 'change'
                //$hiddenSelect.val(selectValue).trigger('change'); // error : <option> attribute "value" same
            }
        }

        //public
        //init
        this.init = function () {
            $target = (_target.jquery === undefined) ? $(_target) : _target;
      
            if ($target.length > 0) {
                if ($target.is('select') && $target.data('select') !== undefined) return false;  //avoid duplication
                
                scope = this;
                
                init();
                initLayout();
                
                //scope
                if ($target.data('scope') === undefined) $target.data('scope', scope);
                
                initAttribute();
                
                $hiddenSelect.parents('.unhide_wddo').hide().removeClass('unhide_wddo'); //add 1.5.3
                
                if (opts.complete !== undefined && typeof opts.complete === 'function') opts.complete({target: $target});
            }
        };
        
        //reset
        this.setReset = function (_trigger) {
            var isTrigger = (_trigger === undefined) ? true : _trigger;

            scope.dispose();
            scope.init();
            if (isTrigger) changeHiddenSelect(); //add 1.5.5
        };
        
        //dispose
        this.dispose = function () {
            //remove animate infomation
            $listCon.parent('div').stop().css('marginTop', '');
            
            //remove scroll source
            if (jscroll !== undefined && jscroll.data('jsp') !== undefined) {
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
            zindex = undefined;
            
            //add 1.6
            previousFilter = undefined;
            filterTimer = undefined;
            
            $target.removeData('scope');
            $target.removeData('state');
            $listA.removeData('inner-text-width'); //add 1.5.9
            $listA.removeData('value'); //add 1.5.9
            $listA.removeClass(opts.aClass);
            $btnA.removeClass(opts.aClass);
            $listCon.hide();
            
            if ($hiddenSelect !== undefined) {
                $hiddenSelect.css('display', '');
                $hiddenSelect.siblings('div.' + opts.divClass).remove();
                $hiddenSelect.removeData('select');
                $hiddenSelect.find('option').removeProp('selected'); //add 1.6.3
            }
            
            //scope = undefined;
            $container = undefined;
            $target = undefined;
            $btnA = undefined;
            $listCon = undefined;
            $listUL = undefined;
            $listA = undefined;
            $roundDIV = undefined;
            $maskDIV = undefined;
            $tweenDIV = undefined;
            $hiddenSelect = undefined;
            itemWidth = undefined;
            itemHeight = undefined;
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
        this.getInfo = function () {
            return {
                index: selectIndex,
                value: selectValue,
                text: selectText
            };
        };
        
        //set get index
        this.setIndex = function (_idx) {
            if ($listA.eq(_idx).parent().hasClass('disabled')) return; //add 1.5.9

            changeBtnState(true, 0);
            selectList($listA.eq(_idx));
            changeBtnState(false, 0);
        };
        
        this.getIndex = function () {
            return selectIndex;  
        };
        
        //set get value
        this.setValue = function (_value) {
            var idx;
            $listA.each(function () {
                if ($(this).data('value') === _value) {
                    idx = $(this).closest('li').index();
                    return false;
                } 
            });
            
            this.setIndex(idx);
        };
        
        this.getValue = function () {
            return selectValue;
        };
        
        //set get text
        this.setText = function (_value) {
            var idx;
            $listA.each(function () {
                if ($(this).text() === _value) {
                    idx = $(this).closest('li').index();
                    return false;
                } 
            });
            
            this.setIndex(idx);
        };
        
        this.getText = function () {
            return selectText;
        };
        
        //set disabled
        this.setDisabled = function (_value) {
            var target = $target.children().eq(0); //btnA
            var txt = target.text();
            var cls = target.attr('class');

            //first
            changeBtnState(false, 0);    //default close

            if (_value) {
                (opts.disabledClass !== undefined) ? $target.addClass(opts.disabledClass) : $target.css('opacity', 0.5);
                
                if ($hiddenSelect !== undefined) $hiddenSelect.prop('disabled', true);
                
                if (!isDisabled) target.css('display', 'none').after('<span class="' + opts.btnClass + '"><span style="width:' + target.find('> span').width() + 'px">'+target.text()+'</span></span>');
                
                if (isEvent) removeEvent();
            } else {
                (opts.disabledClass !== undefined) ? $target.removeClass(opts.disabledClass) : $target.css('opacity', 1);
                
                if ($hiddenSelect !== undefined) $hiddenSelect.removeAttr('disabled');
                
                if (isDisabled) target.css('display', '').siblings('span').remove();                    
                
                if (!isEvent) initEvent();
            }
            
            isDisabled = _value;
        };
    };//end Obj

    return wddoObj;
}(jQuery));

//multiple init selectbox
if ($ !== undefined && $.SelectBoxSet === undefined) {
    $.SelectBoxSet = function (_target, _options, _complete, _hidden) {
    	$(document).ready(function () {
    		var complete = _complete || function () {};
    		var isHidden = (_hidden === undefined) ? true : _hidden; //add 1.5.8
    		var target = (typeof _target === 'string') ? $(_target) : _target;
    		
    		var visibleTarget = target.not(':hidden');
    		var hiddenTarget = target.filter(':hidden');

    		//눈에 보이는 것
    		visibleTarget.each(function (idx) {
    			//<select> 미적용 대상들 적용
    			if ($(this).prev('.select').getInstance() === undefined) {
    				var selectBox = new SelectBox($(this), _options);
    				selectBox.init();
    			} else {
    			//<select> 적용 대상들 닫기
    			//하나하나 닫지 말고 $(document).triggerHandler('click.selectbox'); 발생시키는걸로 대체
    				//if ($(this).prev('.select').data('state') === 'open') {
    				//    $(this).prev('.select').find('> a').triggerHandler('click.selectbox'); //close
    				//}
    			}
    		})
    		
    		//IE에서 느려지는 문제있어 isHidden 으로 선택 할 수 있도록 함 1.5.8
    		if (isHidden) {
    			setTimeout(function () {
    				//눈에 보이는 것 먼저 적용 후 숨겨져 있는 적용
    				hiddenTarget.each(function (idx) {
    					//<select> 미적용 대상들 적용
    					if ($(this).prev('.select').getInstance() === undefined) {
    						var selectBox = new SelectBox($(this), _options);
    						selectBox.init();
    					} else {
    					//<select> 적용 대상들 닫기
    					//하나하나 닫지 말고 $(document).triggerHandler('click.selectbox'); 발생시키는걸로 대체
    						//if ($(this).prev('.select').data('state') === 'open') {
    						//   $(this).prev('.select').find('> a').triggerHandler('click.selectbox'); //close
    						//}
    					}
    				});

    				complete();
    			}, 0); //눈에 보이는것과 안보이는것 묶음 순차 발생을 위해 0 딜레이
    		}

    		if (!isHidden) complete();
    	}); //end ready
    };
}

//get instance
if ($.fn.getInstance === undefined) $.fn.getInstance = function () { return this.data('scope') === null ? undefined : this.data('scope'); };