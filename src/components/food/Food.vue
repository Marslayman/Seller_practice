<template>
  <transition name="fade">
    <div class="food" v-show="showFlag" ref="foodinfo">
      <div class="content">
        <div class="header-info">
          <img :src="food.image" />
          <div class="icon" @click="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="desc border-1px">
          <h1 class="desc-name">{{food.name}}</h1>
          <div class="desc-info">
            <span class="count">月售{{food.sellCount}}份</span><span class="rate">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="current-price">￥{{food.price}}</span><span class="old-price" v-if="food.oldPrice>0">￥{{food.oldPrice}}</span>
          </div>
          <div class="cart-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <div class="buy" v-show="!food.count || food.count === 0" @click="add($event)">加入购物车</div>
        </div>
        <div class="food-content">
          <h1 class="content-title">商品介绍</h1>
          <div class="content">
            {{foodDesc}}
          </div>
        </div>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <selectrating :types="types" :ratings="food.ratings" @setType="setType" @setContent="setContent"></selectrating>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li class="rateItem border-1px" v-for="(rating,index) in food.ratings" v-show="contentFilter(rating.rateType,rating.text)">
              <div class="rating-info">
                <span class="rating-time">{{rating.rateTime | formattime}}</span>
                <div class="user-info">
                  <span class="username">{{rating.username}}</span><img class="avatar" :src="rating.avatar" width="12px" height="12px"></img>
                </div>
              </div>
              <div class="rating-content">
                <span class="icon-thumb_up" v-show="rating.rateType == 0"></span><span v-show="rating.rateType == 1" class="icon-thumb_down"></span><span class="content">{{rating.text}}</span>
              </div>
            </li>
          </ul>
          <div class="empty" v-show="!food.ratings || !food.ratings.length">没有任何评价信息！</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script tpye="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import cartcontrol from '../cartcontrol/Cartcontrol';
  import selectrating from '../selectRating/SelectRating.vue';
  const ALL = 2;
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFlag: false,
        types: {
          all: '全部',
          agree: '推荐',
          disagree: '吐槽'
        },
        selectType: ALL,
        onlyContent: false
      }
    },
    components: {
      cartcontrol,
      selectrating
    },
    methods: {
      showFood () {
        this.showFlag = true;
        this.$nextTick(() => {
           if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodinfo, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      back () {
        this.showFlag = false;
      },
      add (event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
      },
      setType (input) {
        this.selectType = input;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      setContent (input) {
        this.onlyContent = input;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      contentFilter (type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType
        }
      }
    },
    computed: {
      foodDesc () {
        if (!this.food.info || this.food.info.length === 0) {
          return '该商品无介绍信息！'
        }
        return this.food.info;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../common/stylus/mixin.styl';
    .food
      position: fixed
      top: 0
      left: 0
      bottom: 48px
      width: 100%
      z-index: 30
      background-color: #f3f5f7
      overflow: hidden
      &.fade-enter
        transform: translate3D(100%,0,0)
      &.fade-enter-active,&.fade-leave-active
        transition: all .3s linear
      &.fade-enter-to
        transform: translate3D(0,0,0)
      &.fade-leave-to
        transform: translate3D(-100%,0,0)
      .header-info
        position: relative
        width: 100%
        height: 0
        padding-top: 100% /* Padding 100% 会根据width的值做计算，这样就可以实现元素的宽度等于高度 */
        background-color: white
        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .icon
          position: absolute
          top: 10px
          left: 0px
          .icon-arrow_lift
            display: block
            padding: 10px
            font-size: 20px
            color: #fff
      .desc
        width: 100%
        padding: 18px
        box-sizing: border-box
        background-color: #fff
        border-1px(rgba(7,17,27,.1))
        margin-bottom: 16px
        .desc-name
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7,17,27)
          margin-bottom: 8px
        .desc-info
          margin-bottom: 18px
          .count,.rate
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .count
            margin-right: 12px
        .price
          .current-price
            font-size: 14px
            line-height: 14px
            font-weight: 700
            color: rgb(240,20,20)
            margin-right: 12px
          .old-price
            font-size: 10px
            line-height: 10px
            font-weight: 700
            color: rgb(147,153,159)
            text-decoration: line-through
        .cart-wrapper
          position: absolute
          right: 12px
          bottom: 12px
        .buy
          position: absolute
          right: 18px
          bottom: 18px
          z-index: 10
          line-height: 24px
          height: 24px
          padding: 0 12px
          box-sizing: border-box
          font-size: 12px
          color: #fff
          border-radius: 12px
          background-color: rgb(0,160,220)
      .food-content
        padding: 18px
        background-color: #fff
        border-top: 1px solid rgba(7,17,27,.1)
        border-bottom: 1px solid rgba(7,17,27,.1)
        margin-bottom: 16px
        .content-title
          line-height: 14px
          font-size: 14px
          color: rgb(7,17,27)
          margin-bottom: 6px
        .content
          padding: 0 8px
          line-height: 24px
          font-size: 12px
          color: rgb(77,85,93)
      .rating
        position: relative
        padding: 18px 18px 0 18px
        background-color: #fff
        border-top: 1px solid rgba(7,17,27,.1)
        border-bottom: 1px solid rgba(7,17,27,.1)
        .title
          line-height: 14px
          font-size: 14px
          color: rgb(7,17,27)
          margin-bottom: 6px
      .rating-wrapper
        padding: 0 18px
        background-color: #fff
        .rateItem
          width: 100%
          padding: 16px 0
          border-1px(rgba(7,17,27,.1))
          .rating-info
            margin-bottom: 6px
            font-size: 0px
            position: relative
            .rating-time
              line-height: 12px
              font-size: 10px
              color: rgb(147,153,159)
              vertical-align: top
            .user-info
              display: inline-block
              position: absolute
              right: 0px
              top: 0px
              .username
                line-height: 12px
                font-size: 10px
                color: rgb(147,153,159)
                margin-right: 6px
                vertical-align: top
              img
                display: inline-block
                border-radius: 12px
          .rating-content
            .icon-thumb_up
              font-size: 12px
              line-height: 24px
              color: rgb(0,160,220)
              margin-right: 4px
              vertical-align: top
            .icon-thumb_down
              font-size: 12px
              line-height: 24px
              color: rgb(147,153,159)
              margin-right: 4px
              vertical-align: top
            .content
              font-size: 12px
              line-height: 24px
              color: rgb(7,17,27)
</style>
