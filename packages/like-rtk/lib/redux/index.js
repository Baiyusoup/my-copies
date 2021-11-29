/**
 * Redux API
 * 1. createStore
 * 2. combineReducers
 * 3. applyMiddleware
 * 4. compose
 */


export function createStore(reducer, preloadedState, enhancer) {
  let state;
  let listeners = [];

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, preloadedState)
  }
  
  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(cb => cb())
  }

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  // initial state
  dispatch(preloadedState || {})

  return { getState, dispatch, subscribe }
}

export function combineReducers(reducers) {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState
      },
      {}
    )
  }
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(
    (a, b) => (...args) => a(b(...args))
  )
}

export function applyMiddleware(...middlewares) {
  return (createStore) => {
    return (reducer, preloadedState) => {
      const store = createStore(reducer, preloadedState)
      let dispatch = () => {
        throw new Error('中间件需要重写自己的dispatch函数')
      }
      
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      }
      
      const chain = middlewares.map(middleware => middleware(middlewareAPI))
      dispatch = compose(...chain)(store.dispatch)
      
      return { ...store, dispatch }
    }
  }
}