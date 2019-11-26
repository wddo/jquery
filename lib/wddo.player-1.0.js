/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.0
 * @since : 2013.01.23
 */

/********************************************************************************************/
/****************************************** Player ******************************************/
/********************************************************************************************/

var WPlayer = (function ($) {
	var wddoObj = function () {
		var video,
			dataCurrent,
			dataTotal,
			buffer;
		
		function init (videoElement) {
			video = videoElement;

			initEvent();
		}
		
		function play() {
			video.play();
		}
		
		function pause() {
			video.pause();
		}

		function stop() {
			pause();
			video.currentTime = 0;
		}
		
		function toggle() {
			if(video.paused) {
				video.play();
			} else {
				video.pause();
			}
		}
		
		function mute() {
			video.muted = !video.muted;
		}
		
		function fullscreen() {
			//For Webkit
			if (video.webkitEnterFullscreen !== undefined) video.webkitEnterFullscreen();
			 
			//For Firefox
			if (video.mozRequestFullScreen !== undefined) video.mozRequestFullScreen();
		}

		function initEvent() {
			video.addEventListener("canplay", function () {
			}, false);
		
			video.addEventListener("timeupdate", function () {
				dataCurrent = update();
			}, false);
			
			video.addEventListener("loadedmetadata", function () {
				dataTotal = loaded();
			}, false);
			
			video.addEventListener("progress", function () {
				startBuffer();
			}, false);
		}
		
		function update() {
			var currentPos = video.currentTime,
				maxduration = video.duration,
				percentage = 100 * currentPos / maxduration;
			
			var current = video.currentTime,
				h = Math.floor((current/60) / 60),
				m = Math.floor((current/60) % 60),
				s = Math.floor(current % 60);
			
			return {percent:percentage, h: force2Digits(h), m: force2Digits(m), s:force2Digits(s)};
		}
		
		function loaded() {
			var duration = video.duration,
				h = Math.floor((duration/60) / 60),
				m = Math.floor((duration/60) % 60),
				s = Math.floor(duration % 60);
			
			return {h: force2Digits(h), m: force2Digits(m), s:force2Digits(s)};
		}
		
		function force2Digits(value) {
			return (value < 10) ? "0" + String(value) : String(value);
		}

		//buffer
		function startBuffer() {
			try {
				var maxduration = video.duration,
					currentBuffer = video.buffered.end(0),
					percentage = 100 * currentBuffer / maxduration;
				
				buffer = percentage;
			} catch(e) {
				
			}
		};

        //public
		this.init = function (videoElement) {
			init(videoElement) ;
		};

		this.setPlay = function () {
			play();
		};

		this.setPause = function () {
			pause();
		};

		this.setStop = function () {
			stop();
		};

		this.setPlayToggle = function () {
			toggle();
		};

		this.setMuteToggle = function () {
			mute();
		};

		this.setFullScreen = function () {
			fullscreen();
		};

		this.getVideo = function () {
			return video
		};

		this.getDataCurrent = function () {
			return dataCurrent;
		};

		this.getDataTotal = function () {
			return dataTotal;
		};

		this.getBuffer = function () {
			return buffer;
		};
    };//end Obj

    return wddoObj;
}(jQuery));