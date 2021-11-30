import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  increment,
  decrement,
  incrementByAmount,
  selectCount
} from './counterSlice'

export function Counter() {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()
  const [incrementAmount, setIncrementAmount] = useState(2)
  return (
    <div>
      <input
        aria-label="Set increment amount"
        value={incrementAmount}
        onChange={e => setIncrementAmount(e.target.value)}
      />
      <button
        onClick={() => dispatch(increment())}
      >
        Add One
      </button>
      <button
        onClick={() => dispatch(decrement())}
      >
        Dec One
      </button>
      <button
        onClick={() => dispatch(incrementByAmount(Number(incrementAmount) || 0))}
      >
        Add Amount
      </button>
      {/* <button
        onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
      >
        Add Async
      </button> */}
      <div>current count: { count }</div>
    </div>
  )
}