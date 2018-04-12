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
