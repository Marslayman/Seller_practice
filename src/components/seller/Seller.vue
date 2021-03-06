<template>
	<div class="seller" ref="seller">
		<div class="seller-container">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc border-1px">
					<star :size="36" :score="seller.score"></star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
        <ul class="remark">
          <li class="block">
             <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{active:favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
			</div>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <div class="supports" v-if="seller.supports">
          <li v-for="(item,index) in seller.supports" class="support-item border-1px">
            <span class="icon" :class="type[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </div>
      </div>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img :src="pic" width="120px" height="90px">
            </li>
          </ul>
        </div>
      </div>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li v-for="(info,index) in seller.infos" :key="index" class="info-item border-1px">{{info}}</li>
        </ul>
      </div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
  import star from '@/components/star/Star';
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from '../../common/js/storage.js'
	export default {
	  props: {
	    seller: {
	      type: Object
	    }
	  },
    data () {
	    return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false)
        })()
      }
    },
    created () {
      this.type = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    },
    computed: {
	    favoriteText () {
	      return this.favorite ? '已收藏' : '收藏';
      }
    },
    mounted () {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
        if (this.seller.pics) {
          let width = 120;
          let margin = 6;
          let allWidth = (width + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = allWidth + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.picScroll.refresh();
            }
          })
        }
    },
    methods: {
	    toggleFavorite (event) {
	      if (!event._constructed) {
	        return;
        }
        this.favorite = !this.favorite;
	      saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
	  components: {
	    star
	  }
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .seller
    position: absolute
    top: 174px
    left: 0
    bottom: 0px
    width: 100%
    overflow: hidden
    background-color: rgba(147,153,159,.1)
    .overview
      position: relative
      padding: 18px
      border-bottom: 1px solid rgba(7,17,27,.1)
      margin-bottom: 16px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        border-1px(rgba(7,17,27,.1))
        font-size: 0px
        .star
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          margin-right: 12px
          font-size: 10px
          line-height: 18px
          vertical-align: top
          color: rgb(77,85,93)
          line-height: 18px
      .favorite
        position: absolute
        width: 50px
        top: 18px
        right: 11px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          font-size: 24px
          line-height: 24px
          color: #d4d6d9
          &.active
            color: rgb(240,20,20)
        .text
          line-height: 10px
          font-size: 10px
          color: rgb(77,85,93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7,17,27,.1)
          &:last-child
            border: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7,17,27)
            .stress
              font-size: 20px
    .bulletin
      padding: 18px 18px 0 18px
      border-top: 1px solid rgba(7,17,27,.1)
      border-bottom: 1px solid rgba(7,17,27,.1)
      margin-bottom: 16px
      .title
        font-size: 14px
        line-height: 14px
        color: rgb(7,17,27)
      .content-wrapper
        padding: 8px 12px
        border-1px(rgba(7,17,27,.1))
        .content
          font-size: 12px
          line-height: 24px
          color: rgb(240,20,20)
      .supports
        .support-item
          padding: 16px 12px
          font-size: 0px
          border-1px(rgba(7,17,27,.1))
          &:last-child
            border-none()
          .icon
            display: inline-block
            width: 16px
            height: 16px
            vertical-align: top
            background-repeat no-repeat
            background-size: 16px 16px
            margin-right: 6px
            &.decrease
              bg-image("decrease_4")
            &.discount
              bg-image("discount_4")
            &.guarantee
              bg-image("guarantee_4")
            &.invoice
              bg-image("invoice_4")
            &.special
              bg-image("special_4")
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7,17,27)
    .pics
      padding: 18px
      border-top: 1px solid rgba(7,17,27,.1)
      border-bottom: 1px solid rgba(7,17,27,.1)
      margin-bottom: 16px
      .title
        margin-bottom: 12px
        line-height: 14px
        font-size: 14px
        color: rgb(7,17,27)
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0px
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0px
    .info
      padding: 18px 18px 0 18px
      border-top: 1px solid rgba(7,17,27,.1)
      color: rgb(7,17,27)
      .title
        padding-bottom: 12px
        line-height: 14px
        font-size: 14px
        border-1px(rgba(7,17,27,.1))
      .info-item
        padding: 16px 12px
        line-height: 16px
        border-1px(rgba(7,17,27,.1))
        font-size: 12px
        &:last-child
          border-none()
</style>
