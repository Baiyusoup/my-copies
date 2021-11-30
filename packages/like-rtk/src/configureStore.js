import { applyMiddleware, combineReducers, compose, createStore } from "../lib/redux";
import { getDefaultMiddleware } from "./getDefaultMiddleware";


export function configureStore(options) {
  const {
    reducer,
    middleware,
    preloadedState,
  } = options

  let rootReducer = combineReducers(reducer);

  let finalMiddleware = middleware || getDefaultMiddleware();

  const middlewareEnhance = applyMiddleware(...finalMiddleware)

  let storeEnhancers = [middlewareEnhance]

  return createStore(rootReducer, preloadedState, compose(...storeEnhancers))
} 