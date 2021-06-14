export default class EventEmitter {
  events: Map<string, Array<Function>>;
  static instance: EventEmitter;

  private constructor() {
    this.events = new Map();
  }

  on(eventType: string, handler: Function) {
    // 判断该事件类型是否已经存在
    if (!this.events.has(eventType)) {
      this.events.set(eventType, []);
    }
    // 将该事件的监听函数保存起来
    const handlers = this.events.get(eventType) as Array<Function>;
    handlers.push(handler);
  }
  addListener(eventType: string, handler: Function) {
    this.on(eventType, handler);
  }

  prependListener(eventType: string, handler: Function) {
    // 判断该事件类型是否已经存在
    if (!this.events.has(eventType)) {
      this.events.set(eventType, []);
    }
    // 将该事件的监听函数保存起来
    const handlers = this.events.get(eventType) as Array<Function>;
    handlers.unshift(handler);
  }

  removeListener(eventType: string, handler: Function) {
    if (this.events.has(eventType)) {
      const handlers = this.events.get(eventType) as Array<Function>;
      for(let i = 0; i < handlers.length; i++) {
        if (handlers[i] === handler) {
          handlers.splice(i, 1);
          i--;
        }
      }
    }
  }
  off(eventType: string, handler: Function) {
    this.removeListener(eventType, handler);
  }

  once(eventType: string, handler: Function) {

  }

  emit(eventType: string, args: any[]) {
    if (this.events.has(eventType)) {
      const handlers = this.events.get(eventType) as Array<Function>;
      handlers.forEach(fn => fn.apply(undefined, args))
    }
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    return new EventEmitter();
  }
}