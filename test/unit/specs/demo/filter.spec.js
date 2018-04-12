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
