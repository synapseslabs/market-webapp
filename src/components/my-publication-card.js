import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import { FormattedMessage, FormattedNumber, defineMessages, injectIntl } from 'react-intl'

import { translatePublicationCategory } from '../utils/translationUtils'

import synapses from '../services/synapses'
import web3 from '../services/web3';

class MyPublicationCard extends Component {
  constructor(props) {
    super(props)

    this.intlMessages = defineMessages({
      confirmClosePublication: {
        id: 'my-publication-card.confirmClosePublication',
        defaultMessage: 'Are you sure that you want to permanently close this publication? This cannot be undone.'
      },
      ETH: {
        id: 'my-publication-card.ethereumCurrencyAbbrev',
        defaultMessage: 'ETH'
      }
    })

    this.closePublication = this.closePublication.bind(this)
  }

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip()
  }

  async closePublication() {
    const { address } = this.props.publication
    const prompt = window.confirm(this.props.intl.formatMessage(this.intlMessages.confirmClosePublication))

    if (!prompt) {
      return null
    }

    try {
      const transaction = await synapses.publications.close(address)
      console.log(transaction)
      await transaction.whenFinished()
      // why is this delay often required???
      setTimeout(() => {
        this.props.handleUpdate(address)
      }, 1000)
    } catch(error) {
      console.error(`Error closing publication ${address}`)
    }
  }

  render() {
    const { address, category, /*createdAt, */name, pictures, price, unitsAvailable } = translatePublicationCategory(this.props.publication)
    /*
     *  Micah 4/23/2018
     *  ~~~~~~~~~~~~~~~
     *  synapses.publications.close sets unitsAvailable to 0.
     *  There is no distinction between active/inactive, sold out, or closed.
     *  These states should be considered as editing is explored.
     *  There are no denormalized "transaction completed" or "transaction in progress" counts.
     */
    const status = parseInt(unitsAvailable) > 0 ? 'active' : 'inactive'
    // const timestamp = `Created on ${moment(createdAt).format('MMMM D, YYYY')}`
    const photo = pictures && pictures.length > 0 && (new URL(pictures[0])).protocol === "data:" && pictures[0]

    return (
      <div className="purchase card">
        <div className="card-body d-flex flex-column flex-lg-row">
          <div className="aspect-ratio">
            <div className={`${photo ? '' : 'placeholder '}image-container d-flex justify-content-center`}>
              <img src={photo || 'images/default-image.svg'} role="presentation" />
            </div>
          </div>
          <div className="content-container d-flex flex-column">
            <span className={`status ${status}`}>{status}</span>
            <p className="category">{category}</p>
            <h2 className="title text-truncate"><Link to={`/publication/${address}`}>{name}</Link></h2>
            {/*<p className="timestamp">{timestamp}</p>*/}
            <p className="price">
              {`${Number(price).toLocaleString(undefined, { minimumFractionDigits: 3 })} ETH`}
              {!parseInt(unitsAvailable) /*<= quantity*/ && 
                <span className="badge badge-info">
                  <FormattedMessage
                    id={ 'my-publication-card.soldOut' }
                    defaultMessage={ 'Sold Out' }
                  />
                </span>
              }
            </p>
            <div className="d-flex counts">
              <p>
                <FormattedMessage
                  id={ 'my-publication-card.totalQuantity' }
                  defaultMessage={ 'Total Quantity : {quantity}' }
                  values={{ quantity: <FormattedNumber value={unitsAvailable} /> }}
                />
              </p>
              {/*<p>Total Remaining: {(unitsAvailable - quantity).toLocaleString()}</p>*/}
            </div>
            <div className="d-flex counts">
              {/*<p>{Number(2).toLocaleString()} Pending Transactions</p>*/}
              {/*<p>{Number(3).toLocaleString()} Completed Transactions</p>*/}
            </div>
            <div className="actions d-flex">
              <div className="links-container">
                {/*<a onClick={() => alert('To Do')}>Edit</a>*/}
                {/*!active && <a onClick={() => alert('To Do')}>Enable</a>*/}
                {/*active && <a onClick={() => alert('To Do')}>Disable</a>*/}
                {!!parseInt(unitsAvailable) && 
                  <a className="warning" onClick={this.closePublication}>
                    <FormattedMessage
                      id={ 'my-publication-card.closePublication' }
                      defaultMessage={ 'Close Publication' }
                    />
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(MyPublicationCard)
