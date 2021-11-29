import { createContext } from 'react'
const ReactReduxContext  = createContext(null)

export function Provide({ store, children }) {
  return (
    <ReactReduxContext.Provider value={store}>
      {children}
    </ReactReduxContext.Provider>
  )
}