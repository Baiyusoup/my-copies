import thunkMiddleware from 'redux-thunk'

export function getDefaultMiddleware(options) {
  // let {
  //   thunk = true,
  // } = options
  const thunk = true

  let middlewareArray = []

  if (thunk) {
    if (typeof thunk === 'boolean') {
      middlewareArray.push(thunkMiddleware)
    } else {
      middlewareArray.push(
        thunkMiddleware.withExtraArgument(thunk.extraArgument)
      )
    }
  }

  return middlewareArray
}