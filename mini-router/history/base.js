import { START } from "../utils/route";

export class History {
  constructor(router, base) {
    this.router = router;
    this.base = base;
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
  listen(cb) {
    this.cb = cb;
  }

  /**
   * 路由跳转
   * @param {*} location 
   * @param {*} onComplete 
   * @param {*} onAbort 
   */
  transitionTo(location, onComplete, onAbort) {
    let route = this.router.match(location, this.current);
    this.confirmTransition(
      route,
      () => {
        this.updateRoute(route);
        onComplete && onComplete();
      },
      err => {
        if (onAbort) {
          onAbort(err)
        }
      }
    )
  }

  /**
   * 确认跳转
   * @param {*} route 
   * @param {*} onComplete 
   * @param {*} onAbort 
   */
  confirmTransition(route, onComplete, onAbort) {
    // 在这里通过任务队列调度，实现钩子函数的执行
    onComplete()
  }

  updateRoute(route) {
    this.current = route
  }
}