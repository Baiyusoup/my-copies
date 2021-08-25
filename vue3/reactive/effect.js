import { isArray, isMap } from "../shared"
import { createDep } from "./dep"

const targetMap = new WeakMap()

let shouldTrack = true

// 激活的副作用函数
let activeEffect


/**
 * 作用就是把当前激活的副作用函数activeEffect作为依赖，
 * 然后收集到target相关的depsMap对应的key下的依赖的集合dep中
 * @param {*} target 
 * @param {*} type 
 * @param {*} key 
 * @returns 
 */
export function track(target, type, key) {
  // 是否正在收集依赖中
  if (!isTracking()) {
    return
  }

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }

  if (!dep.has(activeEffect)) {
    // 所谓的依赖就是数据变化后执行的副作用函数
    // key ==> 相应的渲染函数
    // 收集当前激活的effect作为这个key的依赖
    dep.add(activeEffect)

    // 当前激活的effect收集dep集合作为依赖
    activeEffect && activeEffect.deps.push(dep)
  }

}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}


export function trigger(
  target,
  type,
  key,
  newValue,
  oldValue,
  oldTarget
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // 对于没有依赖的，直接返回
    return
  }

  const effects = new Set()
  const add = (effectToAdd) => {
    if (effectToAdd) {
      for(const effect of effectToAdd) {
        effects.add(effect)
      }
    }
  }

  if (key !== void 0) {
    add(depsMap.get(key))
  }

  const run = (effect) => {
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }

  effects.forEach(run)
}


const effectStack = []

export function effect(fn, options) {
  if (fn.effect) {
    // 如果fn已经是一个effect函数了，则指向原始函数
    fn = fn.effect.fn
  }
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    effect()
  }
  return effect
}

function createReactiveEffect(fn, options) {
  const effect = function createEffect(...args) {
    if (!effect.active) {
      // 非激活状态，则判断如果是非调度执行，则直接执行原始函数
      return options.scheduler ? undefined : fn(...args)
    }

    if(!effectStack.includes(effect)) {
      // 清空effect引用的依赖
      cleanup(effect)
      try {
        // 开启全局shouldTrack，允许依赖收集
        enableTracking()

        // 压栈
        effectStack.push(effect)
        activeEffect = effect

        return fn(...args)
      } finally {
        effectStack.pop()
        resetTracking()

        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }

  effect.id = uid++
  effect._is_effect = true
  effect.active = true
  effect.fn = fn
  effect.deps = []
  effect.options = options
  return effect
}

function cleanup(effect) {
  const { deps } = effect
  if (deps.length) {
    for(let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}