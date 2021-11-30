import createNextState, { isDraft, isDraftable } from 'immer'

export function createReducer(initialState, actionMap) {

  const frozenInitialState = createNextState(initialState, () => {})

  return function(state = frozenInitialState, action) {
    const prevState = state
    let caseReducer = actionMap[action.type]

    if (caseReducer) {
      if (isDraft(prevState)) {
        const draft = prevState
        const result = caseReducer(draft, action)
        if (typeof result === 'undefined') {
          return prevState
        }

        return result
      } else if (!isDraftable(prevState)) {
        const result = caseReducer(prevState, action)
        if (typeof result === 'undefined') {
          if (prevState === null) {
            return prevState
          }
          throw Error('case reducer不能有返回值！')
        }
        return result
      } else {
        return createNextState(prevState, (draft) => caseReducer(draft, action))
      }
    }
    return prevState
  }

  // return (state = initialState, action) => {
  //   const reducer = finalCaseReducers[action.type]
  //   const newState = reducer(state, action)
  //   return newState
  // }
}