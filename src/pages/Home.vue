<template>
  <div class="web-info-wrapper">
    <template v-if="webInfo.status" >
        <h1 class="web-info-title">{{webInfo.title}}</h1>
        <hr />
        <div class="web-info-description">
            <strong>网站描述：</strong>{{webInfo.info.description}}
        </div>
        <ul>
          <li v-for="item of webInfo.info.nav" :key="item.id">{{item.name}}</li>
        </ul>
        <ol>
          <li>创建时间：<span class="web-info-create-time">{{webInfo.createTime}}</span></li>
        </ol>
        <div>
          <h3>开发人员：</h3>
          <ol>
              <li v-for="(item,index) of webInfo.developer" :key="index">{{item}}</li>
          </ol>
        </div>
    </template>
    <div>renderTime：{{time}}</div>
    <div>
      <hr />
      错误原因：
      <ul>
        <li v-for="(item,index) of errors" :key="index">{{item.message}}</li>
      </ul>
    </div>
    <button type="button" @click="webInfoLogic">获取网站数据</button>
  </div>
</template>
<script>
import dataApi from '@/api/data'
export default {
  name: 'homePage',
  data () {
    return {
      time: 0,
      webInfo: {},
      errors: []
    }
  },
  async created () {
    this.webInfoLogic()
  },
  methods: {
    async webInfoLogic () {
      let webInfoData = await this.getWebInfo()
      // 判断是否 ajax 获取数据正常
      if (!webInfoData) {
        return
      }
      // 判断返回数据是否符合预期的 JSONSCHEMA。
      if (this.validateWebInfoData(webInfoData)) {
        this.setWebInfo(webInfoData)
      }
    },
    async getWebInfo () {
      let webInfoRes
      try {
        webInfoRes = await dataApi.webInfo()
      } catch (error) {
        // 捕获到错误，可以上报到sentry
        console.log('请求接口报错了')
        return false
      }
      return webInfoRes.data
    },
    async validateWebInfoData (webInfoData) {
      let schemaData = await this.$schema()
      // 判断是否有验证规则，没有的话就留空。相当于不验证
      let webInfoSchema = schemaData.webInfo ? schemaData.webInfo : {}
      // 验证对象的实例，可以在这个实例得到 错误信息等。详细查看 ajv 项目介绍
      let ajvInstance = this.$ajv()
      // 获取验证结果
      let valid = ajvInstance.validate(webInfoSchema, webInfoData)
      if (!valid) {
        // 做错误处理，可以上报到sentry
        console.log('返回的数据不符合对应schema')
        // 获取错误原因，显示出来
        this.errors = ajvInstance.errors
      }
      // 返回验证结果、true/false
      return valid
    },
    // 这里还可以继续按照 单一职责模式 继续拆分成 。验证方法、设置 data的方法。
    async setWebInfo (webInfoData) {
      let start = Date.now()
      this.webInfo = webInfoData
      // 等待页面渲染完
      await this.$nextTick()
      let end = Date.now()
      // 统计页面渲染事件
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
