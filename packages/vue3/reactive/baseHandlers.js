import { hasChanged, hasOwn, isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive, reactiveMap, toRaw } from './reactive'

const get = createGetter()

function createGetter(isReadonly = false) {
  return function get(target, key, receiver) {
    if (key === '__v_is_reactive') {
      // 访问__v_is_reactive属性
      return !isReadonly
    } else if (key === '__v_is_readonly') {
      return isReadonly
    } else if (key === '__v_raw' && receiver === reactiveMap.get(target)) {
      return target
    }

    // 判断target是不是数组
    // TODO ...

    const res = Reflect.get(target, key, receiver)

    // 依赖收集
    if (!isReadonly) {
      track(target, 'get', key)
    }

    // 如果res，就是我们访问的target的那个属性是对象的话，需要递归处理一下
    // 这样相当于是一个延迟响应，app在启动的时候，不需要递归遍历data
    if (isObject(res)) {
      return reactive(res)
    }

    return res
  }
}

const set = createSetter()

function createSetter() {
  return function set(target, key, value, receiver) {
    let oldVal = target[key]
    value = toRaw(value)
    const hadKey = hasOwn(target, key)
    const result = Reflect.set(target, key, value, receiver)

    // 如果目标的原型链也是一个proxy，通过Reflect.set修改原型链上的属性会再次触发setter
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        // target上不存这个key
        trigger(target, 'add', key, value)
      } else if (hasChanged(value, oldVal)) {
        // 如果新值和旧值不一样的话，需要触发trigger
        trigger(target, 'set', key, value)
      }
    }

    return result
  }
}

export const mutableHandlers = {
  get,
  set,
}

