/**
* 하나투어 jQuery UI 기반 달력 :: 인라인 초기화
*
* @author : Jo Yun Ki (wddoddo@gmail.com)
* @version : 1.0.1
* @since : 2015.12.04
*
* history
*   1.0.1 (2015.12.16) : 외부 레이아웃 수정 가능한 addUpdate, addEvent 옵션 추가
*
* HT_JQUI_WCalendar.init(target, options);
*
* @param target             ::: datepicker 타깃 설정
* @param options            ::: 설정 Object 값
*
* options                   ::: jquery ui datepicker 옵션 기반
*   addUpdate:Function = function (container) {}        //레이아웃 업데이트 확장 함수
*   addEvent:Function = function (container) {}         //이벤트 확장 함수
*
* method
*   HT_JQUI_WCalendar.init(target, options);    //초기화
*/
var HT_JQUI_WCalendar = (function ($) {
    var scope,
        container,
        isMulti = false,
        holidays = ['1-1', '3-1', '5-1', '5-5', '6-6', '8-15', '10-3', '10-9', '12-25'],
        lunardays = ['2014-1-30', '2014-1-31', '2014-2-1', '2014-5-6', '2014-9-7', '2014-9-8', '2014-9-9', '2015-2-18', '2015-2-19', '2015-2-20', '2015-5-25', '2015-8-14', '2015-9-26', '2015-9-27', '2015-9-28', '2016-2-8', '2016-2-9', '2016-5-14', '2016-2-10', '2016-9-14', '2016-9-15', '2016-9-16', '2017-1-27', '2017-1-28', '2017-1-29', '2017-5-3', '2017-10-3', '2017-10-4', '2017-10-5', '2018-2-15', '2018-2-16', '2018-2-17', '2018-5-22', '2018-9-23', '2018-9-24', '2018-9-25', '2019-2-4', '2019-2-5', '2019-2-6', '2019-5-12', '2019-9-12', '2019-9-13', '2019-9-14', '2020-1-24', '2020-1-25', '2020-1-26', '2020-4-30', '2020-9-30', '2020-10-1', '2020-10-2'],
        opts,
        defaults = getDefaultOption(),
        init = function (target, options) {
            opts = $.extend(defaults, options);

            isMulti = ($.isArray(opts.numberOfMonths) && opts.numberOfMonths.length > 0 && opts.numberOfMonths[0] > 1)
            container = target;

            if (container.length > 0 && !container.hasClass('hasDatepicker')) {
                container.data('scope', scope);

                initCallback();
                initLayout();
                initEvent();
            }
        };

    function getDefaultOption() {
        return {
            //numberOfMonths: [4, 1],
            //minDate: '+1d',
            dateFormat: 'yy-mm-dd',
            showMonthAfterYear: true,
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayNames: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            yearSuffix: '.',
            beforeShowDay: function (date) {
                var holiday = (checkHoliday(date) || checkLunarday(date))? 'holiday' : '';
                var result;
                
                switch (date.getDay()) {
                    case 0: //일요일
                        result = [showDate(date), holiday + ' sun'] ;
                        break;
                    case 6: //토요일
                        result = [showDate(date), holiday + ' sat'];
                        break;
                    default:
                        result = [showDate(date), holiday];
                }

                return result;
            },
            addUpdate : undefined,
            addEvent : undefined
        };
    }

    function checkLunarday(date) {
        var day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        return $.inArray(day, lunardays) > -1;
    }

    function checkHoliday(date) {
        var day = (date.getMonth() + 1) + '-' + date.getDate();
        
        return $.inArray(day, holidays) > -1;
    }

    function showDate(date) {
        return (opts.extendBeforeShowDay !== undefined) ? opts.extendBeforeShowDay(date) : true;
    }

    function initCallback() {
        //feb. mar. apr. may. jun. jul. aug. sep. oct. nov. dec

        container.on('update.wddo', function (e) {
            if (opts.addUpdate !== undefined) opts.addUpdate(container);

            var datepicker = (isMulti) ? $(this).find('.ui-datepicker-group') : $(this);

            //타이틀에 연월 간격 삭제
            datepicker.find('.ui-datepicker-title').each(function (idx) {
                $(this).contents().eq(1).replaceWith('.');
            });  
        });

        container.on('complete.wddo', function (e) {
            claerSelect();
        })
    }

    function initLayout() {
        if (container.datepicker !== undefined) container.datepicker(opts);
    }

    function initEvent() {
        if (opts.addEvent !== undefined) opts.addEvent(container);
    }

    function claerSelect() {
        container.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day').find('> a').removeClass('ui-state-active ui-state-highlight ui-state-hover');
    }

    function changeDate(_date) {
        var ins = container.data('datepicker');

        ins.currentYear = _date.getFullYear();
        ins.currentMonth = _date.getMonth();
        ins.currentDay = _date.getDate();
    }

    function selectAll(group) {
        claerSelect();

        container.find('td.on').removeClass('on'); //멀티 달력끼리 중복 on 방지
        group.find('a').parent().addClass('on'); //해당 달력 모두 활성화 
    }

    return {
        init: function (target, options) {
            scope = this;

            init(target, options);
        },

        setClaer: function () {
            claerSelect();
        },

        setSelect: function (_date) {
            changeDate(_date);

            container.datepicker('refresh');
        },

        setSelectAll: function (_date) {
            container.find('.ui-datepicker-group').each(function () {
                var yearStr = $(this).find('.ui-datepicker-year').text();
                var monthStr = parseInt($(this).find('.ui-datepicker-month').text()).toString();
                
                if (yearStr === String(_date.getFullYear()) &&  monthStr === String(_date.getMonth()+1)) {
                    changeDate(_date);

                    selectAll($(this));
                }
            });
        }
    };
}(jQuery));