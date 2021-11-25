export type EventType = string | symbol;

// 事件监听函数类型
export type Listener<T = any> = (event?: T) => void;
export type WildcardListener = (type: EventType, event?: any) => void;


// 事件监听函数列表
export type ListenerList = Array<Listener>;
export type WildcardListenerList = Array<WildcardListener>;

// 事件与监听函数的映射表
export type EventListenerMap = Map<EventType, ListenerList | WildcardListenerList>;

export declare class Emitter {
  _events: EventListenerMap;
  // 订阅函数
  on<T = any>(type: EventType, listener: Listener<T>): void;
  on(type: '*', listener: WildcardListener): void;

  prependListener<T = any>(type: EventType, listener: Listener<T>): void;
  prependListener(type: '*', listener: WildcardListener): void;

  /**
   * 临时订阅函数
   * @param type 事件类型
   * @param listener 订阅对象函数
   */
  once<T = any>(type: EventType, listener: Listener<T>): void;
  once(type: '*', listener: WildcardListener): void;


  /**
   * 退订函数
   * @param type 事件类型
   * @param listener 退订对象函数
   */
  off<T = any>(type: EventType, listener: Listener<T>): void;
  off(type: '*', listener: WildcardListener): void;

  /**
   * 取消所有订阅
   */
  clear(): void;


  /**
   * 事件发布函数
   * @param type 事件类型
   * @param event 订阅函数参数
   */
  emit<T = any>(type: EventType, event?: T): void;
  emit(type: '*', event?: any): void;
}

export default class EventEmitter {
  private _events: EventListenerMap;
  constructor() {
    this._events = new Map();
  }

  on<T = any>(type: EventType, listener: Listener<T> | WildcardListener) {
    _addListener(this._events, type, listener, false);
  }

  prependListener<T = any>(type: EventType, listener: Listener<T>) {
    _addListener(this._events, type, listener, true);
  }

  once<T = any>(type: EventType, listener: Listener<T>) {
    this.on(type, _onceWrap(this, type, listener));
  }

  off<T = any>(type: EventType, listener: Listener<T>) {
    const list = this._events.get(type);
    if(typeof list !== 'undefined') {
      list.splice(list.indexOf(listener) >>> 0, 1);
    }
  }

  emit<T = any>(type: EventType, event?: T) {
    ((this._events.get(type) || []) as ListenerList).slice().map(listener => { listener(event); });
    ((this._events.get('*') || []) as WildcardListenerList).slice().map(listener => { listener(type, event); });
  }

  clear() {
    this._events.clear();
  }
}

function _addListener<T = any>(
  events: EventListenerMap,
  type: EventType,
  listener: Listener<T> | WildcardListener,
  prepend: boolean
): void {
  const existing = events.get(type);
  if (typeof existing === 'undefined') {
    events.set(type, [listener])
  } else if (prepend) {
    // 新的订阅函数优先级高
    existing.unshift(listener);
  } else {
    existing.push(listener);
  }
}

function _onceWrap<T = any>(
  target: EventEmitter,
  type: EventType,
  listener: Listener<T>
): Listener<T> {
  let fired = false;
  let wrapFn = function(event?: T) {
    if (!fired) {
      target.off(type, wrapFn);
      fired = true;
      listener.call(target, event);
    }
  }
  return wrapFn;
}