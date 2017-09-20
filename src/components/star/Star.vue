<template>
  <div class="star" :class="styleType">
    <span v-for="(value,index) in starItems" :class="value" :key="index" class="star-item"></span><slot></slot>
  </div>
</template>

<script tpye="text/ecmascript-6">
  const Length = 5;
  const CLSON = 'on';
  const CLSOFF = 'off';
  const CLSHALF = 'half';

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      styleType () {
        return 'size_' + this.size
      },
      starItems () {
        let starnum = [];
        let score = Math.floor(this.score * 2) / 2;
        let hasDecimal = score % 1 !== 0;
        let onstar = Math.floor(score);
        for (let i = 0; i < onstar; i++) {
          starnum.push(CLSON);
        }
        if (hasDecimal) {
          starnum.push(CLSHALF);
        }
        while (starnum.length < Length) {
          starnum.push(CLSOFF);
        }
        return starnum;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl'
  .star
    font-size: 0px
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.size_48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0px
        &.on
          bg-image('star48_on')
        &.off
          bg-image('star48_off')
        &.half
          bg-image('star48_half')
    &.size_36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0px
        &.on
          bg-image('star36_on')
        &.off
          bg-image('star36_off')
        &.half
          bg-image('star36_half')
    &.size_24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0px
        &.on
          bg-image('star24_on')
        &.off
          bg-image('star24_off')
        &.half
          bg-image('star24_half')            
</style>
