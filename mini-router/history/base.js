import { START } from "../utils/route";

export class History {
  constructor(router, base) {
    this.router = router;
    this.base = base;

    // 当前路由，刚开始是 { path: '/' }
    this.current = START;

    // 绑定的hashchange监听器
    this.listeners = [];
  }
  setupListeners() {
    throw new Error('Method not implemented.');
  }
  getCurrentLocation() {
    throw new Error('Method not implemented.');
  }
  ensureURL(push) {
    throw new Error('Method not implemented.');
  }

  listen(cb) {
    this.cb = cb;
  }

  // 路由跳转， 在VueRouter 进行init的时候会调用一次
  // init调用后，就会渲染首页，就是 { path: '/' }的组件, 同时监听hashchange事件(调用onComplete)
  // 之后每次调用transitionTo，只会调用更新路由和改变URL的方法，onComplete和onAbort都是空的
  transitionTo(location, onComplete, onAbort) {
    // location： string， onComplete/onAbort:Function|undefine

    let route = this.router.match(location, this.current);
    this.confirmTransition(
      route,
      () => {
        // 更新路由，触发响应式，渲染组件
        this.updateRoute(route);

        // 如果init阶段，这个函数就会执行，添加hashchange监听，就是调用子类的setupListener方法
        onComplete && onComplete();

        // 改变URL
        this.ensureURL();
      },
      err => {
        if (onAbort) {
          onAbort(err)
        }
      }
    )
  }

  // 确认跳转
  confirmTransition(route, onComplete, onAbort) {
    // 在这里通过任务队列调度，实现钩子函数的执行
    onComplete()
  }

  updateRoute(route) {
    // 更新当前路由
    this.current = route

    // 调用cb函数，给组件的_route赋值，触发响应式，渲染相应的组件
    this.cb && this.cb(route)
  }
}