/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.0.1
 * @since : 2016.10.20
 * 
 * history
 * 
 * 1.0   (2016.10.20) : -
 * 1.0.1 (2017.10.31) : opts.data 추가하여 index 등 데이터 저장 가능
 *
 */

/*!
 * CountDown
 *
 * @param options    ::: 설정 Object 값
 *
 * options
 *   data:Object = {}                             //저장할 데이터 지정
 *   callback:Function = function (data) {}       //초당발생하는 콜백 함수
 *   complete:Function = function () {}           //카운트다운 완료 함수
 *
 * method
 *   .setTime(currentDate, endDate, options);     //카운트 설정(인자로 넘기는 date는 변경되지 않음)
 *   .setStop();                                  //카운트 정지
 */
var CountDown = (function ($) {
    var wddoObj = function (options) {
        var timerId,
            currentDate,
            endDate,
            countDate,
            os,
            cs,
            sec,
            countDown,
            opts,
            defaults = getDefaultOption();

        function initCountDown() {
            countDate.setSeconds(countDate.getSeconds() + 1);
            cs = countDate.getSeconds();

            if (cs === 0) sec += 60;
            cs = cs + sec;
            countDown = cs - os;

            var interval = endDate.getTime() - currentDate.getTime() - (countDown * 1000);

            if (interval < 0) {
                stopCountDown();
                if (opts.complete !== undefined) opts.complete({data: opts.data});

                return;
            } 

            var mescPerSecond = 1000;
            var msecPerMinute = mescPerSecond * 60;          
            var msecPerHour = msecPerMinute * 60; 
            var msecPerDay = msecPerHour * 24;      //milliseconds -> day
            var msecPerMonth = msecPerDay * 30;
            var msecPerYear = msecPerMonth * 12;

            var year = Math.floor(interval / msecPerYear);
            interval = interval - (year * msecPerYear);

            var month = Math.floor(interval / msecPerMonth);
            interval = interval - (month * msecPerMonth);

            var days = Math.floor(interval / msecPerDay);
            interval = interval - (days * msecPerDay);

            var hours = Math.floor(interval / msecPerHour);
            interval = interval - (hours * msecPerHour);

            var minutes = Math.floor(interval / msecPerMinute);
            interval = interval - (minutes * msecPerMinute);

            var seconds = Math.floor(interval / mescPerSecond);

            //add
            var d = force2Digits(days + month * 30 + year * 365);
            var h = force2Digits(hours);
            var m = force2Digits(minutes);
            var s = force2Digits(seconds);

            if (opts.callback !== undefined) opts.callback({d:d, h:h, m:m, s:s, date: countDate, data: opts.data});

            //console.log(year + '/' + month + '/' + days + ' ' + hours + ':' + minutes + ':' + seconds);
        }

        function stopCountDown() {
            if (timerId !== undefined) {
                clearInterval(timerId);
                timerId = undefined;    
            }
        }

        function getDefaultOption() {
            return {
                data : {},
                interval : true,
                callback : undefined,
                complete : undefined
            };
        }

        function force2Digits(value) {
            return (value < 10) ? '0' + value.toString() : value.toString();
        }

        return {
            setTime: function (current, end, options) {
                opts = $.extend({}, defaults, options);  

                currentDate = new Date(current);
                endDate = new Date(end);

                if (currentDate !== undefined && endDate !== undefined && timerId === undefined) {
                    countDown = 0;
                    sec = 0;
                    os = currentDate.getSeconds();
                    countDate = new Date(currentDate);
                    if (opts.interval) timerId = setInterval(initCountDown, 1000);
                    initCountDown();
                }
            },

            setStop: function () {
                stopCountDown();
            }
        };
    };

    return wddoObj;
}(jQuery));
