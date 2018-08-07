import keyMirror from 'utils/keyMirror'
import synapses from '../services/synapses'

export const ProfileConstants = keyMirror(
  {
    FETCH: null,
    FETCH_SUCCESS: null,
    FETCH_ERROR: null,
    UPDATE: null,

    DEPLOY: null,
    DEPLOY_SUCCESS: null,
    DEPLOY_ERROR: null,
    DEPLOY_RESET: null,

    ADD_ATTESTATION: null
  },
  'PROFILE'
)

export function fetchProfile() {
  return async function(dispatch) {
    var user = await synapses.users.get(),
        wallet = await synapses.contractService.currentAccount()

    dispatch({
      type: ProfileConstants.FETCH_SUCCESS,
      user,
      wallet
    })
  }
}

export function updateProfile(data) {
  return { type: ProfileConstants.UPDATE, ...data }
}

export function addAttestation(attestation) {
  return { type: ProfileConstants.ADD_ATTESTATION, attestation }
}

export function deployProfile() {
  return async function(dispatch, getState) {
    dispatch({ type: ProfileConstants.DEPLOY })

    const {
      profile: { provisional, published }
    } = getState()

    let userData = {
      profile: {
        firstName: provisional.firstName,
        lastName: provisional.lastName,
        description: provisional.description,
        avatar: provisional.pic
      },
      attestations: []
    }

    if (!published.facebook && provisional.facebook) {
      userData.attestations.push(provisional.facebook)
    }

    if (!published.twitter && provisional.twitter) {
      userData.attestations.push(provisional.twitter)
    }

    if (!published.email && provisional.email) {
      userData.attestations.push(provisional.email)
    }

    if (!published.phone && provisional.phone) {
      userData.attestations.push(provisional.phone)
    }

    if (!published.airbnb && provisional.airbnb) {
      userData.attestations.push(provisional.airbnb)
    }

    try {
      var user = await synapses.users.set(userData)
      dispatch({ type: ProfileConstants.DEPLOY_SUCCESS, user })
    } catch(error) {
      dispatch({ type: ProfileConstants.DEPLOY_ERROR, error })
    }
  }
}

export function deployProfileReset() {
  return { type: ProfileConstants.DEPLOY_RESET }
}
