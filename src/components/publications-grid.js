import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import { getPublicationIds } from '../actions/Publication'

import Pagination from 'react-js-pagination'
import { withRouter } from 'react-router'

import PublicationCard from './publication-card'

class PublicationsGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      publicationsPerPage: 12
    }
  }

  componentWillMount() {
    this.props.getPublicationIds()
  }

  render() {
    const { publicationsPerPage } = this.state
    const { contractFound, publicationIds, hideList } = this.props
    const pinnedPublicationIds = [0, 1, 2, 3, 4]
    const activePage = this.props.match.params.activePage || 1
    const arrangedPublicationIds = [...pinnedPublicationIds, ...publicationIds.filter(id => !pinnedPublicationIds.includes(id))]
    // Calc publications to show for given page
    const showPublicationsIds = arrangedPublicationIds.slice(
      publicationsPerPage * (activePage - 1),
      publicationsPerPage * activePage
    )

    return (
      <div className="publications-wrapper">
        {contractFound === false && (
          <div className="publications-grid">
            <div className="alert alert-warning" role="alert">
              <FormattedMessage
                id={ 'publications-grid.originContractNotFound' }
                defaultMessage={ 'The Origin Contract was not found on this network.' }
              />
              <br />
              <FormattedMessage
                id={ 'publications-grid.changeNetworks' }
                defaultMessage={ 'You may need to change networks, or deploy the contract.' }
              />
            </div>
          </div>
        )}
        {contractFound && (
          <div className="publications-grid">
            {publicationIds.length > 0 && 
              <h1>
                <FormattedMessage
                  id={ 'publications-grid.publicationsCount' }
                  defaultMessage={ '{publicationIdsCount} Publications' }
                  values={{ publicationIdsCount: <FormattedNumber value={ publicationIds.length } /> }}
                />
              </h1>
            }
            <div className="row">
              {showPublicationsIds.map(publicationId => (
                <PublicationCard publicationId={publicationId} key={publicationId} hideList={hideList} />
              ))}
            </div>
            <Pagination
              activePage={parseInt(activePage)}
              itemsCountPerPage={publicationsPerPage}
              totalItemsCount={arrangedPublicationIds.length}
              pageRangeDisplayed={5}
              onChange={page => this.props.history.push(`/page/${page}`)}
              itemClass="page-item"
              linkClass="page-link"
              hideDisabled="true"
            />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  publicationIds: state.publications.ids,
  hideList: state.publications.hideList,
  contractFound: state.publications.contractFound
})

const mapDispatchToProps = dispatch => ({
  getPublicationIds: () => dispatch(getPublicationIds())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PublicationsGrid))
