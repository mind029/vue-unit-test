import axios from 'axios'

// 通过自定义环境变量来控制当前api是给
let baseURL = process.env.API_TEST ? 'http://localhost:3000' : ''

let instance = axios.create({
  baseURL: baseURL
})

export default {
  /**
   * 从后台获取所有api的josn-schema验证信息。
   * @returns {Promise}
   */
  schema () {
    return instance.get('/schema')
  },

  /**
   * 返回所有文章列表
   * @return {Promise}
   */
  postsList () {
    return instance.get('/posts')
  },
  /**
   * 获取文章详细细想
   * @param {*} params 参数：{id:1}
   * @return {Promise}
   */
  postsDetail (params) {
    return instance.get('/posts', {
      params: params
    })
  },
  /**
   * 返回评论列表
   * @param {*} params {page:1,rows:10}
   * @return {Promise}
   */
  commentsList (params) {
    return instance.get('/comments', {
      params: params
    })
  },
  /**
   * 获取网站信息
   * @return {Promise}
   */
  webInfo () {
    return instance.get('/webInfo')
  },
  /**
   * 获取用户信息
   * @param {*} params 参数：{id:1}
   * @return {Promise}
   */
  userInfo (params) {
    return instance.get('/userInfo', {
      params: params
    })
  }
}
