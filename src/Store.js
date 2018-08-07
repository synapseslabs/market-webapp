import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers } from 'redux'

import publications from './reducers/Publications'
import profile from './reducers/Profile'
import wallet from './reducers/Wallet'
import alert from './reducers/Alert'
import users from './reducers/Users'
import app from './reducers/App'

let middlewares = [thunkMiddleware]

if (process.env.NODE_ENV !== 'production') {
  const { logger } = require(`redux-logger`)
  middlewares.push(logger)
}

const store = createStore(
  combineReducers({
    publications,
    profile,
    wallet,
    alert,
    users,
    app,
  }),
  applyMiddleware(...middlewares)
)

export default store
