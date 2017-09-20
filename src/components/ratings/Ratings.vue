<template>
	<div class="ratings" ref="ratings">
		<div class="content">
			<div class="content-header">
				<div class="header-left">
					<p class="score">{{average}}</p>
					<p class="text">综合评分</p>
					<p class="rate">高于周边商家{{seller.rankRate}}</p>
				</div>
				<div class="header-right">
					<div class="service-rating">
						<span class="title">服务态度</span>
						<div class="star">
							<star :size="36" :score="seller.serviceScore"></star>
						</div>
						<span class="num">{{seller.serviceScore}}</span>
					</div>
					<div class="good-rating">
						<span class="title">商品评价</span>
						<div class="star">
							<star :size="36" :score="seller.foodScore"></star>
						</div>
						<span class="num">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-time">
						<span class="title">送达时间</span><span class="time">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<div class="comment">
				<div class="select-comment">
					<selectrating  :ratings="ratings" @setType="setType" @setContent="setContent"></selectrating>
				</div>
				<div class="comment-content" ref="ratings">
					<ul v-show="ratings && ratings.length">
						<li class="rateItem border-1px" v-for="(rating,index) in ratings" v-show="contentFilter(rating.rateType,rating.text)">
						<div class="rating-avatar">
							<img class="avatar" :src="rating.avatar" width="28px" height="28px"></img>
						</div>
						 <div class="rating-info">
						 <div class="info-1"><span class="username">{{rating.username}}</span><span class="rating-time">{{rating.rateTime | formattime}}</span></div>
						 <div class="info-2">
						 <div class="in-star">
						 	<star :size="36" :score="rating.score"></star>
						 </div>
						 	<span class="time" v-show="rating.deliveryTime !='' && rating.deliveryTime">{{rating.deliveryTime}}分钟</span>
						 </div>
						 <div class="info-3"><span class="content">{{rating.text}}</span></div>
						 <div class="info-4" v-show="rating.recommend && rating.recommend.length !== 0">
						 	 <span class="icon-thumb_up" v-show="rating.rateType == 0"></span><span v-show="rating.rateType == 1" class="icon-thumb_down"></span><span class="tag" v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
						 </div>
						</div>
						</li>
					</ul>
					<div class="empty" v-show="!ratings || !ratings.length">没有任何评价信息！</div>
				</div>
			</div>
		</div> 
		<!-- <shopcart :deliveryPrice="4" :minPrice="20" :select-foods="selectFoods"></shopcart> -->
	</div>
</template>

<script type="text/ecmascript-6">
  import star from '@/components/star/Star';
  import shopcart from '../shopcart/Shopcart';
  import selectrating from '../selectRating/SelectRating.vue';
  import BScroll from 'better-scroll';
  const NO_ERR = 0;
  const ALL = 2;
  export default {
    props: {
        seller: {
          type: Object
        }
    },
    components: {
        star,
        shopcart,
        selectrating
    },
    data () {
        return {
          ratings: [],
          selectType: ALL,
          onlyContent: false
        }
    },
    computed: {
        average () {
          let ave = 0;
          let sum = 0;
          this.ratings.forEach((rate) => {
            sum += rate.score;
          });
          ave = sum / this.ratings.length;
          ave = Math.floor(ave * 10) / 10;
          return ave;
        }
    },
    created () {
      this.getData();
    },
    methods: {
      getData () {
         this.$http.get('/ratings').then((response) => {
           response = response.data
           if (response.errno === NO_ERR) {
            this.ratings = response.data
            this.$nextTick(() => {
         if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
           }
         }).catch((error) => {
           console.log(error)
         })
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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';
  .ratings
    position: absolute
    top: 174px
    left: 0
    bottom: 0px
    width: 100%
    overflow: hidden
    background-color: rgba(147,153,159,.1)
    .content
      .content-header
        display: flex
        flex-flow: row nowrap
        padding: 18px 0
        background-color: #fff
        border-bottom: 1px solid rgba(7,17,27,.1)
        .header-left
          flex: 0 0 137px
          width: 137px
          padding: 6px 0
          text-align: center
          border-right: 1px solid rgba(7,17,27,.1)
          @media only screen and (max-width: 320px)
            flex: 0 0 100px
            width: 100px
          .score
            margin-bottom: 6px
            line-height: 28px
            font-size: 24px
            color: rgb(255,153,0)
          .text
            margin-bottom: 8px
            line-height: 12px
            font-size: 12px
            color: rgb(7,17,27)
          .rate
            margin-bottom: 6px
            line-height: 10px
            font-size: 10px
            color: rgba(7,17,27,.3)
        .header-right
          flex: 1
          padding: 6px 0 6px 24px
          @media only screen and (max-width: 320px)
            padding-left: 6px
          .title,.num
            line-height: 18px
            font-size: 12px
            color: rgb(7,17,27)
            vertical-align: top
          .num
            color: rgb(255,153,0)
          .star
            display: inline-block
            margin: 0 4px
          .service-rating,.good-rating
            margin-bottom: 8px
          .delivery-time
            .time
              line-height: 18px
              font-size: 12px
              color: rgb(147,153,159)
              margin-left: 12px
      .comment
        background-color: #fff
        margin-top: 16px  
        border-top: 1px solid rgba(7,17,27,.1)
        .select-comment
          padding: 0 18px
          border-bottom: 1px solid rgba(7,17,27,.1)
        .comment-content
          padding: 0 18px  
          .rateItem
            display: flex
            padding: 18px 0
            border-1px(rgba(7,17,27,.1))
            .rating-avatar
              flex: 0 0 28px
              img
                border-radius: 50%
            .rating-info
              flex: 1 
              margin-left: 12px
              .info-1
                margin-bottom: 4px
                .username,.rating-time
                  line-height: 12px
                  font-size: 10px
                  color: rgb(7,17,27)
                  vertical-align: top
                .rating-time
                  color: rgb(147,153,159)
                  float: right
              .info-2
                margin-bottom: 6px
                .in-star
                  display: inline-block
                  vertical-align: top
                .time
                  line-height: 12px
                  font-size: 10px
                  color: rgb(147,153,159) 
              .info-3
                margin-bottom: 8px
                .content
                  font-size: 12px
                  line-height: 18px
                  color: rgb(7,17,27)
              .info-4
                .icon-thumb_up
                  color: rgb(0,160,220)
                  vertical-align: top
                .icon-thumb_down    
                  color: rgb(147,153,159)
                .tag
                  margin-left: 8px
                  display: inline-block
                  margin-bottom: 4px
                  padding: 0 6px
                  border: 1px solid rgba(7,17,27,.1)
                  border-radius: 2px
                  font-size: 9px
                  line-height: 16px
                  color: rgb(147,153,159)
                  vertical-align: top
</style>