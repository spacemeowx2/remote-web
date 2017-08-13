<template lang="pug">
.device
  div(v-if='ready')
    md-card(md-with-hover, v-for='sensorType in sensorTypes', :key='sensorType.typeID')
      md-card-header
        .md-title {{sensorValues ? sensorValues[sensorType.typeID] : 'N/A'}}{{sensorType.unit}}
        .md-subhead 上次更新 1秒前
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
export default {
  name: 'Device',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
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
