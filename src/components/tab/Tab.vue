<template>
  <div class="tab">
    <div class="tab-item border-1px">
      <router-link to='/goods'>商品</router-link>
    </div>
    <div class="tab-item">
      <router-link to='/ratings'>评价</router-link>
    </div>
    <div class="tab-item">
      <router-link to='/seller'>商家</router-link>
    </div>
  </div>
</template>

<script tpye="text/ecmascript-6">
  export default {
    name: 'tab'
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl'

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7,17,27,.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        disply: block
        font-size: 14px
        color: rgb(77,85,93)
        &.active
          color: rgb(240,20,20)
</style>
