/*
 * @Author: mikey.zhaopeng
 * @Date: 2018-04-14 13:31:47
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-14 16:30:45
 */

/* eslint-env node, mocha */
import Demo from '@/components/Demo'
/* global expect */
describe('# Demo组件hook方法测试', () => {
  it('# 组件是否拥有 created 方法', () => {
    expect(Demo.created).to.be.an('function')
    console.log('this is new change')
    console.log('time is change ok')
    console.log('look like good')
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
