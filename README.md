# vue-unit-test

使用 karma、Mocha、chai 对vue项目进行单元测试。

`vue-cli` 脚手架工具创建新项目的时候，我们可以选择 创建包含单元测试 `karma && Mocha` 的项目。



## 快速预览

![](https://ws2.sinaimg.cn/large/006tNc79ly1fqa9m8w868j31cm0xcak5.jpg)

git clone 项目下来，然后查看 test 目录里面的测试代码

``` bash

git clone https://github.com/mind029/vue-unit-test.git

cd vue-unit-test

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```



## 单元测试什么

1. vue组件加载后，data数据模型是否符合预期要求。
2. 定义在 methods 方法是否可用
3. filter是否可用
4. 带有props的组件，数据能否正常传递
5. 异步更新DOM的情况渲染的结果是否符合预期、比如 class、文字、属性等。
6. 组件绑定事件是触发结构是否符合预期
7. 子组件

### 对vue组件初始化进行测试

#### 示例1：

`data.spec.js` 我们对Demo.vue 组件进行 data 默认数据测试

```javascript
/* eslint-env node, mocha */
import Demo from '@/components/Demo'
/* global expect */
describe('# Demo组件 data 初始化数据测试', () => {
  it('# 组件名称name', () => {
    expect(Demo.name).to.equal('demo')
  })

  it('# data is a function ', () => {
    expect(Demo.data).to.be.an('function')
  })

  it('# data 默认数据检查', () => {
    const defaultData = Demo.data()
    expect(defaultData.msg).to.equal('this is base data')
    expect(defaultData.count).to.equal(0)
  })
})

```
#### 示例2:

`hook.spec.js` 对vue生命周期中的各个hook方法测试。

```javascript

/* eslint-env node, mocha */
import Demo from '@/components/Demo'
/* global expect */
describe('# Demo组件hook方法测试', () => {
  it('# 组件是否拥有 created 方法', () => {
    expect(Demo.created).to.be.an('function')
  })

  it('# 组件是否拥有 beforeMount 方法', () => {
    expect(Demo.beforeMount).to.be.an('function')
  })

  it('# 组件是否拥有 mounted 方法', () => {
    expect(Demo.mounted).to.be.an('function')
  })

  it('# 组件是否拥有 beforeUpdate 方法', () => {
    expect(Demo.beforeUpdate).to.be.an('function')
  })

  it('# 组件是否拥有 updated 方法', () => {
    expect(Demo.updated).to.be.an('function')
  })

  it('# 组件是否拥有 beforeDestroy 方法', () => {
    expect(Demo.beforeDestroy).to.be.an('function')
  })

  it('# 组件是否拥有 destroyed 方法', () => {
    expect(Demo.destroyed).to.be.an('function')
  })
})


```

#### 示例3

`methods.spec.js` 对组件methods里面的方法进行测试

```javascript

/* eslint-env node, mocha */
import { createTest, destroyVM } from '../../util'
import Demo from '@/components/Demo'
/* global expect */
describe('# Demo组件 methods 测试', () => {
  it('# 是否有用 addCount 函数 ', () => {
    expect(Demo.methods.addCount).to.be.an('function')
  })

  it('# 是否有用 getData 函数 ', () => {
    expect(Demo.methods.getData).to.be.an('function')
  })

  it('# 测试 getData ，返回数据是否符合预期 [1, 2, 3]', () => {
    expect(Demo.methods.getData()).to.eql([1, 2, 3])
  })

  // 测试 addCount 方法是否 正常，这个没检查 render。所以可以不用 setTimeout done
  // destroyVM 的目的是不每次都销毁实例，不让改变的数据影响后面的测试
  it('# 测试 addCount 方法是否正常', () => {
    const vm = createTest(Demo, {}, true)
    let oldCount = vm.count
    vm.addCount()
    let newCount = vm.count
    expect(newCount).to.equal(oldCount + 1)
    destroyVM(vm)
  })

  it('# 测试 addCount 改变后 render 是否正常', (done) => {
    const vm = createTest(Demo, {}, true)
    let oldCount = vm.count
    // 触发方法，让count++
    vm.addCount()
    // 因为页面渲染不是同步，是promise，比setTimeout块，所以需要异步等待等渲染完成
    setTimeout(() => {
      // 获得页面渲染值
      let renderCount = Number(vm.$el.querySelector('.count').textContent)
      expect(renderCount).to.equal(oldCount + 1)
      done()
    }, 20)
  })

  it('# 测试 页面 click 触发 addCount 是否 正常', (done) => {
    const vm = createTest(Demo, {}, true)
    let oldCount = vm.count
    vm.$el.querySelector('#changeCount').click()
    // 判断 count 是否加1
    expect(vm.count).to.equal(oldCount + 1)
    // 因为页面渲染不是同步，是promise，比setTimeout块，所以需要异步等待等渲染完成
    setTimeout(() => {
      // 获得页面渲染值
      let renderCount = Number(vm.$el.querySelector('.count').textContent)
      expect(renderCount).to.equal(vm.count)
      destroyVM(vm)
      done()
    }, 20)
  })
})


```

#### 实例4

`filter.spec.js` 对 filters里面的过滤器进行测试

```javascript

/* eslint-env node, mocha */
import { createTest, destroyVM } from '../../util'
import Demo from '@/components/Demo'
/* global expect */
describe('# Demo组件 filters 测试', () => {
  it('# filters 是否有用 upperCase 函数 ', () => {
    expect(Demo.filters.upperCase).to.be.an('function')
  })

  it('# 测试 filters upperCase ，返回数据是否符合预期 字母变大写', () => {
    expect(Demo.filters.upperCase('a')).to.equal('A')
  })

  it('# 测试 页面 filters upperCase 是否 正常', (done) => {
    const vm = createTest(Demo, {}, true)
    // 因为页面渲染不是同步，是promise，比setTimeout块，所以需要异步等待等渲染完成
    setTimeout(() => {
      // 获得页面渲染值
      let upperCaseStr = vm.$el.querySelector('.upperCase').textContent
      expect(upperCaseStr).to.equal(vm.upper.toUpperCase())
      destroyVM(vm)
      done()
    }, 20)
  })
})


```
### 编写可测试的vue 组件/模块

我们想要测试的 vue组件/模块 中的 代码尽可能按照 **单一职责原则**，这种模式来开发，这样才方便测试，举例

详细实现可以查看  `vue-unit-test/src/pages/Home.vue`

伪代码：

```javascript

import dataApi from '@/api/data'
export default {
  name: 'api',
  created () {
    this.initData()
  },
  data () {
    return {
      webInfo: {}
    }
  },
  methods: {
    // 初始化数据
    async initData () {
      let webInfoData = await this.getWebInfo()
      this.setWebInfo(webInfoData)
    },
    // 获取数据 写 在一个方法上
    async getWebInfo () {
     let result = await dataApi.webInfo()
     return result.data
    },
    // 设置数据到 data 上。
    async setWebInfo (webInfo) {
      // 对 webInfo 进行相关数据校验
      // 设置数据到data上，然后vue自动渲染更新html
      this.webInfo = webInfo
    }
  }
}

```

1. 把获取后端的数据的功能提取到 `getWebInfo()` 上
2. 把设置data，然后render 提取到 `setWebInfo(webInfo)` 上

**这样我们在编写测试用例的时候即可利用我们的模拟数据**，调用 `setWebInfo(data)`，来检查我们 vue组件是否渲染正确。


下一章：[基于JSON-SCHEMA对后端api进行测试](doc/基于JSON-SCHEMA对后端api进行测试.md)


## 参考资料

多看别人怎么写测试用例，是最快的学习方法。

1. [elementUI测试用例](https://github.com/ElemeFE/element)
  > 推荐看 elementUI 框架库里面的各个组件测试代码，看了就懂要测试什么了。
2. [测试框架 Mocha 实例教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)
3. [Mocha测试框架](https://github.com/mochajs/mocha)
4. [karma测试框架](https://github.com/karma-runner/karma)
5. [chai](https://github.com/chaijs/chai)
6. [前端单元测试探索](https://segmentfault.com/a/1190000006933557)
7. [vue单元测试](https://cn.vuejs.org/v2/guide/unit-testing.html)
8. [Vue Test Utils](https://vue-test-utils.vuejs.org/zh-cn/)
9. 《JavaScript设计模式与开发实践》
