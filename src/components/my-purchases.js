import React, { Component } from 'react'
import { connect } from 'react-redux'
import MyPurchaseCard from './my-purchase-card'
import { FormattedMessage } from 'react-intl'

import { storeWeb3Intent } from '../actions/App'
import synapses from '../services/synapses'
import web3 from '../services/web3';

class MyPurchases extends Component {
  constructor(props) {
    super(props)

    this.loadPublication = this.loadPublication.bind(this)
    this.loadPurchase = this.loadPurchase.bind(this)
    this.state = { filter: 'pending', purchases: [], loading: true }
  }

  componentDidMount() {
    if(!web3.givenProvider || !this.props.web3Account) {
      this.props.storeWeb3Intent('view your purchases')
    }
  }

  /*
  * WARNING: These functions don't actually return what they might imply.
  * They use return statements to chain together async calls. Oops.
  *
  * For now, we mock a getByPurchaserAddress request by fetching all
  * publications individually and fetching all related purchases individually.
  */

  async getPublicationIds() {
    try {
      const ids = await synapses.publications.allIds()

      return await Promise.all(ids.map(this.loadPublication))
    } catch(error) {
      console.error('Error fetching publication ids')
    }
  }

  async getPurchaseAddress(addr, i) {
    try {
      const purchAddr = await synapses.publications.purchaseAddressByIndex(addr, i)

      return this.loadPurchase(purchAddr)
    } catch(error) {
      console.error(`Error fetching purchase address at: ${i}`)
    }
  }

  async getPurchasesLength(addr) {
    try {
      const len = await synapses.publications.purchasesLength(addr)

      if (!len) {
        return len
      }

      return await Promise.all([...Array(len).keys()].map(i => this.getPurchaseAddress(addr, i)))
    } catch(error) {
      console.error(`Error fetching purchases length for publication: ${addr}`)
    }
  }

  async loadPublication(id) {
    try {
      const publication = await synapses.publications.getByIndex(id)

      return this.getPurchasesLength(publication.address)
    } catch(error) {
      console.error(`Error fetching contract or IPFS info for publicationId: ${id}`)
    }
  }

  async loadPurchase(addr) {
    try {
      const purchase = await synapses.purchases.get(addr)
      
      if (purchase.buyerAddress === this.props.web3Account) {
        const purchases = [...this.state.purchases, purchase]

        this.setState({ purchases })
      }

      return purchase
    } catch(error) {
      console.error(`Error fetching purchase: ${addr}`, error)
    }
  }

  async componentWillMount() {
    await this.getPublicationIds()

    this.setState({ loading: false })
  }

  render() {
    const { filter, loading, purchases } = this.state
    const filteredPurchases = (() => {
      switch(filter) {
        case 'pending':
          return purchases.filter(p => p.stage !== 'complete')
        case 'complete':
          return purchases.filter(p => p.stage === 'complete')
        default:
          return purchases
      }
    })()

    return (
      <div className="my-purchases-wrapper">
        <div className="container">
          {loading &&
            <div className="row">
              <div className="col-12 text-center">
                <h1>
                  <FormattedMessage
                    id={ 'my-purchases.loading' }
                    defaultMessage={ 'Loading...' }
                  />
                </h1>
              </div>
            </div>
          }  
          {!loading && !purchases.length &&
            <div className="row">
              <div className="col-12 text-center">
                <img src="images/empty-publications-graphic.svg"></img>
                <h1>
                  <FormattedMessage
                    id={ 'my-purchases.no-purchases' }
                    defaultMessage={ 'You haven’t bought anything yet.'}
                  />
                </h1>
                <p>
                  <FormattedMessage
                    id={ 'my-purchases.view-publications' }
                    defaultMessage={ 'Click below to view all publications.' }
                  />
                </p>
                <br />
                <a href="/" className="btn btn-lrg btn-primary">Browse Publications</a>
              </div>
            </div>
          }
          {!loading && !!purchases.length &&
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <h1>
                      <FormattedMessage
                        id={ 'my-purchases.myPurchasesHeading' }
                        defaultMessage={ 'My Purchases' }
                      />
                    </h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-3">  
                    <div className="filters list-group flex-row flex-md-column">
                      <a className={`list-group-item list-group-item-action${filter === 'pending' ? ' active' : ''}`}
                        onClick={() => this.setState({ filter: 'pending' })}>
                        <FormattedMessage
                          id={ 'my-purchases.pending' }
                          defaultMessage={ 'Pending' }
                        />
                      </a>
                      <a className={`list-group-item list-group-item-action${filter === 'complete' ? ' active' : ''}`}
                        onClick={() => this.setState({ filter: 'complete' })}>
                        <FormattedMessage
                          id={ 'my-purchases.complete' }
                          defaultMessage={ 'Complete' }
                        />
                      </a>
                      <a className={`list-group-item list-group-item-action${filter === 'all' ? ' active' : ''}`}
                        onClick={() => this.setState({ filter: 'all' })}>
                        <FormattedMessage
                          id={ 'my-purchases.all' }
                          defaultMessage={ 'All' }
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-12 col-md-9">
                    <div className="my-publications-list">
                      {filteredPurchases.map(p => <MyPurchaseCard key={`my-purchase-${p.address}`} purchase={p} />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>  
          } 
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    web3Account: state.app.web3.account,
    web3Intent: state.app.web3.intent,
  }
}

const mapDispatchToProps = dispatch => ({
  storeWeb3Intent: intent => dispatch(storeWeb3Intent(intent)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPurchases)
