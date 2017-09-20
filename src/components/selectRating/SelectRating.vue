<template>
  <div class="select-ratings">
    <div class="type-select border-1px">
      <span class="box all" @click="select(2,$event)" :class="{active: selectType === 2}">{{types.all}}&nbsp;{{ratings.length}}</span><span class="box agree" :class="{active: selectType === 0}" @click="select(0,$event)">{{types.agree}}&nbsp;{{agree}}</span><span class="box disagree" :class="{active: selectType === 1}" @click="select(1,$event)">{{types.disagree}}&nbsp;{{disagree}}</span>
    </div>
    <div class="switch" @click="switchOn($event)">
      <span class="icon-check_circle" :class="{only: onlyContent}"></span><span class="text" :class="{only: onlyContent}">只看有内容的评价</span>
    </div>
  </div>

</template>

<script tpye="text/ecmascript-6">
  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return [];
        }
      },
      types: {
        type: Object,
        default () {
          return {
            all: '全部',
            agree: '满意',
            disagree: '不满意'
          }
        }
      }
    },
    computed: {
      agree () {
        let count = 0;
        this.ratings.forEach((rate) => {
          if (rate.rateType === 0) {
            count++;
          }
        })
        return count;
      },
      disagree () {
        let count = 0;
        this.ratings.forEach((rate) => {
          if (rate.rateType === 1) {
            count++;
          }
        })
        return count;
      }
    },
    data () {
      return {
        onlyContent: false,
        selectType: 2
      }
    },
    methods: {
      select (type, event) {
        if (!event._constructed) {
          return;
        }
        if (type === 2) {
          this.selectType = 2;
        }
        if (type === 0) {
          this.selectType = 0;
        }
        if (type === 1) {
          this.selectType = 1;
        }
        this.$emit('setType', type);
      },
      switchOn (event) {
        if (!event._constructed) {
          return;
        }
        this.onlyContent = !this.onlyContent;
        this.$emit('setContent', this.onlyContent);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl';

  .select-ratings
    .type-select
      width: 100%
      padding: 18px 0
      border-1px(rgba(7,17,27,.1))
      .box
        line-height: 16px
        padding: 8px 12px
        text-align: center
        border-radius: 2px
        color: rgb(77,85,93)
        margin-right: 8px
        &.all,&.agree
          background-color: rgba(0,160,220,.2)
          &.active
            background-color: rgb(0,160,220)
            color: #fff
        &.disagree
          background-color: rgba(77,85,95,.2)
          &.active
            background-color: rgb(77,85,95)
            color: #fff
    .switch
      margin: 12px 0
      .icon-check_circle,.text
        line-height: 24px
        font-size: 24px
        color: rgb(147,153,159)
        margin-right: 4px
        &.only
          color: #00c850
          font-weight: 700
      .text
        font-size: 12px
        vertical-align: top
</style>
