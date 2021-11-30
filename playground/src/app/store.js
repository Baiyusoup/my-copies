import { configureStore } from 'like-rtk'
import counterSlice from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterSlice
  }
})