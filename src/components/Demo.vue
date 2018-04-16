<template>
  <div class="demo-wrapper">
    <h1>{{ msg }}</h1>
    <div> count is
      <span class="count">{{count}}</span>
    </div>
    <div class="upperCase">{{upper | upperCase}}</div>
    <button type="button" @click="addCount" id="changeCount">增加count</button>
  </div>
</template>

<script>
export default {
  name: 'demo',
  created () {
    // console.log('created')
    this.addCount()
  },
  beforeMount () {
    // console.log('beforeMount')
  },
  mounted () {
    // console.log('mounted')
  },
  beforeUpdate () {
    // console.log('beforeUpdate')
  },
  updated () {
    // console.log('updated')
  },
  beforeDestroy () {
    // console.log('beforeDestroy')
  },
  destroyed () {
    // console.log('destroyed')
  },
  data () {
    return {
      msg: 'this is base data',
      count: 0,
      upper: 'hello'
    }
  },
  methods: {
    addCount () {
      this.count++
    },
    getData () {
      return [1, 2, 3]
    }
  },
  filters: {
    upperCase (str) {
      return str.toUpperCase()
    }
  }
}
</script>

<style scoped>
</style>
