import chai, {expect} from 'chai'
import chaiAjv from 'chai-json-schema-ajv'
// 后端api
import dataApi from '../../src/api/data'
// 让chai支持json-schema
chai.use(chaiAjv)

// 用于存储schema相关数据
let schemaRes
let schemaData
describe('# 后端api Test', async function () {
  // 初始化数据
  before(async function () {
    schemaRes = await dataApi.schema()
    schemaData = schemaRes.data
  })

  describe('# /postsList 接口相关测试', function () {
    it('# 状态码 是否为200', async function () {
      let result = await dataApi.postsList()
      expect(result.status).to.equal(200)
    })

    it('# 返回数据是否符合预期JSON-SCHEMA', async () => {
      let result = await dataApi.postsList()
      expect(result.data).to.be.jsonSchema(schemaData.postsList)
    })
  })

  describe('# /postsDetail', function () {
    it('# /postsDetail状态码 是否为200', async function () {
      let result = await dataApi.postsDetail({id: 1})
      expect(result.status).to.equal(200)
    })

    it('# /postsDetail返回数据是否符合预期JSON-SCHEMA', async () => {
      let result = await dataApi.postsDetail()
      expect(result.data[0]).to.be.jsonSchema(schemaData.postsDetail)
    })
  })

  describe('# /commentsList', function () {
    it('# /commentsList状态码 是否为200', async function () {
      let result = await dataApi.commentsList()
      expect(result.status).to.equal(200)
    })

    it('# /commentsList返回数据是否符合预期JSON-SCHEMA', async () => {
      let result = await dataApi.commentsList()
      expect(result.data).to.be.jsonSchema(schemaData.commentsList)
    })
  })

  // 对返回的数据 json-schema加上正则
  describe('# /userInfo', function () {
    it('# /userInfo状态码 是否为200', async function () {
      let result = await dataApi.userInfo()
      expect(result.status).to.equal(200)
    })

    it('# /userInfo返回数据是否符合预期JSON-SCHEMA', async () => {
      let result = await dataApi.userInfo()
      expect(result.data).to.be.jsonSchema(schemaData.userInfo)
    })
  })
})
