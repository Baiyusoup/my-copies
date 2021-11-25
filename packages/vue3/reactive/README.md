## reactive的响应式原理

reactive API负责给引用值的数据类型进行响应式处理，具体使用方法如下：
```javascript
const data = reactive({
  name: 'hello'
})
```

这个API的具体就是先判断我们传入的对象是不是只读的，如果是只读的那么直接返回原对象。

（调用createReactive函数，并传入一些参数）然后判断这个对象是不是Object类型，如果不是的话，也是直接返回原对象。然后判断这个对象是不是响应式的对象，如果是的话，也直接返回。然后再判断这个对象是不是有对应proxyMap值，如果有的话，那么返回这个proxyMap值。然后再判断这个对象的数据类型是不是在白名单里面，如果不是的话，直接返回原对象。

经过前面的一系列的检查，终于知道这个target是可进行响应式的对象。然后通过proxy代理这个target，并把这个代理返回。

## baseHandler
proxy API的用法：
```javascript
const handler = {
  get: () => {},
  set: () => {}
}
new Proxy(obj, handler)
```

因此现在探求我们对target进行proxy时候所传入mutableHandler。

这个handler的get方法主要用于依赖的收集，而set方法主要是触发依赖。

### 依赖收集
