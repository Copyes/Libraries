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
	}
	// 获取事件
	_getTime(){
		return new Date().getTime();
	}
	// 获取两点之间的距离
	getDistance(point1,point2){

	}
	// 计算旋转方向的
	getRotateDirection(){

	}
	// 计算在当前方向旋转的角度
	getRotateAngle(){

	}
	// 检测是不是单击
	// 同一方向移动了但是移动距离小于10
	checkIsTap(){
		if(this.moveX !== null && Math.abs(this.moveX - this.startX) < 30 ||
			this.moveX !== null && Math.abs(this.moveY - this.startY) < 30 ){
			return true;
		}
		return false;
	}
	// 检测是不是双击
	checkIsDbTap(){	
		// 看看是不是已经又一个点了。
        if(Math.abs(this.startX - this.previousTouchPoint.startX) < 30 &&
            Math.abs(this.startY - this.previousTouchPoint.startY) < 30 && 
            Math.abs(this.startTime - this.previousTime) < 300){
            return true;
            //this.dbTap.dispatch();
        }
        return false;
	}
	// 触摸开始了
	touchStart(e){
		// 记录touch开始的位置
		this.startX = e.touches[0].pageX;
		this.startY = e.touches[0].pageY;
        // 指头的个数
        let touchLen = e.touches.length;

        if(this.previousTouchPoint){
            this.isDoubleTap = this.checkIsDbTap();
        }
        this.previousTime = this.startTime;
		this.previousTouchPoint = {
			startX: this.startX,
			startY: this.startY
		}
		// 多指的操作
		if(touchLen > 1){
            
		}else{	
			// 开始的时间
			this.startTime = this._getTime();
		}
	}
	// 触摸移动了
	touchMove(e){
		// 记录手指移动的距离
		this.moveX = e.touches[0].pageX;
		this.moveY = e.touches[0].pageY;
        // 在指头移动的时候认为不是双击
        this.isDoubleTap = false;
	}
	// 触摸结束了
	touchEnd(e){
		// 结束的时间
		let timestamp = this._getTime();
        // 判断是不是tap,后期还有swipe
		if(this.checkIsTap()){
            this.tapTimeout = setTimeout(() => {
                this.tap.dispatch();
            }, 0);
            // 是不是双击
            if(this.isDoubleTap){
                this.doubleTap.dispatch();
                this.isDoubleTap = false;
            }
		}else{
            //this.tap.dispatch();
			//this.emitEvent('Tap');
		}
	}
    // 取消触摸事件
    touchCancel(){

    }


	// 触发事件
	emitEvent(eventType, e){
		console.log(eventType);
	}

}

module.exports = Gesture;








