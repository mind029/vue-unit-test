# 基于JSON-SCHEMA对后端api进行测试

现在很多项目都是前后端分离的项目，大部分数据都是通过后端 `api` 通过返回 `JSON` 数据，然后前端对数据进行各类处理，大部分情况下，前后端 很少对 `api` 返回的数据进行数据校验，比如 必须字段、格式、类型等。后期如果 后端 `api` 接口返回格式变动了，如果没有 校验、那么 前端 `JavaScript` 业务逻辑代码很可能出错，但我们却没做任何错误处理，用户看到页面出现异常，体验极差。

**痛点分析**

1. 系统不断迭代开发，前后端使用的api接口越来越多，比如上百个的时候，如果后期迭代改动，造成部分 `api` 返回的 数据跟预期 不一样了，如何知道？靠人力测试？ 就会影响到一些功能模块正常使用。
2. 不能因为新迭代开发影响到前面已经做好的。
3. 大量断言来判断相关字段
4. 前后端不共用校验规则，可能校验规则不一致。


**为了让项目更加稳健推荐做法：**

1. 前端对后端api返回的json数据进行预期校验、检查必须字段、类型、格式等是否符合预期
2. 后端api接口响应前，也对json数据进行预期校验、检查必须字段、类型、格式等是否符合预期

前后端都对数据进行预期校验、符合预期返回 就没任何影响、如果不符合预期，进行相关错误处理。**项目越大效果越明显**。


## （一）JSON-SCHEMA

为什么使用JSON-SCHEMA而不是自己写大量的 业务逻辑代码 来判断？

1. 效率低下，因为后端返回数据字段繁多，手动校验相对较慢。
2. 前后端不通用，JSON-SCHEMA因为是一种规范，所以可以做到前后端共用一套校验规则。

## （二）如何实施

### 后端如何整合

#### 1. 语言层面整合

如果 后端语言 相关框架 有对 返回数据的 切面 hook，那么在那一层做即可，改动现有业务代码。如果没有，那么需要改动的 api就有点多了。

1. 后端Node.js可以跟前端JavaScript使用同样的 JSON-SCHEMA 校验库
2. 其他语言，需要找 JSON-SCHEMA 校验库。

#### 2. web服务器层整合

大部分web服务器程序都能够对后端api响应内容进行处理，我们在这一层进行对 api 数据 校验整合 ， 这样对后端影响最小。

比如基于 `nginx+lua` 或 `openresty` 的做web服务器的， 在请求生命周期 hook 中的  `body_filter_by_lua` 阶段进行数据处理。详细实现，后面深入做完相关测试后再分享，不在这篇文章。

### 前端如何整合

1. 前端项目最好使用 `axios` ，`superagent` 等前后端 前后端通过 http 请求库。这样我们在 `api` 测试过程中共用 项目中已经配好的 api 接口请求信息。

2. 利用 mocha、chai、ajv、jsonschema规则 来测试我们的 api。

#### 步骤1：安装相关依赖包

这些依赖包，如果本身 `package.json` 已经带有的话，可以跳过。

1. 安装 测试框架 [mocha](https://github.com/mochajs/mocha)，终端输入 ` npm install mocha --save-dev `
2. 安装 `mocha` 导出html报告 [mochawesome](http://adamgruber.github.io/mochawesome/) 插件 ，终端输入：`npm install --save-dev mochawesome`

3. 安装 断言库 [chai.js](https://github.com/chaijs/chai)，终端输入 `npm install chai --save-dev`

4. 安装 chai.js 的 [chai-json-schema-ajv](http://www.chaijs.com/plugins/chai-json-schema-ajv/) 插件，用于支持 `JSON-SCHEMA` 校验 ，终端输入：`npm install chai-json-schema-ajv --save-dev`

5. 安装 json验证器 [ajv](https://github.com/epoberezkin/ajv)，在终端输入 ：`npm install ajv --save-dev`。

6. （可选）安装 [json-server](https://github.com/typicode/json-server) 提供 模拟api，真是环境我们用自己后端api即可。

7. （可选）安装 Eslint支持chai.js 语法插件， [eslint-plugin-chai-friendly](https://github.com/ihordiachenko/eslint-plugin-chai-friendly)，在终端输入：`npm install eslint-plugin-chai-friendly --save-dev`，详细设置请访问链接查看。

#### 步骤2：改造api接口增加环境变量，用于判断是API测试、还是本地 AJAX 调用


`vue-unit-test/src/api/data.js` 页面代码增加 环境变量判断

```javascript
// 通过自定义环境变量来控制当前api是给
let baseURL = process.env.API_TEST ? 'http://localhost:3000' : ''

let instance = axios.create({
  baseURL: baseURL
})

```


#### 步骤3：在test文件夹增加 api 测试 脚本代码

1. 从后端api接口获取schema数据，得到各个api个验证规则
2. 验证api返回数据 是否符合 预期数据

在 `vue-unit-test/test/api/data.spec.js` 编写相关 api 测试代码如下：

```javascript
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

  // 返回的数据 json-schema 有对字符串正则校验
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

```



#### 步骤4：在 `package.json` 增加 mocha 启动脚本

1. `API_TEST=true` 表示运行环境变量
2. `--compilers js:babel-core/register` 表示对测试脚本进行 babel 转码
3. `--reporter mochawesome` 导出报告格式
4. `mocha test/api/*` 待测试脚本

```json
{
  "scripts": {
    "api-test": "API_TEST=true mocha  test/api/*   --compilers js:babel-core/register --reporter mochawesome"
  }
}

```


#### 步骤5：为后端 api 生成 jsonschema 校验规则

网站 https://jsonschema.net/ ，可以通过复制json 进去，直接生成相应的 jsonschema 校验规则。

**常用的判断**

除了比较结构和类型外，我们还可以详细比较，

1. 字段是否必须
2. 数字范围
3. 字符串可以使用正则
4. 默认值
等，更多可以查看详细 http://json-schema.org/


#### 步骤5：启动 json-server 提供模拟 api

这里我们使用本地模拟数据，有后端 api跳过

`db.json` 文件 配置了模拟api 数据，启动 json-sevrer后就会生成相应的 http 接口。


启动 `json-server` 提供模拟数据，在项目的 根目录运行：`json-server db.json`

```

{
  "posts": [{
      "id": 1,
      "title": "json-server",
      "author": "typicode"
    },
    {
      "id": 2,
      "title": "json-server2",
      "author": "typicode2",
      "description": "这是描述"
    }
  ],
  "comments": [{
    "id": 1,
    "body": "some comment"
  }],
  "profile": {
    "name": "typicode"
  },
  "userInfo": {
    "id": 1,
    "nickname": "mind",
    "age": "未知",
    "region": {
      "province": "广西",
      "city": "南宁"
    },
    "hobby": [{
      "id": 1,
      "name": "体育"
    }, {
      "id": 2,
      "name": "变成"
    }],
    "createTime": 1523846503691,
    "tags": ["开发", "前端", "JavaScript"],
    "status": true
  },
  "webInfo": {
    "id": 1,
    "title": "api test",
    "status": true,
    "createTime": 1523846676676,
    "info": {
      "description": "数据用于测试的",
      "post": 10,
      "nav": [{
        "id": 1,
        "name": "栏目1"
      }, {
        "id": 2,
        "name": "栏目2"
      }]
    },
    "developer": ["mind", "张三", "李四"],
    "tags": [{
      "id": 1,
      "name": "前端"
    }, {
      "id": 2,
      "name": "vuejs测试"
    }],
    "isNull": null
  },
  "schema" : {
    "postsList" : {
      "$id": "http://example.com/postsList.json",
      "type": "array",
      "items": {
        "$id": "http://example.com/postsList.json/items",
        "type": "object",
        "properties": {
          "id": {
            "$id": "http://example.com/postsList.json/items/properties/id",
            "type": "integer",
            "default": 0
          },
          "title": {
            "$id": "http://example.com/postsList.json/items/properties/title",
            "type": "string",
            "default": ""
          },
          "author": {
            "$id": "http://example.com/postsList.json/items/properties/author",
            "type": "string",
            "default": ""
          }
        },
        "required":[
          "id",
          "title"
        ]
      }
    },
    "postsDetail": {
      "$id": "http://lixingchuxing.com/validation_postsDetail.json",
      "type": "object",
      "properties": {
        "id": {
          "$id": "/properties/id",
          "type": "integer",
          "default": 0
        },
        "title": {
          "$id": "/properties/title",
          "type": "string",
          "default": ""
        },
        "author": {
          "$id": "/properties/author",
          "type": "string",
          "default": ""
        }
      },
      "required": [
        "id",
        "title"
      ]
    },
    "commentsList": {
      "$id": "http://lixingchuxing.com/validation_commentsList.json",
      "type": "array",
      "items": {
        "$id": "http://lixingchuxing.com/validation_commentsList.json/items",
        "type": "object",
        "properties": {
          "id": {
            "$id": "http://lixingchuxing.com/validation_commentsList.json/items/properties/id",
            "type": "integer",
            "default": 0
          },
          "body": {
            "$id": "http://lixingchuxing.com/validation_commentsList.json/items/properties/body",
            "type": "string",
            "default": ""
          },
          "postId": {
            "$id": "http://lixingchuxing.com/validation_commentsList.json/items/properties/postId",
            "type": "integer",
            "default": 0
          }
        },
        "required": [
          "id",
          "body",
          "postId"
        ]
      }
    },
    "userInfo": {
      "$id": "http://lixingchuxing.com/validation_userInfo.json",
      "type": "object",
      "properties": {
        "id": {
          "$id": "/properties/id",
          "type": "integer",
          "default": 0
        },
        "nickname": {
          "$id": "/properties/nickname",
          "type": "string",
          "default": "",
          "pattern": "^m.{3,10}"
        },
        "age": {
          "$id": "/properties/age",
          "type": "string",
          "default": ""
        },
        "region": {
          "$id": "/properties/region",
          "type": "object",
          "properties": {
            "province": {
              "$id": "/properties/region/properties/province",
              "type": "string",
              "default": ""
            },
            "city": {
              "$id": "/properties/region/properties/city",
              "type": "string",
              "default": ""
            }
          }
        },
        "hobby": {
          "$id": "/properties/hobby",
          "type": "array",
          "items": {
            "$id": "/properties/hobby/items",
            "type": "object",
            "properties": {
              "id": {
                "$id": "/properties/hobby/items/properties/id",
                "type": "integer",
                "default": 0
              },
              "name": {
                "$id": "/properties/hobby/items/properties/name",
                "type": "string",
                "default": ""
              }
            }
          }
        },
        "createTime": {
          "$id": "/properties/createTime",
          "type": "integer",
          "default": 0
        },
        "tags": {
          "$id": "/properties/tags",
          "type": "array",
          "items": {
            "$id": "/properties/tags/items",
            "type": "string",
            "default": ""
          }
        },
        "status": {
          "$id": "/properties/status",
          "type": "boolean",
          "default": false
        }
      },
      "required": [
        "id",
        "nickname"
      ]
    }
  }
}
```


#### 步骤6：运行 mocha 测试后端api

运行 mocha 命令：`npm run api-test`

终端控制台会输出响应的日志文件，然后 在 `mochawesome` 文件夹，会生成相关的 `html` 文件



## 可继续优化的地方

1. 现在通过修改 api 校验规则的 json 文件。从而使新规则生效，不够直观。能够否做成 配置后台，操作更加便捷？

2. 直接暴露校验规则是否不够安全



## 需要考虑的地方

1. 老生常谈，开发是否有时间来写对应的测试用例。
2. 数据校验会损失一部分性能，让程序比没有校验慢一点点，能否接受。



## 参考资料

1. [Mocha测试框架](https://github.com/mochajs/mocha)
2. [断言库 chai.js](https://github.com/chaijs/chai)
3. [chai-json-schema-ajv](http://www.chaijs.com/plugins/chai-json-schema-ajv/)
4. [JavaScript JSON-SCHEMA 校验库](https://github.com/epoberezkin/ajv)
5. [通过 JSON 生成响应的 JSON-SCHEMA](https://jsonschema.net/)
6. [mocha测试报告生成html文件](http://adamgruber.github.io/mochawesome/)
7. [eslint-plugin-chai-friendly](eslint-plugin-chai-friendly)




