<template lang="pug">
#app
  md-toolbar
    h1.md-title(style="flex: 1") 我的设备
    md-button.md-icon-button.md-warn
      md-icon info
    md-button.md-icon-button(@click='openDialog')
      md-icon settings
  .main-content
    md-tabs
      md-tab(v-for='i in deviceList', :key='i.id', :md-label='i.name')
        device(
          @command='doCommand',
          :sensorTypes='devices[i.id].sensorTypes',
          :supportCommand='devices[i.id].supportCommand'
        )
  md-dialog-prompt(
    v-if='promptShow'
    md-title='设置服务器WebSocket',
    md-ok-text='确定',
    md-cancel-text='取消',
    v-model='wsServer',
    ref='wsServer',
    @close='onClose'
  )
</md-dialog-prompt>
</template>

<script>
import Device from './components/Device'
function getTime () {
  return (new Date()).getTime()
}
export default {
  name: 'app',
  components: {
    Device
  },
  data () {
    return {
      wsServer: 'ws://192.168.199.152:3000/client',
      promptShow: true,
      deviceList: [{
        id: 'a',
        name: '家'
      }],
      devices: {
        a: {
          sensorTypes: [{
            typeID: 1,
            typeName: '温度',
            unit: '℃'
          }, {
            typeID: 2,
            typeName: '湿度',
            unit: '%'
          }],
          supportCommand: [{
            typeID: 1,
            typeName: '测试类别',
            commands: [{
              cmdID: 1,
              cmdName: '开机'
            }, {
              cmdID: 2,
              cmdName: '关机'
            }]
          }, {
            typeID: 2,
            typeName: '测试类别2',
            commands: [{
              cmdID: 1,
              cmdName: '开机'
            }, {
              cmdID: 2,
              cmdName: '关机'
            }]
          }]
        }
      },
      activeDeviceId: null,
      now: getTime(),
      nowInterval: null
    }
  },
  created () {
    this.nowInterval = setInterval(() => {
      this.now = getTime()
    }, 1000)
  },
  destroyed () {
    clearInterval(this.nowInterval)
  },
  methods: {
    doCommand (typeId, cmdId) {
      console.log(typeId, cmdId)
    },
    openDialog () {
      this.promptValue = this.wsServer
      this.$refs.wsServer.open()
    },
    onClose (type) {
      this.promptShow = false
      setTimeout(() => { this.promptShow = true }, 1) // fucking workround, to reset value in textbox
      console.log('onClose', type)
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
.type {
  font-weight: bold;
}
</style>
