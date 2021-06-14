export type EventType = string | symbol;

// 事件监听函数类型
export type Handler<T = any> = (handler?: T) => void;
export type WildcardHandler = (eventType: EventType, handler?: any) => void;


// 事件监听函数列表
export type HandlerList = Array<Handler>;
export type WildcardHandlerList = Array<WildcardHandler>;

// 事件与监听函数的映射表
export type EventHandlerMap = Map<EventType, HandlerList|WildcardHandlerList>;

export declare class Emitter {
  events: EventHandlerMap;
  // 订阅函数
  on<T = any>(eventType: EventType, handler: Handler<T>): void;
  on(eventType: '*', handler: WildcardHandler): void;

  // 取消订阅函数
  off<T = any>(eventType: EventType, handler: Handler<T>): void;
  off(eventType: '*', handler: WildcardHandler): void;


  // 通知函数，需要判断通配符还是指定事件类型
  emit<T = any>(eventType: EventType, handler?: T): void;
  emit(eventType: EventType, handler?: any): void;
}

export default class EventEmitter {
  events: EventHandlerMap;
  constructor() {
    this.events = new Map();
  }

  on<T = any>(eventType: EventType, handler: Handler<T>) {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, []);
    }
    const handlers = this.events.get(eventType);
    handlers && handlers.push(handler);
  }

  off<T = any>(eventType: EventType, handler: Handler<T>) {
    if (!this.events.has(eventType)) { return; }
    const handlers = this.events.get(eventType);
    // 愉悦
    handlers && handlers.splice(handlers.indexOf(handler) >>> 0, 1);
  }

  emit<T = any>(eventType: EventType, evt: T) {
    ((this.events.get(eventType) || []) as HandlerList).slice().map( handler => { handler(evt); });
    ((this.events.get('*') || []) as WildcardHandlerList).slice().map( handler => { handler(eventType, evt); });
  }
}