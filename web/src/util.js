import Vue from 'vue'
function getTime () {
  return (new Date()).getTime()
}
export const util = new Vue({
  data () {
    return {
      now: getTime()
    }
  },
  created () {
    setInterval(() => {
      this.now = getTime()
    }, 1000)
  },
  computed: {
    nowSec () {
      return Math.floor(this.now / 1000)
    }
  }
})
