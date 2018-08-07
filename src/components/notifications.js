import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import Notification from './notification'

import synapses from '../services/synapses'

class Notifications extends Component {
  constructor(props) {
    super(props)

    this.state = { filter: 'all', notifications: [] }
  }

  async componentWillMount() {
    try {
      const notifications = await synapses.notifications.all()

      this.setState({ notifications })
    } catch(e) {
      console.error(e)
    }
  }

  render() {
    const { web3Account } = this.props
    const { filter, notifications } = this.state
    const notificationsWithPerspective = notifications.map(n => {
      const { sellerAddress } = n.resources.listing

      return {...n, perspective: web3Account === sellerAddress ? 'seller' : 'buyer' }
    })
    const filteredNotifications = filter === 'all' ? 
                                  notificationsWithPerspective :
                                  notificationsWithPerspective.filter(n => {
                                    return filter === 'unread' ? n.status === 'unread' : (n.perspective === filter)
                                  })

    return (
      <div className="notifications-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>
                <FormattedMessage
                  id={ 'notificationsComponent.notificationsHeading' }
                  defaultMessage={ 'Notifications' }
                />
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-3">
              <div className="filters list-group flex-row flex-md-column">
                <a className={`list-group-item list-group-item-action${filter === 'all' ? ' active' : ''}`} onClick={() => this.setState({ filter: 'all' })}>
                  <FormattedMessage
                    id={ 'notificationsComponent.all' }
                    defaultMessage={ 'All' }
                  />
                </a>
                <a className={`list-group-item list-group-item-action${filter === 'unread' ? ' active' : ''}`} onClick={() => this.setState({ filter: 'unread' })}>
                  <FormattedMessage
                    id={ 'notificationsComponent.unread' }
                    defaultMessage={ 'Unread' }
                  />
                </a>
                <a className={`list-group-item list-group-item-action${filter === 'buyer' ? ' active' : ''}`} onClick={() => this.setState({ filter: 'buyer' })}>
                  <FormattedMessage
                    id={ 'notificationsComponent.buying' }
                    defaultMessage={ 'Buying' }
                  />
                </a>
                <a className={`list-group-item list-group-item-action${filter === 'seller' ? ' active' : ''}`} onClick={() => this.setState({ filter: 'seller' })}>
                  <FormattedMessage
                    id={ 'notificationsComponent.selling' }
                    defaultMessage={ 'Selling' }
                  />
                </a>
              </div>
            </div>
            <div className="col-12 col-md-9">
              <div className="notifications-list">
                <ul className="list-group">
                  {filteredNotifications.map(n => <Notification key={`page-notification:${n.id}`} notification={n} />)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    web3Account: state.app.web3.account,
  }
}

export default connect(mapStateToProps)(Notifications)
