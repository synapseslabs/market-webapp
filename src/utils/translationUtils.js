import { addLocaleData, IntlProvider } from 'react-intl'
import translations from '../../translations/translated-messages.json'
import ar from 'react-intl/locale-data/ar'
import bn from 'react-intl/locale-data/bn'
import bs from 'react-intl/locale-data/bs'
import cs from 'react-intl/locale-data/cs'
import da from 'react-intl/locale-data/da'
import de from 'react-intl/locale-data/de'
import el from 'react-intl/locale-data/el'
import en from 'react-intl/locale-data/en'
import eo from 'react-intl/locale-data/eo'
import es from 'react-intl/locale-data/es'
import fr from 'react-intl/locale-data/fr'
import fil from 'react-intl/locale-data/fil'
import he from 'react-intl/locale-data/he'
import hr from 'react-intl/locale-data/hr'
import id from 'react-intl/locale-data/id'
import it from 'react-intl/locale-data/it'
import ja from 'react-intl/locale-data/ja'
import ko from 'react-intl/locale-data/ko'
import lo from 'react-intl/locale-data/lo'
import ms from 'react-intl/locale-data/ms'
import nl from 'react-intl/locale-data/nl'
import pt from 'react-intl/locale-data/pt'
import pl from 'react-intl/locale-data/pl'
import ro from 'react-intl/locale-data/ro'
import ru from 'react-intl/locale-data/ru'
import si from 'react-intl/locale-data/si'
import sr from 'react-intl/locale-data/sr'
import sk from 'react-intl/locale-data/sk'
import te from 'react-intl/locale-data/te'
import th from 'react-intl/locale-data/th'
import tr from 'react-intl/locale-data/tr'
import ug from 'react-intl/locale-data/ug'
import uk from 'react-intl/locale-data/uk'
import ur from 'react-intl/locale-data/ur'
import vi from 'react-intl/locale-data/vi'
import zh from 'react-intl/locale-data/zh'
import schemaMessages from '../schemaMessages/index'
import languageNames from './languageNames.json'

let globalIntlProvider

export function addLocales() {

  // If browser doesn't support Intl (i.e. Safari), then we manually import
  // the intl polyfill and locale data.
  if (!window.Intl) {
    require.ensure([
      'intl',
      'intl/locale-data/jsonp/ar.js',
      'intl/locale-data/jsonp/bn.js',
      'intl/locale-data/jsonp/bs.js',
      'intl/locale-data/jsonp/cs.js',
      'intl/locale-data/jsonp/da.js',
      'intl/locale-data/jsonp/de.js',
      'intl/locale-data/jsonp/el.js',
      'intl/locale-data/jsonp/en.js',
      'intl/locale-data/jsonp/eo.js',
      'intl/locale-data/jsonp/es.js',
      'intl/locale-data/jsonp/fil.js',
      'intl/locale-data/jsonp/fr.js',
      'intl/locale-data/jsonp/he.js',
      'intl/locale-data/jsonp/hr.js',
      'intl/locale-data/jsonp/id.js',
      'intl/locale-data/jsonp/it.js',
      'intl/locale-data/jsonp/lo.js',
      'intl/locale-data/jsonp/ja.js',
      'intl/locale-data/jsonp/ko.js',
      'intl/locale-data/jsonp/ms.js',
      'intl/locale-data/jsonp/nl.js',
      'intl/locale-data/jsonp/pl.js',
      'intl/locale-data/jsonp/pt.js',
      'intl/locale-data/jsonp/ro.js',
      'intl/locale-data/jsonp/ru.js',
      'intl/locale-data/jsonp/si.js',
      'intl/locale-data/jsonp/sr.js',
      'intl/locale-data/jsonp/sk.js',
      'intl/locale-data/jsonp/te.js',
      'intl/locale-data/jsonp/th.js',
      'intl/locale-data/jsonp/tr.js',
      'intl/locale-data/jsonp/ug.js',
      'intl/locale-data/jsonp/uk.js',
      'intl/locale-data/jsonp/ur.js',
      'intl/locale-data/jsonp/vi.js',
      'intl/locale-data/jsonp/zh.js'
    ], (require) => {
      require('intl')
      require('intl/locale-data/jsonp/ar.js')
      require('intl/locale-data/jsonp/bn.js')
      require('intl/locale-data/jsonp/bs.js')
      require('intl/locale-data/jsonp/cs.js')
      require('intl/locale-data/jsonp/da.js')
      require('intl/locale-data/jsonp/de.js')
      require('intl/locale-data/jsonp/el.js')
      require('intl/locale-data/jsonp/en.js')
      require('intl/locale-data/jsonp/eo.js')
      require('intl/locale-data/jsonp/es.js')
      require('intl/locale-data/jsonp/fil.js')
      require('intl/locale-data/jsonp/fr.js')
      require('intl/locale-data/jsonp/he.js')
      require('intl/locale-data/jsonp/hr.js')
      require('intl/locale-data/jsonp/id.js')
      require('intl/locale-data/jsonp/it.js')
      require('intl/locale-data/jsonp/lo.js')
      require('intl/locale-data/jsonp/ja.js')
      require('intl/locale-data/jsonp/ko.js')
      require('intl/locale-data/jsonp/ms.js')
      require('intl/locale-data/jsonp/nl.js')
      require('intl/locale-data/jsonp/pl.js')
      require('intl/locale-data/jsonp/pt.js')
      require('intl/locale-data/jsonp/ro.js')
      require('intl/locale-data/jsonp/ru.js')
      require('intl/locale-data/jsonp/si.js')
      require('intl/locale-data/jsonp/sr.js')
      require('intl/locale-data/jsonp/sk.js')
      require('intl/locale-data/jsonp/te.js')
      require('intl/locale-data/jsonp/th.js')
      require('intl/locale-data/jsonp/tr.js')
      require('intl/locale-data/jsonp/ug.js')
      require('intl/locale-data/jsonp/uk.js')
      require('intl/locale-data/jsonp/ur.js')
      require('intl/locale-data/jsonp/vi.js')
      require('intl/locale-data/jsonp/zh.js')
    })
  }

  addLocaleData([
    ...ar,
    ...bn,
    ...bs,
    ...cs,
    ...da,
    ...de,
    ...el,
    ...en,
    ...eo,
    ...es,
    ...fil,
    ...fr,
    ...he,
    ...hr,
    ...id,
    ...it,
    ...lo,
    ...ja,
    ...ko,
    ...ms,
    ...nl,
    ...pl,
    ...pt,
    ...ro,
    ...ru,
    ...si,
    ...sr,
    ...sk,
    ...te,
    ...th,
    ...tr,
    ...ug,
    ...uk,
    ...ur,
    ...vi,
    ...zh])
}

export function getLangFullName(langAbbrev) {
  const langNameObj = languageNames.filter((lang) => lang.code === langAbbrev)
  return langNameObj[0] && langNameObj[0].nativeName
}

export function getAvailableLanguages() {
  if (!translations || typeof translations !== 'object') {
    return [];
  }

  const availableLangs = []

  for (let languageAbbrev in translations) {

    // Don't include English b/c we hard-code it in the footer dropdown to make sure it's always available
    if (languageAbbrev !== 'en') {

      availableLangs.push({
        selectedLanguageAbbrev: languageAbbrev,
        selectedLanguageFull: getLangFullName(languageAbbrev)
      })

    }
  }

  return availableLangs
}

export function setGlobalIntlProvider(language, messages) {
  const { intl } = new IntlProvider({ locale: language, messages: messages }, {}).getChildContext()
  globalIntlProvider = intl
}

export function GlobalIntlProvider() {
  return globalIntlProvider
}

export function translateSchema(schemaJson, schemaType) {
  // Copy the schema so we don't modify the synapsesal
  const schema = JSON.parse(JSON.stringify(schemaJson))
  const properties = schema.properties
  schemaType = schemaType === 'for-sale' ? 'forSale' : schemaType

  if (schema.description) {

    schema.description = globalIntlProvider.formatMessage(schemaMessages[schemaType][schema.description])

  }

  for (let property in properties) {
    const propertyObj = properties[property]

    if (propertyObj.title) {

      propertyObj.title = globalIntlProvider.formatMessage(schemaMessages[schemaType][propertyObj.title])

    }

    if (propertyObj.default && typeof propertyObj.default === 'number') {

      propertyObj.default = globalIntlProvider.formatMessage(schemaMessages[schemaType][propertyObj.default])

    }


    if (propertyObj.enum && propertyObj.enum.length) {

      propertyObj.enumNames = propertyObj.enum.map((enumStr) => (
        typeof enumStr === 'string' ? globalIntlProvider.formatMessage(schemaMessages[schemaType][enumStr]) : enumStr
      ))

    }    
  }

  return schema
}

export function translatePublicationCategory(publicationObj) {
  // Copy the schema so we don't modify the synapsesal
  const publication = JSON.parse(JSON.stringify(publicationObj))
  const category = publication.category

  // Check to see if category is a react-intl ID
  if (/schema\./.test(category)) {

    // loop over all schemaMessages to find the correct ID
    for (let schemaType in schemaMessages) {
      if (schemaMessages[schemaType][category]) {
        publication.category = globalIntlProvider.formatMessage(schemaMessages[schemaType][category])
      }
    }
  }

  return publication
}
