/**
 * @author : Jo Yun Ki (wddoddo@gmail.com)
 * @version : 1.1
 * @since : 2013.01.23
 * 
 * history
 * 
 * 1.0 (2013.01.23) : 
 * 1.1 (2019.05.14) : setVolume(), initDrag() 추가
 */

/********************************************************************************************/
/****************************************** Player ******************************************/
/********************************************************************************************/

var WPlayer = (function ($) {
	var wddoObj = function () {
		var video,
			dataCurrent,
			dataTotal,
			buffer,
			statusCallback,
			dragElement,
			dragCallbackArr = [];
		
		function init(videoElement, statusFunction) {
			video = videoElement;
			statusCallback = statusFunction;
			
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

		function changeVolume(value) {
			video.volume = value;
		}
		
		function fullscreen() {
			//For Webkit
			if (video.webkitEnterFullscreen !== undefined) video.webkitEnterFullscreen();
			 
			//For Firefox
			if (video.mozRequestFullScreen !== undefined) video.mozRequestFullScreen();
		}

		function initDrag(el, callback, direct) {
			setDataset(el, 'direct', (direct === undefined) ? 'x' : direct);
			setDataset(el, 'isDrag', false);

			dragCallbackArr.push(callback);
			setDataset(el, 'idx', dragCallbackArr.length - 1);
			el.addEventListener('mousedown', function (e) {
				dragElement = e.currentTarget;
				setDataset(dragElement, 'isDrag', true);

				document.addEventListener('mousemove', mousemoveHandler);
				document.addEventListener('mouseup', mouseupHandler);

				e.preventDefault();
			});
		}

		function mousemoveHandler(e) {
			if (dragElement !== undefined && getDataset(dragElement, 'isDrag')) {
				var bg = dragElement.parentNode,
					x = (e.offsetX === undefined) ? e.layerX - bg.offsetLeft : e.offsetX,
					y = (e.offsetY === undefined) ? e.layerY - bg.offsetTop : e.offsetY,
					globalX = Math.round(offset(bg).left),
					globalY = Math.round(offset(bg).top),
					range = (getDataset(dragElement, 'direct') === 'x') ? bg.clientWidth - dragElement.offsetWidth : bg.clientHeight - dragElement.offsetHeight,
					pos = (getDataset(dragElement, 'direct') === 'x') ? e.clientX - globalX : e.clientY - globalY;

				var idx = getDataset(dragElement, 'idx');
				if (dragCallbackArr.length > idx && dragCallbackArr[idx] !== undefined)  dragCallbackArr[idx](Math.min(range, Math.max(0, pos)), range);
			}
		}

		function mouseupHandler(e) {
			if (dragElement !== undefined) {
				setDataset(dragElement, 'isDrag', false);
				dragElement = undefined;

				document.removeEventListener('mousemove', mousemoveHandler);
				document.removeEventListener('mouseup', mouseupHandler);
			}
		}

		function getDataset(el, key) {
			return el.dataset ? el.dataset[key] : el.getAttribute('data-' + key);
		}

		function setDataset(el, key, val) {
			el.dataset ? el.dataset[key] = val : el.setAttribute('data-' + key, val);
		}

		function offset(el) {
		    var rect = el.getBoundingClientRect(),
		    	scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		    	scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		    return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
		}

		function initEvent() {
			video.addEventListener("canplay", function (e) {
				if (statusCallback !== undefined) statusCallback(e);
			}, false);
		
			video.addEventListener("timeupdate", function (e) {
				dataCurrent = update();
				if (statusCallback !== undefined) statusCallback(e);
			}, false);
			
			video.addEventListener("loadedmetadata", function (e) {
				dataTotal = loaded();
				if (statusCallback !== undefined) statusCallback(e);
			}, false);
			
			video.addEventListener("progress", function (e) {
				startBuffer();
				if (statusCallback !== undefined) statusCallback(e);
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
        return {
        	init : init,
        	setPlay : play,
        	setPause : pause,
        	setStop : stop,
        	setPlayToggle : toggle,
        	setVolume : changeVolume,
        	setMuteToggle : mute,
        	setDrag : initDrag,
        	setFullScreen : fullscreen,
        	getVideo : function () {
				return video
			},
			getDataCurrent : function () {
				return dataCurrent;
			},
			getDataTotal : function () {
				return dataTotal;
			},
			getBuffer : function () {
				return buffer;
			}
        }
    };//end Obj

    return wddoObj;
}(jQuery));