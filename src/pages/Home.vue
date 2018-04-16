<template>
  <div class="web-info-wrapper">
    <template v-if="webInfo.status" >
        <h1 class="web-info-title">{{webInfo.title}}</h1>
        <hr />
        <div class="web-info-description">
            网站描述：{{webInfo.info.description}}
        </div>
        <ul>
          <li v-for="item of webInfo.info.nav" :key="item.id">{{item.name}}</li>
        </ul>
        <ol>
          <li>创建时间：<span class="web-info-create-time">{{webInfo.createTime}}</span></li>
        </ol>
    </template>
    <div>renderTime：{{time}}</div>
    <button type="button" @click="getData">获取网站数据</button>
  </div>
</template>
<script>
import dataApi from '@/api/data'
export default {
  name: 'homePage',
  data () {
    return {
      time: 0,
      webInfo: {}
    }
  },
  async created () {
    // this.getData()
  },
  methods: {
    async getData () {
      let webInfoRes
      try {
        webInfoRes = await dataApi.webInfo()
      } catch (error) {
        console.log('请求接口报错了')
        return
      }
      if (webInfoRes.status === 200 || webInfoRes.status === 304) {
        this.setData(webInfoRes.data)
      } else {
        console.log('dataApi.webInfo 状态码不对')
      }
    },
    async setData (webInfoData) {
      let start = Date.now()
      let schemaData = await this.$schema()
      let webInfoSchema = schemaData.webInfo ? schemaData.webInfo : {}
      // 验证结果
      let valid = this.$ajv().validate(webInfoSchema, webInfoData)
      if (valid) {
        this.webInfo = webInfoData
      } else {
        console.log('返回的数据不符合对应schema')
      }
      // 等待页面渲染完
      await this.$nextTick()
      let end = Date.now()
      this.time = end - start
    }
  }
}
</script>
<style scoped>
.web-info-wrapper {
  width: 600px;
  margin: 0 auto;
}
</style>
