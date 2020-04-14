/**
* 하나투어 jQuery UI 기반 슬라이드 :: 인라인 초기화
*
* @author : Jo Yun Ki (wddoddo@gmail.com)
* @version : 1.0
* @since : 2015.12.04
*
* history
*
* HT_JQUI_WRangeSlider.init(target, options);
*
* @param target             ::: slider 타깃 설정
* @param options            ::: 설정 Object 값
*
* options
*   key:type = value        //설명
*
* method
*   HT_JQUI_WRangeSlider.init(target, options);    //초기화
*/
var HT_JQUI_WRangeSlider = (function ($) {
    var scope,
        container,
        opts,
        defaults = getDefaultOption(),
        init = function (target, options) {
            opts = $.extend(defaults, options);

            container = target;

            if (container.length > 0 && !container.hasClass('ui-slider')) {
                container.data('scope', scope);

                initCallback();
                initLayout();
                initEvent();
            }
        };

    function getDefaultOption() {
        return {
            range: true,
            values: [0, 0],
            min: 0,
            max: 0,
            slide: function(e, ui) {
                var slider = $(e.target);

                changeText(ui.values[0], ui.values[1]);
            }
        };
    }

    function changeText(_min, _max) {
        var min = String(_min).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        var max = String(_max).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        container.siblings('div').find('> span:eq(0)').text(min + '원');
        container.siblings('div').find('> span:eq(1)').text(max + '원');
    }

    function initCallback() {
        
    }

    function initLayout() {
        container.slider(opts);
        changeText(container.slider('values', 0), container.slider('values', 1));
    }

    function initEvent() {
        
    }

    return {
        init: function (target, options) {
            scope = this;

            init(target, options);
        }
    };
}(jQuery));