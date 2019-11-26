/**
* Swiper 템플릿
*
* @author : Jo Yun Ki (wddoddo@gmail.com)
* @version : 1.2.0
* @since : 2016.11.11
*
* history
*   1.0   (2016.11.11) : -
*   1.1.0 (2016.01.18) : verticalMode() 의 > img 를 img로 변경하여 마크업 제약 완화, initSwiper 명 initGallerySwiper 로 변경
*                        resetSwiper() 의 첫번째 인자를 swiperContainer 가 .swiper-container-horizontal 이면 그 하나의 swiper 에 대한 리셋
*                        initFreeSwiper() 의 opts.slidesPerView 기본값 'auto' 로 변경
*   1.1.1 (2017.05.19) : verticalMode 에서 가로형 이미지도 세로정렬 적용토록 수정하고 opts.vertical 생성하여 필요시에만 적용, verticalMode() 간소화
*                        loop, lazy 조합 시 div.swiper-slide-duplicate 에 .swiper-lazy 대상이 .swiper-lazy-loading 상황일때 복제되어 lazy 재로드 못하는 문제 해결 
*                        watchSlidesVisibility:true 기본으로 추가되도록 수정
*   1.1.2 (2017.08.29) : initFreeSwiper에 change 이벤트 확장, orientationchange 이벤트 적용, data.position 추가 하여 이동 포지션 참조 가능
*   1.1.3 (2017.10.25) : transform = 'none' 값 반환시 matrixToArray 함수 오류 방지 
*   1.1.4 (2017.12.08) : next, prev 버튼 기능 부여할 selector 지정(확장) 필요하여 opts.nextSelector, opts.prevSelector 옵션 추가 
*   1.1.5 (2018.03.12) : verticalMode 제거, applyArea() 생성하여 WPreLoad 통하여 'vertical', 'horizontal' 클래스 처리, opts.vertical 를 opts.areaClass 로 변경
*   1.1.6 (2018.04.23) : swiper 라이브러리 4.x.x 대응
*   1.1.7 (2018.06.18) : opts.autoplayDisableOnInteraction 적용(autoplay 시 사용자 인터렉션 이후 계속 재생되도록 기본값 false 설정) 
*   1.1.8 (2018.09.04) : opts.exLazyImageReady 추가
*   1.1.9 (2018.11.16) : swiperChange 에 wrapper 사용자 클래스 대응
*   1.2.0 (2019.02.11) : freeSwiper 에서 setInterval 무한도는 문제 해결, 상태바 때문에 onTransitionEnd를 exChange에 전달
*
* PUBLIC.method = (function () {return new SwiperTemplate()})(); 
*/
(function (scope) {
    if (scope.SwiperTemplate !== undefined) return;

    if (scope.WPreLoad === undefined) { //add 1.1.5
        //WpreLoad 1.2.0
        scope.WPreLoad=function(e,t){var n,o=$.extend({},{done:function(){},complete:function(){}},t),r=e.length,a=0,c=[];if(void 0!==e.jquery)e.each(function(t){i(e.eq(t))});else for(n in e)i(e[n]);function i(e){var t=void 0!==e.jquery?e.attr("src"):e;c.push($("<img />").load(function(){a+=1;var e=Math.round(a/r*100);o.done({source:this,element:$(this).data("element"),percent:e}),a===r&&o.complete(c.map(function(e){return e.get(0)}))}).attr("src",t).data("element",e))}};    
    }

    var SwiperTemplate = (function ($) {
        var wddoObj = function () {
            var swiper, targetContainer
            var opts = {};
            var isInit = false;

            //스와이프 변경
            function swiperChange(data, event) {
                var container = data.container || data.$el;
                var wrapper = data.wrapper || data.$wrapperEl; //add 1.1.9
                
                var max = container.find('.swiper-pagination > span').length;
                var idx = container.find('.swiper-pagination .swiper-pagination-bullet-active').index();

                container.find('.swiper-pag-num').html('<span>' + (idx+1) + '</span>' + ' / ' + max);

                //복제 slide lazy 재로드 //add 1.1.1
                if (opts.loop && opts.lazyLoading) {
                    container.find('.swiper-slide-visible.swiper-slide-duplicate .swiper-lazy').removeClass('swiper-lazy-loading');
                }

                var trans = wrapper.css('transform');

                if (trans !== undefined && trans !== 'none' && $.isArray(matrixToArray(trans)) && trans.length > 5) {
                    data.position = {x: parseInt(matrixToArray(trans)[4])};
                }

                if (opts.exChange !== undefined) opts.exChange(data, event);
            }

            //중복 방지 초기화
            function checkSwiper() {
                targetContainer.each(function (idx) {
                    if ($(this).is('.swiper-container-horizontal')) {
                        swiper = $(this)[0].swiper;
                        if (swiper !== undefined) swiper.destroy(false, true);    
                    }
                });
            }

            //이미지 비율에 따른 클래스 지정 //add 1.1.5
            function applyArea(slide) {
                var slideDIV = $(slide);
                var img = slideDIV.find('img');

                var preload = new WPreLoad(img, {done: function (data) {
                    var source = data.source;
                    var element = $(source).data('element');
                    var area = element.closest('.' + opts.areaClass);

                    area.removeClass('vertical horizontal');

                    if (source.width < source.height) {
                        area.addClass('vertical');
                    } else if (source.width > source.height) {
                        area.addClass('horizontal');
                    }
                }});
            }

            //ios9 에서 iframe 내부에서 vh 재대로 잡지 못하는 문제 해결
            function viewportFix(data) {
                var container = data.container;
                var vh = ($(window).width() / 9) * 16;

                container.find('.swiper-container .swiper-slide').css('height', vh * 0.32);
                container.find('.swiper-container .swiper-slide img').css('height', vh * 0.32);
            }

            function matrixToArray(str){
                return str.split( '(')[ 1].split( ')')[ 0].split( ',') ;
            }

            //add 1.1.6
            function migrationVer4(options) {
                //migration 3.x.x -> 4.x.x
                options.on = {
                    lazyImageLoad : options.onLazyImageReady,
                    transitionStart : options.onTransitionStart,
                    sliderMove : options.onSliderMove,
                    slideChangeTransitionStart : options.onSlideChangeStart,
                    transitionEnd : options.onTransitionEnd,
                    init : options.onInit
                };

                options.lazy = options.lazyLoading;
                options.loadPrevNext = options.lazyLoadingInPrevNext;
                
                if (options.pagination.length > 0) {
                    options.pagination = {
                        el: '.swiper-pagination'
                    };    
                }

                if (options.autoplay.length > 0) {
                    options.autoplay = {
                        disableOnInteraction: options.autoplayDisableOnInteraction
                    }
                }

                return options
            }

            return {
                initGallerySwiper : function (swiperContainer, options) {
                    var defaults;
                    targetContainer = swiperContainer;

                    checkSwiper(); //중복 방지 초기화

                    if (targetContainer.find('.swiper-slide').length === 1) targetContainer.find('.swiper-pagination').hide();

                    //targetContainer === .swiper-container
                    targetContainer.each(function (idx) {
                        defaults = {
                            viewport : false,
                            areaClass : undefined, //add 1.1.5
                            pagination: $(this).find('.swiper-pagination'),
                            loop: (($(this).find('.swiper-slide').length > 1) ? true : false),
                            preloadImages: false,
                            watchSlidesVisibility: true,
                            lazyLoadingInPrevNext: true,
                            lazyLoading: true,
                            autoplayDisableOnInteraction: false, //add 1.1.7
                            onLazyImageReady: function (_swiper, _slide, _img) {
                                //add 1.1.6
                                var swiper = (_swiper !== undefined) ? _swiper : this;  //4.x.x argument (slideEl, imageEl)
                                var slide = (_swiper !== undefined) ? $(_slide) : $(_swiper);  //4.x.x argument (slideEl, imageEl)
                                var img = (_swiper !== undefined) ? $(_img) : $(_slide);  //4.x.x argument (slideEl, imageEl)

                                if (opts.areaClass && !slide.hasClass('vertical') && !slide.hasClass('horizontal') && slide.find('.' + opts.areaClass).length > 0) applyArea(slide); //modify 1.1.5

                                if (opts.exLazyImageReady !== undefined) opts.exLazyImageReady(swiper, slide, img); //add 1.1.8
                            },
                            onSlideChangeStart: function (_data) {
                                var data = _data || this; //add 1.1.6

                                swiperChange(data, 'onSlideChangeStart');
                            },
                            onSliderMove: function (_data) {
                                var data = (_data.type === undefined) ? _data : _data.target.closest('.swiper-container').swiper; //add 1.1.6

                                swiperChange(data, 'onSliderMove');
                            },
                            onTransitionEnd: function (_data) {
                                var data = _data || this; //add 1.1.6

                                swiperChange(data, 'onTransitionEnd');
                            },
                            onInit: function (_data) {
                                var data = _data !== undefined ? _data : this; //add 1.1.6

                                $(window).on('orientationchange', function () {
                                    setTimeout(function () {swiperChange(data, 'orientationchange')}, 50);
                                });
                                swiperChange(data, 'onInit');

                                //lazy 아닌 이미지 선로드시 //add 1.1.5
                                if (!opts.lazyLoading && opts.preloadImages && opts.areaClass) {
                                    var slide;
                                    $(data.slides).each(function () {
                                        slide = $(this);
                                        if (opts.areaClass && !slide.hasClass('vertical') && !slide.hasClass('horizontal') && slide.find('.' + opts.areaClass).length > 0) applyArea(slide);
                                    })
                                }

                                if (opts.viewport) viewportFix(data);
                            },
                            prevSelector: 'a.big5_prev', //add 1.1.4
                            nextSelector: 'a.big5_next'  //add 1.1.4
                        };

                        opts = $.extend({}, defaults, options);
                        if (Swiper.prototype.init !== undefined) opts = migrationVer4(opts); //add 1.1.6

                        swiper = new Swiper($(this), opts);
                    });

                    targetContainer.find(opts.prevSelector).on('click.swipertemplate', function (e) {
                        var target = $(e.currentTarget);
                        var s = target.closest('.swiper-container')[0].swiper;

                        s.slidePrev();
                        swiperChange(s);

                        e.preventDefault();
                    });

                    targetContainer.find(opts.nextSelector).on('click.swipertemplate', function (e) {
                        var target = $(e.currentTarget);
                        var s = target.closest('.swiper-container')[0].swiper;

                        s.slideNext();
                        swiperChange(s);

                        e.preventDefault();
                    });
                },

                initFreeSwiper : function (swiperContainer, options) {    
                    targetContainer = swiperContainer;

                    checkSwiper(); //중복 방지 초기화
                    
                    var timeId;
                    var timeThreshold = 0; //add 1.2.0
                    var defaults = {
                        areaClass : undefined, //add 1.1.5
                        pagination: targetContainer.find('.swiper-pagination'),
                        slidesPerView: 'auto',
                        spaceBetween: 0,
                        freeMode: true,
                        roundLengths: true,
                        preloadImages: false,
                        watchSlidesVisibility: true,
                        lazyLoadingInPrevNext: true,
                        lazyLoading: true,
                        onLazyImageReady: function (_swiper, _slide, _img) {
                            //add 1.1.6
                            var swiper = (_swiper !== undefined) ? _swiper : this;  //4.x.x argument (slideEl, imageEl)
                            var slide = (_swiper !== undefined) ? $(_slide) : $(_swiper);  //4.x.x argument (slideEl, imageEl)
                            var img = (_swiper !== undefined) ? $(_img) : $(_slide);  //4.x.x argument (slideEl, imageEl)

                            if (opts.areaClass && !slide.hasClass('vertical') && !slide.hasClass('horizontal') && slide.find('.' + opts.areaClass).length > 0) applyArea(slide); //modify 1.1.5

                            if (opts.exLazyImageReady !== undefined) opts.exLazyImageReady(swiper, slide, img); //add 1.1.8
                        },
                        onTouchStart: function (_data) { //add 1.2.0
                            clearTimeout();
                        },
                        onTransitionStart: function (_data) {
                            var data = _data || this; //add 1.1.6

                            clearTimeout();

                            timeId = setInterval(function () {timeThreshold++; if (timeThreshold > 200) clearTimeout(); swiperChange(data, 'onTransitionStart');}, 10);
                        },
                        onSliderMove: function (_data) {
                            var data = (_data.type === undefined) ? _data : _data.target.closest('.swiper-container').swiper; //add 1.1.6

                            swiperChange(data, 'onSliderMove');
                        },
                        onTransitionEnd: function (_data) {
                            var data = _data || this; //add 1.1.6

                            clearTimeout();

                            swiperChange(data, 'onTransitionEnd'); //add 1.2.0
                        },
                        onInit: function (_data) {
                            var data = _data !== undefined ? _data : this; //add 1.1.6

                            $(window).on('orientationchange', function () {
                                setTimeout(function () {swiperChange(data, 'orientationchange')}, 50);
                            });
                            swiperChange(data, 'onInit');

                            //lazy 아닌 이미지 선로드시 //add 1.1.5
                            if (!opts.lazyLoading && opts.preloadImages && opts.areaClass) {
                                var slide;
                                $(data.slides).each(function () {
                                    slide = $(this);
                                    if (opts.areaClass && !slide.hasClass('vertical') && !slide.hasClass('horizontal') && slide.find('.' + opts.areaClass).length > 0) applyArea(slide);
                                })
                            }
                        }
                    };
                    
                    function clearTimeout() { //add 1.2.0
                        if (timeId !== undefined) {
                            clearInterval(timeId);
                            timeId = undefined;
                            timeThreshold = 0;
                        }
                    }

                    targetContainer.each(function (idx) {
                        opts = $.extend({}, defaults, options);
                        if (Swiper.prototype.init !== undefined) opts = migrationVer4(opts); //add 1.1.6

                        swiper = new Swiper($(this), opts);
                    });
                },

                //스와이프 리셋
                resetSwiper : function (swiperContainer) {
                    targetContainer = (swiperContainer.hasClass('swiper-container-horizontal')) ? swiperContainer : swiperContainer.find('.swiper-container-horizontal')

                    targetContainer.each(function () {
                        //swiper 초기화
                        swiper = $(this)[0].swiper;

                        if (swiper !== undefined) {
                            swiper.destroy(false, true);
                            new Swiper(swiper.container, swiper.params);
                        }
                    });
                }
            };
        };
        return wddoObj;
    }(jQuery));

    scope.SwiperTemplate = SwiperTemplate;
})(window);