import { vnode } from './vnode';
export function h(sel, data, c) {
  // 只接受三个参数
  if (arguments.length !== 3) {
    throw new Error('简易版h函数只接受三个参数')
  }
  if (typeof(c) === 'string' || typeof(c) === 'number') {
    // 先判断c是不是字符串
    return vnode(sel, data, undefined, undefined, c)
  } else if (Array.isArray(c)) {
    // 判断是不是数组
    // 遍历该数组，判断元素的对象类型
    let children = [];
    for (let i = 0; i < c.length; i++) {
      if (!(typeof(c[i]) === 'object' && c[i].hasOwnProperty('sel'))) {
        throw new Error('数组元素类型不合法')
      }
      children.push(c[i])
    }
    return vnode(sel, data, children, undefined, undefined);
  } else if (typeof(c) === 'object' && c.hasOwnProperty('sel')) {
    // 最后判断是不是一个对象，因为在第三种情况中，h函数已经调用返回一个vnode对象了
    // 因此我们要判断是不是一个有sel属性的object
    return vnode(sel, data, [c], undefined, undefined);
  }
}