<template>
  <div>
   <v-header :seller='seller'></v-header>
   <v-tab></v-tab>
    <keep-alive>
      <router-view  :seller='seller'></router-view>
    </keep-alive>
  </div>
</template>

<script >
  import header from './components/header/Header'
  import tab from './components/tab/Tab'
  import {urlParse} from './common/js/util.js'
  // 定义ajax状态判定
  const NO_ERR = 0

  export default {
    name: 'app',
    components: {
        'v-header': header,
        'v-tab': tab
    },
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
         this.$http.get('/seller?id=' + this.seller.id).then((response) => {
           response = response.data
           if (response.errno === NO_ERR) {
            this.seller = Object.assign({}, this.seller, response.data);
           }
         }).catch((error) => {
           console.log(error)
         })
      }
    }
  }
</script>

<style>
</style>
