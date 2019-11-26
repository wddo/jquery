/**
 * @author : Jo Yun Ki (naver ID - ddoeng)
 * @version : 1.0
 * @since : 2013.01.23
 */

/********************************************************************************************/
/**************************************** Array Util ****************************************/
/********************************************************************************************/

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj){
        var i = 0;
        for(; i < this.length; i += 1 ){
            if(this[i]== obj){
                return i;
            }
        }
        return -1;
    };
}

if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
	"use strict";
 
		if (this == null)
    	  throw new TypeError();
 
		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0)
			return -1;
 
		var n = len;
		if (arguments.length > 1) {
      		n = Number(arguments[1]);
			if (n != n)
        		n = 0;
			else if (n != 0 && n != (1 / 0) && n != -(1 / 0))
	        	n = (n > 0 || -1) * Math.floor(Math.abs(n));
		}
 
	    var k = n >= 0
	          ? Math.min(n, len - 1)
	          : len - Math.abs(n);
	 
	    for (; k >= 0; k--) {
			if (k in t && t[k] === searchElement)
				return k;
	    }
	    return -1;
  	};
}

var ArrayUtil = {
	/**
	 * 값 잘라내기
	 * @param arr	::: 작업할 배열 
	 * @param index	:::	잘라낼 인덱스
	 * @return 		::: 잘라낸 값
	 */		
	setCut: function(arr, idx) {
		return arr.splice(idx, 1);
	},
	
	/**
	 * 값 삽입하기
	 * @param arr	:::	작업할 배열
	 * @param index	::: 삽입할 위치 인덱스
	 * @param val	::: 삽입할 값
	 * 
	 */	
	setInsert: function(arr, idx, val) {
		arr.splice(idx, 0, val);
	},
	
	/**
	 * 배열 좌로 이동
	 * @param arr	::: 좌로 이동할 배열
	 */	
	setLeftPush: function(arr) {
		arr.push(arr.shift());
	},
	
	/**
	 * 배열 우로 이동
	 * @param arr	::: 우로 이동할 배열
	 */	
	setRightPush: function(arr) {
		arr.unshift(arr.pop());
	}
}

/********************************************************************************************/
/**************************************** String Util ****************************************/
/********************************************************************************************/

var StringUtil = {
	/**
	 * 문자열 전체를 특정 문자를 선택하여 변경
	 * @param str			::: 문자열
	 * @param oldSubStr	::: 변경될 문자
	 * @param newSubStr	::: 변경된 문자
	 * @return 				::: 새로운 문자열
	 * 
	 */
	setReplace: function(str, oldSubStr, newSubStr) {
		return str.split(oldSubStr).join(newSubStr);
	},
	
	/**
	 * 문자열 앞뒤 여백을 제거 할때 유용
	 * @param str		:::	문자열
	 * @param char		::: 변경할 문자
	 * @return 			::: 새로운 문자열
	 */		
	setTrim: function(str, char) {
		return StringUtil.setTrimBack(StringUtil.setTrimFront(str, char), char);
	},
	
	/**
	 * 문자열 앞쪽 여백제거 할때 유용
	 * @param str		:::	문자열
	 * @param char		::: 변경할 문자
	 * @return 			::: 새로운 문자열
	 */	
	setTrimFront: function(str, char) {
		char = StringUtil.getFirstCharacter(char);
		if (str.charAt(0) == char) {
			str = StringUtil.setTrimFront(str.substring(1), char);
		}
		return str;
	},
	
	/**
	 * 문자열 뒤쪽 여백제거 할때 유용
	 * @param str		:::	문자열
	 * @param char		::: 변경할 문자
	 * @return 			::: 새로운 문자열
	 */	
	setTrimBack: function(str, char) {
		char = StringUtil.getFirstCharacter(char);
		if (str.charAt(str.length - 1) == char) {
			str = StringUtil.setTrimBack(str.substring(0, str.length - 1), char);
		}
		return str;
	},
	
	/**
	 * 문자열 앞쪽 한글자씩 반환하는 메소드
	 * @param str	::: 문자열
	 * @return		:::	맨앞문자반환 	
	 */
	getFirstCharacter: function(str) {
		if (str.length == 1) {
			return str;
		}
		return str.slice(0, 1);
	},

	/**
	 * 한글&영문 통합하여 바이트수 크기만큼 글자 자르기
	 * @param str	::: 문자열
	 * @param limit	::: 한계 byte 수
	 * @param dot   ::: ... 유무
	 * @return		::: 가공된 문자열
	 */
	setLimit: function(str, limit, dot) {
		var tmpStr = str,
			byte_count = 0,
			len = str.length,
			dotStr = '',
			isDot = (dot !== undefined && dot === true);

		for(i=0; i<len; i++){
			byte_count += chr_byte(str.charAt(i)); 
			
			if (byte_count === limit-1) { //byte < limit
				if (chr_byte(str.charAt(i+1)) === 2) { //kor
					tmpStr = str.substring(0, i+1);
				}else {
					if (i+2 !== len) dotStr = '...';
					tmpStr = str.substring(0, i+2);
				}
				break;
			} else if (byte_count === limit) { //byte == limit , kor
				if (i+1 !== len) dotStr = '...';
				tmpStr = str.substring(0, i+1);
				break;
			}
		}

		function chr_byte(chr){
			if(escape(chr).length > 4)
				return 2;
			else
				return 1;
		}

		return tmpStr + ((isDot) ? dotStr : '');
	}
}

/********************************************************************************************/
/******************************************* Util *******************************************/
/********************************************************************************************/

/*
 * 오브젝트 출력
 *
 * ex)
 * 	consloe.log( $(obj).print() ); 
 */
jQuery.fn.print = function () {
	var arr = [];
	$.each(this[0], function(key, val) {
		var next = key + ": ";
		next += $.isPlainObject(val) ? $(this).print() : val;
		arr.push( next );
	});
	
	return "{ " +  arr.join(", ") + " }";
};

/**
 * 오브젝트 검색
 * @param obj	::: 검색할 오브젝트
 * @param str	::: 키값
 * @param val	::: 값
 * @return		:::	검색된 오브젝트 반환 	
 */
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

/**
 * URL 중에서 파일명 반환
 * @param str	::: URL 전체문자열
 * @return		::: URL 파일명
 */
function getFileName(str) {
	return str.slice(str.lastIndexOf('/') + 1, str.lastIndexOf('.'));
}

/**
 * 1차함수
 * @param a ::: 값1의 최소값
 * @param b ::: 값1의 최대값
 * @param c ::: 값2의 최소값
 * @param d ::: 값2의 최대값
 * @param x ::: 값1의 현재값
 * @return   ::: 값2의 현재값 
 */
function getLinearFunction(a, b, c, d, x) {
	return (d - c) / (b - a) * (x - a) + c
}
	
/**
 * 비율 유지 크기 반환 함수
 * @param srcWidth 	::: 내용 가로값
 * @param srcHeight ::: 내용 세로값
 * @param maxWidth 	::: 공간 가로값
 * @param maxHeight ::: 공간 세로값
 * @return   		::: {widht: 가로값, height:세로값}
 */
function getAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {width: srcWidth*ratio, height: srcHeight*ratio};
}

/**
 * 종횡비 반환 함수
 * @param width 	::: 가로값
 * @param height 	::: 세로값
 * @return   		::: {widht: 가로비, height:세로비}
 */
function getAspectRatio(width, height) {
	function gcd (a, b) {
	    return (b == 0) ? a : gcd (b, a%b);
	}

    var ratio = gcd(width, height);
    return {width: width / ratio, height: height / ratio}
}

/**
 * 각도 반환 함수 
 * @param x ::: 포인트 x 좌표 
 * @param y ::: 포인트 y 좌표
 * @return  ::: x,y에 대한 각도
 */
function getDegrees(x, y) {
    return ((Math.atan2(y, x) * (180 / Math.PI)) + 450) % 360;
}

/**
 * 랜덤한수
 * @param min	::: 최소값
 * @param max	::: 최대값
 * @return 		::: 최소~최대값 사이의 정수
 * 
 */		
function getRandomNumber(min, max) {
	return Math.round( Math.random() * ( max - min ) + min );
}

/**
 * 순차적인 url 반환
 * 
 * var arr = repeatURL('../img/img0001.png', 168, 0);
 * arr // ["../img/img0000.png", "../img/img0001.png", ~~ "../img/img0167.png"]
 * 
 * @param url   ::: 배열
 * @param max   ::: 총갯수
 * @param min   ::: 시작넘버
 */
function repeatURL(url, max, min) {
    if (typeof url !== 'string') return false;
    var imgURL = url,
        mx = max,
        mn = min || 0,
        arr = [],
        zero = '',
        fileFullName = imgURL.slice(imgURL.lastIndexOf('/') + 1, imgURL.lastIndexOf('.')),
        filePath = imgURL.slice(0, imgURL.lastIndexOf('/') + 1),
        fileExe = imgURL.slice(imgURL.lastIndexOf('.'), imgURL.length),
        fileNameLength = fileFullName.length,
        fileName = fileFullName.slice(0, fileFullName.indexOf('0')),    
        zeroLength = fileNameLength - fileName.length,
        numStr,
        i = 0;

    for(; i < zeroLength; i += 1) {
        zero += '0'; //000..
    }

    while (mx--) {
        numStr = (mx + mn).toString();
        numStr = zero.slice(0, -numStr.length) + numStr;
        
        arr[mx] = filePath + fileName + numStr + fileExe;
    }

    return arr;
}

/**
 * 이미지 on off
 * 
 * toggleURL('../../img/img.jpg', '_on', true);     // ../../img/img_on.jpg
 * toggleURL('../../img/img_on.jpg', '_on', true);  // ../../img/img_on.jpg
 * toggleURL('../../img/img.jpg', '_on', false);    // ../../img/img.jpg
 * toggleURL('../../img/img_on.jpg', '_on', false); // ../../img/img.jpg
 * toggleURL('../../img/img.jpg', '_on');           // ../../img/img_on.jpg
 * toggleURL('../../img/img_on.jpg', '_on');        // ../../img/img.jpg
 * 
 * @param url       ::: 적용할 url
 * @param keyword   ::: 추가할 키워드
 * @param toggle    ::: 추가 유무(생략가능).. url에 키워드가 이미 있다면 true 이어도 중복 적용 되지 않는다.
 */
function toggleURL(url, keyword, toggle) {
    if (typeof url !== 'string') return false;
    var imgURL = url,
        fileFullName = imgURL.slice(imgURL.lastIndexOf('/') + 1, imgURL.lastIndexOf('.')),
        filePath = imgURL.slice(0, imgURL.lastIndexOf('/') + 1),
        fileExe = imgURL.slice(imgURL.lastIndexOf('.'), imgURL.length),
        isKeyword = (fileFullName.indexOf(keyword) < 0),
        isDelete,
        fileName; 
    
    isDelete = (toggle !== undefined) ? toggle : isKeyword;

    if (isDelete) {
        fileName = (isKeyword) ? fileFullName + keyword : fileFullName.slice(0, fileFullName.indexOf(keyword)) + keyword;
    } else {
        fileName = (isKeyword) ? fileFullName : fileFullName.slice(0, fileFullName.indexOf(keyword)); 
    }
    
    return filePath + fileName + fileExe;
}

/**
 * 숫자 1자릿수 앞에 0 붙이기
 */
function force2Digits(value) {
    return (value < 10) ? '0' + value.toString() : value.toString();
}

/**
 * 값이 비어있느냐
 * @param $value	::: 값이 비어있는지 체크할 변수
 */		
function isEmpty(value) {
	var val = String(value);

	//null(객체), NaN(Number), *(undefined), ""
	return (val !== "null" && val !== "NaN" && val !== "undefined" && val !== "") ? false : true;
}