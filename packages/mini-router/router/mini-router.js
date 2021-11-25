/**
 * 流程
 * 1. MiniRouter类有一个路由匹配器matcher，
 */
import { createMatcher } from './create-matcher';
import { HashHistory } from '../history/hash';
import { HTML5History } from '../history/html5';

export class MiniRouter {
  constructor(options) {
    this.mode = options.mode;
    this.routes = options.routes;
    this.matcher = createMatcher(options.routes, this);

    switch(this.mode) {
      case 'history':
        this.history = new HTML5History(this, options.base);
        break;
      case 'hash':
        this.history = new HashHistory(this, options.base);
        break;
      default:
        console.log("无效的mode");
    }
  }

  match(raw, current) {
    return this.matcher.match(raw, current);
  }
  
  init() {
    // 设置hashchange监听
    const setupListeners = () => {
      this.history.setupListeners();
    }
    // 1. 调用history.transitionTo方法
    this.history.transitionTo(
      this.history.getCurrentLocation(),
      setupListeners,
      setupListeners
    )

    // 2. 设置回调
    this.history.listen(route => {
      // 给_route赋值，触发响应式
    })
  }
}