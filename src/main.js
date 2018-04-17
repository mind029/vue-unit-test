// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import dataApi from '@/api/data'
// https://github.com/epoberezkin/ajv
import Ajv from 'ajv'
Vue.config.productionTip = false

// 页面加载进来第一次先清除掉之前的规则。
localStorage.removeItem('schema')

/**
 * 获取通过api获取后端jsonchema数据
 * 1. 后端设置当前 jsonchema 版本新到 cookie中
 * 2. 检查本地 localStorage.getItem('schema') 是否存在 schema ，已经相应版本信息
 * 3. 如果 本地 schema 不存在，则 通过 ajax 请求后端 对应api，然后存在本地。
 * 4. 如果 本地 schema 存在，但 版本 小于 后端返回的 版本，则 通过 ajax 请求后端 对应api，然后存在本地。
 * 5. 如果 本地 schema 存在，版本相同，则直接返回本地的 schema 数据
 */
Vue.prototype.$schema = async function () {
  let localSchema = localStorage.getItem('schema')
  if (localSchema) {
    return JSON.parse(localSchema)
  } else {
    let result = await dataApi.schema()
    localStorage.setItem('schema', JSON.stringify(result.data))
    return result.data
  }
}

Vue.prototype.$ajv = function () {
  let ajv = new Ajv()
  return ajv
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
