<template lang="pug">
.device
  div(v-if='ready')
    md-card(md-with-hover, v-for='sensor in sensors', :key='sensor.typeID')
      md-card-header
        .md-title {{sensor.value}}{{sensor.unit}}
        .md-subhead 上次更新 {{getSensorPastTime(sensor.pastTime)}}
      md-card-content
        | {{sensor.typeName}}
    md-card(md-with-hover, v-for='catelog in supportCommand', :key='catelog.typeID')
      md-card-header
        .md-title {{catelog.typeName}}
      md-card-content
        md-list
          md-list-item(@click='$emit("command", catelog.typeID, cmd.cmdID)', v-for='cmd in catelog.commands', :key='cmd.cmdID') {{cmd.cmdName}}
  div(v-if='!ready', style='text-align: center')
    md-spinner(md-indeterminate)
</template>

<script>
import {util} from '../util'
export default {
  name: 'Device',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    getSensorVal (id) {
      return this.sensorValues ? this.sensorValues[id].d : 'N/A'
    },
    getSensorPastTime (pastSec) {
      if (pastSec === null) {
        return '从未'
      }
      if (pastSec < 1) {
        pastSec = 1
      }
      if (pastSec < 60) {
        return `${pastSec}秒前`
      }
      return `${Math.floor(pastSec / 60)}分钟前`
    }
  },
  computed: {
    sensors () {
      return this.sensorTypes.map(i => {
        const val = this.sensorValues && this.sensorValues[i.typeID]
        i.value = val ? val.d : 'N/A'
        i.pastTime = val ? util.nowSec - val.t : null
        return i
      })
    }
  },
  props: ['sensorTypes', 'sensorValues', 'supportCommand', 'ready']
}
</script>

<style scoped>
.md-card {
  margin: 10px 0;
}
</style>
