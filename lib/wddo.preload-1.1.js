/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.1
 * @since : 2014.03.26
 */

/**
 * preload
 *
 * var instance = new WPreLoad(arr, options);
 *
 * @param obj       ::: 적용할 배열
 * @param options   ::: 오브젝트 형태의 callback 을 받을 수 있는 함수 집합
 *
 * options object
 *  init                - 로딩시작
 *  progress(percent)   - 로딩중
 *  complete(arr)       - 로딩완료
 */

var WPreLoad = (function() {
  var wddoObj = function(arr, options) {
    var defaults = {
        init: function() {},
        progress: function(value) {},
        complete: function(value) {}
      },
      opts = $.extend(defaults, options),
      total = arr.length,
      loaded = 0,
      imgList = [];

    opts.init();

    var i;
    for (i in arr) {
      var data = arr[i];
      if (arr.jquery !== undefined && arr.eq(i).is("a"))
        data = arr.eq(0).attr("src");

      imgList.push(
        $("<img />")
          .load(function() {
            loaded += 1;

            opts.progress(Math.round((loaded / total) * 100));

            if (loaded === total) {
              opts.complete(arr);
            }
          })
          .attr("src", data)
      );
    } //end for in
  };

  return wddoObj;
})();
