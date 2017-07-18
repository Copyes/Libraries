"use strict"

/**
 * 
 */

const rem = function(px) {
	return px / 40 + "rem"; 
};

let transition = "-webkit-transition: -webkit-transform .3s ease";

let	css = [
	"z-index: 3; -webkit-transform: translate3d(0, 0, 10px) scale3d(1, 1, 1); visibility: visible;", 
	"z-index: 2; -webkit-transform: translate3d(" + rem(-148) + ", 0, 6px) scale3d(.8, .8, 1); visibility: visible;", 
	"z-index: 2; -webkit-transform: translate3d(" + rem(148) + ", 0, 6px) scale3d(.8, .8, 1); visibility: visible;", 
	"z-index: 1; -webkit-transform: translate3d(" + rem(-240) + ", 0, 2px) scale3d(.667, .667, 1); visibility: visible;", 
	"z-index: 1; -webkit-transform: translate3d(" + rem(240) + ", 0, 2px) scale3d(.667, .667, 1); visibility: visible;"
]; 

class Swiper {

	

	constructor(selector){
		this.x0 = 0;
		this.y0 = 0;
		this.hasMoved = 0;
		this.lock = 0;
		this.list = document.querySelector(selector);
		this.list ? this.init(this.list) : console.log(`${selector} is not defined`);
		this.queue = [];
		this.container = '';
	}
	
	init(list){
		this.container = list;
		list.style['-webkit-transform-style'] = 'preserve-3d';

		let items = list.querySelectorAll('li');
		for(let i = 0; i < items.length; ++i){
			items[i].style.visibility = 'hidden';
		}

		this.queue = function(len){
			let arr = [];

			
			return arr;
		}(items.length)

	}

	touchStartHandle(e){
		let touch = e.targetTouches[0],
			x = touch.pageX,
			y = touch.pageY;

		this.x0 = x;
		this.y0 = y;
	}

	touchMoveHandle(e){
		if(this.lock) return ;

		let touch = e.targetTouches[0],
			x = touch.pageX,
			y = touch.pageY,

			offsetX = this.x0 - x,
			offsetY = this.y0 - y;

		this.hasMoved || (this.hasMoved = 1, Math.abs(offsetX) > Math.abs(offsetY) && e.preventDefault());

		if(offsetX <= -50){
			console.log('向右');


		}else if( offsetX >= 50){
			console.log('向左');
		}
	}
}