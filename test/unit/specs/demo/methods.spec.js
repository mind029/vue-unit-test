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
