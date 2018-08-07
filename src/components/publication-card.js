import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { translatePublicationCategory } from '../utils/translationUtils'

// temporary - we should be getting an synapses instance from our app,
// not using a global singleton
import synapses from '../services/synapses'

import PublicationCardPrices from './publication-card-prices';

class PublicationCard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      shouldRender: true
    }
  }

  async componentDidMount() {
    try {
      const publication = await synapses.publications.getByIndex(this.props.publicationId)
      const translatedPublication = translatePublicationCategory(publication)
      if (!this.props.hideList.includes(translatedPublication.address)) {
        const obj = Object.assign({}, translatedPublication, { loading: false })

        this.setState(obj)
      } else {
        this.setState({ shouldRender: false })
      }
    } catch (error) {
      console.error(`Error fetching contract or IPFS info for publicationId: ${this.props.publicationId}`)
    }
  }

  render() {
    const { address, category, loading, name, pictures, price, unitsAvailable, shouldRender } = this.state
    const photo = pictures && pictures.length && (new URL(pictures[0])).protocol === "data:" && pictures[0]

    if (!shouldRender) return false

    return (
      <div className={`col-12 col-md-6 col-lg-4 publication-card${loading ? ' loading' : ''}`}>
        <Link to={`/publication/${address}`}>
          {!!photo &&
            <div className="photo" style={{ backgroundImage: `url("${photo}")` }}></div>
          }
          {!photo &&
            <div className="image-container d-flex justify-content-center">
              <img src="images/default-image.svg" alt="camera icon" />
            </div>
          }
          <div className="category placehold d-flex justify-content-between">
            <div>{category}</div>
            {!loading &&
              <div>
                {this.props.publicationId < 5 &&
                  <span className="featured badge">
                    <FormattedMessage
                      id={ 'publication-card.featured' }
                      defaultMessage={ 'Featured' }
                    />
                  </span>
                }
              </div>
            }
          </div>
          <h2 className="title placehold text-truncate">{name}</h2>
          {price > 0 && <PublicationCardPrices price={price} unitsAvailable={unitsAvailable} />}
        </Link>
      </div>
    )
  }
}

export default PublicationCard
