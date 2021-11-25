# 迷你前端路由
前端路由的实现原理是监听URL的变化，然后根据事先定义好的路由规则，显示相应的页面。

目前单页面应用使用的路由有两种实现方式：Hash模式和History模式

## VueRouter的执行流程
首先会使用Vue.use调用Router的install方法

instal方法里面会调用Router的init方法

init方法里面就是根据mode选择new HashHistory还是new HTML5History，得到一个history对象，然后调用history.transitionTo

transitionTo方法里面调用router.match方法，得到匹配的路由信息，然后调用confirmTransition(route, () => { 更新路由，添加hashchange监听 })

## Hash模式
URL后面#的值发生改变时，会触发hashchange事件，我们可以通过监听hashchange事件完成路由的跳转功能。

此外，除了监听hashchange事件外，还要监听load事件，因为第一次进入页面时并不会触发hashchange事件。因为load事件对象没有URL的相关属性，因此还需要借助location.hash来获取当前的hash路由


