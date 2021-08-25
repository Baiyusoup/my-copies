import { baseHandlers } from './baseHandlers'
import { isObject, toRawType } from '../shared/index'

const proxyMap = new WeakMap()
export const reactiveMap = new WeakMap()
function targetTypeMap(rawType) {
  switch(rawType) {
    case 'Object':
    case 'Array':
      return 1
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      // 集合数据类型
      return 2
    default:
      // 不能执行响应式的数据类型
      return 1
  }
}

function getTargetType(val) {
  return val.__v_skip || !Object.isExtensible(val)
    ? 0
    : targetTypeMap(toRawType(val))
}

export function reactive(target) {
  // 如果是一个readonly proxy的target，直接返回
  if (target && target.__v_isReadonly) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    baseHandlers,
    proxyMap
  )
}

function createReactiveObject(
  target,
  isReadonly,
  baseHandlers,
  proxyMap
) {
  if (!isObject(target)) {
    // reactive用于对象类型
    return target
  }

  if (
    target.__v_raw &&
    !(isReadonly && target.__v_is_reactive)
  ) {
    // 如果target已经是响应式了，直接返回
    return target
  }

  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    // 如果target存在相关的proxyMap
    return existingProxy
  }

  // 只有白名单里面的数据类型才能进行响应式
  const targetType = getTargetType(target)
  if (targetType === 1) {
    // 如果是不能proxy的数据类型，直接返回
    return target
  }

  const proxy = new Proxy(
    target,
    baseHandlers
  )

  proxyMap.set(target, proxy)
  return proxy
}


export function toRaw(observed) {
  const raw = observed && observed.__v_raw
  return raw ? toRaw(raw) : observed
}