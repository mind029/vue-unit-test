<template>
  <div>
    <div>
      {{startDate.replace(/-/g,'.')}}-{{endDate.replace(/-/g,'.')}}
    </div>
  </div>
</template>

<script>
import dataApi from '@/api/data'
export default {
  name: 'api',
  created () {
    this.getData()
  },
  data () {
    return {
      webInfo: {},
      userInfo: {},
      init: false,
      startDate: '',
      endDate: '2019-05-01'
    }
  },
  methods: {
    async getData () {
      let start = Date.now()
      let result = await dataApi.schema()
      console.log(result)
      let end = Date.now()
      console.log('time', end - start)
    }
  }
}
</script>

<style scoped>
  .api-wrapper {
    width: 600px;
    margin: 0 auto;
  }
</style>
