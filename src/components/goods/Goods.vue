<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menu">
			<ul>
				<li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{current:currentIndex === index}" @click="selectMenu(index,$event)">
					
					<span class="text border-1px"><span v-show="item.type>0" class="icon" :class="type[item.type]"></span>{{item.name}}</span>
				</li>
			</ul>
		</div>
		<div class="goods-content" ref="goods">
			<ul>
				<li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li  @click.stop="selectFood(food, $event)"  v-for="(food,index) in item.foods" :key="index" class="food-item border-1px">
							<div class="avatar">
								<img :src="food.icon" alt="" width="57" height="57">
							</div>
							<div class="description">
								<h1 class="name">{{food.name}}</h1>
								<p class="food-description">{{food.description}}</p>
								<p><span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span></p>
								<p><span class="price">￥{{food.price}}</span><span class="old-price">{{food.oldPrice}}</span></p>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
    <shopcart :deliveryPrice="4" :minPrice="20" :select-foods="selectFoods"></shopcart>
    <food :food="selectedFood" ref="foodItem"></food>
	</div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/Shopcart';
  import cartcontrol from '../cartcontrol/Cartcontrol';
  import food from '../food/Food';
  
  const ERR_NO = 0;
    export default {
      props: {
        seller: {
          type: Object
        }
      },
      data () {
        return {
          goods: [],
          listHeights: [],
          scrollY: 0,
          selectedFood: {}
        }
      },
      computed: {
        currentIndex () {
            for (let i = 0; i < this.listHeights.length; i++) {
              let height1 = this.listHeights[i];
              let height2 = this.listHeights[i + 1];
              if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                return i;
              }
            }
            return 0;
        },
        selectFoods () {
            let foods = [];
            this.goods.forEach((good) => {
              good.foods.forEach((food) => {
                if (food.count) {
                  foods.push(food);
                }
              });
            });
            return foods;
        }
      },
      components: {
        shopcart,
        cartcontrol,
        food
      },
      methods: {
        _initScroll () {
          this.menuScroll = new BScroll(this.$refs.menu, {
            click: true
          });
          this.goodScroll = new BScroll(this.$refs.goods, {
            click: true,
            probeType: 3
          });
          this.goodScroll.on('scroll', (pos) => {
              this.scrollY = Math.abs(Math.round(pos.y));
          });
        },
        caculateY () {
          let lists = this.$refs.goods.getElementsByClassName('food-list-hook');
          let height = 0;
          this.listHeights.push(height);
          for (let i = 0; i < lists.length; i++) {
              height += lists[i].clientHeight;
              this.listHeights.push(height);
          }
        },
        selectMenu (index, event) {
          if (!event._constructed) {
            return;
          }
          let lists = this.$refs.goods.getElementsByClassName('food-list-hook');
          let el = lists[index];
          this.goodScroll.scrollToElement(el, 300);
        },
         selectFood (food, event) {
          if (!event._constructed) {
              return;
            }
          this.selectedFood = food;
          this.$refs.foodItem.showFood();
        }
      },
      created () {
        this.type = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
        this.$http.get('/goods').then((response) => {
          response = response.data;
          if (response.errno === ERR_NO) {
            this.goods = response.data;
            this.$nextTick(() => {
             this._initScroll();
             this.caculateY();
            });
          }
        }).catch((error) => {
          console.log(error);
        })
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .goods
    position: absolute
    top: 174px
    bottom: 46px
    display: flex
    flex-flow: row nowrap
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px /* 兼容android 浏览器的bug */
      box-size: border-box
      background-color: #f3f5f7
      .menu-item
        display: table
        width: 56px
        height: 54px
        font-size: 12px
        line-height: 14px
        padding:0 12px
        &.current
          background-color: white
          font-weight: 700
          z-index: 10
          margin-top: -1px
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: top
          background-repeat no-repeat
          background-size: 12px 12px
          margin-right: 2px
          &.decrease
            bg-image("decrease_3")
          &.discount
            bg-image("discount_3")
          &.guarantee
            bg-image("guarantee_3")
          &.invoice
            bg-image("invoice_3")
          &.special
            bg-image("special_3")
        .text
          display: table-cell
          vertical-align: middle
          width: 56px
          border-1px(rgba(7,17,27,.1))
    .goods-content
      flex: 1
      .food-list
        .title
          height: 26px
          background-color: #f3f5f7
          line-height: 26px
          font-size: 12px
          color: rgb(147,153,159)
          border-left: 2px solid #d9dde1
          padding-left: 12px
        .food-item
          display: flex
          margin: 18px 18px 0 18px
          padding-bottom: 18px
          border-1px(rgba(7,17,27,.1))
          &:last-child
            border-none()
          .avatar
            flex: 0 0 57px
            vertical-align: top
            width: 57px
            height: 57px
          .description
            flex: 1
            margin: 2px 0 0 10px
            .name
              font-size: 14px
              line-height: 14px
              color: rgb(7,17,27)
              margin-bottom: 8px
            .food-description,.sell-count,.rating
              font-size: 10px
              line-height: 15px
              color: rgb(147,153,159)
              margin-bottom: 8px
            .rating
              margin-left: 12px
            .price
              font-size: 14px
              color: rgb(240,20,20)
              font-weight: 700
              line-height: 24px
              margin-bottom: 8px
            .old-price
              font-size: 10px
              color: rgb(147,153,157)
              line-height: 24px
              margin-left: 8px
              margin-bottom: 8px
              text-decoration: line-through
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 12px
</style>