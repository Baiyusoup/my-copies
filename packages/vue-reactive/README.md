# vue的响应式原理

## vue2
1. 创建vue组件实例的时候，首先执行初始化，对data执行响应式处理，这个过程发生在Observe中
2. 同时对模板进行编译，找到其中动态绑定的数据，从data中获取并初始化视图，这个过程发生在Compile中
3. 同时定义一个更新函数和Watcher，将来对应数据变化时Watcher会调用更新视图
4. 由于data的某个key在一个视图中可能出现多次，所以每个key都需要一个Dep来管理多个Watcher
5. 将来data中数据一旦发生变化，会首先找到对应的Dep，通知所有Watcher执行更新函数


## vue3