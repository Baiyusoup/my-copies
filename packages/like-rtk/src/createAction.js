export function createAction(type, prepareAction) {
  // const prepare = prepareAction || ((arg) => arg)
  // return (payload) => {
  //   return {
  //     type,
  //     payload: prepare(payload)
  //   }
  // }

  function actionCreator(...args) {
    if (prepareAction) {
      let prepared = prepareAction(...args)
      if (!prepared) {
        throw new Error('prepareAction必须有返回值')
      }

      return {
        type,
        payload: prepared.payload
      }
    }

    return { type, payload: args[0] }
  }

  actionCreator.toString = () => `${type}`

  actionCreator.type = type

  actionCreator.match = (action) => action.type === type

  return actionCreator
}