<template>
    <div class="cartcontrol">
    <transition name="move">
      <div class="cartcontrol-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop="decreaseCart($event)">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
      <div class="cartcontrol-number" v-show="food.count>0">{{ food.count }}</div>
      <div class="cartcontrol-add icon-add_circle" @click.stop="addCart($event)"></div>
    </div>
</template>

<script tpye="text/ecmascript-6">
  import Vue from 'vue';
  import busEvent from '../../common/js/busEvent.js'
  export default {
    name: 'cartcontrol',
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);  /* Vue特性： 当Vue给一个数据源对象添加一个它不存在的对象的时候，要使用vue实例的set全局方法 */
        } else {
          this.food.count++;
        }
        busEvent.$emit('ball-position', event.target);
      },
      decreaseCart (event) {
        if (!event._constructed) {
          return;
        }
        this.food.count--;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
   .cartcontrol
     font-size: 0px
     .cartcontrol-decrease
       display: inline-block
       padding: 6px
       .inner
         display: inline-block
         font-size: 24px
         line-height: 24px
         color: rgb(0,160,220)
       &.move-enter,&.move-leave-to
         opacity: 0
         transform: translate3D(24px,0,0)
       &.move-enter
         .inner
           transform: rotate(0)
       &.move-leave-to
         .inner
           transform: rotate(180deg)
       &.move-enter-to
         opacity: 1
         transform: translate3D(0,0,0)
         .inner
           transform: rotate(180deg)
       &.move-enter-active,&.move-leave-active
         transition: all .5s ease
         .inner
           transition: all .5s ease
     .cartcontrol-number
       display: inline-block
       vertical-align: top
       font-size: 10px
       width: 12px
       line-height: 24px
       padding-top: 6px
       text-align: center
       color: rgb(147,153,157)
     .cartcontrol-add
       display: inline-block
       padding: 6px /* 增加点击范围 */
       font-size: 24px
       line-height: 24px
       color: rgb(0,160,220)
</style>
