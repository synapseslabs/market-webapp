import { PublicationConstants } from '../actions/Publication'

const initialState = {
  ids: [],
  hideList: [],
  contractFound: true
}

export default function Publications(state = initialState, action = {}) {
    switch (action.type) {

      case PublicationConstants.FETCH_IDS_ERROR:
        return { ...state, ids: [], contractFound: action.contractFound }

      case PublicationConstants.FETCH_IDS_SUCCESS:
        return { ...state, ids: action.ids, hideList: action.hideList }

      default:
        return state
    }

}
