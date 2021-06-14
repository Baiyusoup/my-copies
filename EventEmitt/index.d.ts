declare class EventEmitter {
  private events: Map<string, Array<Function>>;
  static getInstance: () => EventEmitter;
  on: (eventType: string, handler: Function) => void;
  addListener: (eventType: string, handler: Function) => void;
  prependListener: (eventType: string, handler: Function) => void;
  off: (eventType: string, handler: Function) => void;
  removeListener: (eventType: string, handler: Function) => void;
  once: (eventType: string, handler: Function) => void;
  emit: (eventType: string, args: any[]) => void;
}