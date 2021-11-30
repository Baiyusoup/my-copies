import { createAction } from "./createAction"
import { createReducer } from "./createReducer"

function getType(name, reducerName) {
  return `${name}/${reducerName}`
}

export function createSlice(options) {
  const {
    name,
    initialState,
    reducers = {},
    extraReducers = {}
  } = options;

  const reducerNames = Object.keys(reducers);

  const sliceCaseReducersByName = {}
  const sliceCaseReducersByType = {}
  const actionCreators = {}


  reducerNames.forEach((reducerName) => {
    const maybeReducerWithPrepare = reducers[reducerName]
    const type = getType(name, reducerName)

    let caseReducer;
    let prepareCallback;

    if ('reducer' in maybeReducerWithPrepare) {
      caseReducer = maybeReducerWithPrepare.reducer
      prepareCallback = maybeReducerWithPrepare.prepare
    } else {
      caseReducer = maybeReducerWithPrepare
    }

    sliceCaseReducersByName[reducerName] = caseReducer
    sliceCaseReducersByType[type] = caseReducer
    actionCreators[reducerName] = prepareCallback
      ? createAction(type, prepareCallback)
      : createAction(type);
  })
  
  const finalCaseReducers = { ...extraReducers, ...sliceCaseReducersByType }
  const reducer = createReducer(
    initialState,
    finalCaseReducers
  )

  return {
    name,
    reducer,
    actions: actionCreators,
    caseReducer: sliceCaseReducersByName
  }
    

  // Object.keys(reducers).forEach(key => {
  //   const type = `${name}/${key}`
  //   action[key] = (payload) => ({ type, payload })
  //   reducer[type] = reducers[key]

  //   caseReducers[type] = reducers[key]
  // })

  // Object.keys(extraReducers).forEach(key => {
  //   const type = `${name}/${key}`
  //   reducer[type] = reducers[key]
  // })

  // return {
  //   name,
  //   reducer,
  //   action,
  //   caseReducers
  // }
}