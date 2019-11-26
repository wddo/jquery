/**
* Swiper 템플릿
*
* @author : Jo Yun Ki (wddoddo@gmail.com)
* @version : 1.1.1
* @since : 2016.11.11
*
* history
*   1.0   (2016.11.11) : -
*   1.1.0 (2016.01.18) : verticalMode() 의 > img 를 img로 변경하여 마크업 제약 완화, initSwiper 명 initGallerySwiper 로 변경
*   				     resetSwiper() 의 첫번째 인자를 swiperContainer 가 .swiper-container-horizontal 이면 그 하나의 swiper 에 대한 리셋
*   				     initFreeSwiper() 의 opts.slidesPerView 기본값 'auto' 로 변경
*   1.1.1 (2017.05.19) : verticalMode 에서 가로형 이미지도 모두 적용토록 수정하고 opts.vertical 생성하여 필요시에만 적용, verticalMode() 간소화
*   					 loop, lazy 조합 시 div.swiper-slide-duplicate 에 .swiper-lazy 대상이 .swiper-lazy-loading 상황일때 복제되어 lazy 재로드 못하는 문제 해결 
*   					 watchSlidesVisibility:true 기본으로 추가되도록 수정
*
*
* PUBLIC.method = (function () {return new SwiperTemplate()})(); 
*/
(function (scope) {
    if (scope.SwiperTemplate !== undefined) return;

    var SwiperTemplate = (function ($) {
	    var wddoObj = function () {
			var swiper, targetContainer
			var opts = {};
			var isInit = false;

		    //스와이프 변경
		    function swiperChange(data, event) {
		        var container = data.container;
		        var max = container.find('.swiper-pagination > span').length;
		        var idx = container.find('.swiper-pagination .swiper-pagination-bullet-active').index();

		        container.find('.swiper-pag-num').html('<span>' + (idx+1) + '</span>' + ' / ' + max);

		        //복제 slide lazy 재로드 //add 1.1.1
	        	if (opts.loop && opts.lazyLoading) {
	        		container.find('.swiper-slide-visible.swiper-slide-duplicate .swiper-lazy').removeClass('swiper-lazy-loading');
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

		    //세로 모드 지원
		    function verticalMode(slide, img) {
	            var slideDIV = $(slide);
	            var img = slideDIV.find('img');
	            img.css('marginTop', (img.parent().height() - img.height()) * .5);
		    }

		    //ios9 에서 iframe 내부에서 vh 재대로 잡지 못하는 문제 해결
		    function viewportFix(data) {
		        var container = data.container;
		        var vh = ($(window).width() / 9) * 16;

		        container.find('.swiper-container .swiper-slide').css('height', vh * 0.32);
		        container.find('.swiper-container .swiper-slide img').css('height', vh * 0.32);
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
				    		vertical : false,
				            pagination: $(this).find('.swiper-pagination'),
				            loop: (($(this).find('.swiper-slide').length > 1) ? true : false),
				            preloadImages: false,
				            watchSlidesVisibility: true,
				            lazyLoadingInPrevNext: true,
				            lazyLoading: true,
				            onLazyImageReady: function (swiper, slide, img) {
				                if (opts.vertical) verticalMode(slide, img);
				            },
				            onSlideChangeStart: function (data) {
				                swiperChange(data, 'onSlideChangeStart');
				            },
				            onSliderMove: function (data) {
				                swiperChange(data, 'onSliderMove');
				            },
				            onTransitionEnd: function (data) {
				                swiperChange(data, 'onTransitionEnd');
				            },
				            onInit: function (data) {
				                swiperChange(data, 'onInit');

				                if (opts.viewport) viewportFix(data);
				            }
				        };

			            opts = $.extend({}, defaults, options);
			            swiper = new Swiper($(this), opts);
			        });

			        targetContainer.find('a.big5_prev').on('click.city', function (e) {
			            var target = $(e.currentTarget);
			            var s = target.closest('.swiper-container')[0].swiper;

			            s.slidePrev();
			            swiperChange(s);

			            e.preventDefault();
			        });

			        targetContainer.find('a.big5_next').on('click.city', function (e) {
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
			        
			        var defaults = {
			            pagination: targetContainer.find('.swiper-pagination'),
			            slidesPerView: 'auto',
			            spaceBetween: 0,
			            freeMode: true,
			            roundLengths: true
			        };
			        
			        targetContainer.each(function (idx) {
			            opts = $.extend({}, defaults, options);
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