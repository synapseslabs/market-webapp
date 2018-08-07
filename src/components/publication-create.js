import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import { translateSchema } from '../utils/translationUtils'
import synapses from '../services/synapses'
import getCurrentProvider from '../utils/getCurrentProvider'

import { showAlert } from '../actions/Alert'

import PublicationDetail from './publication-detail'
import Form from 'react-jsonschema-form'
import Modal from './modal'

class PublicationCreate extends Component {

  constructor(props) {
    super(props)

    // This is non-ideal fix until IPFS can correctly return 443 errors
    // Server limit is 2MB, with 100K safety buffer
    this.MAX_UPLOAD_BYTES = (2e6 - 1e5)

    // Enum of our states
    this.STEP = {
      PICK_SCHEMA: 1,
      DETAILS: 2,
      PREVIEW: 3,
      METAMASK: 4,
      PROCESSING: 5,
      SUCCESS: 6,
      ERROR: 7
    }

    const schemaTypeLabels = defineMessages({
      forSale: {
        id: 'publication-create.forSaleLabel',
        defaultMessage: 'For Sale'
      },
      housing: {
        id: 'publication-create.housingLabel',
        defaultMessage: 'Housing'
      },
      transportation: {
        id: 'publication-create.transportation',
        defaultMessage: 'Transportation'
      },
      tickets: {
        id: 'publication-create.tickets',
        defaultMessage: 'Tickets'
      },
      services: {
        id: 'publication-create.services',
        defaultMessage: 'Services'
      },
      announcements: {
        id: 'publication-create.announcements',
        defaultMessage: 'Announcements'
      }
    })

    this.schemaList = [
      {type: 'for-sale', name: props.intl.formatMessage(schemaTypeLabels.forSale), 'img': 'for-sale.jpg'},
      {type: 'housing', name: props.intl.formatMessage(schemaTypeLabels.housing), 'img': 'housing.jpg'},
      {type: 'transportation', name: props.intl.formatMessage(schemaTypeLabels.transportation), 'img': 'transportation.jpg'},
      {type: 'tickets', name: props.intl.formatMessage(schemaTypeLabels.tickets), 'img': 'tickets.jpg'},
      {type: 'services', name: props.intl.formatMessage(schemaTypeLabels.services), 'img': 'services.jpg'},
      {type: 'announcements', name: props.intl.formatMessage(schemaTypeLabels.announcements), 'img': 'announcements.jpg'},
    ]

    this.state = {
      step: this.STEP.PICK_SCHEMA,
      selectedSchemaType: this.schemaList[0],
      selectedSchema: null,
      schemaFetched: false,
      formPublication: {formData: null},
      currentProvider: getCurrentProvider(synapses && synapses.contractService && synapses.contractService.web3)
    }

    this.handleSchemaSelection = this.handleSchemaSelection.bind(this)
    this.onDetailsEntered = this.onDetailsEntered.bind(this)
  }

  handleSchemaSelection() {
    fetch(`schemas/${this.state.selectedSchemaType}.json`)
    .then((response) => response.json())
    .then((schemaJson) => {
      this.setState({
        selectedSchema: schemaJson,
        schemaFetched: true,
        step: this.STEP.DETAILS
      })
      window.scrollTo(0, 0)
    })
  }

  onDetailsEntered(formPublication) {
    // Helper function to approximate size of object in bytes
    function roughSizeOfObject( object ) {
      var objectList = []
      var stack = [object]
      var bytes = 0
      while (stack.length) {
        var value = stack.pop()
        if (typeof value === 'boolean') {
          bytes += 4
        } else if (typeof value === 'string') {
          bytes += value.length * 2
        } else if (typeof value === 'number') {
          bytes += 8
        }
        else if (typeof value === 'object'
          && objectList.indexOf(value) === -1)
        {
          objectList.push(value)
          for (var i in value) {
            if (value.hasOwnProperty(i)) {
              stack.push(value[i])
            }
          }
        }
      }
      return bytes
    }
    if (roughSizeOfObject(formPublication.formData) > this.MAX_UPLOAD_BYTES) {
      this.props.showAlert("Your publication is too large. Consider using fewer or smaller photos.")
    } else {
      this.setState({
        formPublication: formPublication,
        step: this.STEP.PREVIEW
      })
      window.scrollTo(0, 0)
    }
  }

  async onSubmitPublication(formPublication, selectedSchemaType) {
    try {
      console.log(formPublication)
      this.setState({ step: this.STEP.METAMASK })
      const transactionReceipt = await synapses.publications.create(formPublication.formData, selectedSchemaType)
      this.setState({ step: this.STEP.PROCESSING })
      // Submitted to blockchain, now wait for confirmation
      await synapses.contractService.waitTransactionFinished(transactionReceipt.transactionHash)
      this.setState({ step: this.STEP.SUCCESS })
    } catch (error) {
      console.error(error)
      this.setState({ step: this.STEP.ERROR })
    }
  }

  resetToPreview() {
    this.setState({ step: this.STEP.PREVIEW })
  }

  render() {
    const { selectedSchema } = this.state
    const enumeratedPrice = selectedSchema && selectedSchema.properties['price'].enum
    const priceHidden = enumeratedPrice && enumeratedPrice.length === 1 && enumeratedPrice[0] === 0

    return (
      <div className="container publication-form">
        { this.state.step === this.STEP.PICK_SCHEMA &&
          <div className="step-container pick-schema">
            <div className="row flex-sm-row-reverse">
             <div className="col-md-5 offset-md-2">
                <div className="info-box">
                  <h2>
                    <FormattedMessage
                      id={ 'publication-create.chooseSchema' }
                      defaultMessage={ 'Choose a schema for your product or service' }
                    />
                  </h2>
                  <p>
                    <FormattedMessage
                      id={ 'publication-create.schemaExplainer' }
                      defaultMessage={ 'Your product or service will use a schema to describe its attributes like name, description, and price. Origin already has multiple schemas that map to well-known categories of publications like housing, auto, and services.' }
                    />
                  </p>
                  <div className="info-box-image"><img className="d-none d-md-block" src="images/features-graphic.svg" role="presentation" /></div>
                </div>
              </div>

              <div className="col-md-5">
                <label>
                  <FormattedMessage
                    id={ 'publication-create.stepNumberLabel' }
                    defaultMessage={ 'STEP {stepNumber}' }
                    values={{ stepNumber: Number(this.state.step) }}
                  />
                </label>
                <h2>
                  <FormattedMessage
                    id={ 'publication-create.whatTypeOfPublication' }
                    defaultMessage={ 'What type of publication do you want to create?' }
                  />
                </h2>
                <div className="schema-options">
                  {this.schemaList.map(schema => (
                    <div
                      className={
                        this.state.selectedSchemaType === schema.type ?
                        'schema-selection selected' : 'schema-selection'
                      }
                      key={schema.type}
                      onClick={() => this.setState({selectedSchemaType:schema.type})}
                    >
                      {schema.name}
                    </div>
                  ))}
                </div>
                <div className="btn-container">
                  <button className="float-right btn btn-primary" onClick={() => this.handleSchemaSelection()}>
                    <FormattedMessage
                      id={ 'publication-create.next' }
                      defaultMessage={ 'Next' }
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
        { this.state.step === this.STEP.DETAILS &&
          <div className="step-container schema-details">
            <div className="row flex-sm-row-reverse">
               <div className="col-md-5 offset-md-2">
                  <div className="info-box">
                    <div>
                      <h2>
                        <FormattedMessage
                          id={ 'publication-create.howItWorksHeading' }
                          defaultMessage={ 'How it works' }
                        />
                      </h2>
                      <FormattedMessage
                        id={ 'publication-create.howItWorksContentPart1' }
                        defaultMessage={ 'Origin uses a Mozilla project called {jsonSchemaLink}  to validate your publication according to standard rules. This standardization is key to allowing unaffiliated entities to read and write to the same data layer.' }
                        values={{ 
                          jsonSchemaLink: <FormattedMessage id={ 'publication-create.jsonSchema' } defaultMessage={ 'JSONSchema' } />
                        }}
                      />
                      <br/><br/>
                      <FormattedMessage
                        id={ 'publication-create.howItWorksContentPart2' }
                        defaultMessage={ 'Be sure to give your publication an appropriate title and description that will inform others as to what you’re offering.' }
                        values={{ 
                          jsonSchemaLink: <FormattedMessage id={ 'publication-create.jsonSchema' } defaultMessage={ 'JSONSchema' } />
                        }}
                      />
                      <a href={`schemas/${this.state.selectedSchemaType}.json`} target="_blank">
                        <FormattedMessage
                          id={ 'publication-create.viewSchemaLinkLabel' }
                          defaultMessage={ 'View the {schemaName} schema' }
                          values={{ 
                            schemaName: <code>{this.state.selectedSchema.name}</code>
                          }}
                        />
                      </a>
                    </div>
                    <div className="info-box-image"><img className="d-none d-md-block" src="images/features-graphic.svg" role="presentation" /></div>
                  </div>
                </div>
              <div className="col-md-5">
                <label>
                  <FormattedMessage
                    id={ 'publication-create.stepNumberLabel' }
                    defaultMessage={ 'STEP {stepNumber}' }
                    values={{ stepNumber: Number(this.state.step) }}
                  />
                </label>
                <h2>
                  <FormattedMessage
                    id={ 'publication-create.createPublicationHeading' }
                    defaultMessage={ 'Create your publication' }
                  />
                </h2>
                <Form
                  schema={translateSchema(this.state.selectedSchema, this.state.selectedSchemaType)}
                  onSubmit={this.onDetailsEntered}
                  formData={this.state.formPublication.formData}
                  onError={(errors) => console.log(`react-jsonschema-form errors: ${errors.length}`)}
                  uiSchema={priceHidden ? { price: { 'ui:widget': 'hidden' } } : undefined}
                >
                  <div className="btn-container">
                    <button type="button" className="btn btn-other" onClick={() => this.setState({step: this.STEP.PICK_SCHEMA})}>
                      <FormattedMessage
                        id={ 'backButtonLabel' }
                        defaultMessage={ 'Back' }
                      />
                    </button>
                    <button type="submit" className="float-right btn btn-primary">
                      <FormattedMessage
                        id={ 'continueButtonLabel' }
                        defaultMessage={ 'Continue' }
                      />
                    </button>
                  </div>
                </Form>

              </div>
              <div className="col-md-6">
              </div>
            </div>
          </div>
        }
        { (this.state.step >= this.STEP.PREVIEW) &&
          <div className="step-container publication-preview">
            {this.state.step === this.STEP.METAMASK &&
              <Modal backdrop="static" isOpen={true}>
                <div className="image-container">
                  <img src="images/spinner-animation.svg" role="presentation"/>
                </div>
                <FormattedMessage
                  id={ 'publication-create.confirmTransaction' }
                  defaultMessage={ 'Confirm transaction' }
                />
                <br />
                <FormattedMessage
                  id={ 'publication-create.pressSubmitInMetaMask' }
                  defaultMessage={ 'Press {submit} in {currentProvider} window' }
                  values={{
                    currentProvider: this.state.currentProvider,
                    submit: <span>&ldquo;Submit&rdquo;</span>,
                  }}
                />
              </Modal>
            }
            {this.state.step === this.STEP.PROCESSING &&
              <Modal backdrop="static" isOpen={true}>
                <div className="image-container">
                  <img src="images/spinner-animation.svg" role="presentation"/>
                </div>
                <FormattedMessage
                  id={ 'publication-create.uploadingYourPublication' }
                  defaultMessage={ 'Uploading your publication' }
                />
                <br />
                <FormattedMessage
                  id={ 'publication-create.pleaseStandBy' }
                  defaultMessage={ 'Please stand by...' }
                />
              </Modal>
            }
            {this.state.step === this.STEP.SUCCESS &&
              <Modal backdrop="static" isOpen={true}>
                <div className="image-container">
                  <img src="images/circular-check-button.svg" role="presentation"/>
                </div>
                <FormattedMessage
                  id={ 'publication-create.successMessage' }
                  defaultMessage={ 'Success' }
                />
                <div className="button-container">
                  <Link to="/" className="btn btn-clear">
                    <FormattedMessage
                      id={ 'publication-create.seeAllPublications' }
                      defaultMessage={ 'See All Publications' }
                    />
                  </Link>
                </div>
              </Modal>
            }
            {this.state.step === this.STEP.ERROR && (
              <Modal backdrop="static" isOpen={true}>
                <div className="image-container">
                  <img src="images/flat_cross_icon.svg" role="presentation" />
                </div>
                <FormattedMessage
                  id={ 'publication-create.error1' }
                  defaultMessage={ 'There was a problem creating this publication.' }
                />
                <br />
                <FormattedMessage
                  id={ 'publication-create.error2' }
                  defaultMessage={ 'See the console for more details.' }
                />
                <div className="button-container">
                  <a
                    className="btn btn-clear"
                    onClick={e => {
                      e.preventDefault()
                      this.resetToPreview()
                    }}
                  >
                    <FormattedMessage
                      id={ 'publication-create.OK' }
                      defaultMessage={ 'OK' }
                    />
                  </a>
                </div>
              </Modal>
            )}
            <div className="row">
              <div className="col-md-7">
                <label className="create-step">
                  <FormattedMessage
                    id={ 'publication-create.stepNumberLabel' }
                    defaultMessage={ 'STEP {stepNumber}' }
                    values={{ stepNumber: Number(this.state.step) }}
                  />
                </label>
                <h2>
                  <FormattedMessage
                    id={ 'publication-create.previewPublicationHeading' }
                    defaultMessage={ 'Preview your publication' }
                  />
                </h2>
              </div>
            </div>
            <div className="row flex-sm-row-reverse">
              <div className="col-md-5">
                <div className="info-box">
                  <div>
                    <h2>
                      <FormattedMessage
                        id={ 'publication-create.whatHappensNextHeading' }
                        defaultMessage={ 'What happens next?' }
                      />
                    </h2>
                    <FormattedMessage
                      id={ 'publication-create.whatHappensNextContent1' }
                      defaultMessage={ 'When you hit submit, a JSON object representing your publication will be published to {ipfsLink}  and the content hash will be published to a publication smart contract running on the Ethereum network.' }
                      values={{ 
                        ipfsLink: <a target="_blank" rel="noopener noreferrer" href="https://ipfs.io">
                          <FormattedMessage
                            id={ 'publication-create.IPFS' }
                            defaultMessage={ 'IPFS' }
                          />
                        </a> 
                      }}
                    />
                    <br/>
                    <br/>
                    <FormattedMessage
                      id={ 'publication-create.whatHappensNextContent2' }
                      defaultMessage={ 'Please review your publication before submitting. Your publication will appear to others just as it looks on the window to the left.' }
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="preview">
                  <PublicationDetail publicationJson={this.state.formPublication.formData} />
                </div>
                <div className="btn-container">
                  <button className="btn btn-other float-left" onClick={() => this.setState({step: this.STEP.DETAILS})}>
                    <FormattedMessage
                      id={ 'publication-create.backButtonLabel' }
                      defaultMessage={ 'Back' }
                    />
                  </button>
                  <button className="btn btn-primary float-right"
                    onClick={() => this.onSubmitPublication(this.state.formPublication, this.state.selectedSchemaType)}>
                    <FormattedMessage
                      id={ 'publication-create.doneButtonLabel' }
                      defaultMessage={ 'Done' }
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  showAlert: (msg) => dispatch(showAlert(msg))
})

export default connect(undefined, mapDispatchToProps)(injectIntl(PublicationCreate))
