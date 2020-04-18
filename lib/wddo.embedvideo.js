/*!
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.0.2
 * @since : 2016.10.27
 *
 * history
 *
 * 1.0   (2016.10.27) : 
 * 1.0.1 (2018.05.17) : youtube iframe 생성자인 new YT.Player() 생성 적용 
 * 1.0.2 (2020.04.08) : vimeo 정규표현식 변경
 *
 ********************************************************************************************
 ******************************* CrossBrowser Embed Video ***********************************
 ********************************************************************************************
 *
 * var instance = new Embedvideo();
 * instance.init(options);                   //초기화
 *
 * @param options    ::: 설정 Object 값
 *
 * options
 *   target:Object = $('selector')      //비디오를 넣을 대상
 *   url:String = 'http://~'            //영상 url (mp4 or iframe url)
 *   iframeMode:Boolean = false         //강제 iframe 모드
 *   width:Number = 640                 //가로 크기
 *   height:Number = 360                //세로 크기 
 *   totalSecond:Number = 15            //video 태그 미지원 iframe시 영상종료 시간 지정(default:15초)
 *   exLoaded: function (data) {}       //영상 로드 완료 콜백
 *   exEnded: function (data) {}        //영상 재생 완료 콜백
 *
 * method
 *   .setLoad()                         //로드
 *   .setPlay()                         //재생
 *   .setPause()                        //일시정지
 *   .setMute(boolean)                  //음소거
 */
var Embedvideo = (function ($) {
    var wddoObj = function (options) {
        var scope,
            opts,
            data,
            youtubePlayer,
            state,
            defaults = getDefaultOption(),
            timerId,
            isVideoSupport = (document.createElement('video').canPlayType !== undefined),
            init = function (options) {
                opts = $.extend({}, defaults, options);

                if (opts.iframeMode) isVideoSupport = false;

                if (opts.target.length > 0 && opts.target.data('scope') === undefined) {
                    if (opts.target.data('scope') === undefined) opts.target.data('scope', scope);

                    initLayout();
                    initEvent();
                }
            };

        function getDefaultOption() {
            return {
                target: $($.fn),
                url: undefined,
                iframeMode: false,
                width: 640,
                height: 360,
                totalSecond: 15,
                exLoaded: undefined,
                exEnded: undefined
            };
        }
         
        function initLayout() {

        }

        function initEvent() {
            opts.target.on('contextmenu.embedvideo', 'video', function (e) {
                e.preventDefault();
            });
        }

        function create() {
            //console.log('create');
            //
            if (isVideoSupport) {
                opts.target.empty().append('<video class="player"><source src="' + opts.url + '" type="video/mp4"></video>');    
            } else {
                data = getVideoUrlToInfo(opts.url);

                switch (data.kind) {
                    case 'youtube' :
                        if (typeof YT === 'undefined') {
                            addYoutubeAPI();

                            window.onYouTubeIframeAPIReady = function () {
                                createYoutubeIframe();
                            }
                        } else {
                            createYoutubeIframe();
                        }
                        
                        break;
                    case 'vimeo' :
                        break;
                    default :
                }
            }

            opts.target.find('iframe').off('load.embedvideo').on('load.embedvideo', function (e) {
                //console.log('onload');
            });
        }
        
        //video 에서만 사용(iframe 에서는 사용하지 않음)
        function play() {
            if (isVideoSupport) {
                var videoTag = opts.target.find('.player');

                if (videoTag.length > 0) {
                    var v = videoTag[0];
                    v.play();    
                }
            }
        }

        function load() {
            if (isVideoSupport) {
                var videoTag = opts.target.find('.player');
                var v;

                if (videoTag.length === 0) {
                    create();

                    videoTag = opts.target.find('.player');
                    v = videoTag[0];
                } else {
                    //console.log('rewind');
                    v = videoTag[0];
                    v.currentTime = 0;
                    v.load();
                }

                videoTag.on('loadedmetadata.embedvideo', function (e) {
                    //console.log('loadedmetadata');
                    if (opts.exLoaded !== undefined) opts.exLoaded({inst:scope, video: v});
                });

                videoTag.on('timeupdate.embedvideo', function (e) {
                    //console.log('timeupdate');
                    if (v.currentTime >= v.duration) {
                        if (opts.exEnded !== undefined) opts.exEnded({inst:scope, vidoe: v});
                    }
                });
            } else {
                //iframe 생성
                create();
            }
        }
        
        function pause() {
            if (isVideoSupport) {
                var videoTag = opts.target.find('.player');
                var v;

                if (videoTag.length > 0) {
                    //console.log('pause');

                    v = videoTag[0];

                    videoTag.off('timeupdate.embedvideo');
                    videoTag.off('loadedmetadata.embedvideo');

                    if (v !== undefined) v.pause();
                }
            } else {
                opts.target.empty(); //iframe 삭제
            }
        }

        function mute(sw) {
            var videoTag = opts.target.find('.player');
            var v = videoTag[0];

            v.muted = sw;
        }

        //유튜브
        function addYoutubeAPI() {
            var tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        function createYoutubeIframe() {
            opts.target.empty().append('<div id="typlayer"></div>');
            
            opts.target.find('#typlayer').css({
                width : opts.width,
                height : opts.height,
                backgroundColor : '#000'
            });

            youtubePlayer = new YT.Player('typlayer', {
                width: opts.width,
                height: opts.height,
                videoId: data.id,
                playerVars: data.params,
                events: {
                    'onReady': function (e) {
                        if (opts.exEnded !== undefined) opts.exLoaded({inst:scope});
                    },
                    'onStateChange': function (e) {
                        switch (e.data) {
                            case YT.PlayerState.PLAYING :
                                state = 'playing';
                                break;
                            case YT.PlayerState.ENDED :
                                if (opts.exEnded !== undefined && state === 'playing') opts.exEnded({inst:scope});
                                state = 'ended';
                                break;
                            default :
                        }
                    }
                }
            });
        }

        /**
         * 비디오 url을 통한 정보반환 함수
         * @static
         * @param  {String} url 비디오 url
         * @return {Object} id: 비디오id, kind: 비디오제공업체, embedUrl: iframe앞url, params: iframe 옵션 파라미터
         */
        function getVideoUrlToInfo(url) {
            var vurl, kind, embedUrl;

            if (url.match('vimeo') !== null) {
            //비메오
                vurl = url.match(/vimeo.com[\/video|\/]+([0-9]+\?\S+)/i);

                kind = 'vimeo';
                embedUrl = 'https://player.vimeo.com/video/';
            } else if (url.match('youtu') !== null) {
            //유튜브
                var regex = /youtu[A-z]+.\w+\/watch\?.*v=(\w+)/i;

                if (url.match(regex) !== null) {
                    //www.youtube.com/watch?v=In1wr8zAaPA 스타일 대응
                    vurl = url.match(regex);
                } else {
                    //youtu.be/WkdtmT8A2iY or youtube.com/v/WkdtmT8A2iY 대응
                    vurl = url.match(/youtu.*\/(\S+)/i);
                }

                kind = 'youtube';
                embedUrl = 'https://www.youtube.com/embed/';
            } else {}

            //id 와 parameter 분리
            var videoId;
            var paramObj = {}; 
            if (vurl !== undefined && vurl !== null && vurl.length > 1) {
                videoId = vurl[1];

                var arr = videoId.split('?');
                videoId = arr[0];

                if (arr.length > 1) {
                    arr[1].replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
                        paramObj[decodeURIComponent(key)] = decodeURIComponent(value);
                    });
                }
            }

            return {id: videoId, kind: kind, embedUrl: embedUrl, params: paramObj};
        }

        return {
            init: function (options) {
                scope = this;

                init(options);
            },

            setLoad: function () {
                load();
            },

            setPlay: function () {
                play();
            },

            setPause: function () {
                pause();
            },

            setMute: function (sw) {
                mute(sw);
            }
        };
    };

    return wddoObj;
}(jQuery));