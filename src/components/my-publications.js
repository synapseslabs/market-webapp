import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import MyPublicationCard from './my-publication-card'

import { storeWeb3Intent } from '../actions/App'
import synapses from '../services/synapses'
import web3 from '../services/web3';

class MyPublications extends Component {
  constructor(props) {
    super(props)

    this.handleUpdate = this.handleUpdate.bind(this)
    this.loadPublication = this.loadPublication.bind(this)
    this.state = {
      filter: 'all',
      publications: [],
      loading: true,
    }
  }

  componentDidMount() {
    if(!web3.givenProvider || !this.props.web3Account) {
      this.props.storeWeb3Intent('view your publications')
    }
  }

  /*
  * WARNING: These functions don't actually return what they might imply.
  * They use return statements to chain together async calls. Oops.
  *
  * For now, we mock a getBySellerAddress request by fetching all
  * publications individually, filtering each by sellerAddress.
  */

  async getPublicationIds() {
    try {
      const ids = await synapses.publications.allIds()

      return await Promise.all(ids.map(this.loadPublication))
    } catch(error) {
      console.error('Error fetching publication ids')
    }
  }

  async loadPublication(id) {
    try {
      const publication = await synapses.publications.getByIndex(id)

      if (publication.sellerAddress === this.props.web3Account) {
        const publications = [...this.state.publications, publication]

        this.setState({ publications })
      }

      return publication
    } catch(error) {
      console.error(`Error fetching contract or IPFS info for publicationId: ${id}`)
    }
  }

  async componentWillMount() {
    await this.getPublicationIds()

    this.setState({ loading: false })
  }

  async handleUpdate(address) {
    try {
      const publication = await synapses.publications.get(address)
      const publications = [...this.state.publications]
      const index = publications.findIndex(l => l.address === address)

      publications[index] = publication

      this.setState({ publications })
    } catch(error) {
      console.error(`Error handling update for publication: ${address}`)
    }
  }

  render() {
    const { filter, publications, loading } = this.state
    const filteredPublications = (() => {
      switch(filter) {
        case 'active':
          return publications.filter(l => l.unitsAvailable)
        case 'inactive':
          return publications.filter(l => !l.unitsAvailable)
        default:
          return publications
      }
    })()

    return (
      <div className="my-publications-wrapper">
        <div className="container">
          {loading &&
            <div className="row">
              <div className="col-12 text-center">
                <h1>
                  <FormattedMessage
                    id={ 'my-publications.loading' }
                    defaultMessage={ 'Loading...' }
                  />
                </h1> 
              </div>
            </div>
          }  
          {!loading && !publications.length && 
            <div className="row">
              <div className="col-12 text-center">
                <img src="images/empty-publications-graphic.svg"></img>
                <h1>
                  <FormattedMessage
                    id={ 'my-publications.no-publications' }
                    defaultMessage={ 'You don\'t have any publications yet.' }
                  />
                </h1>
                <p>
                  <FormattedMessage
                    id={ 'my-publications.no-publications-steps' }
                    defaultMessage={ 'Follow the steps below to create your first publication!' }
                  />
                </p>
                <br />
                <br />
                <div className="row">
                  <div className="col-12 col-sm-4 col-lg-2 offset-lg-3 text-center">
                    <div className="numberCircle">
                      <h1 className="circle-text">
                        <FormattedMessage
                          id={ 'my-publications.number-one' }
                          defaultMessage={ '1' }
                        />
                      </h1>
                    </div>
                    <p>
                      <FormattedMessage
                        id={ 'my-publications.step-one' }
                        defaultMessage={ 'Choose the right category for your publication.' }
                      />
                    </p>
                  </div>
                  <div className="col-12 col-sm-4 col-lg-2 text-center">
                    <div className="numberCircle">
                      <h1 className="circle-text">
                        <FormattedMessage
                          id={ 'my-publications.number-two ' }
                          defaultMessage={ '2' }
                        />
                      </h1>
                    </div>
                    <p>
                      <FormattedMessage
                        id={ 'my-publications.step-two ' }
                        defaultMessage={ 'Give your publication a name, description, and price.' }
                      />
                    </p>
                  </div>
                  <div className="col-12 col-sm-4 col-lg-2 text-center">
                    <div className="numberCircle">
                      <h1 className="circle-text">
                        <FormattedMessage
                          id={ 'my-publications.number-three ' }
                          defaultMessage={ '3' }
                        />
                      </h1>
                    </div>
                    <p>
                      <FormattedMessage
                        id={ 'my-publications.step-three ' }
                        defaultMessage={ 'Preview your publication and publish it to the blockchain.' }
                      />
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center">
                    <br />
                    <br />
                    <a href="#/create" className="btn btn-lrg btn-primary btn-auto-width">
                      <FormattedMessage
                        id={ 'my-publications.create-publication' }
                        defaultMessage={ 'Create Your First Publication' }
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          }
          {!loading && !!publications.length &&
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <h1>
                      <FormattedMessage
                        id={ 'my-publications.myPublicationsHeading' }
                        defaultMessage={ 'My Publications' }
                      />
                    </h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-3"> 
                    <div className="filters list-group flex-row flex-md-column">
                      <a className={`list-group-item list-group-item-action${filter === 'all' ? ' active' : ''}`} onClick={() => this.setState({ filter: 'all' })}>
                        <FormattedMessage
                          id={ 'my-publications.all' }
                          defaultMessage={ 'All' }
                        />
                      </a>
                      <a className={`list-group-item list-group-item-action${filter === 'active' ? ' active' : ''}`} onClick={() => this.setState({ filter: 'active' })}>
                        <FormattedMessage
                          id={ 'my-publications.active' }
                          defaultMessage={ 'Active' }
                        />
                      </a>
                      <a className={`list-group-item list-group-item-action${filter === 'inactive' ? ' active' : ''}`} onClick={() => this.setState({ filter: 'inactive' })}>
                        <FormattedMessage
                          id={ 'my-publications.inactive' }
                          defaultMessage={ 'Inactive' }
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-12 col-md-9">
                    <div className="my-publications-list">
                      {filteredPublications.map(l => <MyPublicationCard key={`my-publication-${l.address}`} publication={l} handleUpdate={this.handleUpdate} />)}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyPublications)
