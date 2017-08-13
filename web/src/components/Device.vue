<template lang="pug">
.device
  div(v-if='ready')
    md-card(md-with-hover, v-for='sensorType in sensorTypes', :key='sensorType.typeID')
      md-card-header
        .md-title {{getSensorVal(sensorType.typeID)}}{{sensorType.unit}}
        .md-subhead 上次更新 {{getSensorPastTime(sensorType.typeID)}}
      md-card-content
        | {{sensorType.typeName}}
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
    getSensorPastTime (id) {
      if (!this.sensorValues) {
        return '从未'
      }
      let pastSec = this.sensorValues[id].t - util.nowSec
      if (pastSec < 1) {
        return '现在'
      }
      if (pastSec < 60) {
        return `${pastSec}秒前`
      }
      return `${Math.floor(pastSec / 60)}分钟前`
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
