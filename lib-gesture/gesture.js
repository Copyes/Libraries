(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define("Gesture", [], factory);
    else if(typeof exports === 'object')
        exports["Gesture"] = factory();
    else
        root["Gesture"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/    // The module cache
/******/    var installedModules = {};
/******/
/******/    // The require function
/******/    function __webpack_require__(moduleId) {
/******/
/******/        // Check if module is in cache
/******/        if(installedModules[moduleId]) {
/******/            return installedModules[moduleId].exports;
/******/        }
/******/        // Create a new module (and put it into the cache)
/******/        var module = installedModules[moduleId] = {
/******/            i: moduleId,
/******/            l: false,
/******/            exports: {}
/******/        };
/******/
/******/        // Execute the module function
/******/        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/        // Flag the module as loaded
/******/        module.l = true;
/******/
/******/        // Return the exports of the module
/******/        return module.exports;
/******/    }
/******/
/******/
/******/    // expose the modules object (__webpack_modules__)
/******/    __webpack_require__.m = modules;
/******/
/******/    // expose the module cache
/******/    __webpack_require__.c = installedModules;
/******/
/******/    // identity function for calling harmony imports with the correct context
/******/    __webpack_require__.i = function(value) { return value; };
/******/
/******/    // define getter function for harmony exports
/******/    __webpack_require__.d = function(exports, name, getter) {
/******/        if(!__webpack_require__.o(exports, name)) {
/******/            Object.defineProperty(exports, name, {
/******/                configurable: false,
/******/                enumerable: true,
/******/                get: getter
/******/            });
/******/        }
/******/    };
/******/
/******/    // getDefaultExport function for compatibility with non-harmony modules
/******/    __webpack_require__.n = function(module) {
/******/        var getter = module && module.__esModule ?
/******/            function getDefault() { return module['default']; } :
/******/            function getModuleExports() { return module; };
/******/        __webpack_require__.d(getter, 'a', getter);
/******/        return getter;
/******/    };
/******/
/******/    // Object.prototype.hasOwnProperty.call
/******/    __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/    // __webpack_public_path__
/******/    __webpack_require__.p = "";
/******/
/******/    // Load entry module and return exports
/******/    return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 主要有
 * tap: 单击
 * longPress： 长按
 * doubleTap: 双击
 * pinch: 缩放
 * rotate: 旋转
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventsManager = function () {
    function EventsManager(el) {
        _classCallCheck(this, EventsManager);

        this.eventHandlers = [];
        this.el = el;
    }

    _createClass(EventsManager, [{
        key: 'add',
        value: function add(handler) {
            this.eventHandlers.push(handler);
        }
    }, {
        key: 'del',
        value: function del(handler) {
            if (!handler) {
                this.eventHandlers = [];
            }
            for (var i = 0; i < this.eventHandlers.length; i++) {
                this.eventHandlers[i] === handler && this.eventHandlers.splice(i, 1);
            }
        }
    }, {
        key: 'dispatch',
        value: function dispatch() {
            for (var i = 0; i < this.eventHandlers.length; i++) {
                var handler = this.eventHandlers[i];
                typeof handler === 'function' && handler.apply(this.el, arguments);
            }
        }
    }]);

    return EventsManager;
}();

// 包装函数，少写点代码而已


var wrapFunc = function wrapFunc(el, handler) {
    var handlerManage = new EventsManager(el);
    handlerManage.add(handler);

    return handlerManage;
};
// 空的函数
var noFunc = function noFunc() {};

var Gesture = function () {
    function Gesture(el, option) {
        _classCallCheck(this, Gesture);

        this.element = typeof el === 'string' ? document.querySelector(el) : el;
        // 触摸开始时间
        this.startTime = null;
        // 初始点的位置
        this.startX = this.startY = null;
        // 结束点的位置
        this.moveX = this.moveY = null;
        // 双击时前一个点
        this.previousTouchPoint = null;
        // 双击时前一个时间点
        this.previousTime = null;
        // 双击的标志
        this.isDoubleTap = false;
        // 轻触
        this.tapTimeout = null;
        this.longPressTimeout = null;
        this.swipeTimeout = null;
        // 缩放的时候两点之间的距离
        this.pinchStartDistance = null;
        // 初始向量
        this.touchStartVector = null;
        // 事件差
        this.delta = null;

        this.touchStart = this.touchStart.bind(this);
        this.touchMove = this.touchMove.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.touchCancel = this.touchCancel.bind(this);

        this.element.addEventListener('touchstart', this.touchStart, false);
        this.element.addEventListener('touchmove', this.touchMove, false);
        this.element.addEventListener('touchend', this.touchEnd, false);
        this.element.addEventListener('touchcancel', this.touchCancel, false);

        this.tap = wrapFunc(this.element, option.tap || noFunc);
        this.doubleTap = wrapFunc(this.element, option.doubleTap || noFunc);
        this.singleTap = wrapFunc(this.element, option.singleTap || noFunc);
        this.longPress = wrapFunc(this.element, option.longPress || noFunc);
        this.pinch = wrapFunc(this.element, option.pinch || noFunc);
        this.rotate = wrapFunc(this.element, option.rotate || noFunc);
        this.swipe = wrapFunc(this.element, option.swipe || noFunc);
    }
    // 获取事件


    _createClass(Gesture, [{
        key: '_getTime',
        value: function _getTime() {
            return new Date().getTime();
        }
        // 获取两点之间的距离 两点间距离公式 （x1, y1） (x2, y2)  => 根号下  (x2 - x1)^2 + (y2 - y1)^2

    }, {
        key: 'getDistance',
        value: function getDistance(xLen, yLen) {
            return Math.sqrt(xLen * xLen + yLen * yLen);
        }
        // 计算旋转方向  根据两个向量的叉积的正负来判断顺时针和逆时针 例如： a(1, 0)  b(1, 1)  a->b  1 x 1 - 0 x 1 > 0

    }, {
        key: 'getRotateDirection',
        value: function getRotateDirection(v1, v2) {
            return v1.x * v2.y - v2.x * v1.y;
        }
        // 获取点积

    }, {
        key: 'getDotValue',
        value: function getDotValue(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
        }
        // 计算在当前方向旋转的角度 向量积的夹角公式 

    }, {
        key: 'getRotateAngle',
        value: function getRotateAngle(v1, v2) {
            var direction = this.getRotateDirection(v1, v2);
            direction = direction > 0 ? -1 : 1;
            var len1 = this.getDistance(v1.x, v1.y);
            var len2 = this.getDistance(v2.x, v2.y);

            var moR = len1 * len2;
            if (moR === 0) {
                return 0;
            }
            var dot = this.getDotValue(v1, v2);
            var r = dot / moR;
            if (r > 1) {
                r = 1;
            }
            if (r < -1) {
                r = -1;
            }
            return Math.acos(r) * direction * 180 / Math.PI;
        }
        // 获取如果是swipe的时候的方向

    }, {
        key: 'getSwipeDirection',
        value: function getSwipeDirection(x1, x2, y1, y2) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'left' : 'right' : y1 - y2 > 0 ? 'up' : 'down';
        }
        // 同一方向移动了但是移动距离小于10

    }, {
        key: 'checkIsTap',
        value: function checkIsTap() {
            if (this.moveX !== null && Math.abs(this.moveX - this.startX) > 30 || this.moveX !== null && Math.abs(this.moveY - this.startY) > 30) {
                return false;
            }
            return true;
        }
        // 检测是不是双击

    }, {
        key: 'checkIsDbTap',
        value: function checkIsDbTap() {
            // 看看是不是已经又一个点了。
            if (Math.abs(this.startX - this.previousTouchPoint.startX) < 30 && Math.abs(this.startY - this.previousTouchPoint.startY) < 30 && this.delta < 300 && this.delta > 0) {
                return true;
            }
            return false;
        }
        // 触摸开始了

    }, {
        key: 'touchStart',
        value: function touchStart(e) {
            var _this = this;

            if (e.touches.length) {
                return;
            }
            this._cancelLongPress();
            this.now = +Date.now();
            // 记录touch开始的位置
            this.startX = e.touches[0].pageX;
            this.startY = e.touches[0].pageY;
            // 指头的个数
            var touchLen = e.touches.length;
            this.delta = this.now - (this.previousTime || this.now);
            //console.log(this.previousTouchPoint);
            if (this.previousTouchPoint) {
                this.isDoubleTap = this.checkIsDbTap();
            }
            this.previousTime = this.now;
            this.previousTouchPoint = {
                startX: this.startX,
                startY: this.startY
            };
            // 多指的操作
            if (touchLen > 1) {
                this._cancelLongPress();
                var point1 = e.touches[0];
                var point2 = e.touches[1];
                var xLen = Math.abs(point1.pageX - point2.pageX);
                var yLen = Math.abs(point2.pageY - point2.pageY);
                this.pinchStartDistance = this.getDistance(xLen, yLen);
                this.touchStartVector = {
                    x: point1.pageX - point2.pageX,
                    y: point2.pageY - point2.pageY
                };
            } else {
                // 开始的时间
                this.startTime = this._getTime();
                this.longPressTimeout = setTimeout(function () {
                    _this.longPress.dispatch();
                }, 750);
            }
        }
        // 触摸移动了

    }, {
        key: 'touchMove',
        value: function touchMove(e) {
            // 记录手指移动的距离
            this.moveX = e.touches[0].pageX;
            this.moveY = e.touches[0].pageY;
            // 在指头移动的时候认为不是双击
            this.isDoubleTap = false;
            this._cancelLongPress();
            var touchesLen = e.touches.length;

            if (touchesLen > 1) {
                var point1 = e.touches[0];
                var point2 = e.touches[1];
                var xLen = Math.abs(point1.pageX - point2.pageX);
                var yLen = Math.abs(point2.pageY - point2.pageY);
                // 缩放后两点的距离
                var pinchEndDistance = this.getDistance(xLen, yLen);
                if (this.pinchStartDistance) {
                    // 缩放比
                    var pinchScale = pinchEndDistance / this.pinchStartDistance;
                    e.pinchScale = pinchScale;
                    this.pinch.dispatch(e);
                }
                // 如果之前有向量了
                if (this.touchStartVector) {
                    var vector = {
                        x: point1.pageX - point2.pageX,
                        y: point2.pageY - point2.pageY
                    };

                    var angle = this.getRotateAngle(vector, this.touchStartVector);
                    this.rotate.dispatch();
                }
            } else {
                // TODO:按住滑动 pressMove
            }
            if (touchesLen > 1) {
                e.preventDefault();
            }
        }
        // 触摸结束了

    }, {
        key: 'touchEnd',
        value: function touchEnd(e) {
            var _this2 = this;

            // 结束的时间
            var timestamp = this._getTime();
            // 取消长按
            this._cancelLongPress();
            // 判断是不是tap, 是swipe
            if (!this.checkIsTap()) {
                e.direction = this.getSwipeDirection(this.startX, this.moveX, this.startY, this.moveY);
                this.swipeTimeout = setTimeout(function () {
                    _this2.swipe.dispatch(e);
                }, 0);
            } else {
                // 轻触
                this.tapTimeout = setTimeout(function () {
                    _this2.tap.dispatch();
                    // 是不是双击
                    if (_this2.isDoubleTap) {
                        _this2.doubleTap.dispatch();
                        //clearTimeout(self.singleTapTimeout);
                        _this2.isDoubleTap = false;
                    }
                }, 0);
                // 单击？？？
                // if(!this.isDoubleTap){
                //     this.singleTapTimeout = setTimeout(() => {
                //         this.singleTap.dispatch();
                //     }, 250);
                // }
            }
            //this.previousTouchPoint = null;
            this.pinchStartDistance = null;
            this.startX = this.moveX = this.startY = this.moveY = null;
        }
        // 取消触摸事件

    }, {
        key: 'touchCancel',
        value: function touchCancel(e) {
            clearTimeout(this.longPressTimeout);
            clearTimeout(this.tapTimeout);
            clearTimeout(this.swipeTimeout);
        }

        // 取消长按

    }, {
        key: '_cancelLongPress',
        value: function _cancelLongPress() {
            clearTimeout(this.longPressTimeout);
        }
        // 取消swipe

    }, {
        key: '_cancelSwipe',
        value: function _cancelSwipe() {
            clearTimeout(this.swipeTimeout);
        }
    }, {
        key: 'destroyedAll',
        value: function destroyedAll() {
            // 清除所有的定时器
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
            }
            if (this.tapTimeout) {
                clearTimeout(this.tapTimeout);
            }
            if (this.swipeTimeout) {
                clearTimeout(this.swipeTimeout);
            }
            // 移除所有的事件监听
            this.element.removeEventListener('touchstart', this.touchStart, false);
            this.element.removeEventListener('touchmove', this.touchMove, false);
            this.element.removeEventListener('touchend', this.touchEnd, false);
            this.element.removeEventListener('touchcancel', this.touchCancel, false);
            // 清空所有的绑定方法
            this.rotate.del();
            this.swipe.del();
            this.tap.del();
            this.pinch.del();
            this.longPress.del();
            this.doubleTap.del();
            // 清空所有的
            this.startTime = null;
            // 初始点的位置
            this.startX = this.startY = null;
            // 结束点的位置
            this.moveX = this.moveY = null;
            // 双击时前一个点
            this.previousTouchPoint = null;
            // 双击时前一个时间点
            this.previousTime = null;
            // 双击的标志
            this.isDoubleTap = false;
            // 轻触
            this.tapTimeout = null;
            this.longPressTimeout = null;
            this.swipeTimeout = null;
            // 缩放的时候两点之间的距离
            this.pinchStartDistance = null;
            // 初始向量
            this.touchStartVector = null;

            return null;
        }
    }]);

    return Gesture;
}();

module.exports = Gesture;

/***/ })
/******/ ]);
});
//# sourceMappingURL=Gesture.js.map