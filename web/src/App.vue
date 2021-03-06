<template lang="pug">
#app
  md-toolbar
    h1.md-title(style="flex: 1") 我的设备
    md-button.md-icon-button.md-warn
      md-icon info
    md-button.md-icon-button(@click='openDialog')
      md-icon settings
  .main-content
    md-tabs(@change='onTabChange')
      md-tab(v-for='i in deviceList', :key='i.id', :md-label='i.name')
        device(
          @command='doCommand',
          :device-id='i.id'
          :ready='!!devices[i.id]'
          :sensor-types='devices[i.id] && devices[i.id].sensorTypes',
          :support-command='devices[i.id] && devices[i.id].supportCommand'
          :sensor-values='sensors[i.id]'
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
import {Subscriptor} from './connection'
import {util} from './util'

export default {
  name: 'app',
  components: {
    Device
  },
  data () {
    return {
      wsServer: `ws://${location.hostname}:3000/client`,
      promptShow: true,
      deviceList: [],
      devices: {},
      sensors: {},
      activeDeviceId: null,
      nowInterval: null,
      subscriptor: null,
      lastDeviceSID: null,
      lastSensorSID: null
    }
  },
  created () {
    this.subscriptor = new Subscriptor(this.wsServer)
    this.subscriptor.onPublish = (data, name, args) => this.onPublish(data, name, args)
    this.subscriptor.subscribe('DeviceList', null)
  },
  methods: {
    doCommand (deviceId, typeId, cmdId) {
      console.log(deviceId, typeId, cmdId)
      this.subscriptor.send({
        type: 'DoCommand',
        deviceID: deviceId,
        typeID: typeId,
        cmdID: cmdId
      })
    },
    openDialog () {
      this.promptValue = this.wsServer
      this.$refs.wsServer.open()
    },
    onClose (type) {
      this.promptShow = false
      setTimeout(() => { this.promptShow = true }, 1) // fucking workround, to reset value in textbox
      console.log('onClose', type)
    },
    onPublish (data, name, args) {
      // console.log('package', data, name, args)
      switch (name) {
        case 'DeviceDetail': {
          const detail = data.d
          if (detail) {
            this.devices[args[0]] = detail
          }
          break
        }
        case 'Sensor': {
          const sensor = data.c
          if (sensor) {
            for (let key of Object.keys(sensor)) {
              sensor[key].t = util.nowSec - sensor[key].t
            }
            this.$set(this.sensors, args[0], sensor)
            // this.sensors[args[0]] = sensor
          }
          break
        }
        case 'DeviceList': {
          this.deviceList = data.d
          break
        }
      }
    },
    switchDeviceDetail (deviceID) {
      if (this.lastDeviceSID) {
        this.subscriptor.unsubscribe(this.lastDeviceSID)
        this.lastDeviceSID = null
      }
      this.lastDeviceSID = this.subscriptor.subscribe('DeviceDetail', deviceID, null)
    },
    switchSensor (deviceID) {
      if (this.lastSensorSID) {
        this.subscriptor.unsubscribe(this.lastSensorSID)
        this.lastSensorSID = null
      }
      this.lastSensorSID = this.subscriptor.subscribe('Sensor', deviceID, null)
    },
    onTabChange (index) {
      const item = this.deviceList[index]
      this.switchDeviceDetail(item.id)
      this.switchSensor(item.id)
      console.log('onTabChange', item.id)
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
