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
