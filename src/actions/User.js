import keyMirror from 'utils/keyMirror'
import synapses from '../services/synapses'

export const UserConstants = keyMirror(
  {
    FETCH: null,
    FETCH_SUCCESS: null,
    FETCH_ERROR: null,
  },
  'USER'
)

export function fetchUser(address, unnamedUserMessage) {
  return async function(dispatch) {
    try {
      const user = await synapses.users.get(address)

      dispatch({
        type: UserConstants.FETCH_SUCCESS,
        user,
        unnamedUserMessage
      })
    } catch(error) {
      dispatch({ type: UserConstants.FETCH_ERROR, error })
    }
  }
}
