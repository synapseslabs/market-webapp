import React, { Component, Fragment } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { setMobile, localizeApp } from 'actions/App'
import { fetchProfile } from 'actions/Profile'
import { init as initWallet } from 'actions/Wallet'

// Components
import Alert from './alert'
import ScrollToTop from './scroll-to-top'
import Layout from './layout'
import Publications from './publications-grid'
import PublicationCreate from './publication-create'
import PublicationDetail from './publication-detail'
import MyPublications from './my-publications'
import MyPurchases from './my-purchases'
import MySales from './my-sales'
import Notifications from './notifications'
import Profile from '../pages/profile/Profile'
import User from '../pages/user/User'
import PurchaseDetail from './purchase-detail'
import Web3Provider from './web3-provider'
import NotFound from './not-found'
import 'bootstrap/dist/js/bootstrap'

// CSS
import 'bootstrap/dist/css/bootstrap.css'
import '../css/lato-web.css'
import '../css/poppins.css'
import '../css/app.css'

const HomePage = () => (
  <div className="container">
    <Publications />
  </div>
)

const PublicationDetailPage = props => (
  <PublicationDetail publicationAddress={props.match.params.publicationAddress} withReviews={true} />
)

const CreatePublicationPage = () => (
  <div className="container">
    <PublicationCreate />
  </div>
)

const PurchaseDetailPage = props => (
  <PurchaseDetail purchaseAddress={props.match.params.purchaseAddress} />
)

const UserPage = props => <User userAddress={props.match.params.userAddress} />

// Top level component
class App extends Component {

  componentWillMount() {
    this.props.localizeApp()
  }

  componentDidMount() {
    this.props.fetchProfile()
    this.props.initWallet()

    this.detectMobile()
  }

  /**
   * Detect if accessing from a mobile browser
   * @return {void}
   */
  detectMobile() {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera

    if (/android/i.test(userAgent)) {
      this.props.setMobile('Android')
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.props.setMobile('iOS')
    } else {
      this.props.setMobile(null)
    }
  }

  render() {
    return this.props.selectedLanguageAbbrev ? (
      <IntlProvider locale={this.props.selectedLanguageAbbrev} messages={this.props.messages} textComponent={Fragment}>
        <Router>
          <ScrollToTop>
            <Web3Provider>
              <Layout>
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  <Route path="/page/:activePage" component={HomePage} />
                  <Route
                    path="/publication/:publicationAddress"
                    component={PublicationDetailPage}
                  />
                  <Route path="/create" component={CreatePublicationPage} />
                  <Route path="/my-publications" component={MyPublications} />
                  <Route
                    path="/purchases/:purchaseAddress"
                    component={PurchaseDetailPage}
                  />
                  <Route path="/my-purchases" component={MyPurchases} />
                  <Route path="/my-sales" component={MySales} />
                  <Route path="/notifications" component={Notifications} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/users/:userAddress" component={UserPage} />
                  <Route component={NotFound} />
                </Switch>
              </Layout>
              <Alert />
            </Web3Provider>
          </ScrollToTop>
        </Router>
      </IntlProvider>
    ) : null // potentially a loading indicator
  }
}

const mapStateToProps = state => ({
  messages: state.app.translations.messages,
  selectedLanguageAbbrev: state.app.translations.selectedLanguageAbbrev
})

const mapDispatchToProps = dispatch => ({
  fetchProfile: () => dispatch(fetchProfile()),
  initWallet: () => dispatch(initWallet()),
  setMobile: device => dispatch(setMobile(device)),
  localizeApp: () => dispatch(localizeApp())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
