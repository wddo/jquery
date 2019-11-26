/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.2.0
 * @since : 2014.03.26
 * 
 * history
 * 
 * 1.0   (2014.03.26) : -
 * 1.2.0 (2018.03.13) : url 배열 뿐만 아니라 jqueryObject 대응 토록 수정
 * 
 ********************************************************************************************
 ************************************** 프리로더 ********************************************
 ********************************************************************************************
 * 
 * var instance = new WPreLoad(data, options);
 * 
 * @param reqData   ::: 적용할 url 배열 & jQuery 객체 
 * @param options   ::: 오브젝트 형태의 callback 을 받을 수 있는 함수 집합
 * 
 * options object
 *  done(data)      - 개별 로딩
 *      data.source      - 임시로 생성했던 소스
 *      data.element     - 실제 대상(문자열시 src 반환)
 *      data.percent     - complete 까지의 완료 %
 *  complete(data)  - 전체 로딩 완료
 */

var WPreLoad = (function () {
    var wddoObj = function (reqData, options) {
        var defaults = {
                done: function () {},
                complete: function () {}
            },
            opts = $.extend(defaults, options),
            total = reqData.length,
            loaded = 0,
            imgList = [];

        if (reqData.jquery !== undefined) {
            //jquery
            reqData.each(function (i) {
                load(reqData.eq(i));
            });
        } else {
            //string
            var i;
            for(i in reqData) {
                load(reqData[i]);
            }
        }

        function load(elm) {
            var url = (elm.jquery !== undefined) ? elm.attr('src') : elm;

            imgList.push($('<img />')
                .load(function() {
                    loaded += 1;

                    var percent = Math.round(loaded / total * 100);

                    opts.done({source: this, element: $(this).data('element'), percent: percent});
                    
                    if(loaded === total) opts.complete(imgList.map(function (val) {return val.get(0)}));
                }).attr('src', url).data('element', elm)
            );
        }
    };
    return wddoObj;
}());