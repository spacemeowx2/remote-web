<template lang="pug">
  #app
    md-toolbar
      h1.md-title(style="flex: 1") 我的设备
      md-button.md-icon-button.md-warn
        md-icon info
    .main-content
      md-tabs
        md-tab(md-label='家')
          md-card(md-with-hover)
            md-card-header
              .md-title 25℃
              .md-subhead 上次更新 1秒前
            md-card-content
              | 温度
          md-card(md-with-hover)
            md-card-header
              .md-title 70%
              .md-subhead 上次更新 1秒前
            md-card-content
              | 湿度
          md-card(md-with-hover)
            md-card-header
              .md-title 空调
            md-card-content
              md-list
                md-list-item(@click='doCommand') 开机
                md-list-item(@click='doCommand') 关机
          md-card(md-with-hover)
            md-card-header
              .md-title 电视
            md-card-content
              md-list
                md-list-item(@click='doCommand') 开机
                md-list-item(@click='doCommand') 关机
          //- md-list
          //-   md-list-item.type 空调
          //-   md-list-item 开机
          //-   md-list-item 关机
          //-     md-divider
          //-   md-list-item.type 电视
          //-   md-list-item 开机
          //-   md-list-item 关机
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  },
  methods: {
    doCommand () {
      //
    }
  }
}
</script>

<style lang="less">
body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
.md-card {
  margin: 10px 0;
}
.type {
  font-weight: bold;
}
</style>
