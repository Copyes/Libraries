(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("swiper", [], factory);
	else if(typeof exports === 'object')
		exports["swiper"] = factory();
	else
		root["swiper"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rem = function rem(px) {
	return px / 40 + "rem";
};

var transition = "-webkit-transition: -webkit-transform .3s ease";

var css = ["z-index: 3; -webkit-transform: translate3d(0, 0, 10px) scale3d(1, 1, 1); visibility: visible;", "z-index: 2; -webkit-transform: translate3d(" + rem(-148) + ", 0, 6px) scale3d(.8, .8, 1); visibility: visible;", "z-index: 2; -webkit-transform: translate3d(" + rem(148) + ", 0, 6px) scale3d(.8, .8, 1); visibility: visible;", "z-index: 1; -webkit-transform: translate3d(" + rem(-240) + ", 0, 2px) scale3d(.667, .667, 1); visibility: visible;", "z-index: 1; -webkit-transform: translate3d(" + rem(240) + ", 0, 2px) scale3d(.667, .667, 1); visibility: visible;"];

var Swiper = function () {
	function Swiper(selector) {
		_classCallCheck(this, Swiper);

		this.x0 = 0;
		this.y0 = 0;
		this.hasMoved = 0;
		this.lock = 0;
		this.list = document.querySelector(selector);
		this.list ? this.init(this.list) : console.log(selector + " is not defined");
		this.queue = [];
		this.container = '';
	}

	_createClass(Swiper, [{
		key: "init",
		value: function init(list) {
			this.container = list;
			list.style['-webkit-transform-style'] = 'preserve-3d';

			var items = list.querySelectorAll('li');
			for (var i = 0; i < items.length; ++i) {
				items[i].style.visibility = 'hidden';
			}

			this.queue = function (len) {
				var arr = [];

				return arr;
			}(items.length);
		}
	}, {
		key: "touchStartHandle",
		value: function touchStartHandle(e) {
			var touch = e.targetTouches[0],
			    x = touch.pageX,
			    y = touch.pageY;

			this.x0 = x;
			this.y0 = y;
		}
	}, {
		key: "touchMoveHandle",
		value: function touchMoveHandle(e) {
			if (this.lock) return;

			var touch = e.targetTouches[0],
			    x = touch.pageX,
			    y = touch.pageY,
			    offsetX = this.x0 - x,
			    offsetY = this.y0 - y;

			this.hasMoved || (this.hasMoved = 1, Math.abs(offsetX) > Math.abs(offsetY) && e.preventDefault());

			if (offsetX <= -50) {
				console.log('向右');
			} else if (offsetX >= 50) {
				console.log('向左');
			}
		}
	}]);

	return Swiper;
}();

/***/ })
/******/ ]);
});
//# sourceMappingURL=swiper.js.map