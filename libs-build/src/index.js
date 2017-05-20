"use strict"
/**
 * 主要有
 * tap: 单击
 * longPress： 长按
 * doubleTap: 双击
 * pinch: 缩放
 * rotate: 旋转
 */
class EventsManager {

    constructor(el){
        this.eventHandlers = [];
        this.el = el;
    }
    add(handler){
        this.eventHandlers.push(handler);
    }
    del(handler){
        if(!handler){
            this.eventHandlers = [];
        }
        for(let i = 0; i < this.eventHandlers.length; i++){
            this.eventHandlers[i] === handler && this.eventHandlers.splice(i, 1);
        }
    }
    dispatch(){
        for(let i = 0; i < this.eventHandlers.length; i++){
            let handler = this.eventHandlers[i];
            typeof handler === 'function' && handler.apply(this.el, arguments);
        }
    }
}

// 包装函数，少写点代码而已
const wrapFunc = (el, handler) => {
    const handlerManage = new EventsManager(el);
    handlerManage.add(handler);

    return handlerManage;
}
// 空的函数
const noFunc = () => {};

class Gesture {

	constructor(el, option){
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
	_getTime(){
		return new Date().getTime();
	}
	// 获取两点之间的距离 两点间距离公式 （x1, y1） (x2, y2)  => 根号下  (x2 - x1)^2 + (y2 - y1)^2
	getDistance(xLen, yLen){
        return Math.sqrt(xLen * xLen + yLen * yLen);
	}
	// 计算旋转方向  根据两个向量的叉积的正负来判断顺时针和逆时针 例如： a(1, 0)  b(1, 1)  a->b  1 x 1 - 0 x 1 > 0
	getRotateDirection(v1, v2){
        return v1.x * v2.y - v2.x * v1.y;
	}  
    // 获取点积
    getDotValue(v1, v2){
        return v1.x * v2.x + v1.y * v2.y;
    } 
	// 计算在当前方向旋转的角度 向量积的夹角公式 
	getRotateAngle(v1, v2){
        let direction = this.getRotateDirection(v1, v2);
        direction = direction > 0 ? -1 : 1;
        let len1 = this.getDistance(v1.x, v1.y);
        let len2 = this.getDistance(v2.x, v2.y);

        let moR = len1 * len2;
        if(moR === 0){
            return 0;
        }
        let dot = this.getDotValue(v1, v2);
        let r = dot / moR;
        if(r > 1){
            r = 1;
        }
        if(r < -1){
            r = -1;
        }
        return Math.acos(r) * direction * 180 / Math.PI;
	}
    // 获取如果是swipe的时候的方向
    getSwipeDirection(x1, x2, y1, y2){
        return Math.abs(x1 - x2) >= Math.abs(y1 -y2) ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down');
    }
	// 同一方向移动了但是移动距离小于10
	checkIsTap(){
		if(this.moveX !== null && Math.abs(this.moveX - this.startX) > 30 ||
			this.moveX !== null && Math.abs(this.moveY - this.startY) > 30 ){
			return false;
		}
		return true;
	}
	// 检测是不是双击
	checkIsDbTap(){	
		// 看看是不是已经又一个点了。
        if(Math.abs(this.startX - this.previousTouchPoint.startX) < 30 &&
            Math.abs(this.startY - this.previousTouchPoint.startY) < 30 && 
            this.delta < 300 && this.delta > 0){
            return true;
        }
        return false;
	}
	// 触摸开始了
	touchStart(e){
        if(e.touches.length){
            return;
        }
        this._cancelLongPress();
        this.now = +(Date.now());
		// 记录touch开始的位置
		this.startX = e.touches[0].pageX;
		this.startY = e.touches[0].pageY;
        // 指头的个数
        let touchLen = e.touches.length;
        this.delta = this.now - (this.previousTime || this.now);
        //console.log(this.previousTouchPoint);
        if(this.previousTouchPoint){
            this.isDoubleTap = this.checkIsDbTap();
        }
        this.previousTime = this.now;
		this.previousTouchPoint = {
			startX: this.startX,
			startY: this.startY
		}
		// 多指的操作
		if(touchLen > 1){
            this._cancelLongPress();
            let point1 = e.touches[0];
            let point2 = e.touches[1];
            let xLen = Math.abs(point1.pageX - point2.pageX);
            let yLen = Math.abs(point2.pageY - point2.pageY);
            this.pinchStartDistance = this.getDistance(xLen, yLen);
            this.touchStartVector = {
                x: point1.pageX - point2.pageX,
                y: point2.pageY - point2.pageY
            }
		}else{	
			// 开始的时间
			this.startTime = this._getTime();
            this.longPressTimeout = setTimeout(() => {
                this.longPress.dispatch();
            }, 750);
		}
	}
	// 触摸移动了
	touchMove(e){
		// 记录手指移动的距离
		this.moveX = e.touches[0].pageX;
		this.moveY = e.touches[0].pageY;
        // 在指头移动的时候认为不是双击
        this.isDoubleTap = false;
        this._cancelLongPress();
        let touchesLen = e.touches.length;
        
        if(touchesLen > 1){
            let point1 = e.touches[0];
            let point2 = e.touches[1];
            let xLen = Math.abs(point1.pageX - point2.pageX);
            let yLen = Math.abs(point2.pageY - point2.pageY);
            // 缩放后两点的距离
            let pinchEndDistance = this.getDistance(xLen, yLen);
            if(this.pinchStartDistance){
                // 缩放比
                let pinchScale = pinchEndDistance / this.pinchStartDistance;
                e.pinchScale = pinchScale;
                this.pinch.dispatch(e);
            }
            // 如果之前有向量了
            if(this.touchStartVector){
                let vector = {
                    x: point1.pageX - point2.pageX,
                    y: point2.pageY - point2.pageY
                }

                let angle = this.getRotateAngle(vector, this.touchStartVector);
                this.rotate.dispatch();
            }
        }else{
            // TODO:按住滑动 pressMove
        }
         if (touchesLen > 1) {
            e.preventDefault();
        }
	}
	// 触摸结束了
	touchEnd(e){
		// 结束的时间
		let timestamp = this._getTime();
        // 取消长按
        this._cancelLongPress();
        // 判断是不是tap, 是swipe
		if(!this.checkIsTap()){
            e.direction = this.getSwipeDirection(this.startX, this.moveX, this.startY, this.moveY);
            this.swipeTimeout = setTimeout(() => {
                this.swipe.dispatch(e);
            }, 0);

		}else{
            // 轻触
            this.tapTimeout = setTimeout(() => {
                this.tap.dispatch();
                // 是不是双击
                if(this.isDoubleTap){
                    this.doubleTap.dispatch();
                    //clearTimeout(self.singleTapTimeout);
                    this.isDoubleTap = false;
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
    touchCancel(e){
        clearTimeout(this.longPressTimeout);
        clearTimeout(this.tapTimeout);
        clearTimeout(this.swipeTimeout);
    }

    // 取消长按
    _cancelLongPress(){
        clearTimeout(this.longPressTimeout);
    }
    // 取消swipe
    _cancelSwipe(){
        clearTimeout(this.swipeTimeout);
    }
    destroyedAll(){
        // 清除所有的定时器
        if(this.longPressTimeout){
            clearTimeout(this.longPressTimeout);
        }
        if(this.tapTimeout){
            clearTimeout(this.tapTimeout);
        }
        if(this.swipeTimeout){
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
}

module.exports = Gesture;