import keyMirror from 'utils/keyMirror'
import synapses from '../services/synapses'

import { showAlert } from './Alert'

export const PublicationConstants = keyMirror(
  {
    FETCH_IDS: null,
    FETCH_IDS_SUCCESS: null,
    FETCH_IDS_ERROR: null
  },
  'LISTING'
)

export function getPublicationIds() {
  return async function(dispatch) {
    dispatch({ type: PublicationConstants.FETCH_IDS })

    let hideList = []
    const { web3, publicationsRegistryContract } = synapses.contractService
    const inProductionEnv =
      window.location.hostname === 'demo.originprotocol.com'

    try {
      let networkId = await web3.eth.net.getId()
      let contractFound = publicationsRegistryContract.networks[networkId]
      if (!contractFound) {
        dispatch({
          type: PublicationConstants.FETCH_IDS_ERROR,
          contractFound: false
        })
        return
      }

      if (inProductionEnv && networkId < 10) {
        let response = await fetch(
          `https://raw.githubusercontent.com/OriginProtocol/demo-dapp/hide_list/hidelist_${networkId}.json`
        )
        if (response.status === 200) {
          hideList = await response.json()
        }
      }

      const ids = await synapses.publications.allIds()
      const showIds = ids ? ids.filter(i => hideList.indexOf(i) < 0) : []

      dispatch({
        type: PublicationConstants.FETCH_IDS_SUCCESS,
        ids: showIds.reverse(),
        hideList
      })
    } catch (error) {
      dispatch(showAlert(error.message))
      dispatch({
        type: PublicationConstants.FETCH_IDS_ERROR,
        error: error.message
      })
    }
  }
}
