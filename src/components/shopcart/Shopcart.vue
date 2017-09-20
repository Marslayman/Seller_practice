<template>
<div>
	<div class="shopcart">
   	<div class="content-left"  @click="toggleList">
   		<div class="logo-wrapper">
   			<div class="logo" :class="{active: totalCount>0}">
   				<span class="icon-shopping_cart"></span>
   			</div>
   			<div class="count" v-if="totalCount">{{totalCount}}</div>
   		</div>
   		<div class="price" :class="{active: totalCount>0}">￥{{totalPrice}}</div>
   		<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
   	</div>
   	<div class="content-right" :class="{active: totalPrice >= minPrice}">
   		<div class="total" v-if="totalCount === 0">
   			￥{{minPrice}}起送
   		</div>
   		<div class="total" v-if="totalPrice < minPrice && totalPrice !== 0">
   			还差￥{{minPrice - totalPrice}}起送
   		</div>
   		<div class="total" v-if="totalPrice >= minPrice">
   			结算
   		</div>
   	</div>
   	<transition name="fold">
      <div class="cart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="list">
          <ul>
            <li v-for="(food,index) in selectFoods" :key="index" class="list-item">
              <span class="name">{{food.name}}</span>
                <span class="price">￥{{food.price * food.count}}</span>
                <div class="cart-wrapper">
                	<cartcontrol :food="food"></cartcontrol>
                </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
   </div>
   <transition name="fade">
   <div class="list-mask" v-show="listShow" @click="hideList"></div>
   </transition>
   <div class="ball-container">
   	<transition-group name="drop" @before-enter="beforeEnter" @enter="Enter" @after-enter="afterEnter">
   	<div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
   		<div class="inner inner-hook"></div>
   	</div>
   	</transition-group>
   </div>
</div>

</template>

<script tpye="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/Cartcontrol'
  import BScroll from 'better-scroll'
  import busEvent from '../../common/js/busEvent.js'
  export default {
    props: {
     selectFoods: {
        type: Array,
        default () {
          return [{
          	price: 20,
          	count: 1
          }]; /* props成员是object的时候，default 用方法返回值 */
        }
     },
     deliveryPrice: {
       type: Number,
       default: 0
     },
     minPrice: {
       type: Number,
       default: 0
     }
    },
    data () {
      return {
        fold: true,
        balls: [
        {
        	show: false
        },
        {
        	show: false
        },
        {
        	show: false
        },
        {
        	show: false
        },
        {
        	show: false
        }
        ],
        dropBall: []
      }
    },
    components: {
      cartcontrol
    },
    mounted () {
    	busEvent.$on('ball-position', (el) => {
    		for (let i = 0; i < this.balls.length; i++) {
        		let ball = this.balls[i];
        		if (!ball.show) {
        			ball.show = true;
        			ball.el = el;
        			this.dropBall.push(ball);
        			return;
        		}
        	}
    	});
    },
    methods: {
        toggleList () {
        	if (!this.totalCount) {
        		return;
        	}
        	this.fold = !this.fold;
        },
        empty () {
        	this.selectFoods.forEach((food) => {
        		food.count = 0;
        	});
        },
        hideList () {
        	this.fold = true;
        },
        beforeEnter (el) {
        	let count = this.balls.length;
        	while (count--) {
        		let ball = this.balls[count];
        		if (ball.show) {
        			let rect = ball.el.getBoundingClientRect();
        			let x = rect.left - 32;
        			let y = -(window.innerHeight - rect.top - 22);
        			el.style.display = '';
        			el.style.webkitTransform = `translate3d(0,${y}px,0)`;
        			el.style.transform = `translate3d(0,${y}px,0)`;
        			let inner = el.getElementsByClassName('inner-hook')[0];
        			inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
        			inner.style.transform = `translate3d(${x}px,0,0)`;
        			console.log('beforeenter');
        		}
        	}
        },
        Enter (el) {
        	/* eslint-disable no-unused-vars */
        	let rf = el.offsetHeight; /* 强制触发dom的重绘 */
        	this.$nextTick(() => {
        			el.style.webkitTransform = 'translate3d(0,0,0)';
        			el.style.transform = 'translate3d(0,0,0)';
        			let inner = el.getElementsByClassName('inner-hook')[0];
        			inner.style.webkitTransform = 'translate3d(0,0,0)';
        			inner.style.transform = 'translate3d(0,0,0)';
        	});
        	console.log('enter');
        },
        afterEnter (el) {
        	let ball = this.dropBall.shift();
        	if (ball) {
        		ball.show = false;
        		el.style.display = 'none';
        		console.log('clear');
        	}
        }
    },
    computed: {
    	totalPrice () {
    		let total = 0;
    		this.selectFoods.forEach((food) => {
    			total += food.price * food.count;
    		});
    		return total;
    	},
    	totalCount () {
    		let count = 0;
    		this.selectFoods.forEach((food) => {
    			count += food.count;
    		});
    		return count;
    	},
    	listShow () {
    		if (!this.totalCount) {
    			this.fold = true;
    			return false;
    		}
    		var show = !this.fold;
    		if (show) {
    			this.$nextTick(() => {
    				if (!this.scroll) {
    					this.scroll = new BScroll(this.$refs.list, {
    				click: true
    			});
    				} else {
    					this.scroll.refresh();
    				}
    		});
    		}
    		return show;
    	}
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl';
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    display: flex
    width: 100%
    height: 48px
    background-color: #141d27
    font-size: 0px
    z-index:500
    .content-left
      flex: 1
      background-color: #141d27
      .logo-wrapper
        position: relative
        display: inline-block
        margin-top: -10px
        width: 56px
        height: 56px
        border-radius: 50%
        padding: 6px
        box-sizing: border-box
        background-color: #141d27
        margin-left: 12px
        margin-right: 12px
        .logo
          width: 100%
          height: 100%
          border-radius: 50%
          background-color: #2b343c
          text-align: center
          color: #80858a
          &.active
            color: white
            background-color: #00a0dc
          .icon-shopping_cart
            line-height: 44px
            font-size: 24px
            font-weight: 700
      .price
        display: inline-block
        margin: 12px 0
        padding-right: 12px
        border-right: 1px solid rgba(255,255,255,.1)
        font-size: 16px
        line-height: 24px
        color: #919396
        font-weight: 700
        &.active
          color: white
      .desc
        display: inline-block
        margin: 0 12px
        font-size: 16px
        line-height: 24px
        color: #919396
      .count
        position: absolute
        right: 0
        top: 0
        width: 24px
        height: 16px
        padding: 0 6px
        box-sizing: border-box
        border-radius: 16px
        font-size: 9px
        font-weight: 700
        color: white
        line-height: 16px
        text-align: center
        background-color: rgb(240,20,20)
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,.4)
    .content-right
      flex: 0 0 105px
      width: 105px
      box-sizing: border-box
      padding: 12px 8px
      background-color: #2b333b
      color: #979a9c
      &.active
        color: white
        background-color: #00b43c
      .total
        text-align: center
        font-size: 12px
        line-height: 24px
        font-weight: 700
    .cart-list
      position: absolute
      top: 0px
      left: 0px
      width: 100%
      z-index: -1
      transform: translate3D(0,-100%,0)
      &.fold-enter
        transform: translate3D(0,0,0)
      &.fold-enter-active,&.fold-leave-active
        transition: all 0.5s
      &.fold-enter-to
        transform: translate3D(0,-100%,0)
      &.fold-leave-to
        transform: translate3D(0,0,0)
      .list-header
        width: 100%
        height: 40px
        line-height: 40px
        padding: 0 18px
        box-sizing: border-box
        background-color: #f3f5f7
        border-bottom: 2px solid rgba(7,17,27,.1)
        .title
          font-size: 14px
          float: left
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,220)
      .list-content
        max-height: 217px
        background-color: white
        padding: 0 18px
        overflow: hidden
        .list-item
          padding: 12px 0
          height: 24px
          line-height: 24px
          border-1px(rgba(7,17,27,.1))
          .name
            float: left
            font-size: 14px
            color: rgb(7,17,27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            font-size: 14px
            font-weight: 700
            color: rgb(240,20,20)
            margin: 0 12px 0 18px
            line-height: 24px
          .cart-wrapper
            position: absolute
            top: 6px
            right: 0
  .list-mask
    position: fixed
    top: 0
    left: 0
    background-color: rgba(7,17,27,.5)
    backdrop-filter: blur(10px)
    width: 100%
    height: 100%
    z-index: 40
    &.fade-enter
      opacity: 0
      background-color: rgba(7,17,27,0)
    &.fade-enter-active,&.fade-leave-active
      transition: all .5s linear
    &.fade-leave-to
      opacity: 0
      background-color: rgba(7,17,27,0)
  .ball-container
    .ball
      position: fixed
      left: 32px
      bottom: 22px
      z-index: 200
      .inner
        width: 16px
        height: 16px
        border-radius: 50%
        background-color: rgb(0,160,220)
      &.drop-enter-active
        transition: all .5s cubic-bezier(.64,-0.32,.71,.77)
        .inner
          transition: all .5s linear
</style>
